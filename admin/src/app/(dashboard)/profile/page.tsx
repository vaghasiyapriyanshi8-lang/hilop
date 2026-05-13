'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setCredentials } from '@/redux/slices/authSlice';
import { 
  User, 
  Mail, 
  Shield, 
  Calendar,
  Camera,
  Edit,
  MapPin,
  Phone,
  Save,
  X,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import apiClient from '@/services/api';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { accentColor } = useSelector((state: RootState) => state.ui);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Edit Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+1 (555) 000-0000',
    location: 'Hilop HQ, Luxury District, New York'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: '+1 (555) 000-0000',
        location: 'Hilop HQ, Luxury District, New York'
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // In a real app, you would call your update profile API here
      // const response = await apiClient.patch('/users/me', formData);
      
      // Simulating API call success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local Redux state with new name/email
      if (user) {
        dispatch(setCredentials({
          token: localStorage.getItem('admin_token') || '',
          user: { ...user, name: formData.name, email: formData.email }
        }));
      }

      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <p className="text-gray-500 dark:text-gray-400">View and manage your administrative profile details.</p>
        </div>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all shadow-lg"
            style={{ backgroundColor: accentColor }}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsEditing(false)}
              className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all shadow-lg disabled:opacity-50"
              style={{ backgroundColor: accentColor }}
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Profile
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 text-center">
            <div className="relative inline-block">
              <div 
                className="w-32 h-32 rounded-full flex items-center justify-center text-white text-5xl font-bold border-4 border-white dark:border-gray-800 shadow-xl"
                style={{ backgroundColor: accentColor }}
              >
                {formData.name?.charAt(0) || 'A'}
              </div>
              <button className="absolute bottom-1 right-1 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 hover:text-blue-600 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{formData.name || 'Admin'}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{user?.role || 'Administrator'}</p>
            
            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Member Since</span>
                <span className="font-medium text-gray-900 dark:text-white">May 2024</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Account Status</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full text-xs font-bold">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Detailed Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Personal Information</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</p>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                ) : (
                  <div className="flex items-center gap-3 text-gray-900 dark:text-white">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{formData.name || 'Not provided'}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
                {isEditing ? (
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                ) : (
                  <div className="flex items-center gap-3 text-gray-900 dark:text-white">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{formData.email || 'Not provided'}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Role</p>
                <div className="flex items-center gap-3 text-gray-900 dark:text-white opacity-60">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span className="font-medium capitalize">{user?.role || 'Administrator'} (Read-only)</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone Number</p>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                ) : (
                  <div className="flex items-center gap-3 text-gray-900 dark:text-white">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{formData.phone}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2 md:col-span-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Office Location</p>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                ) : (
                  <div className="flex items-center gap-3 text-gray-900 dark:text-white">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{formData.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
