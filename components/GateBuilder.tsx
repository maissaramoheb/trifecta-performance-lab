"use client";

import { useMemo } from "react";
import { b, type Bi, type Lang } from "../lib/content";
import type { CurriculumSuiteStore, GateEntity } from "../lib/curriculum-builder-types";
import type { GateDecision } from "../lib/curriculum";
import { PageHeader } from "./ui/PageHeader";
import { WorkspaceShell } from "./ui/WorkspaceShell";
import { StatusBanner } from "./ui/StatusBanner";
import { EvidenceBadge } from "./ui/EvidenceBadge";
import { GateDecisionPanel } from "./ui/GateDecisionPanel";

const local = (value: Bi | string, lang: Lang) =>
  typeof value === "string" ? value : value[lang];

type GateBuilderProps = {
  lang: Lang;
  store: CurriculumSuiteStore;
  mode: "learner" | "instructor";
  onUpdateGate: (updated: GateEntity) => void;
  onDeleteRequest: (gateId: string) => void;
};

export function GateBuilder({
  lang,
  store,
  mode,
  onUpdateGate,
  onDeleteRequest,
}: GateBuilderProps) {
  const currentGate = useMemo(() => {
    return store.gates.find((g) => g.id === store.activeGateId) ?? store.gates[0];
  }, [store.gates, store.activeGateId]);

  if (!currentGate) return null;

  const fromStation = store.stations.find((s) => s.id === currentGate.fromStationId);
  const nextStation = store.stations.find((s) => s.id === currentGate.nextStationId);
  const stationDrills = store.drills.filter((d) => d.stationId === currentGate.fromStationId);

  // Check if an observed critical failure event exists (NOT just authored criteria)
  const hasCritical = currentGate.observedCriticalFailures.length > 0;
  const effectiveDecision: GateDecision = hasCritical ? "no-go" : currentGate.decision;

  const setBi = (key: keyof GateEntity, langKey: "ar" | "en", text: string) => {
    const val = currentGate[key] as Bi;
    const nextBi = typeof val === "object" ? { ...val, [langKey]: text } : { ar: text, en: text };
    onUpdateGate({
      ...currentGate,
      [key]: nextBi,
      decision: hasCritical ? "no-go" : currentGate.decision,
      updatedAt: new Date().toISOString(),
    });
  };

  const toggleObservedCritical = (observed: boolean) => {
    const nextObserved = observed
      ? [{ id: `cf_${Date.now()}`, observedAt: new Date().toISOString(), evidence: local(b("خرق شرط أمان حاسم ملاحظ", "Observed critical safety-condition breach"), lang) }]
      : [];
    onUpdateGate({
      ...currentGate,
      observedCriticalFailures: nextObserved,
      decision: observed ? "no-go" : currentGate.decision === "no-go" ? "pending" : currentGate.decision,
      updatedAt: new Date().toISOString(),
    });
  };

  const warnings: string[] = [];
  if (!currentGate.requirement.ar.trim()) {
    warnings.push(local(b("شرط الانتقال غير محدد.", "Gate progression requirement is missing."), lang));
  }
  if (!currentGate.evidenceRequired.ar.trim()) {
    warnings.push(local(b("الدليل المطلوب لقرار الـGate غير محدد.", "Required evidence for Gate decision is missing."), lang));
  }
  if (hasCritical) {
    warnings.push(local(b("فشل أمان حرج مسجل: القرار مؤكد No-Go وغير قابل للتعويض.", "Critical safety failure logged: decision is strictly forced to No-Go."), lang));
  }

  const isValid = warnings.length === 0;

  const labels = {
    ar: {
      eyebrow: "Gate Builder · بوابة الانتقال",
      title: "صمّم بوابة الانتقال وقواعد الـGo / No-Go",
      intro: "الـGate يمنع الانتقال غير المبرر. الفشل الحرج ينتج No-Go دائمًا ولا تعوضه أي درجة كليّة.",
      fromStation: "المحطة المصدر (From Station)",
      nextStation: "المحطة المستهدفة (Next Station)",
      requirement: "شرط الانتقال المعتمد (Gate Requirement)",
      evidenceRequired: "الدليل المطلوب لصدور القرار",
      mandatoryCriteria: "المعايير الإلزامية قبل التقييم",
      criticalFailures: "Critical Safety Failures (ينتج No-Go تلقائيًا)",
      goConditions: "شروط إقرار Go (العبور)",
      noGoConditions: "شروط إقرار No-Go (الإيقاف)",
      needMoreDataConditions: "شروط إقرار Need More Data (طلب بيانات إضافية)",
      remediation: "خطّة المعالجة المطلوبة (Remediation)",
      retestRequirements: "متطلبات إعادة الاختبار (Retest)",
      resetConditions: "شروط إعادة الضبط (Reset)",
      decisionRationale: "مبرر القرار والدليل الملاحظ",
      nextPermittedAction: "الإجراء المسموح به تاليًا",
      previewHeader: "لوحة قرار الـGate التشغيلية",
      deleteBtn: "حذف هذه البوابة",
      decisions: {
        pending: "لم يُتخذ قرار",
        go: "Go",
        "no-go": "No-Go",
        "need-more-data": "Need More Data",
        retest: "Retest",
      },
    },
    en: {
      eyebrow: "Gate Builder · Transition Gate",
      title: "Design Transition Gate & Go / No-Go Logic",
      intro: "The Gate prevents ungrounded progression. Critical Failure always forces No-Go and cannot be compensated by scores.",
      fromStation: "From Station",
      nextStation: "Target Next Station",
      requirement: "Approved Gate Requirement",
      evidenceRequired: "Required Evidence for Decision",
      mandatoryCriteria: "Mandatory Assessment Criteria",
      criticalFailures: "Critical Safety Failures (Forces No-Go)",
      goConditions: "Go Conditions",
      noGoConditions: "No-Go Conditions",
      needMoreDataConditions: "Need More Data Conditions",
      remediation: "Remediation Plan",
      retestRequirements: "Retest Requirements",
      resetConditions: "Reset Conditions",
      decisionRationale: "Decision Rationale",
      nextPermittedAction: "Next Permitted Action",
      previewHeader: "Operational Gate Decision Panel",
      deleteBtn: "Delete This Gate",
      decisions: {
        pending: "No decision",
        go: "Go",
        "no-go": "No-Go",
        "need-more-data": "Need More Data",
        retest: "Retest",
      },
    },
  }[lang];

  return (
    <div className="gate-builder-screen" data-critical-state={hasCritical ? "observed" : "clear"} data-effective-decision={effectiveDecision}>
      <PageHeader className="gate-page-header" eyebrow={labels.eyebrow} title={labels.title} intro={labels.intro} />

      <WorkspaceShell
        className="gate-workspace"
        label={local(b("مراحل بناء الـGate", "Gate Building Stages"), lang)}
        steps={[
          local(b("الربط والشرط", "Link & Requirement"), lang),
          local(b("شروط Go / No-Go", "Go / No-Go Conditions"), lang),
          local(b("المعالجة والـReset", "Remediation & Reset"), lang),
          local(b("القرار والتحقق", "Decision & Verification"), lang),
        ]}
        activeStep={hasCritical ? 3 : isValid ? 3 : 1}
        summary={
          <>
            <strong>
              {fromStation ? local(fromStation.name, lang) : "Station"} ➔{" "}
              {nextStation ? local(nextStation.name, lang) : "End"}
            </strong>
            <span>{labels.decisions[effectiveDecision]}</span>
          </>
        }
        form={
          <form className="builder-card dense gate-authoring-form" onSubmit={(e) => e.preventDefault()}>
            <section className="gate-form-section gate-route-section" aria-label={local(b("مسار الانتقال", "Progression route"), lang)}>
              <div className="gate-section-heading">
                <span aria-hidden="true">01</span>
                <div>
                  <strong>{local(b("مسار الانتقال", "Progression route"), lang)}</strong>
                  <small>{local(b("حدد المحطة المصدر والمحطة التالية قبل صياغة القرار.", "Set the source and next Station before defining the decision."), lang)}</small>
                </div>
              </div>
              <div className="field-row">
              <label>
                {labels.fromStation}
                <select
                  value={currentGate.fromStationId}
                  onChange={(e) =>
                    onUpdateGate({
                      ...currentGate,
                      fromStationId: e.target.value,
                      updatedAt: new Date().toISOString(),
                    })
                  }
                >
                  {store.stations.map((s) => (
                    <option key={s.id} value={s.id}>
                      {local(s.name, lang)}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                {labels.nextStation}
                <select
                  value={currentGate.nextStationId || ""}
                  onChange={(e) =>
                    onUpdateGate({
                      ...currentGate,
                      nextStationId: e.target.value || undefined,
                      updatedAt: new Date().toISOString(),
                    })
                  }
                >
                  <option value="">{local(b("لا توجد محطة تالية (نهاية المستوى)", "None (End of Level)"), lang)}</option>
                  {store.stations
                    .filter((s) => s.id !== currentGate.fromStationId)
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {local(s.name, lang)}
                      </option>
                    ))}
                </select>
              </label>
              </div>
            </section>

            <section className="gate-form-section gate-evidence-section" aria-label={local(b("الشرط والدليل", "Requirement and evidence"), lang)}>
              <div className="gate-section-heading">
                <span aria-hidden="true">02</span>
                <div>
                  <strong>{local(b("الشرط والدليل", "Requirement and evidence"), lang)}</strong>
                  <small>{local(b("اكتب ما يجب إثباته بصورة قابلة للملاحظة.", "Describe what must be demonstrated through observable evidence."), lang)}</small>
                </div>
              </div>
              <div className="field-row">
              <label>
                {labels.requirement}
                <textarea
                  dir="auto"
                  value={currentGate.requirement.ar}
                  onChange={(e) => setBi("requirement", "ar", e.target.value)}
                />
              </label>
              <label>
                {labels.evidenceRequired}
                <textarea
                  dir="auto"
                  value={currentGate.evidenceRequired.ar}
                  onChange={(e) => setBi("evidenceRequired", "ar", e.target.value)}
                />
              </label>
              </div>
            </section>

            <section className="gate-form-section gate-criteria-section" aria-label={local(b("المعايير والفشل الحرج", "Criteria and Critical Failure"), lang)}>
              <div className="gate-section-heading">
                <span aria-hidden="true">03</span>
                <div>
                  <strong>{local(b("المعايير والفشل الحرج", "Criteria and Critical Failure"), lang)}</strong>
                  <small>{local(b("افصل تعريف الفشل الحرج عن تسجيل واقعة ملاحظة.", "Keep authored failure criteria separate from an observed event."), lang)}</small>
                </div>
              </div>
              <div className="field-row">
              <label>
                {labels.mandatoryCriteria}
                <textarea
                  dir="auto"
                  value={currentGate.mandatoryCriteria.ar}
                  onChange={(e) => setBi("mandatoryCriteria", "ar", e.target.value)}
                />
              </label>
              <div className={`observed-critical-card ${hasCritical ? "is-observed" : ""}`}>
                <label>
                <strong>{labels.criticalFailures} <bdi dir="ltr">— Authored Criteria</bdi></strong>
                <textarea
                  dir="auto"
                  value={currentGate.criticalFailures.ar}
                  onChange={(e) => setBi("criticalFailures", "ar", e.target.value)}
                  placeholder={local(b("وصف المعايير الشارحة لما يعتبر خرقًا حرجًا", "Authored criteria describing what counts as a critical failure"), lang)}
                />
                </label>
                <div className="observed-critical-toggle">
                  <input
                    type="checkbox"
                    id="observed-cf-toggle"
                    checked={hasCritical}
                    onChange={(e) => toggleObservedCritical(e.target.checked)}
                  />
                  <label htmlFor="observed-cf-toggle">
                    <strong>{local(b("تسجيل فشل أمان حرج ملاحظ", "Record an observed Critical Safety Failure"), lang)}</strong>
                    <small>{local(b("فعّل فقط عند وجود دليل ملاحظ. القرار يصبح", "Enable only for observed evidence. The decision becomes"), lang)} <bdi dir="ltr">No-Go</bdi>.</small>
                  </label>
                </div>
              </div>
              </div>
            </section>

            <section className="gate-form-section gate-decision-rules-section" aria-label={local(b("قواعد القرار", "Decision rules"), lang)}>
              <div className="gate-section-heading">
                <span aria-hidden="true">04</span>
                <div>
                  <strong>{local(b("قواعد القرار", "Decision rules"), lang)}</strong>
                  <small>{local(b("حدد شروط كل نتيجة دون استخدام درجة كلية تعويضية.", "Define each outcome without a compensating aggregate score."), lang)}</small>
                </div>
              </div>
              <div className="field-row thirds">
              <label>
                {labels.goConditions}
                <input
                  dir="auto"
                  value={currentGate.goConditions.ar}
                  onChange={(e) => setBi("goConditions", "ar", e.target.value)}
                />
              </label>
              <label>
                {labels.noGoConditions}
                <input
                  dir="auto"
                  value={currentGate.noGoConditions.ar}
                  onChange={(e) => setBi("noGoConditions", "ar", e.target.value)}
                />
              </label>
              <label>
                {labels.needMoreDataConditions}
                <input
                  dir="auto"
                  value={currentGate.needMoreDataConditions.ar}
                  onChange={(e) => setBi("needMoreDataConditions", "ar", e.target.value)}
                />
              </label>
              </div>
            </section>

            <section className="gate-form-section gate-remediation-section" aria-label={local(b("المعالجة وإعادة الاختبار", "Remediation and Retest"), lang)}>
              <div className="gate-section-heading">
                <span aria-hidden="true">05</span>
                <div>
                  <strong>{local(b("المعالجة وإعادة الاختبار", "Remediation and Retest"), lang)}</strong>
                  <small>{local(b("حدد الـReset وشروط الـRetest قبل السماح بمحاولة جديدة.", "Define Reset and Retest conditions before another attempt."), lang)}</small>
                </div>
              </div>
              <div className="field-row thirds">
              <label>
                {labels.remediation}
                <input
                  dir="auto"
                  value={currentGate.remediation.ar}
                  onChange={(e) => setBi("remediation", "ar", e.target.value)}
                />
              </label>
              <label>
                {labels.retestRequirements}
                <input
                  dir="auto"
                  value={currentGate.retestRequirements.ar}
                  onChange={(e) => setBi("retestRequirements", "ar", e.target.value)}
                />
              </label>
              <label>
                {labels.resetConditions}
                <input
                  dir="auto"
                  value={currentGate.resetConditions.ar}
                  onChange={(e) => setBi("resetConditions", "ar", e.target.value)}
                />
              </label>
              </div>
            </section>

            <section className="gate-attempt-history" aria-labelledby="gate-attempt-history-title">
              <div className="gate-section-heading">
                <span aria-hidden="true">06</span>
                <div>
                  <strong id="gate-attempt-history-title">{local(b("سجل محاولات الـGate", "Gate attempt history"), lang)} <bdi className="history-count" dir="ltr">{currentGate.attempts.length}</bdi></strong>
                  <small>{local(b("المحاولات السابقة تظل محفوظة ولا يستبدلها الـRetest.", "Retest never replaces an earlier attempt."), lang)}</small>
                </div>
              </div>
              {currentGate.attempts.length ? (
                <ol>
                  {currentGate.attempts.map((attempt) => (
                    <li key={attempt.id} data-attempt-decision={attempt.decision}>
                      <div>
                        <strong>{local(b("محاولة", "Attempt"), lang)} <bdi dir="ltr">#{attempt.attemptNumber}</bdi></strong>
                        <time dateTime={attempt.timestamp}>{new Date(attempt.timestamp).toLocaleString(lang === "ar" ? "ar-EG" : "en-GB")}</time>
                      </div>
                      <bdi className={`attempt-decision decision-${attempt.decision}`} dir="ltr">{labels.decisions[attempt.decision]}</bdi>
                      <div className="attempt-evidence">
                        <span>{local(b("لقطة الدليل", "Evidence snapshot"), lang)}</span>
                        <p>{attempt.evidenceSnapshot || local(b("لم يُسجل دليل لهذه المحاولة.", "No evidence was recorded for this attempt."), lang)}</p>
                      </div>
                      <details className="attempt-details">
                        <summary>{local(b("راجع المبرر والمعالجة", "Review rationale and remediation"), lang)}</summary>
                        <dl>
                          <div><dt>{local(b("الفشل الحرج الملاحظ", "Observed Critical Failures"), lang)}</dt><dd><bdi dir="ltr">{attempt.observedCriticalFailures.length}</bdi></dd></div>
                          <div><dt>{local(b("المبرر", "Rationale"), lang)}</dt><dd>{local(attempt.rationale, lang)}</dd></div>
                          <div><dt>{local(b("المعالجة", "Remediation"), lang)}</dt><dd>{local(attempt.remediation, lang)}</dd></div>
                        </dl>
                      </details>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="gate-attempt-empty">{local(b("لا توجد محاولات مسجلة بعد. أول قرار موثق سيظهر هنا.", "No attempts recorded yet. The first documented decision will appear here."), lang)}</p>
              )}
            </section>

            <div className="builder-actions-row">
              <button
                type="button"
                className="secondary-danger"
                onClick={() => onDeleteRequest(currentGate.id)}
              >
                {labels.deleteBtn}
              </button>
            </div>
          </form>
        }
        preview={
          <aside className="output-card gate-decision-card">
            <div className="decision-station-line" aria-hidden="true"><span /><i /><span /></div>
            <div className="card-top">
              <EvidenceBadge type={effectiveDecision === "no-go" ? "danger" : effectiveDecision === "go" ? "safe" : "default"}>
                {labels.decisions[effectiveDecision]}
              </EvidenceBadge>
              <span>
                {fromStation ? local(fromStation.name, lang) : "Station"} ➔{" "}
                {nextStation ? local(nextStation.name, lang) : "End"}
              </span>
            </div>

            <h2>{labels.previewHeader}</h2>

            {hasCritical && (
              <StatusBanner
                type="critical"
                title={local(b("فشل أمان حرج ملاحظ · CRITICAL SAFETY FAILURE OBSERVED", "CRITICAL SAFETY FAILURE OBSERVED"), lang)}
                message={local(b("تم إيقاف التقدم · PROGRESSION INTERRUPTED — قرار إلزامي No-Go · MANDATORY NO-GO", "PROGRESSION INTERRUPTED — MANDATORY NO-GO"), lang)}
              />
            )}

            <GateDecisionPanel
              title={`${local(b("قرار بوابة المحطة", "Station Gate Decision"), lang)}`}
              requirement={local(currentGate.requirement, lang)}
              effectiveDecision={effectiveDecision}
              hasCritical={hasCritical}
              isReady={stationDrills.length > 0}
              mode={mode}
              decisionLabels={labels.decisions}
              statusMessages={{
                automaticNoGo: local(b("تم إيقاف التقدم. القرار الإلزامي No-Go.", "Progression interrupted. Mandatory No-Go."), lang),
                criticalExplanation: local(b("خرق أمان حرج غير قابل للتعويض بأي درجات أداء أخرى.", "Critical safety failure is non-compensable by any other performance score."), lang),
                ready: local(b("الدليل مكتمل لاتخاذ قرار.", "Evidence is complete for a decision."), lang),
                incomplete: local(b("استكمل دليل كل Drill وحدد مرساة أداء قبل Go.", "Complete evidence and select an anchor for every Drill before Go."), lang),
                instructorOnly: local(b("قرار الـGate يسجله المدرب. بدّل إلى وضع المدرب لإدارة الانتقال.", "Gate decisions are recorded by the instructor. Switch to Instructor mode."), lang),
                gateEvidenceLabel: labels.decisionRationale,
                remediationLabel: labels.remediation,
                gateLabel: "Gate",
                decisionLegend: labels.previewHeader,
              }}
              evidenceValue={currentGate.decisionEvidence}
              remediationValue={local(currentGate.remediation, lang)}
              onDecisionChange={(newDecision: string) => {
                if (hasCritical) return; // Non-compensable: cannot override No-Go
                onUpdateGate({
                  ...currentGate,
                  decision: newDecision as GateDecision,
                  updatedAt: new Date().toISOString(),
                });
              }}
              onEvidenceChange={(ev: string) =>
                onUpdateGate({
                  ...currentGate,
                  decisionEvidence: ev,
                  updatedAt: new Date().toISOString(),
                })
              }
              onRemediationChange={(rem: string) =>
                onUpdateGate({
                  ...currentGate,
                  remediation: b(rem, rem),
                  updatedAt: new Date().toISOString(),
                })
              }
            />
          </aside>
        }
      />
    </div>
  );
}
