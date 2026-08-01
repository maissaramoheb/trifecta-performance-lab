"use client";

import { useMemo, useState } from "react";
import { b, type Bi, type Lang } from "../lib/content";
import type { CurriculumSuiteStore, DrillEntity, TrifectaPillar } from "../lib/curriculum-builder-types";
import { PageHeader } from "./ui/PageHeader";
import { WorkspaceShell } from "./ui/WorkspaceShell";
import { StatusBanner } from "./ui/StatusBanner";
import { EvidenceBadge } from "./ui/EvidenceBadge";

const local = (value: Bi | string, lang: Lang) =>
  typeof value === "string" ? value : value[lang];

type DrillBuilderProps = {
  lang: Lang;
  store: CurriculumSuiteStore;
  onUpdateDrill: (updated: DrillEntity) => void;
  onDeleteRequest: (drillId: string) => void;
  onNextTab: () => void;
};

export function DrillBuilder({
  lang,
  store,
  onUpdateDrill,
  onDeleteRequest,
  onNextTab,
}: DrillBuilderProps) {
  const currentDrill = useMemo(() => {
    return store.drills.find((d) => d.id === store.activeDrillId) ?? store.drills[0];
  }, [store.drills, store.activeDrillId]);

  const [activeLens, setActiveLens] = useState<TrifectaPillar>("Technical");

  if (!currentDrill) return null;

  const setBi = (key: keyof DrillEntity, langKey: "ar" | "en", text: string) => {
    const val = currentDrill[key] as Bi;
    const nextBi = typeof val === "object" ? { ...val, [langKey]: text } : { ar: text, en: text };
    onUpdateDrill({
      ...currentDrill,
      [key]: nextBi,
      updatedAt: new Date().toISOString(),
    });
  };

  const warnings: string[] = [];
  if (!currentDrill.title.ar.trim()) {
    warnings.push(local(b("اسم الـDrill مطلوب.", "Drill title is required."), lang));
  }
  if (!currentDrill.condition.ar.trim()) {
    warnings.push(local(b("شرط الأداء غير محدد.", "Performance condition is required."), lang));
  }
  if (!currentDrill.standard.ar.trim()) {
    warnings.push(local(b("المعيار الأدنى للأداء غير محدد.", "Minimum performance standard is required."), lang));
  }

  const isValid = warnings.length === 0;

  const parentStation = store.stations.find((s) => s.id === currentDrill.stationId);

  const labels = {
    ar: {
      eyebrow: "Drill Builder · تصميم النشاط",
      title: "صمّم الـDrill ودليل الأداء الملاحظ",
      intro: "حدد الهدف التشغيلي للـDrill، الشروط المحيطة، المعيار الأدنى، وأبعاد الـTrifecta المترابطة.",
      titleAr: "عنوان الـDrill — بالعربية",
      titleEn: "Drill Title — English",
      parentStation: "المحطة التابعة (Parent Station)",
      objective: "الهدف التشغيلي للـDrill",
      condition: "الشرط والظروف المحيطة",
      standard: "المعيار الأدنى للتأهل",
      domain: "Learning Domain",
      primaryPillar: "البُعد الرئيسي في الـTrifecta",
      equipment: "المعدات والوسائل المطلوبة",
      instructorActions: "إجراءات المدرب/المقيّم",
      learnerActions: "إجراءات وسلوكيات المتدرب",
      safetyControls: "ضوابط وإجراءات الأمان",
      criticalFailures: "Critical Safety Failures (الفشل الحرج)",
      evidenceToCollect: "الدليل المطلوب جمعه",
      assessmentMethod: "طريقة التقييم",
      repsDuration: "التكرارات أو المدة الزمنية",
      remediationOptions: "خيارات المعالجة قبل الـRetest",
      pillarWeights: "أوزان الـTrifecta للـDrill (بدني / فني / ذهني)",
      previewHeader: "بطاقة الـDrill التفاعلية",
      nextTabBtn: "الانتقال إلى Gate Builder ←",
      deleteBtn: "حذف هذا الـDrill",
    },
    en: {
      eyebrow: "Drill Builder · Activity Design",
      title: "Design Drill & Observable Evidence",
      intro: "Define the operational drill objective, conditions, minimum standard, and Trifecta dimensions.",
      titleAr: "Drill Title — Arabic",
      titleEn: "Drill Title — English",
      parentStation: "Parent Station",
      objective: "Operational Objective",
      condition: "Conditions & Environment",
      standard: "Minimum Passing Standard",
      domain: "Learning Domain",
      primaryPillar: "Primary Trifecta Pillar",
      equipment: "Required Equipment",
      instructorActions: "Instructor Actions",
      learnerActions: "Learner Actions",
      safetyControls: "Safety Controls",
      criticalFailures: "Critical Safety Failures",
      evidenceToCollect: "Evidence to Collect",
      assessmentMethod: "Assessment Method",
      repsDuration: "Repetitions or Duration",
      remediationOptions: "Remediation Options",
      pillarWeights: "Trifecta Weighting (Physical / Technical / Cognitive)",
      previewHeader: "Interactive Drill Card Preview",
      nextTabBtn: "Continue to Gate Builder →",
      deleteBtn: "Delete This Drill",
    },
  }[lang];

  return (
    <div>
      <PageHeader eyebrow={labels.eyebrow} title={labels.title} intro={labels.intro} />

      <WorkspaceShell
        label={local(b("مراحل بناء الـDrill", "Drill Building Stages"), lang)}
        steps={[
          local(b("الهدف والشرط", "Objective & Condition"), lang),
          local(b("أبعاد الـTrifecta", "Trifecta Dimensions"), lang),
          local(b("إجراءات الأمان والدليل", "Safety & Evidence"), lang),
          local(b("المعايير والاعتماد", "Standard & Approval"), lang),
        ]}
        activeStep={isValid ? 3 : 1}
        summary={
          <>
            <strong>{local(currentDrill.title, lang)}</strong>
            <span>{currentDrill.primaryPillar} · {currentDrill.domain}</span>
          </>
        }
        form={
          <form className="builder-card dense" onSubmit={(e) => e.preventDefault()}>
            <div className="field-row">
              <label>
                {labels.titleAr}
                <input
                  dir="rtl"
                  value={currentDrill.title.ar}
                  onChange={(e) => setBi("title", "ar", e.target.value)}
                />
              </label>
              <label>
                {labels.titleEn}
                <input
                  dir="ltr"
                  value={currentDrill.title.en}
                  onChange={(e) => setBi("title", "en", e.target.value)}
                />
              </label>
            </div>

            <div className="field-row thirds">
              <label>
                {labels.parentStation}
                <select
                  value={currentDrill.stationId}
                  onChange={(e) => onUpdateDrill({ ...currentDrill, stationId: e.target.value, updatedAt: new Date().toISOString() })}
                >
                  {store.stations.map((s) => (
                    <option key={s.id} value={s.id}>
                      {local(s.name, lang)}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                {labels.domain}
                <select
                  value={currentDrill.domain}
                  onChange={(e) => onUpdateDrill({ ...currentDrill, domain: e.target.value as DrillEntity["domain"], updatedAt: new Date().toISOString() })}
                >
                  <option value="Cognitive">Cognitive</option>
                  <option value="Psychomotor">Psychomotor</option>
                  <option value="Affective">Affective</option>
                </select>
              </label>

              <label>
                {labels.primaryPillar}
                <select
                  value={currentDrill.primaryPillar}
                  onChange={(e) => onUpdateDrill({ ...currentDrill, primaryPillar: e.target.value as TrifectaPillar, updatedAt: new Date().toISOString() })}
                >
                  <option value="Physical">Physical</option>
                  <option value="Technical">Technical</option>
                  <option value="Cognitive">Cognitive</option>
                </select>
              </label>
            </div>

            <div className="field-row">
              <label>
                {labels.objective}
                <textarea
                  dir="auto"
                  value={currentDrill.purpose.ar}
                  onChange={(e) => setBi("purpose", "ar", e.target.value)}
                />
              </label>
              <label>
                {labels.condition}
                <textarea
                  dir="auto"
                  value={currentDrill.condition.ar}
                  onChange={(e) => setBi("condition", "ar", e.target.value)}
                />
              </label>
            </div>

            <div className="field-row thirds">
              <label>
                {local(b("المتطلب البدني", "Physical Requirement"), lang)}
                <input
                  dir="auto"
                  value={currentDrill.physicalRequirement.ar}
                  onChange={(e) => setBi("physicalRequirement", "ar", e.target.value)}
                />
              </label>
              <label>
                {local(b("المتطلب الفني", "Technical Requirement"), lang)}
                <input
                  dir="auto"
                  value={currentDrill.technicalRequirement.ar}
                  onChange={(e) => setBi("technicalRequirement", "ar", e.target.value)}
                />
              </label>
              <label>
                {local(b("المتطلب الذهني", "Cognitive Requirement"), lang)}
                <input
                  dir="auto"
                  value={currentDrill.cognitiveRequirement.ar}
                  onChange={(e) => setBi("cognitiveRequirement", "ar", e.target.value)}
                />
              </label>
            </div>

            <div className="field-row">
              <label>
                {labels.instructorActions}
                <textarea
                  dir="auto"
                  value={currentDrill.instructorActions.ar}
                  onChange={(e) => setBi("instructorActions", "ar", e.target.value)}
                />
              </label>
              <label>
                {labels.learnerActions}
                <textarea
                  dir="auto"
                  value={currentDrill.learnerActions.ar}
                  onChange={(e) => setBi("learnerActions", "ar", e.target.value)}
                />
              </label>
            </div>

            <div className="field-row">
              <label>
                {labels.safetyControls}
                <textarea
                  dir="auto"
                  value={currentDrill.safetyControls.ar}
                  onChange={(e) => setBi("safetyControls", "ar", e.target.value)}
                />
              </label>
              <label>
                {labels.criticalFailures}
                <textarea
                  dir="auto"
                  value={currentDrill.criticalFailures.ar}
                  onChange={(e) => setBi("criticalFailures", "ar", e.target.value)}
                />
              </label>
            </div>

            <div className="field-row thirds">
              <label>
                {labels.evidenceToCollect}
                <input
                  dir="auto"
                  value={currentDrill.evidenceToCollect.ar}
                  onChange={(e) => setBi("evidenceToCollect", "ar", e.target.value)}
                />
              </label>
              <label>
                {labels.repsDuration}
                <input
                  dir="auto"
                  value={currentDrill.repetitionsOrDuration.ar}
                  onChange={(e) => setBi("repetitionsOrDuration", "ar", e.target.value)}
                />
              </label>
              <label>
                {labels.remediationOptions}
                <input
                  dir="auto"
                  value={currentDrill.remediationOptions.ar}
                  onChange={(e) => setBi("remediationOptions", "ar", e.target.value)}
                />
              </label>
            </div>

            <div className="field-section">
              <span className="mini-label">{labels.pillarWeights}</span>
              <div className="field-row thirds">
                <label>
                  Physical: {currentDrill.pillarWeights.physical}%
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={currentDrill.pillarWeights.physical}
                    onChange={(e) =>
                      onUpdateDrill({
                        ...currentDrill,
                        pillarWeights: { ...currentDrill.pillarWeights, physical: Number(e.target.value) },
                        updatedAt: new Date().toISOString(),
                      })
                    }
                  />
                </label>

                <label>
                  Technical: {currentDrill.pillarWeights.technical}%
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={currentDrill.pillarWeights.technical}
                    onChange={(e) =>
                      onUpdateDrill({
                        ...currentDrill,
                        pillarWeights: { ...currentDrill.pillarWeights, technical: Number(e.target.value) },
                        updatedAt: new Date().toISOString(),
                      })
                    }
                  />
                </label>

                <label>
                  Cognitive: {currentDrill.pillarWeights.cognitive}%
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={currentDrill.pillarWeights.cognitive}
                    onChange={(e) =>
                      onUpdateDrill({
                        ...currentDrill,
                        pillarWeights: { ...currentDrill.pillarWeights, cognitive: Number(e.target.value) },
                        updatedAt: new Date().toISOString(),
                      })
                    }
                  />
                </label>
              </div>
            </div>

            <div className="builder-actions-row">
              <button
                type="button"
                className="secondary-danger"
                onClick={() => onDeleteRequest(currentDrill.id)}
              >
                {labels.deleteBtn}
              </button>
            </div>
          </form>
        }
        preview={
          <aside className="output-card">
            <div className="card-top">
              <EvidenceBadge type={isValid ? "safe" : "danger"}>
                {isValid ? local(b("Drill مكتمل", "Valid Drill"), lang) : local(b("بيانات ناقصة", "Incomplete Data"), lang)}
              </EvidenceBadge>
              <span>{parentStation ? local(parentStation.name, lang) : "Unassigned"}</span>
            </div>

            <h2>{labels.previewHeader}</h2>

            {!isValid && (
              <ul className="warning-list">
                {warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            )}

            {isValid && (
              <StatusBanner
                type="success"
                message={local(b("تفاصيل الـDrill مكتملة وجاهزة للربط بالـGate.", "Drill specification complete and ready for Gate linking."), lang)}
              />
            )}

            <div className="segmented compact" style={{ marginBottom: "1rem" }}>
              <button
                type="button"
                aria-pressed={activeLens === "Physical"}
                onClick={() => setActiveLens("Physical")}
              >
                Physical ({currentDrill.pillarWeights.physical}%)
              </button>
              <button
                type="button"
                aria-pressed={activeLens === "Technical"}
                onClick={() => setActiveLens("Technical")}
              >
                Technical ({currentDrill.pillarWeights.technical}%)
              </button>
              <button
                type="button"
                aria-pressed={activeLens === "Cognitive"}
                onClick={() => setActiveLens("Cognitive")}
              >
                Cognitive ({currentDrill.pillarWeights.cognitive}%)
              </button>
            </div>

            <dl className="station-dl">
              <div>
                <dt>{local(b("عنوان الـDrill", "Title"), lang)}</dt>
                <dd>{local(currentDrill.title, lang)}</dd>
              </div>
              <div>
                <dt>{local(b("العدسة النشطة", "Active Lens"), lang)} ({activeLens})</dt>
                <dd>
                  {activeLens === "Physical" && local(currentDrill.physicalRequirement, lang)}
                  {activeLens === "Technical" && local(currentDrill.technicalRequirement, lang)}
                  {activeLens === "Cognitive" && local(currentDrill.cognitiveRequirement, lang)}
                </dd>
              </div>
              <div>
                <dt>{local(b("الشرط والملاحظة", "Condition & Evidence"), lang)}</dt>
                <dd>{local(currentDrill.condition, lang)} · {local(currentDrill.evidenceToCollect, lang)}</dd>
              </div>
              <div>
                <dt>{local(b("الفشل الحرج", "Critical Failure"), lang)}</dt>
                <dd>{local(currentDrill.criticalFailures, lang)}</dd>
              </div>
            </dl>

            <button type="button" className="primary" onClick={onNextTab}>
              {labels.nextTabBtn}
            </button>
          </aside>
        }
      />
    </div>
  );
}
