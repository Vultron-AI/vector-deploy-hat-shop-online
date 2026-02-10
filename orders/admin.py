from __future__ import annotations

from django.contrib import admin

from orders.models import Order, OrderItem, ShippingAddress


class OrderItemInline(admin.TabularInline):
    """Inline admin for order items."""

    model = OrderItem
    extra = 0
    readonly_fields = ["product", "product_name", "quantity", "price_at_purchase"]


@admin.register(ShippingAddress)
class ShippingAddressAdmin(admin.ModelAdmin):
    """Admin configuration for ShippingAddress model."""

    list_display = ["name", "city", "state", "country", "created_at"]
    search_fields = ["name", "city", "state"]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """Admin configuration for Order model."""

    list_display = ["id", "email", "status", "total_price", "item_count", "created_at"]
    list_filter = ["status", "created_at"]
    search_fields = ["email", "id"]
    readonly_fields = ["total_price"]
    inlines = [OrderItemInline]

    def item_count(self, obj: Order) -> int:
        return obj.item_count

    item_count.short_description = "Items"


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    """Admin configuration for OrderItem model."""

    list_display = ["order", "product_name", "quantity", "price_at_purchase", "subtotal"]
    list_filter = ["order__status"]
    search_fields = ["product_name", "order__email"]
