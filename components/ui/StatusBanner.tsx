"use client";

import React from "react";

export interface StatusBannerProps {
  type: "critical" | "instructor" | "info" | "success";
  title?: string;
  message: string;
  icon?: string;
  role?: "alert" | "status" | "region";
  className?: string;
}

export function StatusBanner({
  type,
  title,
  message,
  icon,
  role = type === "critical" ? "alert" : "status",
  className = "",
}: StatusBannerProps) {
  const defaultIcon =
    type === "critical" ? "⛔" : type === "instructor" ? "⚡" : type === "success" ? "✓" : "ℹ";

  const bannerClass =
    type === "critical"
      ? "critical-safety-alert"
      : type === "instructor"
      ? "instructor-mode-banner"
      : type === "success"
      ? "status-ok"
      : "boundary-note";

  return (
    <div
      aria-live={type === "critical" ? "assertive" : "polite"}
      className={`${bannerClass} ${className}`}
      role={role}
    >
      <span aria-hidden="true" className="banner-icon">
        {icon || defaultIcon}
      </span>
      <div className="banner-content">
        {title && <strong className="banner-title">{title} </strong>}
        <span className="banner-message">{message}</span>
      </div>
    </div>
  );
}
