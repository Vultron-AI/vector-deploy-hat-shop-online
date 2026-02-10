"""Tests for orders API endpoints."""
from __future__ import annotations

from decimal import Decimal

import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from orders.models import Order, OrderItem, ShippingAddress
from products.models import Category, Product


@pytest.fixture
def category(db) -> Category:
    """Create a test category."""
    return Category.objects.create(name="Test Category")


@pytest.fixture
def product(db, category: Category) -> Product:
    """Create a test product."""
    return Product.objects.create(
        name="Test Hat",
        price=Decimal("29.99"),
        category=category,
        stock=10,
    )


@pytest.fixture
def cart_with_items(api_client: APIClient, product: Product):
    """Create a cart with items."""
    url = reverse("cart-items")
    api_client.post(url, {"product_id": str(product.id), "quantity": 2})
    return api_client


@pytest.fixture
def checkout_data() -> dict:
    """Sample checkout data."""
    return {
        "email": "test@example.com",
        "name": "John Doe",
        "address_line_1": "123 Test St",
        "city": "New York",
        "state": "NY",
        "postal_code": "10001",
        "country": "United States",
    }


@pytest.mark.django_db
class TestCheckoutView:
    """Tests for checkout endpoint."""

    def test_checkout_creates_order(
        self, cart_with_items: APIClient, checkout_data: dict
    ) -> None:
        """Test that checkout creates an order."""
        url = reverse("checkout")
        response = cart_with_items.post(url, checkout_data)

        assert response.status_code == status.HTTP_201_CREATED
        assert "id" in response.data
        assert response.data["email"] == checkout_data["email"]
        assert response.data["status"] == "pending"
        assert len(response.data["items"]) == 1

    def test_checkout_clears_cart(
        self, cart_with_items: APIClient, checkout_data: dict
    ) -> None:
        """Test that checkout clears the cart."""
        checkout_url = reverse("checkout")
        cart_with_items.post(checkout_url, checkout_data)

        cart_url = reverse("cart")
        response = cart_with_items.get(cart_url)

        assert response.data["total_items"] == 0

    def test_checkout_empty_cart_fails(
        self, api_client: APIClient, checkout_data: dict
    ) -> None:
        """Test that checkout with empty cart fails."""
        url = reverse("checkout")
        response = api_client.post(url, checkout_data)

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_checkout_invalid_email_fails(
        self, cart_with_items: APIClient, checkout_data: dict
    ) -> None:
        """Test that checkout with invalid email fails."""
        checkout_data["email"] = "invalid-email"
        url = reverse("checkout")
        response = cart_with_items.post(url, checkout_data)

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_checkout_missing_fields_fails(
        self, cart_with_items: APIClient
    ) -> None:
        """Test that checkout with missing fields fails."""
        url = reverse("checkout")
        response = cart_with_items.post(url, {"email": "test@example.com"})

        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestOrderViewSet:
    """Tests for order endpoints."""

    def test_retrieve_order_by_id(
        self, cart_with_items: APIClient, checkout_data: dict
    ) -> None:
        """Test retrieving an order by ID."""
        # Create order first
        checkout_url = reverse("checkout")
        checkout_response = cart_with_items.post(checkout_url, checkout_data)
        order_id = checkout_response.data["id"]

        # Retrieve order
        url = reverse("order-detail", kwargs={"pk": order_id})
        response = cart_with_items.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["id"] == order_id
        assert response.data["email"] == checkout_data["email"]

    def test_retrieve_nonexistent_order(self, api_client: APIClient) -> None:
        """Test retrieving non-existent order."""
        url = reverse(
            "order-detail",
            kwargs={"pk": "00000000-0000-0000-0000-000000000000"},
        )
        response = api_client.get(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_order_includes_shipping_address(
        self, cart_with_items: APIClient, checkout_data: dict
    ) -> None:
        """Test that order includes shipping address."""
        checkout_url = reverse("checkout")
        checkout_response = cart_with_items.post(checkout_url, checkout_data)
        order_id = checkout_response.data["id"]

        url = reverse("order-detail", kwargs={"pk": order_id})
        response = cart_with_items.get(url)

        assert response.status_code == status.HTTP_200_OK
        shipping = response.data["shipping_address"]
        assert shipping["name"] == checkout_data["name"]
        assert shipping["city"] == checkout_data["city"]

    def test_order_calculates_total(
        self, cart_with_items: APIClient, checkout_data: dict, product: Product
    ) -> None:
        """Test that order calculates correct total."""
        checkout_url = reverse("checkout")
        response = cart_with_items.post(checkout_url, checkout_data)

        # 2 items at 29.99 each
        expected_total = Decimal("59.98")
        assert Decimal(response.data["total_price"]) == expected_total
