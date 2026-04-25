# Feature Specification: Daily Limit Adherence

**Feature Branch**: `008-daily-limit-adherence`  
**Created**: 2026-04-12  
**Status**: Draft  
**Input**: User description: "it should be possible to update the daily points limit. a day counts to the adherence iff it adhered to the limit at it's time. when updating the limit it counts for all days going forward (and the current day)"

## Clarifications

### Session 2026-04-12

- Q: How should a same-day daily point limit change affect meals already logged earlier that day? → A: New limit applies to the entire current day, including meals logged earlier that day.
- Q: Should the current day count in adherence immediately after a daily point limit change? → A: Current day counts in adherence immediately, based on its current total versus current effective limit.
- Q: If a user edits a past day later, how should that day's adherence be recalculated? → A: Editing a past day recalculates that day against the limit active on that past date.

### Session 2026-04-25

- Q: Where should users change the daily point limit? → A: The daily point limit setting belongs in Progress, not Home.
- Q: Where should first-time daily limit setup happen? → A: Progress owns initial setup and later edits; Home never shows the daily limit setting.
- Q: What should Home do when daily limit setup is incomplete? → A: Home shows a brief prompt or action that sends the user to Progress setup, without showing the setting.
- Q: Which number formats should daily point limits accept? → A: Daily point limits accept any positive numeric value, including whole numbers and decimals.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Update Daily Point Limit From Progress (Priority: P1)

A user opens Progress, changes their daily point limit, and sees the new limit take effect for the current day and all future days.

**Why this priority**: The feature has no value if users cannot change the limit they actively track against.

**Independent Test**: Can be fully tested by starting with no daily point limit or an existing daily point limit, opening Progress, saving the limit there, and confirming the current day's budget and future-day budget use the saved value while Home never offers the setting.

**Acceptance Scenarios**:

1. **Given** a user has no saved daily point limit, **When** they open Progress and save a valid daily point limit, **Then** the app starts tracking against that limit for the current day and future days.
2. **Given** a user already has a daily point limit, **When** they open Progress and save a new daily point limit, **Then** the entire current day, including meals logged earlier that day, updates to use the new limit immediately and its adherence status refreshes at once.
3. **Given** a user updates their daily point limit, **When** they later view a future day before or after logging meals, **Then** that day uses the new limit until the user changes it again.
4. **Given** a user enters zero, a negative value, a blank value, or non-numeric text as the daily point limit in Progress, **When** they try to save it, **Then** the system rejects the change and explains that the limit must be a positive number.
5. **Given** a user opens Home without a saved daily point limit, **When** they scan the current-day summary, **Then** Home shows a brief prompt or action that sends them to Progress setup without showing the daily point limit setting.
6. **Given** a user opens Home with a saved daily point limit, **When** they scan the current-day summary, **Then** they can see the current budget state but cannot edit the daily point limit from Home.

**Automated Proof**: Extend `e2e/specs/progress-regression.spec.ts` to cover editing the limit from Progress, verifying the current-day budget refreshes, and confirming Home does not expose the daily limit setting.

---

### User Story 2 - Preserve Historical Adherence (Priority: P2)

A user reviews history and sees that completed past days keep the adherence result that matched the limit active on those days, even after the limit changes later.

**Why this priority**: Historical adherence becomes misleading if old days are re-judged by a newer limit.

**Independent Test**: Can be fully tested by creating tracked days under one limit, changing the limit, and confirming earlier days keep their original adherence result while current and later days use the new limit.

**Acceptance Scenarios**:

1. **Given** a past day was within the active limit on that date, **When** the user later raises or lowers the daily point limit, **Then** that past day remains marked as adhered.
2. **Given** a past day exceeded the active limit on that date, **When** the user later raises or lowers the daily point limit, **Then** that past day remains marked as not adhered.
3. **Given** the user changes their daily point limit today, **When** they review mixed history, **Then** only the current day and later days reflect the new limit.
4. **Given** a user edits meals on a past day, **When** the update is saved, **Then** that past day is recalculated against the limit that was active on that past date.

**Automated Proof**: Extend `e2e/specs/history-regression.spec.ts` and `e2e/specs/progress-regression.spec.ts` to verify frozen past-day adherence after a limit change.

---

### User Story 3 - Keep Progress Metrics Consistent (Priority: P3)

A user opens Progress and sees adherence totals that match the limit that was active for each counted day.

**Why this priority**: Progress loses trust if summary adherence uses different rules than day-level history.

**Independent Test**: Can be fully tested by reviewing Progress after a limit change and confirming the adherence count matches the unchanged past-day classifications plus today's immediate classification under the current effective limit.

**Acceptance Scenarios**:

1. **Given** a user has tracked days before and after a limit change, **When** they open Progress, **Then** the adherence summary counts each day against the limit active for that day.
2. **Given** a user changes the daily limit during the current day, **When** they open Progress afterward, **Then** the current day counts in adherence immediately under the new limit and past completed days keep their prior adherence status.

**Automated Proof**: Extend `e2e/specs/progress-regression.spec.ts` to verify adherence totals across a limit-change boundary.

### Edge Cases

- What happens when the user changes the daily point limit before logging any meals today? The new limit must still apply to today immediately.
- What happens when the user changes the daily point limit after already logging meals today? The entire current day, including earlier meals, must be recalculated against the new limit.
- What happens when a user changes the limit multiple times on the same day? The latest saved limit must be the one used for the current day going forward.
- What happens when a past day has no logged meals? A later limit change must not turn that day into an adhered day if it was previously treated as untracked.
- What happens when the new limit is lower than points already consumed today? The day must remain valid, but the user must see that today is over the new limit.
- What happens when a user edits a past day's meals after several later limit changes? That past day must be recalculated only against the limit that was active on that past date.
- What happens when a user has not set a daily point limit yet? Progress must provide setup, and Home must show a brief prompt or action that sends the user to Progress setup without showing the setting.
- What happens when a user expects to set or change the daily limit from Home? Home must not expose the setting, but must still reflect the saved limit in current-day budget feedback after the user sets or changes it from Progress.
- What happens when a user enters a positive decimal daily point limit? The system must accept it and apply the decimal limit consistently to daily budget and adherence calculations.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST allow a user to set their initial daily point limit and update it later from the Progress tab.
- **FR-002**: The system MUST validate that a saved daily point limit is a positive numeric value, accepting both whole numbers and decimals.
- **FR-003**: The system MUST apply an updated daily point limit to the entire current day immediately after the change is saved, including meals logged earlier that day.
- **FR-004**: The system MUST apply an updated daily point limit to all future days until the user changes it again.
- **FR-005**: The system MUST NOT recalculate completed past days against a newer daily point limit.
- **FR-006**: The system MUST determine a past day's adherence status using the daily point limit that was active on that day.
- **FR-007**: The system MUST preserve each past day's adherence result after later daily point limit changes.
- **FR-007a**: The system MUST recalculate an edited past day using the daily point limit that was active on that past date.
- **FR-008**: The system MUST recalculate the current day's remaining points, over-limit state, and adherence status after a daily point limit change.
- **FR-009**: The system MUST show the updated daily point limit consistently anywhere the current-day budget is displayed.
- **FR-010**: The system MUST keep history views and progress summaries consistent with the rule that each day is judged against the limit active at that time.
- **FR-010a**: The system MUST include the current day in adherence summaries immediately after a daily point limit change, using the current day's total points against the current effective limit.
- **FR-011**: The system MUST keep past days with no tracked intake outside adherence counts unless they already qualify under the existing tracking rules.
- **FR-012**: The system MUST NOT offer the daily point limit setting on Home, while Home MUST continue to reflect the effective limit in current-day budget feedback after setup.
- **FR-013**: The system MUST extend existing acceptance coverage for progress, home display, and history flows instead of introducing a parallel end-to-end harness for this behavior.
- **FR-014**: When daily point limit setup is incomplete, Home MUST show a brief prompt or action that sends the user to Progress setup without showing the daily point limit setting on Home.

### Key Entities _(include if feature involves data)_

- **Daily Point Limit Change**: A dated change to the user's standard daily budget that becomes effective for the current day at save time and stays active for later days until replaced.
- **Tracked Day**: A calendar day with point totals and adherence status derived from the point limit active for that day.
- **Adherence Summary**: An aggregate progress view that counts how many tracked days stayed within the point limit that applied on each day.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: In acceptance testing, users can set or change the daily point limit from Progress in under 1 minute without losing existing meal history.
- **SC-002**: In acceptance testing, 100% of verified past tracked days keep the same adherence result after a later limit change.
- **SC-003**: In acceptance testing, the current day's remaining-points value updates immediately after a limit change in every touched view.
- **SC-004**: In acceptance testing, the progress adherence total matches the visible day-level history across at least one limit-change scenario, including today's immediate classification after a same-day limit update.

## Assumptions

- Users may need initial daily point limit setup or later edits; both happen from Progress without redefining the points model.
- "Current day" means the calendar day active in the user's local app context when they save the new limit.
- Progress is the expected place for longer-term tracking controls, including initial daily point limit setup and later edits; Home remains focused on today's meal logging and budget status.
- A limit change affects the whole current day once saved, including meals that were logged earlier that day under the prior limit.
- The app's existing adherence model includes the current day in summaries, and this feature keeps that behavior while recalculating today immediately after a limit update.
- Past days remain historically frozen for adherence reporting, even if the user later raises or lowers the limit.
- Existing rules for whether an empty day counts as tracked or untracked remain unchanged by this feature.
