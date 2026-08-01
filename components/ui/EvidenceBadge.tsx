"use client";

import React from "react";

export interface EvidenceBadgeProps {
  type: "evidence" | "assumption" | "safe" | "danger" | "source" | "default";
  children: React.ReactNode;
  className?: string;
}

export function EvidenceBadge({ type, children, className = "" }: EvidenceBadgeProps) {
  return <span className={`badge badge-${type} ${className}`}>{children}</span>;
}
