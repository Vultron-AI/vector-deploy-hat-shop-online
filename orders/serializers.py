from __future__ import annotations

from rest_framework import serializers

from orders.models import Order, OrderItem, ShippingAddress


class ShippingAddressSerializer(serializers.ModelSerializer):
    """Serializer for ShippingAddress model."""

    class Meta:
        model = ShippingAddress
        fields = [
            "id",
            "name",
            "address_line_1",
            "address_line_2",
            "city",
            "state",
            "postal_code",
            "country",
        ]


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for OrderItem model."""

    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product_name",
            "quantity",
            "price_at_purchase",
            "subtotal",
        ]


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for Order model."""

    items = OrderItemSerializer(many=True, read_only=True)
    shipping_address = ShippingAddressSerializer(read_only=True)
    item_count = serializers.ReadOnlyField()

    class Meta:
        model = Order
        fields = [
            "id",
            "email",
            "status",
            "total_price",
            "item_count",
            "items",
            "shipping_address",
            "created_at",
            "updated_at",
        ]


class OrderListSerializer(serializers.ModelSerializer):
    """Compact serializer for order listing."""

    item_count = serializers.ReadOnlyField()

    class Meta:
        model = Order
        fields = [
            "id",
            "email",
            "status",
            "total_price",
            "item_count",
            "created_at",
        ]


class CheckoutSerializer(serializers.Serializer):
    """Serializer for checkout request."""

    email = serializers.EmailField()
    name = serializers.CharField(max_length=200)
    address_line_1 = serializers.CharField(max_length=255)
    address_line_2 = serializers.CharField(max_length=255, required=False, allow_blank=True)
    city = serializers.CharField(max_length=100)
    state = serializers.CharField(max_length=100)
    postal_code = serializers.CharField(max_length=20)
    country = serializers.CharField(max_length=100, default="United States")
