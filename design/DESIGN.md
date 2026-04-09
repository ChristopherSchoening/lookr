# Design System: The Clinical Curator

This design system is a comprehensive framework for 'lookr', a health tracking platform that balances medical precision with a high-end editorial feel. We move beyond the generic "wellness" aesthetic to create a space that feels like a private, high-tech clinic: sterile yet welcoming, minimalist yet deeply intentional.

---

## 1. Overview & Creative North Star

**Creative North Star: "The Clinical Curator"**
The goal of this system is to present complex health data with the clarity of a modern art gallery and the authority of a premium medical lab. We avoid the "template" look by eschewing standard borders and rigid grids in favor of **Tonal Layering** and **Intentional Asymmetry**.

By utilizing generous whitespace (the "oxygen" of the UI) and a high-contrast typography scale, we ensure that every metric feels like a curated piece of information rather than just a row in a database.

---

## 2. Colors & Surface Logic

Our palette is anchored by the vibrant Emerald Green, used sparingly but powerfully to signify health, vitality, and clinical "go" states.

### Palette Strategy

- **Primary (#006C48) & Primary Container (#00D18E):** These are your "vitals." Use the Emerald Green (#00D18E) for high-importance interactions and primary data visualizations.
- **Neutral Foundation:** We use a cool-toned white (`surface`: #F8FAFB) to maintain a sterile, clinical backdrop.

### The "No-Line" Rule

**Explicit Instruction:** Do not use 1px solid borders to section off content. Traditional borders create visual noise. Instead, boundaries must be defined through:

1.  **Background Shifts:** Place a `surface-container-low` (#F2F4F5) section against the `surface` background.
2.  **Vertical Space:** Use the spacing scale to create clear mental models of separation.

### The "Glass & Gradient" Rule

To elevate the app from a "utility" to a "premium experience," use **Glassmorphism** for floating headers or navigation bars.

- **Implementation:** Use `surface` at 80% opacity with a `20px` backdrop-blur.
- **Signature Textures:** Apply a subtle linear gradient (Top-Left: `primary` to Bottom-Right: `primary-container`) on hero CTAs to add "soul" and depth without introducing skewmorphism.

---

## 3. Typography: The Editorial Scale

We use **Manrope** for its geometric clarity and modern humanist qualities. The hierarchy is designed to feel like a high-end health journal.

- **Display (Display-LG/MD):** Used for single, "Hero Metrics" (e.g., your daily step count or heart rate). These should be bold and unapologetically large.
- **Headlines (Headline-SM/MD):** Use these for section titles. The high contrast between a `display` metric and a `headline` label creates the "Clinical Curator" feel.
- **Body (Body-LG/MD):** Set in `on-surface-variant` (#3C4A41) for optimal readability without the harshness of pure black.
- **Labels (Label-MD):** Always uppercase with a +5% letter-spacing for a sophisticated, data-driven look.

---

## 4. Elevation & Depth: Tonal Layering

We reject traditional drop shadows. We create depth through the "Stacking Principle."

- **The Layering Principle:** Imagine the UI as sheets of fine paper.
  - Base: `surface` (#F8FAFB)
  - Section: `surface-container-low` (#F2F4F5)
  - Interactive Card: `surface-container-lowest` (#FFFFFF)
- **Ambient Shadows:** If an element must float (like a FAB or a Modal), use a "Clinical Glow."
  - _Shadow:_ `0px 12px 32px rgba(25, 28, 29, 0.04)`. It should be barely perceptible.
- **The Ghost Border:** If accessibility requires a stroke (e.g., in high-contrast mode), use `outline-variant` at 15% opacity. Never 100%.

---

## 5. Components

### The Abstract Logo: 'lookr'

The logo is a clean geometric composition. A single 45-degree curve (the "path") meeting a solid dot (the "target"). It represents the journey toward a health goal. **Constraint:** No eye shapes or literal representations of "looking."

### Primary Buttons

- **Style:** Pill-shaped (`rounded-full`).
- **Color:** `primary-container` (#00D18E) with `on-primary-container` text.
- **Interaction:** On hover/tap, transition to a subtle gradient to provide tactile feedback.

### Data Cards

- **Rule:** Forbid divider lines.
- **Layout:** Use `surface-container-highest` for small accent details (like a category tag) inside a `surface-container-low` card.
- **Metrics:** Align metrics to the top-left to emphasize the "curated" editorial style.

### Input Fields

- **Style:** Minimalist underline or soft-fill. No "box" containers.
- **Focus State:** The label floats and transforms into `Label-SM` in the `primary` emerald color.

### Health Chips

- **Usage:** For filtering "Sleep," "Heart," or "Activity."
- **State:** Unselected chips use `surface-container-high`. Selected chips use the `secondary-fixed` (#B4F0CD) tone to feel softer than a primary action.

---

## 6. Do's and Don'ts

### Do

- **Do** use asymmetrical margins (e.g., a wider left margin than right) for headline-heavy pages to mimic premium magazine layouts.
- **Do** use "Clinical Green" (#00D18E) for data that is "In Range."
- **Do** prioritize the `Manrope` typeface's light and regular weights; avoid heavy weights unless in `display` sizes.

### Don't

- **Don't** use 1px dividers or borders. This is the quickest way to break the "Clinical Curator" aesthetic.
- **Don't** use standard "Material Blue" or "Success Green." Stick strictly to the Emerald (#00D18E) and its tonal variants.
- **Don't** use iconography with rounded, bubbly ends. Use sharp, geometric, or semi-rounded Manrope-adjacent icons (e.g., 2pt stroke weight).
- **Don't** crowd the interface. If a screen feels full, it is over-designed. Remove an element or increase the `surface` area.
