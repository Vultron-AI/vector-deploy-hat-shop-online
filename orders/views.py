from __future__ import annotations

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from cart.services import CartService
from orders.models import Order
from orders.serializers import (
    CheckoutSerializer,
    OrderListSerializer,
    OrderSerializer,
)
from orders.services import create_order_from_cart


class CheckoutView(APIView):
    """
    View for checkout process.

    POST /api/orders/checkout/ - Create order from cart
    """

    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        serializer = CheckoutSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        cart = CartService(request.session)

        if not cart.get_items():
            return Response(
                {"error": "Cart is empty"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = serializer.validated_data
        user = request.user if request.user.is_authenticated else None

        try:
            order = create_order_from_cart(
                cart=cart,
                email=data["email"],
                shipping_data={
                    "name": data["name"],
                    "address_line_1": data["address_line_1"],
                    "address_line_2": data.get("address_line_2", ""),
                    "city": data["city"],
                    "state": data["state"],
                    "postal_code": data["postal_code"],
                    "country": data.get("country", "United States"),
                },
                user=user,
            )
        except ValueError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_201_CREATED,
        )


class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for listing and retrieving orders.

    list: GET /api/orders/ - List user's orders (authenticated)
    retrieve: GET /api/orders/{id}/ - Get order details
    """

    serializer_class = OrderSerializer
    permission_classes = [AllowAny]  # Allow anonymous order lookup by ID

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Order.objects.filter(user=self.request.user).prefetch_related(
                "items", "shipping_address"
            )
        return Order.objects.none()

    def get_serializer_class(self):
        if self.action == "list":
            return OrderListSerializer
        return OrderSerializer

    def retrieve(self, request: Request, *args, **kwargs) -> Response:
        # Allow anonymous users to retrieve their order by ID
        try:
            order = Order.objects.prefetch_related(
                "items", "shipping_address"
            ).get(pk=kwargs.get("pk"))
            return Response(OrderSerializer(order).data)
        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
