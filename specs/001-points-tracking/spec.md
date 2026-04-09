# Feature Specification: Points Tracking Weight Loss

**Feature Branch**: `001-points-tracking`  
**Created**: 2026-04-09  
**Status**: Draft  
**Input**: User description: "build a cross-platform weight loss app. the main idea is to track points instead of calories. each meal has points associated. the user has a daily limit of points."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Set Daily Point Budget and Log Meals (Priority: P1)

A user sets or confirms their daily point limit, logs each meal or snack with an associated point value, and sees how many points remain for the day after each entry.

**Why this priority**: This is the core value of the app. Without a daily budget and meal logging, the points-based weight loss workflow does not exist.

**Independent Test**: Can be fully tested by creating a user profile, setting a daily point limit, logging meals with point values, and confirming that the remaining daily balance updates correctly after each entry.

**Acceptance Scenarios**:

1. **Given** a user has not yet set a daily point limit, **When** they start using the app, **Then** the app prompts them to set a daily limit before tracking the day.
2. **Given** a user has a daily point limit, **When** they log a meal with a point value, **Then** the app records the meal and reduces the remaining points for that day by the logged amount.
3. **Given** a user has logged multiple meals in a day, **When** they open the current day summary, **Then** the app shows total points consumed and points remaining for that day.

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

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow a user to create and maintain a personal profile for weight-loss tracking.
- **FR-002**: The system MUST allow a user to set a daily point limit used as the default budget for each new day.
- **FR-003**: The system MUST allow a user to update their daily point limit, and the updated limit MUST apply to future days unless the user changes it again.
- **FR-004**: The system MUST allow a user to log meals and snacks with, at minimum, a name, a point value, and a date of consumption.
- **FR-005**: The system MUST calculate and display, for each tracked day, the total points consumed and the points remaining relative to the user's daily limit.
- **FR-006**: The system MUST preserve meal entries even when a logged day exceeds the daily point limit.
- **FR-007**: The system MUST clearly indicate when a user has exceeded their daily point limit.
- **FR-008**: The system MUST allow a user to edit or delete a previously logged meal entry.
- **FR-009**: The system MUST immediately recalculate daily totals after a meal entry is added, edited, or deleted.
- **FR-010**: The system MUST provide a day-level history view showing tracked days, total points consumed, remaining or exceeded points, and whether the daily limit was met.
- **FR-011**: The system MUST allow a user to record body weight entries by date.
- **FR-012**: The system MUST present weight progress over time in a way that allows a user to compare their progress across recorded dates.
- **FR-013**: The system MUST retain a user's tracking history so they can review prior meal logs, point totals, and weight entries over time.
- **FR-014**: The system MUST validate that meal point values are positive numeric amounts before saving an entry.
- **FR-015**: The system MUST provide the same core tracking capabilities on each supported platform.

### Key Entities *(include if feature involves data)*

- **User Profile**: Represents the individual using the app, including their daily point limit and weight-loss tracking preferences.
- **Meal Entry**: Represents a single logged meal or snack, including its name, point value, date, and time of consumption.
- **Daily Summary**: Represents the aggregate tracking state for one date, including daily point budget, points consumed, points remaining, and whether the limit was exceeded.
- **Weight Entry**: Represents a recorded body-weight measurement for a specific date.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 90% of users can set a daily point limit and log their first meal within 3 minutes of first opening the app.
- **SC-002**: 95% of meal entries show an updated daily remaining-points total within 2 seconds of being saved.
- **SC-003**: 90% of users can correctly identify from the daily summary whether they are within or over their point limit on the first attempt.
- **SC-004**: At least 70% of active users log meals on 5 or more days within their first 14 days of use.
- **SC-005**: At least 75% of users who record weight entries can review a clear change-over-time view without assistance.

## Assumptions

- The app is intended for individual consumers managing personal weight-loss goals rather than for clinicians, coaches, or group programs in the first release.
- Users will manually assign or confirm point values for meals rather than relying on an automatic food database in the first release.
- A single daily point limit is sufficient for the first release; separate limits for meals, weekdays, or custom programs are out of scope.
- The first release focuses on meal points, daily budget tracking, and weight progress rather than recipes, exercise tracking, or social/community features.
- Supported platforms are defined by the product team, but users should experience the same essential tracking workflow on each one.
