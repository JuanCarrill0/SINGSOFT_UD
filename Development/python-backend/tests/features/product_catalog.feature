# language: en

Feature: Product Catalog Navigation
  As a visitor or user
  I want to view the catalog of available products
  So I can explore purchase options

  Scenario: View complete product catalog
    Given I access the GET endpoint "/api/products"
    When the request is executed
    Then I should receive a list of products
    And the response code should be 200
    And each product should contain the fields:
      | field       | type   |
      | id          | number |
      | name        | string |
      | description | string |
      | price       | number |
      | stock       | number |
      | category    | string |
      | brand       | string |
      | sport       | string |
      | gender      | string |
      | image_url   | string |

  Scenario: Products with available stock
    Given I query the product catalog
    When I filter for products in stock
    Then all displayed products should have stock > 0
    And they should show the "Add to Cart" button

  Scenario: View individual product by ID
    Given there is a product with ID 1
    When I GET "/api/products/1"
    Then I should receive the specific product
    And it should contain all product fields
    And the response code should be 200

  Scenario: Product not found
    Given I try to get a product with ID 999999 that does not exist
    When I GET "/api/products/999999"
    Then I should receive an error "Product not found"
    And the response code should be 404

  Scenario: Product pagination
    Given there are more than 50 products in the catalog
    When I request products with parameters skip=0 and limit=20
    Then I should receive exactly 20 products
    When I request products with skip=20 and limit=20
    Then I should receive the next 20 products

  Scenario: Empty catalog
    Given the database has no products
    When I query GET "/api/products"
    Then I should receive an empty list []
    And the response code should be 200

  Scenario: Price format
    Given I query products
    Then all prices should be positive numbers
    And prices should have at most 2 decimal places
    And prices should be greater than 0

  Scenario: Available categories in the catalog
    Given I query all products
    Then I should find products in the categories:
      | category        |
      | Footwear       |
      | Clothing       |
      | Accessories    |
      | Equipment      |

  Scenario: Available brands in the catalog
    Given I query all products
    Then I should find products from the brands:
      | brand         |
      | Nike          |
      | Adidas        |
      | Puma          |
      | Under Armour  |

  Scenario: Verify product images
    Given I query products
    Then each product should have an "image_url" field
    And the "image_url" field should be a valid URL or empty
    And if there is an image, it should start with "http://" or "https://"
