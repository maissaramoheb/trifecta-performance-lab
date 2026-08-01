"use client";

import React from "react";

export interface WorkspaceShellProps {
  form: React.ReactNode;
  preview: React.ReactNode;
  label: string;
  steps: string[];
  activeStep: number;
  summary?: React.ReactNode;
  className?: string;
}

export function WorkspaceShell({
  form,
  preview,
  label,
  steps,
  activeStep,
  summary,
  className = "",
}: WorkspaceShellProps) {
  return (
    <section aria-label={label} className={`workspace-shell ${className}`}>
      <div className="workspace-rail">
        <ol aria-label={label}>
          {steps.map((step, index) => {
            const state = index < activeStep ? "complete" : index === activeStep ? "current" : "upcoming";
            return (
              <li aria-current={state === "current" ? "step" : undefined} data-state={state} key={step}>
                <span aria-hidden="true">{state === "complete" ? "✓" : index + 1}</span>
                <strong>{step}</strong>
              </li>
            );
          })}
        </ol>
        {summary && <div aria-live="polite" className="workspace-summary">{summary}</div>}
      </div>
      <div className="builder-layout">
        <div className="builder-main-form">{form}</div>
        <div className="builder-preview-aside">{preview}</div>
      </div>
    </section>
  );
}
