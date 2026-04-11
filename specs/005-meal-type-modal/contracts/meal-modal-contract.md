# UI Contract: Meal Type Modal Editing

## Scope

This contract defines the visible and persisted behavior for meal add and meal
edit flows touched by this feature on Home and History.

## Shared Modal Contract

### Entry Points

- Home opens the shared meal modal when the user starts adding a meal for the
  selected day
- History opens the same modal when the user chooses to edit an existing meal
- The modal can represent both `add` and `edit` mode without changing field
  order or validation behavior

### Fields

- Required text field for meal name
- Required numeric field for points
- Optional meal type selector with exactly four values:
  - `breakfast`
  - `lunch`
  - `dinner`
  - `snack`
- Save action
- Cancel or dismiss action

### Behavior

- Add mode starts with empty meal name, empty points, and no selected meal type
- Edit mode preloads meal name, points, and the saved meal type if present
- Saving without a meal type is valid
- Clearing a previously selected meal type in edit mode is valid
- Canceling or dismissing does not persist partial changes

## Meal Display Contract

- Every user-visible meal card touched by the current flows shows saved meal
  type when present
- Meal type is rendered as a small secondary indicator rather than the dominant
  label on the card
- Meal name remains the primary text emphasis
- Points remain clearly visible as the main numeric summary
- Meals without a type do not show placeholder text such as `Unknown` or `None`

## Persistence Contract

- Newly added meals may persist with a selected meal type or no meal type
- Existing meals created before the feature remain readable without migration
  repair by the user
- Editing a legacy meal without choosing a type keeps the meal valid
- Editing a meal and changing type updates the same underlying meal record

## Acceptance-Oriented Test Hooks

- Existing meal test IDs should stay stable where practical
- Additional test IDs may be added only where needed to prove:
  - modal visibility for add flow
  - modal visibility for edit flow
  - meal type selection and clearing
  - meal type display on Home meal cards
  - meal type display on History meal cards
  - legacy meals without a type still load and save
