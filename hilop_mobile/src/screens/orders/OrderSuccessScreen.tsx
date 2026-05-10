import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { CartStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../theme';
import { apiClient } from '../../services/api/client';
import { ENDPOINTS } from '../../constants/api';
import { Order } from '../../types';

type Props = {
  navigation: NativeStackNavigationProp<CartStackParamList, 'OrderSuccess'>;
  route: RouteProp<CartStackParamList, 'OrderSuccess'>;
};

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];

const STATUS_COLORS: Record<string, string> = {
  pending: '#F4A261',
  processing: '#4CC9F0',
  shipped: '#7209B7',
  delivered: Colors.success,
  cancelled: Colors.error,
};

function TrackingTimeline({ status }: { status: string }) {
  if (status === 'cancelled') {
    return (
      <View style={timelineStyles.cancelled}>
        <Text style={timelineStyles.cancelledText}>❌ Order Cancelled</Text>
      </View>
    );
  }

  const currentStep = STATUS_STEPS.indexOf(status);

  return (
    <View style={timelineStyles.container}>
      {STATUS_STEPS.map((step, i) => {
        const done = i <= currentStep;
        const active = i === currentStep;
        return (
          <View key={step} style={timelineStyles.row}>
            <View style={timelineStyles.left}>
              <View style={[
                timelineStyles.dot,
                done && timelineStyles.dotDone,
                active && timelineStyles.dotActive,
              ]}>
                <Text style={timelineStyles.dotText}>{done ? '✓' : ''}</Text>
              </View>
              {i < STATUS_STEPS.length - 1 && (
                <View style={[timelineStyles.line, done && timelineStyles.lineDone]} />
              )}
            </View>
            <View style={timelineStyles.info}>
              <Text style={[timelineStyles.stepLabel, done && timelineStyles.stepLabelDone]}>
                {step.charAt(0).toUpperCase() + step.slice(1)}
              </Text>
              {active && (
                <Text style={timelineStyles.activeLabel}>Current Status</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

export default function OrderDetailScreen({ navigation, route }: Props) {
  const { orderId } = route.params;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => apiClient.get(ENDPOINTS.ORDER_DETAIL(orderId)).then(r => r.data),
  });

  const cancelMutation = useMutation({
    mutationFn: () =>
      apiClient.patch(`${ENDPOINTS.ORDER_DETAIL(orderId)}/cancel`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      Alert.alert('Success', 'Order cancelled successfully');
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.message ?? 'Failed to cancel order');
    },
  });

  const handleCancel = () => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => cancelMutation.mutate(),
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const order: Order = data?.order;
  if (!order) return null;

  const canCancel = ['pending', 'processing'].includes(order.status);
  const statusColor = STATUS_COLORS[order.status] ?? Colors.text.secondary;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Order ID & Status */}
        <View style={styles.section}>
          <View style={styles.orderIdRow}>
            <View>
              <Text style={styles.orderIdLabel}>ORDER ID</Text>
              <Text style={styles.orderId}>#{order._id.slice(-8).toUpperCase()}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
              <Text style={[styles.statusText, { color: statusColor }]}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Text>
            </View>
          </View>
          <Text style={styles.orderDate}>
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </Text>
        </View>

        {/* Tracking */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Tracking</Text>
          <TrackingTimeline status={order.status} />
        </View>

        {/* Items */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Items Ordered</Text>
          {order.items.map((item, i) => (
            <View
              key={i}
              style={[styles.itemRow, i < order.items.length - 1 && styles.itemBorder]}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemBrand}>{item.product.brand}</Text>
                <Text style={styles.itemName} numberOfLines={2}>{item.product.name}</Text>
                {item.variant && (
                  <Text style={styles.itemVariant}>
                    {item.variant.name}: {item.variant.value}
                  </Text>
                )}
                <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>
                ₹{((item.product.discountPrice ?? item.product.price) * item.quantity).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>

        {/* Delivery Address */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Delivery Address</Text>
          <Text style={styles.addrName}>{order.shippingAddress.fullName}</Text>
          <Text style={styles.addrDetail}>{order.shippingAddress.phone}</Text>
          <Text style={styles.addrDetail}>
            {order.shippingAddress.street},{'\n'}
            {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
            {order.shippingAddress.pincode}
          </Text>
        </View>

        {/* Payment */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment</Text>
          <View style={styles.payRow}>
            <Text style={styles.payLabel}>Method</Text>
            <Text style={styles.payValue}>{order.paymentMethod}</Text>
          </View>
        </View>

        {/* Price Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Price Details</Text>
          {[
            { label: 'Subtotal', value: `₹${order.totalPrice.toLocaleString()}` },
            { label: 'Shipping', value: 'FREE' },
            { label: 'Tax (18% GST)', value: 'Included' },
          ].map(row => (
            <View key={row.label} style={styles.priceRow}>
              <Text style={styles.priceLabel}>{row.label}</Text>
              <Text style={[
                styles.priceValue,
                row.value === 'FREE' && { color: Colors.success },
              ]}>
                {row.value}
              </Text>
            </View>
          ))}
          <View style={styles.priceDivider} />
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <Text style={styles.totalValue}>₹{order.totalPrice.toLocaleString()}</Text>
          </View>
        </View>

        {/* Cancel Button */}
        {canCancel && (
          <TouchableOpacity
            style={[styles.cancelBtn, cancelMutation.isPending && styles.btnDisabled]}
            onPress={handleCancel}
            disabled={cancelMutation.isPending}>
            {cancelMutation.isPending ? (
              <ActivityIndicator color={Colors.error} />
            ) : (
              <Text style={styles.cancelText}>CANCEL ORDER</Text>
            )}
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
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
  scroll: { padding: Spacing.lg, gap: Spacing.md },
  section: { marginBottom: Spacing.sm },
  orderIdRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 4,
  },
  orderIdLabel: { ...Typography.caption, color: Colors.text.muted, letterSpacing: 2, marginBottom: 2 },
  orderId: { ...Typography.h4, color: Colors.black, letterSpacing: 1 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100 },
  statusText: { ...Typography.label, fontWeight: '700' },
  orderDate: { ...Typography.body2, color: Colors.text.secondary },
  card: {
    backgroundColor: Colors.white, borderRadius: 16,
    padding: Spacing.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  cardTitle: { ...Typography.h5, color: Colors.black, marginBottom: 16 },
  itemRow: { flexDirection: 'row', paddingVertical: 12, gap: 12 },
  itemBorder: { borderBottomWidth: 1, borderColor: Colors.border },
  itemInfo: { flex: 1 },
  itemBrand: { ...Typography.caption, color: Colors.primary, letterSpacing: 1, marginBottom: 2 },
  itemName: { ...Typography.body2, color: Colors.black, fontWeight: '600', marginBottom: 4 },
  itemVariant: { ...Typography.caption, color: Colors.text.secondary, marginBottom: 4 },
  itemQty: { ...Typography.caption, color: Colors.text.muted },
  itemPrice: { ...Typography.h5, color: Colors.black },
  addrName: { ...Typography.body1, color: Colors.black, fontWeight: '700', marginBottom: 4 },
  addrDetail: { ...Typography.body2, color: Colors.text.secondary, lineHeight: 22, marginBottom: 2 },
  payRow: { flexDirection: 'row', justifyContent: 'space-between' },
  payLabel: { ...Typography.body2, color: Colors.text.secondary },
  payValue: { ...Typography.body2, color: Colors.black, fontWeight: '600', textTransform: 'capitalize' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  priceLabel: { ...Typography.body2, color: Colors.text.secondary },
  priceValue: { ...Typography.body2, color: Colors.black, fontWeight: '600' },
  priceDivider: { height: 1, backgroundColor: Colors.border, marginVertical: 10 },
  totalLabel: { ...Typography.h5, color: Colors.black },
  totalValue: { ...Typography.h4, color: Colors.black },
  cancelBtn: {
    borderWidth: 2, borderColor: Colors.error,
    borderRadius: 14, paddingVertical: 16, alignItems: 'center',
  },
  cancelText: { ...Typography.button, color: Colors.error, letterSpacing: 1.5 },
  btnDisabled: { opacity: 0.6 },
});

const timelineStyles = StyleSheet.create({
  container: { gap: 0 },
  row: { flexDirection: 'row', gap: 16 },
  left: { alignItems: 'center', width: 32 },
  dot: {
    width: 32, height: 32, borderRadius: 16,
    borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  dotDone: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dotActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '20' },
  dotText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  line: { width: 2, flex: 1, backgroundColor: Colors.border, minHeight: 32 },
  lineDone: { backgroundColor: Colors.primary },
  info: { flex: 1, paddingVertical: 6, paddingBottom: 24 },
  stepLabel: { ...Typography.body2, color: Colors.text.muted, fontWeight: '600' },
  stepLabelDone: { color: Colors.black },
  activeLabel: { ...Typography.caption, color: Colors.primary, marginTop: 2 },
  cancelled: {
    backgroundColor: Colors.error + '15', borderRadius: 12,
    padding: Spacing.md, alignItems: 'center',
  },
  cancelledText: { ...Typography.body1, color: Colors.error, fontWeight: '700' },
});