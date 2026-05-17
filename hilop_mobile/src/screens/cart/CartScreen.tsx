import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Image, TextInput, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CartStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../theme';
import { useCartStore } from '../../store/slices/cartStore';
import { CartItem } from '../../types';
import { apiClient } from '../../services/api/client';
import { formatCurrency } from '../../utils/format';

type Props = {
  navigation: NativeStackNavigationProp<CartStackParamList, 'CartScreen'>;
};

const TAX_RATE = 0.18;
const FREE_SHIPPING_ABOVE = 5000;
const SHIPPING_CHARGE = 299;

// ── Cart Item Row ────────────────────────────────────────────────────────────
function CartItemRow({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}) {
  const price = item.product.discountPrice ?? item.product.price;

  return (
    <View style={itemStyles.container}>
      {/* Image */}
      <View style={itemStyles.imageBox}>
        {item.product.images?.[0] ? (
          <Image
            source={{ uri: item.product.images[0] }}
            style={itemStyles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={itemStyles.placeholder}>
            <Text style={{ fontSize: 32 }}>⌚</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={itemStyles.info}>
        <Text style={itemStyles.brand} numberOfLines={1}>
          {item.product.brand}
        </Text>
        <Text style={itemStyles.name} numberOfLines={2}>
          {item.product.name}
        </Text>
        {item.variant && (
          <Text style={itemStyles.variant}>
            {item.variant.name}: {item.variant.value}
          </Text>
        )}
        <Text style={itemStyles.price}>
          {formatCurrency(price * item.quantity)}
        </Text>

        {/* Qty Controls */}
        <View style={itemStyles.qtyRow}>
          <TouchableOpacity
            style={itemStyles.qtyBtn}
            onPress={onDecrement}>
            <Text style={itemStyles.qtyBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={itemStyles.qtyValue}>{item.quantity}</Text>
          <TouchableOpacity
            style={itemStyles.qtyBtn}
            onPress={onIncrement}>
            <Text style={itemStyles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Remove */}
      <TouchableOpacity style={itemStyles.removeBtn} onPress={onRemove}>
        <Text style={itemStyles.removeIcon}>🗑</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Coupon Input ─────────────────────────────────────────────────────────────
function CouponInput({
  coupon,
  setCoupon,
  discount,
  onApply,
  onRemove,
  loading,
}: {
  coupon: string;
  setCoupon: (v: string) => void;
  discount: number;
  onApply: () => void;
  onRemove: () => void;
  loading: boolean;
}) {
  return (
    <View style={couponStyles.container}>
      <Text style={couponStyles.label}>COUPON CODE</Text>
      {discount > 0 ? (
        <View style={couponStyles.appliedRow}>
          <Text style={couponStyles.appliedText}>
            🎉 "{coupon}" applied — {formatCurrency(discount)} off
          </Text>
          <TouchableOpacity onPress={onRemove}>
            <Text style={couponStyles.removeText}>Remove</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={couponStyles.inputRow}>
          <TextInput
            style={couponStyles.input}
            value={coupon}
            onChangeText={setCoupon}
            placeholder="Enter coupon code"
            placeholderTextColor={Colors.text.muted}
            autoCapitalize="characters"
          />
          <TouchableOpacity
            style={[couponStyles.applyBtn, loading && couponStyles.applyBtnDisabled]}
            onPress={onApply}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <Text style={couponStyles.applyText}>APPLY</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ── Price Summary ────────────────────────────────────────────────────────────
function PriceSummary({
  subtotal,
  discount,
  shipping,
  tax,
  total,
}: {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}) {
  const rows = [
    { label: 'Subtotal', value: subtotal, color: Colors.black },
    { label: 'Coupon Discount', value: -discount, color: Colors.success, hide: discount === 0 },
    { label: 'Shipping', value: shipping, color: Colors.black, free: shipping === 0 },
    { label: 'Tax (18% GST)', value: tax, color: Colors.black },
  ];

  return (
    <View style={summaryStyles.container}>
      <Text style={summaryStyles.title}>Order Summary</Text>
      {rows.map((row, i) => {
        if (row.hide) return null;
        return (
          <View key={i} style={summaryStyles.row}>
            <Text style={summaryStyles.label}>{row.label}</Text>
            {row.free ? (
              <Text style={summaryStyles.freeText}>FREE</Text>
            ) : (
              <Text style={[summaryStyles.value, { color: row.color }]}>
                {row.value < 0 ? '-' : ''}{formatCurrency(Math.abs(row.value))}
              </Text>
            )}
          </View>
        );
      })}

      <View style={summaryStyles.divider} />

      <View style={summaryStyles.row}>
        <Text style={summaryStyles.totalLabel}>Total</Text>
        <Text style={summaryStyles.totalValue}>{formatCurrency(total)}</Text>
      </View>

      {shipping === 0 && (
        <Text style={summaryStyles.freeShippingNote}>
          🎉 You qualify for free shipping!
        </Text>
      )}
    </View>
  );
}

// ── Empty Cart ───────────────────────────────────────────────────────────────
function EmptyCart({ onShop }: { onShop: () => void }) {
  return (
    <View style={emptyStyles.container}>
      <Text style={emptyStyles.icon}>🛒</Text>
      <Text style={emptyStyles.title}>Your Cart is Empty</Text>
      <Text style={emptyStyles.subtitle}>
        Add some luxury timepieces to get started
      </Text>
      <TouchableOpacity style={emptyStyles.button} onPress={onShop}>
        <Text style={emptyStyles.buttonText}>START SHOPPING</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Main Screen ──────────────────────────────────────────────────────────────
export default function CartScreen({ navigation }: Props) {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
  const [coupon, setCoupon] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);

  const subtotal = totalPrice();
  const shipping = subtotal >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_CHARGE;
  const tax = Math.round((subtotal - couponDiscount) * TAX_RATE);
  const total = subtotal - couponDiscount + shipping + tax;

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) return;
    try {
      setCouponLoading(true);
      const { data } = await apiClient.post('/coupons/validate', {
        code: coupon.trim(),
        cartTotal: subtotal,
      });
      setCouponDiscount(data.discount);
      Alert.alert('Success', `Coupon applied! You saved ₹${formatCurrency(data.discount)}`);
    } catch (error: any) {
      Alert.alert('Invalid Coupon', error.response?.data?.message ?? 'Coupon not valid');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCoupon('');
    setCouponDiscount(0);
  };

  const handleIncrement = (item: CartItem) => {
    if (item.quantity >= item.product.stock) {
      Alert.alert('Stock Limit', 'Maximum available stock reached');
      return;
    }
    updateQuantity(item.product._id, item.quantity + 1);
  };

  const handleDecrement = (item: CartItem) => {
    if (item.quantity <= 1) {
      Alert.alert(
        'Remove Item',
        'Remove this item from cart?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', style: 'destructive', onPress: () => removeItem(item.product._id) },
        ],
      );
      return;
    }
    updateQuantity(item.product._id, item.quantity - 1);
  };

  const handleCheckout = () => {
    navigation.navigate('Checkout');
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Cart</Text>
        </View>
        <EmptyCart onShop={() => navigation.getParent()?.navigate('Home')} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart</Text>
        <Text style={styles.headerCount}>{items.length} items</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <CartItemRow
            item={item}
            onIncrement={() => handleIncrement(item)}
            onDecrement={() => handleDecrement(item)}
            onRemove={() => {
                Alert.alert(
                'Remove Item',
                `Remove ${item.product.name} from cart?`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => removeItem(item.product._id),
                  },
                ],
              );
            }}
          />
        )}
        ListFooterComponent={
          <>
            <CouponInput
              coupon={coupon}
              setCoupon={setCoupon}
              discount={couponDiscount}
              onApply={handleApplyCoupon}
              onRemove={handleRemoveCoupon}
              loading={couponLoading}
            />
            <PriceSummary
              subtotal={subtotal}
              discount={couponDiscount}
              shipping={shipping}
              tax={tax}
              total={total}
            />
            <View style={{ height: 120 }} />
          </>
        }
      />

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={handleCheckout}>
          <Text style={styles.checkoutText}>PROCEED TO CHECKOUT</Text>
          <Text style={styles.checkoutArrow}>→</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────
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
  headerCount: { ...Typography.body2, color: Colors.text.secondary },
  list: { padding: Spacing.lg, gap: Spacing.md },
  bottomBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 1, borderColor: Colors.border,
    padding: Spacing.lg,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 8,
  },
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  totalLabel: { ...Typography.body1, color: Colors.text.secondary },
  totalValue: { ...Typography.h3, color: Colors.black },
  checkoutBtn: {
    backgroundColor: Colors.primary, borderRadius: 14,
    paddingVertical: 16, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  checkoutText: { ...Typography.button, color: Colors.white, letterSpacing: 1.5 },
  checkoutArrow: { fontSize: 18, color: Colors.white },
});

const itemStyles = StyleSheet.create({
  container: {
    flexDirection: 'row', backgroundColor: Colors.white,
    borderRadius: 16, padding: Spacing.md, gap: Spacing.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  imageBox: {
    width: 90, height: 90, borderRadius: 12,
    overflow: 'hidden', backgroundColor: Colors.background,
  },
  image: { width: '100%', height: '100%' },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  brand: { ...Typography.caption, color: Colors.primary, letterSpacing: 1, marginBottom: 2 },
  name: { ...Typography.body2, color: Colors.black, fontWeight: '600', marginBottom: 4 },
  variant: { ...Typography.caption, color: Colors.text.secondary, marginBottom: 4 },
  price: { ...Typography.h5, color: Colors.black, marginBottom: 8 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qtyBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.background, alignItems: 'center',
    justifyContent: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  qtyBtnText: { ...Typography.h5, color: Colors.black },
  qtyValue: { ...Typography.h5, color: Colors.black, minWidth: 20, textAlign: 'center' },
  removeBtn: { padding: 4 },
  removeIcon: { fontSize: 18 },
});

const couponStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white, borderRadius: 16,
    padding: Spacing.md, marginBottom: Spacing.md,
  },
  label: { ...Typography.label, color: Colors.text.secondary, letterSpacing: 1, marginBottom: 10 },
  inputRow: { flexDirection: 'row', gap: 10 },
  input: {
    flex: 1, ...Typography.body1, color: Colors.black,
    borderWidth: 1, borderColor: Colors.border, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: Colors.background,
  },
  applyBtn: {
    backgroundColor: Colors.primary, borderRadius: 10,
    paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center',
  },
  applyBtnDisabled: { opacity: 0.6 },
  applyText: { ...Typography.button, color: Colors.white, letterSpacing: 1 },
  appliedRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', backgroundColor: Colors.primary + '15',
    borderRadius: 10, padding: 12,
  },
  appliedText: { ...Typography.body2, color: Colors.primary, fontWeight: '600', flex: 1 },
  removeText: { ...Typography.body2, color: Colors.error, fontWeight: '600' },
});

const summaryStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white, borderRadius: 16,
    padding: Spacing.md, marginBottom: Spacing.md,
  },
  title: { ...Typography.h5, color: Colors.black, marginBottom: 16 },
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  label: { ...Typography.body1, color: Colors.text.secondary },
  value: { ...Typography.body1, fontWeight: '600' },
  freeText: { ...Typography.body1, color: Colors.success, fontWeight: '700' },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 12 },
  totalLabel: { ...Typography.h4, color: Colors.black },
  totalValue: { ...Typography.h3, color: Colors.black },
  freeShippingNote: {
    ...Typography.body2, color: Colors.success,
    textAlign: 'center', marginTop: 10, fontWeight: '600',
  },
});

const emptyStyles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  icon: { fontSize: 72, marginBottom: 20 },
  title: { ...Typography.h3, color: Colors.black, marginBottom: 8 },
  subtitle: { ...Typography.body1, color: Colors.text.secondary, textAlign: 'center', marginBottom: 32 },
  button: {
    backgroundColor: Colors.primary, borderRadius: 12,
    paddingHorizontal: 32, paddingVertical: 14,
  },
  buttonText: { ...Typography.button, color: Colors.white, letterSpacing: 2 },
});