/**
 * CategoryCard Component
 *
 * Displays a category with name, description, and product count.
 */

import { Link } from 'react-router-dom'
import { Card } from '@/components/ui'
import type { Category } from '@/services/productsApi'

export interface CategoryCardProps {
  category: Category
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link to={`/category/${category.slug}`} className="block group">
      <Card className="h-full transition-all duration-[var(--motion-normal)] hover:shadow-[var(--shadow-md)] hover:border-[var(--color-border-hover)]">
        <div className="flex flex-col h-full">
          <div className="h-32 bg-gradient-to-br from-[var(--color-accent)]/10 to-[var(--color-accent)]/5 rounded-t-[var(--radius-lg)] flex items-center justify-center">
            <span className="text-4xl">👒</span>
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="text-lg font-semibold text-[var(--color-fg)] group-hover:text-[var(--color-accent)] transition-colors">
              {category.name}
            </h3>
            {category.description && (
              <p className="mt-1 text-sm text-[var(--color-muted)] line-clamp-2">
                {category.description}
              </p>
            )}
            <p className="mt-auto pt-3 text-sm text-[var(--color-muted)]">
              {category.product_count} {category.product_count === 1 ? 'product' : 'products'}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default CategoryCard
