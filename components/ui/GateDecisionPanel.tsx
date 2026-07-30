"use client";

import React from "react";
import { StatusBanner } from "./StatusBanner";

export type DecisionType = "go" | "no-go" | "need-more-data" | "retest" | "pending";

export interface GateDecisionPanelProps {
  title: string;
  requirement: string;
  effectiveDecision: DecisionType;
  hasCritical: boolean;
  isReady: boolean;
  mode: "learner" | "instructor";
  decisionLabels: Record<DecisionType, string>;
  statusMessages: {
    automaticNoGo: string;
    criticalExplanation: string;
    ready: string;
    incomplete: string;
    instructorOnly: string;
    gateEvidenceLabel: string;
    remediationLabel: string;
    gateLabel: string;
    decisionLegend: string;
  };
  evidenceValue?: string;
  remediationValue?: string;
  onDecisionChange?: (decision: DecisionType) => void;
  onEvidenceChange?: (evidence: string) => void;
  onRemediationChange?: (remediation: string) => void;
  className?: string;
}

export function GateDecisionPanel({
  title,
  requirement,
  effectiveDecision,
  hasCritical,
  isReady,
  mode,
  decisionLabels,
  statusMessages,
  evidenceValue = "",
  remediationValue = "",
  onDecisionChange,
  onEvidenceChange,
  onRemediationChange,
  className = "",
}: GateDecisionPanelProps) {
  const decisionsList: DecisionType[] = ["go", "no-go", "need-more-data", "retest"];

  return (
    <section
      aria-live="polite"
      aria-label={`${statusMessages.gateLabel}: ${title}`}
      className={`gate-panel decision-${effectiveDecision} ${className}`}
    >
      {hasCritical && (
        <StatusBanner
          message={`${statusMessages.automaticNoGo} ${statusMessages.criticalExplanation}`}
          type="critical"
        />
      )}
      <div className="gate-panel-head">
        <div className="gate-emblem">
          <span>G</span>
          <strong>{statusMessages.gateLabel}</strong>
        </div>
        <div>
          <h2>{title}</h2>
          <p>{requirement}</p>
        </div>
        <div className="effective-decision">
          <span>{decisionLabels[effectiveDecision]}</span>
          <small>
            {hasCritical
              ? statusMessages.automaticNoGo
              : isReady
              ? statusMessages.ready
              : statusMessages.incomplete}
          </small>
        </div>
      </div>
      {mode === "instructor" ? (
        <div className="gate-controls">
          <fieldset>
            <legend>{statusMessages.decisionLegend}</legend>
            <div className="decision-options">
              {decisionsList.map((decision) => (
                <button
                  aria-pressed={effectiveDecision === decision}
                  disabled={hasCritical || (decision === "go" && !isReady)}
                  key={decision}
                  onClick={() => onDecisionChange?.(decision)}
                  type="button"
                >
                  {decisionLabels[decision]}
                </button>
              ))}
            </div>
          </fieldset>
          <label>
            <span>{statusMessages.gateEvidenceLabel}</span>
            <textarea
              dir="auto"
              onChange={(e) => onEvidenceChange?.(e.target.value)}
              value={evidenceValue}
            />
          </label>
          <label>
            <span>{statusMessages.remediationLabel}</span>
            <textarea
              dir="auto"
              onChange={(e) => onRemediationChange?.(e.target.value)}
              value={remediationValue}
            />
          </label>
        </div>
      ) : (
        <p className="mode-guidance">{statusMessages.instructorOnly}</p>
      )}
    </section>
  );
}
