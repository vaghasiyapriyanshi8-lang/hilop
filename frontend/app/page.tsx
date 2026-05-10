import { Hero } from '@/components/sections/hero'
import { FeaturedProducts } from '@/components/sections/featured-products'
import { Categories } from '@/components/sections/categories'
import { NewArrivals } from '@/components/sections/new-arrivals'
import { FlashSale } from '@/components/sections/flash-sale'

export default function HomePage() {
  return (
    <div className="space-y-16">
      <Hero />
      <FeaturedProducts />
      <Categories />
      <NewArrivals />
      <FlashSale />
    </div>
  )
}