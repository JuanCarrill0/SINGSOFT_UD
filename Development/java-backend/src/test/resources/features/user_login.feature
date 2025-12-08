# language: en

Feature: User Login
  As a registered user
  I want to log in to the system
  So I can access my account and make purchases

  Scenario: Successful login with valid credentials
    Given I have a registered account with email "usuario@example.com" and password "password123"
    When I enter my email "usuario@example.com"
    And I enter my password "password123"
    And I click on "Log In"
    Then I should receive a valid JWT token
    And I should receive my user data
    And the field "userid" should be present in the response
    And the field "email" should be "usuario@example.com"
    And the field "role" should be present

  Scenario: Login with incorrect email
    Given I try to log in with email "noexiste@example.com"
    And I provide password "password123"
    When I click on "Log In"
    Then I should receive an authentication error
    And I should not receive a token
    And the response code should be 400

  Scenario: Login with incorrect password
    Given I have a registered account with email "usuario@example.com"
    When I try to log in with incorrect password "wrongpassword"
    Then I should receive an authentication error
    And I should not receive a token
    And the error message should indicate invalid credentials

  Scenario: Login with empty fields
    Given I try to log in
    When I send an empty email
    And I send an empty password
    Then the request should be rejected
    And I should receive an error indicating required fields

  Scenario: Session persistence verification
    Given I have logged in successfully
    And I have saved the token in localStorage
    When I reload the page
    Then the token should still be valid
    And I can use the token for authenticated requests

  Scenario: Login response format
    Given I log in successfully
    Then the response should contain:
      | field | type   |
      | token | string |
      | user  | object |
    And the "user" object should contain:
      | field     | type   |
      | userid    | string |
      | email     | string |
      | firstName | string |
      | lastName  | string |
      | role      | string |

  Scenario: Login with different user roles
    Given I have registered users with different roles
    When I log in as "CUSTOMER"
    Then I should receive a token with role "CUSTOMER"
    When I log in as "LOGISTICS_OPERATOR"
    Then I should receive a token with role "LOGISTICS_OPERATOR"
    When I log in as "STORE_ADMIN"
    Then I should receive a token with role "STORE_ADMIN"
