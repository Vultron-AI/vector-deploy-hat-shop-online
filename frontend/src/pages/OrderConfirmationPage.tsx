/**
 * OrderConfirmationPage Component
 *
 * Displays order confirmation details after successful checkout.
 */

import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { Button, Card, Badge, PageLoading, EmptyState } from '@/components/ui'
import { ordersApi, type Order } from '@/services/ordersApi'

const statusColors: Record<Order['status'], 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  pending: 'warning',
  paid: 'success',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'error',
}

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return

      try {
        setLoading(true)
        const orderData = await ordersApi.getOrder(orderId)
        setOrder(orderData)
      } catch (err) {
        setError('Order not found')
        console.error('Error fetching order:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(price))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return <PageLoading message="Loading order..." />
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-12">
        <EmptyState
          title="Order Not Found"
          description="We couldn't find this order. Please check your order ID."
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
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="container mx-auto px-4 py-8">
        {/* Success Message */}
        <div className="text-center mb-8" data-testid="order-confirmation">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-fg)] mb-2">
            Order Confirmed!
          </h1>
          <p className="text-[var(--color-muted)]">
            Thank you for your order. We'll send you updates via email.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Order Details */}
          <Card className="mb-6">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[var(--color-fg)]">
                  Order Details
                </h2>
                <Badge variant={statusColors[order.status]}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>

              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[var(--color-muted)]">Order ID</dt>
                  <dd className="text-[var(--color-fg)] font-mono">{order.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--color-muted)]">Date</dt>
                  <dd className="text-[var(--color-fg)]">{formatDate(order.created_at)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--color-muted)]">Email</dt>
                  <dd className="text-[var(--color-fg)]">{order.email}</dd>
                </div>
              </dl>
            </div>
          </Card>

          {/* Shipping Address */}
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-[var(--color-fg)] mb-4">
                Shipping Address
              </h2>
              <address className="not-italic text-sm text-[var(--color-fg)]">
                <p>{order.shipping_address.name}</p>
                <p>{order.shipping_address.address_line_1}</p>
                {order.shipping_address.address_line_2 && (
                  <p>{order.shipping_address.address_line_2}</p>
                )}
                <p>
                  {order.shipping_address.city}, {order.shipping_address.state}{' '}
                  {order.shipping_address.postal_code}
                </p>
                <p>{order.shipping_address.country}</p>
              </address>
            </div>
          </Card>

          {/* Order Items */}
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-[var(--color-fg)] mb-4">
                Items Ordered
              </h2>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-[var(--color-fg)]">
                        {item.product_name}
                      </p>
                      <p className="text-sm text-[var(--color-muted)]">
                        Qty: {item.quantity} × {formatPrice(item.price_at_purchase)}
                      </p>
                    </div>
                    <p className="font-medium text-[var(--color-fg)]">
                      {formatPrice(item.subtotal)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-[var(--color-border)] mt-4 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[var(--color-accent)]">
                    {formatPrice(order.total_price)}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmationPage
