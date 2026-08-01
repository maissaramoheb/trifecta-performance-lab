"use client";

import { useMemo } from "react";
import { b, type Bi, type Lang } from "../lib/content";
import type { CurriculumSuiteStore, StationEntity } from "../lib/curriculum-builder-types";
import { PageHeader } from "./ui/PageHeader";
import { WorkspaceShell } from "./ui/WorkspaceShell";
import { StatusBanner } from "./ui/StatusBanner";
import { EvidenceBadge } from "./ui/EvidenceBadge";

const local = (value: Bi | string, lang: Lang) =>
  typeof value === "string" ? value : value[lang];

type StationBuilderProps = {
  lang: Lang;
  store: CurriculumSuiteStore;
  onUpdateStation: (updated: StationEntity) => void;
  onDeleteRequest: (stationId: string) => void;
  onPrevTab?: () => void;
  onNextTab?: () => void;
  isStandalone?: boolean;
};

export function StationBuilder({
  lang,
  store,
  onUpdateStation,
  onDeleteRequest,
  onPrevTab,
  onNextTab,
  isStandalone = false,
}: StationBuilderProps) {
  const currentStation = useMemo(() => {
    return store.stations.find((s) => s.id === store.activeStationId) ?? store.stations[0];
  }, [store.stations, store.activeStationId]);

  if (!currentStation) return null;

  const setBi = (key: keyof StationEntity, langKey: "ar" | "en", text: string) => {
    const val = currentStation[key] as Bi;
    const nextBi = typeof val === "object" ? { ...val, [langKey]: text } : { ar: text, en: text };
    onUpdateStation({
      ...currentStation,
      [key]: nextBi,
      updatedAt: new Date().toISOString(),
    });
  };

  const setVal = <K extends keyof StationEntity>(key: K, value: StationEntity[K]) => {
    onUpdateStation({
      ...currentStation,
      [key]: value,
      updatedAt: new Date().toISOString(),
    });
  };

  const variableCount = currentStation.variables.ar.split(/[,،\n]/).filter(Boolean).length;
  const attachedDrills = store.drills.filter((d) => currentStation.drillIds.includes(d.id) || d.stationId === currentStation.id);
  const attachedGate = store.gates.find((g) => g.id === currentStation.gateId || g.fromStationId === currentStation.id);

  const warnings: Bi[] = [];
  if (!currentStation.baseline.ar.trim()) {
    warnings.push(b("لا يوجد Baseline محدد.", "No baseline is defined."));
  }
  if (variableCount > 2) {
    warnings.push(b("متغيرات كثيرة مضافة معًا؛ لن تعرف أول نقطة انهيار.", "Too many variables added together; first breakdown will be unclear."));
  }
  if (!currentStation.safetyGate && currentStation.criticalFailures.ar.trim()) {
    warnings.push(b("لا يجوز أن تعوض الدرجة الكلية Critical Safety Failure.", "Total score cannot compensate for a Critical Safety Failure."));
  }

  const activeStep = !currentStation.name.ar || !currentStation.requirement.ar ? 0
    : !currentStation.baseline.ar ? 1
    : !currentStation.behaviour.ar || !currentStation.checklist.ar ? 2
    : 3;

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), ...currentStation }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `station-${currentStation.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const parentLevel = store.levels.find((l) => l.id === currentStation.levelId);

  const labels = {
    ar: {
      eyebrow: "Station Builder · تصميم المحطة",
      title: "صمّم محطة تقيس ما تقصده",
      intro: "اعزل المتغيرات، ابدأ من Baseline، واربط كل تشخيص بدليل تجمعه فعلًا.",
      nameAr: "اسم المحطة — بالعربية",
      nameEn: "اسم المحطة — بالإنجلیزية",
      parentLevel: "المستوى التابع له (Parent Level)",
      reqAr: "متطلب الأداء التشغيلي",
      reqEn: "Performance Requirement — English",
      baselineAr: "الشرط الأساسي (Baseline)",
      variablesAr: "المتغيرات المضافة (افصل بفاصلة)",
      timePressure: "ضغط الوقت",
      cognitiveLoad: "Cognitive Load",
      physicalLoad: "الحمل البدني",
      behaviourAr: "السلوك الملاحظ",
      checklistAr: "Checklist وبنود الملاحظة",
      criticalAr: "Critical Safety Failures",
      standardAr: "معيار Go / No-Go",
      dataAr: "البيانات التي ستجمعها",
      aarAr: "أسئلة AAR والتحليل",
      remediationAr: "خطة المعالجة",
      retestAr: "قاعدة إعادة الاختبار (Retest Rule)",
      safetyGateLabel: "Critical Safety Gate (الفشل الحرج ينتج No-Go دائمًا)",
      previewHeader: "بطاقة المحطة الهيكلية",
      printBtn: "طباعة / حفظ PDF",
      downloadBtn: "تصدير JSON",
      prevBtn: "← العودة إلى Level Builder",
      nextBtn: "الانتقال إلى Drill Builder →",
      deleteBtn: "حذف هذه المحطة",
    },
    en: {
      eyebrow: "Station Builder · Station Design",
      title: "Design a Station that Measures Intended Performance",
      intro: "Isolate variables, start from baseline, and link diagnosis to collected data.",
      nameAr: "Station Name — Arabic",
      nameEn: "Station Name — English",
      parentLevel: "Parent Level",
      reqAr: "Performance Requirement — Arabic",
      reqEn: "Performance Requirement — English",
      baselineAr: "Baseline Condition",
      variablesAr: "Variables Added (comma-separated)",
      timePressure: "Time Pressure",
      cognitiveLoad: "Cognitive Load",
      physicalLoad: "Physical Load",
      behaviourAr: "Observable Behaviour",
      checklistAr: "Checklist Items",
      criticalAr: "Critical Safety Failures",
      standardAr: "Go / No-Go Standard",
      dataAr: "Data to Collect",
      aarAr: "AAR Questions",
      remediationAr: "Remediation",
      retestAr: "Retest Rule",
      safetyGateLabel: "Critical Safety Gate (Critical Failure always produces No-Go)",
      previewHeader: "Station Card Preview",
      printBtn: "Print / Save PDF",
      downloadBtn: "Export JSON",
      prevBtn: "← Back to Level Builder",
      nextBtn: "Continue to Drill Builder →",
      deleteBtn: "Delete This Station",
    },
  }[lang];

  return (
    <div>
      <PageHeader eyebrow={labels.eyebrow} title={labels.title} intro={labels.intro} />

      <WorkspaceShell
        label={local(b("مراحل تصميم المحطة", "Station-design stages"), lang)}
        steps={[
          local(b("المتطلب", "Requirement"), lang),
          local(b("Baseline والحمل", "Baseline & Load"), lang),
          local(b("الدليل والمعيار", "Evidence & Standard"), lang),
          local(b("Gate وRetest", "Gate & Retest"), lang),
        ]}
        activeStep={activeStep}
        summary={
          <>
            <strong>{local(currentStation.name, lang)}</strong>
            <span>{warnings.length ? `${warnings.length} ${local(b("تنبيهات", "warnings"), lang)}` : local(b("مكتمل", "Complete"), lang)}</span>
          </>
        }
        form={
          <form className="builder-card dense" onSubmit={(e) => e.preventDefault()}>
            <div className="field-row">
              <label>
                {labels.nameAr}
                <input
                  dir="rtl"
                  value={currentStation.name.ar}
                  onChange={(e) => setBi("name", "ar", e.target.value)}
                />
              </label>
              <label>
                {labels.nameEn}
                <input
                  dir="ltr"
                  value={currentStation.name.en}
                  onChange={(e) => setBi("name", "en", e.target.value)}
                />
              </label>
            </div>

            <div className="field-row thirds">
              <label>
                {labels.parentLevel}
                <select
                  value={currentStation.levelId}
                  onChange={(e) => setVal("levelId", e.target.value)}
                >
                  {store.levels.map((l) => (
                    <option key={l.id} value={l.id}>
                      {local(l.name, lang)}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Learning Domain
                <select
                  value={currentStation.domain}
                  onChange={(e) => setVal("domain", e.target.value as StationEntity["domain"])}
                >
                  <option value="Cognitive">Cognitive</option>
                  <option value="Psychomotor">Psychomotor</option>
                  <option value="Affective">Affective</option>
                </select>
              </label>

              <label>
                Trifecta Primary
                <select
                  value={currentStation.primaryPillar}
                  onChange={(e) => setVal("primaryPillar", e.target.value as StationEntity["primaryPillar"])}
                >
                  <option value="Physical">Physical</option>
                  <option value="Technical">Technical</option>
                  <option value="Cognitive">Cognitive</option>
                </select>
              </label>
            </div>

            <div className="field-row">
              <label>
                {labels.reqAr}
                <textarea
                  dir="auto"
                  value={currentStation.requirement.ar}
                  onChange={(e) => setBi("requirement", "ar", e.target.value)}
                />
              </label>
              <label>
                {labels.baselineAr}
                <textarea
                  dir="auto"
                  value={currentStation.baseline.ar}
                  onChange={(e) => setBi("baseline", "ar", e.target.value)}
                />
              </label>
            </div>

            <div className="field-row thirds">
              <label>
                {labels.variablesAr}
                <input
                  dir="auto"
                  value={currentStation.variables.ar}
                  onChange={(e) => setBi("variables", "ar", e.target.value)}
                />
              </label>
              <label>
                {labels.timePressure}
                <input
                  dir="auto"
                  value={currentStation.timePressure.ar}
                  onChange={(e) => setBi("timePressure", "ar", e.target.value)}
                />
              </label>
              <label>
                {labels.cognitiveLoad}
                <input
                  dir="auto"
                  value={currentStation.cognitiveLoad.ar}
                  onChange={(e) => setBi("cognitiveLoad", "ar", e.target.value)}
                />
              </label>
            </div>

            <div className="field-row">
              <label>
                {labels.behaviourAr}
                <textarea
                  dir="auto"
                  value={currentStation.behaviour.ar}
                  onChange={(e) => setBi("behaviour", "ar", e.target.value)}
                />
              </label>
              <label>
                {labels.checklistAr}
                <textarea
                  dir="auto"
                  value={currentStation.checklist.ar}
                  onChange={(e) => setBi("checklist", "ar", e.target.value)}
                />
              </label>
            </div>

            <div className="field-row">
              <label>
                {labels.criticalAr}
                <textarea
                  dir="auto"
                  value={currentStation.criticalFailures.ar}
                  onChange={(e) => setBi("criticalFailures", "ar", e.target.value)}
                />
              </label>
              <label>
                {labels.standardAr}
                <textarea
                  dir="auto"
                  value={currentStation.standard.ar}
                  onChange={(e) => setBi("standard", "ar", e.target.value)}
                />
              </label>
            </div>

            <div className="field-row thirds">
              <label>
                {labels.dataAr}
                <input
                  dir="auto"
                  value={currentStation.dataToCollect.ar}
                  onChange={(e) => setBi("dataToCollect", "ar", e.target.value)}
                />
              </label>
              <label>
                {labels.remediationAr}
                <input
                  dir="auto"
                  value={currentStation.remediation.ar}
                  onChange={(e) => setBi("remediation", "ar", e.target.value)}
                />
              </label>
              <label>
                {labels.retestAr}
                <input
                  dir="auto"
                  value={currentStation.retestRule.ar}
                  onChange={(e) => setBi("retestRule", "ar", e.target.value)}
                />
              </label>
            </div>

            <label className="gate-toggle">
              <input
                type="checkbox"
                checked={currentStation.safetyGate}
                onChange={(e) => setVal("safetyGate", e.target.checked)}
              />
              <span>
                <strong>{labels.safetyGateLabel}</strong>
              </span>
            </label>

            <div className="builder-actions-row">
              <button
                type="button"
                className="secondary-danger"
                onClick={() => onDeleteRequest(currentStation.id)}
              >
                {labels.deleteBtn}
              </button>
            </div>
          </form>
        }
        preview={
          <aside className="station-preview">
            <div className="card-top">
              <EvidenceBadge type={currentStation.safetyGate ? "safe" : "danger"}>
                {variableCount} {local(b("متغيرات", "variables"), lang)}
              </EvidenceBadge>
              <span>{parentLevel ? local(parentLevel.name, lang) : "Level"}</span>
            </div>

            <h2>{local(currentStation.name, lang) || labels.previewHeader}</h2>

            {warnings.length > 0 ? (
              <ul className="warning-list">
                {warnings.map((w, i) => (
                  <li key={i}>{local(w, lang)}</li>
                ))}
              </ul>
            ) : (
              <StatusBanner
                type="success"
                message={local(b("المنطق الأساسي للمحطة مكتمل.", "Core station logic is complete."), lang)}
              />
            )}

            <dl className="station-dl">
              <div>
                <dt>{local(b("المتطلب", "Requirement"), lang)}</dt>
                <dd>{local(currentStation.requirement, lang) || "—"}</dd>
              </div>
              <div>
                <dt>Baseline</dt>
                <dd>{local(currentStation.baseline, lang) || "—"}</dd>
              </div>
              <div>
                <dt>{local(b("الأطر المدمجة", "Frameworks"), lang)}</dt>
                <dd>{currentStation.domain} ➔ {currentStation.primaryPillar}</dd>
              </div>
              <div>
                <dt>{local(b("الـDrills المرفقة", "Linked Drills"), lang)}</dt>
                <dd>
                  {attachedDrills.length > 0
                    ? attachedDrills.map((d) => local(d.title, lang)).join(" · ")
                    : "—"}
                </dd>
              </div>
              <div>
                <dt>Gate</dt>
                <dd>{attachedGate ? local(attachedGate.requirement, lang) : "—"}</dd>
              </div>
            </dl>

            <div className="gate-result">
              <span>{currentStation.criticalFailures.ar ? "CRITICAL" : "GATE"}</span>
              <strong>
                {currentStation.safetyGate
                  ? local(b("غير قابل للتعويض", "NON-COMPENSABLE"), lang)
                  : local(b("منطق غير آمن", "UNSAFE LOGIC"), lang)}
              </strong>
            </div>

            <div className="button-row">
              <button type="button" className="secondary" onClick={() => window.print()}>
                {labels.printBtn}
              </button>
              <button type="button" className="secondary" onClick={exportJson}>
                {labels.downloadBtn}
              </button>
            </div>

            {!isStandalone && (
              <div className="button-row" style={{ marginTop: "1rem" }}>
                {onPrevTab && (
                  <button type="button" className="secondary" onClick={onPrevTab}>
                    {labels.prevBtn}
                  </button>
                )}
                {onNextTab && (
                  <button type="button" className="primary" onClick={onNextTab}>
                    {labels.nextBtn}
                  </button>
                )}
              </div>
            )}
          </aside>
        }
      />
    </div>
  );
}
