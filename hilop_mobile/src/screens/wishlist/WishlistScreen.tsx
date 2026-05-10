import React from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Image, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, Spacing } from '../../theme';
import { useWishlistStore } from '../../store/slices/wishlistStore';
import { useCartStore } from '../../store/slices/cartStore';
import { Product } from '../../types';

const { width } = Dimensions.get('window');
const CARD_W = (width - Spacing.lg * 2 - Spacing.md) / 2;

function WishlistCard({
  product,
  onPress,
  onRemove,
  onAddToCart,
}: {
  product: Product;
  onPress: () => void;
  onRemove: () => void;
  onAddToCart: () => void;
}) {
  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null;

  return (
    <View style={cardStyles.container}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <View style={cardStyles.imageBox}>
          {product.images?.[0] ? (
            <Image
              source={{ uri: product.images[0] }}
              style={cardStyles.image}
              resizeMode="cover"
            />
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
          <TouchableOpacity style={cardStyles.removeBtn} onPress={onRemove}>
            <Text style={cardStyles.removeIcon}>♥</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

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
        <TouchableOpacity style={cardStyles.cartBtn} onPress={onAddToCart}>
          <Text style={cardStyles.cartBtnText}>ADD TO CART</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function EmptyWishlist({ onShop }: { onShop: () => void }) {
  return (
    <View style={emptyStyles.container}>
      <Text style={emptyStyles.icon}>♡</Text>
      <Text style={emptyStyles.title}>Your Wishlist is Empty</Text>
      <Text style={emptyStyles.subtitle}>
        Save your favourite timepieces and shop them later
      </Text>
      <TouchableOpacity style={emptyStyles.button} onPress={onShop}>
        <Text style={emptyStyles.buttonText}>EXPLORE WATCHES</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function WishlistScreen() {
  const navigation = useNavigation<any>();
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore(s => s.addItem);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    removeItem(product._id);
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Wishlist</Text>
        </View>
        <EmptyWishlist onShop={() => navigation.navigate('Home')} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wishlist</Text>
        <Text style={styles.count}>{items.length} items</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={item => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <WishlistCard
            product={item}
            onPress={() =>
              navigation.navigate('Home', {
                screen: 'ProductDetail',
                params: { productId: item._id },
              })
            }
            onRemove={() => removeItem(item._id)}
            onAddToCart={() => handleAddToCart(item)}
          />
        )}
      />
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
  headerTitle: { ...Typography.h3, color: Colors.black },
  count: { ...Typography.body2, color: Colors.text.secondary },
  row: { gap: Spacing.md },
  list: { padding: Spacing.lg, gap: Spacing.md },
});

const cardStyles = StyleSheet.create({
  container: {
    width: CARD_W, backgroundColor: Colors.white,
    borderRadius: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },
  imageBox: {
    width: '100%', aspectRatio: 1,
    backgroundColor: Colors.background,
  },
  image: { width: '100%', height: '100%' },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: Colors.error, borderRadius: 6,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  badgeText: { ...Typography.caption, color: Colors.white, fontWeight: '700' },
  removeBtn: {
    position: 'absolute', top: 8, right: 8,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.white, alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
  },
  removeIcon: { fontSize: 16, color: Colors.error },
  info: { padding: 10 },
  brand: { ...Typography.caption, color: Colors.primary, letterSpacing: 1, marginBottom: 2 },
  name: { ...Typography.body2, color: Colors.black, fontWeight: '600', marginBottom: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  price: { ...Typography.h5, color: Colors.black },
  originalPrice: {
    ...Typography.caption, color: Colors.text.muted,
    textDecorationLine: 'line-through',
  },
  cartBtn: {
    backgroundColor: Colors.primary, borderRadius: 8,
    paddingVertical: 8, alignItems: 'center',
  },
  cartBtnText: { ...Typography.caption, color: Colors.white, fontWeight: '700', letterSpacing: 1 },
});

const emptyStyles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  icon: { fontSize: 72, color: Colors.error, marginBottom: 20 },
  title: { ...Typography.h3, color: Colors.black, marginBottom: 8 },
  subtitle: {
    ...Typography.body1, color: Colors.text.secondary,
    textAlign: 'center', lineHeight: 24, marginBottom: 32,
  },
  button: {
    backgroundColor: Colors.primary, borderRadius: 12,
    paddingHorizontal: 32, paddingVertical: 14,
  },
  buttonText: { ...Typography.button, color: Colors.white, letterSpacing: 2 },
});