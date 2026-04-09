# Design System Strategy: The Vitality Edit

## 1. Overview & Creative North Star: "The Living Data Lab"

This design system moves away from the sterile, clinical nature of traditional health trackers. Our Creative North Star is **"The Living Data Lab."** We treat nutrition and health data not as static numbers, but as a fluid, organic narrative.

To break the "template" look, we leverage **intentional asymmetry** and **tonal layering**. We avoid the rigid 12-column grid in favor of an editorial layout where hero metrics (calories, macros) are oversized and offset, overlapping their containers to create a sense of forward momentum. This is a premium, tactile experience where data feels "held" by the UI, not just displayed on it.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule

The palette is rooted in a lush, verdant foundation (`background: #d9ffef`) that evokes freshness, punctuated by high-energy accents.

- **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning. Structural definition must be achieved through background shifts. For example, a `surface-container-low` card sits atop a `surface` background. The eye should perceive depth through color, not outlines.
- **Surface Hierarchy & Nesting:** Treat the interface as a physical stack.
  - **Level 0 (Base):** `surface` or `background`.
  - **Level 1 (Subtle Inset):** `surface-container-low` for secondary information.
  - **Level 2 (Active Cards):** `surface-container-lowest` (pure white in light mode) to create a "pop" of high-focus content.
- **The "Glass & Gradient" Rule:** For floating elements (like a FAB or navigation bar), utilize Glassmorphism. Use `surface-variant` at 60% opacity with a `24px` backdrop-blur.
- **Signature Textures:** For high-impact progress bars or "Goal Achieved" states, do not use flat colors. Use a linear gradient from `primary` (#006945) to `primary-container` (#51f8b1) to give the UI "soul" and a sense of glow.

---

## 3. Typography: Editorial Authority

We use a high-contrast pairing of **Manrope** and **Inter** to balance data-driven density with sophisticated readability.

- **Display & Headlines (Manrope):** These are our "Voice." We use `display-lg` and `headline-lg` for daily totals. Manrope’s geometric but warm curves make large numbers feel approachable.
- **Body & Titles (Inter):** These are our "Engine." Inter provides maximum legibility at small sizes for ingredient lists and nutritional labels.
- **The Scale:**
  - **Oversized Impact:** Use `display-lg` (3.5rem) for the primary calorie count.
  - **Label Precision:** Use `label-md` (0.75rem) in all-caps with 5% letter-spacing for macro headers (e.g., "PROTEIN," "CARBS") to evoke a high-end magazine aesthetic.

---

## 4. Elevation & Depth: Tonal Layering

Traditional shadows are a last resort. We convey hierarchy through **Tonal Layering** and ambient light.

- **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container` section. The subtle shift in the green-tinted neutrals creates a soft, natural lift that feels native to the screen.
- **Ambient Shadows:** When a card must float (e.g., a meal log entry), use a shadow color derived from `on-surface` (#003629) at 6% opacity, with a `blur: 40px` and `y: 12px`. It should look like a soft glow, not a dark smudge.
- **The "Ghost Border" Fallback:** If accessibility requirements demand a container boundary, use a **Ghost Border**: `outline-variant` (#82b8a4) at 15% opacity. Never use 100% opaque borders.
- **Tactile Feedback:** Every interactive element should feel like a physical button. Use `roundedness-xl` (1.5rem) for cards and `roundedness-full` for chips to make the interface feel "soft" to the touch.

---

## 5. Components: Tactile & Fluid

### Buttons

- **Primary:** A vibrant `primary` fill with `on-primary` text. Use `roundedness-full` and a subtle gradient of `primary` to `primary-dim` to suggest a convex, pressable surface.
- **Secondary:** Use `secondary-container` with `on-secondary-container`. No border; the color shift provides the affordance.

### Input Fields

- **The "Soft Inset" Look:** Use `surface-container-high` as the background for input fields. Instead of a focus border, use a 2px `primary` bottom-bar that expands from the center when active.

### Cards & Lists

- **No Dividers:** Prohibit the use of horizontal rules (`<hr>`). Separate list items using `spacing-md` (16px) or by alternating subtle background shifts between `surface-container-low` and `surface-container-high`.
- **The "Data Overlap" Card:** For meal tracking, allow the image of the food to bleed off the left edge of the card, breaking the container's margin for an editorial feel.

### Specialized Health Components

- **Progress Rings:** Use a thickness of `12px`. The "track" should be `surface-variant` at 30% opacity, while the "fill" uses the `primary` to `primary-container` gradient.
- **Macro Chips:** Small, `roundedness-full` badges using `secondary-container` for Fats, `tertiary-container` for Protein, and `primary-container` for Carbs.

---

## 6. Do's and Don'ts

### Do:

- **Do** use asymmetrical margins. A wider left margin (e.g., 24px) versus a tighter right margin (16px) creates a modern, editorial rhythm.
- **Do** lean into the green. Use `surface-dim` for empty states to keep the brand's vibrant, healthy "soul" alive even when data is missing.
- **Do** use `roundedness-xl` for any container that holds an image.

### Don't:

- **Don't** use pure black (#000000) for text. Always use `on-surface` (#003629) to maintain the sophisticated, organic tonal range.
- **Don't** use 1px dividers. If you feel the need to separate content, increase the white space or shift the background tint.
- **Don't** use standard Material shadows. Keep them diffused, tinted, and barely there.
