import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SearchStackParamList } from './types';
import SearchScreen from '../screens/search/SearchScreen';
import ProductDetailScreen from '../screens/product/ProductDetailScreen';

const Stack = createNativeStackNavigator<SearchStackParamList>();
export default function SearchNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </Stack.Navigator>
  );
}