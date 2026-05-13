'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Search, Loader } from 'lucide-react';
import { categoryService, type Category } from '@/services/categoryService';
import { toast } from 'sonner';

// Predefined watch categories
const WATCH_CATEGORIES = [
  // By Technology
  { name: 'Analog Watches', description: 'Traditional watch with hour and minute hands' },
  { name: 'Digital Watches', description: 'Time shown in numbers on a screen' },
  { name: 'Analog-Digital Watches', description: 'Combination of both analog and digital styles' },
  { name: 'Smart Watches', description: 'Connect with phones and provide apps, fitness tracking, etc.' },

  // By Movement
  { name: 'Quartz Watches', description: 'Battery operated, accurate and affordable' },
  { name: 'Mechanical Watches', description: 'Work using gears and springs' },
  { name: 'Automatic Watches', description: 'Self-winding mechanical watches powered by wrist movement' },

  // By Usage
  { name: 'Casual Watches', description: 'Daily wear watches' },
  { name: 'Formal/Dress Watches', description: 'Elegant design for functions and office' },
  { name: 'Sports Watches', description: 'Durable, water-resistant, fitness features' },
  { name: 'Luxury Watches', description: 'Premium branded watches with high-quality materials' },
  { name: 'Diving Watches', description: 'Designed for underwater use' },
  { name: 'Military Watches', description: 'Rugged and easy to read' },
  { name: 'Pilot Watches', description: 'Large dial and aviation features' },

  // By Gender
  { name: "Men's Watches", description: 'Watches designed for men' },
  { name: "Women's Watches", description: 'Watches designed for women' },
  { name: 'Unisex Watches', description: 'Watches suitable for all genders' },

  // By Strap Material
  { name: 'Leather Strap Watches', description: 'Watches with leather bands' },
  { name: 'Metal Strap Watches', description: 'Watches with metal bands' },
  { name: 'Rubber/Silicone Strap Watches', description: 'Watches with rubber or silicone bands' },
  { name: 'Nylon/Fabric Strap Watches', description: 'Watches with nylon or fabric bands' },

  // By Display Style
  { name: 'Chronograph Watches', description: 'Stopwatch feature' },
  { name: 'Skeleton Watches', description: 'Internal mechanism visible' },
  { name: 'Minimalist Watches', description: 'Simple clean design' },
  { name: 'LED Watches', description: 'LED display technology' },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState({ name: '', description: '' });
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await categoryService.getCategories();
      // Extract the categories array from the nested response structure
      const categoriesData = Array.isArray(response.data) ? response.data : response.data?.data || [];
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = async () => {
    if (newCategory.name.trim()) {
      try {
        setIsSaving(true);
        await categoryService.createCategory({
          name: newCategory.name,
          description: newCategory.description,
        });
        toast.success('Category created successfully');
        setNewCategory({ name: '', description: '' });
        setIsAddingNew(false);
        await fetchCategories(); // Refresh the list
      } catch (error) {
        console.error('Error creating category:', error);
        toast.error('Failed to create category');
      } finally {
        setIsSaving(false);
      }
    } else {
      toast.error('Please enter a category name');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        setIsDeleting(id);
        await categoryService.deleteCategory(id);
        toast.success('Category deleted successfully');
        await fetchCategories(); // Refresh the list
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleStartEdit = (category: Category) => {
    setEditingId(category.id);
    setEditingCategory({
      name: category.name,
      description: category.description,
    });
  };

  const handleUpdateCategory = async () => {
    if (editingCategory.name.trim() && editingId) {
      try {
        setIsUpdating(true);
        await categoryService.updateCategory(editingId, {
          name: editingCategory.name,
          description: editingCategory.description,
        });
        toast.success('Category updated successfully');
        setEditingId(null);
        setEditingCategory({ name: '', description: '' });
        await fetchCategories(); // Refresh the list
      } catch (error) {
        console.error('Error updating category:', error);
        toast.error('Failed to update category');
      } finally {
        setIsUpdating(false);
      }
    } else {
      toast.error('Please enter a category name');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingCategory({ name: '', description: '' });
  };

  return (
    <div className="flex-1 space-y-8">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Product Categories
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your product categories and organize your inventory
          </p>
        </div>
        <button
          onClick={() => setIsAddingNew(!isAddingNew)}
          disabled={isLoading}
          className="mt-4 md:mt-0 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Category
        </button>
      </div>

      {/* Add New Category Form */}
      {isAddingNew && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Add New Category
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Category *
              </label>
              <select
                value={newCategory.name}
                onChange={(e) => {
                  const selected = WATCH_CATEGORIES.find(cat => cat.name === e.target.value);
                  setNewCategory({
                    name: e.target.value,
                    description: selected?.description || '',
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select a watch category --</option>
                <optgroup label="By Technology">
                  <option value="Analog Watches">Analog Watches</option>
                  <option value="Digital Watches">Digital Watches</option>
                  <option value="Analog-Digital Watches">Analog-Digital Watches</option>
                  <option value="Smart Watches">Smart Watches</option>
                </optgroup>
                <optgroup label="By Movement">
                  <option value="Quartz Watches">Quartz Watches</option>
                  <option value="Mechanical Watches">Mechanical Watches</option>
                  <option value="Automatic Watches">Automatic Watches</option>
                </optgroup>
                <optgroup label="By Usage">
                  <option value="Casual Watches">Casual Watches</option>
                  <option value="Formal/Dress Watches">Formal/Dress Watches</option>
                  <option value="Sports Watches">Sports Watches</option>
                  <option value="Luxury Watches">Luxury Watches</option>
                  <option value="Diving Watches">Diving Watches</option>
                  <option value="Military Watches">Military Watches</option>
                  <option value="Pilot Watches">Pilot Watches</option>
                </optgroup>
                <optgroup label="By Gender">
                  <option value="Men's Watches">Men's Watches</option>
                  <option value="Women's Watches">Women's Watches</option>
                  <option value="Unisex Watches">Unisex Watches</option>
                </optgroup>
                <optgroup label="By Strap Material">
                  <option value="Leather Strap Watches">Leather Strap Watches</option>
                  <option value="Metal Strap Watches">Metal Strap Watches</option>
                  <option value="Rubber/Silicone Strap Watches">Rubber/Silicone Strap Watches</option>
                  <option value="Nylon/Fabric Strap Watches">Nylon/Fabric Strap Watches</option>
                </optgroup>
                <optgroup label="By Display Style">
                  <option value="Chronograph Watches">Chronograph Watches</option>
                  <option value="Skeleton Watches">Skeleton Watches</option>
                  <option value="Minimalist Watches">Minimalist Watches</option>
                  <option value="LED Watches">LED Watches</option>
                </optgroup>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, description: e.target.value })
                }
                placeholder="Category description (auto-filled)"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddCategory}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {isSaving && <Loader className="w-4 h-4 animate-spin" />}
                Save Category
              </button>
              <button
                onClick={() => setIsAddingNew(false)}
                disabled={isSaving}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Form */}
      {editingId && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Edit Category
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category Name *
              </label>
              <select
                value={editingCategory.name}
                onChange={(e) => {
                  const selected = WATCH_CATEGORIES.find(cat => cat.name === e.target.value);
                  setEditingCategory({
                    name: e.target.value,
                    description: selected?.description || editingCategory.description,
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select a watch category --</option>
                <optgroup label="By Technology">
                  <option value="Analog Watches">Analog Watches</option>
                  <option value="Digital Watches">Digital Watches</option>
                  <option value="Analog-Digital Watches">Analog-Digital Watches</option>
                  <option value="Smart Watches">Smart Watches</option>
                </optgroup>
                <optgroup label="By Movement">
                  <option value="Quartz Watches">Quartz Watches</option>
                  <option value="Mechanical Watches">Mechanical Watches</option>
                  <option value="Automatic Watches">Automatic Watches</option>
                </optgroup>
                <optgroup label="By Usage">
                  <option value="Casual Watches">Casual Watches</option>
                  <option value="Formal/Dress Watches">Formal/Dress Watches</option>
                  <option value="Sports Watches">Sports Watches</option>
                  <option value="Luxury Watches">Luxury Watches</option>
                  <option value="Diving Watches">Diving Watches</option>
                  <option value="Military Watches">Military Watches</option>
                  <option value="Pilot Watches">Pilot Watches</option>
                </optgroup>
                <optgroup label="By Gender">
                  <option value="Men's Watches">Men's Watches</option>
                  <option value="Women's Watches">Women's Watches</option>
                  <option value="Unisex Watches">Unisex Watches</option>
                </optgroup>
                <optgroup label="By Strap Material">
                  <option value="Leather Strap Watches">Leather Strap Watches</option>
                  <option value="Metal Strap Watches">Metal Strap Watches</option>
                  <option value="Rubber/Silicone Strap Watches">Rubber/Silicone Strap Watches</option>
                  <option value="Nylon/Fabric Strap Watches">Nylon/Fabric Strap Watches</option>
                </optgroup>
                <optgroup label="By Display Style">
                  <option value="Chronograph Watches">Chronograph Watches</option>
                  <option value="Skeleton Watches">Skeleton Watches</option>
                  <option value="Minimalist Watches">Minimalist Watches</option>
                  <option value="LED Watches">LED Watches</option>
                </optgroup>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={editingCategory.description}
                onChange={(e) =>
                  setEditingCategory({ ...editingCategory, description: e.target.value })
                }
                placeholder="Category description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleUpdateCategory}
                disabled={isUpdating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {isUpdating && <Loader className="w-4 h-4 animate-spin" />}
                Update Category
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={isUpdating}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={isLoading}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading categories...</span>
        </div>
      )}

      {/* Categories Grid */}
      {!isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <div
                key={category.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {category.name}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStartEdit(category)}
                      disabled={isUpdating || isDeleting === category.id}
                      className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      disabled={isDeleting === category.id}
                      className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting === category.id ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {category.description}
                </p>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {category.productCount}
                    </span>{' '}
                    products
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No categories found. {searchTerm && 'Try adjusting your search.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
