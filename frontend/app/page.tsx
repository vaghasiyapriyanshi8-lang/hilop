import { Hero } from '@/components/sections/hero'
import { FeaturedProducts } from '@/components/sections/featured-products'
import { Categories } from '@/components/sections/categories'
import { NewArrivals } from '@/components/sections/new-arrivals'
import { FlashSale } from '@/components/sections/flash-sale'
import { Testimonials } from '@/components/sections/testimonials'
import { RecentActivity } from '@/components/sections/recent-activity'
import { TrustBadges } from '@/components/sections/trust-badges'

export default function HomePage() {
  return (
    <div className="overflow-hidden bg-white">
      <Hero />
      <TrustBadges />
      
      <FeaturedProducts />
      <Categories />
      <NewArrivals />
      <FlashSale />
      <Testimonials />
      <RecentActivity />
    </div>
  )
}
