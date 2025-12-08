# -*- coding: utf-8 -*-
"""
Common step definitions to cover feature phrases not implemented elsewhere.
These are lightweight context setters so feature scenarios can progress.
"""
from pytest_bdd import given, parsers


@given(parsers.parse('I am authenticated with userid "{userid}"'))
def authenticated_with_userid(context, userid):
    # Mark the context as authenticated for that user id
    context['user_id'] = userid
    context['token'] = 'test-auth-token'
    context['headers'] = {'Authorization': f"Bearer {context['token']}"}


@given('I have products available in the catalog')
def products_available(context):
    # Provide a small sample catalog in context
    context.setdefault('products', [])
    if not context['products']:
        context['products'] = [
            {'id': 1, 'name': 'Nike Air Max Shoes', 'price': 129.99, 'stock': 45},
            {'id': 2, 'name': 'Adidas Ultraboost Shoes', 'price': 159.99, 'stock': 32},
        ]


@given(parsers.parse('there is a product with ID {product_id:d}'))
def product_with_id(context, product_id):
    # Ensure product exists in context
    context.setdefault('products', [])
    product = next((p for p in context['products'] if p.get('id') == product_id), None)
    if not product:
        product = {'id': product_id, 'name': f'Product {product_id}', 'price': 9.99, 'stock': 10}
        context['products'].append(product)
    context['product'] = product


@given(parsers.parse('there is an order with ID {order_id:d} and total of {total:f}'))
def order_with_id_and_total(context, order_id, total):
    context['order'] = {'id': order_id, 'total': total, 'status': 'PENDING'}


@given('I access the GET endpoint "/api/products"')
def access_get_products(context):
    context['requested_route'] = '/api/products'


@given('I query the product catalog')
def query_product_catalog(context):
    context.setdefault('products', [])


@given('I have products in my cart')
def have_products_in_cart(context):
    context.setdefault('cart', {'items': [{'productId': 1, 'quantity': 1, 'price': 100}]})
