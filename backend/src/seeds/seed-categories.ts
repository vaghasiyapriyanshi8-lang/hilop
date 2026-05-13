import mongoose from 'mongoose';
import { CategoryModel } from '../modules/products/category.model';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hilop';

const categories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices and accessories',
    order: 1,
    isActive: true,
  },
  {
    name: 'Clothing',
    slug: 'clothing',
    description: 'Apparel and fashion items',
    order: 2,
    isActive: true,
  },
  {
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Home and garden related products',
    order: 3,
    isActive: true,
  },
  {
    name: 'Sports',
    slug: 'sports',
    description: 'Sports and outdoor equipment',
    order: 4,
    isActive: true,
  },
  {
    name: 'Watches',
    slug: 'watches',
    description: 'Premium watches and timepieces',
    order: 5,
    isActive: true,
  },
];

// Watch sub-categories
const watchSubcategories = [
  // By Technology
  {
    name: 'Analog Watches',
    slug: 'analog-watches',
    description: 'Traditional watch with hour and minute hands',
    parent: 'watches',
    order: 1,
    isActive: true,
  },
  {
    name: 'Digital Watches',
    slug: 'digital-watches',
    description: 'Time shown in numbers on a screen',
    parent: 'watches',
    order: 2,
    isActive: true,
  },
  {
    name: 'Analog-Digital Watches',
    slug: 'analog-digital-watches',
    description: 'Combination of both analog and digital styles',
    parent: 'watches',
    order: 3,
    isActive: true,
  },
  {
    name: 'Smart Watches',
    slug: 'smart-watches',
    description: 'Connect with phones and provide apps, fitness tracking, etc.',
    parent: 'watches',
    order: 4,
    isActive: true,
  },

  // By Movement
  {
    name: 'Quartz Watches',
    slug: 'quartz-watches',
    description: 'Battery operated, accurate and affordable',
    parent: 'watches',
    order: 5,
    isActive: true,
  },
  {
    name: 'Mechanical Watches',
    slug: 'mechanical-watches',
    description: 'Work using gears and springs',
    parent: 'watches',
    order: 6,
    isActive: true,
  },
  {
    name: 'Automatic Watches',
    slug: 'automatic-watches',
    description: 'Self-winding mechanical watches powered by wrist movement',
    parent: 'watches',
    order: 7,
    isActive: true,
  },

  // By Usage
  {
    name: 'Casual Watches',
    slug: 'casual-watches',
    description: 'Daily wear watches',
    parent: 'watches',
    order: 8,
    isActive: true,
  },
  {
    name: 'Formal/Dress Watches',
    slug: 'formal-dress-watches',
    description: 'Elegant design for functions and office',
    parent: 'watches',
    order: 9,
    isActive: true,
  },
  {
    name: 'Sports Watches',
    slug: 'sports-watches',
    description: 'Durable, water-resistant, fitness features',
    parent: 'watches',
    order: 10,
    isActive: true,
  },
  {
    name: 'Luxury Watches',
    slug: 'luxury-watches',
    description: 'Premium branded watches with high-quality materials',
    parent: 'watches',
    order: 11,
    isActive: true,
  },
  {
    name: 'Diving Watches',
    slug: 'diving-watches',
    description: 'Designed for underwater use',
    parent: 'watches',
    order: 12,
    isActive: true,
  },
  {
    name: 'Military Watches',
    slug: 'military-watches',
    description: 'Rugged and easy to read',
    parent: 'watches',
    order: 13,
    isActive: true,
  },
  {
    name: 'Pilot Watches',
    slug: 'pilot-watches',
    description: 'Large dial and aviation features',
    parent: 'watches',
    order: 14,
    isActive: true,
  },

  // By Gender
  {
    name: "Men's Watches",
    slug: 'mens-watches',
    description: 'Watches designed for men',
    parent: 'watches',
    order: 15,
    isActive: true,
  },
  {
    name: "Women's Watches",
    slug: 'womens-watches',
    description: 'Watches designed for women',
    parent: 'watches',
    order: 16,
    isActive: true,
  },
  {
    name: 'Unisex Watches',
    slug: 'unisex-watches',
    description: 'Watches suitable for all genders',
    parent: 'watches',
    order: 17,
    isActive: true,
  },

  // By Strap Material
  {
    name: 'Leather Strap Watches',
    slug: 'leather-strap-watches',
    description: 'Watches with leather bands',
    parent: 'watches',
    order: 18,
    isActive: true,
  },
  {
    name: 'Metal Strap Watches',
    slug: 'metal-strap-watches',
    description: 'Watches with metal bands',
    parent: 'watches',
    order: 19,
    isActive: true,
  },
  {
    name: 'Rubber/Silicone Strap Watches',
    slug: 'rubber-silicone-strap-watches',
    description: 'Watches with rubber or silicone bands',
    parent: 'watches',
    order: 20,
    isActive: true,
  },
  {
    name: 'Nylon/Fabric Strap Watches',
    slug: 'nylon-fabric-strap-watches',
    description: 'Watches with nylon or fabric bands',
    parent: 'watches',
    order: 21,
    isActive: true,
  },

  // By Display Style
  {
    name: 'Chronograph Watches',
    slug: 'chronograph-watches',
    description: 'Stopwatch feature',
    parent: 'watches',
    order: 22,
    isActive: true,
  },
  {
    name: 'Skeleton Watches',
    slug: 'skeleton-watches',
    description: 'Internal mechanism visible',
    parent: 'watches',
    order: 23,
    isActive: true,
  },
  {
    name: 'Minimalist Watches',
    slug: 'minimalist-watches',
    description: 'Simple clean design',
    parent: 'watches',
    order: 24,
    isActive: true,
  },
  {
    name: 'LED Watches',
    slug: 'led-watches',
    description: 'LED display technology',
    parent: 'watches',
    order: 25,
    isActive: true,
  },
];

async function seedCategories() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing categories
    await CategoryModel.deleteMany({});
    console.log('Cleared existing categories');

    // Insert main categories
    const createdCategories = await CategoryModel.insertMany(categories);
    console.log(`Created ${createdCategories.length} main categories`);

    // Find Watches category to add subcategories
    const watchesCategory = createdCategories.find((cat) => cat.slug === 'watches');

    if (watchesCategory) {
      // Map the watchSubcategories to use the actual watches category ID
      const subcategoriesWithId = watchSubcategories.map((subcat) => ({
        ...subcat,
        parent: watchesCategory._id,
      }));

      const createdSubcategories = await CategoryModel.insertMany(subcategoriesWithId);
      console.log(`Created ${createdSubcategories.length} watch subcategories`);
    }

    console.log('✓ Categories seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();
