from __future__ import annotations

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from products.admin_views import ProductImportView
from products.views import CategoryViewSet, ProductViewSet

router = DefaultRouter()
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"products", ProductViewSet, basename="product")

urlpatterns = [
    path("", include(router.urls)),
    path("admin/products/import/", ProductImportView.as_view(), name="product-import"),
]
