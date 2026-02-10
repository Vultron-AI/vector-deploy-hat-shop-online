/**
 * CartPage Component
 *
 * Shopping cart page with item list, quantity controls, and checkout button.
 */

import { Link } from 'react-router-dom'
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react'
import { Button, Card, EmptyState, PageLoading } from '@/components/ui'
import { useCart } from '@/context/CartContext'

export const CartPage: React.FC = () => {
  const { cart, loading, updateItem, removeItem, clearCart } = useCart()

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(price))
  }

  const handleQuantityChange = async (productId: string, currentQuantity: number, delta: number) => {
    const newQuantity = currentQuantity + delta
    if (newQuantity < 1) {
      await removeItem(productId)
    } else {
      await updateItem(productId, newQuantity)
    }
  }

  if (loading) {
    return <PageLoading message="Loading cart..." />
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <EmptyState
          icon={<ShoppingCart />}
          title="Your cart is empty"
          description="Looks like you haven't added any items to your cart yet."
          action={
            <Button asChild>
              <Link to="/category/all">Start Shopping</Link>
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-fg)]">Shopping Cart</h1>
          <Button variant="ghost" onClick={clearCart}>
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" data-testid="cart-content">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <Card key={item.product_id} className="p-4">
                <div className="flex gap-4">
                  {/* Item Image */}
                  <div className="w-24 h-24 flex-shrink-0 bg-[var(--color-bg)] rounded-[var(--radius-md)] overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-3xl">🎩</span>
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--color-fg)] truncate">
                      {item.name}
                    </h3>
                    <p className="text-[var(--color-accent)] font-bold mt-1">
                      {formatPrice(item.price)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.product_id, item.quantity, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.product_id, item.quantity, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto text-[var(--color-error)]"
                        onClick={() => removeItem(item.product_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Item Subtotal */}
                  <div className="text-right">
                    <p className="font-bold text-[var(--color-fg)]">
                      {formatPrice((parseFloat(item.price) * item.quantity).toString())}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-[var(--color-fg)] mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-muted)]">Items ({cart.total_items})</span>
                    <span className="text-[var(--color-fg)]">{formatPrice(cart.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-muted)]">Shipping</span>
                    <span className="text-[var(--color-fg)]">Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t border-[var(--color-border)] mt-4 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Subtotal</span>
                    <span className="text-[var(--color-accent)]">
                      {formatPrice(cart.subtotal)}
                    </span>
                  </div>
                </div>

                <Button asChild className="w-full mt-6" size="lg">
                  <Link to="/checkout">Proceed to Checkout</Link>
                </Button>

                <p className="text-xs text-center text-[var(--color-muted)] mt-4">
                  Taxes and shipping calculated at checkout
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
