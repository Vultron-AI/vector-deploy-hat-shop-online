from __future__ import annotations

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from cart.services import CartService
from products.models import Product


class CartView(APIView):
    """
    View for getting and clearing the cart.

    GET /api/cart/ - Get cart contents
    DELETE /api/cart/ - Clear cart
    """

    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        cart = CartService(request.session)
        return Response(cart.to_dict())

    def delete(self, request: Request) -> Response:
        cart = CartService(request.session)
        cart.clear()
        return Response(cart.to_dict())


class CartItemView(APIView):
    """
    View for adding items to cart.

    POST /api/cart/items/ - Add item to cart
    """

    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        product_id = request.data.get("product_id")
        quantity = request.data.get("quantity", 1)

        if not product_id:
            return Response(
                {"error": "product_id is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            quantity = int(quantity)
            if quantity < 1:
                raise ValueError
        except (TypeError, ValueError):
            return Response(
                {"error": "quantity must be a positive integer"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            product = Product.objects.get(id=product_id, is_active=True)
        except Product.DoesNotExist:
            return Response(
                {"error": "Product not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        cart = CartService(request.session)
        item = cart.add(product, quantity)
        return Response(
            {"item": item, "cart": cart.to_dict()},
            status=status.HTTP_201_CREATED,
        )


class CartItemDetailView(APIView):
    """
    View for updating and removing cart items.

    PATCH /api/cart/items/{product_id}/ - Update item quantity
    DELETE /api/cart/items/{product_id}/ - Remove item from cart
    """

    permission_classes = [AllowAny]

    def patch(self, request: Request, product_id: str) -> Response:
        quantity = request.data.get("quantity")

        if quantity is None:
            return Response(
                {"error": "quantity is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            quantity = int(quantity)
        except (TypeError, ValueError):
            return Response(
                {"error": "quantity must be an integer"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cart = CartService(request.session)
        item = cart.update_quantity(product_id, quantity)

        if item is None and quantity > 0:
            return Response(
                {"error": "Item not found in cart"},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response({"item": item, "cart": cart.to_dict()})

    def delete(self, request: Request, product_id: str) -> Response:
        cart = CartService(request.session)
        item = cart.remove(product_id)

        if item is None:
            return Response(
                {"error": "Item not found in cart"},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response({"removed": item, "cart": cart.to_dict()})
