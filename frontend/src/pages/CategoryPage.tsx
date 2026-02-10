/**
 * CategoryPage Component
 *
 * Displays products in a category with grid layout.
 */

import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { Button, SkeletonCard, EmptyState } from '@/components/ui'
import { ProductCard } from '@/components/ProductCard'
import { productsApi, type Product, type Category } from '@/services/productsApi'

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch category details if not "all"
        if (slug && slug !== 'all') {
          const categoryData = await productsApi.getCategory(slug)
          setCategory(categoryData)
        } else {
          setCategory(null)
        }

        // Fetch products
        const productsData = await productsApi.listProducts({
          category: slug === 'all' ? undefined : slug,
          page: 1,
        })

        setProducts(productsData.results)
        setTotalCount(productsData.count)
        setHasMore(productsData.next !== null)
        setPage(1)
      } catch (err) {
        setError('Failed to load products. Please try again.')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug])

  const loadMore = async () => {
    try {
      const nextPage = page + 1
      const productsData = await productsApi.listProducts({
        category: slug === 'all' ? undefined : slug,
        page: nextPage,
      })

      setProducts((prev) => [...prev, ...productsData.results])
      setHasMore(productsData.next !== null)
      setPage(nextPage)
    } catch (err) {
      console.error('Error loading more products:', err)
    }
  }

  const title = slug === 'all' ? 'All Products' : category?.name || 'Products'
  const description = slug === 'all' ? 'Browse our complete collection' : category?.description

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        <div className="container mx-auto px-4 py-8">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-fg)]">{title}</h1>
          {description && (
            <p className="mt-2 text-[var(--color-muted)] max-w-2xl">{description}</p>
          )}
          {!loading && (
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              {totalCount} {totalCount === 1 ? 'product' : 'products'}
            </p>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8" data-testid="products-grid">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <EmptyState
            title="Error Loading Products"
            description={error}
            action={<Button onClick={() => window.location.reload()}>Try Again</Button>}
          />
        ) : products.length === 0 ? (
          <EmptyState
            title="No Products Found"
            description="This category doesn't have any products yet."
            action={
              <Button asChild>
                <Link to="/">Back to Home</Link>
              </Button>
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-12 text-center">
                <Button variant="outline" onClick={loadMore}>
                  Load More Products
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default CategoryPage
