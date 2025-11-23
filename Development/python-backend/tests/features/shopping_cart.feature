# language: en

Feature: Shopping Cart Management
  As a customer
  I want to add, modify, and remove products from the cart
  So I can manage my purchase before paying

  Background:
    Given I have products available in the catalog

  Scenario: Add product to cart for the first time
    Given my cart is empty
    And there is a product with ID 1, name "Nike Air Max", price 450000
    When I add the product to the cart
    Then the cart should contain 1 product
    And the product should have quantity 1
    And the cart counter should show 1
    And the cart should open automatically

  Scenario: Adding duplicate product increases quantity
    Given I have the product with ID 1 and quantity 1 in the cart
    When I add the same product with ID 1 again
    Then the cart should still have 1 type of product
    And the quantity of the product with ID 1 should be 2
    And the cart counter should show 2
    And there should be no duplicate products in the list

  Scenario: Increase product quantity
    Given I have a product in the cart with quantity 2
    When I click the "+" button to increase
    Then the quantity should change to 3
    And the subtotal should be recalculated correctly
    And the total should update automatically

  Scenario: Decrease product quantity
    Given I have a product with quantity 3
    When I click the "-" button to decrease
    Then the quantity should change to 2
    And the subtotal should be recalculated
    When the quantity is 1 and I click "-"
    Then the quantity should remain at 1
    And it should not allow quantities less than 1

  Scenario: Remove product from cart
    Given I have 3 products in the cart
    When I click the "X" button to remove the second product
    Then the cart should have 2 products
    And the removed product should not appear in the list
    And the cart counter should update correctly

  Scenario: Subtotal calculation
    Given I have the following products in the cart:
      | product           | price   | quantity |
      | Nike Air Max      | 450000  | 2        |
      | Adidas Ultraboost | 380000  | 1        |
    When I calculate the subtotal
    Then the subtotal should be 1280000
    And it should be shown as "$1,280,000"

  Scenario: Free shipping calculation
    Given my subtotal is 60000
    When I calculate the shipping cost
    Then shipping should be 0 (free)
    And it should show "Free" instead of the price

  Scenario: Shipping cost calculation
    Given my subtotal is 30000
    When I calculate the shipping cost
    Then shipping should be 5000
    And it should be shown as "$5,000"

  Scenario: Total calculation with free shipping
    Given my subtotal is 55000
    When I calculate the total
    Then shipping should be 0
    And the total should be 55000

  Scenario: Total calculation with shipping cost
    Given my subtotal is 40000
    When I calculate the total
    Then shipping should be 5000
    And the total should be 45000

  Scenario: Empty cart shows appropriate message
    Given I have no products in the cart
    When I open the cart
    Then I should see the message "Your cart is empty"
    And I should see an empty cart icon
    And I should see the "Continue Shopping" button
    And I should not see the "Proceed to Checkout" button

  Scenario: Navigate to checkout from cart
    Given I have products in the cart
    When I click on "Proceed to Checkout"
    Then the cart should close
    And I should be redirected to the "/checkout" route

  Scenario: Continue shopping closes the cart
    Given the cart is open
    When I click on "Continue Shopping"
    Then the cart should close
    And I should remain on the current page

  Scenario: Multiple different products in the cart
    Given I add the following products:
      | id | name                | price  |
      | 1  | Nike Air Max        | 450000 |
      | 2  | Adidas Ultraboost   | 380000 |
      | 3  | Puma Running Shorts | 85000  |
    Then the cart should have 3 different products
    And the counter should show 3
    And each product should have quantity 1
