# Trifecta Performance Lab — Dark Tactical Refinement System

This file refines `DESIGN_NORTH_STAR.md` for V2.3.1. It does not replace it. When guidance conflicts, product and safety invariants, the North Star, and existing functional behaviour remain authoritative.

## Design intent

The interface is a calm, high-stakes performance operations workspace: disciplined, evidence-led, Arabic-first, and legible under pressure. It should communicate technical depth without looking like a game, military cosplay, a sci-fi HUD, or a generic SaaS dashboard.

## Five refinement themes

1. **Signature pyramid:** preserve the three-face Trifecta metaphor; increase face differentiation, structural depth, external-label clarity, and the visibility of integrated actual performance. Use SVG and CSS only. One sequenced entrance and a nearly imperceptible settled-state drift are allowed; both must settle immediately under reduced motion.
2. **Landing composition:** treat the hero copy and pyramid as one composition, not adjacent cards. Give the primary path one dominant action, maintain a clear operational context strip, and use deliberate section transitions instead of empty space.
3. **Global shell:** expose the current group and route, group navigation consistently, and keep language/mode controls reachable. Desktop should be dense but calm; tablet and mobile must preserve a clear route cue and 44px minimum targets.
4. **Builder and Gate workspaces:** make Level → Station → Drill → Gate progression visually continuous. Use the available desktop width, group related fields, keep evidence and immutable attempt history legible, and contain Critical Failure / No-Go in a strong red safety frame without relying on colour alone.
5. **Arabic typography and rhythm:** retain IBM Plex Sans Arabic. Arabic body copy uses generous line-height, controlled measure, logical alignment, safe wrapping, and `bdi`/`dir="auto"` for mixed terminology. Never compress Arabic to achieve artificial density.

## Foundations

- Canvas: `#070B10`; soft canvas: `#0A1016`.
- Panels: `#0D151D`, `#111C26`, raised `#16232E`.
- Structure: `#21303C`; soft structure: `#182732`.
- Primary text: `#F2F6F8`; supporting text: `#B2C0CA`; secondary metadata: `#7E909D` only when contrast remains sufficient.
- Interaction: teal `#20C7B7`; technical dimension: ocean `#3AA7D8`; instructional emphasis: amber `#D5A04A`.
- Status colours remain semantic: safe `#35C878`, critical `#F0525B`, need data `#5596E6`, retest `#E1A53A`.
- Surfaces use restrained borders, inner highlights, and directional shadows. Avoid blur-heavy glass, broad glow, neon, scanlines, camouflage, and ornamental grids.

## Typography and density

- Arabic-first typeface: IBM Plex Sans Arabic with the existing fallbacks.
- Body text: never below 16px on mobile; line-height 1.7–1.85 in Arabic and 1.55–1.7 in English.
- Operational labels may use compact uppercase English, but Arabic labels retain natural casing and letter spacing.
- Headings use a modular scale and `text-wrap: balance`; prose uses `text-wrap: pretty` where supported.
- Comfortable line measures: 52–72 Latin characters and approximately 36–58 Arabic characters for primary explanatory copy.
- Density comes from hierarchy and progressive disclosure, not tiny fonts or collapsed padding.

## Layout and interaction

- Use a 12-column mental model: 3/9 for navigation and work, 7/5 or 8/4 for authoring and evidence, and 6/6 only for genuinely equivalent content.
- Preserve content-responsive heights. Do not force card equality.
- Every interactive target is at least 44px on touch layouts and has a visible focus state.
- Active navigation combines position, border, label, and marker; never colour alone.
- Motion uses opacity and transform, normally 180–340ms with an ease-out curve. No continuous decorative motion. Settled ambient motion is limited to the signature pyramid and disabled by reduced motion.
- Errors are inline, specific, and recovery-oriented. Critical state uses `role="alert"` where appropriate.

## Signature visual rules

- Labels stay outside the pyramid faces and connect with clear leaders.
- Each face must remain distinct in luminance as well as hue.
- The integrated output is a visible convergence chamber and labelled outcome, not a decorative centre dot.
- Mobile uses a compact geometric overview followed immediately by full-width readable controls; it never shrinks desktop labels into the SVG.

## Explicitly rejected UI/UX Pro Max recommendations

- Webinar/conversion layouts: wrong product pattern.
- Cyberpunk HUD, glitch, scanlines, terminal fonts, neon palettes, or gaming motifs: undermine institutional credibility.
- Cinematic ambient blobs, heavy glow, glassmorphism, and persistent background animation: add noise and reduce contrast.
- Three.js, GSAP, or a new motion dependency: unnecessary for the required SVG/CSS behaviour.
- Noto Naskh or a new font dependency: conflicts with the North Star and adds loading risk.
- Green as a universal CTA: green remains a semantic success state; teal remains the interaction colour.
- Haptics and native-mobile interaction patterns: outside this web/PWA refinement scope.
- Universal 8–12px dense spacing: unsuitable for Arabic readability and high-stakes forms.

## Review gates

Every refinement must preserve schema, migration, storage, import/export, Gate decisions, Critical Failure overrides, attempt history, PWA/offline behaviour, and curriculum meaning. Validate Arabic RTL and English LTR at 320, 390, 768, 1280, and 1440 widths; keyboard focus; reduced motion; overflow; console/hydration health; and static Vercel output.
