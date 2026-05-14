import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Image, ActivityIndicator, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../theme';
import { apiClient } from '../../services/api/client';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/format';

const { width } = Dimensions.get('window');
const CARD_W = (width - Spacing.lg * 2 - Spacing.md) / 2;

type Props = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'AllProducts'>;
  route: RouteProp<HomeStackParamList, 'AllProducts'>;
};

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price ↑', value: 'price_asc' },
  { label: 'Price ↓', value: 'price_desc' },
  { label: 'Top Rated', value: 'rating' },
];

function ProductCard({
  product, onPress,
}: {
  product: Product;
  onPress: () => void;
}) {
  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null;

  return (
    <TouchableOpacity style={cardStyles.container} onPress={onPress} activeOpacity={0.85}>
      <View style={cardStyles.imageBox}>
        {product.images?.[0] ? (
          <Image source={{ uri: product.images[0] }} style={cardStyles.image} />
        ) : (
          <View style={cardStyles.placeholder}>
            <Text style={{ fontSize: 36 }}>⌚</Text>
          </View>
        )}
        {discount && (
          <View style={cardStyles.badge}>
            <Text style={cardStyles.badgeText}>-{discount}%</Text>
          </View>
        )}
      </View>
      <View style={cardStyles.info}>
        <Text style={cardStyles.brand} numberOfLines={1}>{product.brand}</Text>
        <Text style={cardStyles.name} numberOfLines={2}>{product.name}</Text>
        <View style={cardStyles.priceRow}>
          <Text style={cardStyles.price}>
            {formatCurrency(product.discountPrice ?? product.price)}
          </Text>
          {product.discountPrice && (
            <Text style={cardStyles.originalPrice}>
              {formatCurrency(product.price)}
            </Text>
          )}
        </View>
        <View style={cardStyles.ratingRow}>
          <Text style={cardStyles.star}>★</Text>
          <Text style={cardStyles.rating}>{product.ratings.toFixed(1)}</Text>
          <Text style={cardStyles.reviews}>({product.numReviews})</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function AllProductsScreen({ navigation, route }: Props) {
  const { title, type } = route.params;
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  const buildEndpoint = () => {
    switch (type) {
      case 'featured': return '/products/featured';
      case 'new-arrivals': return '/products/new-arrivals';
      case 'sale': return '/products?onSale=true';
      default: return '/products';
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ['allProducts', type, sort, page],
    queryFn: () =>
      apiClient.get(buildEndpoint(), {
        params: { sort, page, limit: 12 },
      }).then(r => r.data),
  });

  const products: Product[] = data?.products ?? [];
  const totalPages: number = data?.totalPages ?? 1;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Sort Bar */}
      <View style={styles.sortBar}>
        <FlatList
          horizontal
          data={SORT_OPTIONS}
          keyExtractor={item => item.value}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.sortChip, sort === item.value && styles.sortChipActive]}
              onPress={() => { setSort(item.value); setPage(1); }}>
              <Text style={[styles.sortText, sort === item.value && styles.sortTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Results count */}
      {!isLoading && (
        <Text style={styles.resultCount}>
          {data?.total ?? products.length} products
        </Text>
      )}

      {/* Products */}
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : products.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyIcon}>⌚</Text>
          <Text style={styles.emptyText}>No products found</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item._id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('ProductDetail', { productId: item._id })}
            />
          )}
          ListFooterComponent={
            totalPages > 1 ? (
              <View style={styles.pagination}>
                <TouchableOpacity
                  style={[styles.pageBtn, page === 1 && styles.pageBtnDisabled]}
                  onPress={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}>
                  <Text style={styles.pageBtnText}>← Prev</Text>
                </TouchableOpacity>
                <Text style={styles.pageInfo}>
                  {page} / {totalPages}
                </Text>
                <TouchableOpacity
                  style={[styles.pageBtn, page === totalPages && styles.pageBtnDisabled]}
                  onPress={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}>
                  <Text style={styles.pageBtnText}>Next →</Text>
                </TouchableOpacity>
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderColor: Colors.border,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'center',
  },
  backText: { fontSize: 20, color: Colors.black },
  headerTitle: { ...Typography.h4, color: Colors.black },
  sortBar: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderColor: Colors.border,
  },
  sortList: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, gap: 8 },
  sortChip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 100, backgroundColor: Colors.background,
    borderWidth: 1, borderColor: Colors.border,
  },
  sortChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  sortText: { ...Typography.body2, color: Colors.text.secondary, fontWeight: '600' },
  sortTextActive: { color: Colors.white },
  resultCount: {
    ...Typography.body2, color: Colors.text.secondary,
    paddingHorizontal: Spacing.lg, paddingVertical: 10,
  },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyText: { ...Typography.body1, color: Colors.text.secondary },
  row: { gap: Spacing.md },
  list: { padding: Spacing.lg, gap: Spacing.md },
  pagination: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 16,
    paddingVertical: Spacing.lg,
  },
  pageBtn: {
    paddingHorizontal: 20, paddingVertical: 10,
    backgroundColor: Colors.primary, borderRadius: 100,
  },
  pageBtnDisabled: { backgroundColor: Colors.border },
  pageBtnText: { ...Typography.body2, color: Colors.white, fontWeight: '700' },
  pageInfo: { ...Typography.body1, color: Colors.black, fontWeight: '600' },
});

const cardStyles = StyleSheet.create({
  container: {
    width: CARD_W, backgroundColor: Colors.white,
    borderRadius: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },
  imageBox: { width: '100%', aspectRatio: 1, backgroundColor: Colors.background },
  image: { width: '100%', height: '100%' },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: Colors.error, borderRadius: 6,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  badgeText: { ...Typography.caption, color: Colors.white, fontWeight: '700' },
  info: { padding: 10 },
  brand: { ...Typography.caption, color: Colors.primary, letterSpacing: 1, marginBottom: 2 },
  name: { ...Typography.body2, color: Colors.black, fontWeight: '600', marginBottom: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  price: { ...Typography.h5, color: Colors.black },
  originalPrice: {
    ...Typography.caption, color: Colors.text.muted,
    textDecorationLine: 'line-through',
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  star: { color: '#F4A261', fontSize: 12 },
  rating: { ...Typography.caption, color: Colors.black, fontWeight: '600' },
  reviews: { ...Typography.caption, color: Colors.text.muted },
});