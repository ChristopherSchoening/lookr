# Feature Specification: Simplified Tracking UI

**Feature Branch**: `004-ui-simplification`  
**Created**: 2026-04-11  
**Status**: Draft  
**Input**: User description: "let's improve the ui in general. there are a few tweaks needed. the navigation bar should not be rounded. the screens are cluttered. they contain more info than needed. reduce the info on the screens to the bare minimum. rename dashboard to home. add icons for the tabs. history should be the place to also edit meals or remove. remove non-existent feature copy. remove the weird white background rectangle on the first card of each tab. progress should focus on weights, adherence, trend chart or history, and weight change since last track."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Use a Cleaner Home Tab (Priority: P1)

A user opens the main tab and sees only the core daily actions and summary they need: the renamed Home tab, a clear way to add a meal, and a points overview without decorative or promotional copy.

**Why this priority**: The main tab is the first screen users see. Extra text and visual clutter make the core tracking task slower and less clear.

**Independent Test**: Can be fully tested by opening the main tab and confirming the tab is labeled Home, the tab bar uses icons, the bar shape is not rounded, the first content card does not show the unwanted white rectangle, and only the core meal and points actions remain visible.

**Acceptance Scenarios**:

1. **Given** a user opens the main tab, **When** the screen finishes loading, **Then** the tab label reads Home instead of Dashboard.
2. **Given** a user views the main tab, **When** they scan the screen, **Then** they see a meal action and points overview without placeholder copy or explanatory marketing text.
3. **Given** a user views the tab bar, **When** it renders, **Then** each tab includes an icon and the bar does not appear with rounded corners.
4. **Given** a user views the first content card on the tab, **When** the screen renders, **Then** no stray white background rectangle appears behind or around the card.

**Automated Proof**: Extend the existing Playwright tab-navigation coverage to assert the Home label, visible meal action, points summary, tab icons, and absence of removed placeholder copy on the main tab.

---

### User Story 2 - Manage Meals From History (Priority: P2)

A user opens History and can review prior meals, edit an existing meal entry, or remove one from the same place without seeing copy about unavailable future tools.

**Why this priority**: History is where users correct mistakes. If editing or deletion lives elsewhere or is missing, the tracking flow stays frustrating.

**Independent Test**: Can be fully tested by opening History, selecting an existing meal, editing it, deleting another meal, and confirming no placeholder message about non-existent future features is shown.

**Acceptance Scenarios**:

1. **Given** a user opens History with prior meals, **When** the screen renders, **Then** each meal can be accessed for review from that tab.
2. **Given** a user wants to correct a logged meal, **When** they choose to edit it from History, **Then** the updated meal details are saved and shown in the history list.
3. **Given** a user wants to remove a logged meal, **When** they choose to delete it from History, **Then** the meal is removed from the history list and related totals update accordingly.
4. **Given** a user opens History, **When** they scan the screen, **Then** they do not see copy about unavailable or future-only features.

**Automated Proof**: Extend existing Playwright meal-history coverage or add focused history flow coverage for meal edit and delete actions from the History tab.

---

### User Story 3 - Review Only Core Progress Signals (Priority: P3)

A user opens Progress and sees only the core tracking signals needed to judge momentum: weight entries, adherence, trend history, and weight change since the last logged measurement.

**Why this priority**: Progress should support quick review. Long explanations and filler content distract from the actual tracking signals.

**Independent Test**: Can be fully tested by opening Progress and confirming the screen shows weight logging, adherence, trend history, and weight change since the last track while removed explanatory sections no longer appear.

**Acceptance Scenarios**:

1. **Given** a user opens Progress, **When** the screen finishes loading, **Then** the visible sections are limited to weight tracking, adherence, trend history or chart, and weight change since the last logged track.
2. **Given** a user has at least two weight entries, **When** they view Progress, **Then** the screen shows the change from the latest entry to the immediately previous tracked weight.
3. **Given** a user opens Progress, **When** they scan the screen, **Then** they do not see explanatory filler text that is not required to act on the data.
4. **Given** a user views the first content card on Progress, **When** the screen renders, **Then** no stray white background rectangle appears behind or around the card.

**Automated Proof**: Extend Playwright progress coverage to assert the remaining core metrics and confirm removed explanatory sections are absent.

---

### Edge Cases

- What happens when there is no meal history yet? History must still present a clean empty state without teaser copy for unavailable features.
- What happens when there is only one weight entry? Progress must still show the latest tracked weight and make the missing comparison state understandable without filler text.
- What happens when a meal is deleted from History? Totals and visible history must refresh so the user does not see stale points or stale entries.
- What happens when content is sparse on any tab? Cards and surfaces must still render without the stray white background rectangle or uneven layered backgrounds.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST rename the Dashboard tab to Home anywhere it appears in the primary tab navigation.
- **FR-002**: The system MUST present icons for each primary tab in the shared tab navigation.
- **FR-003**: The system MUST render the shared tab navigation without rounded outer corners.
- **FR-004**: The system MUST reduce the Home tab content to the core daily workflow by showing a meal-logging action and a points overview while removing decorative or explanatory filler copy.
- **FR-005**: The system MUST remove copy or UI treatments that refer to unavailable or future-only features from the touched tabs.
- **FR-006**: The system MUST remove the stray white background rectangle from the first card or top content surface on each touched tab.
- **FR-007**: Users MUST be able to review logged meals from the History tab.
- **FR-008**: Users MUST be able to edit an existing meal directly from the History tab.
- **FR-009**: Users MUST be able to remove an existing meal directly from the History tab.
- **FR-010**: The system MUST update visible history and affected totals after a meal is edited or removed from History.
- **FR-011**: The system MUST reduce the Progress tab content to weight logging, adherence, trend history or chart, and weight change since the last tracked weight.
- **FR-012**: The system MUST remove non-essential explanatory text from the Progress tab while preserving the core tracking signals.

### Key Entities _(include if feature involves data)_

- **Meal Entry**: A logged food record shown in History, with editable details that affect the user's visible tracking totals.
- **Points Overview**: The compact daily summary shown on Home that helps the user judge remaining or used points at a glance.
- **Progress Entry**: A recorded tracking value, such as weight or adherence, used to show recent change and longer-term trend on the Progress tab.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: In verification of the touched tabs, the primary action or summary for each screen is visible without scrolling on first load.
- **SC-002**: In verification of the Home tab, 100% of removed filler copy and unavailable-feature references identified in the request are absent.
- **SC-003**: In verification of the History flow, users can edit or delete a logged meal from History in no more than 2 interactions after selecting the meal.
- **SC-004**: In verification of the Progress tab, the latest weight change since the immediately prior tracked entry is visible whenever at least two weight entries exist.
- **SC-005**: In visual verification of all touched tabs, the shared tab bar has icons, no rounded outer shape, and no stray white rectangle appears on the first card surface.

## Assumptions

- The UI cleanup applies to the existing primary tabs now visible to users and does not introduce new tabs or new tracking categories.
- Home keeps the current underlying meal and points workflow; this request changes presentation and labeling, not the meaning of the data.
- History already has access to the meal data needed for review, and this feature brings correction actions into that tab instead of creating a separate management area.
- Progress keeps existing weight and adherence tracking data, and the requested simplification removes filler content rather than expanding the analytics scope.
- Existing Playwright coverage for tab navigation and meal tracking will be extended instead of creating a parallel acceptance harness for the same flows.
