"""Tests for cart API endpoints."""
from __future__ import annotations

from decimal import Decimal

import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

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


@pytest.mark.django_db
class TestCartView:
    """Tests for cart endpoint."""

    def test_get_empty_cart(self, api_client: APIClient) -> None:
        """Test getting an empty cart."""
        url = reverse("cart")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["items"] == []
        assert response.data["total_items"] == 0
        assert response.data["subtotal"] == "0"

    def test_clear_cart(self, api_client: APIClient, product: Product) -> None:
        """Test clearing cart."""
        # First add an item
        add_url = reverse("cart-items")
        api_client.post(add_url, {"product_id": str(product.id), "quantity": 2})

        # Then clear
        url = reverse("cart")
        response = api_client.delete(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["items"] == []
        assert response.data["total_items"] == 0


@pytest.mark.django_db
class TestCartItemView:
    """Tests for cart item endpoint."""

    def test_add_item_to_cart(self, api_client: APIClient, product: Product) -> None:
        """Test adding item to cart."""
        url = reverse("cart-items")
        response = api_client.post(
            url,
            {"product_id": str(product.id), "quantity": 2},
        )

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["item"]["quantity"] == 2
        assert response.data["cart"]["total_items"] == 2

    def test_add_item_increases_quantity(
        self, api_client: APIClient, product: Product
    ) -> None:
        """Test that adding same item increases quantity."""
        url = reverse("cart-items")

        # Add first time
        api_client.post(url, {"product_id": str(product.id), "quantity": 1})

        # Add again
        response = api_client.post(
            url, {"product_id": str(product.id), "quantity": 2}
        )

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["item"]["quantity"] == 3

    def test_add_item_missing_product_id(self, api_client: APIClient) -> None:
        """Test adding item without product_id."""
        url = reverse("cart-items")
        response = api_client.post(url, {"quantity": 1})

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_add_item_invalid_product(self, api_client: APIClient) -> None:
        """Test adding non-existent product."""
        url = reverse("cart-items")
        response = api_client.post(
            url,
            {"product_id": "00000000-0000-0000-0000-000000000000", "quantity": 1},
        )

        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
class TestCartItemDetailView:
    """Tests for cart item detail endpoint."""

    def test_update_item_quantity(
        self, api_client: APIClient, product: Product
    ) -> None:
        """Test updating item quantity."""
        # Add item first
        add_url = reverse("cart-items")
        api_client.post(add_url, {"product_id": str(product.id), "quantity": 1})

        # Update quantity
        url = reverse("cart-item-detail", kwargs={"product_id": str(product.id)})
        response = api_client.patch(url, {"quantity": 5})

        assert response.status_code == status.HTTP_200_OK
        assert response.data["item"]["quantity"] == 5

    def test_update_item_to_zero_removes_it(
        self, api_client: APIClient, product: Product
    ) -> None:
        """Test that setting quantity to 0 removes item."""
        # Add item first
        add_url = reverse("cart-items")
        api_client.post(add_url, {"product_id": str(product.id), "quantity": 2})

        # Update to 0
        url = reverse("cart-item-detail", kwargs={"product_id": str(product.id)})
        response = api_client.patch(url, {"quantity": 0})

        assert response.status_code == status.HTTP_200_OK
        assert response.data["cart"]["total_items"] == 0

    def test_remove_item_from_cart(
        self, api_client: APIClient, product: Product
    ) -> None:
        """Test removing item from cart."""
        # Add item first
        add_url = reverse("cart-items")
        api_client.post(add_url, {"product_id": str(product.id), "quantity": 2})

        # Remove
        url = reverse("cart-item-detail", kwargs={"product_id": str(product.id)})
        response = api_client.delete(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["removed"]["product_id"] == str(product.id)
        assert response.data["cart"]["total_items"] == 0

    def test_remove_nonexistent_item(self, api_client: APIClient) -> None:
        """Test removing item not in cart."""
        url = reverse(
            "cart-item-detail",
            kwargs={"product_id": "00000000-0000-0000-0000-000000000000"},
        )
        response = api_client.delete(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND
