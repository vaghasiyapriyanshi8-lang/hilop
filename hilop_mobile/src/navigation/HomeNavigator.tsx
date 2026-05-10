import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from './types';
import HomeScreen from '../screens/home/HomeScreen';
import ProductDetailScreen from '../screens/product/ProductDetailScreen';
import CategoryProductsScreen from '../screens/product/CategoryProductsScreen';
import AllProductsScreen from '../screens/product/AllProductsScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();
export default function HomeNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="CategoryProducts" component={CategoryProductsScreen} />
      <Stack.Screen name="AllProducts" component={AllProductsScreen} />
    </Stack.Navigator>
  );
}