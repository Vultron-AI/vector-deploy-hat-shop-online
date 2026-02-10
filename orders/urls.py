from __future__ import annotations

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from orders.views import CheckoutView, OrderViewSet

router = DefaultRouter()
router.register(r"orders", OrderViewSet, basename="order")

urlpatterns = [
    path("orders/checkout/", CheckoutView.as_view(), name="checkout"),
    path("", include(router.urls)),
]
