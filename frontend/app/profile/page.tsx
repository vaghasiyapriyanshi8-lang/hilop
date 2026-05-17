'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { LogOut, User, ShoppingBag, Heart, Loader2, MapPin, Plus, Trash2, Edit2, Star } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useWishlistStore } from '@/store/wishlist'
import Image from 'next/image'
import { formatPrice } from '@/utils/format'
import { authService } from '@/services/api/auth'
import { ordersService } from '@/services/api/orders'
import { useEffect } from 'react'
import { useCartStore } from '@/store/cart'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ReviewsDisplay } from '@/components/reviews/reviews-display'

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout, login } = useAuthStore()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('profile')
  const wishlistItems = useWishlistStore((state) => state.items)
  const setCart = useCartStore((s) => s.replaceCart)
  const setWishlist = useWishlistStore((s) => s.replaceWishlist)
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [totalOrders, setTotalOrders] = useState(0)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false)
  const [addressFormData, setAddressFormData] = useState({
    type: 'home' as 'home' | 'work' | 'other',
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    isDefault: false,
  })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })

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

  // Fetch latest user and orders when the profile mounts
  useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      try {
        const userData = await authService.getCurrentUser()
        // sync stores
        useAuthStore.getState().login(userData as any)
        setCart(userData.cartItems || [])
        setWishlist(userData.wishlistItems || [])
        
        if (mounted) {
          setFormData({
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || ''
          })
        }

        setOrdersLoading(true)
        const ordersResp = await ordersService.getOrders({ page: 1, limit: 5 })
        if (!mounted) return
        setRecentOrders(ordersResp.data || [])
        setTotalOrders(ordersResp.pagination?.total || ordersResp.data?.length || 0)
      } catch (err) {
        console.error('Profile fetch error', err)
      } finally {
        if (mounted) setOrdersLoading(false)
      }
    }

    fetchData()
    return () => { mounted = false }
  }, [])

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true)
      const updatedUser = await authService.updateProfile(formData)
      login(updatedUser as any)
      setIsEditing(false)
      toast({
        title: 'Success',
        description: 'Profile updated successfully!',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Failed to update profile',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddAddress = async () => {
    try {
      setIsLoading(true)
      const newAddress = {
        ...addressFormData,
        id: Math.random().toString(36).substr(2, 9),
      }
      
      const updatedAddresses = user?.addresses ? [...user.addresses, newAddress] : [newAddress]
      
      // If this is set as default, unset others
      if (newAddress.isDefault) {
        updatedAddresses.forEach((addr: any) => {
          if (addr.id !== newAddress.id) addr.isDefault = false
        })
      }

      const updatedUser = await authService.updateProfile({ addresses: updatedAddresses })
      login(updatedUser as any)
      setIsAddressDialogOpen(false)
      setAddressFormData({
        type: 'home',
        name: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
        isDefault: false,
      })
      toast({
        title: 'Success',
        description: 'Address added successfully!',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Failed to add address',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    try {
      setIsLoading(true)
      const updatedAddresses = user?.addresses?.filter(addr => addr.id !== addressId) || []
      const updatedUser = await authService.updateProfile({ addresses: updatedAddresses })
      login(updatedUser as any)
      toast({
        title: 'Success',
        description: 'Address deleted successfully!',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to delete address',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
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
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
  ]

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Account</h1>
              <p className="text-gray-600 mt-1">Manage your details, addresses, and orders</p>
            </div>
            {/* header actions removed to avoid duplicate sign-out button; kept in main content */}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar (left) - profile summary + vertical nav */}
          <aside>
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center text-2xl font-bold text-gray-700">
                  {user.avatar ? (
                    <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                  ) : (
                    user.name?.charAt(0).toUpperCase() || <User className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <div className="text-lg font-semibold">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-sm text-gray-500">Orders</div>
                  <div className="font-semibold mt-1">{totalOrders}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Wishlist</div>
                  <div className="font-semibold mt-1">{wishlistItems.length}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Since</div>
                  <div className="font-semibold mt-1">{user.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}</div>
                </div>
              </div>

              {/* Sidebar action buttons removed as requested */}
            </Card>

            {/* duplicate quick links removed to avoid repeated navigation */}
          </aside>

          {/* Main content (right) */}
          <main className="md:col-span-2">
            <motion.div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="mb-2">
                    <h2 className="text-2xl font-semibold">{user.name}</h2>
                    <p className="text-sm text-gray-500">Manage your account settings and preferences</p>
                  </div>
                  <div className="mt-4">
                    <div className="inline-flex rounded-lg bg-gray-50 p-1">
                      {tabs.map((tab) => {
                        const Icon = tab.icon
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                              activeTab === tab.id
                                ? 'bg-white shadow-sm text-hilop-green'
                                : 'text-gray-600 hover:text-gray-800'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
                <div>
                  <Button variant="outline" onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              {activeTab === 'profile' && (
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Profile details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full name</label>
                      <Input 
                        value={isEditing ? formData.name : user.name || ''} 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!isEditing} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <Input 
                        value={isEditing ? formData.email : user.email || ''} 
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!isEditing} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <Input 
                        value={isEditing ? formData.phone : user.phone || ''} 
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!isEditing} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Member since</label>
                      <Input value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''} disabled />
                    </div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    {isEditing ? (
                      <>
                        <Button 
                          onClick={handleUpdateProfile} 
                          className="bg-hilop-green hover:bg-hilop-green/90 text-black font-semibold"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          onClick={() => setIsEditing(true)} 
                          className="bg-hilop-green hover:bg-hilop-green/90 text-black font-semibold"
                        >
                          Edit profile
                        </Button>
                      </>
                    )}
                  </div>
                </Card>
              )}
              {activeTab === 'reviews' && (
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4">My Reviews</h2>
                  <ReviewsDisplay 
                    productId="" 
                    isUserReview={true} 
                    currentUserId={user?._id}
                  />
                </Card>
              )}
              {activeTab === 'orders' && (
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold mb-4">Order history</h2>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={async () => {
                        setOrdersLoading(true)
                        try {
                          const r = await ordersService.getOrders({ page: 1, limit: 5 })
                          setRecentOrders(r.data || [])
                        } catch (e) {
                          console.error(e)
                        } finally { setOrdersLoading(false) }
                      }}>Refresh</Button>
                    </div>
                  </div>

                  {ordersLoading ? (
                    <div className="py-8 text-center">
                      <Loader2 className="mx-auto w-8 h-8 animate-spin text-hilop-green" />
                    </div>
                  ) : recentOrders.length > 0 ? (
                    <div className="space-y-4">
                      {recentOrders.map((order) => {
                        const orderId = order.id || (order as any)._id
                        return (
                          <div key={orderId} className="flex items-center justify-between border rounded-lg p-4">
                            <div>
                              <div className="font-semibold">Order #{orderId}</div>
                              <div className="text-sm text-gray-500">{new Date(order.createdAt || order.date || '').toLocaleString()}</div>
                              <div className="text-sm mt-1">{order.items?.length || 0} item{(order.items?.length || 0) > 1 ? 's' : ''}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">₹{order.total?.toLocaleString() || order.amount}</div>
                              <div className="text-sm text-gray-500 text-capitalize">{order.status}</div>
                              <Link href={`/orders/${orderId}`}>
                                <Button variant="outline" size="sm" className="mt-2">View</Button>
                              </Link>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-600">You have no orders yet. When you place an order, it will appear here with shipment updates and tracking information.</p>
                      <div className="mt-6">
                        <Link href="/products">
                          <Button className="bg-hilop-green hover:bg-hilop-green/90">Shop now</Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </Card>
              )}

              {activeTab === 'wishlist' && (
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Wishlist</h2>
                  {wishlistItems.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {wishlistItems.map((item) => (
                        <div key={item.productId} className="rounded-xl border p-4">
                          <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-gray-100">
                            <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
                          </div>
                          <h3 className="line-clamp-2 font-semibold">{item.productName}</h3>
                          <p className="mt-1 text-sm text-gray-500">{item.productBrand}</p>
                          <p className="mt-2 font-bold text-hilop-green">{formatPrice(item.productPrice)}</p>
                          <div className="mt-4 flex gap-2">
                            <Button asChild variant="outline" className="flex-1">
                              <Link href={`/products/${item.productSlug}`}>View</Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-600">Your wishlist is empty.</p>
                      <div className="mt-4">
                        <Link href="/products">
                          <Button className="bg-hilop-green hover:bg-hilop-green/90">Browse watches</Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </Card>
              )}

              
              {activeTab === 'addresses' && (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Address Book</h2>
                    <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-hilop-green text-black hover:bg-hilop-green/90 font-semibold">
                          <Plus className="w-4 h-4 mr-2" />
                          Add New Address
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Add New Address</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Address Type</Label>
                              <Select 
                                value={addressFormData.type} 
                                onValueChange={(value: any) => setAddressFormData({ ...addressFormData, type: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="home">Home</SelectItem>
                                  <SelectItem value="work">Work</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Full Name</Label>
                              <Input 
                                placeholder="Recipient Name" 
                                value={addressFormData.name}
                                onChange={(e) => setAddressFormData({ ...addressFormData, name: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Phone Number</Label>
                              <Input 
                                placeholder="Phone Number" 
                                value={addressFormData.phone}
                                onChange={(e) => setAddressFormData({ ...addressFormData, phone: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Street Address</Label>
                              <Input 
                                placeholder="House No, Street, Area" 
                                value={addressFormData.street}
                                onChange={(e) => setAddressFormData({ ...addressFormData, street: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>City</Label>
                              <Input 
                                placeholder="City" 
                                value={addressFormData.city}
                                onChange={(e) => setAddressFormData({ ...addressFormData, city: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>State</Label>
                              <Input 
                                placeholder="State" 
                                value={addressFormData.state}
                                onChange={(e) => setAddressFormData({ ...addressFormData, state: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Zip Code</Label>
                              <Input 
                                placeholder="Zip Code" 
                                value={addressFormData.zipCode}
                                onChange={(e) => setAddressFormData({ ...addressFormData, zipCode: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Country</Label>
                              <Input 
                                placeholder="Country" 
                                value={addressFormData.country}
                                onChange={(e) => setAddressFormData({ ...addressFormData, country: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="default" 
                              checked={addressFormData.isDefault}
                              onCheckedChange={(checked) => setAddressFormData({ ...addressFormData, isDefault: checked as boolean })}
                            />
                            <Label htmlFor="default" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              Set as default address
                            </Label>
                          </div>
                        </div>
                        <div className="flex justify-end gap-3">
                          <Button variant="outline" onClick={() => setIsAddressDialogOpen(false)}>Cancel</Button>
                          <Button 
                            className="bg-hilop-green text-black hover:bg-hilop-green/90 font-semibold"
                            onClick={handleAddAddress}
                            disabled={isLoading}
                          >
                            {isLoading ? 'Saving...' : 'Save Address'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  {user.addresses && user.addresses.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {user.addresses.map((address: any) => (
                        <div key={address.id} className="border rounded-lg p-4 relative group">
                          {address.isDefault && (
                            <span className="absolute top-4 right-4 bg-hilop-green/10 text-hilop-green text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                              Default
                            </span>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">{address.type}</span>
                          </div>
                          <div className="font-semibold mt-1">{address.name}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {address.street}<br />
                            {address.city}, {address.state} {address.zipCode}<br />
                            {address.country}
                          </div>
                          <div className="text-sm text-gray-500 mt-2">{address.phone}</div>
                          <div className="mt-4 flex gap-2">
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-600 hover:text-black">
                              <Edit2 className="w-3.5 h-3.5 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteAddress(address.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed rounded-xl">
                      <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-900">No addresses saved yet</h3>
                      <p className="text-gray-500 mt-1">Add your shipping addresses for a faster checkout</p>
                    </div>
                  )}
                </Card>
              )}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}
