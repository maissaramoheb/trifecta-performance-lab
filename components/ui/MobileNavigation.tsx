"use client";

import React, { useEffect, useRef } from "react";

export interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
  children: React.ReactNode;
  closeLabel: string;
}

export function MobileNavigation({
  isOpen,
  onClose,
  triggerRef,
  children,
  closeLabel,
}: MobileNavigationProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        triggerRef?.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <>
      <button
        aria-label={closeLabel}
        className="nav-scrim"
        onClick={() => {
          onClose();
          triggerRef?.current?.focus();
        }}
      />
      <div className="mobile-nav-wrapper" ref={drawerRef}>
        {children}
      </div>
    </>
  );
}
