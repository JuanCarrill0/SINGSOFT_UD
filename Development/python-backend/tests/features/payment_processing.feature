# language: en
Feature: Payment Processing
  As a Customer
  I want to make payments for my orders
  So I can complete my purchases on the platform

  Background:
    Given there is an order with ID 1 and total of 289.97

  Scenario: Successfully process payment with credit card
    Given I have a pending order with ID 1
    When I process a payment with the following data:
      | order_id       | 1              |
      | amount         | 289.97         |
      | method         | credit_card    |
      | transaction_id | TXN-CC-123456 |
    Then the system should create the payment successfully
    And the payment status should be "pending"
    And a unique ID should be generated for the payment
    And the created_at field should be recorded

  Scenario: Process payment with PSE
    Given I have a pending order with ID 1
    When I process a payment with the following data:
      | order_id       | 1              |
      | amount         | 289.97         |
      | method         | pse            |
      | transaction_id | TXN-PSE-789012|
    Then the system should create the payment successfully
    And the payment method should be "pse"

  Scenario: List payments for an order
    Given the following payments exist for order 1:
      | id | amount | method      | status    | transaction_id |
      | 1  | 289.97 | credit_card | completed | TXN-CC-123456 |
      | 2  | 50.00  | pse         | failed    | TXN-PSE-789012|
    When I query the payments for order 1
    Then the system should return 2 payments
    And all payments should correspond to order 1

  Scenario: Get details of a specific payment
    Given there is a payment with ID 1 with the following data:
      | order_id       | 1              |
      | amount         | 289.97         |
      | method         | credit_card    |
      | status         | completed      |
      | transaction_id | TXN-CC-123456 |
    When I query the payment with ID 1
    Then the system should return all payment details
    And it should include the transaction_id "TXN-CC-123456"

  Scenario: Validate payment amount
    Given there is an order with total of 289.97
    When I process a payment with amount 289.97
    Then the system should accept the amount
    # Note: Order-payment match validation could be added

  Scenario: Supported payment methods
    Given I have a pending order
    When I process payments with the following methods:
      | method          |
      | credit_card     |
      | debit_card      |
      | pse             |
      | cash_on_delivery|
      | paypal          |
    Then the system should accept all payment methods

  Scenario: Delete a payment
    Given there is a payment with ID 1 in status "pending"
    When I delete the payment with ID 1
    Then the system should delete the payment successfully
    And the payment should not appear in future queries
