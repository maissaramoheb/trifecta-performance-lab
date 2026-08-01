import { b, type Bi } from "./content";
import type {
  CurriculumSuiteStore,
  CycleCheckResult,
  DrillEntity,
  GateEntity,
  ImportValidationResult,
  LevelEntity,
  StationEntity,
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
      id: "level-foundation",
      name: b("المستوى 1 · بناء الـBaseline", "Level 1 · Build the baseline"),
      outcome: b(
        "يحدد المتدرب المطلوب، ينفذ أداءً آمنًا في شرط أساسي، ويوثق الدليل دون خلطه بالافتراض.",
        "The learner identifies the requirement, performs safely at baseline, and records evidence without mixing it with assumptions.",
      ),
      stations: [
        {
          id: "station-requirement",
          name: b("المحطة 1 · قراءة المتطلب", "Station 1 · Read the requirement"),
          purpose: b("تحويل الـBrief والمعيار إلى سلوك يمكن ملاحظته.", "Turn the brief and standard into observable behaviour."),
          requirement: b("يشرح المطلوب ويحدد بند الأمان الحاسم قبل الأداء.", "Explain the requirement and identify the critical safety item before performance."),
          baseline: b("Brief قصير، دون وقت أو حمل إضافي.", "Short brief with no added time or load."),
          drills: [
            drill("drill-brief-back", b("Drill 1 · Brief-Back", "Drill 1 · Brief-back"), b("التحقق من استرجاع الشرط الحاسم.", "Check recall of the critical condition."), b("بعد Brief واحد ودون مساعدة.", "After one brief and without prompting."), b("الكلمات التي استرجعها المتدرب كما قيلت.", "The learner’s recalled words as stated."), "Cognitive", "Cognitive"),
            drill("drill-evidence-sort", b("Drill 2 · دليل أم افتراض", "Drill 2 · Evidence or assumption"), b("فصل ما شوهد عن تفسيره.", "Separate what was observed from its interpretation."), b("ثلاث عبارات أداء قصيرة.", "Three short performance statements."), b("تصنيف كل عبارة مع سبب قابل للمراجعة.", "Classification of each statement with a reviewable reason."), "Cognitive", "Cognitive"),
            drill("drill-safety-cue", b("Drill 3 · الاستجابة للـCue", "Drill 3 · Respond to the cue"), b("إظهار سلوك الأمان المطلوب في شرط أساسي.", "Demonstrate the required safety behaviour at baseline."), b("Cue واحد معروف، دون Timer.", "One known cue, without a timer."), b("توقيت الاستجابة وبند الـChecklist الحاسم.", "Response timing and the critical checklist item."), "Affective", "Technical"),
          ],
        },
        {
          id: "station-stability",
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
        { id: "gate-foundation-1", fromStationId: "station-requirement", toStationId: "station-stability", requirement: b("كل Drill له دليل، ولا يوجد Critical Failure، والشرط الحاسم مسترجع ومطبق.", "Every drill has evidence, no Critical Failure occurred, and the critical condition was recalled and applied.") },
        { id: "gate-foundation-2", fromStationId: "station-stability", toStationId: "station-diagnosis", requirement: b("الأداء مستقل ومتكرر، ومقدار الدعم وأي عدم اتساق موثقان.", "Performance is independent and repeatable, with support and inconsistency documented.") },
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
// V2.1 Curriculum Builder Suite Store & Migration
// ==========================================

export function createInitialCurriculumSuiteStore(): CurriculumSuiteStore {
  const now = new Date().toISOString();

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

      if (gateForStation) {
        gates.push({
          id: gateForStation.id,
          fromStationId: gateForStation.fromStationId,
          nextStationId: gateForStation.toStationId,
          requirement: gateForStation.requirement,
          evidenceRequired: gateForStation.requirement,
          mandatoryCriteria: gateForStation.requirement,
          criticalFailures: b("أي خرق حرج ينتج No-Go تلقائيًا", "Any critical breach automatically produces No-Go"),
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
          updatedAt: now,
        });
      } else {
        // Last station in level has an outgoing gate pointing to next level's first station if available
        const nextStation = sIndex < lvl.stations.length - 1 ? lvl.stations[sIndex + 1] : undefined;
        gates.push({
          id: gateId,
          fromStationId: st.id,
          nextStationId: nextStation ? nextStation.id : undefined,
          requirement: st.requirement,
          evidenceRequired: st.requirement,
          mandatoryCriteria: st.requirement,
          criticalFailures: b("أي خرق حرج ينتج No-Go تلقائيًا", "Any critical breach automatically produces No-Go"),
          goConditions: b("استكمال أدلة المحطة بنجاح", "Successfully complete station evidence"),
          noGoConditions: b("حدوث خرق حرج للأمان", "Critical safety breach occurred"),
          needMoreDataConditions: b("بيانات غير كافية للقرار", "Insufficient data for decision"),
          remediation: b("مراجعة الـBaseline والـRetest", "Review Baseline and Retest"),
          retestRequirements: b("Retest مستقل", "Independent retest"),
          resetConditions: b("تصفير الـVariables", "Reset variables"),
          decisionRationale: b("مبني على الأدلة الملاحظة", "Based on observable evidence"),
          nextPermittedAction: b("التقدم أو المعالجة", "Progress or remediate"),
          decision: "pending",
          decisionEvidence: "",
          updatedAt: now,
        });
      }
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

export function migrateCurriculumSuiteStore(value: unknown): CurriculumSuiteStore {
  const initial = createInitialCurriculumSuiteStore();
  if (!value || typeof value !== "object") return initial;

  const candidate = value as Record<string, unknown>;

  // Back up previous localStorage if running in browser
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const currentRaw = localStorage.getItem("performance-lab-state");
      if (currentRaw) {
        localStorage.setItem("performance-lab-state-backup-v2", currentRaw);
      }
    } catch {
      // Storage backup attempt ignore error
    }
  }

  // Preserve unknown legacy keys
  const knownKeys = new Set([
    "schemaVersion", "activeTab", "activeLevelId", "activeStationId",
    "activeDrillId", "activeGateId", "levels", "stations", "drills", "gates", "unknownLegacyFields",
  ]);

  const unknownLegacyFields: Record<string, unknown> = { ...(candidate.unknownLegacyFields as Record<string, unknown> ?? {}) };
  for (const [key, val] of Object.entries(candidate)) {
    if (!knownKeys.has(key)) {
      unknownLegacyFields[key] = val;
    }
  }

  const levels: LevelEntity[] = Array.isArray(candidate.levels) && candidate.levels.length
    ? (candidate.levels as LevelEntity[])
    : initial.levels;

  const stations: StationEntity[] = Array.isArray(candidate.stations) && candidate.stations.length
    ? (candidate.stations as StationEntity[])
    : initial.stations;

  const drills: DrillEntity[] = Array.isArray(candidate.drills) && candidate.drills.length
    ? (candidate.drills as DrillEntity[])
    : initial.drills;

  const gates: GateEntity[] = Array.isArray(candidate.gates) && candidate.gates.length
    ? (candidate.gates as GateEntity[]).map((g) => ({
        ...g,
        // Rule: NEVER infer a 'go' decision on ambiguous or missing legacy data
        decision: g.decision === "go" || g.decision === "no-go" || g.decision === "need-more-data" || g.decision === "retest"
          ? g.decision
          : "pending",
      }))
    : initial.gates;

  const validTabs: CurriculumSuiteStore["activeTab"][] = ["level", "station", "drill", "gate"];
  const activeTab = validTabs.includes(candidate.activeTab as CurriculumSuiteStore["activeTab"])
    ? (candidate.activeTab as CurriculumSuiteStore["activeTab"])
    : "level";

  const activeLevelId = typeof candidate.activeLevelId === "string" && levels.some((l) => l.id === candidate.activeLevelId)
    ? candidate.activeLevelId
    : levels[0]?.id ?? initial.activeLevelId;

  const activeStationId = typeof candidate.activeStationId === "string" && stations.some((s) => s.id === candidate.activeStationId)
    ? candidate.activeStationId
    : stations[0]?.id ?? initial.activeStationId;

  const activeDrillId = typeof candidate.activeDrillId === "string" && drills.some((d) => d.id === candidate.activeDrillId)
    ? candidate.activeDrillId
    : drills[0]?.id ?? initial.activeDrillId;

  const activeGateId = typeof candidate.activeGateId === "string" && gates.some((g) => g.id === candidate.activeGateId)
    ? candidate.activeGateId
    : gates[0]?.id ?? initial.activeGateId;

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
    unknownLegacyFields: Object.keys(unknownLegacyFields).length ? unknownLegacyFields : undefined,
  };
}

// ==========================================
// Circular Progression & Integrity Checks
// ==========================================

export function detectCircularProgression(gates: GateEntity[]): CycleCheckResult {
  const adj = new Map<string, string[]>();
  for (const g of gates) {
    if (g.fromStationId && g.nextStationId) {
      const existing = adj.get(g.fromStationId) ?? [];
      existing.push(g.nextStationId);
      adj.set(g.fromStationId, existing);
    }
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

// Integrity deletion safety checks
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

  return {
    ...store,
    levels: nextLevels,
    stations: nextStations,
    drills: nextDrills,
    gates: nextGates,
    activeStationId,
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

  return {
    ...store,
    levels: nextLevels,
    stations: nextStations,
    drills: nextDrills,
    gates: nextGates,
    activeLevelId,
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

// Import / Export JSON helpers
export function exportCurriculumSuiteJSON(store: CurriculumSuiteStore): string {
  return JSON.stringify({
    exportedAt: new Date().toISOString(),
    generator: "Trifecta Performance Lab V2.1",
    store,
  }, null, 2);
}

export function validateAndImportCurriculumSuiteJSON(jsonString: string): ImportValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== "object") {
      return { valid: false, errors: ["Invalid JSON payload format."], warnings };
    }

    const candidateStore = parsed.store ?? parsed;
    if (!candidateStore || typeof candidateStore !== "object") {
      return { valid: false, errors: ["JSON payload missing valid store object."], warnings };
    }

    if (!Array.isArray(candidateStore.levels)) {
      errors.push("Missing 'levels' array.");
    }
    if (!Array.isArray(candidateStore.stations)) {
      errors.push("Missing 'stations' array.");
    }
    if (!Array.isArray(candidateStore.drills)) {
      errors.push("Missing 'drills' array.");
    }
    if (!Array.isArray(candidateStore.gates)) {
      errors.push("Missing 'gates' array.");
    }

    if (errors.length > 0) {
      return { valid: false, errors, warnings };
    }

    // Check for circular progression in gates
    const cycleCheck = detectCircularProgression(candidateStore.gates as GateEntity[]);
    if (cycleCheck.hasCycle) {
      warnings.push(`Warning: Circular progression loop detected in imported Gates (${cycleCheck.cyclePath.join(" → ")}).`);
    }

    const importedStore = migrateCurriculumSuiteStore(candidateStore);
    return {
      valid: true,
      errors: [],
      warnings,
      importedStore,
    };
  } catch (err) {
    return {
      valid: false,
      errors: [`JSON Syntax Error: ${(err as Error).message}`],
      warnings,
    };
  }
}
