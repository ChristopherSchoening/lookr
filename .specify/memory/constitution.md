<!--
Sync Impact Report
Version change: template -> 1.0.0
Modified principles:
- Principle slot 1 -> I. Testable Changes First
- Principle slot 2 -> II. UX Consistency Across Platforms
- Principle slot 3 -> III. Fast, Trustworthy Feedback Loops
- Principle slot 4 -> IV. Spec-to-Delivery Traceability
- Principle slot 5 -> V. Keep Scope Coherent
Added sections:
- Product Quality Gates
- Delivery Workflow
Removed sections:
- None
Templates requiring updates:
- ✅ updated: .specify/templates/plan-template.md
- ✅ updated: .specify/templates/spec-template.md
- ✅ updated: .specify/templates/tasks-template.md
- ✅ updated: README.md
- ✅ updated: AGENTS.md
- ⚠ pending: .specify/templates/commands/*.md (directory not present in this repository; no update applied)
Follow-up TODOs:
- None
-->
# lookr Constitution

## Core Principles

### I. Testable Changes First
Every feature change MUST define how correctness will be verified before
implementation begins. Plans MUST name the required automated checks and manual
acceptance checks for the affected behavior. If the repository lacks a suitable
test harness for the changed behavior, the plan MUST either add that harness or
record the gap as an explicit Constitution Check exception with approval before
implementation proceeds.

Rationale: Testing cannot remain aspirational. Making verification explicit at
plan time prevents untestable work and forces the team to close quality gaps
instead of carrying them silently.

### II. UX Consistency Across Platforms
User-facing flows MUST preserve consistent information architecture, naming,
feedback states, and completion paths across all supported platforms. Any
intentional platform-specific variation MUST be documented in the spec or plan
with a user-centered reason. Shared behaviors such as empty states, validation
messages, loading states, and success or error feedback MUST be reviewed as part
of acceptance.

Rationale: A cross-platform product becomes harder to trust when the same task
behaves differently on different devices without a clear reason.

### III. Fast, Trustworthy Feedback Loops
Every change set MUST keep local verification fast enough for routine use and
must rely on the smallest set of checks that proves the affected behavior. At a
minimum, modified work MUST pass the repository's required quality commands, and
feature work MUST add focused verification rather than broad unbounded manual
testing. Broken linting, type checks, or known failing acceptance paths block
completion.

Rationale: Teams skip slow or noisy checks. Tight, reliable feedback is the
only way to make quality rules durable in daily work.

### IV. Spec-to-Delivery Traceability
Each feature MUST trace user stories to implementation tasks and to the
verification steps that prove them complete. Plans and task lists MUST make it
clear which story is being delivered, which files are affected, and what
evidence demonstrates that the story works independently.

Rationale: Traceability keeps delivery aligned with user value and prevents work
from drifting into disconnected technical activity.

### V. Keep Scope Coherent
Feature slices MUST stay focused on the smallest user-meaningful outcome that
can be verified independently. New dependencies, broad refactors, or extra
surface area MUST be justified against a simpler alternative in the plan's
complexity tracking. Nice-to-have additions that do not materially improve the
target user journey belong in later slices.

Rationale: Small, coherent scope improves delivery speed, preserves UX
consistency, and makes testing realistic.

## Product Quality Gates

- Specs MUST describe the primary user journeys, edge cases, and any
  cross-platform consistency expectations that affect the feature.
- Plans MUST fail Constitution Check if they do not define testing strategy,
  UX consistency review points, or required quality commands.
- Tasks MUST include verification work for each user story and MUST not mark
  testing as optional when behavior changes.
- UI changes MUST include platform review evidence appropriate to the change,
  such as screenshots, recordings, or a documented justification for why visual
  evidence is unnecessary.
- Manual acceptance steps MUST be concise, repeatable, and tied to the user
  story they validate.

## Delivery Workflow

1. Start from a spec that identifies user value, scope boundaries, edge cases,
   and consistency expectations.
2. Produce a plan that names affected platforms, verification strategy, and any
   complexity exceptions requiring approval.
3. Generate tasks grouped by user story, with implementation and verification
   work both present.
4. Implement in small slices, running focused checks as changes land.
5. Before completion, confirm required quality commands pass and user-facing
   changes have consistency evidence for touched platforms.

## Governance

This constitution supersedes conflicting local habits for planning and
delivery. Amendments MUST be recorded in `.specify/memory/constitution.md`,
must include an updated Sync Impact Report, and MUST update affected templates
or explicitly document why no sync was needed. Semantic versioning applies to
this document: MAJOR for incompatible governance changes or removed principles,
MINOR for new principles or materially expanded obligations, and PATCH for
clarifications that do not change team obligations. Compliance review is
mandatory during planning, task generation, code review, and final delivery.
Any approved exception MUST be documented in the relevant plan or review notes
with scope, reason, and owner.

**Version**: 1.0.0 | **Ratified**: 2026-04-09 | **Last Amended**: 2026-04-09
