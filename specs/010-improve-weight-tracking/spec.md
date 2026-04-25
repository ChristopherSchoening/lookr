# Feature Specification: Improve Weight Tracking

**Feature Branch**: `010-improve-weight-tracking`  
**Created**: 2026-04-25  
**Status**: Draft  
**Input**: User description: "the weight tracking should be imporoved. the progress page should only show an overview of the weight (regarding only the weight progress). it should have an option to go into more details where I can see/edit all log entries and a graph that shows the weight entries over time. the graph should be a line/curve diagram. it should show the target/goal weight and the weight log entries. the graph should start at the target weight - 5(kg) and end at the highest value +5(kg). use landscape for the graph if needed."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Review Weight Overview (Priority: P1)

As a user tracking body weight, I want the progress page to show only a concise weight-progress overview so I can understand my current weight status without unrelated progress information.

**Why this priority**: This is the primary requested change and makes the progress page focused on weight progress.

**Independent Test**: Can be fully tested by opening the progress page with saved weight data and confirming the page shows weight overview values only, plus a details option.

**Acceptance Scenarios**:

1. **Given** the user has a target weight and at least one weight log entry, **When** the user opens the progress page, **Then** the page shows a weight-only overview including latest weight, goal weight, weight change, remaining weight to goal, trend direction, and most recent log date.
2. **Given** the user has no weight log entries, **When** the user opens the progress page, **Then** the page shows an empty overview state focused on adding or viewing weight tracking details and does not show unrelated progress categories.
3. **Given** the user is on the progress page, **When** they scan the page, **Then** adherence, meal, point, and other non-weight progress summaries are not part of the default progress overview.

**Automated Proof**: Extend the progress user-flow coverage to verify the weight-only overview, empty state, and details entry point.

---

### User Story 2 - Manage Weight Log Entries (Priority: P2)

As a user, I want to open a detailed weight-tracking view where I can see and edit all weight log entries so my recorded progress remains accurate.

**Why this priority**: Accurate logs are required for meaningful progress summaries and graphing.

**Independent Test**: Can be fully tested by opening the details view, reviewing the full entry list, editing an entry, and confirming the overview and detail data reflect the change.

**Acceptance Scenarios**:

1. **Given** the user has multiple weight log entries, **When** they open weight details, **Then** all entries are listed with enough information to identify the date and weight for each entry.
2. **Given** the user is viewing a weight log entry, **When** they edit the entry and save a valid change, **Then** the updated date or weight is shown in the log, overview, and graph.
3. **Given** the user enters an invalid weight or date while editing, **When** they try to save, **Then** the change is not saved and the user receives clear feedback about what needs correction.

**Automated Proof**: Extend the progress user-flow coverage to verify entry list visibility, edit behavior, validation, and updated overview values.

---

### User Story 3 - Inspect Weight Trend Graph (Priority: P3)

As a user, I want a detailed graph that plots my weight entries over time together with my target weight so I can visually judge progress toward my goal.

**Why this priority**: The graph is valuable for deeper insight, but depends on the overview and accurate log management.

**Independent Test**: Can be fully tested by opening the details view with known entries and target weight, then confirming the graph includes the target line, log trend line, date progression, and required value range.

**Acceptance Scenarios**:

1. **Given** the user has a target weight and multiple weight log entries, **When** they open weight details, **Then** a line or smooth curve graph shows weight entries over time and the target weight on the same chart.
2. **Given** the graph is shown, **When** the lowest displayed weight value is calculated, **Then** it starts at target weight minus 5 kg unless the range must expand to include all visible values.
3. **Given** the graph is shown, **When** the highest displayed weight value is calculated, **Then** it ends at the highest logged weight plus 5 kg unless the range must expand to include the target weight.
4. **Given** the available screen width cannot show the graph clearly in portrait, **When** the user opens or expands the graph, **Then** the graph is available in a landscape-friendly layout that keeps labels, target, and log line readable.

**Automated Proof**: Extend the progress user-flow coverage to verify graph presence, plotted target, plotted log entries, value range labels, and usable landscape layout behavior.

### Edge Cases

- If the user has no weight entries, the details view shows an empty log state and no misleading graph line.
- If the user has one weight entry, the graph still shows the entry and target in a readable way without implying a trend that does not exist.
- If multiple entries share the same date, each entry remains visible or distinguishable in the log, and the graph represents the same-date values without hiding data.
- If editing an entry would create an invalid value, missing date, or implausible value, the user cannot save until the entry is corrected.
- If the target weight is missing, the details view clearly indicates that a target is needed for target-based graph scaling.
- If target weight minus 5 kg is greater than or equal to highest logged weight plus 5 kg, the graph expands the displayed range enough to show both the target and all entries.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The progress page MUST present a default overview that is focused only on weight progress.
- **FR-002**: The progress page MUST exclude non-weight progress summaries from the default progress overview.
- **FR-003**: The weight overview MUST show latest weight, target weight, weight change over the tracked period, remaining weight to target, trend direction, and most recent log date when the data exists.
- **FR-004**: The weight overview MUST provide a clear option to open a detailed weight-tracking view.
- **FR-005**: The detailed weight-tracking view MUST list all saved weight log entries with date and weight information.
- **FR-006**: Users MUST be able to edit saved weight log entries from the detailed weight-tracking view.
- **FR-007**: The system MUST validate edited entries before saving and prevent invalid date or weight values from replacing valid saved data.
- **FR-008**: Saved edits to weight log entries MUST update the detailed list, overview values, and graph values consistently.
- **FR-009**: The detailed weight-tracking view MUST include a line or smooth curve graph of weight entries over time.
- **FR-010**: The graph MUST show the user's target or goal weight together with the weight log entries.
- **FR-011**: The graph's displayed weight range MUST start at target weight minus 5 kg and end at highest logged weight plus 5 kg when that produces a valid range.
- **FR-012**: The graph MUST expand the displayed weight range when needed so both the target weight and all logged weights remain visible.
- **FR-013**: The graph MUST remain readable on supported screen sizes, including a landscape-friendly presentation when portrait space is too constrained.
- **FR-014**: Empty and partial data states MUST explain what weight information is missing without showing incorrect progress conclusions.
- **FR-015**: Existing progress-page user-flow coverage MUST be extended instead of creating unrelated parallel coverage for the same behavior.

### Key Entities

- **Weight Log Entry**: A recorded body weight for a specific date; may be edited by the user from the detailed weight-tracking view.
- **Target Weight**: The user's goal weight used to calculate remaining progress and graph scaling.
- **Weight Overview**: A concise summary of current weight progress shown on the progress page.
- **Weight Trend Graph**: A visual trend of weight log entries over time with the target weight shown for comparison.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: A user with existing weight data can understand current weight progress from the progress page in under 10 seconds.
- **SC-002**: A user can navigate from the progress overview to the detailed weight view in one action.
- **SC-003**: A user can find and edit any existing weight log entry from the detailed view in under 30 seconds for a list of up to 50 entries.
- **SC-004**: After a valid log edit, the updated value is reflected in the overview, log list, and graph without requiring the user to re-enter the same change.
- **SC-005**: In validation testing, 95% of graph checks show the target weight and all weight log entries within the visible chart range.
- **SC-006**: On supported phone-sized screens, the graph remains readable without overlapping labels or hidden plotted values.

## Assumptions

- The user has one active target or goal weight for weight tracking.
- Weight values are displayed in kilograms for this feature.
- The normal goal direction is weight loss, where the target weight is at or below recent logged weights.
- If the target is above logged weights or data is otherwise unusual, the graph should still show both target and entries by expanding the displayed range.
- The detailed view focuses on reviewing and editing existing weight entries; adding a new weight entry may continue to use the existing weight logging flow unless planning identifies a required gap.
- The feature applies to the existing supported app surfaces and should keep behavior consistent across those surfaces.
