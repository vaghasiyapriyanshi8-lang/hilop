import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../theme';
import { apiClient } from '../../services/api/client';
import { ENDPOINTS } from '../../constants/api';
import { Order } from '../../types';
import { formatCurrency } from '../../utils/format';

type Props = {
  navigation: NativeStackNavigationProp<ProfileStackParamList, 'OrderHistory'>;
};

const STATUS_COLORS: Record<string, string> = {
  pending: '#F4A261',
  processing: '#4CC9F0',
  shipped: '#7209B7',
  delivered: Colors.success,
  cancelled: Colors.error,
};

const STATUS_ICONS: Record<string, string> = {
  pending: '🕐',
  processing: '⚙️',
  shipped: '🚚',
  delivered: '✅',
  cancelled: '❌',
};

const FILTERS = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

function OrderCard({ order, onPress }: { order: Order; onPress: () => void }) {
  const statusColor = STATUS_COLORS[order.status] ?? Colors.text.secondary;
  const statusIcon = STATUS_ICONS[order.status] ?? '📦';
  const firstItem = order.items[0];

  return (
    <TouchableOpacity style={cardStyles.container} onPress={onPress} activeOpacity={0.85}>
      <View style={cardStyles.header}>
        <View>
          <Text style={cardStyles.orderId}>#{order._id.slice(-8).toUpperCase()}</Text>
          <Text style={cardStyles.date}>
            {new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
          </Text>
        </View>
        <View style={[cardStyles.statusBadge, { backgroundColor: statusColor + '20' }]}>
          <Text style={cardStyles.statusIcon}>{statusIcon}</Text>
          <Text style={[cardStyles.statusText, { color: statusColor }]}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Text>
        </View>
      </View>
      <View style={cardStyles.divider} />
      <View style={cardStyles.itemPreview}>
        <Text style={cardStyles.itemName} numberOfLines={1}>
          {firstItem?.product?.name ?? 'Product'}
        </Text>
        {order.items.length > 1 && (
          <Text style={cardStyles.moreItems}>
            +{order.items.length - 1} more item{order.items.length > 2 ? 's' : ''}
          </Text>
        )}
      </View>
      <View style={cardStyles.footer}>
        <View>
          <Text style={cardStyles.totalLabel}>Order Total</Text>
          <Text style={cardStyles.totalValue}>{formatCurrency(order.totalPrice)}</Text>
        </View>
        <View style={cardStyles.arrowBox}>
          <Text style={cardStyles.arrow}>→</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function EmptyOrders() {
  return (
    <View style={emptyStyles.container}>
      <Text style={emptyStyles.icon}>📦</Text>
      <Text style={emptyStyles.title}>No Orders Yet</Text>
      <Text style={emptyStyles.subtitle}>
        Your order history will appear here once you make a purchase
      </Text>
    </View>
  );
}

export default function OrderHistoryScreen({ navigation }: Props) {
  const [activeFilter, setActiveFilter] = useState('All');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: () => apiClient.get(ENDPOINTS.ORDERS).then(r => r.data),
  });

  const allOrders: Order[] = data?.orders ?? [];
  const filtered = activeFilter === 'All'
    ? allOrders
    : allOrders.filter(o => o.status.toLowerCase() === activeFilter.toLowerCase());

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.filterWrapper}>
        <FlatList
          horizontal
          data={FILTERS}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterTab, activeFilter === item && styles.filterTabActive]}
              onPress={() => setActiveFilter(item)}>
              <Text style={[styles.filterText, activeFilter === item && styles.filterTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : filtered.length === 0 ? (
        <EmptyOrders />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isLoading}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onPress={() => navigation.navigate('OrderDetail', { orderId: item._id })}
            />
          )}
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
  filterWrapper: { backgroundColor: Colors.white, borderBottomWidth: 1, borderColor: Colors.border },
  filterList: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, gap: 8 },
  filterTab: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 100, backgroundColor: Colors.background,
    borderWidth: 1, borderColor: Colors.border,
  },
  filterTabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { ...Typography.body2, color: Colors.text.secondary, fontWeight: '600' },
  filterTextActive: { color: Colors.white },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: Spacing.lg, gap: Spacing.md },
});

const cardStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white, borderRadius: 16,
    padding: Spacing.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 12,
  },
  orderId: { ...Typography.h5, color: Colors.black, marginBottom: 2 },
  date: { ...Typography.caption, color: Colors.text.muted },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center',
    gap: 4, paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 100,
  },
  statusIcon: { fontSize: 12 },
  statusText: { ...Typography.caption, fontWeight: '700' },
  divider: { height: 1, backgroundColor: Colors.border, marginBottom: 12 },
  itemPreview: { marginBottom: 12 },
  itemName: { ...Typography.body2, color: Colors.black, fontWeight: '600' },
  moreItems: { ...Typography.caption, color: Colors.text.muted, marginTop: 2 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { ...Typography.caption, color: Colors.text.muted, marginBottom: 2 },
  totalValue: { ...Typography.h5, color: Colors.black },
  arrowBox: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center',
  },
  arrow: { fontSize: 16, color: Colors.primary },
});

const emptyStyles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  icon: { fontSize: 64, marginBottom: 20 },
  title: { ...Typography.h3, color: Colors.black, marginBottom: 8 },
  subtitle: { ...Typography.body1, color: Colors.text.secondary, textAlign: 'center', lineHeight: 24 },
});