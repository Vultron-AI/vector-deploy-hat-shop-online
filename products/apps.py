from __future__ import annotations

from django.apps import AppConfig


class ProductsConfig(AppConfig):
    """Products app configuration."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "products"
