Feature: Order Viewing
  As an authenticated customer
  I want to view my order history
  So I can review my previous purchases and their status

  Background:
    Given I am authenticated with userid "123e4567-e89b-12d3-a456-426614174000"

  Scenario: View complete list of my orders
    Given I have made 5 purchases previously
    When I navigate to the "My Orders" page (/orders)
    Then I should see a list of 5 orders
    And each order should show:
      | field              |
      | Order Number       |
      | Creation Date      |
      | Status             |
      | Shipping Address   |
      | Total              |
    And the endpoint response code should be 200

  Scenario: User with no previous orders
    Given I am a new user with no purchases
    When I access "My Orders"
    Then I should see the message "You have no orders"
    And I should see the text "You haven't made any purchases yet"
    And I should see a button "Go Shopping"
    And I should NOT see any order card

  Scenario: Access orders without authentication
    Given I am NOT authenticated
    When I try to access "/orders"
    Then I should be redirected to "/login"
    And I should NOT see any order

  Scenario: View expanded details of an order
    Given I have orders in my history
    And an order has a shipment assigned
    When I click on "View Details"
    Then the order should expand
    And I should see additional shipment information
    When I click again on "Hide Details"
    Then the order should collapse

  Scenario: Order statuses with appropriate colors
    Given I have orders with different statuses
    Then I should see:
      | status      | color    | text (Spanish) |
      | pending     | yellow   | Pendiente      |
      | processing  | blue     | Procesando     |
      | shipped     | purple   | Enviado        |
      | delivered   | green    | Entregado      |
      | cancelled   | red      | Cancelado      |

  Scenario: Readable date format
    Given an order was created on "2024-01-15T10:30:00"
    When I view the order in the list
    Then the date should be shown as "January 15, 2024, 10:30"
    And it should be in English format

  Scenario: Show tracking button if shipment exists
    Given I have an order with ID 42
    And the order has a shipment assigned
    When I view the order in the list
    Then I should see a "Track" button with a truck icon
    When the order does NOT have a shipment assigned
    Then I should NOT see the "Track" button

  Scenario: Update order list
    Given I am on "My Orders"
    And there are new orders in the backend
    When I click on "Update List"
    Then a new request should be made to the backend
    And I should see the updated orders
    And the loading spinner should be briefly shown

  Scenario: Loading state when fetching orders
    Given I navigate to "My Orders"
    When the request is in progress
    Then I should see a loading spinner
    And I should see the text "Loading orders..."
    When the request completes
    Then the spinner should disappear

  Scenario: Error handling when loading orders
    Given there is an error in the backend
    When I try to load my orders
    Then I should see an error message
    And I should see a button "Retry"
    When I click on "Retry"
    Then a new request should be made

  Scenario: Cancel order button only in pending status
    Given I have an order in status "pending"
    When I view the order
    Then I should see a "Cancel Order" button
    Given I have an order in status "delivered"
    When I view the order
    Then I should NOT see the "Cancel Order" button

  Scenario: Confirmation when cancelling order
    Given I click on "Cancel Order"
    Then I should see a confirmation message with the text "Are you sure you want to cancel this order?"
    When I confirm the cancellation
    Then the cancellation logic should be executed

  Scenario: Navigate back to dashboard
    Given I am on "My Orders"
    When I click on "Back to Dashboard"
    Then I should be redirected to "/dashboard"

  Scenario: Order shows complete shipping address
    Given I have an order with address "Calle 123 #45-67, Bogotá"
    When I view the order
    Then I should see the complete address displayed
    And it should have a location icon (MapPin)

  Scenario: Order total formatted correctly
    Given an order has a total of 1280000
    When I view the order
    Then the total should be shown as "$1,280,000"
    And it should be in large blue text

  Scenario: Integration with shipment data
    Given I load my orders successfully
    Then the system should automatically load the shipments
    And each order should try to get its associated shipment
    And the shipments should be saved in the shipmentData state
