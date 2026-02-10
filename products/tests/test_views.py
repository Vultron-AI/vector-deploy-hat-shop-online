"""Tests for products API endpoints."""
from __future__ import annotations

from decimal import Decimal

import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from products.models import Category, Product, ProductImage


@pytest.fixture
def category(db) -> Category:
    """Create a test category."""
    return Category.objects.create(
        name="Test Category",
        description="A test category",
    )


@pytest.fixture
def product(db, category: Category) -> Product:
    """Create a test product."""
    return Product.objects.create(
        name="Test Hat",
        description="A test hat",
        price=Decimal("29.99"),
        category=category,
        stock=10,
    )


@pytest.fixture
def product_with_images(db, product: Product) -> Product:
    """Create a product with images."""
    ProductImage.objects.create(
        product=product,
        image_url="https://example.com/image1.jpg",
        display_order=0,
        is_primary=True,
    )
    ProductImage.objects.create(
        product=product,
        image_url="https://example.com/image2.jpg",
        display_order=1,
        is_primary=False,
    )
    return product


@pytest.mark.django_db
class TestCategoryViewSet:
    """Tests for category endpoints."""

    def test_list_categories(self, api_client: APIClient, category: Category) -> None:
        """Test listing categories."""
        url = reverse("category-list")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1
        assert response.data["results"][0]["name"] == category.name

    def test_retrieve_category(self, api_client: APIClient, category: Category) -> None:
        """Test retrieving a single category."""
        url = reverse("category-detail", kwargs={"slug": category.slug})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["name"] == category.name
        assert response.data["slug"] == category.slug

    def test_category_product_count(
        self, api_client: APIClient, product: Product
    ) -> None:
        """Test that category includes correct product count."""
        url = reverse("category-detail", kwargs={"slug": product.category.slug})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["product_count"] == 1


@pytest.mark.django_db
class TestProductViewSet:
    """Tests for product endpoints."""

    def test_list_products(self, api_client: APIClient, product: Product) -> None:
        """Test listing products."""
        url = reverse("product-list")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1
        assert response.data["results"][0]["name"] == product.name

    def test_list_products_filter_by_category(
        self, api_client: APIClient, product: Product, db
    ) -> None:
        """Test filtering products by category."""
        # Create another product in different category
        other_category = Category.objects.create(name="Other")
        Product.objects.create(
            name="Other Hat",
            price=Decimal("19.99"),
            category=other_category,
            stock=5,
        )

        url = reverse("product-list")
        response = api_client.get(url, {"category": product.category.slug})

        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1
        assert response.data["results"][0]["name"] == product.name

    def test_retrieve_product(
        self, api_client: APIClient, product_with_images: Product
    ) -> None:
        """Test retrieving a single product with images."""
        url = reverse("product-detail", kwargs={"slug": product_with_images.slug})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["name"] == product_with_images.name
        assert len(response.data["images"]) == 2

    def test_inactive_products_not_listed(
        self, api_client: APIClient, product: Product
    ) -> None:
        """Test that inactive products are not shown in list."""
        product.is_active = False
        product.save()

        url = reverse("product-list")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 0

    def test_product_in_stock_property(
        self, api_client: APIClient, product: Product
    ) -> None:
        """Test in_stock property in response."""
        url = reverse("product-detail", kwargs={"slug": product.slug})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["in_stock"] is True

        # Test out of stock
        product.stock = 0
        product.save()
        response = api_client.get(url)
        assert response.data["in_stock"] is False
