from __future__ import annotations

from decimal import Decimal
from typing import TYPE_CHECKING

from django.conf import settings
from django.db import models

from shared.models import BaseModel

if TYPE_CHECKING:
    from products.models import Product


class ShippingAddress(BaseModel):
    """
    Shipping address for orders.
    """

    name = models.CharField(max_length=200)
    address_line_1 = models.CharField(max_length=255)
    address_line_2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default="United States")

    class Meta:
        db_table = "shipping_addresses"
        verbose_name_plural = "shipping addresses"

    def __str__(self) -> str:
        return f"{self.name} - {self.city}, {self.state}"


class Order(BaseModel):
    """
    Order model tracking customer purchases.
    """

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        PAID = "paid", "Paid"
        SHIPPED = "shipped", "Shipped"
        DELIVERED = "delivered", "Delivered"
        CANCELLED = "cancelled", "Cancelled"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="orders",
    )
    email = models.EmailField()
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )
    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00"),
    )
    shipping_address = models.ForeignKey(
        ShippingAddress,
        on_delete=models.PROTECT,
        related_name="orders",
    )

    class Meta:
        db_table = "orders"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"Order {self.id} - {self.email}"

    @property
    def item_count(self) -> int:
        """Get total number of items in the order."""
        return sum(item.quantity for item in self.items.all())

    def calculate_total(self) -> Decimal:
        """Calculate total price from order items."""
        return sum(
            item.price_at_purchase * item.quantity for item in self.items.all()
        )


class OrderItem(BaseModel):
    """
    Individual item in an order.
    """

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items",
    )
    product = models.ForeignKey(
        "products.Product",
        on_delete=models.SET_NULL,
        null=True,
        related_name="order_items",
    )
    product_name = models.CharField(max_length=200)
    quantity = models.PositiveIntegerField(default=1)
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = "order_items"

    def __str__(self) -> str:
        return f"{self.product_name} x {self.quantity}"

    @property
    def subtotal(self) -> Decimal:
        """Calculate subtotal for this item."""
        return self.price_at_purchase * self.quantity
