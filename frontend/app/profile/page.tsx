'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { LogOut, User, ShoppingBag, Heart, Settings } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('profile')

  const handleLogout = () => {
    logout()
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    toast({
      title: 'Success',
      description: 'Logged out successfully',
    })
    router.push('/')
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-gray-600 mb-4">Please log in to view your profile</p>
          <Link href="/login">
            <Button className="bg-hilop-green hover:bg-hilop-green/90">Sign In</Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">My Account</h1>
              <p className="text-gray-600 mt-2">Manage your profile and preferences</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="flex gap-2 mb-8 border-b overflow-x-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition-colors ₹{
                  activeTab === tab.id
                    ? 'border-hilop-green text-hilop-green'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            )
          })}
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'profile' && (
            <Card className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Full Name</label>
                  <Input defaultValue={user.name} disabled />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <Input defaultValue={user.email} disabled />
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Button className="bg-hilop-green hover:bg-hilop-green/90">Update Profile</Button>
                <Button variant="outline">Change Password</Button>
              </div>
            </Card>
          )}

          {activeTab === 'orders' && (
            <Card className="p-8">
              <p className="text-gray-600">No orders yet.</p>
              <Link href="/products" className="mt-4">
                <Button className="bg-hilop-green hover:bg-hilop-green/90">
                  Start Shopping
                </Button>
              </Link>
            </Card>
          )}

          {activeTab === 'wishlist' && (
            <Card className="p-8">
              <p className="text-gray-600">Your wishlist is empty.</p>
              <Link href="/products" className="mt-4">
                <Button className="bg-hilop-green hover:bg-hilop-green/90">
                  Browse Watches
                </Button>
              </Link>
            </Card>
          )}

          {activeTab === 'settings' && (
            <Card className="p-8">
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="font-semibold">Email notifications</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="font-semibold">Marketing emails</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="font-semibold">Order updates</span>
                  </label>
                </div>
              </div>
              <div className="mt-6">
                <Button className="bg-hilop-green hover:bg-hilop-green/90">Save Settings</Button>
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}
