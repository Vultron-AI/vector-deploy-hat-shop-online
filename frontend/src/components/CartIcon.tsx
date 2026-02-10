/**
 * CartIcon Component
 *
 * Shopping cart icon with item count badge.
 */

import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export const CartIcon: React.FC = () => {
  const { cart, loading } = useCart()
  const itemCount = cart?.total_items || 0

  return (
    <Link
      to="/cart"
      className="relative p-2 text-[var(--color-fg)] hover:text-[var(--color-accent)] transition-colors"
      aria-label={`Shopping cart with ${itemCount} items`}
      data-testid="cart-icon"
    >
      <ShoppingCart className="h-6 w-6" />
      {!loading && itemCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center px-1.5 text-xs font-bold text-white bg-[var(--color-accent)] rounded-full">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  )
}

export default CartIcon
