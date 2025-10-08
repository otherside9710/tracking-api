Feature: Tracking Checkpoint Management
  As an authenticated user
  I want to register and query unit checkpoints
  So that I can track shipments

  Background:
    Given I am authenticated in the system
    And I have a valid token

  Scenario: Register a new checkpoint for an existing unit
    Given there is a unit with ID "UNIT001" and tracking "TRK001"
    When I register a new checkpoint with the following data:
      | unitId   | trackingId | status     | location          | description        |
      | UNIT001  | TRK001     | IN_TRANSIT | Bogota, Colombia | En route to destiny |
    Then the checkpoint should be registered successfully
    And the unit status should be updated to "IN_TRANSIT"

  Scenario: Query tracking history for a unit
    Given there is a unit with registered checkpoints
    When I query the tracking history with ID "TRK001"
    Then I should receive a list of checkpoints ordered by date
    And it should include the current unit status

  Scenario: List units by status
    Given there are multiple units with different checkpoint histories
    When I query units with status "IN_TRANSIT"
    Then I should receive all units that are or have been in "IN_TRANSIT" status
    And each unit should include its complete checkpoint history