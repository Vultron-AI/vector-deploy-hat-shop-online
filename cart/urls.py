from __future__ import annotations

from django.urls import path

from cart.views import CartItemDetailView, CartItemView, CartView

urlpatterns = [
    path("cart/", CartView.as_view(), name="cart"),
    path("cart/items/", CartItemView.as_view(), name="cart-items"),
    path("cart/items/<str:product_id>/", CartItemDetailView.as_view(), name="cart-item-detail"),
]
