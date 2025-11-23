# language: en

Feature: Session Management
  As an authenticated user
  I want to manage my session (view my status, log out)
  So I can control my access to the application

  Scenario: Log out and remove token
    Given I have logged in with email "usuario@example.com"
    And I have a valid token stored in localStorage
    When I click on "Log Out"
    Then the token should be removed from localStorage
    And the user state should be removed from localStorage
    And I should see the "Log In" button instead of my name
    And I should not have access to protected routes

  Scenario: Verify valid JWT token
    Given I have a valid JWT token
    When I send a request to "/api/auth/verify" with the token
    Then I should receive a response with "valid": true
    And the response code should be 200

  Scenario: Verify invalid JWT token
    Given I have an invalid or expired JWT token
    When I send a request to "/api/auth/verify" with the token
    Then I should receive a response with "valid": false
    And the response code should be 401

  Scenario: Access authenticated user information
    Given I am authenticated with userid "123e4567-e89b-12d3-a456-426614174000"
    When I access the application header
    Then I should see my email displayed
    And I should see a "Log Out" button
    And I should not see the "Log In" button

  Scenario: Session persistence on reload
    Given I have logged in successfully
    And the token is stored in localStorage as "authToken"
    And the user data is stored in localStorage as "user"
    When I reload the browser page
    Then the system should read the token from localStorage
    And the system should read the user data from localStorage
    And I should still see my session active
    And I should have access to protected routes

  Scenario: Get user data by ID
    Given there is a user with ID "123e4567-e89b-12d3-a456-426614174000"
    When I make a GET request to "/api/auth/users/123e4567-e89b-12d3-a456-426614174000"
    Then I should receive the user data:
      | field       | present |
      | userid      | yes     |
      | email       | yes     |
      | firstName   | yes     |
      | lastName    | yes     |
      | phoneNumber | yes     |
    And the response code should be 200

  Scenario: User not found by ID
    Given I try to get a user with a non-existent ID
    When I make a GET request to "/api/auth/users/00000000-0000-0000-0000-000000000000"
    Then I should receive an error "User not found"
    And the response code should be 404

  Scenario: Invalid UUID format
    Given I try to get a user with an invalid ID format "abc123"
    When I make the request
    Then I should receive an error "Invalid UUID format"
    And the response code should be 400
