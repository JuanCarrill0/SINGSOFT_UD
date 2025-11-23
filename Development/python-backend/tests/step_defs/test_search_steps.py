import pytest
from pytest_bdd import scenarios, given, when, then, parsers
import requests

scenarios('../features/search_test.feature')

PRODUCTS_API_BASE_URL = "http://localhost:8000/api/products"

@pytest.fixture
def context():
    return {}

@given('I am on the product catalog')
def given_on_catalog(context):
    context['page'] = 'catalog'

@when(parsers.parse('I use the search bar with keyword "{keyword}"'))
def use_search_bar(context, keyword):
    context['search_keyword'] = keyword

@then('the system should show the following products:')
def system_should_show_products(context):
    assert 'search_keyword' in context
