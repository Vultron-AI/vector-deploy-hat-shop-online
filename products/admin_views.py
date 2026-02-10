from __future__ import annotations

import csv
import io
from decimal import Decimal, InvalidOperation
from typing import Any

from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAdminUser
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from products.models import Category, Product, ProductImage


class ProductImportView(APIView):
    """
    Admin endpoint for importing products from CSV.

    POST /api/admin/products/import/

    CSV columns:
    - name: Product name (required)
    - description: Product description
    - price: Product price (required)
    - category: Category name (will be created if doesn't exist)
    - stock: Stock quantity (default 0)
    - image_urls: Comma-separated list of image URLs
    """

    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAdminUser]

    def post(self, request: Request) -> Response:
        csv_file = request.FILES.get("file")

        if not csv_file:
            return Response(
                {"error": "No file provided"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not csv_file.name.endswith(".csv"):
            return Response(
                {"error": "File must be a CSV file"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            decoded_file = csv_file.read().decode("utf-8")
            reader = csv.DictReader(io.StringIO(decoded_file))
        except Exception as e:
            return Response(
                {"error": f"Failed to read CSV file: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        results = {
            "created": 0,
            "updated": 0,
            "errors": [],
        }

        for row_num, row in enumerate(reader, start=2):  # Start at 2 (header is row 1)
            result = self._process_row(row, row_num)
            if result.get("error"):
                results["errors"].append(result["error"])
            elif result.get("created"):
                results["created"] += 1
            elif result.get("updated"):
                results["updated"] += 1

        return Response(results)

    def _process_row(self, row: dict[str, Any], row_num: int) -> dict[str, Any]:
        """Process a single CSV row."""
        # Validate required fields
        name = row.get("name", "").strip()
        if not name:
            return {"error": f"Row {row_num}: Missing required field 'name'"}

        price_str = row.get("price", "").strip()
        if not price_str:
            return {"error": f"Row {row_num}: Missing required field 'price'"}

        try:
            price = Decimal(price_str)
            if price < 0:
                raise InvalidOperation
        except InvalidOperation:
            return {"error": f"Row {row_num}: Invalid price value '{price_str}'"}

        # Get or create category
        category_name = row.get("category", "").strip() or "Uncategorized"
        category, _ = Category.objects.get_or_create(
            name=category_name,
            defaults={"description": ""},
        )

        # Parse stock
        stock_str = row.get("stock", "0").strip()
        try:
            stock = int(stock_str) if stock_str else 0
            if stock < 0:
                stock = 0
        except ValueError:
            stock = 0

        # Create or update product
        product, created = Product.objects.update_or_create(
            name=name,
            defaults={
                "description": row.get("description", "").strip(),
                "price": price,
                "category": category,
                "stock": stock,
            },
        )

        # Process images
        image_urls = row.get("image_urls", "").strip()
        if image_urls:
            # Clear existing images if updating
            if not created:
                product.images.all().delete()

            # Create new images
            urls = [url.strip() for url in image_urls.split(",") if url.strip()]
            for i, url in enumerate(urls):
                ProductImage.objects.create(
                    product=product,
                    image_url=url,
                    display_order=i,
                    is_primary=(i == 0),
                )

        return {"created": created, "updated": not created}
