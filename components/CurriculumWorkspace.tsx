"use client";

import { useState } from "react";
import {
  trainerCurriculum,
  type CurriculumLevel,
  type CurriculumProgress,
  type CurriculumStation,
  type DrillRating,
  type GateDecision,
} from "../lib/curriculum";
import { b, type Bi, type Lang } from "../lib/content";
import { GateDecisionPanel } from "./ui/GateDecisionPanel";

type Mode = "learner" | "instructor";

const local = (value: Bi, lang: Lang) => value[lang];

const copy = {
  ar: {
    title: "مسار المنهج",
    intro: "من Level إلى Station، ومن Drill إلى دليل، ثم Gate يحدد الانتقال. لا توجد درجة كلية تخفي تفاصيل الأداء.",
    curriculum: "المنهج",
    level: "المستوى",
    station: "المحطة",
    drill: "Drill",
    gate: "Gate",
    current: "الحالي",
    available: "متاح",
    locked: "مغلق حتى اجتياز الـGate",
    lockedShort: "مغلق",
    complete: "مكتمل",
    evidence: "الدليل الملاحظ",
    requiredEvidence: "الدليل المطلوب",
    condition: "الشرط",
    domain: "Learning Domain",
    pillar: "Trifecta",
    rating: "مرساة الأداء",
    critical: "Critical Safety Failure",
    criticalNote: "هذا البند ينتج No-Go تلقائيًا ولا يمكن تعويضه.",
    stationPurpose: "هدف المحطة",
    requirement: "متطلب الأداء",
    baseline: "Baseline",
    gateRequirement: "شرط الانتقال",
    gateEvidence: "دليل قرار الـGate",
    remediation: "المعالجة / Reset قبل Retest",
    instructorOnly: "قرار الـGate يسجله المدرب. بدّل إلى وضع المدرب لإدارة الانتقال.",
    ready: "الدليل مكتمل لاتخاذ قرار.",
    incomplete: "استكمل دليل كل Drill وحدد مرساة أداء قبل Go.",
    automaticNoGo: "Critical Failure مسجل: القرار الفعلي No-Go.",
    progression: "تقدم مبني على الدليل",
    rollup: "ملخص دليل المحطة",
    noTotal: "هذه نسبة اكتمال للأدلة والـGates، وليست درجة أداء كلية.",
    evidenceFlow: "سلسلة الدليل",
    recorded: "مسجل",
    anchored: "مُقيّم",
    decision: "قرار",
    decisionLegend: "قرار الـGate",
    expandDrill: "افتح تفاصيل الـDrill",
    anchors: ["غير مُثبت", "بدعم كبير", "عدم اتساق بسيط", "مستقل وثابت"],
    decisions: {
      pending: "لم يُتخذ قرار",
      go: "Go",
      "no-go": "No-Go",
      "need-more-data": "Need More Data",
      "retest": "Retest",
    },
  },
  en: {
    title: "Curriculum pathway",
    intro: "From Level to Station, Drill to evidence, and Gate to progression. No total score hides the performance detail.",
    curriculum: "Curriculum",
    level: "Level",
    station: "Station",
    drill: "Drill",
    gate: "Gate",
    current: "Current",
    available: "Available",
    locked: "Locked until the Gate is passed",
    lockedShort: "Locked",
    complete: "Complete",
    evidence: "Observable evidence",
    requiredEvidence: "Required evidence",
    condition: "Condition",
    domain: "Learning Domain",
    pillar: "Trifecta",
    rating: "Performance anchor",
    critical: "Critical Safety Failure",
    criticalNote: "This item automatically produces No-Go and cannot be compensated.",
    stationPurpose: "Station purpose",
    requirement: "Performance requirement",
    baseline: "Baseline",
    gateRequirement: "Progression requirement",
    gateEvidence: "Gate decision evidence",
    remediation: "Remediation / reset before retest",
    instructorOnly: "Gate decisions are recorded by the instructor. Switch to Instructor mode to manage progression.",
    ready: "Evidence is complete for a decision.",
    incomplete: "Complete evidence and select an anchor for every Drill before Go.",
    automaticNoGo: "Critical Failure recorded: the effective decision is No-Go.",
    progression: "Evidence-based progress",
    rollup: "Station evidence summary",
    noTotal: "This is evidence and Gate completion—not a total performance score.",
    evidenceFlow: "Evidence chain",
    recorded: "Recorded",
    anchored: "Anchored",
    decision: "Decision",
    decisionLegend: "Gate decision",
    expandDrill: "Open Drill details",
    anchors: ["Not demonstrated", "Major support", "Minor inconsistency", "Independent and consistent"],
    decisions: {
      pending: "No decision",
      go: "Go",
      "no-go": "No-Go",
      "need-more-data": "Need More Data",
      "retest": "Retest",
    },
  },
} as const;

function getGateDecision(level: CurriculumLevel, station: CurriculumStation, progress: CurriculumProgress): GateDecision {
  const hasCritical = station.drills.some((item) => progress.drills[item.id]?.criticalFailure);
  const gate = level.gates.find((item) => item.fromStationId === station.id);
  if (hasCritical) return "no-go";
  return gate ? progress.gates[gate.id]?.decision ?? "pending" : "pending";
}

function stationReady(station: CurriculumStation, progress: CurriculumProgress) {
  return station.drills.every((item) => {
    const record = progress.drills[item.id];
    return Boolean(record?.evidence.trim()) && record?.rating !== null && record?.rating !== undefined;
  });
}

function levelComplete(level: CurriculumLevel, progress: CurriculumProgress) {
  const everyStationReady = level.stations.every((station) => stationReady(station, progress));
  const everyGateGo = level.gates.every((gate) => {
    const source = level.stations.find((station) => station.id === gate.fromStationId);
    return source ? getGateDecision(level, source, progress) === "go" : false;
  });
  const hasCritical = level.stations.some((station) => station.drills.some((item) => progress.drills[item.id]?.criticalFailure));
  return everyStationReady && everyGateGo && !hasCritical;
}

export default function CurriculumWorkspace({
  lang,
  mode,
  progress,
  onChange,
}: {
  lang: Lang;
  mode: Mode;
  progress: CurriculumProgress;
  onChange: (next: CurriculumProgress) => void;
}) {
  const t = copy[lang];
  const level = trainerCurriculum.levels.find((item) => item.id === progress.activeLevelId) ?? trainerCurriculum.levels[0];
  const station = level.stations.find((item) => item.id === progress.activeStationId) ?? level.stations[0];
  const [expandedDrill, setExpandedDrill] = useState(station.drills[0]?.id ?? "");
  const gate = level.gates.find((item) => item.fromStationId === station.id);
  const gateRecord = gate ? progress.gates[gate.id] ?? { decision: "pending" as GateDecision, evidence: "", remediation: "" } : undefined;
  const hasCritical = station.drills.some((item) => progress.drills[item.id]?.criticalFailure);
  const ready = stationReady(station, progress);
  const effectiveDecision = getGateDecision(level, station, progress);
  const evidenceCount = station.drills.filter((item) => progress.drills[item.id]?.evidence.trim()).length;
  const anchoredCount = station.drills.filter((item) => progress.drills[item.id]?.rating !== null && progress.drills[item.id]?.rating !== undefined).length;

  const totalUnits = trainerCurriculum.levels.reduce((sum, item) => (
    sum + item.stations.reduce((drillSum, current) => drillSum + current.drills.length, 0) + item.gates.length
  ), 0);
  const completedUnits = trainerCurriculum.levels.reduce((sum, item) => (
    sum
    + item.stations.reduce((drillSum, current) => drillSum + current.drills.filter((entry) => {
      const record = progress.drills[entry.id];
      return Boolean(record?.evidence.trim()) && record?.rating !== null && record?.rating !== undefined;
    }).length, 0)
    + item.gates.filter((entry) => {
      const source = item.stations.find((station) => station.id === entry.fromStationId);
      return source ? getGateDecision(item, source, progress) === "go" : false;
    }).length
  ), 0);
  const completion = Math.round((completedUnits / totalUnits) * 100);

  const setActiveLevel = (next: CurriculumLevel, index: number) => {
    const previousComplete = index === 0 || levelComplete(trainerCurriculum.levels[index - 1], progress);
    if (mode !== "instructor" && !previousComplete) return;
    setExpandedDrill(next.stations[0]?.drills[0]?.id ?? "");
    onChange({ ...progress, activeLevelId: next.id, activeStationId: next.stations[0].id });
  };

  const stationUnlocked = (candidate: CurriculumStation) => {
    const index = level.stations.findIndex((item) => item.id === candidate.id);
    if (index <= 0) return true;
    const previousGate = level.gates.find((item) => item.toStationId === candidate.id);
    const source = previousGate ? level.stations.find((item) => item.id === previousGate.fromStationId) : undefined;
    return source ? getGateDecision(level, source, progress) === "go" : false;
  };

  const setActiveStation = (next: CurriculumStation) => {
    if (!stationUnlocked(next)) return;
    setExpandedDrill(next.drills[0]?.id ?? "");
    onChange({ ...progress, activeStationId: next.id });
  };

  const updateDrill = (id: string, patch: Partial<{ rating: DrillRating; evidence: string; criticalFailure: boolean }>) => {
    const current = progress.drills[id] ?? { rating: null, evidence: "", criticalFailure: false };
    const nextGates = patch.criticalFailure && gate
      ? { ...progress.gates, [gate.id]: { ...(progress.gates[gate.id] ?? { evidence: "", remediation: "" }), decision: "no-go" as GateDecision } }
      : progress.gates;
    onChange({ ...progress, drills: { ...progress.drills, [id]: { ...current, ...patch } }, gates: nextGates });
  };

  const updateGate = (patch: Partial<{ decision: GateDecision; evidence: string; remediation: string }>) => {
    if (!gate || !gateRecord) return;
    onChange({ ...progress, gates: { ...progress.gates, [gate.id]: { ...gateRecord, ...patch } } });
  };

  return <div className="curriculum-experience">
    <header className="curriculum-heading">
      <div>
        <div className="curriculum-breadcrumb">
          <span>{t.curriculum}</span><bdi>›</bdi><span>{t.level}</span><bdi>›</bdi><strong>{t.station}</strong>
        </div>
        <h1>{t.title}</h1>
        <p>{t.intro}</p>
      </div>
      <div className="curriculum-progress" aria-label={`${t.progression} ${completion}%`}>
        <div><span>{t.progression}</span><strong>{completion}%</strong></div>
        <div className="progress-track"><span style={{ transform: `scaleX(${completion / 100})` }}/></div>
        <small>{t.noTotal}</small>
      </div>
    </header>

    <div className="level-switcher" role="tablist" aria-label={t.level}>
      {trainerCurriculum.levels.map((item, index) => {
        const unlocked = mode === "instructor" || index === 0 || levelComplete(trainerCurriculum.levels[index - 1], progress);
        const complete = levelComplete(item, progress);
        return <button
          key={item.id}
          role="tab"
          aria-selected={item.id === level.id}
          aria-disabled={!unlocked}
          className={complete ? "complete" : ""}
          onClick={() => setActiveLevel(item, index)}
        >
          <span>{complete ? "✓" : `L${index + 1}`}</span>
          <strong>{local(item.name, lang)}</strong>
          <small>{complete ? t.complete : unlocked ? t.available : t.locked}</small>
        </button>;
      })}
    </div>

    <div className="curriculum-map-shell">
      <section className="curriculum-map" aria-label={local(trainerCurriculum.name, lang)}>
      <div className="curriculum-map-title">
        <div><span>{local(trainerCurriculum.name, lang)}</span><strong>{local(level.name, lang)}</strong></div>
        <p>{local(level.outcome, lang)}</p>
      </div>
      <div className="station-track">
        {level.stations.map((item, index) => {
          const unlocked = stationUnlocked(item);
          const active = item.id === station.id;
          const complete = stationReady(item, progress) && !item.drills.some((entry) => progress.drills[entry.id]?.criticalFailure);
          const transition = level.gates.find((entry) => entry.fromStationId === item.id);
          const transitionDecision = transition ? getGateDecision(level, item, progress) : "pending";
          return <div className="track-unit" key={item.id}>
            <button
              className={`station-node ${active ? "active" : ""} ${complete ? "complete" : ""}`}
              aria-current={active ? "step" : undefined}
              aria-disabled={!unlocked}
              onClick={() => setActiveStation(item)}
            >
              <span>S{index + 1}</span>
              <strong>{local(item.name, lang).replace(/^.*·\s*/, "")}</strong>
              <small>{active ? t.current : complete ? t.complete : unlocked ? t.available : t.lockedShort}</small>
            </button>
            {transition && <div className={`gate-marker decision-${transitionDecision}`}>
              <span>G{index + 1}</span>
              <strong>{t.gate}</strong>
              <small>{t.decisions[transitionDecision]}</small>
            </div>}
          </div>;
        })}
      </div>
      <div className="evidence-ledger" aria-label={t.evidenceFlow}>
        <span>{t.evidenceFlow}</span>
        <div className={evidenceCount === station.drills.length ? "complete" : ""}>
          <bdi>D</bdi><strong>{evidenceCount}/{station.drills.length}</strong><small>{t.recorded}</small>
        </div>
        <i aria-hidden="true">→</i>
        <div className={anchoredCount === station.drills.length ? "complete" : ""}>
          <bdi>S</bdi><strong>{anchoredCount}/{station.drills.length}</strong><small>{t.anchored}</small>
        </div>
        <i aria-hidden="true">→</i>
        <div className={`decision-${effectiveDecision}`}>
          <bdi>G</bdi><strong>{t.decisions[effectiveDecision]}</strong><small>{t.decision}</small>
        </div>
      </div>
      </section>
      <div className="curriculum-continuation" role="note"><span>{lang === "ar" ? "اسحب لرؤية باقي المحطات" : "Scroll to see more stations"}</span><bdi>{level.stations.length} {lang === "ar" ? "محطات" : "stations"}</bdi><i aria-hidden="true">→</i></div>
    </div>

    <div className="station-workspace">
      <section className="station-context">
        <div className="station-index"><span>{level.stations.findIndex((item) => item.id === station.id) + 1}</span><small>{t.station}</small></div>
        <div>
          <h2>{local(station.name, lang)}</h2>
          <p>{local(station.purpose, lang)}</p>
        </div>
        <dl>
          <div><dt>{t.requirement}</dt><dd>{local(station.requirement, lang)}</dd></div>
          <div><dt>{t.baseline}</dt><dd>{local(station.baseline, lang)}</dd></div>
        </dl>
        <div className="station-rollup" aria-live="polite">
          <span>{t.rollup}</span>
          <div><strong>{evidenceCount}/{station.drills.length}</strong><small>{t.evidence}</small></div>
          <div><strong>{anchoredCount}/{station.drills.length}</strong><small>{t.rating}</small></div>
          <div className={hasCritical ? "critical" : ""}><strong>{hasCritical ? "NO-GO" : "—"}</strong><small>Critical Failure</small></div>
        </div>
      </section>

      <section className="drill-stack" aria-label={t.drill}>
        {station.drills.map((item, index) => {
          const record = progress.drills[item.id] ?? { rating: null, evidence: "", criticalFailure: false };
          const complete = Boolean(record.evidence.trim()) && record.rating !== null;
          return <details className={`drill-row ${record.criticalFailure ? "critical" : complete ? "complete" : ""}`} key={item.id} open={expandedDrill === item.id}>
            <summary className="drill-head" aria-label={`${t.expandDrill}: ${local(item.name, lang)}`} onClick={(event) => { event.preventDefault(); setExpandedDrill(expandedDrill === item.id ? "" : item.id); }}>
              <span>D{index + 1}</span>
              <div><h3>{local(item.name, lang)}</h3><p>{local(item.purpose, lang)}</p></div>
              <div className="drill-state"><span>{record.criticalFailure ? "!" : complete ? "✓" : "○"}</span>{record.criticalFailure ? "NO-GO" : complete ? t.complete : t.available}</div>
            </summary>
            <div className="drill-body">
              <div className="drill-spec">
                <p><span>{t.condition}</span>{local(item.condition, lang)}</p>
                <p><span>{t.requiredEvidence}</span>{local(item.evidence, lang)}</p>
                <div><span>{t.domain}</span><bdi>{item.domain}</bdi></div>
                <div><span>{t.pillar}</span><bdi>{item.pillar}</bdi></div>
              </div>
              <label className="evidence-field">
                <span>{t.evidence}</span>
                <textarea dir="auto" value={record.evidence} onChange={(event) => updateDrill(item.id, { evidence: event.target.value })}/>
              </label>
              <fieldset className="rating-field">
                <legend>{t.rating}</legend>
                <div>{t.anchors.map((anchor, rating) => <button
                  key={rating}
                  type="button"
                  aria-pressed={record.rating === rating}
                  onClick={() => updateDrill(item.id, { rating: rating as DrillRating })}
                ><b>{rating}</b><span>{anchor}</span></button>)}</div>
              </fieldset>
              <label className="critical-toggle">
                <input type="checkbox" checked={record.criticalFailure} onChange={(event) => updateDrill(item.id, { criticalFailure: event.target.checked })}/>
                <span><strong>{t.critical}</strong><small>{t.criticalNote}</small></span>
              </label>
            </div>
          </details>;
        })}
      </section>
    </div>

    {gate && gateRecord && (
      <GateDecisionPanel
        title={`${t.gate} · ${local(level.stations.find((item) => item.id === gate.toStationId)?.name ?? b("", ""), lang)}`}
        requirement={local(gate.requirement, lang)}
        effectiveDecision={effectiveDecision}
        hasCritical={hasCritical}
        isReady={ready}
        mode={mode}
        decisionLabels={t.decisions}
        statusMessages={{
          automaticNoGo: t.automaticNoGo,
          criticalExplanation: local(b("خرق أمان حرج غير قابل للتعويض بأي درجات أداء أخرى.", "Critical safety failure is non-compensable by any other performance score."), lang),
          ready: t.ready,
          incomplete: t.incomplete,
          instructorOnly: t.instructorOnly,
          gateEvidenceLabel: t.gateEvidence,
          remediationLabel: t.remediation,
          gateLabel: t.gate,
          decisionLegend: t.decisionLegend,
        }}
        evidenceValue={gateRecord.evidence}
        remediationValue={gateRecord.remediation}
        onDecisionChange={(decision) => updateGate({ decision: decision as GateDecision })}
        onEvidenceChange={(evidence) => updateGate({ evidence })}
        onRemediationChange={(remediation) => updateGate({ remediation })}
      />
    )}
  </div>;
}
