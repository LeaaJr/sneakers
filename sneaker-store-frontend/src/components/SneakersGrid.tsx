import React from 'react'
import { Card } from './Cards'


interface Sneaker {
  id: string
  title: string
  description?: string
  imageUrl: string
  price: number
  brand: string
  size?: string
  isNew?: boolean
}
interface SneakersGridProps {
  sneakers: Sneaker[]
}
export function SneakersGrid({ sneakers }: SneakersGridProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sneakers.map((sneaker) => (
          <Card
            key={sneaker.id}
            id={sneaker.id}
            title={sneaker.title}
            description={sneaker.description}
            imageUrl={sneaker.imageUrl}
            price={sneaker.price}
            brand={sneaker.brand}
            size={sneaker.size}
            isNew={sneaker.isNew}
          />
        ))}
      </div>
    </div>
  )
}
