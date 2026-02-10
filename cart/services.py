from __future__ import annotations

from decimal import Decimal
from typing import Any, TypedDict

from products.models import Product


class CartItem(TypedDict):
    """Type definition for a cart item."""

    product_id: str
    quantity: int
    name: str
    price: str
    image_url: str | None


class CartService:
    """
    Service class for managing session-based shopping cart.
    """

    CART_SESSION_KEY = "cart"

    def __init__(self, session: dict[str, Any]) -> None:
        self.session = session
        cart = self.session.get(self.CART_SESSION_KEY)
        if not cart:
            cart = {}
            self.session[self.CART_SESSION_KEY] = cart
        self.cart: dict[str, CartItem] = cart

    def _save(self) -> None:
        """Mark session as modified to persist changes."""
        self.session.modified = True

    def add(self, product: Product, quantity: int = 1) -> CartItem:
        """Add a product to cart or update its quantity."""
        product_id = str(product.id)

        if product_id in self.cart:
            self.cart[product_id]["quantity"] += quantity
        else:
            primary_image = product.primary_image
            self.cart[product_id] = CartItem(
                product_id=product_id,
                quantity=quantity,
                name=product.name,
                price=str(product.price),
                image_url=primary_image.image_url if primary_image else None,
            )

        self._save()
        return self.cart[product_id]

    def update_quantity(self, product_id: str, quantity: int) -> CartItem | None:
        """Update the quantity of an item in the cart."""
        if product_id not in self.cart:
            return None

        if quantity <= 0:
            return self.remove(product_id)

        self.cart[product_id]["quantity"] = quantity
        self._save()
        return self.cart[product_id]

    def remove(self, product_id: str) -> CartItem | None:
        """Remove an item from the cart."""
        if product_id in self.cart:
            item = self.cart.pop(product_id)
            self._save()
            return item
        return None

    def clear(self) -> None:
        """Clear all items from the cart."""
        self.cart.clear()
        self._save()

    def get_items(self) -> list[CartItem]:
        """Get all items in the cart."""
        return list(self.cart.values())

    def get_item(self, product_id: str) -> CartItem | None:
        """Get a specific item from the cart."""
        return self.cart.get(product_id)

    @property
    def total_items(self) -> int:
        """Get total number of items in cart."""
        return sum(item["quantity"] for item in self.cart.values())

    @property
    def subtotal(self) -> Decimal:
        """Calculate cart subtotal."""
        return sum(
            Decimal(item["price"]) * item["quantity"]
            for item in self.cart.values()
        )

    def to_dict(self) -> dict[str, Any]:
        """Convert cart to dictionary representation."""
        return {
            "items": self.get_items(),
            "total_items": self.total_items,
            "subtotal": str(self.subtotal),
        }
