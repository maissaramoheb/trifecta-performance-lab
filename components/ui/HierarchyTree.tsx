"use client";

import { b, type Lang } from "../../lib/content";
import type { CurriculumSuiteStore } from "../../lib/curriculum-builder-types";

const local = (value: { ar: string; en: string } | string, lang: Lang) =>
  typeof value === "string" ? value : value[lang];

type HierarchyTreeProps = {
  lang: Lang;
  store: CurriculumSuiteStore;
  onSelectEntity: (type: "level" | "station" | "drill" | "gate", id: string) => void;
};

export function HierarchyTree({ lang, store, onSelectEntity }: HierarchyTreeProps) {
  const t = {
    title: local(b("شجرة الهيكل المعتمد", "Authoritative Hierarchy Tree"), lang),
    empty: local(b("لا توجد مستويات معرفة بعد.", "No levels defined yet."), lang),
  };

  return (
    <div className="hierarchy-tree-card" aria-label={t.title}>
      <div className="tree-header">
        <span>LAYOUT</span>
        <strong>{t.title}</strong>
      </div>
      <div className="tree-body">
        {store.levels.length === 0 ? (
          <p className="empty">{t.empty}</p>
        ) : (
          store.levels.map((lvl, lIdx) => {
            const isLvlActive = store.activeLevelId === lvl.id;
            const lvlStations = store.stations.filter((s) => lvl.stationIds.includes(s.id) || s.levelId === lvl.id);

            return (
              <div key={lvl.id} className={`tree-level-node ${isLvlActive ? "active" : ""}`}>
                <button
                  type="button"
                  className="tree-node-btn level-btn"
                  onClick={() => onSelectEntity("level", lvl.id)}
                >
                  <bdi>L{lIdx + 1}</bdi>
                  <span>{local(lvl.name, lang)}</span>
                </button>

                <div className="tree-children">
                  {lvlStations.map((st, sIdx) => {
                    const isStActive = store.activeStationId === st.id;
                    const stDrills = store.drills.filter((d) => st.drillIds.includes(d.id) || d.stationId === st.id);
                    const stGate = store.gates.find((g) => g.id === st.gateId || g.fromStationId === st.id);

                    return (
                      <div key={st.id} className={`tree-station-node ${isStActive ? "active" : ""}`}>
                        <button
                          type="button"
                          className="tree-node-btn station-btn"
                          onClick={() => onSelectEntity("station", st.id)}
                        >
                          <bdi>S{sIdx + 1}</bdi>
                          <span>{local(st.name, lang)}</span>
                        </button>

                        <div className="tree-sub-children">
                          {stDrills.map((dr, dIdx) => {
                            const isDrActive = store.activeDrillId === dr.id;
                            return (
                              <button
                                key={dr.id}
                                type="button"
                                className={`tree-node-btn drill-btn ${isDrActive ? "active" : ""}`}
                                onClick={() => onSelectEntity("drill", dr.id)}
                              >
                                <bdi>D{dIdx + 1}</bdi>
                                <span>{local(dr.title, lang)}</span>
                              </button>
                            );
                          })}

                          {stGate && (
                            <button
                              type="button"
                              className={`tree-node-btn gate-btn ${store.activeGateId === stGate.id ? "active" : ""}`}
                              onClick={() => onSelectEntity("gate", stGate.id)}
                            >
                              <bdi>G</bdi>
                              <span>{local(b("Gate · شرط الانتقال", "Gate · Transition"), lang)}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
