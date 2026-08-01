# Design System V2: Trifecta Performance Lab

**Date:** July 30, 2026  
**Author:** Design Systems Engineer & Accessibility Specialist  
**Tech Stack:** Tailwind CSS v4, CSS Custom Properties, Vanilla CSS, Next.js 16.  

---

## 1. Core Token Specifications

```css
:root {
  /* Color Palette */
  --bg: #090b0c;
  --bg-soft: #0f1213;
  --panel: #131718;
  --panel-2: #181d1e;
  --panel-raised: #1f2527;
  --line: #2d3534;
  --line-soft: #202625;
  --line-gold: rgba(212, 160, 89, 0.28);
  
  /* Typography Colors */
  --text: #f4f2eb;
  --muted: #a6a59b;
  --faint: #767a74;
  
  /* Brand Accent: Restrained Gold / Amber */
  --amber: #d4a059;
  --amber-bright: #f5c67a;
  --amber-soft: rgba(212, 160, 89, 0.12);
  
  /* Status Colors */
  --safe: #7bb396;
  --safe-soft: rgba(123, 179, 150, 0.12);
  --danger: #dc6d60;
  --danger-soft: rgba(220, 109, 96, 0.14);
  --steel: #88a8a2;
  --steel-soft: rgba(136, 168, 162, 0.12);

  /* Layout & Geometry */
  --sidebar: 272px;
  --radius-sm: 6px;
  --radius: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  
  /* Motion Tokens */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 150ms;
  --duration-normal: 250ms;
}
```

---

## 2. Component Class Architecture

### A. Surface Containers
- `.surface-base`: Main page background panel (`background: var(--panel); border: 1px solid var(--line); border-radius: var(--radius);`).
- `.surface-raised`: Elevated interactive surface (`background: var(--panel-raised); border: 1px solid var(--line-gold); box-shadow: var(--shadow-raised);`).
- `.surface-danger`: Non-compensable critical failure container (`background: var(--danger-soft); border: 1px solid var(--danger); color: var(--text);`).

### B. Navigation & Sidebar
- `.sidebar-category`: Group header for vertical navigation with uppercase tracking and subtle gold accent.
- `.nav-item`: Accessible navigation link with active pill indicator, hover transition, and proper `aria-current="page"` support.

### C. Builder Workspaces
- `.workspace-grid`: 2-column responsive layout (`grid-template-columns: minmax(0, 1fr) minmax(360px, 440px)` on desktop; 1-column on mobile).
- `.preview-card`: Sticky live preview panel that updates immediately upon user input.

### D. Typography & Bilingual Rules
- Arabic body line-height is locked to `1.7` to prevent descender clipping.
- Embedded Latin terms use `<bdi>` or `dir="ltr"` inline styling to preserve correct punctuation ordering.
- Tabular numbers enabled for metrics (`font-variant-numeric: tabular-nums`).

---

## 3. Motion & Reduced-Motion Standards

- All hover effects, tab switches, and accordion expansions use `transition: all 250ms cubic-bezier(0.16, 1, 0.3, 1)`.
- Reduced-motion media query suppresses transforms and opacity animations for sensitive users:
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
