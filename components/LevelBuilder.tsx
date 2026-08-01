"use client";

import { useMemo } from "react";
import { b, type Bi, type Lang } from "../lib/content";
import type { CurriculumSuiteStore, LevelEntity } from "../lib/curriculum-builder-types";
import { PageHeader } from "./ui/PageHeader";
import { WorkspaceShell } from "./ui/WorkspaceShell";
import { StatusBanner } from "./ui/StatusBanner";
import { EvidenceBadge } from "./ui/EvidenceBadge";

const local = (value: Bi | string, lang: Lang) =>
  typeof value === "string" ? value : value[lang];

type LevelBuilderProps = {
  lang: Lang;
  store: CurriculumSuiteStore;
  onUpdateLevel: (updated: LevelEntity) => void;
  onDeleteRequest: (levelId: string) => void;
  onNextTab: () => void;
};

export function LevelBuilder({
  lang,
  store,
  onUpdateLevel,
  onDeleteRequest,
  onNextTab,
}: LevelBuilderProps) {
  const currentLevel = useMemo(() => {
    return store.levels.find((l) => l.id === store.activeLevelId) ?? store.levels[0];
  }, [store.levels, store.activeLevelId]);

  if (!currentLevel) {
    return null;
  }

  const setBi = (key: keyof LevelEntity, langKey: "ar" | "en", text: string) => {
    const val = currentLevel[key] as Bi;
    const nextBi = typeof val === "object" ? { ...val, [langKey]: text } : { ar: text, en: text };
    onUpdateLevel({
      ...currentLevel,
      [key]: nextBi,
      updatedAt: new Date().toISOString(),
    });
  };

  const attachedStations = store.stations.filter(
    (s) => currentLevel.stationIds.includes(s.id) || s.levelId === currentLevel.id,
  );

  const warnings: string[] = [];
  if (attachedStations.length === 0) {
    warnings.push(local(b("المستوى يتطلب محطة واحدة على الأقل ليكتمل.", "Level requires at least one station to be complete."), lang));
  }
  if (!currentLevel.name.ar.trim() || !currentLevel.name.en.trim()) {
    warnings.push(local(b("اسم المستوى يتطلب الصياغة بالعربية والإنجلیزية.", "Level name requires Arabic and English wording."), lang));
  }
  if (!currentLevel.purpose.ar.trim()) {
    warnings.push(local(b("هدف المستوى غير محدد.", "Level purpose is not defined."), lang));
  }

  const isValid = warnings.length === 0;

  const toggleStationLink = (stationId: string) => {
    const currentSet = new Set(currentLevel.stationIds);
    if (currentSet.has(stationId)) {
      currentSet.delete(stationId);
    } else {
      currentSet.add(stationId);
    }
    onUpdateLevel({
      ...currentLevel,
      stationIds: Array.from(currentSet),
      updatedAt: new Date().toISOString(),
    });
  };

  const labels = {
    ar: {
      eyebrow: "Level Builder · المستوى الأول",
      title: "صمّم المستوى والمسار التدريبي",
      intro: "حدد الهدف التشغيلي للمستوى، المحطات المشمولة، وشروط الانتقال المبنية على الأدلة.",
      levelTitleAr: "اسم المستوى — بالعربية",
      levelTitleEn: "اسم المستوى — بالإنجلیزية",
      purposeAr: "هدف المستوى والتطوير المطلوب",
      purposeEn: "Level Purpose & Target Outcome",
      audienceAr: "الفئة المستهدفة",
      prereqsAr: "المتطلبات السابقة",
      expectedPerf: "مستوى الأداء المتوقع",
      progressionLogic: "منطق الانتقال والمعايير",
      entryCriteria: "شروط الدخول والـBaseline",
      completionCriteria: "شروط إكمال المستوى",
      evidenceExpectations: "توقعات الأدلة الملاحظة",
      duration: "المدة الزمنية التقديرية",
      notes: "ملاحظات المدرب والمقيم",
      attachedStationsLabel: "المحطات المرفقة بهذا المستوى",
      previewHeader: "معاينة بطاقة المستوى",
      nextTabBtn: "الانتقال إلى Station Builder ←",
      deleteBtn: "حذف هذا المستوى",
    },
    en: {
      eyebrow: "Level Builder · Level 1",
      title: "Design Level & Training Pathway",
      intro: "Define the operational level outcome, included stations, and evidence-based progression rules.",
      levelTitleAr: "Level Name — Arabic",
      levelTitleEn: "Level Name — English",
      purposeAr: "Level Purpose — Arabic",
      purposeEn: "Level Purpose — English",
      audienceAr: "Target Audience",
      prereqsAr: "Prerequisites",
      expectedPerf: "Expected Performance Level",
      progressionLogic: "Progression Logic & Rules",
      entryCriteria: "Entry Criteria & Baseline",
      completionCriteria: "Completion Criteria",
      evidenceExpectations: "Evidence Expectations",
      duration: "Estimated Duration",
      notes: "Instructor Notes",
      attachedStationsLabel: "Stations Linked to this Level",
      previewHeader: "Level Spec Preview",
      nextTabBtn: "Continue to Station Builder →",
      deleteBtn: "Delete This Level",
    },
  }[lang];

  const activeStep = attachedStations.length === 0 ? 0 : isValid ? 3 : 1;

  return (
    <div>
      <PageHeader eyebrow={labels.eyebrow} title={labels.title} intro={labels.intro} />

      <WorkspaceShell
        label={local(b("مراحل بناء المستوى", "Level Building Stages"), lang)}
        steps={[
          local(b("التعريف والهدف", "Definition & Purpose"), lang),
          local(b("المحطات المشمولة", "Included Stations"), lang),
          local(b("منطق الانتقال", "Progression Logic"), lang),
          local(b("المراجعة والاعتماد", "Review & Approval"), lang),
        ]}
        activeStep={activeStep}
        summary={
          <>
            <strong>{local(currentLevel.name, lang)}</strong>
            <span>{attachedStations.length} {local(b("محطات", "stations"), lang)}</span>
          </>
        }
        form={
          <form className="builder-card dense" onSubmit={(e) => e.preventDefault()}>
            <div className="field-row">
              <label>
                {labels.levelTitleAr}
                <input
                  dir="rtl"
                  value={currentLevel.name.ar}
                  onChange={(e) => setBi("name", "ar", e.target.value)}
                />
              </label>
              <label>
                {labels.levelTitleEn}
                <input
                  dir="ltr"
                  value={currentLevel.name.en}
                  onChange={(e) => setBi("name", "en", e.target.value)}
                />
              </label>
            </div>

            <div className="field-row">
              <label>
                {labels.purposeAr}
                <textarea
                  dir="auto"
                  value={currentLevel.purpose.ar}
                  onChange={(e) => setBi("purpose", "ar", e.target.value)}
                />
              </label>
              <label>
                {labels.purposeEn}
                <textarea
                  dir="ltr"
                  value={currentLevel.purpose.en}
                  onChange={(e) => setBi("purpose", "en", e.target.value)}
                />
              </label>
            </div>

            <div className="field-row thirds">
              <label>
                {labels.audienceAr}
                <input
                  dir="auto"
                  value={currentLevel.targetAudience.ar}
                  onChange={(e) => setBi("targetAudience", "ar", e.target.value)}
                />
              </label>
              <label>
                {labels.prereqsAr}
                <input
                  dir="auto"
                  value={currentLevel.prerequisites.ar}
                  onChange={(e) => setBi("prerequisites", "ar", e.target.value)}
                />
              </label>
              <label>
                {labels.expectedPerf}
                <input
                  dir="auto"
                  value={currentLevel.expectedPerformanceLevel.ar}
                  onChange={(e) => setBi("expectedPerformanceLevel", "ar", e.target.value)}
                />
              </label>
            </div>

            <div className="field-section">
              <span className="mini-label">{labels.attachedStationsLabel}</span>
              <div className="checkbox-grid">
                {store.stations.map((st) => {
                  const isChecked = currentLevel.stationIds.includes(st.id);
                  return (
                    <label key={st.id} className="check-row">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleStationLink(st.id)}
                      />
                      <span>
                        <strong>{local(st.name, lang)}</strong>
                        <small>{local(st.purpose, lang)}</small>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="field-row">
              <label>
                {labels.progressionLogic}
                <textarea
                  dir="auto"
                  value={currentLevel.progressionLogic.ar}
                  onChange={(e) => setBi("progressionLogic", "ar", e.target.value)}
                />
              </label>
              <label>
                {labels.completionCriteria}
                <textarea
                  dir="auto"
                  value={currentLevel.completionCriteria.ar}
                  onChange={(e) => setBi("completionCriteria", "ar", e.target.value)}
                />
              </label>
            </div>

            <div className="field-row thirds">
              <label>
                {labels.duration}
                <input
                  dir="auto"
                  value={currentLevel.estimatedDuration.ar}
                  onChange={(e) => setBi("estimatedDuration", "ar", e.target.value)}
                />
              </label>
              <label>
                {labels.notes}
                <input
                  dir="auto"
                  value={currentLevel.instructorNotes.ar}
                  onChange={(e) => setBi("instructorNotes", "ar", e.target.value)}
                />
              </label>
              <label>
                {labels.evidenceExpectations}
                <input
                  dir="auto"
                  value={currentLevel.evidenceExpectations.ar}
                  onChange={(e) => setBi("evidenceExpectations", "ar", e.target.value)}
                />
              </label>
            </div>

            <div className="builder-actions-row">
              <button
                type="button"
                className="secondary-danger"
                onClick={() => onDeleteRequest(currentLevel.id)}
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
                {isValid ? local(b("مكتمل ومستوفي الشرط", "Complete & Valid"), lang) : local(b("يتطلب مراجعة", "Requires Review"), lang)}
              </EvidenceBadge>
              <span>{attachedStations.length} {local(b("محطات", "stations"), lang)}</span>
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
                message={local(b("المستوى محدد بجاهزية ومربوط بمحطات مستقلة.", "Level is properly specified and linked to stations."), lang)}
              />
            )}

            <dl className="station-dl">
              <div>
                <dt>{local(b("اسم المستوى", "Level Name"), lang)}</dt>
                <dd>{local(currentLevel.name, lang)}</dd>
              </div>
              <div>
                <dt>{local(b("هدف المستوى", "Purpose"), lang)}</dt>
                <dd>{local(currentLevel.purpose, lang)}</dd>
              </div>
              <div>
                <dt>{local(b("المحطات المشمولة", "Linked Stations"), lang)}</dt>
                <dd>
                  {attachedStations.length > 0
                    ? attachedStations.map((s) => local(s.name, lang)).join(" · ")
                    : "—"}
                </dd>
              </div>
              <div>
                <dt>{local(b("المدة والتوقعات", "Duration & Expectations"), lang)}</dt>
                <dd>{local(currentLevel.estimatedDuration, lang)}</dd>
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
