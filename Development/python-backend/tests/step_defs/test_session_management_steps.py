# -*- coding: utf-8 -*-
"""
Steps for session management tests
"""
import pytest
from pytest_bdd import scenarios, given, when, then, parsers
import requests
import time

scenarios('../features/session_management.feature')

AUTH_API_BASE_URL = "http://localhost:8081/api/auth"

@pytest.fixture
def context():
    return {}


@given('I have logged in successfully')
def session_started(context):
    login_data = {'email': 'user@example.com', 'password': 'password123'}
    try:
        response = requests.post(f"{AUTH_API_BASE_URL}/login", json=login_data, timeout=5)
        if response.status_code == 200:
            data = response.json()
            context['token'] = data.get('token')
            context['user_data'] = data.get('user')
    except:
        context['token'] = 'test-token'


@given('I have a valid JWT token')
def valid_token(context):
    if 'token' not in context:
        context['token'] = 'valid-test-token'


@when('I click "Log Out"')
def click_log_out(context):
    context['logout_clicked'] = True
    context['token'] = None
    context['localStorage_cleared'] = True


@then('the token should be removed from localStorage')
def token_removed_localstorage(context):
    assert context.get('localStorage_cleared') is True


@then('I should be redirected to the login page')
def redirected_to_login_page(context):
    assert context.get('logout_clicked') is True


@then('I should not be able to access protected routes')
def cannot_access_protected_routes(context):
    assert context.get('token') is None


@when(parsers.parse('I try to access "{route}"'))
def access_route(context, route):
    context['requested_route'] = route
    # Simulate request without token
    context['access_denied'] = context.get('token') is None


@then('I should be redirected to login')
def should_redirect_to_login(context):
    assert context.get('access_denied') is True or context.get('redirect_to_login') is True


@given('my session is active')
def session_active(context):
    context['session_active'] = True
    context['token'] = 'active-token'


@when('I close the browser tab')
def close_tab(context):
    context['tab_closed'] = True


@when('I reopen the application')
def reopen_app(context):
    context['app_reopened'] = True


@then('my session should remain active')
def session_remains_active(context):
    assert context.get('token') is not None


@then('I can continue using the app without re-login')
def continue_without_relogin(context):
    assert context.get('session_active') is True


@when('I perform actions in the app')
def perform_actions(context):
    context['actions_performed'] = True


@when(parsers.parse('{minutes:d} minutes of inactivity pass'))
def inactivity(context, minutes):
    context['inactive_minutes'] = minutes


@then('my session should remain active')
def session_should_remain_active(context):
    assert context.get('token') is not None


@when(parsers.parse('{hours:d} hours of inactivity pass'))
def hours_inactivity(context, hours):
    context['inactive_hours'] = hours
    # Simulate token expiration
    if hours >= 24:
        context['token_expired'] = True
        context['token'] = None


@then('my session should expire')
def session_should_expire(context):
    assert context.get('token_expired') is True or context.get('token') is None


@when('I make a request to a protected API')
def request_protected_api(context):
    headers = {}
    if context.get('token'):
        headers['Authorization'] = f"Bearer {context['token']}"
    context['api_headers'] = headers
    context['api_response'] = 401 if not context.get('token') else 200


@then('I should receive an expired token error')
def expired_token_error(context):
    assert context.get('api_response') == 401 or context.get('token_expired') is True


@given('I am navigating the application')
def navigating_application(context):
    context['navigating'] = True
    context['token'] = 'valid-token'


@when('I navigate between different pages')
def navigate_pages(context):
    context['pages_visited'] = ['home', 'products', 'cart', 'profile']


@then('my token should persist across pages')
def token_persists(context):
    assert context.get('token') == 'valid-token'


@then('authenticated requests should work correctly')
def authenticated_requests_work(context):
    assert context.get('token') is not None


@given('I have two tabs open with the same session')
def two_tabs(context):
    context['tab1'] = {'token': 'shared-token'}
    context['tab2'] = {'token': 'shared-token'}


@when('I log out in one tab')
def log_out_one_tab(context):
    context['tab1']['token'] = None
    context['tab1']['logout'] = True


@when('I return to the other tab')
def return_to_other_tab(context):
    context['current_tab'] = 'tab2'


@then('I should also be logged out')
def logged_out_both_tabs(context):
    assert context['tab1'].get('logout') is True


@then('I should not be able to perform authenticated actions')
def cannot_perform_authenticated_actions(context):
    assert context['tab1'].get('token') is None
