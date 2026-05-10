import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { MainTabParamList } from './types';
import { Colors } from '../theme';
import HomeNavigator from './HomeNavigator';
import SearchNavigator from './SearchNavigator';
import CartNavigator from './CartNavigator';
import ProfileNavigator from './ProfileNavigator';
import WishlistScreen from '../screens/wishlist/WishlistScreen';
import { useCartStore } from '../store/slices/cartStore';

const Tab = createBottomTabNavigator<MainTabParamList>();

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Home: '⌂', Search: '⌕', Cart: '⊡', Wishlist: '♡', Profile: '◎',
  };
  return (
    <Text style={{ fontSize: 20, color: focused ? Colors.primary : Colors.text.muted }}>
      {icons[name]}
    </Text>
  );
}

export default function MainNavigator() {
  const totalItems = useCartStore(s => s.totalItems());
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.text.muted,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
          height: 60,
          paddingBottom: 8,
        },
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
      })}>
      <Tab.Screen name="Home" component={HomeNavigator} />
      <Tab.Screen name="Search" component={SearchNavigator} />
      <Tab.Screen
        name="Cart"
        component={CartNavigator}
        options={{
          tabBarBadge: totalItems > 0 ? totalItems : undefined,
          tabBarBadgeStyle: { backgroundColor: Colors.primary },
        }}
      />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  );
}