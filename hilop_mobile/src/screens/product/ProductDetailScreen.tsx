import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Dimensions, FlatList, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { HomeStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../theme';
import { apiClient } from '../../services/api/client';
import { ENDPOINTS } from '../../constants/api';
import { Product, ProductVariant, Review } from '../../types';
import { useCartStore } from '../../store/slices/cartStore';
import { useWishlistStore } from '../../store/slices/wishlistStore';

const { width } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'ProductDetail'>;
  route: RouteProp<HomeStackParamList, 'ProductDetail'>;
};

const fetchProduct = (id: string) =>
  apiClient.get(ENDPOINTS.PRODUCT_DETAIL(id)).then(r => r.data);

// ── Image Gallery ────────────────────────────────────────────────────────────
function ImageGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  const flatRef = useRef<FlatList>(null);

  return (
    <View style={galleryStyles.container}>
      <FlatList
        ref={flatRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        onMomentumScrollEnd={e => {
          setActive(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
        renderItem={({ item }) => (
          <View style={galleryStyles.slide}>
            <Image source={{ uri: item }} style={galleryStyles.image} resizeMode="contain" />
          </View>
        )}
      />
      {/* Dots */}
      <View style={galleryStyles.dots}>
        {images.map((_, i) => (
          <View
            key={i}
            style={[galleryStyles.dot, i === active && galleryStyles.dotActive]}
          />
        ))}
      </View>
      {/* Thumbnails */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={galleryStyles.thumbRow}>
        {images.map((img, i) => (
          <TouchableOpacity
            key={i}
            style={[galleryStyles.thumb, i === active && galleryStyles.thumbActive]}
            onPress={() => {
              flatRef.current?.scrollToIndex({ index: i, animated: true });
              setActive(i);
            }}>
            <Image source={{ uri: img }} style={galleryStyles.thumbImg} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

// ── Variant Selector ─────────────────────────────────────────────────────────
function VariantSelector({
  variants,
  selected,
  onSelect,
}: {
  variants: ProductVariant[];
  selected: ProductVariant | null;
  onSelect: (v: ProductVariant) => void;
}) {
  return (
    <View style={variantStyles.container}>
      <Text style={variantStyles.label}>SELECT VARIANT</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={variantStyles.row}>
          {variants.map(v => (
            <TouchableOpacity
              key={v._id}
              style={[
                variantStyles.chip,
                selected?._id === v._id && variantStyles.chipActive,
                v.stock === 0 && variantStyles.chipDisabled,
              ]}
              onPress={() => v.stock > 0 && onSelect(v)}
              disabled={v.stock === 0}>
              <Text
                style={[
                  variantStyles.chipText,
                  selected?._id === v._id && variantStyles.chipTextActive,
                ]}>
                {v.name}: {v.value}
              </Text>
              {v.stock === 0 && <Text style={variantStyles.outOfStock}>Out of stock</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// ── Specifications ───────────────────────────────────────────────────────────
function Specifications({ specs }: { specs: Record<string, string> }) {
  return (
    <View style={specStyles.container}>
      <Text style={specStyles.title}>Specifications</Text>
      {Object.entries(specs).map(([key, value], i) => (
        <View key={key} style={[specStyles.row, i % 2 === 0 && specStyles.rowAlt]}>
          <Text style={specStyles.key}>{key}</Text>
          <Text style={specStyles.value}>{value}</Text>
        </View>
      ))}
    </View>
  );
}

// ── Review Card ──────────────────────────────────────────────────────────────
function ReviewCard({ review }: { review: Review }) {
  return (
    <View style={reviewStyles.card}>
      <View style={reviewStyles.header}>
        <View style={reviewStyles.avatar}>
          <Text style={reviewStyles.avatarText}>
            {review.user.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={reviewStyles.info}>
          <Text style={reviewStyles.name}>{review.user.name}</Text>
          <Text style={reviewStyles.date}>
            {new Date(review.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={reviewStyles.stars}>
          {[1, 2, 3, 4, 5].map(s => (
            <Text key={s} style={s <= review.rating ? reviewStyles.starFilled : reviewStyles.starEmpty}>
              ★
            </Text>
          ))}
        </View>
      </View>
      <Text style={reviewStyles.comment}>{review.comment}</Text>
    </View>
  );
}

// ── Main Screen ──────────────────────────────────────────────────────────────
export default function ProductDetailScreen({ navigation, route }: Props) {
  const { productId } = route.params;
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'reviews'>('details');

  const addItem = useCartStore(s => s.addItem);
  const { isWishlisted, addItem: addWish, removeItem: removeWish } = useWishlistStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProduct(productId),
  });

  const product: Product | undefined = data?.product;
  const reviews: Review[] = data?.reviews ?? [];
  const wishlisted = product ? isWishlisted(product._id) : false;

  const handleAddToCart = () => {
    if (!product) return;
    if (product.variants?.length && !selectedVariant) {
      Alert.alert('Select Variant', 'Please select a variant before adding to cart');
      return;
    }
    addItem(product, qty, selectedVariant ?? undefined);
    Alert.alert('Added to Cart', `${product.name} added to your cart`);
  };

  const toggleWishlist = () => {
    if (!product) return;
    wishlisted ? removeWish(product._id) : addWish(product);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Product not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.goBack}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.iconText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity style={styles.iconBtn} onPress={toggleWishlist}>
          <Text style={[styles.iconText, wishlisted && styles.wishlisted]}>
            {wishlisted ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Gallery */}
        {product.images?.length > 0 ? (
          <ImageGallery images={product.images} />
        ) : (
          <View style={styles.noImage}>
            <Text style={{ fontSize: 80 }}>⌚</Text>
          </View>
        )}

        {/* Info */}
        <View style={styles.infoBox}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.name}>{product.name}</Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map(s => (
                <Text key={s} style={s <= Math.round(product.ratings) ? styles.starOn : styles.starOff}>
                  ★
                </Text>
              ))}
            </View>
            <Text style={styles.ratingText}>
              {product.ratings.toFixed(1)} ({product.numReviews} reviews)
            </Text>
          </View>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>
              ₹{(product.discountPrice ?? product.price).toLocaleString()}
            </Text>
            {product.discountPrice && (
              <>
                <Text style={styles.originalPrice}>
                  ₹{product.price.toLocaleString()}
                </Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{discount}% OFF</Text>
                </View>
              </>
            )}
          </View>

          {/* Stock */}
          <Text style={[styles.stock, product.stock === 0 && styles.outOfStock]}>
            {product.stock > 0 ? `✓ In Stock (${product.stock} left)` : '✗ Out of Stock'}
          </Text>
        </View>

        {/* Variants */}
        {product.variants && product.variants.length > 0 && (
          <VariantSelector
            variants={product.variants}
            selected={selectedVariant}
            onSelect={setSelectedVariant}
          />
        )}

        {/* Quantity */}
        <View style={styles.qtyRow}>
          <Text style={styles.qtyLabel}>QUANTITY</Text>
          <View style={styles.qtyControls}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQty(q => Math.max(1, q - 1))}>
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{qty}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQty(q => Math.min(product.stock, q + 1))}>
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={tabStyles.row}>
          {(['details', 'specs', 'reviews'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[tabStyles.tab, activeTab === tab && tabStyles.tabActive]}
              onPress={() => setActiveTab(tab)}>
              <Text style={[tabStyles.tabText, activeTab === tab && tabStyles.tabTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'details' && (
            <Text style={styles.description}>{product.description}</Text>
          )}
          {activeTab === 'specs' && product.specifications && (
            <Specifications specs={product.specifications} />
          )}
          {activeTab === 'reviews' && (
            <View>
              {reviews.length === 0 ? (
                <Text style={styles.noReviews}>No reviews yet</Text>
              ) : (
                reviews.map(r => <ReviewCard key={r._id} review={r} />)
              )}
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.cartBtn, product.stock === 0 && styles.btnDisabled]}
          onPress={handleAddToCart}
          disabled={product.stock === 0}>
          <Text style={styles.cartBtnText}>
            {product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buyBtn, product.stock === 0 && styles.btnDisabled]}
          disabled={product.stock === 0}>
          <Text style={styles.buyBtnText}>BUY NOW</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { ...Typography.body1, color: Colors.text.secondary, marginBottom: 12 },
  goBack: { ...Typography.body1, color: Colors.primary },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  headerTitle: { ...Typography.h5, color: Colors.black },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'center',
  },
  iconText: { fontSize: 20, color: Colors.black },
  wishlisted: { color: Colors.error },
  noImage: {
    width, height: 300, alignItems: 'center',
    justifyContent: 'center', backgroundColor: Colors.background,
  },
  infoBox: { padding: Spacing.lg },
  brand: { ...Typography.label, color: Colors.primary, letterSpacing: 2, marginBottom: 4 },
  name: { ...Typography.h3, color: Colors.black, marginBottom: 12 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  stars: { flexDirection: 'row' },
  starOn: { color: '#F4A261', fontSize: 16 },
  starOff: { color: Colors.border, fontSize: 16 },
  ratingText: { ...Typography.body2, color: Colors.text.secondary },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  price: { ...Typography.price, color: Colors.black },
  originalPrice: {
    ...Typography.body1, color: Colors.text.muted,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: Colors.primary + '20', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  discountText: { ...Typography.caption, color: Colors.primary, fontWeight: '700' },
  stock: { ...Typography.body2, color: Colors.success, fontWeight: '600' },
  outOfStock: { color: Colors.error },
  qtyRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.border,
  },
  qtyLabel: { ...Typography.label, color: Colors.text.secondary, letterSpacing: 1 },
  qtyControls: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  qtyBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  qtyBtnText: { ...Typography.h4, color: Colors.black },
  qtyValue: { ...Typography.h4, color: Colors.black, minWidth: 24, textAlign: 'center' },
  tabContent: { padding: Spacing.lg },
  description: { ...Typography.body1, color: Colors.text.secondary, lineHeight: 26 },
  noReviews: { ...Typography.body1, color: Colors.text.muted, textAlign: 'center', paddingVertical: 24 },
  bottomBar: {
    flexDirection: 'row', gap: Spacing.md,
    padding: Spacing.lg, borderTopWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  cartBtn: {
    flex: 1, paddingVertical: 16, borderRadius: 12,
    borderWidth: 2, borderColor: Colors.primary,
    alignItems: 'center',
  },
  cartBtnText: { ...Typography.button, color: Colors.primary, letterSpacing: 1 },
  buyBtn: {
    flex: 1, paddingVertical: 16, borderRadius: 12,
    backgroundColor: Colors.primary, alignItems: 'center',
  },
  buyBtnText: { ...Typography.button, color: Colors.white, letterSpacing: 1 },
  btnDisabled: { opacity: 0.4 },
});

const galleryStyles = StyleSheet.create({
  container: { backgroundColor: Colors.background },
  slide: { width, height: 340, alignItems: 'center', justifyContent: 'center' },
  image: { width: width - 32, height: 300 },
  dots: {
    flexDirection: 'row', justifyContent: 'center',
    gap: 6, paddingVertical: 8,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.border },
  dotActive: { width: 18, backgroundColor: Colors.primary },
  thumbRow: { paddingHorizontal: Spacing.lg, paddingVertical: 10, gap: 8 },
  thumb: {
    width: 56, height: 56, borderRadius: 10,
    overflow: 'hidden', borderWidth: 2, borderColor: 'transparent',
  },
  thumbActive: { borderColor: Colors.primary },
  thumbImg: { width: '100%', height: '100%' },
});

const variantStyles = StyleSheet.create({
  container: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  label: { ...Typography.label, color: Colors.text.secondary, letterSpacing: 1, marginBottom: 10 },
  row: { flexDirection: 'row', gap: 8 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 100,
    borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.background,
  },
  chipActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '10' },
  chipDisabled: { opacity: 0.4 },
  chipText: { ...Typography.body2, color: Colors.text.secondary, fontWeight: '600' },
  chipTextActive: { color: Colors.primary },
  outOfStock: { ...Typography.caption, color: Colors.error },
});

const specStyles = StyleSheet.create({
  container: {},
  title: { ...Typography.h5, color: Colors.black, marginBottom: 12 },
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 12, paddingHorizontal: 8,
  },
  rowAlt: { backgroundColor: Colors.background, borderRadius: 8 },
  key: { ...Typography.body2, color: Colors.text.secondary, flex: 1 },
  value: { ...Typography.body2, color: Colors.black, fontWeight: '600', flex: 1, textAlign: 'right' },
});

const reviewStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background, borderRadius: 16,
    padding: Spacing.md, marginBottom: Spacing.md,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: { ...Typography.body1, color: Colors.white, fontWeight: '700' },
  info: { flex: 1 },
  name: { ...Typography.body2, color: Colors.black, fontWeight: '600' },
  date: { ...Typography.caption, color: Colors.text.muted },
  stars: { flexDirection: 'row' },
  starFilled: { color: '#F4A261', fontSize: 13 },
  starEmpty: { color: Colors.border, fontSize: 13 },
  comment: { ...Typography.body2, color: Colors.text.secondary, lineHeight: 22 },
});

const tabStyles = StyleSheet.create({
  row: {
    flexDirection: 'row', borderBottomWidth: 1,
    borderColor: Colors.border, marginTop: Spacing.md,
  },
  tab: {
    flex: 1, paddingVertical: 14,
    alignItems: 'center', borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  tabActive: { borderColor: Colors.primary },
  tabText: { ...Typography.body2, color: Colors.text.muted, fontWeight: '600' },
  tabTextActive: { color: Colors.primary },
});