"use client";

import { useEffect, useMemo, useState } from "react";
import {
  affectiveLevels,
  b,
  cases,
  cognitiveFamilies,
  cognitiveLevels,
  knowledgeChecks,
  psychomotorLevels,
  references,
  routes,
  type Bi,
  type Lang,
  type Level,
} from "../lib/content";

type Mode = "learner" | "instructor";
type SavedState = {
  lang: Lang;
  mode: Mode;
  completedCases: number[];
  quizAnswers: Record<number, number>;
  objective?: ObjectiveState;
  station?: StationState;
};

type ObjectiveState = {
  requirement: string; gap: string; domain: string; level: string; behaviour: string;
  condition: string; criterion: string; critical: string; evidence: string;
  behaviourEn: string; conditionEn: string; criterionEn: string; criticalEn: string; evidenceEn: string;
};

type StationState = {
  name: string; requirement: string; domain: string; level: string; primary: string; secondary: string;
  baseline: string; variables: string; time: string; cognitive: string; physical: string; behaviour: string;
  checklist: string; critical: string; standard: string; data: string; aar: string; remediation: string; retest: string;
  safetyGate: boolean;
};

const initialObjective: ObjectiveState = {
  requirement: "", gap: "", domain: "Cognitive", level: "Apply", behaviour: "", condition: "",
  criterion: "", critical: "", evidence: "", behaviourEn: "", conditionEn: "", criterionEn: "",
  criticalEn: "", evidenceEn: "",
};
const initialStation: StationState = {
  name: "", requirement: "", domain: "Psychomotor", level: "Precision", primary: "Technical",
  secondary: "Cognitive", baseline: "", variables: "", time: "", cognitive: "", physical: "", behaviour: "",
  checklist: "", critical: "", standard: "", data: "", aar: "", remediation: "", retest: "", safetyGate: true,
};

const labels = {
  ar: {
    skip: "انتقل إلى المحتوى", menu: "القائمة", learner: "وضع المتعلم", instructor: "وضع المدرب",
    print: "طباعة / حفظ PDF", source: "مستند داخلي", recommendation: "توصية تطبيقية", next: "التالي",
    previous: "السابق", save: "محفوظ محليًا", evidence: "الدليل الملاحظ", assumption: "الافتراض",
    facts: "حقائق ملاحظة", reveal: "اعرض الإجابة النموذجية", select: "اختر", warnings: "تنبيهات الجودة",
    empty: "ابدأ بإدخال البيانات المطلوبة.", download: "تصدير JSON", progress: "التقدم",
  },
  en: {
    skip: "Skip to content", menu: "Menu", learner: "Learner mode", instructor: "Instructor mode",
    print: "Print / save PDF", source: "Internal source", recommendation: "Applied recommendation", next: "Next",
    previous: "Previous", save: "Saved on this device", evidence: "Observable evidence", assumption: "Assumption",
    facts: "Observed facts", reveal: "Reveal model answer", select: "Select", warnings: "Quality warnings",
    empty: "Start by entering the required information.", download: "Export JSON", progress: "Progress",
  },
};

function local<T extends Bi>(value: T | string, lang: Lang): string {
  if (typeof value === "string") return value;
  return value[lang];
}

function Badge({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "safe" | "danger" | "source" }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function SectionHead({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return <header className="section-head">
    <div className="eyebrow">{eyebrow}</div>
    <h1>{title}</h1>
    <p>{intro}</p>
  </header>;
}

function SourceMark({ lang, applied = false }: { lang: Lang; applied?: boolean }) {
  return <Badge tone={applied ? "default" : "source"}>{applied ? labels[lang].recommendation : labels[lang].source}</Badge>;
}

function MiniLabel({ children }: { children: React.ReactNode }) {
  return <span className="mini-label">{children}</span>;
}

function LevelCards({ levels, lang, affective = false }: { levels: Level[]; lang: Lang; affective?: boolean }) {
  const [active, setActive] = useState(0);
  const level = levels[active];
  const items = [
    [b("التعريف العملي", "Plain definition"), level.definition],
    [b("ما يلاحظه المدرب", "Observable evidence"), level.evidence],
    [b("مثال تدريبي", "Training example"), level.example],
    [b("نشاط مناسب", "Suitable activity"), level.activity],
    [b("طريقة التقييم", "Assessment method"), level.assessment],
    [b("خطأ شائع", "Common trainer mistake"), level.mistake],
    [b("هدف SMART نموذجي", "Sample SMART objective"), level.objective],
  ];
  return <div className="explorer">
    <div className="level-rail" role="tablist" aria-label={local(b("مستويات التعلم", "Learning levels"), lang)}>
      {levels.map((x, i) => <button key={local(x.name, "en")} role="tab" aria-selected={active === i} onClick={() => setActive(i)}>
        <span>{String(i + 1).padStart(2, "0")}</span>{local(x.name, lang)}
      </button>)}
    </div>
    <article className="level-detail" aria-live="polite">
      <div className="card-top"><SourceMark lang={lang}/><span className="level-number">{active + 1}/{levels.length}</span></div>
      <h3>{local(level.name, lang)}</h3>
      <div className="detail-grid">
        {items.map(([label, value], i) => <div key={i} className={i === items.length - 1 ? "detail wide" : "detail"}>
          <MiniLabel>{local(label, lang)}</MiniLabel>
          <p>{local(value, lang)}</p>
        </div>)}
      </div>
      {affective && <div className="boundary-note">{local(b("نقيّم سلوكًا ملاحظًا ومتكررًا؛ لا نصف شخصية ولا نشخّص حالة نفسية.", "Assess repeated observable behaviour; do not label personality or diagnose psychology."), lang)}</div>}
    </article>
  </div>;
}

function TrifectaInstrument({ lang }: { lang: Lang }) {
  const [active, setActive] = useState<"physical" | "technical" | "cognitive">("technical");
  const pillars = {
    physical: {
      code: "P",
      name: b("بدني", "Physical"),
      prompt: b("هل الجسم يدعم المهمة ويحافظ على الأداء؟", "Can the body support the task and retain performance?"),
    },
    technical: {
      code: "T",
      name: b("فني", "Technical"),
      prompt: b("هل الناتج صحيح وآمن وثابت وقابل للتكرار؟", "Is the output correct, safe, stable, and repeatable?"),
    },
    cognitive: {
      code: "C",
      name: b("ذهني", "Cognitive"),
      prompt: b("هل لاحظ وتذكّر وقرّر وحوّل القرار إلى فعل؟", "Did the performer notice, remember, decide, and turn the decision into action?"),
    },
  };
  const current = pillars[active];
  return <aside className="trifecta-instrument card-role-feature" aria-label={local(b("مؤشر أعمدة الأداء", "Performance pillar instrument"), lang)}>
    <div className="instrument-head">
      <span>PERFORMANCE / 03</span>
      <SourceMark lang={lang}/>
    </div>
    <div className="tri-stage">
      <div className="tri-core" aria-hidden="true"><span>TRI</span></div>
      {(Object.keys(pillars) as Array<keyof typeof pillars>).map(key => <button
        key={key}
        className={`tri-node tri-node-${key}`}
        aria-pressed={active === key}
        onClick={() => setActive(key)}
      ><bdi>{pillars[key].code}</bdi><span>{local(pillars[key].name, lang)}</span></button>)}
      <div className="scan-line" aria-hidden="true"/>
    </div>
    <div className="instrument-readout" aria-live="polite">
      <span>ACTIVE LENS · <bdi>{current.code}</bdi></span>
      <strong>{local(current.name, lang)}</strong>
      <p>{local(current.prompt, lang)}</p>
    </div>
  </aside>;
}

function Overview({ lang, go }: { lang: Lang; go: (x: string) => void }) {
  const comparisons = [
    [b("إحنا عايزين نبني إيه؟", "What are we trying to build?"), b("ليه الأداء الفعلي نجح أو فشل؟", "Why did actual performance succeed or fail?")],
    [b("الأهداف وتصميم الدروس", "Objectives and lesson design"), b("المحطات وتشخيص الأداء", "Stations and performance diagnosis")],
    [b("معرفة، مهارة، وقيم", "Knowledge, skill, and values"), b("بدني، فني، وذهني", "Physical, technical, and cognitive")],
    [b("تدرج التعلم", "Progression of learning"), b("الأداء تحت الظروف الفعلية", "Performance under actual conditions")],
  ];
  const examples = [
    b("نتيجة دقيقة مع خرق أمان", "Accurate result with a safety violation"),
    b("أداء بطيء جيد ينهار مع Timer", "Good slow performance that collapses with a timer"),
    b("معرفة صحيحة دون التزام ثابت", "Correct knowledge without consistent compliance"),
    b("تكنيك صحيح مع قرار خاطئ", "Correct technique with a wrong decision"),
  ];
  return <div>
    <section className="hero">
      <div className="hero-copy">
        <Badge tone="source">{local(b("نظام تطوير المدربين", "Trainer development system"), lang)}</Badge>
        <h1>{local(b("اقرأ الأداء كاملًا.", "Read the whole performance."), lang)}</h1>
        <p className="hero-lead">{local(b("Learning Domains بتحدد إحنا عايزين نبني إيه داخل المتدرب. والـTrifecta بتساعدنا نفهم الأداء الفعلي نجح أو فشل ليه.", "Learning Domains define what we want to build in the learner. The Trifecta helps explain why actual performance succeeded or failed."), lang)}</p>
        <div className="hero-actions">
          <button className="primary" onClick={() => go("domains")}>{local(b("ابدأ بالإطارين", "Explore the frameworks"), lang)}</button>
          <button className="secondary" onClick={() => go("cases")}>{local(b("افتح معمل الحالات", "Open the case lab"), lang)}</button>
        </div>
      </div>
      <TrifectaInstrument lang={lang}/>
    </section>

    <section className="metric-deck" aria-label={local(b("نطاق المنصة", "Platform scope"), lang)}>
      {[
        ["03", b("مجالات تعلم", "Learning domains"), b("معرفة · مهارة · سلوك", "Knowledge · skill · behaviour")],
        ["03", b("أعمدة أداء", "Performance pillars"), b("بدني · فني · ذهني", "Physical · technical · cognitive")],
        ["10", b("عائلات ذهنية", "Cognitive families"), b("من الإدراك إلى الاستعادة", "From perception to recovery")],
      ].map(([value, title, note]) => <article className="metric-card card-role-metric" key={local(title as Bi, "en")}>
        <strong>{value as string}</strong><div><span>{local(title as Bi, lang)}</span><small>{local(note as Bi, lang)}</small></div>
      </article>)}
    </section>

    <section className="workflow-rail" aria-label={local(b("سلسلة الأداء", "Performance evidence chain"), lang)}>
      <div className="workflow-line" aria-hidden="true"/>
      <div className="workflow-steps">
        {[
          b("متطلب", "Requirement"), b("تعلم", "Learning"), b("محطة", "Station"),
          b("دليل", "Evidence"), b("تشخيص", "Diagnosis"), b("تحسين", "Improve"),
        ].map((x, i) => <div key={i}><span>{String(i + 1).padStart(2, "0")}</span><strong>{local(x, lang)}</strong></div>)}
      </div>
    </section>

    <section className="result-warning">
      <div className="result-score"><span>01</span><strong>{local(b("نتيجة واحدة", "One result"), lang)}</strong></div>
      <div>
        <h2>{local(b("النتيجة الواحدة لا تشرح الأداء الكامل.", "One result does not explain total performance."), lang)}</h2>
        <p>{local(b("الدقة قد تخفي خرق أمان. السرعة قد تخفي قرارًا خاطئًا. والنجاح مرة واحدة لا يثبت الثبات. القياس الجزئي يصنع تشخيصًا ناقصًا وتدخلًا خاطئًا.", "Accuracy can hide a safety violation. Speed can hide a wrong decision. One successful attempt does not prove stability. Partial measurement creates incomplete diagnosis and the wrong intervention."), lang)}</p>
      </div>
    </section>

    <section className="comparison-block">
      <div className="section-kicker">{local(b("إطاران متكاملان · عدستان مختلفتان", "Complementary frameworks · different lenses"), lang)}</div>
      <div className="compare-head"><h2>Learning Domains</h2><h2>Trifecta</h2></div>
      {comparisons.map((row, i) => <div className="compare-row" key={i}><div>{local(row[0], lang)}</div><div>{local(row[1], lang)}</div></div>)}
    </section>

    <section className="example-grid">
      {examples.map((x, i) => <button key={i} onClick={() => go("cases")} className="example-card">
        <span>0{i + 1}</span><p>{local(x, lang)}</p><strong>↗</strong>
      </button>)}
    </section>
  </div>;
}

function Domains({ lang }: { lang: Lang }) {
  const [domain, setDomain] = useState<"cognitive" | "psychomotor" | "affective">("cognitive");
  const meta = {
    cognitive: {
      title: b("المجال المعرفي", "Cognitive Domain"),
      intro: b("من استرجاع القاعدة إلى تحسين درس أو محطة بالدليل.", "From recalling a rule to improving a lesson or station with evidence."),
      levels: cognitiveLevels,
    },
    psychomotor: {
      title: b("المجال المهاري", "Psychomotor Domain"),
      intro: b("رحلة المهارة من التقليد إلى أداء ثابت وطبيعي. المحاولة الناجحة لا تعني أن المهارة ثبتت.", "The skill journey from imitation to stable, naturalized performance. A successful attempt does not mean the skill is stable."),
      levels: psychomotorLevels,
    },
    affective: {
      title: b("المجال السلوكي", "Affective Domain"),
      intro: b("نحوّل الأمان والانضباط والمسؤولية وقبول التصحيح إلى سلوك ملاحظ ومتكرر.", "Turn safety, discipline, responsibility, and acceptance of correction into observable, repeated behaviour."),
      levels: affectiveLevels,
    },
  };
  const current = meta[domain];
  return <>
    <SectionHead eyebrow="Learning Domains" title={local(current.title, lang)} intro={local(current.intro, lang)}/>
    <div className="segmented large" role="tablist">
      {Object.entries(meta).map(([key, value]) => <button role="tab" aria-selected={domain === key} key={key} onClick={() => setDomain(key as typeof domain)}>{local(value.title, lang)}</button>)}
    </div>
    <LevelCards key={domain} levels={current.levels} lang={lang} affective={domain === "affective"}/>
  </>;
}

function Trifecta({ lang }: { lang: Lang }) {
  const [pillar, setPillar] = useState<"physical" | "technical" | "cognitive">("physical");
  const physical = [
    [b("جاهزية أساسية", "Basic readiness"), b("هل الجسم جاهز للمهمة المحددة؟", "Is the body ready for the defined task?")],
    [b("ثبات وتحكم", "Balance and control"), b("هل يحافظ على التوازن دون توتر عضلي زائد؟", "Can balance be maintained without excessive tension?")],
    [b("تحمل تدريجي", "Progressive endurance"), b("متى يبدأ الأداء في الانخفاض عبر التكرار؟", "When does performance decline across repetitions?")],
    [b("استعادة", "Recovery"), b("هل يعود للـBaseline بعد Reset محدد؟", "Does performance return to baseline after a defined reset?")],
    [b("ثبات تحت الضغط", "Retention under pressure"), b("هل يدعم الجسم الأداء بعد حمل مضبوط؟", "Can the body support performance after controlled load?")],
  ];
  const technical = [
    b("هل الأداء صحيح؟", "Is it correct?"), b("هل هو آمن؟", "Is it safe?"), b("هل هو دقيق؟", "Is it accurate?"),
    b("هل هو ثابت؟", "Is it stable?"), b("هل هو قابل للتكرار؟", "Is it repeatable?"), b("هل يطابق المعيار؟", "Does it meet the defined standard?"),
  ];
  return <>
    <SectionHead eyebrow="The Trifecta" title={local(b("تشخيص الأداء الفعلي", "Diagnose actual performance"), lang)} intro={local(b("الجسم، الناتج الفني، والمنظومة الذهنية يعملون معًا. لا نختزل الفشل في كلمة «ضغط».", "Body, technical output, and cognitive system work together. Do not compress failure into the word “pressure.”"), lang)}/>
    <div className="segmented large">
      <button aria-pressed={pillar === "physical"} onClick={() => setPillar("physical")}>{local(b("الأداء البدني", "Physical"), lang)}</button>
      <button aria-pressed={pillar === "technical"} onClick={() => setPillar("technical")}>{local(b("الأداء الفني", "Technical"), lang)}</button>
      <button aria-pressed={pillar === "cognitive"} onClick={() => setPillar("cognitive")}>{local(b("الذهني / العصبي", "Cognitive / Neurophysiological"), lang)}</button>
    </div>
    {pillar === "physical" && <div className="pillar-layout">
      <article className="definition-card"><SourceMark lang={lang}/><h2>{local(b("مش لياقة عامة فقط.", "Not general fitness alone."), lang)}</h2><p>{local(b("Physical Performance يعني: هل الجسم يقدر يدعم الأداء المطلوب؟ العلامات الملاحظة تشمل فقدان التوازن، توترًا عضليًا زائدًا، تدهورًا عبر التكرار، استعادة بطيئة، أو انهيارًا بعد حمل مضبوط.", "Physical Performance asks whether the body can support the required task. Observable signs include loss of balance, excessive muscular tension, decline across repetitions, slow recovery, or collapse after controlled load."), lang)}</p></article>
      <div className="progression-list">{physical.map((x, i) => <div key={i}><span>0{i + 1}</span><h3>{local(x[0], lang)}</h3><p>{local(x[1], lang)}</p></div>)}</div>
    </div>}
    {pillar === "technical" && <div className="pillar-layout">
      <article className="definition-card"><SourceMark lang={lang}/><h2>Psychomotor ≠ Technical Performance</h2><div className="split-quote"><p><strong>Psychomotor</strong><br/>{local(b("المهارة بتتطور إزاي؟", "How is the skill developing?"), lang)}</p><p><strong>Technical</strong><br/>{local(b("هل الناتج الفني الفعلي طابق المعيار؟", "Did the actual technical output meet the standard?"), lang)}</p></div></article>
      <div className="question-grid">{technical.map((x, i) => <div key={i}><span>0{i + 1}</span><strong>{local(x, lang)}</strong></div>)}</div>
    </div>}
    {pillar === "cognitive" && <CognitiveExplorer lang={lang}/>}
  </>;
}

function CognitiveExplorer({ lang }: { lang: Lang }) {
  const [active, setActive] = useState(0);
  const item = cognitiveFamilies[active];
  const phases = [
    { number: "I", name: b("الإدراك والتحكم الذهني", "Perception and mental control"), codes: ["SA", "CLM"] },
    { number: "II", name: b("اتخاذ القرار والتنفيذ", "Decision and execution"), codes: ["DMUS", "WMTR", "CFA"] },
    { number: "III", name: b("التزامن الانفعالي والبدني", "Emotional and physical synchronization"), codes: ["ERSI", "MCC", "RSVMI"] },
    { number: "IV", name: b("الاستمرار تحت الظروف الصعبة", "Sustained performance under extremes"), codes: ["FRFRC", "SCR"] },
  ];
  const activePhase = phases.findIndex(phase => phase.codes.includes(item.code));
  const fields = [
    [b("التعريف البسيط", "Simple definition"), item.definition],
    [b("السؤال التشغيلي", "Operational question"), item.question],
    [b("الدليل الملاحظ", "Observable evidence"), item.evidence],
    [b("مقياس مناسب", "Suitable metric"), item.metric],
    [b("تشخيص خاطئ شائع", "Common misdiagnosis"), item.misdiagnosis],
    [b("تفسير بديل", "Alternative explanation"), item.alternative],
    [b("تدريب آمن", "Safe training method"), item.method],
    [b("حدود التفسير", "Interpretation limit"), item.limit],
  ];
  return <div className="cognitive-explorer">
    <div className="phase-map card-role-diagnostic">
      <div className="phase-map-head"><div><MiniLabel>{local(b("الخريطة التشغيلية", "Operational map"), lang)}</MiniLabel><h2>{local(b("أربع مراحل · عشر عائلات", "Four phases · ten families"), lang)}</h2></div><SourceMark lang={lang}/></div>
      <div className="phase-track" role="tablist" aria-label={local(b("مراحل الأداء الذهني", "Cognitive performance phases"), lang)}>
        {phases.map((phase, index) => <button
          key={phase.number}
          role="tab"
          aria-selected={activePhase === index}
          onClick={() => setActive(cognitiveFamilies.findIndex(family => family.code === phase.codes[0]))}
        ><span>PHASE {phase.number}</span><strong>{local(phase.name, lang)}</strong><small>{phase.codes.join(" · ")}</small></button>)}
      </div>
      <p className="phase-caution">{local(b("مش كل محطة لازم تقيس العشرة. حدّد العائلة المطلوبة، الدليل، وحدود التفسير قبل إضافة الحمل.", "Not every station should measure all ten. Define the target family, evidence, and interpretation limit before adding load."), lang)}</p>
    </div>
    <div className="family-grid">{cognitiveFamilies.map((x, i) => <button key={x.code} aria-pressed={active === i} onClick={() => setActive(i)}><strong>{x.code}</strong><span>{x.name}</span></button>)}</div>
    <article className="family-detail" key={item.code}>
      <div className="card-top"><Badge>{local(item.phase, lang)}</Badge><SourceMark lang={lang}/></div>
      <h2><bdi>{item.code}</bdi> — {item.name}</h2>
      <div className="detail-grid">{fields.map(([label, value], i) => <div className="detail" key={i}><MiniLabel>{local(label, lang)}</MiniLabel><p>{local(value, lang)}</p></div>)}</div>
      <div className="boundary-note">{local(b("أداة لتحليل الأداء والتدريب، وليست تقييمًا سريريًا أو عصبيًا. لا تشخّص من ملاحظة واحدة، ودوّن الأسباب الأساسية والثانوية والبيانات الناقصة.", "A performance-analysis and training tool, not a clinical or neurological assessment. Do not diagnose from one observation; record primary and secondary causes and missing data."), lang)}</div>
    </article>
  </div>;
}

function Comparison({ lang }: { lang: Lang }) {
  const domains = [
    b("ماذا يجب أن يعرف المتدرب؟", "What must the learner know?"), b("ما مستوى التفكير المطلوب؟", "What level of thinking is required?"),
    b("ما المهارة التي يجب بناؤها؟", "What skill must be developed?"), b("إلى أي درجة يجب أن تثبت؟", "How stable must it become?"),
    b("أي سلوك يجب أن يصبح ثابتًا؟", "What behaviour must be internalized?"), b("ما النشاط ومرحلة التعلم التالية؟", "What activity and next learning stage?"),
  ];
  const tri = [
    b("ليه الأداء الفعلي نجح أو فشل؟", "Why did actual performance succeed or fail?"), b("هل الجسم دعم المهمة؟", "Did the body support the task?"),
    b("هل الإجراء الفني ثبت؟", "Did the technical procedure remain stable?"), b("هل لاحظ وتذكر وقرر صح؟", "Did the performer notice, remember, and decide correctly?"),
    b("ما أول نقطة انهيار وما دليلي؟", "What was the first breakdown point and what supports it?"), b("ما السبب البديل والبيانات الناقصة؟", "What alternative and missing data remain?"),
  ];
  const patterns = [
    {
      code: "K",
      cause: b("المعيار غير معروف", "Standard not known"),
      evidence: b("لا يقدر يشرح المطلوب قبل المحاولة.", "Cannot explain the requirement before the trial."),
      intervention: b("شرح قصير + مثال + Brief-Back.", "Short explanation + example + brief-back."),
    },
    {
      code: "T",
      cause: b("المهارة غير ثابتة", "Skill is not stable"),
      evidence: b("الخطأ يظهر حتى في الـBaseline أو يتغير عشوائيًا.", "Error appears at baseline or varies randomly."),
      intervention: b("Demonstration + ممارسة موجهة + تكرار متعمد.", "Demonstration + guided practice + deliberate repetition."),
    },
    {
      code: "P",
      cause: b("الحمل كسر الأداء", "Load broke performance"),
      evidence: b("الأداء يبدأ قويًا ثم يتدهور مع التكرار ويعود بعد Reset.", "Performance starts strong, declines across repetitions, and returns after reset."),
      intervention: b("ضبط الجرعة + Recovery + Load Progression.", "Adjust dose + recovery + load progression."),
    },
    {
      code: "C",
      cause: b("القرار انهار تحت الوقت", "Decision collapsed under time"),
      evidence: b("الـBaseline ثابت، وأول خطأ ظهر بعد إضافة الوقت.", "Baseline is stable; the first error appears after time is added."),
      intervention: b("تقليل الحمل + Decision Practice + وقت تدريجي.", "Reduce load + decision practice + progressive time."),
    },
  ];
  return <>
    <SectionHead eyebrow={local(b("عدستان · حالة واحدة", "Two lenses · one case"), lang)} title={local(b("مركز المقارنة", "Domains vs Trifecta"), lang)} intro={local(b("Learning Domains تبني القدرة. Trifecta تقرأ الناتج تحت الشرط الفعلي.", "Learning Domains build capability. The Trifecta reads output under actual conditions."), lang)}/>
    <div className="dual-list">
      <article><h2>Learning Domains</h2>{domains.map((x, i) => <p key={i}><span>0{i + 1}</span>{local(x, lang)}</p>)}</article>
      <article><h2>Trifecta</h2>{tri.map((x, i) => <p key={i}><span>0{i + 1}</span>{local(x, lang)}</p>)}</article>
    </div>
    <article className="case-study">
      <div className="card-top"><Badge>Timer case</Badge><SourceMark lang={lang}/></div>
      <h2>{local(b("المعرفة موجودة. التنفيذ موجود. ثم دخل الوقت.", "Knowledge exists. Execution exists. Then time is added."), lang)}</h2>
      <p>{local(b("بدون ضغط: إجراء الأمان مفهوم ويُنفذ. مع Timer: نسي شرطًا، استعجل، فقد السيطرة، وارتكب Critical Safety Failure.", "Without pressure: the safety procedure is understood and performed. With a timer: one condition is forgotten, rushing appears, control is lost, and a Critical Safety Failure occurs."), lang)}</p>
      <div className="analysis-columns">
        <div><MiniLabel>Learning Domains</MiniLabel><ul><li>{local(b("المعرفة المعرفية موجودة.", "Cognitive knowledge exists."), lang)}</li><li>{local(b("الثبات المهاري تحت التعقيد غير مثبت.", "Psychomotor stability under complexity is not demonstrated."), lang)}</li><li>{local(b("الالتزام تحت الضغط غير مُثبت.", "Affective internalization under pressure is not demonstrated."), lang)}</li></ul></div>
        <div><MiniLabel>Trifecta</MiniLabel><ul><li>{local(b("السبب البدني غير مثبت.", "A physical cause is not demonstrated."), lang)}</li><li>{local(b("الناتج الفني انهار بعد دخول الوقت.", "Technical output collapsed after time was added."), lang)}</li><li>{local(b("CLM أو WMTR سبب أولي محتمل، لا تشخيص نهائي.", "CLM or WMTR is a plausible primary cause, not a final diagnosis."), lang)}</li></ul></div>
      </div>
      <div className="intervention-strip"><strong>{local(b("التدخل", "Intervention"), lang)}</strong><span>{local(b("Baseline → وقت تدريجي → عامل واحد → تسجيل أول انهيار → توقف عند Critical Failure → Reset → Retest", "Baseline → progressive time → one factor → record first breakdown → stop on Critical Failure → reset → retest"), lang)}</span></div>
    </article>
    <section className="diagnosis-deck">
      <div className="diagnosis-head"><div><MiniLabel>{local(b("نفس القرار · أسباب مختلفة", "Same decision · different causes"), lang)}</MiniLabel><h2>{local(b("أربع حالات No-Go لا تحتاج نفس العلاج", "Four No-Go cases do not need the same remedy"), lang)}</h2></div><SourceMark lang={lang}/></div>
      <div className="diagnosis-grid">{patterns.map(pattern => <article className="diagnosis-card card-role-comparison" key={pattern.code}>
        <span className="diagnosis-code">{pattern.code}</span>
        <h3>{local(pattern.cause, lang)}</h3>
        <p><MiniLabel>{local(b("الدليل الفارق", "Discriminating evidence"), lang)}</MiniLabel>{local(pattern.evidence, lang)}</p>
        <p><MiniLabel>{local(b("التدخل", "Intervention"), lang)}</MiniLabel>{local(pattern.intervention, lang)}</p>
      </article>)}</div>
    </section>
  </>;
}

function CaseLab({ lang, onComplete }: { lang: Lang; onComplete: (id: number) => void }) {
  const [index, setIndex] = useState(0);
  const [facts, setFacts] = useState<string[]>([]);
  const [domain, setDomain] = useState("");
  const [pillar, setPillar] = useState("");
  const [primary, setPrimary] = useState("");
  const [secondary, setSecondary] = useState("");
  const [missing, setMissing] = useState("");
  const [intervention, setIntervention] = useState("");
  const [decision, setDecision] = useState("");
  const [show, setShow] = useState(false);
  const item = cases[index];
  const reset = (next: number) => { setIndex(next); setFacts([]); setDomain(""); setPillar(""); setPrimary(""); setSecondary(""); setMissing(""); setIntervention(""); setDecision(""); setShow(false); };
  const toggleFact = (x: string) => setFacts(v => v.includes(x) ? v.filter(y => y !== x) : [...v, x]);
  const restraint = decision === "Need More Data" || missing.trim().length > 5;
  const score = [facts.length > 0, domain.length > 0, pillar.length > 0, primary.length > 4, secondary.length > 4, missing.length > 4, intervention.length > 4, decision.length > 0, restraint].filter(Boolean).length;
  return <>
    <SectionHead eyebrow={local(b("15 حالة · 3 مستويات", "15 cases · 3 levels"), lang)} title={local(b("معمل تشخيص الحالات", "Case diagnostic lab"), lang)} intro={local(b("لا نقاط لحفظ الاختصارات. المكافأة للدليل، ضبط التشخيص، البدائل، والتدخل المناسب.", "No points for acronym recall. Reward evidence, diagnostic restraint, alternatives, and the right intervention."), lang)}/>
    <div className="case-nav">
      <button disabled={index === 0} onClick={() => reset(index - 1)}>← {labels[lang].previous}</button>
      <div><span>{item.level}</span><strong>{index + 1} / {cases.length}</strong></div>
      <button disabled={index === cases.length - 1} onClick={() => reset(index + 1)}>{labels[lang].next} →</button>
    </div>
    <article className="lab-card">
      <div className="case-title"><span>{String(item.id).padStart(2, "0")}</span><div><h2>{local(item.title, lang)}</h2><p>{local(item.scenario, lang)}</p></div></div>
      <div className="lab-grid">
        <fieldset><legend>1 · {local(b("اختر الحقائق، لا الافتراضات", "Select facts, not assumptions"), lang)}</legend>
          {[...item.facts, ...item.assumptions].map((x, i) => <label className="check-row" key={i}><input type="checkbox" checked={facts.includes(local(x, lang))} onChange={() => toggleFact(local(x, lang))}/><span>{local(x, lang)}</span></label>)}
        </fieldset>
        <fieldset><legend>2 · Learning Domain + Trifecta</legend>
          <div className="field-row"><label>{local(b("المجال", "Domain"), lang)}<select value={domain} onChange={e => setDomain(e.target.value)}><option value="">{labels[lang].select}</option><option>Cognitive</option><option>Psychomotor</option><option>Affective</option></select></label>
          <label>{local(b("العمود", "Pillar"), lang)}<select value={pillar} onChange={e => setPillar(e.target.value)}><option value="">{labels[lang].select}</option><option>Physical</option><option>Technical</option><option>Cognitive</option></select></label></div>
        </fieldset>
        <fieldset><legend>3 · {local(b("سبب أساسي وثانوي", "Primary and secondary cause"), lang)}</legend>
          <label>{local(b("السبب الأساسي", "Primary"), lang)}<input value={primary} onChange={e => setPrimary(e.target.value)}/></label>
          <label>{local(b("السبب الثانوي / البديل", "Secondary / alternative"), lang)}<input value={secondary} onChange={e => setSecondary(e.target.value)}/></label>
        </fieldset>
        <fieldset><legend>4 · {local(b("البيانات والتدخل", "Evidence and intervention"), lang)}</legend>
          <label>{local(b("ما الدليل الناقص؟", "What evidence is missing?"), lang)}<textarea value={missing} onChange={e => setMissing(e.target.value)}/></label>
          <label>{local(b("التدخل المقترح", "Recommended intervention"), lang)}<textarea value={intervention} onChange={e => setIntervention(e.target.value)}/></label>
        </fieldset>
      </div>
      <fieldset className="decision-field"><legend>5 · {local(b("قرار التقييم", "Assessment decision"), lang)}</legend>
        {["Go","No-Go","Need More Data"].map(x => <label key={x}><input type="radio" name="decision" value={x} checked={decision === x} onChange={e => setDecision(e.target.value)}/><span>{x}</span></label>)}
      </fieldset>
      <div className="lab-actions"><div className="diagnostic-score"><span>{score}/9</span>{local(b("اكتمال منطقك", "reasoning completeness"), lang)}</div><button className="primary" onClick={() => { setShow(true); onComplete(item.id); }}>{labels[lang].reveal}</button></div>
      {show && <div className="model-answer" aria-live="polite">
        <div className="card-top"><Badge tone={item.decision === "No-Go" ? "danger" : "safe"}>{item.decision}</Badge><SourceMark lang={lang}/></div>
        <h3>{local(b("إجابة مبنية على الدليل", "Evidence-based model answer"), lang)}</h3>
        <div className="model-grid">
          <p><MiniLabel>{labels[lang].facts}</MiniLabel>{item.facts.map((x, i) => <span key={i}>• {local(x, lang)} </span>)}</p>
          <p><MiniLabel>Learning Domain / Trifecta</MiniLabel>{item.domain} / {item.pillar}</p>
          <p><MiniLabel>{local(b("أساسي / ثانوي", "Primary / secondary"), lang)}</MiniLabel>{local(item.primary, lang)} · {local(item.secondary, lang)}</p>
          <p><MiniLabel>{local(b("بيانات ناقصة", "Missing evidence"), lang)}</MiniLabel>{local(item.missing, lang)}</p>
          <p className="wide"><MiniLabel>{local(b("التدخل", "Intervention"), lang)}</MiniLabel>{local(item.intervention, lang)}</p>
        </div>
        <div className="boundary-note">{local(b("لو كانت إجابتك أكثر حسمًا من الدليل، ارجع واسأل: ما التفسير البديل؟ وما التجربة الأصغر التي تفرّق بين السببين؟", "If your answer is more certain than the evidence, ask: what is the alternative, and what smallest controlled trial would distinguish the causes?"), lang)}</div>
      </div>}
    </article>
  </>;
}

function Field({ label, value, onChange, area = false, placeholder = "" }: { label: string; value: string; onChange: (x: string) => void; area?: boolean; placeholder?: string }) {
  return <label>{label}{area ? <textarea dir="auto" value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}/> : <input dir="auto" value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}/>}</label>;
}

function ObjectiveBuilder({ lang, value, onChange }: { lang: Lang; value: ObjectiveState; onChange: (x: ObjectiveState) => void }) {
  const set = (key: keyof ObjectiveState, v: string) => onChange({ ...value, [key]: v });
  const warnings = useMemo(() => {
    const all = `${value.behaviour} ${value.requirement}`.toLowerCase();
    const out: string[] = [];
    if (/(يفهم|يعرف|يدرك|يكون منضبط|understand|know|be aware|be disciplined)/i.test(all)) out.push(local(b("الفعل غير ملاحظ. استبدله بسلوك يمكن رؤيته أو سماعه أو تسجيله.", "The verb is not observable. Replace it with behaviour that can be seen, heard, or recorded."), lang));
    if (!value.condition.trim()) out.push(local(b("لا يوجد شرط أداء محدد.", "No performance condition is defined."), lang));
    if (!value.criterion.trim()) out.push(local(b("لا يوجد معيار قابل للقياس.", "No measurable criterion is defined."), lang));
    if ((value.behaviour.match(/\sو\s/g) || []).length > 1 || (value.behaviour.match(/\band\b/gi) || []).length > 1) out.push(local(b("الهدف قد يجمع سلوكيات كثيرة. افصله إلى أكثر من هدف.", "The objective may combine too many behaviours. Split it."), lang));
    if (/diagnos|تشخ/i.test(all)) out.push(local(b("الهدف يخلط بناء التعلم بتشخيص الأداء.", "The objective may confuse learning with performance diagnosis."), lang));
    if (/[\u0600-\u06ff]/.test(`${value.behaviour}${value.condition}${value.criterion}`) && (!value.behaviourEn || !value.conditionEn || !value.criterionEn)) out.push(local(b("أضف المقابل الإنجليزي لإخراج ثنائي اللغة مكتمل.", "Add the English equivalents for a complete bilingual output."), lang));
    return out;
  }, [value, lang]);
  const ready = value.behaviour && value.condition && value.criterion;
  return <>
    <SectionHead eyebrow={local(b("أداة المدرب", "Instructor tool"), lang)} title={local(b("بناء هدف قابل للملاحظة", "Objective builder"), lang)} intro={local(b("من متطلب الأداء والفجوة إلى هدف SMART ودليل نجاح واضح.", "Move from performance requirement and gap to a SMART objective with clear evidence."), lang)}/>
    <div className="builder-layout">
      <form className="builder-card" onSubmit={e => e.preventDefault()}>
        <div className="field-row"><Field label={local(b("متطلب الأداء", "Performance requirement"), lang)} value={value.requirement} onChange={x => set("requirement", x)}/><Field label={local(b("فجوة الأداء", "Performance gap"), lang)} value={value.gap} onChange={x => set("gap", x)}/></div>
        <div className="field-row"><label>Learning Domain<select value={value.domain} onChange={e => set("domain", e.target.value)}><option>Cognitive</option><option>Psychomotor</option><option>Affective</option></select></label><label>{local(b("المستوى", "Level"), lang)}<select value={value.level} onChange={e => set("level", e.target.value)}><option>Remember</option><option>Understand</option><option>Apply</option><option>Analyze</option><option>Evaluate</option><option>Create / Improve</option><option>Precision</option><option>Stable / Naturalized</option><option>Internalizing</option></select></label></div>
        <Field label={local(b("السلوك الملاحظ", "Observable behaviour"), lang)} value={value.behaviour} onChange={x => set("behaviour", x)} placeholder={local(b("مثال: يطبق قرار الإيقاف", "Example: applies the stop decision"), lang)}/>
        <div className="field-row"><Field label={local(b("الشرط", "Condition"), lang)} value={value.condition} onChange={x => set("condition", x)}/><Field label={local(b("الحد الأدنى للمعيار", "Minimum standard"), lang)} value={value.criterion} onChange={x => set("criterion", x)}/></div>
        <div className="field-row"><Field label="Critical Failure" value={value.critical} onChange={x => set("critical", x)}/><Field label={local(b("الدليل المطلوب", "Evidence required"), lang)} value={value.evidence} onChange={x => set("evidence", x)}/></div>
        <details className="translation-fields">
          <summary>{local(b("المقابل الإنجليزي للإخراج الثنائي", "English equivalents for bilingual output"), lang)}</summary>
          <Field label="Observable behaviour — English" value={value.behaviourEn || ""} onChange={x => set("behaviourEn", x)}/>
          <div className="field-row"><Field label="Condition — English" value={value.conditionEn || ""} onChange={x => set("conditionEn", x)}/><Field label="Minimum standard — English" value={value.criterionEn || ""} onChange={x => set("criterionEn", x)}/></div>
          <div className="field-row"><Field label="Critical Failure — English" value={value.criticalEn || ""} onChange={x => set("criticalEn", x)}/><Field label="Evidence — English" value={value.evidenceEn || ""} onChange={x => set("evidenceEn", x)}/></div>
        </details>
      </form>
      <aside className="output-card">
        <div className="card-top"><Badge tone={warnings.length ? "danger" : "safe"}>{warnings.length ? `${warnings.length} ${labels[lang].warnings}` : "Ready"}</Badge><span>{labels[lang].save}</span></div>
        <h2>SMART Objective</h2>
        {warnings.length > 0 && <ul className="warning-list">{warnings.map((x, i) => <li key={i}>{x}</li>)}</ul>}
        {ready ? <div className="bilingual-output">
          <div lang="ar" dir="rtl"><MiniLabel>العربية</MiniLabel><p>في {value.condition}، {value.behaviour}، بحد أدنى {value.criterion}{value.critical ? `، ودون ${value.critical}` : ""}. الدليل: {value.evidence || "Checklist وملاحظة مباشرة"}.</p></div>
          <div lang="en" dir="ltr"><MiniLabel>English</MiniLabel><p>Under the condition “{value.conditionEn || value.condition}”, the learner will “{value.behaviourEn || value.behaviour}” to a minimum standard of “{value.criterionEn || value.criterion}”{value.critical ? `, with no “${value.criticalEn || value.critical}”` : ""}. Evidence: {value.evidenceEn || value.evidence || "checklist and direct observation"}.</p></div>
        </div> : <p className="empty">{labels[lang].empty}</p>}
        <SourceMark lang={lang} applied/>
      </aside>
    </div>
  </>;
}

function StationBuilder({ lang, value, onChange }: { lang: Lang; value: StationState; onChange: (x: StationState) => void }) {
  const set = (key: keyof StationState, v: string | boolean) => onChange({ ...value, [key]: v });
  const variableCount = value.variables.split(/[,،\n]/).filter(Boolean).length;
  const warnings = [
    !value.baseline && b("لا يوجد Baseline.", "No baseline is defined."),
    variableCount > 2 && b("متغيرات كثيرة مضافة معًا؛ لن تعرف أول نقطة انهيار.", "Too many variables are added together; the first breakdown will be unclear."),
    value.behaviour.split(/[,،\n]/).filter(Boolean).length > 3 && b("المحطة تقيس أداءات كثيرة غير مترابطة.", "The station may measure several unrelated performances."),
    value.cognitive && value.checklist.split(/\n/).length < 2 && b("الـBrief قد يختبر الذاكرة بدل المهارة المقصودة.", "The brief may test memory rather than the intended skill."),
    value.primary === "Cognitive" && !/(قرار|تذكر|cue|زمن|خطأ|decision|recall|time|error)/i.test(value.data) && b("البيانات المجمعة لا تدعم التشخيص الذهني المعلن.", "Collected data do not support the stated cognitive diagnosis."),
    !value.safetyGate && value.critical && b("لا يجوز أن تعوض الدرجة Critical Safety Failure.", "A score cannot compensate for a Critical Safety Failure."),
  ].filter(Boolean) as Bi[];
  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), ...value }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "station-card.json"; a.click(); URL.revokeObjectURL(url);
  };
  return <>
    <SectionHead eyebrow="Station Card" title={local(b("صمّم محطة تقيس ما تقصده", "Design a station that measures what you intend"), lang)} intro={local(b("اعزل المتغيرات، ابدأ من Baseline، واربط كل تشخيص بدليل تجمعه فعلًا.", "Isolate variables, start from baseline, and link each diagnosis to data you actually collect."), lang)}/>
    <div className="station-builder">
      <form className="builder-card dense" onSubmit={e => e.preventDefault()}>
        <div className="field-row"><Field label={local(b("اسم المحطة", "Station name"), lang)} value={value.name} onChange={x => set("name", x)}/><Field label={local(b("متطلب الأداء", "Performance requirement"), lang)} value={value.requirement} onChange={x => set("requirement", x)}/></div>
        <div className="field-row thirds"><label>Learning Domain<select value={value.domain} onChange={e => set("domain", e.target.value)}><option>Cognitive</option><option>Psychomotor</option><option>Affective</option></select></label><Field label={local(b("المستوى", "Level"), lang)} value={value.level} onChange={x => set("level", x)}/><label>Trifecta<select value={value.primary} onChange={e => set("primary", e.target.value)}><option>Physical</option><option>Technical</option><option>Cognitive</option></select></label></div>
        <div className="field-row"><Field label="Baseline" value={value.baseline} onChange={x => set("baseline", x)}/><Field label={local(b("المتغيرات المضافة (افصل بفاصلة)", "Variables added (comma-separated)"), lang)} value={value.variables} onChange={x => set("variables", x)}/></div>
        <div className="field-row thirds"><Field label={local(b("ضغط الوقت", "Time pressure"), lang)} value={value.time} onChange={x => set("time", x)}/><Field label="Cognitive Load" value={value.cognitive} onChange={x => set("cognitive", x)}/><Field label={local(b("الحمل البدني", "Physical load"), lang)} value={value.physical} onChange={x => set("physical", x)}/></div>
        <Field label={local(b("السلوك الملاحظ", "Observable behaviour"), lang)} value={value.behaviour} onChange={x => set("behaviour", x)} area/>
        <div className="field-row"><Field label="Checklist" value={value.checklist} onChange={x => set("checklist", x)} area/><Field label="Critical Failures" value={value.critical} onChange={x => set("critical", x)} area/></div>
        <div className="field-row"><Field label="Go / No-Go" value={value.standard} onChange={x => set("standard", x)}/><Field label={local(b("البيانات التي ستجمعها", "Data to collect"), lang)} value={value.data} onChange={x => set("data", x)}/></div>
        <div className="field-row"><Field label="AAR questions" value={value.aar} onChange={x => set("aar", x)} area/><Field label={local(b("المعالجة", "Remediation"), lang)} value={value.remediation} onChange={x => set("remediation", x)} area/></div>
        <Field label="Retest rule" value={value.retest} onChange={x => set("retest", x)}/>
        <label className="gate-toggle"><input type="checkbox" checked={value.safetyGate} onChange={e => set("safetyGate", e.target.checked)}/><span><strong>Critical Safety Gate</strong>{local(b("الفشل الحرج ينتج No-Go دائمًا.", "Critical failure always produces No-Go."), lang)}</span></label>
      </form>
      <aside className="station-preview">
        <div className="card-top"><Badge>{variableCount} variables</Badge><SourceMark lang={lang} applied/></div>
        <h2>{value.name || "Station Card"}</h2>
        {warnings.length ? <div><MiniLabel>{labels[lang].warnings}</MiniLabel><ul className="warning-list">{warnings.map((x, i) => <li key={i}>{local(x, lang)}</li>)}</ul></div> : <div className="status-ok">✓ {local(b("المنطق الأساسي مكتمل.", "Core logic is complete."), lang)}</div>}
        <dl className="station-dl">
          <div><dt>Requirement</dt><dd>{value.requirement || "—"}</dd></div>
          <div><dt>Baseline</dt><dd>{value.baseline || "—"}</dd></div>
          <div><dt>Domains</dt><dd>{value.domain} → {value.primary}</dd></div>
          <div><dt>Go / No-Go</dt><dd>{value.standard || "—"}</dd></div>
          <div><dt>Retest</dt><dd>{value.retest || "—"}</dd></div>
        </dl>
        <div className="gate-result"><span>{value.critical ? "CRITICAL" : "GATE"}</span><strong>{value.safetyGate ? "NON-COMPENSABLE" : "UNSAFE LOGIC"}</strong></div>
        <div className="button-row"><button className="secondary" onClick={() => window.print()}>{labels[lang].print}</button><button className="secondary" onClick={exportJson}>{labels[lang].download}</button></div>
      </aside>
    </div>
  </>;
}

type Assessor = { observation: string; checklist: string; domain: string; pillar: string; family: string; critical: boolean; decision: string; evidence: string; confidence: number; missing: string };
const blankAssessor = (): Assessor => ({ observation: "", checklist: "", domain: "Psychomotor", pillar: "Technical", family: "None", critical: false, decision: "Need More Data", evidence: "", confidence: 50, missing: "" });

function Calibration({ lang }: { lang: Lang }) {
  const [active, setActive] = useState(0);
  const [assessors, setAssessors] = useState<Assessor[]>([blankAssessor(), blankAssessor(), blankAssessor()]);
  const current = assessors[active];
  const set = (key: keyof Assessor, val: string | boolean | number) => setAssessors(xs => xs.map((x, i) => i === active ? { ...x, [key]: val } : x));
  const agreement = (key: keyof Assessor) => new Set(assessors.map(x => String(x[key]))).size === 1;
  const completed = assessors.filter(x => x.observation.trim()).length;
  return <>
    <SectionHead eyebrow={local(b("معايرة المقيمين", "Assessor calibration"), lang)} title={local(b("نفس الأداء. ثلاثة أحكام مستقلة.", "Same performance. Three independent judgements."), lang)} intro={local(b("سجّل الملاحظة أولًا، ثم التفسير. الاتساق هنا مؤشر مبسط للمراجعة، وليس تحققًا علميًا رسميًا.", "Record observation before interpretation. Consistency here is a simplified review indicator, not formal scientific validation."), lang)}/>
    <article className="calibration-case"><Badge>Calibration case</Badge><p>{local(b("الأداء حافظ على الدقة، لكن المقيمين اختلفوا حول «السيطرة الجيدة» بعد اهتزاز قصير لم يُعرّف في الـChecklist.", "Accuracy was retained, but assessors disagreed about “good control” after a brief instability that the checklist did not define."), lang)}</p></article>
    <div className="assessor-tabs">{assessors.map((_, i) => <button key={i} aria-pressed={active === i} onClick={() => setActive(i)}><span>A{i + 1}</span>{local(b("المقيم", "Assessor"), lang)} {i + 1}</button>)}</div>
    <div className="builder-layout">
      <form className="builder-card" onSubmit={e => e.preventDefault()}>
        <Field label={local(b("السلوك الذي رأيته فقط", "Observed behaviour only"), lang)} value={current.observation} onChange={x => set("observation", x)} area/>
        <Field label="Checklist result" value={current.checklist} onChange={x => set("checklist", x)}/>
        <div className="field-row"><label>Learning Domain<select value={current.domain} onChange={e => set("domain", e.target.value)}><option>Cognitive</option><option>Psychomotor</option><option>Affective</option></select></label><label>Trifecta<select value={current.pillar} onChange={e => set("pillar", e.target.value)}><option>Physical</option><option>Technical</option><option>Cognitive</option></select></label></div>
        <div className="field-row"><label>{local(b("العائلة الذهنية", "Cognitive family"), lang)}<select value={current.family} onChange={e => set("family", e.target.value)}><option>None</option>{cognitiveFamilies.map(x => <option key={x.code}>{x.code}</option>)}</select></label><label>{local(b("القرار", "Decision"), lang)}<select value={current.decision} onChange={e => set("decision", e.target.value)}><option>Go</option><option>No-Go</option><option>Need More Data</option></select></label></div>
        <label className="check-row"><input type="checkbox" checked={current.critical} onChange={e => set("critical", e.target.checked)}/><span>Critical Failure</span></label>
        <Field label={labels[lang].evidence} value={current.evidence} onChange={x => set("evidence", x)} area/>
        <label>{local(b("مستوى الثقة", "Confidence"), lang)} · {current.confidence}%<input type="range" min="0" max="100" value={current.confidence} onChange={e => set("confidence", Number(e.target.value))}/></label>
        <Field label={local(b("المعلومات الناقصة", "Missing information"), lang)} value={current.missing} onChange={x => set("missing", x)}/>
      </form>
      <aside className="output-card">
        <div className="card-top"><Badge>{completed}/3 complete</Badge><SourceMark lang={lang} applied/></div>
        <h2>{local(b("اتساق مبسط", "Simplified consistency"), lang)}</h2>
        {completed < 2 ? <p className="empty">{local(b("أكمل تقييم مقيمين على الأقل.", "Complete at least two assessor records."), lang)}</p> : <div className="consistency-list">
          {[["Decision","decision"],["Learning Domain","domain"],["Trifecta","pillar"],["Critical Failure","critical"]].map(([name,key]) => <div key={key}><span>{name}</span><strong className={agreement(key as keyof Assessor) ? "agree" : "disagree"}>{agreement(key as keyof Assessor) ? local(b("اتفاق", "Agreement"), lang) : local(b("اختلاف", "Disagreement"), lang)}</strong></div>)}
        </div>}
        <div className="boundary-note">{local(b("إذا اختلفت القرارات مع تشابه الملاحظات، راجع غموض الـChecklist. وإذا اختلفت الملاحظات نفسها، راجع زاوية الرؤية والتسجيل قبل لوم المقيم.", "If decisions differ despite similar observations, review checklist ambiguity. If observations differ, review viewing position and recording before blaming an assessor."), lang)}</div>
      </aside>
    </div>
  </>;
}

const profileDimensions = [
  b("مستوى المعرفة", "Learning knowledge"), b("تطور المهارة", "Skill development"), b("ثبات السلوك", "Behavioural consistency"),
  b("الجاهزية البدنية", "Physical readiness"), b("الثبات الفني", "Technical stability"), b("الإدراك والاسترجاع", "Perception and recall"),
  b("جودة القرار", "Decision quality"), b("التكيف", "Adaptability"), b("ربط القرار بالفعل", "Decision-action integration"),
  b("الاستعادة والتركيز", "Recovery and sustained focus"), b("جودة AAR", "AAR quality"),
];

function PerformanceProfile({ lang }: { lang: Lang }) {
  const [ratings, setRatings] = useState(profileDimensions.map(() => 0));
  const [notes, setNotes] = useState(profileDimensions.map(() => ""));
  const anchors = [b("غير مُثبت", "Not demonstrated"), b("بدعم كبير", "Major support"), b("عدم اتساق بسيط", "Minor inconsistency"), b("مستقل وثابت", "Independent and consistent")];
  return <>
    <SectionHead eyebrow={local(b("غير سريري · بدون مجموع افتراضي", "Non-clinical · no default total"), lang)} title={local(b("ملف الأداء", "Performance profile"), lang)} intro={local(b("نحتفظ بشكل الأداء متعدد الأبعاد. كل تقدير يحتاج دليلًا، ولا نطحن كل شيء في رقم واحد.", "Keep the multidimensional shape of performance. Every rating requires evidence; do not collapse everything into one score."), lang)}/>
    <div className="profile-grid">{profileDimensions.map((x, i) => <article key={i} className="profile-row">
      <div className="profile-name"><span>{String(i + 1).padStart(2, "0")}</span><strong>{local(x, lang)}</strong></div>
      <div className="anchor-buttons">{anchors.map((a, n) => <button key={n} className={ratings[i] === n ? "active" : ""} onClick={() => setRatings(rs => rs.map((v, j) => j === i ? n : v))}><b>{n}</b>{local(a, lang)}</button>)}</div>
      <label><span>{labels[lang].evidence}</span><input value={notes[i]} onChange={e => setNotes(ns => ns.map((v, j) => j === i ? e.target.value : v))} aria-invalid={ratings[i] > 0 && !notes[i]}/></label>
      <div className="profile-bar"><span style={{ width: `${(ratings[i] / 3) * 100}%` }}/></div>
    </article>)}</div>
    <div className="profile-footer"><SourceMark lang={lang} applied/><p>{local(b("الفراغ ليس صفرًا؛ قد يعني أن الدليل لم يُجمع بعد. استخدم Need More Data بدل ملء الملف بالتخمين.", "A blank is not zero; it may mean evidence was not collected. Use Need More Data rather than completing a profile with assumptions."), lang)}</p><button className="secondary" onClick={() => window.print()}>{labels[lang].print}</button></div>
  </>;
}

function AAR({ lang }: { lang: Lang }) {
  const [data, setData] = useState({ happened:"", evidence:"", domain:"Cognitive", pillar:"Cognitive", alternative:"", missing:"", source:"performer", change:"" });
  const set = (k:string,v:string) => setData(x => ({...x,[k]:v}));
  const recs: Record<string, Bi> = {
    performer:b("ابدأ بتدخل أصغر يطابق الفجوة: شرح وتحقق للمعرفة، Demonstration وGuided Practice للمهارة، أو Load Progression وReset للثبات.","Use the smallest intervention that fits the gap: explanation/check for knowledge, demonstration/guided practice for skill, or load progression/reset for stability."),
    brief:b("اختصر الـBrief، افصل الشروط الحرجة، واختبر الاسترجاع قبل المحطة دون تحويل المهمة إلى اختبار ذاكرة.","Shorten the brief, separate critical conditions, and check recall before the station without turning the task into a memory test."),
    criterion:b("حوّل البند إلى سلوك ملاحظ، حدّد المرساة والـCritical Failure، ثم عاير المقيمين.","Rewrite the item as observable behaviour, define anchors and Critical Failure, then calibrate assessors."),
    coaching:b("استخدم Cue واحدًا محددًا وتغذية راجعة في توقيت ثابت، ثم قلل الدعم تدريجيًا.","Use one specific cue and consistently timed feedback, then reduce support progressively."),
    station:b("ارجع للـBaseline، اعزل المتغيرات، وأضف عاملًا واحدًا حتى يظهر أول انهيار قابل للتفسير.","Return to baseline, isolate variables, and add one factor until the first interpretable breakdown appears."),
    load:b("أوقف التصعيد، حدّد Reset وRetest، ثم زد الوقت أو الحمل أو التعقيد تدريجيًا—عامل واحد في كل مرة.","Stop escalation, define reset and retest, then progress time, load, or complexity one factor at a time."),
  };
  return <>
    <SectionHead eyebrow="After Action Review" title={local(b("حوّل التشخيص إلى فعل", "Turn diagnosis into action"), lang)} intro={local(b("AAR جيد لا يسأل فقط «من أخطأ؟»؛ يراجع المؤدي والـBrief والمعيار والتدريب وتصميم المحطة.", "A good AAR does not only ask “who failed?”; it reviews performer, brief, criterion, coaching, station design, and load progression."), lang)}/>
    <div className="builder-layout">
      <form className="builder-card" onSubmit={e=>e.preventDefault()}>
        <Field label={local(b("1. ماذا حدث؟", "1. What happened?"), lang)} value={data.happened} onChange={x=>set("happened",x)} area/>
        <Field label={local(b("2. ما الدليل الملاحظ؟", "2. What is the observable evidence?"), lang)} value={data.evidence} onChange={x=>set("evidence",x)} area/>
        <div className="field-row"><label>3. Learning Domain<select value={data.domain} onChange={e=>set("domain",e.target.value)}><option>Cognitive</option><option>Psychomotor</option><option>Affective</option></select></label><label>4. Trifecta<select value={data.pillar} onChange={e=>set("pillar",e.target.value)}><option>Physical</option><option>Technical</option><option>Cognitive</option></select></label></div>
        <Field label={local(b("5. ما التفسير البديل؟", "5. Most plausible alternative?"), lang)} value={data.alternative} onChange={x=>set("alternative",x)}/>
        <Field label={local(b("6. ما الدليل الإضافي المطلوب؟", "6. What additional evidence is needed?"), lang)} value={data.missing} onChange={x=>set("missing",x)}/>
        <label>{local(b("7. أين يوجد السبب القابل للتغيير؟", "7. Where is the modifiable cause?"), lang)}<select value={data.source} onChange={e=>set("source",e.target.value)}><option value="performer">{local(b("المؤدي", "Performer"), lang)}</option><option value="brief">Brief</option><option value="criterion">{local(b("المعيار", "Criterion"), lang)}</option><option value="coaching">{local(b("التدريب", "Coaching"), lang)}</option><option value="station">{local(b("تصميم المحطة", "Station design"), lang)}</option><option value="load">{local(b("تصعيد الحمل", "Load progression"), lang)}</option></select></label>
        <Field label={local(b("8. ماذا سيتغير في المحاولة التالية؟", "8. What changes next?"), lang)} value={data.change} onChange={x=>set("change",x)} area/>
      </form>
      <aside className="output-card aar-output">
        <div className="card-top"><Badge>AAR output</Badge><SourceMark lang={lang} applied/></div>
        <h2>{local(b("التدخل المقترح", "Recommended intervention"), lang)}</h2>
        <p className="recommendation-text">{local(recs[data.source],lang)}</p>
        <dl className="station-dl">
          <div><dt>Evidence</dt><dd>{data.evidence || "—"}</dd></div>
          <div><dt>Domain / Pillar</dt><dd>{data.domain} / {data.pillar}</dd></div>
          <div><dt>Alternative</dt><dd>{data.alternative || "—"}</dd></div>
          <div><dt>Next change</dt><dd>{data.change || "—"}</dd></div>
        </dl>
        <button className="secondary" onClick={()=>window.print()}>{labels[lang].print}</button>
      </aside>
    </div>
  </>;
}

function Checks({ lang, answers, setAnswer }: { lang: Lang; answers: Record<number,number>; setAnswer:(i:number,a:number)=>void }) {
  const completed = Object.keys(answers).length;
  return <>
    <SectionHead eyebrow={local(b("تغذية راجعة فورية", "Immediate explanation"), lang)} title={local(b("اختبارات المعرفة", "Knowledge checks"), lang)} intro={local(b("ركز على جودة الحكم والتدخل، لا حفظ الاختصارات.", "Focus on judgement and intervention quality, not acronym recall."), lang)}/>
    <div className="quiz-progress"><span style={{width:`${completed/knowledgeChecks.length*100}%`}}/><strong>{completed}/{knowledgeChecks.length}</strong></div>
    <div className="quiz-list">{knowledgeChecks.map((q,i)=><article key={i} className="quiz-card">
      <div className="quiz-number">0{i+1}</div><h2>{local(q.q,lang)}</h2>
      <div className="quiz-options">{q.options.map((x,n)=><button key={n} className={answers[i]===n ? (n===q.answer?"correct":"wrong"):""} onClick={()=>setAnswer(i,n)}>{local(x,lang)}</button>)}</div>
      {answers[i]!==undefined && <div className="quiz-explain"><strong>{answers[i]===q.answer?local(b("صحيح","Correct"),lang):local(b("راجع منطقك","Review your reasoning"),lang)}</strong><p>{local(q.why,lang)}</p></div>}
    </article>)}</div>
  </>;
}

function References({ lang }: { lang: Lang }) {
  return <>
    <SectionHead eyebrow={local(b("كل ادعاء له حدود", "Every claim has limits"), lang)} title={local(b("مكتبة المراجع", "Reference library"), lang)} intro={local(b("المصدر، ما يدعمه، ما لا يثبته، وأين استخدمناه.", "The source, what it supports, what it does not prove, and where it is used."), lang)}/>
    <div id="source-note" className="source-boundary"><SourceMark lang={lang}/><p>{local(b("المستندان المرفقان هما المصدر الأساسي للمصطلحات والتركيب والأمثلة. قواعد التحقق الإضافية الموسومة «توصية تطبيقية» صُممت للاستخدام العملي وليست ادعاء تحقق مستقل.", "The two attached documents are the primary source for terminology, structure, and examples. Additional rules marked “Applied recommendation” support practical use and are not claims of independent validation."),lang)}</p></div>
    <div className="reference-list">{references.map((r,i)=><article key={i}>
      <div className="ref-index">{String(i+1).padStart(2,"0")}</div>
      <div><h2>{r.citation}</h2><div className="ref-grid"><p><MiniLabel>{local(b("يدعم", "Supports"),lang)}</MiniLabel>{local(r.supports,lang)}</p><p><MiniLabel>{local(b("لا يثبت", "Does not prove"),lang)}</MiniLabel>{local(r.not,lang)}</p><p><MiniLabel>{local(b("مستخدم في", "Used in"),lang)}</MiniLabel>{local(r.used,lang)}</p></div><a href={r.url} target={r.url.startsWith("http")?"_blank":undefined} rel="noreferrer">{local(b("افتح المصدر", "Open source"),lang)} ↗</a></div>
    </article>)}</div>
  </>;
}

function About({ lang }: { lang: Lang }) {
  return <>
    <SectionHead eyebrow={local(b("حدود المنهج", "Framework boundaries"), lang)} title={local(b("عن المنصة", "About the framework"), lang)} intro={local(b("أداة تصميم وتقييم وتحسين تدريب—وليست اختبارًا سريريًا أو دليل تكتيكات.", "A training-design, assessment, and improvement tool—not a clinical test or tactics manual."), lang)}/>
    <div className="about-grid">
      <article><span>01</span><h2>{local(b("من المصدر", "Source-derived"),lang)}</h2><p>{local(b("الإطاران، المستويات، العائلات العشر، أمثلة القراءة الكاملة، وقاعدة السلامة غير القابلة للتعويض.","The two frameworks, progressions, ten families, whole-performance examples, and the non-compensable safety rule."),lang)}</p></article>
      <article><span>02</span><h2>{local(b("توصيات تطبيقية", "Applied recommendations"),lang)}</h2><p>{local(b("تحذيرات النماذج، منطق البيانات الناقصة، قواعد تصميم المحطة، وتقارير الطباعة.","Builder warnings, missing-data logic, station-design rules, and printable outputs."),lang)}</p></article>
      <article><span>03</span><h2>{local(b("خارج النطاق", "Out of scope"),lang)}</h2><p>{local(b("التشخيص السريري أو الشخصي، تكتيكات الاشتباك، وإرشادات مناولة السلاح التفصيلية.","Clinical or personality diagnosis, engagement tactics, and detailed weapon-manipulation instruction."),lang)}</p></article>
    </div>
    <div className="privacy-card"><h2>{local(b("الخصوصية أولًا", "Privacy first"),lang)}</h2><p>{local(b("المسودات والتقدم تبقى على هذا الجهاز في localStorage. لا حسابات، لا تحليلات، ولا إرسال لبيانات الأداء.","Drafts and progress remain on this device in localStorage. No accounts, analytics, or performance-data transmission."),lang)}</p></div>
  </>;
}

export default function TrainingApp({ initialSection = "overview" }: { initialSection?: string }) {
  const [lang, setLang] = useState<Lang>("ar");
  const [mode, setMode] = useState<Mode>("learner");
  const [section, setSection] = useState(initialSection);
  const [menu, setMenu] = useState(false);
  const [completedCases, setCompletedCases] = useState<number[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number,number>>({});
  const [objective, setObjective] = useState(initialObjective);
  const [station, setStation] = useState(initialStation);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const raw = localStorage.getItem("performance-lab-state");
        if (raw) {
          const x = JSON.parse(raw) as SavedState;
          setLang(x.lang || "ar"); setMode(x.mode || "learner"); setCompletedCases(x.completedCases || []);
          setQuizAnswers(x.quizAnswers || {}); if (x.objective) setObjective(x.objective); if (x.station) setStation(x.station);
        }
      } catch { /* retain safe defaults */ }
      setHydrated(true);
    });
    navigator.serviceWorker?.register("/sw.js").catch(() => undefined);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("performance-lab-state", JSON.stringify({ lang, mode, completedCases, quizAnswers, objective, station } satisfies SavedState));
    document.documentElement.lang = lang; document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang, mode, completedCases, quizAnswers, objective, station, hydrated]);

  useEffect(() => {
    const pop = () => setSection(location.pathname.split("/").filter(Boolean)[0] || "overview");
    addEventListener("popstate", pop); return () => removeEventListener("popstate", pop);
  }, []);

  const go = (slug: string) => {
    setSection(slug); setMenu(false); history.pushState({}, "", slug === "overview" ? "/" : `/${slug}`);
    window.scrollTo({ top: 0, behavior: "auto" });
    requestAnimationFrame(() => document.getElementById("main-content")?.focus());
  };

  const instructorOnly = new Set(["objective-builder","station-builder","calibration","profile","aar"]);
  const visibleRoutes = routes.filter(([slug]) => mode === "instructor" || !instructorOnly.has(slug));
  const progress = Math.round(((completedCases.length + Object.keys(quizAnswers).length) / (cases.length + knowledgeChecks.length)) * 100);
  const render = () => {
    switch(section) {
      case "domains": return <Domains lang={lang}/>;
      case "trifecta": return <Trifecta lang={lang}/>;
      case "comparison": return <Comparison lang={lang}/>;
      case "cases": return <CaseLab lang={lang} onComplete={id=>setCompletedCases(x=>x.includes(id)?x:[...x,id])}/>;
      case "objective-builder": return <ObjectiveBuilder lang={lang} value={objective} onChange={setObjective}/>;
      case "station-builder": return <StationBuilder lang={lang} value={station} onChange={setStation}/>;
      case "calibration": return <Calibration lang={lang}/>;
      case "profile": return <PerformanceProfile lang={lang}/>;
      case "aar": return <AAR lang={lang}/>;
      case "checks": return <Checks lang={lang} answers={quizAnswers} setAnswer={(i,a)=>setQuizAnswers(x=>({...x,[i]:a}))}/>;
      case "references": return <References lang={lang}/>;
      case "about": return <About lang={lang}/>;
      default: return <Overview lang={lang} go={go}/>;
    }
  };
  return <div className="app-shell" data-mode={mode}>
    <a className="skip-link" href="#main-content">{labels[lang].skip}</a>
    <header className="topbar">
      <button className="brand" onClick={() => go("overview")} aria-label={local(b("الرئيسية", "Home"),lang)}><span className="brand-mark">T³</span><span><strong>TRIFECTA</strong><small>PERFORMANCE LAB</small></span></button>
      <nav className="top-actions" aria-label={local(b("أدوات العرض", "View controls"),lang)}>
        <div className="progress-mini" title={`${labels[lang].progress} ${progress}%`}><span style={{width:`${progress}%`}}/></div>
        <div className="segmented compact"><button aria-pressed={mode==="learner"} onClick={()=>setMode("learner")}>{labels[lang].learner}</button><button aria-pressed={mode==="instructor"} onClick={()=>setMode("instructor")}>{labels[lang].instructor}</button></div>
        <button className="language" onClick={()=>setLang(x=>x==="ar"?"en":"ar")} aria-label={lang==="ar"?"Switch to English":"التبديل إلى العربية"}>{lang==="ar"?"EN":"ع"}</button>
        <button className="menu-button" onClick={()=>setMenu(x=>!x)} aria-expanded={menu} aria-controls="main-nav">{labels[lang].menu}</button>
      </nav>
    </header>
    <aside id="main-nav" className={`sidebar ${menu?"open":""}`}>
      <div className="side-label">{local(b("مسار التعلم", "Learning path"),lang)}</div>
      <div className="segmented mobile-mode" aria-label={local(b("اختيار الوضع", "Mode selection"),lang)}>
        <button aria-pressed={mode==="learner"} onClick={()=>setMode("learner")}>{labels[lang].learner}</button>
        <button aria-pressed={mode==="instructor"} onClick={()=>setMode("instructor")}>{labels[lang].instructor}</button>
      </div>
      <nav>{visibleRoutes.map(([slug,title],i)=><button key={slug} className={section===slug?"active":""} aria-current={section===slug?"page":undefined} onClick={()=>go(slug)}><span>{String(i+1).padStart(2,"0")}</span>{local(title,lang)}</button>)}</nav>
      <div className="side-status"><div><span>{progress}%</span><small>{labels[lang].progress}</small></div><div className="side-bar"><span style={{height:`${progress}%`}}/></div></div>
    </aside>
    <main id="main-content" tabIndex={-1}><div className="page-stage" key={section}>{render()}</div></main>
    <footer><span>TRIFECTA PERFORMANCE LAB · 2026</span><span>{local(b("بياناتك تبقى على جهازك", "Your data stays on your device"),lang)}</span></footer>
  </div>;
}
