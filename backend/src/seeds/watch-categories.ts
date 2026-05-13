import { CategoryModel } from '../modules/products/category.model';

const WATCH_CATEGORIES = [
  // By Technology
  {
    name: 'Analog Watches',
    slug: 'analog-watches',
    description: 'Traditional watch with hour and minute hands',
    order: 1,
    isActive: true,
  },
  {
    name: 'Digital Watches',
    slug: 'digital-watches',
    description: 'Time shown in numbers on a screen',
    order: 2,
    isActive: true,
  },
  {
    name: 'Analog-Digital Watches',
    slug: 'analog-digital-watches',
    description: 'Combination of both analog and digital styles',
    order: 3,
    isActive: true,
  },
  {
    name: 'Smart Watches',
    slug: 'smart-watches',
    description: 'Connect with phones and provide apps, fitness tracking, etc.',
    order: 4,
    isActive: true,
  },

  // By Movement
  {
    name: 'Quartz Watches',
    slug: 'quartz-watches',
    description: 'Battery operated, accurate and affordable',
    order: 5,
    isActive: true,
  },
  {
    name: 'Mechanical Watches',
    slug: 'mechanical-watches',
    description: 'Work using gears and springs',
    order: 6,
    isActive: true,
  },
  {
    name: 'Automatic Watches',
    slug: 'automatic-watches',
    description: 'Self-winding mechanical watches powered by wrist movement',
    order: 7,
    isActive: true,
  },

  // By Usage
  {
    name: 'Casual Watches',
    slug: 'casual-watches',
    description: 'Daily wear watches',
    order: 8,
    isActive: true,
  },
  {
    name: 'Formal/Dress Watches',
    slug: 'formal-dress-watches',
    description: 'Elegant design for functions and office',
    order: 9,
    isActive: true,
  },
  {
    name: 'Sports Watches',
    slug: 'sports-watches',
    description: 'Durable, water-resistant, fitness features',
    order: 10,
    isActive: true,
  },
  {
    name: 'Luxury Watches',
    slug: 'luxury-watches',
    description: 'Premium branded watches with high-quality materials',
    order: 11,
    isActive: true,
  },
  {
    name: 'Diving Watches',
    slug: 'diving-watches',
    description: 'Designed for underwater use',
    order: 12,
    isActive: true,
  },
  {
    name: 'Military Watches',
    slug: 'military-watches',
    description: 'Rugged and easy to read',
    order: 13,
    isActive: true,
  },
  {
    name: 'Pilot Watches',
    slug: 'pilot-watches',
    description: 'Large dial and aviation features',
    order: 14,
    isActive: true,
  },

  // By Gender
  {
    name: "Men's Watches",
    slug: 'mens-watches',
    description: 'Watches designed for men',
    order: 15,
    isActive: true,
  },
  {
    name: "Women's Watches",
    slug: 'womens-watches',
    description: 'Watches designed for women',
    order: 16,
    isActive: true,
  },
  {
    name: 'Unisex Watches',
    slug: 'unisex-watches',
    description: 'Watches suitable for all genders',
    order: 17,
    isActive: true,
  },

  // By Strap Material
  {
    name: 'Leather Strap Watches',
    slug: 'leather-strap-watches',
    description: 'Watches with leather bands',
    order: 18,
    isActive: true,
  },
  {
    name: 'Metal Strap Watches',
    slug: 'metal-strap-watches',
    description: 'Watches with metal bands',
    order: 19,
    isActive: true,
  },
  {
    name: 'Rubber/Silicone Strap Watches',
    slug: 'rubber-silicone-strap-watches',
    description: 'Watches with rubber or silicone bands',
    order: 20,
    isActive: true,
  },
  {
    name: 'Nylon/Fabric Strap Watches',
    slug: 'nylon-fabric-strap-watches',
    description: 'Watches with nylon or fabric bands',
    order: 21,
    isActive: true,
  },

  // By Display Style
  {
    name: 'Chronograph Watches',
    slug: 'chronograph-watches',
    description: 'Stopwatch feature',
    order: 22,
    isActive: true,
  },
  {
    name: 'Skeleton Watches',
    slug: 'skeleton-watches',
    description: 'Internal mechanism visible',
    order: 23,
    isActive: true,
  },
  {
    name: 'Minimalist Watches',
    slug: 'minimalist-watches',
    description: 'Simple clean design',
    order: 24,
    isActive: true,
  },
  {
    name: 'LED Watches',
    slug: 'led-watches',
    description: 'LED display technology',
    order: 25,
    isActive: true,
  },
];

export async function seedWatchCategories() {
  try {
    // Check if categories already exist
    const existingCount = await CategoryModel.countDocuments();

    if (existingCount === 0) {
      await CategoryModel.insertMany(WATCH_CATEGORIES);
      console.log(`✓ Seeded ${WATCH_CATEGORIES.length} watch categories`);
    } else {
      console.log('✓ Categories already exist, skipping seed');
    }
  } catch (error) {
    console.error('Error seeding watch categories:', error);
  }
}
