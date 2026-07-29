import { b, type Bi } from "./content";

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
  rating: DrillRating;
  evidence: string;
  criticalFailure: boolean;
};

export type GateRecord = {
  decision: GateDecision;
  evidence: string;
  remediation: string;
};

export type CurriculumProgress = {
  schemaVersion: 1;
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
    schemaVersion: 1,
    activeLevelId: trainerCurriculum.levels[0].id,
    activeStationId: trainerCurriculum.levels[0].stations[0].id,
    drills: {},
    gates: {},
  };
}
