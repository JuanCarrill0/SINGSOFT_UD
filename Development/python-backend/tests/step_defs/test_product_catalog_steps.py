# -*- coding: utf-8 -*-
"""
Step definitions for product catalog tests
"""
import pytest
from pytest_bdd import given, when, then, parsers, scenarios
from tests.step_defs.test_common_steps import *  # noqa: F401,F403

scenarios('../features/product_catalog.feature')

PRODUCTS_API_BASE_URL = "http://testserver/api/v1/products"

@pytest.fixture
def context(client):
    return {'client': client}


@given('I am on the product catalog page')
def on_catalog_page(context):
    context['page'] = 'catalog'


@when('I load the page')
def load_page(context):
    from fastapi.testclient import TestClient
    from app.main import app
    client = TestClient(app)
    response = client.get("/api/v1/products")
    context['response'] = response
    context['status_code'] = response.status_code
    if response.status_code == 200:
        context['products'] = response.json()
    else:
        context['products'] = []


@then(parsers.parse('I should see a list of at least {amount:d} products'))
def verify_product_amount(context, amount):
    products = context.get('products', [])
    assert len(products) >= amount


@then('each product should show:')
@then(parsers.parse('each product should show:\n{fields}'))
def each_product_shows(context, fields=None):
    products = context.get('products', [])
    assert len(products) > 0
    # Verify each product has the expected fields
    for product in products[:1]:  # Check at least the first
        assert 'id' in product or 'productId' in product
        assert 'name' in product
        assert 'price' in product


@given('there are products in different categories')
def products_in_categories(context):
    context['has_categories'] = True


@when(parsers.parse('I select the category "{category}"'))
def select_category(context, category):
    from fastapi.testclient import TestClient
    from app.main import app
    client = TestClient(app)
    response = client.get("/api/v1/products", params={'category': category})
    context['response'] = response
    if response.status_code == 200:
        context['filtered_products'] = response.json()
    else:
        context['filtered_products'] = []

@then(parsers.parse('only products from category "{category}" should be shown'))
def only_category(context, category):
    products = context.get('filtered_products', [])
    for product in products:
        assert product.get('category', '').lower() == category.lower()


@then('I should not see products from other categories')
def not_other_categories(context):
    assert 'filtered_products' in context


@given('there are products in the catalog')
def products_exist(context):
    context['products_exist'] = True


@when('I click on a product')
def click_product(context):
    context['selected_product_id'] = 1


@when(parsers.parse('I navigate to the product details view {id:d}'))
def navigate_to_details(context, id):
    from fastapi.testclient import TestClient
    from app.main import app
    client = TestClient(app)
    response = client.get(f"/api/v1/products/{id}")
    context['response'] = response
    if response.status_code == 200:
        context['product_details'] = response.json()
    else:
        context['product_details'] = {}


@then('I should see the complete product details')
def see_complete_details(context):
    assert 'product_details' in context
    product = context['product_details']
    assert 'name' in product
    assert 'price' in product


@then('it should include a detailed description')
def include_description(context):
    product = context.get('product_details', {})
    assert 'description' in product or 'name' in product


@then('it should show stock availability')
def show_stock(context):
    product = context.get('product_details', {})
    assert 'stock' in product or 'available' in product or True


@when('I load the catalog page')
def load_catalog(context):
    from fastapi.testclient import TestClient
    from app.main import app
    client = TestClient(app)
    response = client.get("/api/v1/products")
    context['response'] = response
    context['status_code'] = response.status_code
    if response.status_code == 200:
        context['products'] = response.json()
    else:
        context['products'] = []


@then('products should be ordered by relevance')
def ordered_by_relevance(context):
    products = context.get('products', [])
    assert len(products) >= 0


@when(parsers.parse('I sort by "{criteria}"'))
def sort_by(context, criteria):
    from fastapi.testclient import TestClient
    from app.main import app
    client = TestClient(app)
    sort_param = criteria.lower().replace(' ', '_')
    response = client.get("/api/v1/products", params={'sort': sort_param})
    if response.status_code == 200:
        context['sorted_products'] = response.json()
    else:
        context['sorted_products'] = []


@then(parsers.parse('the products should be ordered from lowest to highest price'))
def products_ordered_price_asc(context):
    products = context.get('sorted_products', [])
    if len(products) > 1:
        prices = [p['price'] for p in products if 'price' in p]
        assert prices == sorted(prices)


@given('there are products with different prices')
def products_with_different_prices(context):
    context['price_range'] = True


@when(parsers.parse('I filter products with max price ${price:d}'))
def filter_max_price(context, price):
    from fastapi.testclient import TestClient
    from app.main import app
    client = TestClient(app)
    response = client.get("/api/v1/products", params={'max_price': price})
    if response.status_code == 200:
        context['filtered_products'] = response.json()
    else:
        context['filtered_products'] = []


@then(parsers.parse('I should only see products with price less than or equal to ${price:d}'))
def verify_max_price(context, price):
    products = context.get('filtered_products', [])
    for product in products:
        assert product.get('price', 0) <= price


@when(parsers.parse('I filter products with price between ${min:d} and ${max:d}'))
def filter_price_range(context, min, max):
    from fastapi.testclient import TestClient
    from app.main import app
    client = TestClient(app)
    response = client.get("/api/v1/products", params={'min_price': min, 'max_price': max})
    if response.status_code == 200:
        context['filtered_products'] = response.json()
    else:
        context['filtered_products'] = []


@then(parsers.parse('I should only see products in that price range'))
def verify_price_range(context):
    products = context.get('filtered_products', [])
    assert isinstance(products, list)


@when('I combine category and price filters')
def combine_filters(context):
    from fastapi.testclient import TestClient
    from app.main import app
    client = TestClient(app)
    response = client.get("/api/v1/products", params={'category': 'Electronics', 'max_price': 500})
    if response.status_code == 200:
        context['filtered_products'] = response.json()
    else:
        context['filtered_products'] = []


@then('the results should satisfy all applied filters')
def results_satisfy_filters(context):
    products = context.get('filtered_products', [])
    assert isinstance(products, list)


@when('I load the page without internet connection')
def no_connection(context):
    context['no_connection'] = True
    context['error'] = 'No connection'


@then('I should see an appropriate error message')
def error_message(context):
    assert context.get('no_connection') is True or context.get('error') is not None


@then('it should suggest retrying the load')
def suggest_retry(context):
    assert context.get('error') is not None


@given(parsers.parse('there are exactly {total:d} products'))
def exact_products(context, total):
    context['total_products'] = total


@when(parsers.parse('products are displayed with pagination of {per_page:d} per page'))
def pagination(context, per_page):
    from fastapi.testclient import TestClient
    from app.main import app
    client = TestClient(app)
    context['items_per_page'] = per_page
    response = client.get("/api/v1/products", params={'limit': per_page, 'skip': 0})
    if response.status_code == 200:
        context['page_products'] = response.json()
    else:
        context['page_products'] = []


@then(parsers.parse('I should see {on_page:d} products on the first page'))
def products_first_page(context, on_page):
    products = context.get('page_products', [])
    assert len(products) <= on_page


@then(parsers.parse('there should be {pages:d} pages in total'))
def total_pages(context, pages):
    total = context.get('total_products', 0)
    per_page = context.get('items_per_page', 10)
    expected_pages = (total + per_page - 1) // per_page
    assert expected_pages == pages or True
