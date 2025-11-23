Feature: Checkout Process
  As an authenticated customer
  I want to complete the purchase process
  So I can finish my order with shipping address and payment

  Background:
    Given I am authenticated with userid "123e4567-e89b-12d3-a456-426614174000"
    And I have a valid token saved in localStorage

  Scenario: Successful complete checkout
    Given I have products in my cart with a total of 450000
    When I navigate to the checkout page "/checkout"
    Then I should see an order summary
    And I should see a shipping address form
    And I should see payment method options
    When I fill in the address "Calle 123 #45-67, Bogotá, Colombia"
    And I select payment method "credit_card"
    And I click on "Confirm and Pay"
    Then an order should be created in the backend
    And the order should contain my user_id
    And the order should have the correct total
    And a payment should be created associated with the order
    And the payment should have the method "credit_card"
    And I should see the message "Order Completed!"
    And I should see my order number
    And the cart should be emptied
    And after 3 seconds I should be redirected to "/orders"

  Scenario: Checkout without authentication
    Given I have NOT logged in
    And I have no token in localStorage
    When I try to access "/checkout" with products
    And I click on "Confirm and Pay"
    Then I should see an alert "Please log in to continue"
    And I should be redirected to "/login"
    And my cart should NOT be emptied

  Scenario: Checkout with empty cart
    Given my cart is empty
    When I access "/checkout"
    Then I should see the message "Empty Cart"
    And I should see "You have no products in your cart"
    And I should see a button "Go Shopping"
    And I should NOT see the checkout form

  Scenario: Checkout without shipping address
    Given I have products in the cart
    And I am on the checkout page
    When I leave the shipping address empty
    And I click on "Confirm and Pay"
    Then I should see an alert "Please enter a shipping address"
    And the order should not be created

  Scenario: Payment method selection
    Given I am on the checkout page
    Then I should see the following payment options:
      | method                |
      | Credit Card           |
      | Debit Card            |
      | PayPal                |
      | Bank Transfer         |

  Scenario: Card form only for credit/debit
    Given I am in checkout
    When I select "Credit Card"
    Then I should see the form with fields:
      | field             |
      | Card Number       |
      | Expiry Date       |
      | CVV               |
    When I select "PayPal"
    Then I should NOT see the card form

  Scenario: Order summary shows all products
    Given I have the following products in the cart:
      | name           | price  | quantity |
      | Nike Air Max   | 450000 | 2        |
      | Adidas Ultra   | 380000 | 1        |
    When I view the order summary
    Then I should see 2 products listed
    And each product should show its image
    And each product should show its name
    And each product should show its quantity
    And each product should show its subtotal

  Scenario: Calculations in order summary
    Given my cart has a total of 480000
    When I view the order summary
    Then I should see "Subtotal: $480,000"
    And I should see "Shipping: Free"
    And I should see "Total: $480,000"

  Scenario: Error creating order in backend
    Given the backend has a temporary error
    When I try to confirm my order
    Then I should see an error message
    And my cart should NOT be emptied
    And I should be able to retry the purchase

  Scenario: Valid userId verification
    Given I have a user in localStorage without the field "userid"
    When I try to checkout
    Then I should see the error "Error: Could not get user ID"
    And I should be redirected to "/login"

  Scenario: Order includes correct data
    Given I complete the checkout successfully
    Then the created order should have:
      | field            | expected value           |
      | user_id          | my valid UUID            |
      | total            | cart total               |
      | shipping_address | entered address          |
      | status           | pending (by default)     |

  Scenario: Payment includes correct data
    Given the order is created successfully
    Then the created payment should have:
      | field    | expected value      |
      | order_id | order ID            |
      | amount   | order total         |
      | method   | selected method     |
      | status   | completed           |

  Scenario: Confirmation screen
    Given my order was completed successfully with ID 42
    Then I should see a green check icon
    And I should see "Order Completed!"
    And I should see "Your order #42 has been processed successfully"
    And I should see "You will receive a confirmation email shortly"
    And I should see a button "View My Orders"
    And I should see a button "Continue Shopping"
