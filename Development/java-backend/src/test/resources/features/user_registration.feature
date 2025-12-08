Feature: User Registration
  As a website visitor
  I want to create a user account
  So I can make purchases and access exclusive features

  Scenario: Successful registration of a new user
    Given I am on the login page
    When I click on "Don't have an account? Register"
    And I fill out the registration form with:
      | field           | value                |
      | email           | new@example.com      |
      | password        | password123          |
      | first_name      | Juan                 |
      | last_name       | Perez                |
      | phone           | +57 300 123 4567     |
      | birth_date      | 1990-05-15           |
    And I click on "Register"
    Then I should see a success message
    And I should receive a valid JWT token
    And my session should be started automatically
    And I should see my user data in the response

  Scenario: Registration with duplicate email
    Given a user is already registered with email "existente@example.com"
    When I try to register with email "existente@example.com"
    And I provide password "password123"
    And I provide first name "Maria" and last name "Garcia"
    Then I should receive an error "Email already registered"
    And I should not receive an authentication token

  Scenario: Registration with missing required fields
    Given I am on the registration form
    When I try to register without providing email
    Then the request should fail
    When I try to register without providing password
    Then the request should fail

  Scenario: Registration with invalid date format
    Given I try to register with valid data
    But I provide birth date in invalid format "15-05-1990"
    When I submit the registration form
    Then I should receive an error "Invalid date format. Use YYYY-MM-DD"

  Scenario: Registration with only required fields
    Given I am on the registration form
    When I fill only the required fields:
      | field      | value              |
      | email      | minimo@example.com |
      | password   | password123        |
      | first_name | Pedro              |
      | last_name  | Lopez              |
    And I click on "Register"
    Then the registration should be successful
    And I should receive a valid JWT token
    And optional fields should be empty

  Scenario: Verify password encryption
    Given I register a new user with password "miPasswordSegura123"
    When the user registers successfully
      Then the password should be encrypted with BCrypt
      And the plain text password should not be stored in the database
