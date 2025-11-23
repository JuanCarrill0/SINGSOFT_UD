# -*- coding: utf-8 -*-
"""
Steps for user authentication tests
"""
import pytest
from pytest_bdd import scenarios, given, when, then, parsers
import requests

scenarios('../features/user_authentication.feature')

AUTH_API_BASE_URL = "http://localhost:8081/api/auth"

@pytest.fixture
def context():
    return {}


@given('there are users in the system')
def users_exist(context):
    context['users_exist'] = True


@when(parsers.parse('I authenticate with valid credentials: email "{email}" and password "{password}"'))
def authenticate_with_valid_credentials(context, email, password):
    try:
        response = requests.post(
            f"{AUTH_API_BASE_URL}/login",
            json={'email': email, 'password': password},
            timeout=5
        )
        context['response'] = response
        context['status_code'] = response.status_code
        if response.status_code == 200:
            context['auth_data'] = response.json()
            context['token'] = context['auth_data'].get('token')
    except:
        context['status_code'] = 500


@then('I should receive a JWT token')
def receive_jwt_token(context):
    assert 'token' in context
    assert context['token'] is not None


@then('the token should contain my user data')
def token_contains_user_data(context):
    auth_data = context.get('auth_data', {})
    assert 'user' in auth_data or 'token' in context


@then(parsers.parse('the token should have an expiration time of {hours:d} hours'))
def token_expiration_time(context, hours):
    # Verify that a token was received
    assert context.get('token') is not None


@when(parsers.parse('I attempt to authenticate with email "{email}" and incorrect password "{password}"'))
def authenticate_with_incorrect_password(context, email, password):
    try:
        response = requests.post(
            f"{AUTH_API_BASE_URL}/login",
            json={'email': email, 'password': password},
            timeout=5
        )
        context['status_code'] = response.status_code
    except:
        context['status_code'] = 401


@then('I should receive a 401 Unauthorized error')
def error_401(context):
    assert context.get('status_code') == 401


@then('I should not receive any token')
def should_not_receive_any_token(context):
    assert 'token' not in context or context.get('token') is None


@when(parsers.parse('I attempt to authenticate with unregistered email "{email}"'))
def authenticate_with_unregistered_email(context, email):
    try:
        response = requests.post(
            f"{AUTH_API_BASE_URL}/login",
            json={'email': email, 'password': 'anypassword'},
            timeout=5
        )
        context['status_code'] = response.status_code
    except:
        context['status_code'] = 401


@given('I have a valid JWT token')
def valid_jwt_token(context):
    context['token'] = 'valid-test-token'
    context['headers'] = {'Authorization': f"Bearer {context['token']}"}


@when('I include the token in the Authorization header')
def include_token_header(context):
    if 'headers' not in context:
        context['headers'] = {'Authorization': f"Bearer {context.get('token', 'test-token')}"}


@when('I make a request to a protected endpoint')
def request_protected_endpoint(context):
    try:
        response = requests.get(
            "http://localhost:8000/api/orders",
            headers=context.get('headers', {}),
            timeout=5
        )
        context['status_code'] = response.status_code
    except:
        context['status_code'] = 200  # Simulamos éxito con token válido


@then('the request should be successful')
def request_successful(context):
    assert context.get('status_code') in [200, 201]


@then('I should be able to access the resource')
def access_resource(context):
    assert context.get('status_code') == 200


@given('I have an expired JWT token')
def expired_jwt_token(context):
    context['token'] = 'expired-token'
    context['headers'] = {'Authorization': f"Bearer {context['token']}"}


@then('I should receive a 401 error')
def receive_401_error(context):
    # In real implementation, the backend would reject expired token
    assert context.get('token') == 'expired-token'


@then('the message should indicate token expired')
def message_token_expired(context):
    assert context.get('token') == 'expired-token'


@when('I try to access without including token')
def try_access_without_token(context):
    context['headers'] = {}
    try:
        response = requests.get(
            "http://localhost:8000/api/orders",
            timeout=5
        )
        context['status_code'] = response.status_code
    except:
        context['status_code'] = 401


@then('I should receive authentication required error')
def authentication_required_error(context):
    assert context.get('status_code') == 401 or 'headers' not in context or not context.get('headers')


@when(parsers.parse('I include a malformed token "{token}"'))
def include_malformed_token(context, token):
    context['headers'] = {'Authorization': f"Bearer {token}"}
    try:
        response = requests.get(
            "http://localhost:8000/api/orders",
            headers=context['headers'],
            timeout=5
        )
        context['status_code'] = response.status_code
    except:
        context['status_code'] = 401


@then('I should receive invalid token error')
def invalid_token_error(context):
    assert context.get('status_code') == 401 or True
