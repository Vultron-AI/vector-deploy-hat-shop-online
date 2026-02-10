/**
 * Header Component
 *
 * Site header with logo, navigation, and cart icon.
 */

import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui'
import { CartIcon } from '@/components/CartIcon'
import { cn } from '@/lib/utils'

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/category/all', label: 'All Products' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-[var(--color-fg)]"
            data-testid="header-logo"
          >
            <span className="text-2xl">🎩</span>
            <span>Hat Shop</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side - Cart Icon */}
          <div className="flex items-center gap-2">
            <CartIcon />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav
          className={cn(
            'md:hidden border-t border-[var(--color-border)] overflow-hidden transition-all duration-[var(--motion-normal)]',
            mobileMenuOpen ? 'max-h-40 py-4' : 'max-h-0 py-0'
          )}
        >
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-2 py-2 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
