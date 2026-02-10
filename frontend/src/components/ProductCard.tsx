/**
 * ProductCard Component
 *
 * Displays a product with image, name, price, and stock status.
 */

import { Link } from 'react-router-dom'
import { Card, Badge } from '@/components/ui'
import type { Product } from '@/services/productsApi'

export interface ProductCardProps {
  product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(price))
  }

  return (
    <Link to={`/product/${product.slug}`} className="block group">
      <Card className="h-full transition-all duration-[var(--motion-normal)] hover:shadow-[var(--shadow-md)] hover:border-[var(--color-border-hover)] overflow-hidden">
        <div className="aspect-square bg-[var(--color-bg)] relative">
          {product.primary_image ? (
            <img
              src={product.primary_image.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[var(--motion-normal)]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl">🎩</span>
            </div>
          )}
          {!product.in_stock && (
            <div className="absolute top-2 right-2">
              <Badge variant="error">Out of Stock</Badge>
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="text-xs text-[var(--color-muted)] mb-1">
            {product.category.name}
          </p>
          <h3 className="font-semibold text-[var(--color-fg)] group-hover:text-[var(--color-accent)] transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="mt-2 text-lg font-bold text-[var(--color-accent)]">
            {formatPrice(product.price)}
          </p>
        </div>
      </Card>
    </Link>
  )
}

export default ProductCard
