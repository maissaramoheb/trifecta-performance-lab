"use client";

import React from "react";

export interface PageHeaderProps {
  eyebrow: string;
  title: string;
  intro: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ eyebrow, title, intro, actions, className = "" }: PageHeaderProps) {
  return (
    <header className={`section-head ${className}`}>
      <div className="eyebrow">{eyebrow}</div>
      <h1>{title}</h1>
      <p>{intro}</p>
      {actions && <div className="hero-actions">{actions}</div>}
    </header>
  );
}
