# language: en
Feature: User Authentication
  As a User
  I want to be able to register and log in to the platform
  So I can access the system's functionalities

  Scenario: Successful registration of a new user
    Given there is no user with email "nuevo@test.com"
    When I register with the following data:
      | firstName   | Juan           |
      | lastName    | Pérez          |
      | email       | nuevo@test.com |
      | password    | SecurePass123! |
      | phoneNumber | 3001234567     |
      | dateOfBirth | 1990-05-15     |
    Then the system should create the user successfully
    And the user should have the role "CUSTOMER" by default
    And the user should have status "ACTIVE"
    And a unique UUID should be generated for the user

  Scenario: Successful login
    Given there is a registered user with:
      | email    | cliente@test.com |
      | password | Password123!     |
    When I log in with:
      | email    | cliente@test.com |
      | password | Password123!     |
    Then the system should authenticate the user successfully
    And it should return a valid JWT token
    And it should return the user data

  Scenario: Login with incorrect credentials
    Given there is a user with email "cliente@test.com"
    When I try to log in with:
      | email    | cliente@test.com |
      | password | WrongPassword    |
    Then the system should reject the login
    And it should show an invalid credentials message

  Scenario: Do not allow registration with duplicate email
    Given there is a user with email "existente@test.com"
    When I try to register with the email "existente@test.com"
    Then the system should reject the registration
    And it should show an email already registered message

  Scenario: Email format validation
    When I try to register with an invalid email "correo-invalido"
    Then the system should reject the registration
    And it should show an invalid email format message

  Scenario: Available user roles
    Given I am a system administrator
    When I create users with different roles:
      | role               |
      | CUSTOMER           |
      | STORE_ADMIN        |
      | LOGISTICS_OPERATOR |
      | FINANCE_MANAGER    |
      | SYSTEM_ADMIN       |
    Then the system should assign the roles correctly
    And each user should have the permissions corresponding to their role
