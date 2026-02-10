from __future__ import annotations

from rest_framework import serializers

from products.models import Category, Product, ProductImage


class ProductImageSerializer(serializers.ModelSerializer):
    """Serializer for ProductImage model."""

    class Meta:
        model = ProductImage
        fields = [
            "id",
            "image_url",
            "display_order",
            "is_primary",
        ]


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model."""

    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "product_count",
            "created_at",
        ]

    def get_product_count(self, obj: Category) -> int:
        return obj.products.filter(is_active=True).count()


class ProductListSerializer(serializers.ModelSerializer):
    """Serializer for product listing (compact)."""

    category = CategorySerializer(read_only=True)
    primary_image = ProductImageSerializer(read_only=True)
    in_stock = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "price",
            "category",
            "stock",
            "is_active",
            "in_stock",
            "primary_image",
            "created_at",
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    """Serializer for product detail (includes all images)."""

    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    in_stock = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "price",
            "category",
            "stock",
            "is_active",
            "in_stock",
            "images",
            "created_at",
            "updated_at",
        ]
