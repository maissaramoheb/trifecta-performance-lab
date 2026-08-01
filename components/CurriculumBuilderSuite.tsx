"use client";

import { useMemo, useRef, useState } from "react";
import { b, type Bi, type Lang } from "../lib/content";
import {
  deleteDrillWithIntegrity,
  deleteGateWithIntegrity,
  deleteLevelWithIntegrity,
  deleteStationWithIntegrity,
  detectCircularProgression,
  exportCurriculumSuiteJSON,
  getAffectedDependentsOnLevelDelete,
  getAffectedDependentsOnStationDelete,
  validateAndImportCurriculumSuiteJSON,
} from "../lib/curriculum";
import type { CurriculumSuiteStore, DrillEntity, GateEntity, LevelEntity, StationEntity } from "../lib/curriculum-builder-types";
import { LevelBuilder } from "./LevelBuilder";
import { StationBuilder } from "./StationBuilder";
import { DrillBuilder } from "./DrillBuilder";
import { GateBuilder } from "./GateBuilder";
import { HierarchyTree } from "./ui/HierarchyTree";
import { DeleteConfirmationModal } from "./ui/DeleteConfirmationModal";
import { StatusBanner } from "./ui/StatusBanner";

const local = (value: Bi | string, lang: Lang) =>
  typeof value === "string" ? value : value[lang];

type CurriculumBuilderSuiteProps = {
  lang: Lang;
  mode: "learner" | "instructor";
  store: CurriculumSuiteStore;
  onChangeStore: (next: CurriculumSuiteStore) => void;
  initialTab?: "level" | "station" | "drill" | "gate";
};

export default function CurriculumBuilderSuite({
  lang,
  mode,
  store,
  onChangeStore,
  initialTab,
}: CurriculumBuilderSuiteProps) {
  const [showTreeMobile, setShowTreeMobile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Deletion modal state
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    type: "level" | "station" | "drill" | "gate";
    id: string;
    name: string;
    affectedSummary: string[];
  }>({
    isOpen: false,
    type: "level",
    id: "",
    name: "",
    affectedSummary: [],
  });

  // Notification / Import status
  const [importStatus, setImportStatus] = useState<{
    type: "success" | "warning" | "danger" | null;
    message: string;
  }>({ type: null, message: "" });

  const activeTab = initialTab ?? store.activeTab;

  const cycleCheck = useMemo(() => {
    return detectCircularProgression(store.gates);
  }, [store.gates]);

  const setTab = (tab: "level" | "station" | "drill" | "gate") => {
    onChangeStore({ ...store, activeTab: tab });
  };

  // Step completions
  const levelComplete = store.levels.length > 0 && store.levels.every((l) => l.stationIds.length > 0);
  const stationComplete = store.stations.length > 0 && store.stations.every((s) => s.baseline.ar.trim().length > 0);
  const drillComplete = store.drills.length > 0 && store.drills.every((d) => d.condition.ar.trim().length > 0);
  const gateComplete = store.gates.length > 0 && store.gates.every((g) => g.requirement.ar.trim().length > 0);

  const tabs = [
    { key: "level" as const, label: b("1. Level Builder", "1. Level Builder"), complete: levelComplete },
    { key: "station" as const, label: b("2. Station Builder", "2. Station Builder"), complete: stationComplete },
    { key: "drill" as const, label: b("3. Drill Builder", "3. Drill Builder"), complete: drillComplete },
    { key: "gate" as const, label: b("4. Gate Builder", "4. Gate Builder"), complete: gateComplete },
  ];

  // Handlers for Entity Updates
  const handleUpdateLevel = (updated: LevelEntity) => {
    const nextLevels = store.levels.map((l) => (l.id === updated.id ? updated : l));
    onChangeStore({ ...store, levels: nextLevels });
  };

  const handleUpdateStation = (updated: StationEntity) => {
    const nextStations = store.stations.map((s) => (s.id === updated.id ? updated : s));
    onChangeStore({ ...store, stations: nextStations });
  };

  const handleUpdateDrill = (updated: DrillEntity) => {
    const nextDrills = store.drills.map((d) => (d.id === updated.id ? updated : d));
    onChangeStore({ ...store, drills: nextDrills });
  };

  const handleUpdateGate = (updated: GateEntity) => {
    const nextGates = store.gates.map((g) => (g.id === updated.id ? updated : g));
    onChangeStore({ ...store, gates: nextGates });
  };

  // Add entity creators
  const handleAddLevel = () => {
    const id = `level-${Date.now()}`;
    const newLvl: LevelEntity = {
      id,
      name: b(`مستوى جديد ${store.levels.length + 1}`, `New Level ${store.levels.length + 1}`),
      purpose: b("تحديد الهدف التشغيلي للمستوى", "Define operational level purpose"),
      targetAudience: b("المتدربون والمدربون", "Learners and trainers"),
      prerequisites: b("مراجعة Baseline المتطلب", "Review baseline requirements"),
      expectedPerformanceLevel: b("أداء ثابت وآمن", "Stable, safe performance"),
      stationIds: [],
      progressionLogic: b("الانتقال مشروط باجتياز ה-Gate", "Progression is conditioned on Gate passage"),
      entryCriteria: b("Baseline واضح", "Clear Baseline"),
      completionCriteria: b("إجتياز جميع المحطات", "Pass all stations"),
      evidenceExpectations: b("أدلة ملاحظة لكل Drill", "Observable evidence per Drill"),
      estimatedDuration: b("4 ساعات", "4 hours"),
      instructorNotes: b("تجنب التقييم الكلي القائم على الدرجات الفردية", "Avoid total score based evaluation"),
      updatedAt: new Date().toISOString(),
    };
    onChangeStore({
      ...store,
      levels: [...store.levels, newLvl],
      activeLevelId: id,
      activeTab: "level",
    });
  };

  const handleAddStation = () => {
    const id = `station-${Date.now()}`;
    const parentLevelId = store.activeLevelId || store.levels[0]?.id || "level-1";
    const newSt: StationEntity = {
      id,
      levelId: parentLevelId,
      name: b(`محطة جديدة ${store.stations.length + 1}`, `New Station ${store.stations.length + 1}`),
      purpose: b("هدف المحطة التشغيلي", "Station operational purpose"),
      requirement: b("متطلب الأداء المطلوب", "Required performance requirement"),
      domain: "Psychomotor",
      level: "Apply",
      primaryPillar: "Technical",
      secondaryPillar: "Cognitive",
      baseline: b("شرط أساسي بدون متغيرات", "Baseline condition without variables"),
      variables: b("متغير واحد فقط", "One variable only"),
      timePressure: b("حسب الجرعة", "Per time dose"),
      cognitiveLoad: b("ملاحظة Cue", "Cue observation"),
      physicalLoad: b("معتدل", "Moderate"),
      behaviour: b("سلوك ملاحظ قابل للتسجيل", "Observable behaviour"),
      checklist: b("بنود الـChecklist القياسية", "Standard checklist items"),
      criticalFailures: b("خرق شرط الأمان الحاسم", "Breach of critical safety condition"),
      standard: b("Go / No-Go معلن", "Explicit Go / No-Go standard"),
      dataToCollect: b("أدلة مباشرة", "Direct evidence"),
      aarQuestions: b("ماذا حدث؟ وما الدليل؟", "What happened? What was observed?"),
      remediation: b("Reset للـBaseline", "Reset to Baseline"),
      retestRule: b("محاولة واحدة بعد المعالجة", "One attempt post remediation"),
      safetyGate: true,
      drillIds: [],
      gateId: `gate-${id}`,
      updatedAt: new Date().toISOString(),
    };

    // Link to level
    const nextLevels = store.levels.map((l) => (l.id === parentLevelId ? { ...l, stationIds: [...l.stationIds, id] } : l));
    onChangeStore({
      ...store,
      levels: nextLevels,
      stations: [...store.stations, newSt],
      activeStationId: id,
      activeTab: "station",
    });
  };

  const handleAddDrill = () => {
    const id = `drill-${Date.now()}`;
    const parentStationId = store.activeStationId || store.stations[0]?.id || "station-1";
    const newDrill: DrillEntity = {
      id,
      stationId: parentStationId,
      title: b(`Drill جديد ${store.drills.length + 1}`, `New Drill ${store.drills.length + 1}`),
      purpose: b("الهدف المباشر للـDrill", "Direct drill purpose"),
      objective: b("هدف SMART ملموس", "SMART objective"),
      condition: b("شرط الأداء مع Cue واحد", "Performance condition with one cue"),
      standard: b("المعيار الأدنى للتأهل", "Minimum passing standard"),
      domain: "Psychomotor",
      primaryPillar: "Technical",
      physicalRequirement: b("توازن بدني وثبات حركة", "Physical balance and motion stability"),
      technicalRequirement: b("دقة التنفيذ الفني", "Technical execution accuracy"),
      cognitiveRequirement: b("استرجاع الشرط واتخاذ القرار", "Recall condition and select decision"),
      requiredEquipment: b("معدات المحطة", "Station equipment"),
      instructorActions: b("ملاحظة وتوثيق الأدلة", "Observe and record evidence"),
      learnerActions: b("تنفيذ الإجراء المطلوب", "Execute required procedure"),
      safetyControls: b("إيقاف فوري عند الخرق", "Immediate stop on breach"),
      criticalFailures: b("مخالفة بند أمان حاسم", "Violation of critical safety item"),
      evidenceToCollect: b("دليل ملاحظ مسترجع", "Observable evidence"),
      assessmentMethod: b("Checklist + ملاحظة", "Checklist + direct observation"),
      repetitionsOrDuration: b("3 محاولات مستقلة", "3 independent trials"),
      remediationOptions: b("مراجعة الـBrief وإعادة المحاولة", "Review brief and retry"),
      completionCriteria: b("تحقيق المعيار الأدنى", "Achieve minimum standard"),
      pillarWeights: { physical: 33, technical: 34, cognitive: 33 },
      updatedAt: new Date().toISOString(),
    };

    const nextStations = store.stations.map((s) => (s.id === parentStationId ? { ...s, drillIds: [...s.drillIds, id] } : s));
    onChangeStore({
      ...store,
      stations: nextStations,
      drills: [...store.drills, newDrill],
      activeDrillId: id,
      activeTab: "drill",
    });
  };

  const handleAddGate = () => {
    const id = `gate-${Date.now()}`;
    const parentStationId = store.activeStationId || store.stations[0]?.id || "station-1";
    const newGate: GateEntity = {
      id,
      fromStationId: parentStationId,
      requirement: b("شرط الانتقال بين المحطتين", "Transition requirement between stations"),
      evidenceRequired: b("دليل مكتمل لجميع الـDrills", "Complete evidence for all drills"),
      mandatoryCriteria: b("لا يوجد Failure حرج", "No critical failure"),
      criticalFailures: b("أي خرق ينتج No-Go دائمًا", "Any breach always produces No-Go"),
      goConditions: b("توثيق الأدلة بنجاح", "Successfully document evidence"),
      noGoConditions: b("خرق أمان حرج أو نقص أدلة", "Critical safety breach or missing evidence"),
      needMoreDataConditions: b("بيانات غير كافية", "Insufficient data"),
      remediation: b("Reset والعودة للـBaseline", "Reset and return to Baseline"),
      retestRequirements: b("Retest مستقل", "Independent Retest"),
      resetConditions: b("تصفير المتغيرات", "Reset variables"),
      decisionRationale: b("مبرر القرار قائم على الدليل", "Evidence-based decision rationale"),
      nextPermittedAction: b("الانتقال أو المعالجة", "Proceed or remediate"),
      decision: "pending",
      decisionEvidence: "",
      updatedAt: new Date().toISOString(),
    };

    const nextStations = store.stations.map((s) => (s.id === parentStationId ? { ...s, gateId: id } : s));
    onChangeStore({
      ...store,
      stations: nextStations,
      gates: [...store.gates, newGate],
      activeGateId: id,
      activeTab: "gate",
    });
  };

  // Deletion Request
  const requestDelete = (type: "level" | "station" | "drill" | "gate", id: string) => {
    let name = id;
    const affectedSummary: string[] = [];

    if (type === "level") {
      const lvl = store.levels.find((l) => l.id === id);
      if (lvl) name = local(lvl.name, lang);
      const deps = getAffectedDependentsOnLevelDelete(store, id);
      if (deps.stations.length) affectedSummary.push(`${deps.stations.length} ${local(b("محطات مشمولة", "stations included"), lang)}`);
      if (deps.drills.length) affectedSummary.push(`${deps.drills.length} ${local(b("Drills مشمولة", "drills included"), lang)}`);
      if (deps.gates.length) affectedSummary.push(`${deps.gates.length} ${local(b("Gates مشمولة", "gates included"), lang)}`);
    } else if (type === "station") {
      const st = store.stations.find((s) => s.id === id);
      if (st) name = local(st.name, lang);
      const deps = getAffectedDependentsOnStationDelete(store, id);
      if (deps.drills.length) affectedSummary.push(`${deps.drills.length} ${local(b("Drills تابعة", "child drills"), lang)}`);
      if (deps.gates.length) affectedSummary.push(`${deps.gates.length} ${local(b("Gates متأثرة", "affected gates"), lang)}`);
    } else if (type === "drill") {
      const dr = store.drills.find((d) => d.id === id);
      if (dr) name = local(dr.title, lang);
    } else if (type === "gate") {
      const gt = store.gates.find((g) => g.id === id);
      if (gt) name = local(gt.requirement, lang);
    }

    setDeleteModalState({
      isOpen: true,
      type,
      id,
      name,
      affectedSummary,
    });
  };

  const confirmDelete = () => {
    const { type, id } = deleteModalState;
    let nextStore = { ...store };

    if (type === "level") {
      nextStore = deleteLevelWithIntegrity(store, id);
    } else if (type === "station") {
      nextStore = deleteStationWithIntegrity(store, id);
    } else if (type === "drill") {
      nextStore = deleteDrillWithIntegrity(store, id);
    } else if (type === "gate") {
      nextStore = deleteGateWithIntegrity(store, id);
    }

    onChangeStore(nextStore);
    setDeleteModalState({ isOpen: false, type: "level", id: "", name: "", affectedSummary: [] });
    setImportStatus({
      type: "success",
      message: local(b("تم تنفيذ الحذف مع الحفاظ على سلامة العلاقات.", "Deleted successfully while preserving referential integrity."), lang),
    });
  };

  // Import / Export JSON
  const handleExportJSON = () => {
    const jsonStr = exportCurriculumSuiteJSON(store);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `curriculum-suite-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = validateAndImportCurriculumSuiteJSON(content);
      if (res.valid && res.importedStore) {
        onChangeStore(res.importedStore);
        setImportStatus({
          type: res.warnings.length ? "warning" : "success",
          message: res.warnings.length
            ? res.warnings.join(" ")
            : local(b("تم استيراد المنهج بنجاح واستعادة جميع العلاقات.", "Curriculum suite imported successfully."), lang),
        });
      } else {
        setImportStatus({
          type: "danger",
          message: res.errors.join(" "),
        });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const t = {
    suiteTitle: local(b("جناح بناء المنهج الشامل · V2.1", "Unified Curriculum Builder Suite · V2.1"), lang),
    hierarchyToggle: local(b("شجرة الهيكل", "Hierarchy Tree"), lang),
    exportBtn: local(b("تصدير JSON", "Export JSON"), lang),
    importBtn: local(b("استيراد JSON", "Import JSON"), lang),
    newEntity: local(b("إضافة عنصر جديد", "Add New Entity"), lang),
    addLevel: local(b("+ المستوى", "+ Level"), lang),
    addStation: local(b("+ المحطة", "+ Station"), lang),
    addDrill: local(b("+ Drill", "+ Drill"), lang),
    addGate: local(b("+ Gate", "+ Gate"), lang),
  };

  return (
    <div className="curriculum-builder-suite">
      <header className="suite-header">
        <div className="suite-header-main">
          <h1>{t.suiteTitle}</h1>
          <div className="suite-quick-actions">
            <button type="button" className="secondary" onClick={handleExportJSON}>
              📥 {t.exportBtn}
            </button>
            <button type="button" className="secondary" onClick={() => fileInputRef.current?.click()}>
              📤 {t.importBtn}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <button
              type="button"
              className="secondary mobile-tree-toggle"
              onClick={() => setShowTreeMobile(!showTreeMobile)}
            >
              🌳 {t.hierarchyToggle}
            </button>
          </div>
        </div>

        {importStatus.message && (
          <StatusBanner
            type={importStatus.type === "danger" ? "instructor" : importStatus.type === "warning" ? "instructor" : "success"}
            message={importStatus.message}
          />
        )}

        {cycleCheck.hasCycle && (
          <StatusBanner
            type="instructor"
            message={local(
              b(
                `تحذير أمان: حلقة تكرار غير مصرح بها في الـGates (${cycleCheck.cyclePath.join(" ➔ ")})!`,
                `Safety Warning: Circular progression loop detected in Gates (${cycleCheck.cyclePath.join(" ➔ ")})!`,
              ),
              lang,
            )}
          />
        )}

        <div className="suite-tabbar" role="tablist" aria-label={t.suiteTitle}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                role="tab"
                type="button"
                aria-selected={isActive}
                className={`suite-tab-btn ${isActive ? "active" : ""} ${tab.complete ? "complete" : ""}`}
                onClick={() => setTab(tab.key)}
              >
                <span>{tab.complete ? "✓" : "○"}</span>
                <strong>{local(tab.label, lang)}</strong>
              </button>
            );
          })}
        </div>

        <div className="entity-add-bar">
          <small>{t.newEntity}:</small>
          <button type="button" className="mini-add-btn" onClick={handleAddLevel}>
            {t.addLevel}
          </button>
          <button type="button" className="mini-add-btn" onClick={handleAddStation}>
            {t.addStation}
          </button>
          <button type="button" className="mini-add-btn" onClick={handleAddDrill}>
            {t.addDrill}
          </button>
          <button type="button" className="mini-add-btn" onClick={handleAddGate}>
            {t.addGate}
          </button>
        </div>
      </header>

      <div className="suite-body-layout">
        <aside className={`suite-sidebar ${showTreeMobile ? "show-mobile" : ""}`}>
          <HierarchyTree
            lang={lang}
            store={store}
            onSelectEntity={(type, id) => {
              if (type === "level") onChangeStore({ ...store, activeLevelId: id, activeTab: "level" });
              else if (type === "station") onChangeStore({ ...store, activeStationId: id, activeTab: "station" });
              else if (type === "drill") onChangeStore({ ...store, activeDrillId: id, activeTab: "drill" });
              else if (type === "gate") onChangeStore({ ...store, activeGateId: id, activeTab: "gate" });
            }}
          />
        </aside>

        <main className="suite-content">
          {activeTab === "level" && (
            <LevelBuilder
              lang={lang}
              store={store}
              onUpdateLevel={handleUpdateLevel}
              onDeleteRequest={(id) => requestDelete("level", id)}
              onNextTab={() => setTab("station")}
            />
          )}

          {activeTab === "station" && (
            <StationBuilder
              lang={lang}
              store={store}
              onUpdateStation={handleUpdateStation}
              onDeleteRequest={(id) => requestDelete("station", id)}
              onPrevTab={() => setTab("level")}
              onNextTab={() => setTab("drill")}
            />
          )}

          {activeTab === "drill" && (
            <DrillBuilder
              lang={lang}
              store={store}
              onUpdateDrill={handleUpdateDrill}
              onDeleteRequest={(id) => requestDelete("drill", id)}
              onNextTab={() => setTab("gate")}
            />
          )}

          {activeTab === "gate" && (
            <GateBuilder
              lang={lang}
              store={store}
              mode={mode}
              onUpdateGate={handleUpdateGate}
              onDeleteRequest={(id) => requestDelete("gate", id)}
            />
          )}
        </main>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModalState.isOpen}
        lang={lang}
        title={local(b(`تأكيد حذف ${deleteModalState.type}`, `Confirm delete ${deleteModalState.type}`), lang)}
        itemType={deleteModalState.type.toUpperCase()}
        itemName={deleteModalState.name}
        affectedSummary={deleteModalState.affectedSummary}
        onConfirm={confirmDelete}
        onCancel={() =>
          setDeleteModalState({ isOpen: false, type: "level", id: "", name: "", affectedSummary: [] })
        }
      />
    </div>
  );
}
