from __future__ import annotations

from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from products.models import Category, Product
from products.serializers import (
    CategorySerializer,
    ProductDetailSerializer,
    ProductListSerializer,
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for listing and retrieving categories.

    list: GET /api/categories/
    retrieve: GET /api/categories/{id}/
    """

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for listing and retrieving products.

    list: GET /api/products/
    retrieve: GET /api/products/{id}/

    Query Parameters:
        category: Filter by category slug
    """

    permission_classes = [AllowAny]
    lookup_field = "slug"

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True).select_related(
            "category"
        ).prefetch_related("images")

        category_slug = self.request.query_params.get("category")
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)

        return queryset

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ProductDetailSerializer
        return ProductListSerializer
