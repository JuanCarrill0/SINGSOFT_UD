Feature: Advanced Product Search
  As a Customer
  I want to search for products by specific criteria (sport, price range, gender, etc.)
  So that I can easily find products that fit what I want

  Background:
    Given the following products exist in the system:
      | name                      | price   | category      | brand   | sport     | gender  | stock |
      | Nike Air Max Shoes        | 129.99  | Shoes         | Nike    | Running   | Unisex  | 45    |
      | Adidas Ultraboost Shoes   | 159.99  | Shoes         | Adidas  | Running   | Unisex  | 32    |
      | Adidas Running Shirt      | 39.99   | Clothing      | Adidas  | Running   | Male    | 65    |
      | Nike Training Pants       | 59.99   | Clothing      | Nike    | Fitness   | Female  | 22    |
      | Adidas Soccer Ball        | 29.99   | Equipment     | Adidas  | Soccer    | Unisex  | 0     |

  Scenario: Search products by brand
    Given I am on the product catalog
    When I use the search bar with the keyword "Nike"
    Then the system should show the following products:
      | name                  |
      | Nike Air Max Shoes    |
      | Nike Training Pants   |
    And it should not show products from other brands

  Scenario: Apply multiple filters simultaneously
    Given I am on the product catalog
    When I apply the following filters:
      | filter    | value   |
      | Sport     | Running |
      | Gender    | Unisex  |
      | Category  | Shoes   |
    Then only products that meet all criteria should be shown
    And the system should show "Nike Air Max Shoes"
    And the system should show "Adidas Ultraboost Shoes"
    And it should not show "Adidas Running Shirt"

  Scenario: Filter by sport and category
    Given I am on the product catalog
    When I apply the following filters:
      | filter    | value   |
      | Sport     | Running |
      | Category  | Shoes   |
    Then the system should show all unisex shoes
    And it should not show clothing

  Scenario: Clear all active filters
    Given I have active filters:
      | filter    | value |
      | Brand     | Nike  |
      | Category  | Clothing |
    When I press the "Clear filters" button
    Then the full catalog should appear
    And all products with available stock should be shown

  Scenario: Filter by availability (stock)
    Given I am on the product catalog
    When I activate the filter "Only in stock"
    Then only products with stock_quantity greater than 0 should be shown
    And it should not show out-of-stock products

  Scenario: Search with no results
    Given I am on the product catalog
    When I use the search bar with the keyword "Nonexistent Product"
    Then the system should show a message "No products found"
    And it should show an empty list
