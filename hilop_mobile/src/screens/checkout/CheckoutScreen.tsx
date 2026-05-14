import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { CartStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../theme';
import { apiClient } from '../../services/api/client';
import { ENDPOINTS } from '../../constants/api';
import { Address } from '../../types';
import { useCartStore } from '../../store/slices/cartStore';

type Props = {
  navigation: NativeStackNavigationProp<CartStackParamList, 'Checkout'>;
};

const TAX_RATE = 0.18;
const FREE_SHIPPING_ABOVE = 5000;
const SHIPPING_CHARGE = 299;

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'upi', label: 'UPI Payment', icon: '📱' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
  { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
];

// ── Step Indicator ───────────────────────────────────────────────────────────
function StepIndicator({ step }: { step: number }) {
  const steps = ['Address', 'Payment', 'Review'];
  return (
    <View style={stepStyles.container}>
      {steps.map((label, i) => (
        <React.Fragment key={label}>
          <View style={stepStyles.item}>
            <View style={[stepStyles.circle, i < step && stepStyles.circleCompleted, i === step && stepStyles.circleActive]}>
              {i < step ? (
                <Text style={stepStyles.checkmark}>✓</Text>
              ) : (
                <Text style={[stepStyles.number, i === step && stepStyles.numberActive]}>
                  {i + 1}
                </Text>
              )}
            </View>
            <Text style={[stepStyles.label, i === step && stepStyles.labelActive]}>
              {label}
            </Text>
          </View>
          {i < steps.length - 1 && (
            <View style={[stepStyles.line, i < step && stepStyles.lineCompleted]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

// ── Address Card ─────────────────────────────────────────────────────────────
function AddressCard({
  address,
  selected,
  onSelect,
}: {
  address: Address;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <TouchableOpacity
      style={[addrStyles.card, selected && addrStyles.cardSelected]}
      onPress={onSelect}
      activeOpacity={0.8}>
      <View style={addrStyles.header}>
        <View style={addrStyles.row}>
          <View style={[addrStyles.radio, selected && addrStyles.radioActive]} />
          <Text style={addrStyles.name}>{address.fullName}</Text>
          {address.isDefault && (
            <View style={addrStyles.defaultBadge}>
              <Text style={addrStyles.defaultText}>Default</Text>
            </View>
          )}
        </View>
        <Text style={addrStyles.phone}>{address.phone}</Text>
      </View>
      <Text style={addrStyles.address}>
        {address.street}, {address.city},{'\n'}
        {address.state} - {address.pincode}
      </Text>
    </TouchableOpacity>
  );
}

// ── Payment Method Card ──────────────────────────────────────────────────────
function PaymentCard({
  method,
  selected,
  onSelect,
}: {
  method: typeof PAYMENT_METHODS[0];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <TouchableOpacity
      style={[payStyles.card, selected && payStyles.cardSelected]}
      onPress={onSelect}
      activeOpacity={0.8}>
      <Text style={payStyles.icon}>{method.icon}</Text>
      <Text style={[payStyles.label, selected && payStyles.labelSelected]}>
        {method.label}
      </Text>
      <View style={[payStyles.radio, selected && payStyles.radioActive]} />
    </TouchableOpacity>
  );
}

// ── Order Review ─────────────────────────────────────────────────────────────
function OrderReview({
  items,
  address,
  paymentMethod,
  subtotal,
  shipping,
  tax,
  total,
}: {
  items: any[];
  address: Address;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}) {
  return (
    <View style={reviewStyles.container}>
      {/* Delivery Address */}
      <View style={reviewStyles.section}>
        <Text style={reviewStyles.sectionTitle}>Delivering To</Text>
        <View style={reviewStyles.card}>
          <Text style={reviewStyles.name}>{address.fullName}</Text>
          <Text style={reviewStyles.detail}>{address.phone}</Text>
          <Text style={reviewStyles.detail}>
            {address.street}, {address.city}, {address.state} - {address.pincode}
          </Text>
        </View>
      </View>

      {/* Payment */}
      <View style={reviewStyles.section}>
        <Text style={reviewStyles.sectionTitle}>Payment Method</Text>
        <View style={reviewStyles.card}>
          <Text style={reviewStyles.detail}>
            {PAYMENT_METHODS.find(m => m.id === paymentMethod)?.icon}{' '}
            {PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label}
          </Text>
        </View>
      </View>

      {/* Items */}
      <View style={reviewStyles.section}>
        <Text style={reviewStyles.sectionTitle}>Items ({items.length})</Text>
        {items.map(item => (
          <View key={item._id} style={reviewStyles.itemRow}>
            <Text style={reviewStyles.itemName} numberOfLines={1}>
              {item.product.name}
            </Text>
            <Text style={reviewStyles.itemQty}>x{item.quantity}</Text>
            <Text style={reviewStyles.itemPrice}>
              ₹{((item.product.discountPrice ?? item.product.price) * item.quantity).toLocaleString()}
            </Text>
          </View>
        ))}
      </View>

      {/* Price Breakdown */}
      <View style={reviewStyles.section}>
        <Text style={reviewStyles.sectionTitle}>Price Breakdown</Text>
        <View style={reviewStyles.card}>
          {[
            { label: 'Subtotal', value: `₹₹{subtotal.toLocaleString()}` },
            { label: 'Shipping', value: shipping === 0 ? 'FREE' : `₹₹{shipping}` },
            { label: 'Tax (18% GST)', value: `₹₹{tax.toLocaleString()}` },
          ].map(row => (
            <View key={row.label} style={reviewStyles.priceRow}>
              <Text style={reviewStyles.priceLabel}>{row.label}</Text>
              <Text style={[
                reviewStyles.priceValue,
                row.value === 'FREE' && { color: Colors.success },
              ]}>
                {row.value}
              </Text>
            </View>
          ))}
          <View style={reviewStyles.divider} />
          <View style={reviewStyles.priceRow}>
            <Text style={reviewStyles.totalLabel}>Total</Text>
            <Text style={reviewStyles.totalValue}>₹{total.toLocaleString()}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// ── Main Screen ──────────────────────────────────────────────────────────────
export default function CheckoutScreen({ navigation }: Props) {
  const [step, setStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [placing, setPlacing] = useState(false);

  const { items, totalPrice, clearCart } = useCartStore();

  const subtotal = totalPrice();
  const shipping = subtotal >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_CHARGE;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + shipping + tax;

  const { data: addressData, isLoading: addrLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => apiClient.get(ENDPOINTS.ADDRESSES).then(r => r.data),
  });

  const addresses: Address[] = addressData?.addresses ?? [];

  // Auto-select default address
  React.useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddr = addresses.find(a => a.isDefault) ?? addresses[0];
      setSelectedAddress(defaultAddr);
    }
  }, [addresses]);

  const handleNext = () => {
    if (step === 0 && !selectedAddress) {
      Alert.alert('Select Address', 'Please select a delivery address');
      return;
    }
    if (step < 2) setStep(s => s + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1);
    else navigation.goBack();
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return;
    try {
      setPlacing(true);
      const orderItems = items.map(i => ({
        product: i.product._id,
        quantity: i.quantity,
        price: i.product.discountPrice ?? i.product.price,
        variant: i.variant?._id,
      }));

      const { data } = await apiClient.post(ENDPOINTS.ORDERS, {
        items: orderItems,
        shippingAddress: selectedAddress,
        paymentMethod: selectedPayment,
        subtotal,
        shipping,
        tax,
        total,
      });

      clearCart();
      navigation.replace('OrderSuccess', { orderId: data.order._id });
    } catch (error: any) {
      Alert.alert('Order Failed', error.response?.data?.message ?? 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Step Indicator */}
      <StepIndicator step={step} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Step 0 — Address */}
        {step === 0 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Select Delivery Address</Text>

            {addrLoading ? (
              <ActivityIndicator color={Colors.primary} style={styles.loader} />
            ) : addresses.length === 0 ? (
              <View style={styles.noAddress}>
                <Text style={styles.noAddressText}>No saved addresses</Text>
                <TouchableOpacity style={styles.addAddrBtn}>
                  <Text style={styles.addAddrText}>+ Add New Address</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {addresses.map(addr => (
                  <AddressCard
                    key={addr._id}
                    address={addr}
                    selected={selectedAddress?._id === addr._id}
                    onSelect={() => setSelectedAddress(addr)}
                  />
                ))}
                <TouchableOpacity style={styles.addAddrBtn}>
                  <Text style={styles.addAddrText}>+ Add New Address</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {/* Step 1 — Payment */}
        {step === 1 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Select Payment Method</Text>
            {PAYMENT_METHODS.map(method => (
              <PaymentCard
                key={method.id}
                method={method}
                selected={selectedPayment === method.id}
                onSelect={() => setSelectedPayment(method.id)}
              />
            ))}

            {/* Price Summary */}
            <View style={styles.miniSummary}>
              <Text style={styles.miniSummaryTitle}>Order Total</Text>
              {[
                { label: 'Subtotal', value: `₹₹{subtotal.toLocaleString()}` },
                { label: 'Shipping', value: shipping === 0 ? 'FREE' : `₹₹{shipping}` },
                { label: 'Tax', value: `₹₹{tax.toLocaleString()}` },
              ].map(row => (
                <View key={row.label} style={styles.miniRow}>
                  <Text style={styles.miniLabel}>{row.label}</Text>
                  <Text style={[
                    styles.miniValue,
                    row.value === 'FREE' && { color: Colors.success },
                  ]}>
                    {row.value}
                  </Text>
                </View>
              ))}
              <View style={styles.miniDivider} />
              <View style={styles.miniRow}>
                <Text style={styles.miniTotal}>Total</Text>
                <Text style={styles.miniTotalValue}>₹{total.toLocaleString()}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Step 2 — Review */}
        {step === 2 && selectedAddress && (
          <OrderReview
            items={items}
            address={selectedAddress}
            paymentMethod={selectedPayment}
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={total}
          />
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>
            {step === 2 ? 'Final Total' : 'Order Total'}
          </Text>
          <Text style={styles.totalValue}>₹{total.toLocaleString()}</Text>
        </View>

        {step < 2 ? (
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextText}>
              {step === 0 ? 'CONTINUE TO PAYMENT' : 'REVIEW ORDER'}
            </Text>
            <Text style={styles.nextArrow}>→</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.placeBtn, placing && styles.btnDisabled]}
            onPress={handlePlaceOrder}
            disabled={placing}>
            {placing ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <>
                <Text style={styles.placeText}>PLACE ORDER</Text>
                <Text style={styles.nextArrow}>→</Text>
              </>
            )}
          </TouchableOpacity>
        )}
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
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'center',
  },
  backText: { fontSize: 20, color: Colors.black },
  headerTitle: { ...Typography.h4, color: Colors.black },
  scroll: { paddingBottom: 40 },
  stepContent: { padding: Spacing.lg, gap: Spacing.md },
  stepTitle: { ...Typography.h4, color: Colors.black, marginBottom: 4 },
  loader: { marginTop: Spacing.xl },
  noAddress: { alignItems: 'center', paddingVertical: Spacing.xl },
  noAddressText: { ...Typography.body1, color: Colors.text.secondary, marginBottom: 16 },
  addAddrBtn: {
    borderWidth: 1.5, borderColor: Colors.primary,
    borderStyle: 'dashed', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center',
  },
  addAddrText: { ...Typography.body1, color: Colors.primary, fontWeight: '600' },
  miniSummary: {
    backgroundColor: Colors.white, borderRadius: 16,
    padding: Spacing.md, marginTop: Spacing.md,
  },
  miniSummaryTitle: { ...Typography.h5, color: Colors.black, marginBottom: 12 },
  miniRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: 8,
  },
  miniLabel: { ...Typography.body2, color: Colors.text.secondary },
  miniValue: { ...Typography.body2, color: Colors.black, fontWeight: '600' },
  miniDivider: { height: 1, backgroundColor: Colors.border, marginVertical: 8 },
  miniTotal: { ...Typography.h5, color: Colors.black },
  miniTotalValue: { ...Typography.h4, color: Colors.black },
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
  nextBtn: {
    backgroundColor: Colors.primary, borderRadius: 14,
    paddingVertical: 16, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  nextText: { ...Typography.button, color: Colors.white, letterSpacing: 1.5 },
  nextArrow: { fontSize: 18, color: Colors.white },
  placeBtn: {
    backgroundColor: Colors.black, borderRadius: 14,
    paddingVertical: 16, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  placeText: { ...Typography.button, color: Colors.white, letterSpacing: 1.5 },
  btnDisabled: { opacity: 0.6 },
});

const stepStyles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderColor: Colors.border,
  },
  item: { alignItems: 'center', gap: 4 },
  circle: {
    width: 32, height: 32, borderRadius: 16,
    borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  circleActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '15' },
  circleCompleted: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  number: { ...Typography.body2, color: Colors.text.muted, fontWeight: '700' },
  numberActive: { color: Colors.primary },
  checkmark: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  label: { ...Typography.caption, color: Colors.text.muted },
  labelActive: { color: Colors.primary, fontWeight: '700' },
  line: { flex: 1, height: 2, backgroundColor: Colors.border, marginBottom: 16 },
  lineCompleted: { backgroundColor: Colors.primary },
});

const addrStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white, borderRadius: 16,
    padding: Spacing.md, borderWidth: 2, borderColor: Colors.border,
  },
  cardSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary + '08' },
  header: { marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  radio: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 2, borderColor: Colors.border,
  },
  radioActive: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  name: { ...Typography.body1, color: Colors.black, fontWeight: '700', flex: 1 },
  defaultBadge: {
    backgroundColor: Colors.primary + '20', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  defaultText: { ...Typography.caption, color: Colors.primary, fontWeight: '700' },
  phone: { ...Typography.body2, color: Colors.text.secondary, marginBottom: 4 },
  address: { ...Typography.body2, color: Colors.text.secondary, lineHeight: 20 },
});

const payStyles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: 16,
    padding: Spacing.md, borderWidth: 2,
    borderColor: Colors.border, gap: 14,
  },
  cardSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary + '08' },
  icon: { fontSize: 24 },
  label: { ...Typography.body1, color: Colors.black, flex: 1 },
  labelSelected: { color: Colors.primary, fontWeight: '600' },
  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: Colors.border,
  },
  radioActive: { borderColor: Colors.primary, backgroundColor: Colors.primary },
});

const reviewStyles = StyleSheet.create({
  container: { padding: Spacing.lg, gap: Spacing.md },
  section: { gap: 10 },
  sectionTitle: { ...Typography.h5, color: Colors.black },
  card: {
    backgroundColor: Colors.white, borderRadius: 16,
    padding: Spacing.md,
  },
  name: { ...Typography.body1, color: Colors.black, fontWeight: '700', marginBottom: 4 },
  detail: { ...Typography.body2, color: Colors.text.secondary, lineHeight: 20 },
  itemRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 8, borderBottomWidth: 1, borderColor: Colors.border,
    gap: 8,
  },
  itemName: { ...Typography.body2, color: Colors.black, flex: 1 },
  itemQty: { ...Typography.body2, color: Colors.text.secondary },
  itemPrice: { ...Typography.body2, color: Colors.black, fontWeight: '600' },
  priceRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: { ...Typography.body2, color: Colors.text.secondary },
  priceValue: { ...Typography.body2, color: Colors.black, fontWeight: '600' },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 8 },
  totalLabel: { ...Typography.h5, color: Colors.black },
  totalValue: { ...Typography.h4, color: Colors.black },
});