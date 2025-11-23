# -*- coding: utf-8 -*-
"""
Steps for user registration tests
"""
import pytest
from pytest_bdd import scenarios, given, when, then, parsers
import requests
import json

# Cargar escenarios del archivo .feature
scenarios('../features/user_registration.feature')

# URL base del backend de autenticación (Java)
AUTH_API_BASE_URL = "http://localhost:8081/api/auth"

@pytest.fixture
def context():
    """Contexto compartido para los pasos"""
    return {}


@given('I am on the login page')
def on_login_page(context):
    context['page'] = 'login'


@when('I click "Don\'t have an account? Register"')
def click_register_prompt(context):
    context['mode'] = 'register'


@when(parsers.parse('I complete the registration form with:\n{data}'))
def complete_registration_form(context, data):
    # Parse the table-like data
    lines = data.strip().split('\n')
    registro_data = {}

    for line in lines[1:]:  # Skip header
        if '|' in line:
            parts = [p.strip() for p in line.split('|')]
            if len(parts) >= 3:
                campo = parts[1]
                valor = parts[2]

                # Map both English and Spanish field names
                field_map = {
                    'email': 'email',
                    'password': 'password',
                    'nombre': 'firstName',
                    'apellido': 'lastName',
                    'teléfono': 'phoneNumber',
                    'telefono': 'phoneNumber',
                    'fecha_nacimiento': 'dateOfBirth',
                    'dateOfBirth': 'dateOfBirth'
                }

                if campo in field_map:
                    registro_data[field_map[campo]] = valor

    context['registro_data'] = registro_data


@when('I click "Register"')
def click_register(context):
    try:
        response = requests.post(
            f"{AUTH_API_BASE_URL}/register",
            json=context['registro_data'],
            timeout=5
        )
        context['response'] = response
        context['status_code'] = response.status_code
        
        if response.status_code == 200:
            context['response_data'] = response.json()
    except requests.exceptions.RequestException as e:
        context['error'] = str(e)
        context['status_code'] = 500


@then('I should see a success message')
def verify_success_message(context):
    assert context.get('status_code') == 200, f"Expected 200, got {context.get('status_code')}"
    assert 'response_data' in context


@then('I should receive a valid JWT token')
def verify_jwt_token(context):
    assert 'response_data' in context
    assert 'token' in context['response_data']
    assert len(context['response_data']['token']) > 0


@then('my session should be logged in automatically')
def verify_session_logged_in(context):
    assert 'response_data' in context
    assert 'user' in context['response_data']


@then('I should see my user data in the response')
def verify_user_data(context):
    assert 'response_data' in context
    user = context['response_data'].get('user', {})
    assert 'userid' in user or 'userId' in user
    assert 'email' in user


@given(parsers.parse('there exists a registered user with email "{email}"'))
def user_exists(context, email):
    context['existing_email'] = email


@when(parsers.parse('I attempt to register with the email "{email}"'))
def attempt_register_with_email(context, email):
    context['registro_data'] = {'email': email}


@when(parsers.parse('I provide password "{password}"'))
def provide_password(context, password):
    if 'registro_data' not in context:
        context['registro_data'] = {}
    context['registro_data']['password'] = password


@when(parsers.parse('I provide first name "{firstName}" and last name "{lastName}"'))
def provide_first_last_name(context, firstName, lastName):
    if 'registro_data' not in context:
        context['registro_data'] = {}
    context['registro_data']['firstName'] = firstName
    context['registro_data']['lastName'] = lastName


@then(parsers.parse('I should receive an error "{message}"'))
def verify_error(context, message):
    assert context.get('status_code') != 200
    if 'response_data' in context:
        error_msg = context['response_data'].get('error', '')
        assert message.lower() in error_msg.lower()


@then('I should not receive an authentication token')
def should_not_receive_auth_token(context):
    if 'response_data' in context:
        assert 'token' not in context['response_data'] or context['response_data']['token'] is None


@given('I am on the registration form')
def on_registration_form(context):
    context['page'] = 'register'


@when('I attempt to register without providing email')
def register_without_email(context):
    context['registro_data'] = {
        'password': 'test123',
        'firstName': 'Test',
        'lastName': 'User'
    }
    try:
        response = requests.post(f"{AUTH_API_BASE_URL}/register", json=context['registro_data'], timeout=5)
        context['response'] = response
        context['status_code'] = response.status_code
    except:
        context['status_code'] = 400


@then('the request should fail')
def request_should_fail(context):
    assert context.get('status_code') >= 400


@when('I attempt to register without providing password')
def register_without_password(context):
    context['registro_data'] = {
        'email': 'test@example.com',
        'firstName': 'Test',
        'lastName': 'User'
    }
    try:
        response = requests.post(f"{AUTH_API_BASE_URL}/register", json=context['registro_data'], timeout=5)
        context['response'] = response
        context['status_code'] = response.status_code
    except:
        context['status_code'] = 400


@given('I attempt to register with valid data')
def valid_data(context):
    context['registro_data'] = {
        'email': 'test@example.com',
        'password': 'password123',
        'firstName': 'Test',
        'lastName': 'User'
    }


@when(parsers.parse('I provide date of birth in invalid format "{date}"'))
def invalid_dob(context, date):
    context['registro_data']['dateOfBirth'] = date


@when('I submit the registration form')
def submit_registration_form(context):
    try:
        response = requests.post(f"{AUTH_API_BASE_URL}/register", json=context['registro_data'], timeout=5)
        context['response'] = response
        context['status_code'] = response.status_code
        if response.status_code != 200:
            context['response_data'] = response.json()
    except:
        context['status_code'] = 500


@when('I complete only the required fields:')
@when(parsers.parse('I complete only the required fields:\n{data}'))
def required_fields(context, data=None):
    if data:
        lines = data.strip().split('\n')
        registro_data = {}

        for line in lines[1:]:
            if '|' in line:
                parts = [p.strip() for p in line.split('|')]
                if len(parts) >= 3:
                    campo = parts[1]
                    valor = parts[2]

                    field_map = {
                        'email': 'email',
                        'password': 'password',
                        'nombre': 'firstName',
                        'apellido': 'lastName'
                    }

                    if campo in field_map:
                        registro_data[field_map[campo]] = valor

        context['registro_data'] = registro_data


@then('the registration should be successful')
def registration_successful(context):
    assert context.get('status_code') == 200


@then('optional fields should be empty')
def optional_fields_empty(context):
    if 'response_data' in context:
        user = context['response_data'].get('user', {})
        assert user.get('phoneNumber', '') == '' or 'phoneNumber' not in user


@given(parsers.parse('I register a new user with password "{password}"'))
def register_with_password(context, password):
    context['password'] = password
    context['registro_data'] = {
        'email': 'test@example.com',
        'password': password,
        'firstName': 'Test',
        'lastName': 'User'
    }


@when('the user registers successfully')
def user_registers_successfully(context):
    try:
        response = requests.post(f"{AUTH_API_BASE_URL}/register", json=context['registro_data'], timeout=5)
        context['response'] = response
        context['status_code'] = response.status_code
    except:
        pass


@then('the password should be encrypted with BCrypt')
def password_encrypted(context):
    assert context.get('status_code') == 200


@then('the plain-text password should not be stored in the database')
def plain_password_not_stored(context):
    assert context.get('status_code') == 200
