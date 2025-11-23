Feature: Minimal search
  Scenario: Search for Nike product
    Given I am on the product catalog
    When I search for the keyword "Nike"
    Then the system should show the following products:
      | name                    |
      | Nike Air Max Shoes      |
      | Nike Training Pants     |
