from __future__ import annotations

import logging
from decimal import Decimal
from typing import Any

from django.conf import settings
from django.core.mail import send_mail

from cart.services import CartService
from orders.models import Order, OrderItem, ShippingAddress
from products.models import Product

logger = logging.getLogger(__name__)


def create_order_from_cart(
    cart: CartService,
    email: str,
    shipping_data: dict[str, Any],
    user=None,
) -> Order:
    """
    Create an order from cart contents.

    Args:
        cart: CartService instance with items
        email: Customer email address
        shipping_data: Shipping address data
        user: Optional authenticated user

    Returns:
        Created Order instance

    Raises:
        ValueError: If cart is empty
    """
    if not cart.get_items():
        raise ValueError("Cannot create order from empty cart")

    # Create shipping address
    shipping_address = ShippingAddress.objects.create(
        name=shipping_data["name"],
        address_line_1=shipping_data["address_line_1"],
        address_line_2=shipping_data.get("address_line_2", ""),
        city=shipping_data["city"],
        state=shipping_data["state"],
        postal_code=shipping_data["postal_code"],
        country=shipping_data.get("country", "United States"),
    )

    # Create order
    order = Order.objects.create(
        user=user,
        email=email,
        shipping_address=shipping_address,
        total_price=Decimal("0.00"),
    )

    # Create order items
    total = Decimal("0.00")
    for item in cart.get_items():
        try:
            product = Product.objects.get(id=item["product_id"])
        except Product.DoesNotExist:
            product = None

        order_item = OrderItem.objects.create(
            order=order,
            product=product,
            product_name=item["name"],
            quantity=item["quantity"],
            price_at_purchase=Decimal(item["price"]),
        )
        total += order_item.subtotal

    # Update order total
    order.total_price = total
    order.save()

    # Clear the cart
    cart.clear()

    # Send notification
    send_order_notification(order)

    return order


def send_order_notification(order: Order) -> None:
    """
    Send order notification email to store owner.

    Args:
        order: Order instance to notify about
    """
    try:
        subject = f"New Order #{str(order.id)[:8]}"
        message = f"""
New order received!

Order ID: {order.id}
Customer Email: {order.email}
Total: ${order.total_price}
Items: {order.item_count}

Shipping Address:
{order.shipping_address.name}
{order.shipping_address.address_line_1}
{order.shipping_address.address_line_2 or ''}
{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
{order.shipping_address.country}

Order Items:
"""
        for item in order.items.all():
            message += f"- {item.product_name} x {item.quantity} @ ${item.price_at_purchase}\n"

        # In development, just log the notification
        logger.info(f"Order notification: {subject}\n{message}")

        # In production, you would send an actual email:
        # send_mail(
        #     subject=subject,
        #     message=message,
        #     from_email=settings.DEFAULT_FROM_EMAIL,
        #     recipient_list=[settings.STORE_OWNER_EMAIL],
        # )

    except Exception as e:
        logger.error(f"Failed to send order notification: {e}")
