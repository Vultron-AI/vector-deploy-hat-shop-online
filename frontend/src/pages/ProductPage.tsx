/**
 * ProductPage Component
 *
 * Displays product details with image gallery and add to cart functionality.
 */

import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, ShoppingCart, Minus, Plus } from 'lucide-react'
import { Button, Badge, PageLoading, EmptyState } from '@/components/ui'
import { ImageGallery } from '@/components/ImageGallery'
import { useCart } from '@/context/CartContext'
import { productsApi, type ProductDetail } from '@/services/productsApi'

export const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return

      try {
        setLoading(true)
        setError(null)
        const productData = await productsApi.getProduct(slug)
        setProduct(productData)
      } catch (err) {
        setError('Product not found')
        console.error('Error fetching product:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(price))
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(prev + delta, product?.stock || 99)))
  }

  const handleAddToCart = async () => {
    if (!product) return

    try {
      setAddingToCart(true)
      await addItem(product.id, quantity)
      setQuantity(1)
    } catch (err) {
      console.error('Error adding to cart:', err)
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return <PageLoading message="Loading product..." />
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <EmptyState
          title="Product Not Found"
          description="The product you're looking for doesn't exist or has been removed."
          action={
            <Button asChild>
              <Link to="/">Back to Home</Link>
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          to={`/category/${product.category.slug}`}
          className="inline-flex items-center text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to {product.category.name}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12" data-testid="product-detail">
          {/* Image Gallery */}
          <div>
            <ImageGallery images={product.images} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-[var(--color-muted)] mb-2">
                {product.category.name}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-fg)]">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-[var(--color-accent)]">
                {formatPrice(product.price)}
              </span>
              {product.in_stock ? (
                <Badge variant="success">In Stock</Badge>
              ) : (
                <Badge variant="error">Out of Stock</Badge>
              )}
            </div>

            {product.description && (
              <div className="prose prose-sm max-w-none">
                <p className="text-[var(--color-muted)] whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            {/* Quantity Selector */}
            {product.in_stock && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-fg)] mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center text-lg font-medium">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-[var(--color-muted)] ml-2">
                      {product.stock} available
                    </span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </Button>
              </div>
            )}

            {!product.in_stock && (
              <Button size="lg" className="w-full" disabled>
                Out of Stock
              </Button>
            )}

            {/* Product Details */}
            <div className="pt-6 border-t border-[var(--color-border)]">
              <h3 className="text-sm font-medium text-[var(--color-fg)] mb-3">
                Product Details
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[var(--color-muted)]">Category</dt>
                  <dd className="text-[var(--color-fg)]">{product.category.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--color-muted)]">Stock</dt>
                  <dd className="text-[var(--color-fg)]">{product.stock} units</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage
