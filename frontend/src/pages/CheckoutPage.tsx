/**
 * CheckoutPage Component
 *
 * Checkout form with shipping details and order summary.
 */

import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { Button, Card, Input, EmptyState, PageLoading } from '@/components/ui'
import { useCart } from '@/context/CartContext'
import { ordersApi, type CheckoutData } from '@/services/ordersApi'

interface FormErrors {
  [key: string]: string
}

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate()
  const { cart, loading: cartLoading, refreshCart } = useCart()
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<CheckoutData>({
    email: '',
    name: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'United States',
  })

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(price))
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.name) {
      newErrors.name = 'Name is required'
    }

    if (!formData.address_line_1) {
      newErrors.address_line_1 = 'Address is required'
    }

    if (!formData.city) {
      newErrors.city = 'City is required'
    }

    if (!formData.state) {
      newErrors.state = 'State is required'
    }

    if (!formData.postal_code) {
      newErrors.postal_code = 'Postal code is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setSubmitting(true)
      const order = await ordersApi.checkout(formData)
      await refreshCart()
      navigate(`/order/${order.id}`)
    } catch (err) {
      console.error('Checkout error:', err)
      setErrors({ submit: 'Failed to process order. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (cartLoading) {
    return <PageLoading message="Loading checkout..." />
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <EmptyState
          title="Your cart is empty"
          description="Add items to your cart before checking out."
          action={
            <Button asChild>
              <Link to="/category/all">Browse Products</Link>
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/cart"
          className="inline-flex items-center text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Cart
        </Link>

        <h1 className="text-3xl font-bold text-[var(--color-fg)] mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" data-testid="checkout-form">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Contact Information */}
              <Card className="mb-6">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-[var(--color-fg)] mb-4">
                    Contact Information
                  </h2>
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                  />
                </div>
              </Card>

              {/* Shipping Address */}
              <Card className="mb-6">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-[var(--color-fg)] mb-4">
                    Shipping Address
                  </h2>
                  <div className="space-y-4">
                    <Input
                      label="Full Name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      error={errors.name}
                    />
                    <Input
                      label="Address"
                      name="address_line_1"
                      placeholder="123 Main St"
                      value={formData.address_line_1}
                      onChange={handleChange}
                      error={errors.address_line_1}
                    />
                    <Input
                      label="Apartment, suite, etc. (optional)"
                      name="address_line_2"
                      placeholder="Apt 4B"
                      value={formData.address_line_2 || ''}
                      onChange={handleChange}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="City"
                        name="city"
                        placeholder="New York"
                        value={formData.city}
                        onChange={handleChange}
                        error={errors.city}
                      />
                      <Input
                        label="State"
                        name="state"
                        placeholder="NY"
                        value={formData.state}
                        onChange={handleChange}
                        error={errors.state}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Postal Code"
                        name="postal_code"
                        placeholder="10001"
                        value={formData.postal_code}
                        onChange={handleChange}
                        error={errors.postal_code}
                      />
                      <Input
                        label="Country"
                        name="country"
                        placeholder="United States"
                        value={formData.country || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Payment Placeholder */}
              <Card className="mb-6">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-[var(--color-fg)] mb-4">
                    Payment
                  </h2>
                  <div className="bg-[var(--color-bg)] rounded-[var(--radius-md)] p-4 text-center text-[var(--color-muted)]">
                    <p>Payment integration coming soon</p>
                    <p className="text-sm mt-1">Orders will be created with pending status</p>
                  </div>
                </div>
              </Card>

              {errors.submit && (
                <p className="text-[var(--color-error)] text-sm mb-4">{errors.submit}</p>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={submitting}
              >
                {submitting ? 'Processing...' : 'Place Order'}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-[var(--color-fg)] mb-4">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-4">
                  {cart.items.map((item) => (
                    <div key={item.product_id} className="flex gap-3">
                      <div className="w-16 h-16 flex-shrink-0 bg-[var(--color-bg)] rounded-[var(--radius-sm)] overflow-hidden">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-xl">🎩</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--color-fg)] truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-[var(--color-muted)]">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-medium text-[var(--color-fg)]">
                          {formatPrice((parseFloat(item.price) * item.quantity).toString())}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[var(--color-border)] pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-muted)]">Subtotal</span>
                    <span className="text-[var(--color-fg)]">{formatPrice(cart.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-muted)]">Shipping</span>
                    <span className="text-[var(--color-fg)]">Free</span>
                  </div>
                </div>

                <div className="border-t border-[var(--color-border)] mt-4 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-[var(--color-accent)]">
                      {formatPrice(cart.subtotal)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
