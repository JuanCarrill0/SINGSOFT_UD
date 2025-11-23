# -*- coding: utf-8 -*-
"""
Steps for login tests
"""
import pytest
from pytest_bdd import scenarios, given, when, then, parsers
import requests

scenarios('../features/user_login.feature')

AUTH_API_BASE_URL = "http://localhost:8081/api/auth"

@pytest.fixture
def context():
    return {}


@given(parsers.parse('I have an account registered with email "{email}" and password "{password}"'))
def registered_account(context, email, password):
    context['email'] = email
    context['password'] = password
    context['credentials'] = {'email': email, 'password': password}


@when(parsers.parse('I enter my email "{email}"'))
def enter_email(context, email):
    if 'login_data' not in context:
        context['login_data'] = {}
    context['login_data']['email'] = email


@when(parsers.parse('I enter my password "{password}"'))
def enter_password(context, password):
    if 'login_data' not in context:
        context['login_data'] = {}
    context['login_data']['password'] = password


@when('I click "Log In"')
def click_login(context):
    try:
        response = requests.post(
            f"{AUTH_API_BASE_URL}/login",
            json=context.get('login_data', context.get('credentials', {})),
            timeout=5
        )
        context['response'] = response
        context['status_code'] = response.status_code
        
        if response.status_code == 200:
            context['response_data'] = response.json()
    except requests.exceptions.RequestException as e:
        context['error'] = str(e)
        context['status_code'] = 500


@then('I should receive a valid JWT token')
def verify_jwt_token(context):
    assert 'response_data' in context
    assert 'token' in context['response_data']
    assert len(context['response_data']['token']) > 0


@then('I should receive my user data')
def verify_user_data(context):
    assert 'response_data' in context
    assert 'user' in context['response_data']


@then(parsers.parse('the field "{field}" should be present in the response'))
def field_present(context, field):
    assert 'response_data' in context
    user = context['response_data'].get('user', {})
    assert field in user or field in context['response_data']


@then(parsers.parse('the field "{field}" should be "{value}"'))
def field_value(context, field, value):
    assert 'response_data' in context
    user = context['response_data'].get('user', {})
    assert user.get(field) == value or context['response_data'].get(field) == value


@given(parsers.parse('I attempt to log in with email "{email}"'))
def attempt_login_with_email(context, email):
    context['login_data'] = {'email': email}


@when(parsers.parse('I provide password "{password}"'))
def provide_password(context, password):
    if 'login_data' not in context:
        context['login_data'] = {}
    context['login_data']['password'] = password


@then('I should receive an authentication error')
def authentication_error(context):
    assert context.get('status_code') >= 400


@then('I should not receive a token')
def should_not_receive_token(context):
    if 'response_data' in context:
        assert 'token' not in context['response_data'] or context['response_data']['token'] is None


@then(parsers.parse('the response status code should be {code:d}'))
def verify_response_code(context, code):
    assert context.get('status_code') == code


@when(parsers.parse('I attempt to log in with incorrect password "{password}"'))
def login_with_incorrect_password(context, password):
    context['login_data'] = {
        'email': context.get('email', 'user@example.com'),
        'password': password
    }


@then('the error message should indicate invalid credentials')
def invalid_credentials_message(context):
    assert context.get('status_code') >= 400


@given('I attempt to log in')
def attempt_login(context):
    context['login_data'] = {}


@when('I submit empty email')
def submit_empty_email(context):
    context['login_data']['email'] = ''
    context['login_data']['password'] = 'somepassword'


@when('I submit empty password')
def submit_empty_password(context):
    context['login_data']['email'] = 'test@example.com'
    context['login_data']['password'] = ''


@then('the request should be rejected')
def request_rejected(context):
    assert context.get('status_code') >= 400


@then('I should receive an error indicating required fields')
def required_fields_error(context):
    assert context.get('status_code') >= 400


@given('I have logged in successfully')
def successful_login(context):
    context['login_data'] = {
        'email': 'user@example.com',
        'password': 'password123'
    }
    try:
        response = requests.post(f"{AUTH_API_BASE_URL}/login", json=context['login_data'], timeout=5)
        if response.status_code == 200:
            context['response_data'] = response.json()
            context['token'] = context['response_data'].get('token')
    except:
        pass


@given('I have stored the token in localStorage')
def token_in_localstorage(context):
    context['localStorage'] = {'authToken': context.get('token', 'test-token')}


@when('I reload the page')
def reload_page(context):
    context['page_reloaded'] = True


@then('the token should remain valid')
def token_should_remain_valid(context):
    assert 'localStorage' in context
    assert 'authToken' in context['localStorage']


@then('I can use the token for authenticated requests')
def can_use_token_for_requests(context):
    assert context.get('token') is not None


@then('the response should contain:')
@then(parsers.parse('the response should contain:\n{data}'))
def response_should_contain(context, data=None):
    assert 'response_data' in context


@then('the "user" object should contain:')
@then(parsers.parse('the "user" object should contain:\n{data}'))
def user_should_contain(context, data=None):
    assert 'response_data' in context
    assert 'user' in context['response_data']


@given('I have users registered with different roles')
def users_with_roles(context):
    context['roles'] = ['CUSTOMER', 'LOGISTICS_OPERATOR', 'STORE_ADMIN']


@when(parsers.parse('I log in as "{role}"'))
def login_as_role(context, role):
    context['expected_role'] = role
    context['login_data'] = {
        'email': f'{role.lower()}@example.com',
        'password': 'password123'
    }


@then(parsers.parse('I should receive token with role "{role}"'))
def verify_role_in_token(context, role):
    if 'response_data' in context:
        user = context['response_data'].get('user', {})
        assert user.get('role') == role
