import React, { useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, FlatList, Image,
  Dimensions, RefreshControl, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../theme';
import { apiClient } from '../../services/api/client';
import { ENDPOINTS } from '../../constants/api';
import { Product, Category } from '../../types';
import { useAuthStore } from '../../store/slices/authStore';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.6;
const CATEGORY_SIZE = 80;

type Props = { navigation: NativeStackNavigationProp<HomeStackParamList, 'HomeScreen'> };

// ── API fetchers ─────────────────────────────────────────────────────────────
const fetchFeatured = () => apiClient.get(ENDPOINTS.FEATURED).then(r => r.data);
const fetchNewArrivals = () => apiClient.get(ENDPOINTS.NEW_ARRIVALS).then(r => r.data);
const fetchCategories = () => apiClient.get(ENDPOINTS.CATEGORIES).then(r => r.data);

// ── Sub-components ───────────────────────────────────────────────────────────
function HeroSection({ onShop }: { onShop: () => void }) {
  return (
    <View style={heroStyles.container}>
      <View style={heroStyles.overlay} />
      <View style={heroStyles.content}>
        <Text style={heroStyles.eyebrow}>NEW COLLECTION 2026</Text>
        <Text style={heroStyles.title}>Precision{'\n'}Redefined</Text>
        <Text style={heroStyles.subtitle}>
          Crafted for those who demand excellence
        </Text>
        <TouchableOpacity style={heroStyles.button} onPress={onShop}>
          <Text style={heroStyles.buttonText}>EXPLORE NOW</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SectionHeader({
  title, onSeeAll,
}: { title: string; onSeeAll: () => void }) {
  return (
    <View style={sectionStyles.row}>
      <Text style={sectionStyles.title}>{title}</Text>
      <TouchableOpacity onPress={onSeeAll}>
        <Text style={sectionStyles.seeAll}>See All</Text>
      </TouchableOpacity>
    </View>
  );
}

function ProductCard({
  product, onPress, wide,
}: { product: Product; onPress: () => void; wide?: boolean }) {
  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null;

  return (
    <TouchableOpacity
      style={[cardStyles.container, wide && { width: CARD_WIDTH }]}
      onPress={onPress}
      activeOpacity={0.85}>
      <View style={cardStyles.imageBox}>
        {product.images?.[0] ? (
          <Image source={{ uri: product.images[0] }} style={cardStyles.image} />
        ) : (
          <View style={cardStyles.placeholder}>
            <Text style={cardStyles.placeholderText}>⌚</Text>
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
            ₹{(product.discountPrice ?? product.price).toLocaleString()}
          </Text>
          {product.discountPrice && (
            <Text style={cardStyles.originalPrice}>
              ₹{product.price.toLocaleString()}
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

function CategoryCard({
  category, onPress,
}: { category: Category; onPress: () => void }) {
  return (
    <TouchableOpacity style={catStyles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={catStyles.circle}>
        {category.image ? (
          <Image source={{ uri: category.image }} style={catStyles.image} />
        ) : (
          <Text style={catStyles.emoji}>⌚</Text>
        )}
      </View>
      <Text style={catStyles.name} numberOfLines={1}>{category.name}</Text>
    </TouchableOpacity>
  );
}

function FlashSaleBanner({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={bannerStyles.container} onPress={onPress} activeOpacity={0.9}>
      <View style={bannerStyles.left}>
        <Text style={bannerStyles.label}>⚡ FLASH SALE</Text>
        <Text style={bannerStyles.title}>Up to 40% Off</Text>
        <Text style={bannerStyles.sub}>Limited time offer</Text>
      </View>
      <View style={bannerStyles.right}>
        <Text style={bannerStyles.emoji}>⌚</Text>
      </View>
    </TouchableOpacity>
  );
}

// ── Main Screen ──────────────────────────────────────────────────────────────
export default function HomeScreen({ navigation }: Props) {
  const user = useAuthStore(s => s.user);

  const {
    data: featured, isLoading: featuredLoading, refetch: refetchFeatured,
  } = useQuery({ queryKey: ['featured'], queryFn: fetchFeatured });

  const {
    data: newArrivals, isLoading: arrivalsLoading, refetch: refetchArrivals,
  } = useQuery({ queryKey: ['newArrivals'], queryFn: fetchNewArrivals });

  const {
    data: categories, refetch: refetchCategories,
  } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchFeatured(), refetchArrivals(), refetchCategories()]);
    setRefreshing(false);
  }, [refetchFeatured, refetchArrivals, refetchCategories]);

  const goToProduct = (productId: string) =>
    navigation.navigate('ProductDetail', { productId });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>
            Hello, {user?.name?.split(' ')[0] ?? 'Guest'} 👋
          </Text>
          <Text style={styles.topBarTitle}>HILOP</Text>
        </View>
        <TouchableOpacity style={styles.notifButton}>
          <Text style={styles.notifIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }>

        {/* Hero */}
        <HeroSection
          onShop={() => navigation.navigate('AllProducts', { title: 'All Watches', type: 'all' })}
        />

        {/* Categories */}
        {categories?.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title="Categories"
              onSeeAll={() => navigation.navigate('AllProducts', { title: 'All Categories', type: 'categories' })}
            />
            <FlatList
              horizontal
              data={categories}
              keyExtractor={(item: Category) => item._id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hList}
              renderItem={({ item }: { item: Category }) => (
                <CategoryCard
                  category={item}
                  onPress={() => navigation.navigate('CategoryProducts', {
                    categoryId: item._id,
                    categoryName: item.name,
                  })}
                />
              )}
            />
          </View>
        )}

        {/* Flash Sale Banner */}
        <View style={styles.bannerSection}>
          <FlashSaleBanner
            onPress={() => navigation.navigate('AllProducts', { title: 'Flash Sale', type: 'sale' })}
          />
        </View>

        {/* Featured */}
        <View style={styles.section}>
          <SectionHeader
            title="Featured"
            onSeeAll={() => navigation.navigate('AllProducts', { title: 'Featured', type: 'featured' })}
          />
          {featuredLoading ? (
            <ActivityIndicator color={Colors.primary} style={styles.loader} />
          ) : (
            <FlatList
              horizontal
              data={featured?.products ?? []}
              keyExtractor={(item: Product) => item._id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hList}
              renderItem={({ item }: { item: Product }) => (
                <ProductCard
                  product={item}
                  wide
                  onPress={() => goToProduct(item._id)}
                />
              )}
            />
          )}
        </View>

        {/* New Arrivals */}
        <View style={styles.section}>
          <SectionHeader
            title="New Arrivals"
            onSeeAll={() => navigation.navigate('AllProducts', { title: 'New Arrivals', type: 'new-arrivals' })}
          />
          {arrivalsLoading ? (
            <ActivityIndicator color={Colors.primary} style={styles.loader} />
          ) : (
            <View style={styles.grid}>
              {(newArrivals?.products ?? []).slice(0, 4).map((item: Product) => (
                <ProductCard
                  key={item._id}
                  product={item}
                  onPress={() => goToProduct(item._id)}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  greeting: { ...Typography.caption, color: Colors.text.secondary },
  topBarTitle: {
    ...Typography.h3, color: Colors.black, letterSpacing: 6, fontSize: 20,
  },
  notifButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.white, alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  notifIcon: { fontSize: 18 },
  section: { marginTop: Spacing.lg },
  bannerSection: { paddingHorizontal: Spacing.lg, marginTop: Spacing.lg },
  hList: { paddingHorizontal: Spacing.lg, gap: Spacing.md },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg, gap: Spacing.md,
  },
  loader: { marginVertical: Spacing.lg },
  bottomPad: { height: 32 },
});

const heroStyles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg, marginTop: Spacing.md,
    height: 280, borderRadius: 24, backgroundColor: Colors.black,
    overflow: 'hidden', justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  content: { padding: Spacing.lg },
  eyebrow: {
    ...Typography.label, color: Colors.primary,
    letterSpacing: 3, marginBottom: 8,
  },
  title: {
    fontSize: 36, fontWeight: '800', color: Colors.white,
    lineHeight: 42, marginBottom: 8,
  },
  subtitle: { ...Typography.body2, color: 'rgba(255,255,255,0.7)', marginBottom: 20 },
  button: {
    alignSelf: 'flex-start', backgroundColor: Colors.primary,
    paddingHorizontal: 24, paddingVertical: 12, borderRadius: 100,
  },
  buttonText: { ...Typography.button, color: Colors.white, letterSpacing: 1.5 },
});

const sectionStyles = StyleSheet.create({
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: Spacing.lg, marginBottom: Spacing.md,
  },
  title: { ...Typography.h4, color: Colors.black },
  seeAll: { ...Typography.body2, color: Colors.primary, fontWeight: '600' },
});

const cardStyles = StyleSheet.create({
  container: {
    width: (width - Spacing.lg * 2 - Spacing.md) / 2,
    backgroundColor: Colors.white, borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },
  imageBox: { width: '100%', aspectRatio: 1, backgroundColor: Colors.background },
  image: { width: '100%', height: '100%' },
  placeholder: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F0F0F0',
  },
  placeholderText: { fontSize: 40 },
  badge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: Colors.error, borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  badgeText: { ...Typography.caption, color: Colors.white, fontWeight: '700' },
  info: { padding: 12 },
  brand: { ...Typography.caption, color: Colors.primary, letterSpacing: 1, marginBottom: 2 },
  name: { ...Typography.body2, color: Colors.black, fontWeight: '600', marginBottom: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
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

const catStyles = StyleSheet.create({
  container: { alignItems: 'center', width: CATEGORY_SIZE + 16 },
  circle: {
    width: CATEGORY_SIZE, height: CATEGORY_SIZE, borderRadius: CATEGORY_SIZE / 2,
    backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  emoji: { fontSize: 32 },
  name: {
    ...Typography.caption, color: Colors.black,
    marginTop: 8, textAlign: 'center', fontWeight: '600',
  },
});

const bannerStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.black, borderRadius: 20,
    padding: Spacing.lg, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
  },
  left: { flex: 1 },
  label: { ...Typography.label, color: Colors.primary, letterSpacing: 2, marginBottom: 4 },
  title: { ...Typography.h3, color: Colors.white, marginBottom: 4 },
  sub: { ...Typography.body2, color: 'rgba(255,255,255,0.6)' },
  right: { marginLeft: Spacing.md },
  emoji: { fontSize: 56 },
});