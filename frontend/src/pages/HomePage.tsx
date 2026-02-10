/**
 * HomePage Component
 *
 * Landing page with hero section and category grid.
 */

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, SkeletonCard, EmptyState } from '@/components/ui'
import { CategoryCard } from '@/components/CategoryCard'
import { ProductCard } from '@/components/ProductCard'
import { productsApi, type Category, type Product } from '@/services/productsApi'
import { ShoppingBag } from 'lucide-react'

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [categoriesData, productsData] = await Promise.all([
          productsApi.listCategories(),
          productsApi.listProducts({ page: 1 }),
        ])
        setCategories(categoriesData)
        setFeaturedProducts(productsData.results.slice(0, 4))
      } catch (err) {
        setError('Failed to load data. Please try again.')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="bg-gradient-to-br from-[var(--color-accent)]/10 via-[var(--color-bg)] to-[var(--color-bg)] py-16 md:py-24"
        data-testid="hero-section"
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-fg)] mb-4">
            Find Your Perfect <span className="text-[var(--color-accent)]">Hat</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-muted)] max-w-2xl mx-auto mb-8">
            Discover our curated collection of premium hats for every style and occasion.
            From classic fedoras to modern caps, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/category/all">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Now
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="#categories">Browse Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-12 md:py-16" data-testid="categories-section">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-fg)]">
                Shop by Category
              </h2>
              <p className="mt-2 text-[var(--color-muted)]">
                Find the perfect hat for any occasion
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : error ? (
            <EmptyState
              title="Error Loading Categories"
              description={error}
              action={<Button onClick={() => window.location.reload()}>Try Again</Button>}
            />
          ) : categories.length === 0 ? (
            <EmptyState
              title="No Categories Yet"
              description="Check back soon for our hat categories!"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 md:py-16 bg-[var(--color-surface)]" data-testid="featured-section">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-fg)]">
                Featured Products
              </h2>
              <p className="mt-2 text-[var(--color-muted)]">
                Our most popular selections
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/category/all">View All</Link>
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <EmptyState
              title="No Products Yet"
              description="Check back soon for our hat collection!"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-[var(--color-accent)]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find Your Style?
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
            Join thousands of satisfied customers who've found their perfect hat with us.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/category/all">Start Shopping</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

export default HomePage
