# Design System Specification: The Clinical Sanctuary

## 1. Overview & Creative North Star

### The Creative North Star: "Luminous Precision"
This design system moves away from the sterile, flat aesthetic of traditional medical software. Instead, it embraces the concept of **Luminous Precision**—a digital environment that feels like a high-end medical sanctuary. We achieve this through a "Clinical Editorial" approach: high-contrast typography scales, intentional asymmetry, and a sophisticated layering of semi-transparent surfaces.

The goal is to provide a sense of calm authority. We break the "standard template" look by utilizing breathing room (negative space) as a structural element, allowing the vibrant primary and secondary tones to act as surgical beacons of information against a soft, multi-layered background.

---

## 2. Colors

### Palette Strategy
The palette transitions from the professional trust of **Bright Blue (`primary`)** to the organic vitality of **Vibrant Green/Teal (`secondary`)**. These are balanced by a sophisticated grayscale that favors cool, sterile-clean surfaces over warm neutrals.

- **Primary (`#005da7`)**: Use for core actions and brand anchors.
- **Secondary (`#3c6a00`)**: Use for "wellness" indicators, success states, and growth-oriented data.
- **Tertiary (`#006673`)**: Reserved for deep-dive interactive elements and specialized clinical segments.

### The "No-Line" Rule
**Prohibit 1px solid borders for sectioning.** Structural boundaries must be defined through background color shifts. To separate a sidebar from a main content area, place a `surface-container-low` section against the `surface` background. The eye should perceive change through tonal shifts, not harsh strokes.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the `surface-container` tiers to create depth:
*   **Base Layer:** `surface` (#f8fafb)
*   **Sub-Section:** `surface-container-low` (#f2f4f5)
*   **Primary Cards/Content:** `surface-container-lowest` (#ffffff)
*   **Elevated Overlays:** `surface-container-high` (#e6e8e9)

### The "Glass & Gradient" Rule
To inject "soul" into the clinical aesthetic:
- **Glassmorphism:** For floating modals or navigation bars, use `surface` colors at 80% opacity with a `backdrop-filter: blur(12px)`.
- **Signature Gradients:** For Hero backgrounds or Primary CTAs, use a subtle linear gradient from `primary` (#005da7) to `primary_container` (#2976c7) at a 135-degree angle.

---

## 3. Typography

**Font Family:** Inter (Optical sizing enabled)

The typography scale is designed for editorial impact. We use drastic size differences between Display and Body text to create a clear information hierarchy that feels premium and curated.

*   **Display (lg/md/sm):** Reserved for high-level dashboard summaries or welcoming headers. Use `letter-spacing: -0.02em` for a tighter, high-end feel.
*   **Headline & Title:** Used for section headers. These should always sit on `surface` or `surface-container-lowest` to ensure maximum contrast.
*   **Body (lg/md/sm):** The workhorse for clinical data. Use `body-md` (0.875rem) as the standard for data density, ensuring line-height is generous (1.5) to maintain the "Sanctuary" feel.
*   **Labels:** Use `on-surface-variant` (#414751) for labels to create a soft distinction from the primary data.

---

## 4. Elevation & Depth

### The Layering Principle
Forget shadows for standard cards. Achieve depth by "stacking." A white card (`surface-container-lowest`) placed on a light grey background (`surface-container-low`) provides a soft, natural lift that mimics fine paper.

### Ambient Shadows
When a component must float (e.g., a dropdown or a floating action button):
- **Blur:** 32px to 64px.
- **Opacity:** 4%–8%.
- **Color:** Use a tinted shadow. Instead of pure black, use `on-surface` (#191c1d) mixed with a hint of `primary`.

### The "Ghost Border" Fallback
If an element requires a container but color-shifting isn't enough (e.g., high-density data inputs), use a **Ghost Border**:
- **Stroke:** 1px
- **Color:** `outline-variant` (#c1c7d3) at **20% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons
*   **Primary:** Solid `primary` background with `on-primary` text. Use `xl` (1.5rem) or `full` roundedness for a pill-shaped, approachable feel.
*   **Secondary:** `secondary_container` background with `on-secondary_container` text. This is for "positive" but non-primary actions.
*   **Tertiary/Ghost:** No background. Use `primary` text. Transitions to `surface-container-high` on hover.

### Cards & Lists
*   **Constraint:** Absolutely no divider lines between list items. 
*   **Separation:** Use `1.5rem` (xl) vertical white space or a subtle `0.5rem` (sm) margin with a background color toggle (zebra-striping using `surface-container-low`).

### Input Fields
*   **Style:** Minimalist. No bottom line or full box. Use `surface-container-highest` as a subtle background fill with a `md` (0.75rem) corner radius.
*   **Active State:** The background remains, but a 2px `primary` "Ghost Border" (at 40% opacity) appears to signal focus.

### Chips
*   **Action Chips:** Pill-shaped, `surface-container-high` background.
*   **Selection Chips:** When active, transition to `secondary` with `on-secondary` text to signify "healthy/active" status.

---

## 6. Do's and Don'ts

### Do
*   **DO** use asymmetric layouts. For example, a wide column for clinical notes (left) paired with a narrower, elevated card for patient vitals (right).
*   **DO** use `secondary` (#3c6a00) for anything related to patient progress, recovery, or "green-light" status.
*   **DO** lean into "Breathing Room." If you think there's enough padding, add 8px more.

### Don't
*   **DON'T** use 100% opaque black for text. Always use `on-surface` (#191c1d) to keep the aesthetic soft.
*   **DON'T** use default Material Design "Drop Shadows." They are too heavy for the Clinical Sanctuary aesthetic.
*   **DON'T** use sharp 90-degree corners. Stick strictly to the **rounded-eight styling** (0.5rem base) to maintain a friendly, safe environment.

---

## 7. Roundedness Scale (Reference)
- **Small (sm):** 0.25rem (Inner elements, small tags)
- **Default:** 0.5rem (Standard cards, inputs)
- **Medium (md):** 0.75rem (Large cards, modals)
- **Large (lg):** 1rem (Hero sections, main containers)
- **Full:** 9999px (Buttons, Search bars, Pills)