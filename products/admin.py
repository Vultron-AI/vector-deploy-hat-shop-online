from __future__ import annotations

from django.contrib import admin

from products.models import Category, Product, ProductImage


class ProductImageInline(admin.TabularInline):
    """Inline admin for product images."""

    model = ProductImage
    extra = 1
    fields = ["image_url", "display_order", "is_primary"]


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Admin configuration for Category model."""

    list_display = ["name", "slug", "created_at"]
    search_fields = ["name", "description"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """Admin configuration for Product model."""

    list_display = ["name", "category", "price", "stock", "is_active", "created_at"]
    list_filter = ["category", "is_active"]
    search_fields = ["name", "description"]
    prepopulated_fields = {"slug": ("name",)}
    inlines = [ProductImageInline]


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    """Admin configuration for ProductImage model."""

    list_display = ["product", "display_order", "is_primary", "created_at"]
    list_filter = ["is_primary", "product__category"]
    search_fields = ["product__name"]
