"use client";

import React from "react";

export interface WorkspaceShellProps {
  form: React.ReactNode;
  preview: React.ReactNode;
  className?: string;
}

export function WorkspaceShell({ form, preview, className = "" }: WorkspaceShellProps) {
  return (
    <div className={`builder-layout ${className}`}>
      <div className="builder-main-form">{form}</div>
      <aside className="builder-preview-aside">{preview}</aside>
    </div>
  );
}
