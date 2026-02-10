/**
 * ImageGallery Component
 *
 * Displays a product image gallery with thumbnail navigation.
 */

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { ProductImage } from '@/services/productsApi'

export interface ImageGalleryProps {
  images: ProductImage[]
  productName: string
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, productName }) => {
  // Sort images: primary first, then by display order
  const sortedImages = [...images].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1
    if (!a.is_primary && b.is_primary) return 1
    return a.display_order - b.display_order
  })

  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedImage = sortedImages[selectedIndex]

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-[var(--color-bg)] rounded-[var(--radius-lg)] flex items-center justify-center">
        <span className="text-8xl">🎩</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square bg-[var(--color-bg)] rounded-[var(--radius-lg)] overflow-hidden">
        <img
          src={selectedImage.image_url}
          alt={`${productName} - Image ${selectedIndex + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      {sortedImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {sortedImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'flex-shrink-0 w-20 h-20 rounded-[var(--radius-md)] overflow-hidden border-2 transition-all',
                index === selectedIndex
                  ? 'border-[var(--color-accent)] ring-2 ring-[var(--color-focus-ring)]'
                  : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
              )}
            >
              <img
                src={image.image_url}
                alt={`${productName} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageGallery
