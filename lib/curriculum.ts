import { b, type Bi } from "./content";
import type {
  CurriculumSuiteStore,
  CycleCheckResult,
  DrillEntity,
  GateAttempt,
  GateEntity,
  ImportValidationResult,
  LevelEntity,
  ObservedCriticalFailure,
  StationEntity,
  ValidationError,
} from "./curriculum-builder-types";

export type GateDecision = "pending" | "go" | "no-go" | "need-more-data" | "retest";
export type DrillRating = 0 | 1 | 2 | 3;

export type CurriculumDrill = {
  id: string;
  name: Bi;
  purpose: Bi;
  condition: Bi;
  evidence: Bi;
  domain: "Cognitive" | "Psychomotor" | "Affective";
  pillar: "Physical" | "Technical" | "Cognitive";
};

export type CurriculumStation = {
  id: string;
  name: Bi;
  purpose: Bi;
  requirement: Bi;
  baseline: Bi;
  drills: CurriculumDrill[];
};

export type CurriculumGate = {
  id: string;
  fromStationId: string;
  toStationId: string;
  requirement: Bi;
};

export type CurriculumLevel = {
  id: string;
  name: Bi;
  outcome: Bi;
  stations: CurriculumStation[];
  gates: CurriculumGate[];
};

export type Curriculum = {
  id: string;
  name: Bi;
  description: Bi;
  levels: CurriculumLevel[];
};

export type DrillRecord = {
  rating: DrillRating | null;
  evidence: string;
  criticalFailure: boolean;
};

export type GateRecord = {
  decision: GateDecision;
  evidence: string;
  remediation: string;
};

export type CurriculumProgress = {
  schemaVersion: 2 | 3;
  activeLevelId: string;
  activeStationId: string;
  drills: Record<string, DrillRecord>;
  gates: Record<string, GateRecord>;
};

const drill = (
  id: string,
  name: Bi,
  purpose: Bi,
  condition: Bi,
  evidence: Bi,
  domain: CurriculumDrill["domain"],
  pillar: CurriculumDrill["pillar"],
): CurriculumDrill => ({ id, name, purpose, condition, evidence, domain, pillar });

export const trainerCurriculum: Curriculum = {
  id: "whole-performance-foundations",
  name: b("منهج قراءة الأداء الكامل", "Whole-performance curriculum"),
  description: b(
    "مسار تطبيقي يربط بناء التعلم بالدليل، ثم يستخدم الـTrifecta لتشخيص الناتج الفعلي قبل قرار الانتقال.",
    "An applied pathway that connects learning design to evidence, then uses the Trifecta to diagnose actual output before progression.",
  ),
  levels: [
    {
      id: "lvl_foundation_01",
      name: b("المستوى 1 · بناء الـBaseline", "Level 1 · Build the baseline"),
      outcome: b(
        "يحدد المتدرب المطلوب، ينفذ أداءً آمنًا في شرط أساسي، ويوثق الدليل دون خلطه بالافتراض.",
        "The learner identifies the requirement, performs safely at baseline, and records evidence without mixing it with assumptions.",
      ),
      stations: [
        {
          id: "st_baseline_01",
          name: b("المحطة 1 · قراءة المتطلب", "Station 1 · Read the requirement"),
          purpose: b("تحويل الـBrief والمعيار إلى سلوك يمكن ملاحظته.", "Turn the brief and standard into observable behaviour."),
          requirement: b("يشرح المطلوب ويحدد بند الأمان الحاسم قبل الأداء.", "Explain the requirement and identify the critical safety item before performance."),
          baseline: b("Brief قصير، دون وقت أو حمل إضافي.", "Short brief with no added time or load."),
          drills: [
            drill("dr_evidence_01", b("Drill 1 · Brief-Back", "Drill 1 · Brief-back"), b("التحقق من استرجاع الشرط الحاسم.", "Check recall of the critical condition."), b("بعد Brief واحد ودون مساعدة.", "After one brief and without prompting."), b("الكلمات التي استرجعها المتدرب كما قيلت.", "The learner’s recalled words as stated."), "Cognitive", "Cognitive"),
            drill("drill-evidence-sort", b("Drill 2 · دليل أم افتراض", "Drill 2 · Evidence or assumption"), b("فصل ما شوهد عن تفسيره.", "Separate what was observed from its interpretation."), b("ثلاث عبارات أداء قصيرة.", "Three short performance statements."), b("تصنيف كل عبارة مع سبب قابل للمراجعة.", "Classification of each statement with a reviewable reason."), "Cognitive", "Cognitive"),
            drill("drill-safety-cue", b("Drill 3 · الاستجابة للـCue", "Drill 3 · Respond to the cue"), b("إظهار سلوك الأمان المطلوب في شرط أساسي.", "Demonstrate the required safety behaviour at baseline."), b("Cue واحد معروف، دون Timer.", "One known cue, without a timer."), b("توقيت الاستجابة وبند الـChecklist الحاسم.", "Response timing and the critical checklist item."), "Affective", "Technical"),
          ],
        },
        {
          id: "st_stability_01",
          name: b("المحطة 2 · تثبيت الأداء", "Station 2 · Stabilize performance"),
          purpose: b("التمييز بين نجاح مرة واحدة وأداء متكرر.", "Distinguish one successful attempt from repeatable performance."),
          requirement: b("يحافظ على المعيار عبر محاولات مستقلة.", "Retain the standard across independent attempts."),
          baseline: b("نفس الشرط الأساسي، دعم المدرب مسجل بوضوح.", "Same baseline condition with instructor support explicitly recorded."),
          drills: [
            drill("drill-guided", b("Drill 1 · تنفيذ موجه", "Drill 1 · Guided execution"), b("تحديد مقدار الدعم المطلوب.", "Establish how much support is required."), b("Cue واحد مسموح في المحاولة.", "One cue is permitted during the trial."), b("عدد ونوع التلميحات والتصحيحات.", "Number and type of prompts and corrections."), "Psychomotor", "Technical"),
            drill("drill-independent", b("Drill 2 · محاولة مستقلة", "Drill 2 · Independent attempt"), b("اختبار الأداء دون مساعدة.", "Test performance without assistance."), b("نفس الـBaseline دون Cue.", "Same baseline without a cue."), b("بنود الـChecklist والاختلاف عن المحاولة الموجهة.", "Checklist items and variance from the guided attempt."), "Psychomotor", "Technical"),
            drill("drill-repeatability", b("Drill 3 · الثبات عبر التكرار", "Drill 3 · Repeatability"), b("البحث عن نمط، لا لقطة ناجحة.", "Look for a pattern, not a successful snapshot."), b("ثلاث محاولات مستقلة متتالية.", "Three consecutive independent trials."), b("الاتساق، أول نقطة انهيار، وأي Critical Failure.", "Consistency, first breakdown point, and any Critical Failure."), "Psychomotor", "Technical"),
          ],
        },
        {
          id: "station-diagnosis",
          name: b("المحطة 3 · تشخيص أول انهيار", "Station 3 · Diagnose first breakdown"),
          purpose: b("إضافة متغير واحد وربط التغير بدليل.", "Add one variable and connect the change to evidence."),
          requirement: b("يحدد أول نقطة انهيار ويقترح تفسيرًا بديلًا.", "Identify the first breakdown point and offer an alternative explanation."),
          baseline: b("أداء ثابت موثق قبل إضافة المتغير.", "Documented stable performance before the variable is added."),
          drills: [
            drill("drill-one-variable", b("Drill 1 · متغير واحد", "Drill 1 · One variable"), b("عزل أثر الوقت أو التعقيد.", "Isolate the effect of time or complexity."), b("إضافة عامل واحد فقط للـBaseline.", "Add only one factor to baseline."), b("الفرق بين المحاولة الأساسية والمحاولة المعدلة.", "Difference between the baseline and modified trial."), "Psychomotor", "Cognitive"),
            drill("drill-first-breakdown", b("Drill 2 · أول انهيار", "Drill 2 · First breakdown"), b("تحديد أين بدأ الأداء يتغير.", "Identify where performance first changed."), b("مراجعة التسلسل دون تشخيص شخصية.", "Review the sequence without personality diagnosis."), b("اللحظة والسلوك والشرط السابق للخطأ.", "The moment, behaviour, and condition preceding the error."), "Cognitive", "Cognitive"),
            drill("drill-reset-retest", b("Drill 3 · Reset وRetest", "Drill 3 · Reset and retest"), b("اختبار قابلية الاستعادة.", "Test whether performance can recover."), b("Reset محدد ثم إعادة نفس الشرط.", "A defined reset followed by the same condition."), b("جودة الأداء قبل وبعد الـReset.", "Performance quality before and after the reset."), "Affective", "Physical"),
          ],
        },
      ],
      gates: [
        { id: "gt_baseline_01", fromStationId: "st_baseline_01", toStationId: "st_stability_01", requirement: b("كل Drill له دليل، ولا يوجد Critical Failure، والشرط الحاسم مسترجع ومطبق.", "Every drill has evidence, no Critical Failure occurred, and the critical condition was recalled and applied.") },
        { id: "gate-foundation-2", fromStationId: "st_stability_01", toStationId: "station-diagnosis", requirement: b("الأداء مستقل ومتكرر، ومقدار الدعم وأي عدم اتساق موثقان.", "Performance is independent and repeatable, with support and inconsistency documented.") },
      ],
    },
    {
      id: "level-applied",
      name: b("المستوى 2 · الأداء تحت متغير مضبوط", "Level 2 · Performance under controlled variation"),
      outcome: b(
        "يضيف المدرب حملًا تدريجيًا، يفرق بين السبب الأساسي والثانوي، ويختار تدخلًا يناسب الدليل.",
        "The trainer progresses load, distinguishes primary and secondary causes, and selects an intervention that matches the evidence.",
      ),
      stations: [
        {
          id: "station-load",
          name: b("المحطة 1 · تصعيد الحمل", "Station 1 · Load progression"),
          purpose: b("معرفة متى يبدأ الأداء في التغير.", "Identify when performance begins to change."),
          requirement: b("يضيف عاملًا واحدًا في كل مرة ويسجل أول اختلاف.", "Add one factor at a time and record the first difference."),
          baseline: b("ناتج آمن وثابت في ثلاث محاولات.", "Safe, stable output across three trials."),
          drills: [
            drill("drill-time", b("Drill 1 · وقت تدريجي", "Drill 1 · Progressive time"), b("اختبار أثر الوقت دون متغير إضافي.", "Test time without another variable."), b("ثلاث درجات وقت مصرح بها.", "Three authorized time bands."), b("الدقة والأمان وأول تغير عند كل درجة.", "Accuracy, safety, and first change at each band."), "Psychomotor", "Cognitive"),
            drill("drill-controlled-load", b("Drill 2 · حمل مضبوط", "Drill 2 · Controlled load"), b("اختبار دعم الجسم للمهمة.", "Test whether the body supports the task."), b("جرعة محددة مع Recovery معلوم.", "Defined dose with known recovery."), b("اتجاه التدهور والاستعادة عبر التكرار.", "Decline and recovery trend across repetitions."), "Psychomotor", "Physical"),
            drill("drill-retention", b("Drill 3 · الاحتفاظ بالأداء", "Drill 3 · Performance retention"), b("التحقق من ثبات الناتج بعد الحمل.", "Verify output stability after load."), b("نفس الـChecklist قبل الحمل وبعده.", "Same checklist before and after load."), b("الفروق الفنية والسلوكية وليس النتيجة فقط.", "Technical and behavioural differences, not outcome alone."), "Affective", "Technical"),
          ],
        },
        {
          id: "station-decision",
          name: b("المحطة 2 · قرار تحت تغيير", "Station 2 · Decision under change"),
          purpose: b("ربط الإدراك والقرار بالفعل الصحيح.", "Connect perception and decision to the correct action."),
          requirement: b("يلاحظ تغيرًا مصرحًا به ويعدل الخطة دون فقد شرط حاسم.", "Detect an authorized change and adapt without losing a critical condition."),
          baseline: b("الشرط والتغيير معروفان للمقيم فقط.", "The condition and change are known only to the assessor."),
          drills: [
            drill("drill-detect", b("Drill 1 · اكتشاف التغيير", "Drill 1 · Detect change"), b("قياس ما شوهد وفُهم.", "Measure what was seen and understood."), b("Cue واضح واحد داخل تسلسل معروف.", "One clear cue within a known sequence."), b("زمن الاكتشاف ودقة تفسير الـCue.", "Detection time and cue-interpretation accuracy."), "Cognitive", "Cognitive"),
            drill("drill-select", b("Drill 2 · اختيار القرار", "Drill 2 · Select decision"), b("فصل جودة القرار عن سرعة الاستجابة.", "Separate decision quality from response speed."), b("اختيار من بدائل مصرح بها.", "Choose from authorized alternatives."), b("صحة الاختيار وسبب القرار.", "Choice accuracy and decision rationale."), "Cognitive", "Cognitive"),
            drill("drill-coupling", b("Drill 3 · القرار إلى فعل", "Drill 3 · Decision to action"), b("اختبار Motor-Cognitive Coupling دون تشخيص عصبي.", "Test motor-cognitive coupling without neurological diagnosis."), b("قرار صحيح يجب أن يتحول لسلوك محدد.", "A correct decision must become a defined behaviour."), b("تطابق القرار المسجل مع الفعل الملاحظ.", "Match between the recorded decision and observed action."), "Psychomotor", "Technical"),
          ],
        },
        {
          id: "station-calibration",
          name: b("المحطة 3 · معايرة الحكم", "Station 3 · Calibrate judgement"),
          purpose: b("تحويل الاختلاف بين المقيمين إلى تحسين قابل للتطبيق.", "Turn assessor disagreement into an actionable improvement."),
          requirement: b("يفصل الملاحظة عن التفسير ويحدد بندًا غامضًا.", "Separate observation from interpretation and identify an ambiguous item."),
          baseline: b("نفس الحالة والـChecklist لكل المقيمين.", "Same case and checklist for all assessors."),
          drills: [
            drill("drill-observe", b("Drill 1 · سجل ما رأيت", "Drill 1 · Record what you saw"), b("منع التفسير المبكر.", "Prevent premature interpretation."), b("مشاهدة مستقلة قبل النقاش.", "Independent observation before discussion."), b("وصف سلوكي بلا صفات شخصية.", "Behavioural description without personality labels."), "Cognitive", "Technical"),
            drill("drill-compare", b("Drill 2 · قارن الأحكام", "Drill 2 · Compare judgements"), b("إظهار موضع الاتفاق والاختلاف.", "Expose where judgements agree and differ."), b("مقارنة القرار والدليل والثقة.", "Compare decision, evidence, and confidence."), b("عناصر الاتفاق وبنود الـChecklist المختلفة.", "Agreement areas and divergent checklist items."), "Cognitive", "Cognitive"),
            drill("drill-rewrite", b("Drill 3 · حسّن المعيار", "Drill 3 · Improve the criterion"), b("تحويل الغموض إلى سلوك ملاحظ.", "Turn ambiguity into observable behaviour."), b("إعادة كتابة بند واحد ثم Retest.", "Rewrite one item, then retest."), b("الصياغة قبل/بعد ونتيجة المعايرة.", "Before/after wording and calibration result."), "Cognitive", "Technical"),
          ],
        },
      ],
      gates: [
        { id: "gate-applied-1", fromStationId: "station-load", toStationId: "station-decision", requirement: b("تم عزل المتغير وتوثيق الـBaseline وأول اختلاف دون Critical Failure.", "The variable, baseline, and first difference are documented with no Critical Failure.") },
        { id: "gate-applied-2", fromStationId: "station-decision", toStationId: "station-calibration", requirement: b("القرار والفعل والدليل متطابقون، أو تم اختيار Need More Data مع خطة جمع واضحة.", "Decision, action, and evidence align, or Need More Data includes a clear collection plan.") },
      ],
    },
  ],
};

export function createInitialCurriculumProgress(): CurriculumProgress {
  return {
    schemaVersion: 2,
    activeLevelId: trainerCurriculum.levels[0].id,
    activeStationId: trainerCurriculum.levels[0].stations[0].id,
    drills: {},
    gates: {},
  };
}

export function migrateCurriculumProgress(value: unknown): CurriculumProgress {
  const initial = createInitialCurriculumProgress();
  if (!value || typeof value !== "object") return initial;

  const candidate = value as {
    schemaVersion?: number;
    activeLevelId?: unknown;
    activeStationId?: unknown;
    drills?: Record<string, Partial<DrillRecord>>;
    gates?: CurriculumProgress["gates"];
  };

  const drills = Object.fromEntries(
    Object.entries(candidate.drills ?? {}).map(([id, record]) => [
      id,
      {
        evidence: typeof record.evidence === "string" ? record.evidence : "",
        criticalFailure: Boolean(record.criticalFailure),
        rating: candidate.schemaVersion === 1 && record.rating === 0
          ? null
          : ([0, 1, 2, 3].includes(Number(record.rating)) ? Number(record.rating) as DrillRating : null),
      },
    ]),
  );

  return {
    schemaVersion: 2,
    activeLevelId: typeof candidate.activeLevelId === "string" ? candidate.activeLevelId : initial.activeLevelId,
    activeStationId: typeof candidate.activeStationId === "string" ? candidate.activeStationId : initial.activeStationId,
    drills,
    gates: candidate.gates && typeof candidate.gates === "object" ? candidate.gates : {},
  };
}

// ==========================================
// V2.1 Curriculum Builder Suite Store & Pure Migration
// ==========================================

export function createInitialCurriculumSuiteStore(): CurriculumSuiteStore {
  const now = "2026-08-01T00:00:00.000Z";

  const levels: LevelEntity[] = trainerCurriculum.levels.map((lvl) => ({
    id: lvl.id,
    name: lvl.name,
    purpose: lvl.outcome,
    targetAudience: b("المتربون وقادة المجموعات والمقيّمون", "Trainers, squad leaders, and assessors"),
    prerequisites: b("اجتياز المتطلبات الأساسية ومراجعة إجراءات الأمان", "Pass baseline prerequisites and review safety protocols"),
    expectedPerformanceLevel: b("أداء مستقل وآمن قابل للتكرار", "Independent, safe, repeatable performance"),
    stationIds: lvl.stations.map((s) => s.id),
    progressionLogic: b("الانتقال مشروط باجتياز الـGate دون Critical Failure", "Progression is conditioned on passing the Gate without Critical Failure"),
    entryCriteria: b("تسجيل الـBaseline بوضوح قبل إضافة أي حمل", "Clear baseline recording before adding load"),
    completionCriteria: b("إنجاز جميع المحطات واجتياز الـGates المطلوبة", "Complete all stations and pass required Gates"),
    evidenceExpectations: b("توثيق الدليل الملاحظ لكل Drill", "Document observable evidence for each Drill"),
    estimatedDuration: b("4 - 6 ساعات تدريبية", "4 - 6 training hours"),
    instructorNotes: b("تأكد من عدم استخدام التقييم الكلي لتغطية الأخطاء الحرجة", "Ensure total score is not used to mask critical failures"),
    updatedAt: now,
  }));

  const stations: StationEntity[] = [];
  const drills: DrillEntity[] = [];
  const gates: GateEntity[] = [];

  for (const lvl of trainerCurriculum.levels) {
    lvl.stations.forEach((st, sIndex) => {
      const gateForStation = lvl.gates.find((g) => g.fromStationId === st.id);
      const gateId = gateForStation ? gateForStation.id : `gate-${st.id}`;
      const drillIds = st.drills.map((d) => d.id);

      stations.push({
        id: st.id,
        levelId: lvl.id,
        name: st.name,
        purpose: st.purpose,
        requirement: st.requirement,
        domain: "Psychomotor",
        level: "Apply",
        primaryPillar: "Technical",
        secondaryPillar: "Cognitive",
        baseline: st.baseline,
        variables: b("متغير واحد في كل مرحلة", "One variable per phase"),
        timePressure: b("حسب تصعيد المحطة", "Per station load progression"),
        cognitiveLoad: b("مضبوط مع ملاحظة الإشارات", "Controlled with cue detection"),
        physicalLoad: b("مستوى معتدل", "Moderate level"),
        behaviour: st.requirement,
        checklist: st.requirement,
        criticalFailures: b("مخالفة قواعد الأمان الحاسم أو فقدان السيطرة", "Critical safety violation or loss of control"),
        standard: st.requirement,
        dataToCollect: st.purpose,
        aarQuestions: b("ماذا حدث؟ وما الدليل الملاحظ؟ وما القرار التالي؟", "What happened? What was observed? What is next?"),
        remediation: b("Reset ثم إعادة نفس الشرط الأساسي", "Reset then repeat baseline condition"),
        retestRule: b("محاولة واحدة بعد المعالجة وتوثيق السبب", "One attempt after remediation with cause documented"),
        safetyGate: true,
        drillIds,
        gateId,
        updatedAt: now,
      });

      st.drills.forEach((d) => {
        drills.push({
          id: d.id,
          stationId: st.id,
          title: d.name,
          purpose: d.purpose,
          objective: d.purpose,
          condition: d.condition,
          standard: d.evidence,
          domain: d.domain,
          primaryPillar: d.pillar,
          physicalRequirement: b("جهد معتدل وثبات الحركة", "Moderate effort and physical stability"),
          technicalRequirement: d.evidence,
          cognitiveRequirement: d.purpose,
          requiredEquipment: b("معدات المحطة القياسية", "Standard station equipment"),
          instructorActions: b("مراقبة وتوثيق الدليل دون التدخل المبكر", "Observe and record evidence without premature intervention"),
          learnerActions: d.condition,
          safetyControls: b("إيقاف فوري عند أي خرق أمان", "Immediate stop on any safety breach"),
          criticalFailures: b("مخالفة شرط الأمان الحاسم", "Breach of critical safety condition"),
          criticalFailureCriteria: b("مخالفة شرط الأمان الحاسم", "Breach of critical safety condition"),
          observedCriticalFailures: [],
          rating: null,
          evidenceToCollect: d.evidence,
          assessmentMethod: b("ملاحظة مباشرة + Checklist", "Direct observation + Checklist"),
          repetitionsOrDuration: b("3 محاولات مستقلة", "3 independent attempts"),
          remediationOptions: b("مراجعة الـBrief وإعادة المحاولة", "Review brief and retry"),
          completionCriteria: d.evidence,
          pillarWeights: {
            physical: d.pillar === "Physical" ? 50 : 25,
            technical: d.pillar === "Technical" ? 50 : 25,
            cognitive: d.pillar === "Cognitive" ? 50 : 25,
          },
          updatedAt: now,
        });
      });

      const nextStation = sIndex < lvl.stations.length - 1 ? lvl.stations[sIndex + 1] : undefined;
      const targetStationId = gateForStation ? gateForStation.toStationId : nextStation?.id;

      gates.push({
        id: gateId,
        fromStationId: st.id,
        nextStationId: targetStationId,
        requirement: gateForStation ? gateForStation.requirement : st.requirement,
        evidenceRequired: st.requirement,
        mandatoryCriteria: st.requirement,
        criticalFailures: b("أي خرق حرج ينتج No-Go تلقائيًا", "Any critical breach automatically produces No-Go"),
        criticalFailureCriteria: b("خرق شرط الأمان الحاسم", "Critical safety-condition breach"),
        observedCriticalFailures: [],
        goConditions: b("توثيق الدليل لجميع الـDrills وعدم وجود failure حرج", "Evidence documented for all Drills and no critical failure"),
        noGoConditions: b("حدوث خرق أمان حرج أو نقص أدلة حاسم", "Critical safety breach or decisive missing evidence"),
        needMoreDataConditions: b("عدم كفاية المحاولات المستقلة للتحقق", "Insufficient independent trials for verification"),
        remediation: b("إعادة ضبط الشرط وتطبيق الـReset المحدد", "Reset condition and apply specified reset"),
        retestRequirements: b("Retest بعد استكمال خطة المعالجة", "Retest after completing remediation plan"),
        resetConditions: b("العودة إلى الـBaseline", "Return to Baseline"),
        decisionRationale: b("قرار قائم على الدليل المستقل", "Evidence-based decision"),
        nextPermittedAction: b("الانتقال إلى المحطة التالية أو المعالجة", "Proceed to next station or remediate"),
        decision: "pending",
        decisionEvidence: "",
        attempts: [],
        updatedAt: now,
      });
    });
  }

  return {
    schemaVersion: 3,
    activeTab: "level",
    activeLevelId: levels[0].id,
    activeStationId: stations[0].id,
    activeDrillId: drills[0].id,
    activeGateId: gates[0].id,
    levels,
    stations,
    drills,
    gates,
  };
}

/**
 * Pure, side-effect-free migration function.
 * Does NOT interact with localStorage directly.
 */
export function migrateCurriculumSuiteStore(value: unknown): CurriculumSuiteStore {
  const initial = createInitialCurriculumSuiteStore();
  if (!value || typeof value !== "object") return initial;

  const candidate = value as Record<string, unknown>;
  const inputVersion = typeof candidate.schemaVersion === "number" ? candidate.schemaVersion : 1;

  // Reject unsupported future schema versions (> 3)
  if (inputVersion > 3) {
    throw new Error(`Unsupported future schema version: ${inputVersion}. Migration rejected.`);
  }

  // Controlled legacyExtensions preservation
  const knownKeys = new Set([
    "schemaVersion", "activeTab", "activeLevelId", "activeStationId",
    "activeDrillId", "activeGateId", "levels", "stations", "drills", "gates", "legacyExtensions", "unknownLegacyFields",
  ]);

  const legacyExtensions: Record<string, unknown> = {
    ...(candidate.legacyExtensions as Record<string, unknown> ?? {}),
    ...(candidate.unknownLegacyFields as Record<string, unknown> ?? {}),
  };

  for (const [key, val] of Object.entries(candidate)) {
    if (!knownKeys.has(key)) {
      legacyExtensions[key] = val;
    }
  }

  // Parse Levels
  const rawLevels = Array.isArray(candidate.levels) ? candidate.levels : [];
  const levels: LevelEntity[] = rawLevels.map((lvl, index) => {
    const l = lvl as Partial<LevelEntity>;
    return {
      id: typeof l.id === "string" && l.id.trim() ? l.id : `lvl_${index + 1}`,
      name: l.name ?? b(`مستوى ${index + 1}`, `Level ${index + 1}`),
      purpose: l.purpose ?? b("", ""),
      targetAudience: l.targetAudience ?? b("", ""),
      prerequisites: l.prerequisites ?? b("", ""),
      expectedPerformanceLevel: l.expectedPerformanceLevel ?? b("", ""),
      stationIds: Array.isArray(l.stationIds) ? l.stationIds.filter((x): x is string => typeof x === "string") : [],
      progressionLogic: l.progressionLogic ?? b("", ""),
      entryCriteria: l.entryCriteria ?? b("", ""),
      completionCriteria: l.completionCriteria ?? b("", ""),
      evidenceExpectations: l.evidenceExpectations ?? b("", ""),
      estimatedDuration: l.estimatedDuration ?? b("", ""),
      instructorNotes: l.instructorNotes ?? b("", ""),
      updatedAt: typeof l.updatedAt === "string" ? l.updatedAt : "2026-08-01T00:00:00.000Z",
      legacyExtensions: l.legacyExtensions,
    };
  });

  if (levels.length === 0) {
    levels.push(...initial.levels);
  }

  // Parse Stations
  const rawStations = Array.isArray(candidate.stations) ? candidate.stations : [];
  const stations: StationEntity[] = rawStations.map((st, index) => {
    const s = st as Partial<StationEntity>;
    return {
      id: typeof s.id === "string" && s.id.trim() ? s.id : `st_${index + 1}`,
      levelId: typeof s.levelId === "string" ? s.levelId : levels[0].id,
      name: s.name ?? b(`محطة ${index + 1}`, `Station ${index + 1}`),
      purpose: s.purpose ?? b("", ""),
      requirement: s.requirement ?? b("", ""),
      domain: (s.domain as StationEntity["domain"]) || "Psychomotor",
      level: s.level || "Apply",
      primaryPillar: (s.primaryPillar as StationEntity["primaryPillar"]) || "Technical",
      secondaryPillar: (s.secondaryPillar as StationEntity["secondaryPillar"]) || "Cognitive",
      baseline: s.baseline ?? b("", ""),
      variables: s.variables ?? b("", ""),
      timePressure: s.timePressure ?? b("", ""),
      cognitiveLoad: s.cognitiveLoad ?? b("", ""),
      physicalLoad: s.physicalLoad ?? b("", ""),
      behaviour: s.behaviour ?? b("", ""),
      checklist: s.checklist ?? b("", ""),
      criticalFailures: s.criticalFailures ?? b("", ""),
      standard: s.standard ?? b("", ""),
      dataToCollect: s.dataToCollect ?? b("", ""),
      aarQuestions: s.aarQuestions ?? b("", ""),
      remediation: s.remediation ?? b("", ""),
      retestRule: s.retestRule ?? b("", ""),
      safetyGate: typeof s.safetyGate === "boolean" ? s.safetyGate : true,
      drillIds: Array.isArray(s.drillIds) ? s.drillIds.filter((x): x is string => typeof x === "string") : [],
      gateId: typeof s.gateId === "string" ? s.gateId : "",
      updatedAt: typeof s.updatedAt === "string" ? s.updatedAt : "2026-08-01T00:00:00.000Z",
      legacyExtensions: s.legacyExtensions,
    };
  });

  if (stations.length === 0) {
    stations.push(...initial.stations);
  }

  // Parse Drills
  const rawDrills = Array.isArray(candidate.drills) ? candidate.drills : [];
  const drills: DrillEntity[] = rawDrills.map((d, index) => {
    const dr = d as Partial<DrillEntity> & Record<string, unknown>;

    // Handle v1 ambiguous rating zero conversion vs explicit 0
    let rating: number | null = null;
    let ambiguousRating = false;

    if (inputVersion === 1 && dr.rating === 0 && !dr.explicitZero) {
      rating = null;
      ambiguousRating = true;
    } else if (typeof dr.rating === "number" && [0, 1, 2, 3].includes(dr.rating)) {
      rating = dr.rating;
    } else {
      rating = null;
    }

    const rawObserved = Array.isArray(dr.observedCriticalFailures) ? dr.observedCriticalFailures : [];
    const observedCriticalFailures: ObservedCriticalFailure[] = rawObserved.map((item, obsIndex) => {
      if (typeof item === "string") {
        return {
          id: item,
          observedAt: "2026-08-01T00:00:00.000Z",
          evidence: "Observed failure event",
        };
      }
      const obs = item as Partial<ObservedCriticalFailure>;
      return {
        id: typeof obs.id === "string" && obs.id ? obs.id : `cf_${obsIndex + 1}`,
        observedAt: typeof obs.observedAt === "string" ? obs.observedAt : "2026-08-01T00:00:00.000Z",
        evidence: typeof obs.evidence === "string" ? obs.evidence : "",
        description: obs.description,
      };
    });

    return {
      id: typeof dr.id === "string" && dr.id.trim() ? dr.id : `dr_${index + 1}`,
      stationId: typeof dr.stationId === "string" ? dr.stationId : stations[0].id,
      title: dr.title ?? b(`تمرين ${index + 1}`, `Drill ${index + 1}`),
      purpose: dr.purpose ?? b("", ""),
      objective: dr.objective ?? b("", ""),
      condition: dr.condition ?? b("", ""),
      standard: dr.standard ?? b("", ""),
      domain: (dr.domain as DrillEntity["domain"]) || "Psychomotor",
      primaryPillar: (dr.primaryPillar as DrillEntity["primaryPillar"]) || "Technical",
      physicalRequirement: dr.physicalRequirement ?? b("", ""),
      technicalRequirement: dr.technicalRequirement ?? b("", ""),
      cognitiveRequirement: dr.cognitiveRequirement ?? b("", ""),
      requiredEquipment: dr.requiredEquipment ?? b("", ""),
      instructorActions: dr.instructorActions ?? b("", ""),
      learnerActions: dr.learnerActions ?? b("", ""),
      safetyControls: dr.safetyControls ?? b("", ""),
      criticalFailures: dr.criticalFailures ?? b("", ""),
      criticalFailureCriteria: dr.criticalFailureCriteria ?? dr.criticalFailures ?? b("", ""),
      observedCriticalFailures,
      rating,
      ambiguousRating,
      evidenceToCollect: dr.evidenceToCollect ?? b("", ""),
      assessmentMethod: dr.assessmentMethod ?? b("", ""),
      repetitionsOrDuration: dr.repetitionsOrDuration ?? b("", ""),
      remediationOptions: dr.remediationOptions ?? b("", ""),
      completionCriteria: dr.completionCriteria ?? b("", ""),
      pillarWeights: dr.pillarWeights && typeof dr.pillarWeights === "object"
        ? {
            physical: Number(dr.pillarWeights.physical) || 25,
            technical: Number(dr.pillarWeights.technical) || 25,
            cognitive: Number(dr.pillarWeights.cognitive) || 25,
          }
        : { physical: 25, technical: 25, cognitive: 25 },
      updatedAt: typeof dr.updatedAt === "string" ? dr.updatedAt : "2026-08-01T00:00:00.000Z",
      legacyExtensions: dr.legacyExtensions,
    };
  });

  if (drills.length === 0) {
    drills.push(...initial.drills);
  }

  // Parse Gates
  const rawGates = Array.isArray(candidate.gates) ? candidate.gates : [];
  const gates: GateEntity[] = rawGates.map((gt, index) => {
    const g = gt as Partial<GateEntity> & Record<string, unknown>;

    // Handle observed critical failures vs authored criteria
    const rawObservedGates = Array.isArray(g.observedCriticalFailures) ? g.observedCriticalFailures : [];
    const observedCriticalFailures: Array<string | ObservedCriticalFailure> = rawObservedGates.map((item, obsIndex) => {
      if (typeof item === "string") return item;
      const obs = item as Partial<ObservedCriticalFailure>;
      return {
        id: typeof obs.id === "string" && obs.id ? obs.id : `cf_gate_${obsIndex + 1}`,
        observedAt: typeof obs.observedAt === "string" ? obs.observedAt : "2026-08-01T00:00:00.000Z",
        evidence: typeof obs.evidence === "string" ? obs.evidence : "",
        description: obs.description,
      };
    });

    const hasObservedFailure = observedCriticalFailures.length > 0;
    let decision: GateDecision = "pending";

    if (hasObservedFailure) {
      decision = "no-go";
    } else if (g.decision === "go" || g.decision === "no-go" || g.decision === "need-more-data" || g.decision === "retest") {
      decision = g.decision;
    }

    const rawAttempts = Array.isArray(g.attempts) ? g.attempts : [];
    const attempts: GateAttempt[] = rawAttempts.map((att, attIndex) => {
      const a = att as Partial<GateAttempt>;
      return {
        id: typeof a.id === "string" ? a.id : `att_${g.id ?? index + 1}_${attIndex + 1}`,
        gateId: typeof a.gateId === "string" ? a.gateId : (g.id ?? `gt_${index + 1}`),
        attemptNumber: typeof a.attemptNumber === "number" ? a.attemptNumber : attIndex + 1,
        timestamp: typeof a.timestamp === "string" ? a.timestamp : "2026-08-01T00:00:00.000Z",
        evidenceSnapshot: typeof a.evidenceSnapshot === "string" ? a.evidenceSnapshot : "",
        observedCriticalFailures: Array.isArray(a.observedCriticalFailures) ? a.observedCriticalFailures : [],
        decision: (a.decision as GateDecision) || "pending",
        rationale: a.rationale ?? b("", ""),
        remediation: a.remediation ?? b("", ""),
        assessorNotes: typeof a.assessorNotes === "string" ? a.assessorNotes : "",
      };
    });

    return {
      id: typeof g.id === "string" && g.id.trim() ? g.id : `gt_${index + 1}`,
      fromStationId: typeof g.fromStationId === "string" ? g.fromStationId : stations[0].id,
      nextStationId: typeof g.nextStationId === "string" ? g.nextStationId : undefined,
      requirement: g.requirement ?? b("", ""),
      evidenceRequired: g.evidenceRequired ?? b("", ""),
      mandatoryCriteria: g.mandatoryCriteria ?? b("", ""),
      criticalFailures: g.criticalFailures ?? b("", ""),
      criticalFailureCriteria: g.criticalFailureCriteria ?? g.criticalFailures ?? b("", ""),
      observedCriticalFailures,
      goConditions: g.goConditions ?? b("", ""),
      noGoConditions: g.noGoConditions ?? b("", ""),
      needMoreDataConditions: g.needMoreDataConditions ?? b("", ""),
      remediation: g.remediation ?? b("", ""),
      retestRequirements: g.retestRequirements ?? b("", ""),
      resetConditions: g.resetConditions ?? b("", ""),
      decisionRationale: g.decisionRationale ?? b("", ""),
      nextPermittedAction: g.nextPermittedAction ?? b("", ""),
      decision,
      decisionEvidence: typeof g.decisionEvidence === "string" ? g.decisionEvidence : "",
      attempts,
      updatedAt: typeof g.updatedAt === "string" ? g.updatedAt : "2026-08-01T00:00:00.000Z",
      legacyExtensions: g.legacyExtensions,
    };
  });

  if (gates.length === 0) {
    gates.push(...initial.gates);
  }

  // Active Selections Repair
  const validTabs: CurriculumSuiteStore["activeTab"][] = ["level", "station", "drill", "gate"];
  const activeTab = validTabs.includes(candidate.activeTab as CurriculumSuiteStore["activeTab"])
    ? (candidate.activeTab as CurriculumSuiteStore["activeTab"])
    : "level";

  const activeLevelId = typeof candidate.activeLevelId === "string" && levels.some((l) => l.id === candidate.activeLevelId)
    ? candidate.activeLevelId
    : levels[0].id;

  const activeStationId = typeof candidate.activeStationId === "string" && stations.some((s) => s.id === candidate.activeStationId)
    ? candidate.activeStationId
    : stations[0].id;

  const activeDrillId = typeof candidate.activeDrillId === "string" && drills.some((d) => d.id === candidate.activeDrillId)
    ? candidate.activeDrillId
    : drills[0].id;

  const activeGateId = typeof candidate.activeGateId === "string" && gates.some((g) => g.id === candidate.activeGateId)
    ? candidate.activeGateId
    : gates[0].id;

  return {
    schemaVersion: 3,
    activeTab,
    activeLevelId,
    activeStationId,
    activeDrillId,
    activeGateId,
    levels,
    stations,
    drills,
    gates,
    legacyExtensions: Object.keys(legacyExtensions).length ? legacyExtensions : undefined,
  };
}

// ==========================================
// Atomic LocalStorage Persistence Orchestration
// ==========================================

export function loadAndMigrateStore(): { store: CurriculumSuiteStore; restoredFromBackup: boolean } {
  if (typeof window === "undefined" || !window.localStorage) {
    return { store: createInitialCurriculumSuiteStore(), restoredFromBackup: false };
  }

  const STORAGE_KEY = "performance-lab-state";
  const BACKUP_KEY = "performance-lab-state-backup-v2";
  const STAGING_KEY = "performance-lab-state-staging";

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initial = createInitialCurriculumSuiteStore();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    } catch { /* ignore */ }
    return { store: initial, restoredFromBackup: false };
  }

  try {
    const parsed = JSON.parse(raw);
    const version = typeof parsed.schemaVersion === "number" ? parsed.schemaVersion : 1;

    // Create backup ONLY during actual migration when schemaVersion < 3
    if (version < 3) {
      try {
        localStorage.setItem(BACKUP_KEY, raw);
      } catch {
        // backup failure non-fatal
      }
    }

    const migrated = migrateCurriculumSuiteStore(parsed);

    // Staged recoverable write
    const migratedString = JSON.stringify(migrated);
    localStorage.setItem(STAGING_KEY, migratedString);
    const readback = localStorage.getItem(STAGING_KEY);

    if (!readback || JSON.parse(readback).schemaVersion !== 3) {
      throw new Error("Staging readback verification failed");
    }

    // Promote staged write
    localStorage.setItem(STORAGE_KEY, readback);
    localStorage.removeItem(STAGING_KEY);

    return { store: migrated, restoredFromBackup: false };
  } catch {
    // Retain/restore original raw bytes on failure
    const backupRaw = localStorage.getItem(BACKUP_KEY);
    if (backupRaw) {
      try {
        localStorage.setItem(STORAGE_KEY, backupRaw);
      } catch { /* ignore */ }
    }
    return { store: createInitialCurriculumSuiteStore(), restoredFromBackup: true };
  }
}

// ==========================================
// Circular Progression & Integrity Checks
// ==========================================

export function detectCircularProgression(gates: GateEntity[]): CycleCheckResult {
  const adj = new Map<string, string[]>();
  const selfLoops: string[] = [];

  for (const g of gates) {
    if (g.fromStationId && g.nextStationId) {
      if (g.fromStationId === g.nextStationId) {
        selfLoops.push(g.fromStationId);
      }
      const existing = adj.get(g.fromStationId) ?? [];
      existing.push(g.nextStationId);
      adj.set(g.fromStationId, existing);
    }
  }

  if (selfLoops.length > 0) {
    return { hasCycle: true, cyclePath: [selfLoops[0], selfLoops[0]] };
  }

  const visited = new Set<string>();
  const recStack = new Set<string>();
  const path: string[] = [];

  function dfs(node: string): boolean {
    visited.add(node);
    recStack.add(node);
    path.push(node);

    const neighbors = adj.get(node) ?? [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (recStack.has(neighbor)) {
        path.push(neighbor);
        return true;
      }
    }

    recStack.delete(node);
    path.pop();
    return false;
  }

  for (const [node] of adj) {
    if (!visited.has(node)) {
      if (dfs(node)) {
        return { hasCycle: true, cyclePath: path };
      }
    }
  }

  return { hasCycle: false, cyclePath: [] };
}

// ==========================================
// Referential Deletion & Selection Repair
// ==========================================

export function getAffectedDependentsOnStationDelete(store: CurriculumSuiteStore, stationId: string) {
  const drills = store.drills.filter((d) => d.stationId === stationId);
  const gates = store.gates.filter((g) => g.fromStationId === stationId || g.nextStationId === stationId);
  const levels = store.levels.filter((l) => l.stationIds.includes(stationId));
  return { drills, gates, levels };
}

export function getAffectedDependentsOnLevelDelete(store: CurriculumSuiteStore, levelId: string) {
  const stations = store.stations.filter((s) => s.levelId === levelId);
  const stationIds = new Set(stations.map((s) => s.id));
  const drills = store.drills.filter((d) => stationIds.has(d.stationId));
  const gates = store.gates.filter((g) => stationIds.has(g.fromStationId) || (g.nextStationId && stationIds.has(g.nextStationId)));
  return { stations, drills, gates };
}

export function deleteStationWithIntegrity(store: CurriculumSuiteStore, stationId: string): CurriculumSuiteStore {
  const nextStations = store.stations.filter((s) => s.id !== stationId);
  const nextDrills = store.drills.filter((d) => d.stationId !== stationId);
  const nextGates = store.gates.filter((g) => g.fromStationId !== stationId && g.nextStationId !== stationId);
  const nextLevels = store.levels.map((l) => ({
    ...l,
    stationIds: l.stationIds.filter((id) => id !== stationId),
  }));

  const activeStationId = store.activeStationId === stationId
    ? (nextStations[0]?.id ?? "")
    : store.activeStationId;

  const activeDrillId = !nextDrills.some((d) => d.id === store.activeDrillId)
    ? (nextDrills[0]?.id ?? "")
    : store.activeDrillId;

  const activeGateId = !nextGates.some((g) => g.id === store.activeGateId)
    ? (nextGates[0]?.id ?? "")
    : store.activeGateId;

  return {
    ...store,
    levels: nextLevels,
    stations: nextStations,
    drills: nextDrills,
    gates: nextGates,
    activeStationId,
    activeDrillId,
    activeGateId,
  };
}

export function deleteLevelWithIntegrity(store: CurriculumSuiteStore, levelId: string): CurriculumSuiteStore {
  const targetLevel = store.levels.find((l) => l.id === levelId);
  const stationIdsToRemove = new Set(targetLevel?.stationIds ?? []);

  const nextLevels = store.levels.filter((l) => l.id !== levelId);
  const nextStations = store.stations.filter((s) => s.levelId !== levelId && !stationIdsToRemove.has(s.id));
  const nextDrills = store.drills.filter((d) => !stationIdsToRemove.has(d.stationId));
  const nextGates = store.gates.filter((g) => !stationIdsToRemove.has(g.fromStationId) && (!g.nextStationId || !stationIdsToRemove.has(g.nextStationId)));

  const activeLevelId = store.activeLevelId === levelId
    ? (nextLevels[0]?.id ?? "")
    : store.activeLevelId;

  const activeStationId = !nextStations.some((s) => s.id === store.activeStationId)
    ? (nextStations[0]?.id ?? "")
    : store.activeStationId;

  const activeDrillId = !nextDrills.some((d) => d.id === store.activeDrillId)
    ? (nextDrills[0]?.id ?? "")
    : store.activeDrillId;

  const activeGateId = !nextGates.some((g) => g.id === store.activeGateId)
    ? (nextGates[0]?.id ?? "")
    : store.activeGateId;

  return {
    ...store,
    levels: nextLevels,
    stations: nextStations,
    drills: nextDrills,
    gates: nextGates,
    activeLevelId,
    activeStationId,
    activeDrillId,
    activeGateId,
  };
}

export function deleteDrillWithIntegrity(store: CurriculumSuiteStore, drillId: string): CurriculumSuiteStore {
  const targetDrill = store.drills.find((d) => d.id === drillId);
  const nextDrills = store.drills.filter((d) => d.id !== drillId);
  const nextStations = store.stations.map((s) => ({
    ...s,
    drillIds: s.drillIds.filter((id) => id !== drillId),
  }));

  const activeDrillId = store.activeDrillId === drillId
    ? (nextDrills.find((d) => d.stationId === targetDrill?.stationId)?.id ?? nextDrills[0]?.id ?? "")
    : store.activeDrillId;

  return {
    ...store,
    stations: nextStations,
    drills: nextDrills,
    activeDrillId,
  };
}

export function deleteGateWithIntegrity(store: CurriculumSuiteStore, gateId: string): CurriculumSuiteStore {
  const targetGate = store.gates.find((g) => g.id === gateId);
  const nextGates = store.gates.filter((g) => g.id !== gateId);
  const nextStations = store.stations.map((s) => ({
    ...s,
    gateId: s.gateId === gateId ? "" : s.gateId,
  }));

  const activeGateId = store.activeGateId === gateId
    ? (nextGates.find((g) => g.fromStationId === targetGate?.fromStationId)?.id ?? nextGates[0]?.id ?? "")
    : store.activeGateId;

  return {
    ...store,
    stations: nextStations,
    gates: nextGates,
    activeGateId,
  };
}

// ==========================================
// Immutable Gate Attempt Recording & Retest Logic
// ==========================================

export function recordGateAttempt(
  gate: GateEntity,
  attemptInput: {
    evidenceSnapshot?: string;
    observedCriticalFailures?: ObservedCriticalFailure[];
    decision: GateDecision;
    rationale?: Bi | string;
    remediation?: Bi | string;
    assessorNotes?: string;
  },
): GateEntity {
  const attemptNumber = gate.attempts.length + 1;
  const now = new Date().toISOString();

  const newAttempt: GateAttempt = {
    id: `att_${gate.id}_${attemptNumber}_${Date.now()}`,
    gateId: gate.id,
    attemptNumber,
    timestamp: now,
    evidenceSnapshot: attemptInput.evidenceSnapshot ?? gate.decisionEvidence,
    observedCriticalFailures: attemptInput.observedCriticalFailures ?? [],
    decision: attemptInput.decision,
    rationale: attemptInput.rationale ?? gate.decisionRationale,
    remediation: attemptInput.remediation ?? gate.remediation,
    assessorNotes: attemptInput.assessorNotes ?? "",
  };

  const hasObservedFailure = gate.observedCriticalFailures.length > 0 || newAttempt.observedCriticalFailures.length > 0;
  const effectiveDecision = (hasObservedFailure || gate.decision === "no-go") ? "no-go" : attemptInput.decision;

  return {
    ...gate,
    decision: effectiveDecision,
    attempts: [...gate.attempts, newAttempt],
    updatedAt: now,
  };
}

// ==========================================
// Strict Import & Export Validation
// ==========================================

export function exportCurriculumSuiteJSON(store: CurriculumSuiteStore): string {
  return JSON.stringify({
    exportedAt: new Date().toISOString(),
    generator: "Trifecta Performance Lab V2.1",
    store,
  }, null, 2);
}

export function validateAndImportCurriculumSuiteJSON(jsonString: string): ImportValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const rawErrors: string[] = [];

  function addError(code: string, textAr: string, textEn: string, params?: Record<string, string | number>, path?: string) {
    errors.push({ code, textAr, textEn, params, path });
    rawErrors.push(`${code}: ${textEn}`);
  }

  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== "object") {
      addError("invalid-json", "صيغة ملف JSON غير صالحة.", "Invalid JSON payload format.");
      return { valid: false, errors, warnings, rawErrors };
    }

    const candidateStore = parsed.store ?? parsed;
    if (!candidateStore || typeof candidateStore !== "object") {
      addError("missing-store-object", "الملف لا يحتوي على كائن store صالح.", "JSON payload missing valid store object.");
      return { valid: false, errors, warnings, rawErrors };
    }

    const version = typeof candidateStore.schemaVersion === "number" ? candidateStore.schemaVersion : 1;
    if (version > 3) {
      addError("unsupported-schema-version", `إصدار المخطط ${version} غير مدعوم.`, `Unsupported schema version: ${version}.`, { version });
      return { valid: false, errors, warnings, rawErrors };
    }

    if (!Array.isArray(candidateStore.levels)) {
      addError("missing-levels-array", "مصفوفة المستويات غير موجودة.", "Missing 'levels' array.");
    }
    if (!Array.isArray(candidateStore.stations)) {
      addError("missing-stations-array", "مصفوفة المحطات غير موجودة.", "Missing 'stations' array.");
    }
    if (!Array.isArray(candidateStore.drills)) {
      addError("missing-drills-array", "مصفوفة التمارين غير موجودة.", "Missing 'drills' array.");
    }
    if (!Array.isArray(candidateStore.gates)) {
      addError("missing-gates-array", "مصفوفة البوابات غير موجودة.", "Missing 'gates' array.");
    }

    if (errors.length > 0) {
      return { valid: false, errors, warnings, rawErrors };
    }

    // Duplicate ID checks (within and across entity types)
    const allIds = new Set<string>();
    const levelIds = new Set<string>();
    const stationIds = new Set<string>();
    const drillIds = new Set<string>();
    const gateIds = new Set<string>();

    const checkDuplicateId = (id: unknown, type: string) => {
      if (typeof id !== "string" || !id.trim()) {
        addError(`${type}:empty-id`, `معرّف ${type} غير صالح أو فارغ.`, `${type} ID is empty or invalid.`);
        return;
      }
      if (allIds.has(id)) {
        addError(`${type}:duplicate-id:${id}`, `المعرّف مكرر: ${id}`, `Duplicate ID found: ${id}`, { id, type });
      }
      allIds.add(id);
    };

    (candidateStore.levels as Array<{ id: string }>).forEach((l) => { checkDuplicateId(l.id, "level"); levelIds.add(l.id); });
    (candidateStore.stations as Array<{ id: string }>).forEach((s) => { checkDuplicateId(s.id, "station"); stationIds.add(s.id); });
    (candidateStore.drills as Array<{ id: string }>).forEach((d) => { checkDuplicateId(d.id, "drill"); drillIds.add(d.id); });
    (candidateStore.gates as Array<{ id: string }>).forEach((g) => { checkDuplicateId(g.id, "gate"); gateIds.add(g.id); });

    // Parent & Referential Integrity Validation
    (candidateStore.stations as Array<{ id: string; levelId: string }>).forEach((s) => {
      if (!levelIds.has(s.levelId)) {
        addError(`station:missing-level:${s.levelId}`, `المحطة ${s.id} ترتبط بمستوى غير موجود: ${s.levelId}`, `Station ${s.id} references missing level: ${s.levelId}`, { stationId: s.id, levelId: s.levelId });
      }
    });

    (candidateStore.drills as Array<{ id: string; stationId: string }>).forEach((d) => {
      if (!stationIds.has(d.stationId)) {
        addError(`drill:missing-station:${d.stationId}`, `التمرين ${d.id} يرتبط بمحطة غير موجودة: ${d.stationId}`, `Drill ${d.id} references missing station: ${d.stationId}`, { drillId: d.id, stationId: d.stationId });
      }
    });

    (candidateStore.gates as Array<{ id: string; fromStationId: string; nextStationId?: string }>).forEach((g) => {
      if (!stationIds.has(g.fromStationId)) {
        addError(`gate:missing-source:${g.fromStationId}`, `البوابة ${g.id} ترتبط بمحطة مصدر غير موجودة: ${g.fromStationId}`, `Gate ${g.id} references missing source station: ${g.fromStationId}`, { gateId: g.id, fromStationId: g.fromStationId });
      }
      if (g.nextStationId && !stationIds.has(g.nextStationId)) {
        addError(`gate:missing-target:${g.nextStationId}`, `البوابة ${g.id} ترتبط بمحطة هدف غير موجودة: ${g.nextStationId}`, `Gate ${g.id} references missing target station: ${g.nextStationId}`, { gateId: g.id, nextStationId: g.nextStationId });
      }
      if (g.fromStationId === g.nextStationId) {
        addError(`gate:self-loop:${g.id}`, `البوابة ${g.id} تشير إلى نفس المحطة (Self-loop).`, `Gate ${g.id} points to its own station (self-loop).`, { gateId: g.id });
      }
    });

    // Check circular progression in gates (edge traversal only)
    const cycleCheck = detectCircularProgression(candidateStore.gates as GateEntity[]);
    if (cycleCheck.hasCycle) {
      addError(
        "cycle-detected",
        `تم اكتشاف مسار تكراري في البوابات (${cycleCheck.cyclePath.join(" → ")}). الاستيراد متوقف.`,
        `Circular progression loop detected in Gates (${cycleCheck.cyclePath.join(" → ")}). Import blocked.`,
        { path: cycleCheck.cyclePath.join(" → ") },
      );
    }

    if (errors.length > 0) {
      return { valid: false, errors, warnings, rawErrors };
    }

    const importedStore = migrateCurriculumSuiteStore(candidateStore);
    return {
      valid: true,
      errors: [],
      warnings: [],
      rawErrors: [],
      importedStore,
    };
  } catch (err) {
    addError("json-syntax-error", `خطأ في صياغة JSON: ${(err as Error).message}`, `JSON Syntax Error: ${(err as Error).message}`);
    return {
      valid: false,
      errors,
      warnings,
      rawErrors,
    };
  }
}
