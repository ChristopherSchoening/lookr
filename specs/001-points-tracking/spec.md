# Feature Specification: Points Tracking Weight Loss

**Feature Branch**: `001-points-tracking`  
**Created**: 2026-04-09  
**Status**: Draft  
**Input**: User description: "build a cross-platform weight loss app. the main idea is to track points instead of calories. each meal has points associated. the user has a daily limit of points."

## Clarifications

### Session 2026-04-09

- Q: Should v1 use local-only tracking or account-based sync? → A: Local-only profile and history on one device in v1.
- Q: Should v1 use one fixed daily point limit or support day-specific overrides? → A: Same point limit every day.
- Q: How should users assign meal points in v1? → A: Enter meal name and points manually, with a nutrition-based points calculator deferred to a later release.
- Q: What date range should meal logging and editing support? → A: Users can add, edit, and remove meals for today and past days.
- Q: Which platforms are in scope for v1? → A: iOS, Android, and web, with Android as the mid-term focus.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Set Daily Point Budget and Log Meals (Priority: P1)

A user sets or confirms their daily point limit, manually logs each meal or snack with an associated point value, and sees how many points remain for the day after each entry.

**Why this priority**: This is the core value of the app. Without a daily budget and meal logging, the points-based weight loss workflow does not exist.

**Independent Test**: Can be fully tested by creating a user profile, setting a daily point limit, logging meals with point values, and confirming that the remaining daily balance updates correctly after each entry.

**Acceptance Scenarios**:

1. **Given** a user has not yet set a daily point limit, **When** they start using the app, **Then** the app prompts them to set a daily limit before tracking the day.
2. **Given** a user has a daily point limit, **When** they manually log a meal with a point value, **Then** the app records the meal and reduces the remaining points for that day by the logged amount.
3. **Given** a user has logged multiple meals in a day, **When** they open the current day summary, **Then** the app shows total points consumed and points remaining for that day.
4. **Given** a user forgot to log a meal on a prior date, **When** they add that meal to a past day, **Then** the app saves it to that day and recalculates that day's totals.

---

### User Story 2 - Review Daily Intake and History (Priority: P2)

A user reviews what they ate during the current day and recent days so they can understand patterns, stay within their limit, and correct mistakes in logged entries.

**Why this priority**: Users need visibility into their logged behavior to trust the system and make better day-to-day decisions.

**Independent Test**: Can be fully tested by logging meals across multiple days, viewing daily summaries and recent history, and editing or removing an incorrect entry without affecting unrelated records.

**Acceptance Scenarios**:

1. **Given** a user has logged meals for the current day, **When** they view the daily log, **Then** the app lists each meal with its point value and time of entry.
2. **Given** a user logged a meal with the wrong point value, **When** they edit or delete that meal entry, **Then** the app recalculates the day's consumed and remaining points immediately.
3. **Given** a user has prior tracked days, **When** they view recent history, **Then** the app shows each day's point budget, consumed total, and whether the user stayed within the limit.

---

### User Story 3 - Track Weight-Loss Progress (Priority: P3)

A user records body weight over time and compares it with adherence to their daily point budget so they can see whether the points system is helping them move toward their goal.

**Why this priority**: Weight change is the main outcome users care about, but it depends on the app first capturing consistent daily tracking.

**Independent Test**: Can be fully tested by entering weight records over multiple dates and confirming that the app displays changes over time alongside tracked point adherence.

**Acceptance Scenarios**:

1. **Given** a user has recorded weight entries on multiple dates, **When** they open progress tracking, **Then** the app shows weight change over time.
2. **Given** a user has both weight records and daily tracking records, **When** they review progress, **Then** the app shows whether days stayed within or exceeded the point limit.

---

### Edge Cases

- What happens when a user logs a meal that causes the daily total to exceed the point limit? The app must still save the entry and clearly show that the user is over the daily budget.
- What happens when a user edits or deletes an entry from a previous day? The app must update that day's totals without changing other days.
- What happens when a user forgets to log meals until late in the day? The app must allow backfilled entries for the current day with the correct date and time context.
- How does the system handle a meal entered with zero or negative points? The app must reject invalid point values and explain the correction needed.
- How does the system handle a day with no logged meals? The app must show the day as untracked or empty rather than assuming zero intake.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST allow a user to create and maintain a local personal profile for weight-loss tracking on a single device in the first release.
- **FR-002**: The system MUST allow a user to set one daily point limit that applies equally to every day in the first release.
- **FR-003**: The system MUST allow a user to update their daily point limit, and the updated limit MUST apply to future days unless the user changes it again.
- **FR-004**: The system MUST allow a user to manually log meals and snacks with, at minimum, a name, a point value, and a date of consumption.
- **FR-005**: The system MUST calculate and display, for each tracked day, the total points consumed and the points remaining relative to the user's daily limit.
- **FR-006**: The system MUST preserve meal entries even when a logged day exceeds the daily point limit.
- **FR-007**: The system MUST clearly indicate when a user has exceeded their daily point limit.
- **FR-008**: The system MUST allow a user to edit or delete a previously logged meal entry.
- **FR-008**: The system MUST allow a user to edit or delete a previously logged meal entry for today or any past tracked day.
- **FR-009**: The system MUST immediately recalculate daily totals after a meal entry is added, edited, or deleted.
- **FR-010**: The system MUST provide a day-level history view showing tracked days, total points consumed, remaining or exceeded points, and whether the daily limit was met.
- **FR-011**: The system MUST allow a user to record body weight entries by date.
- **FR-012**: The system MUST present weight progress over time in a way that allows a user to compare their progress across recorded dates.
- **FR-013**: The system MUST retain a user's tracking history on the device so they can review prior meal logs, point totals, and weight entries over time.
- **FR-014**: The system MUST validate that meal point values are positive numeric amounts before saving an entry.
- **FR-015**: The system MUST provide the same core tracking capabilities on iOS, Android, and web in the first release.
- **FR-016**: The first release MUST not require a built-in nutrition-based points calculator to create meal entries.
- **FR-017**: The system MUST allow a user to add meal entries for the current day and past days, but not future dates.

### Key Entities _(include if feature involves data)_

- **User Profile**: Represents the individual using the app, including their daily point limit and weight-loss tracking preferences.
- **Meal Entry**: Represents a single logged meal or snack, including its name, point value, date, and time of consumption.
- **Daily Summary**: Represents the aggregate tracking state for one date, including daily point budget, points consumed, points remaining, and whether the limit was exceeded.
- **Weight Entry**: Represents a recorded body-weight measurement for a specific date.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 90% of users can set a daily point limit and log their first meal within 3 minutes of first opening the app.
- **SC-002**: 95% of meal entries show an updated daily remaining-points total within 2 seconds of being saved.
- **SC-003**: 90% of users can correctly identify from the daily summary whether they are within or over their point limit on the first attempt.
- **SC-004**: At least 70% of active users log meals on 5 or more days within their first 14 days of use.
- **SC-005**: At least 75% of users who record weight entries can review a clear change-over-time view without assistance.
- **SC-006**: The primary meal logging and daily summary flow can be completed on Android by 90% of test users without platform-specific assistance.

## Assumptions

- The app is intended for individual consumers managing personal weight-loss goals rather than for clinicians, coaches, or group programs in the first release.
- The first release stores user profile and tracking history locally on one device and does not require account creation or cross-device sync.
- Users will manually assign point values for meals in the first release; a nutrition-based points calculator may be added in a later release.
- A single fixed daily point limit is sufficient for the first release; separate limits for meals, weekdays, specific dates, or custom programs are out of scope.
- The first release focuses on meal points, daily budget tracking, and weight progress rather than recipes, exercise tracking, or social/community features.
- Meal entries can be created, edited, or deleted for today and past dates only; future-date planning is out of scope.
- The first release targets iOS, Android, and web, with Android as the mid-term priority platform for product validation and refinement.
