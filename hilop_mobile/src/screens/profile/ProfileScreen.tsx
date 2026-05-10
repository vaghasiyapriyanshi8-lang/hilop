import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../theme';
import { apiClient } from '../../services/api/client';
import { ENDPOINTS } from '../../constants/api';
import { useAuthStore } from '../../store/slices/authStore';

type Props = {
  navigation: NativeStackNavigationProp<ProfileStackParamList, 'ProfileScreen'>;
};

const MENU_ITEMS = [
  {
    group: 'Account',
    items: [
      { icon: '👤', label: 'Edit Profile', screen: 'EditProfile' },
      { icon: '📍', label: 'Saved Addresses', screen: 'Addresses' },
      { icon: '🔔', label: 'Notifications', screen: null },
    ],
  },
  {
    group: 'Orders',
    items: [
      { icon: '📦', label: 'Order History', screen: 'OrderHistory' },
      { icon: '↩️', label: 'Returns & Refunds', screen: null },
    ],
  },
  {
    group: 'Support',
    items: [
      { icon: '❓', label: 'Help & Support', screen: null },
      { icon: '⭐', label: 'Rate the App', screen: null },
      { icon: '📄', label: 'Privacy Policy', screen: null },
    ],
  },
];

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={statStyles.box}>
      <Text style={statStyles.value}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

function MenuItem({
  icon, label, onPress,
}: {
  icon: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={menuStyles.item} onPress={onPress} activeOpacity={0.7}>
      <View style={menuStyles.iconBox}>
        <Text style={menuStyles.icon}>{icon}</Text>
      </View>
      <Text style={menuStyles.label}>{label}</Text>
      <Text style={menuStyles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

export default function ProfileScreen({ navigation }: Props) {
  const { user, logout } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => apiClient.get(ENDPOINTS.PROFILE).then(r => r.data),
  });

  const { data: ordersData } = useQuery({
    queryKey: ['orders'],
    queryFn: () => apiClient.get(ENDPOINTS.ORDERS).then(r => r.data),
  });

  const profile = data?.user ?? user;
  const totalOrders = ordersData?.orders?.length ?? 0;
  const deliveredOrders = ordersData?.orders?.filter(
    (o: any) => o.status === 'delivered',
  ).length ?? 0;

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: logout },
      ],
    );
  };

  const handleMenuPress = (screen: string | null) => {
    if (!screen) {
      Alert.alert('Coming Soon', 'This feature will be available soon');
      return;
    }
    navigation.navigate(screen as any);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => Alert.alert('Settings', 'Coming soon')}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            {profile?.avatar ? (
              <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {profile?.name?.charAt(0).toUpperCase() ?? 'U'}
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.editAvatarBtn}
              onPress={() => navigation.navigate('EditProfile')}>
              <Text style={styles.editAvatarIcon}>✏️</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>{profile?.name ?? 'User'}</Text>
          <Text style={styles.email}>{profile?.email ?? ''}</Text>
          {profile?.phone && (
            <Text style={styles.phone}>{profile.phone}</Text>
          )}

          {/* Member Badge */}
          <View style={styles.memberBadge}>
            <Text style={styles.memberIcon}>👑</Text>
            <Text style={styles.memberText}>Hilop Premium Member</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatBox label="Total Orders" value={totalOrders} />
          <View style={styles.statDivider} />
          <StatBox label="Delivered" value={deliveredOrders} />
          <View style={styles.statDivider} />
          <StatBox label="Wishlist" value="0" />
        </View>

        {/* Menu Groups */}
        {MENU_ITEMS.map(group => (
          <View key={group.group} style={styles.menuGroup}>
            <Text style={styles.groupTitle}>{group.group}</Text>
            <View style={styles.menuCard}>
              {group.items.map((item, i) => (
                <React.Fragment key={item.label}>
                  <MenuItem
                    icon={item.icon}
                    label={item.label}
                    onPress={() => handleMenuPress(item.screen)}
                  />
                  {i < group.items.length - 1 && (
                    <View style={styles.menuDivider} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={styles.version}>Hilop v1.0.0</Text>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md, backgroundColor: Colors.white,
    borderBottomWidth: 1, borderColor: Colors.border,
  },
  headerTitle: { ...Typography.h3, color: Colors.black },
  settingsBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'center',
  },
  settingsIcon: { fontSize: 18 },
  profileCard: {
    backgroundColor: Colors.white, margin: Spacing.lg,
    borderRadius: 24, padding: Spacing.lg,
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 16, elevation: 4,
  },
  avatarWrapper: { position: 'relative', marginBottom: 16 },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    borderWidth: 3, borderColor: Colors.primary,
  },
  avatarPlaceholder: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: Colors.primary + '40',
  },
  avatarText: { fontSize: 36, color: Colors.white, fontWeight: '700' },
  editAvatarBtn: {
    position: 'absolute', bottom: 0, right: 0,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.white, alignItems: 'center',
    justifyContent: 'center', borderWidth: 2, borderColor: Colors.border,
  },
  editAvatarIcon: { fontSize: 12 },
  name: { ...Typography.h3, color: Colors.black, marginBottom: 4 },
  email: { ...Typography.body2, color: Colors.text.secondary, marginBottom: 2 },
  phone: { ...Typography.body2, color: Colors.text.secondary, marginBottom: 12 },
  memberBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.primary + '15', borderRadius: 100,
    paddingHorizontal: 14, paddingVertical: 6,
  },
  memberIcon: { fontSize: 14 },
  memberText: { ...Typography.caption, color: Colors.primary, fontWeight: '700', letterSpacing: 0.5 },
  statsRow: {
    flexDirection: 'row', backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg, borderRadius: 16,
    padding: Spacing.md, marginBottom: Spacing.lg,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  statDivider: { width: 1, backgroundColor: Colors.border },
  menuGroup: { marginHorizontal: Spacing.lg, marginBottom: Spacing.md },
  groupTitle: { ...Typography.label, color: Colors.text.muted, letterSpacing: 1, marginBottom: 8 },
  menuCard: {
    backgroundColor: Colors.white, borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  menuDivider: { height: 1, backgroundColor: Colors.border, marginLeft: 60 },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    marginHorizontal: Spacing.lg, backgroundColor: Colors.white,
    borderRadius: 16, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.error + '30',
    marginBottom: Spacing.md,
  },
  logoutIcon: { fontSize: 20 },
  logoutText: { ...Typography.body1, color: Colors.error, fontWeight: '700' },
  version: {
    ...Typography.caption, color: Colors.text.muted,
    textAlign: 'center', marginBottom: Spacing.sm,
  },
});

const statStyles = StyleSheet.create({
  box: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  value: { ...Typography.h3, color: Colors.black, marginBottom: 2 },
  label: { ...Typography.caption, color: Colors.text.muted },
});

const menuStyles = StyleSheet.create({
  item: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.md, gap: 14,
  },
  iconBox: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'center',
  },
  icon: { fontSize: 18 },
  label: { ...Typography.body1, color: Colors.black, flex: 1 },
  arrow: { fontSize: 22, color: Colors.text.muted },
});