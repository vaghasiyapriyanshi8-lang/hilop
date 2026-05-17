import { Hero } from '@/components/sections/hero'
import { Categories } from '@/components/sections/categories'
import { WhyChooseUs } from '@/components/sections/why-choose-us'
import { NewArrivals } from '@/components/sections/new-arrivals'
import { PromoBanner } from '@/components/sections/promo-banner'
import { Testimonials } from '@/components/sections/testimonials'

export default function HomePage() {
  return (
    <div className="overflow-hidden bg-white">
      <Hero />
      <Categories />
      <WhyChooseUs />
      <NewArrivals />
      <PromoBanner />
      <Testimonials />
    </div>
  )
}
