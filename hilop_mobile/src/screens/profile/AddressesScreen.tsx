import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Modal, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../theme';
import { apiClient } from '../../services/api/client';
import { ENDPOINTS } from '../../constants/api';
import { Address } from '../../types';

type Props = {
  navigation: NativeStackNavigationProp<ProfileStackParamList, 'Addresses'>;
};

const EMPTY_ADDRESS: Omit<Address, '_id'> = {
  fullName: '', phone: '', street: '',
  city: '', state: '', pincode: '',
  country: 'India', isDefault: false,
};

function AddressCard({
  address, onEdit, onDelete, onSetDefault,
}: {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}) {
  return (
    <View style={cardStyles.container}>
      <View style={cardStyles.header}>
        <View style={cardStyles.nameRow}>
          <Text style={cardStyles.name}>{address.fullName}</Text>
          {address.isDefault && (
            <View style={cardStyles.defaultBadge}>
              <Text style={cardStyles.defaultText}>Default</Text>
            </View>
          )}
        </View>
        <Text style={cardStyles.phone}>{address.phone}</Text>
      </View>
      <Text style={cardStyles.address}>
        {address.street},{'\n'}
        {address.city}, {address.state} - {address.pincode},{'\n'}
        {address.country}
      </Text>
      <View style={cardStyles.actions}>
        {!address.isDefault && (
          <TouchableOpacity style={cardStyles.actionBtn} onPress={onSetDefault}>
            <Text style={cardStyles.actionText}>Set Default</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={cardStyles.actionBtn} onPress={onEdit}>
          <Text style={cardStyles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[cardStyles.actionBtn, cardStyles.deleteBtn]}
          onPress={onDelete}>
          <Text style={cardStyles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function AddressModal({
  visible, address, onClose, onSave, loading,
}: {
  visible: boolean;
  address: Partial<Address>;
  onClose: () => void;
  onSave: (addr: Partial<Address>) => void;
  loading: boolean;
}) {
  const [form, setForm] = useState<Partial<Address>>(address);
  useEffect(() => setForm(address), [address]);

  const update = (key: keyof Address, value: string | boolean) =>
    setForm(f => ({ ...f, [key]: value }));

  const fields: Array<{
    key: keyof Address;
    label: string;
    placeholder: string;
    type?: string;
  }> = [
    { key: 'fullName', label: 'FULL NAME', placeholder: 'John Doe' },
    { key: 'phone', label: 'PHONE', placeholder: '+91 00000 00000', type: 'phone-pad' },
    { key: 'street', label: 'STREET ADDRESS', placeholder: '123, Main Street' },
    { key: 'city', label: 'CITY', placeholder: 'Mumbai' },
    { key: 'state', label: 'STATE', placeholder: 'Maharashtra' },
    { key: 'pincode', label: 'PINCODE', placeholder: '400001', type: 'number-pad' },
  ];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={modalStyles.container}>
        <View style={modalStyles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={modalStyles.cancel}>Cancel</Text>
          </TouchableOpacity>
          <Text style={modalStyles.title}>
            {address._id ? 'Edit Address' : 'New Address'}
          </Text>
          <TouchableOpacity onPress={() => onSave(form)} disabled={loading}>
            {loading ? (
              <ActivityIndicator color={Colors.primary} size="small" />
            ) : (
              <Text style={modalStyles.save}>Save</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={modalStyles.scroll}>
          {fields.map(field => (
            <View key={field.key} style={modalStyles.fieldGroup}>
              <Text style={modalStyles.label}>{field.label}</Text>
              <TextInput
                style={modalStyles.input}
                value={form[field.key] as string ?? ''}
                onChangeText={v => update(field.key, v)}
                placeholder={field.placeholder}
                placeholderTextColor={Colors.text.muted}
                keyboardType={field.type as any ?? 'default'}
              />
            </View>
          ))}

          <TouchableOpacity
            style={modalStyles.defaultRow}
            onPress={() => update('isDefault', !form.isDefault)}>
            <View style={[modalStyles.checkbox, form.isDefault && modalStyles.checkboxActive]}>
              {form.isDefault && <Text style={modalStyles.checkmark}>✓</Text>}
            </View>
            <Text style={modalStyles.defaultLabel}>Set as default address</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

import { useEffect } from 'react';

export default function AddressesScreen({ navigation }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Partial<Address>>(EMPTY_ADDRESS);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => apiClient.get(ENDPOINTS.ADDRESSES).then(r => r.data),
  });

  const saveMutation = useMutation({
    mutationFn: (addr: Partial<Address>) =>
      addr._id
        ? apiClient.put(`${ENDPOINTS.ADDRESSES}/${addr._id}`, addr).then(r => r.data)
        : apiClient.post(ENDPOINTS.ADDRESSES, addr).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      setModalVisible(false);
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.message ?? 'Failed to save address');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(`${ENDPOINTS.ADDRESSES}/${id}`).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.message ?? 'Failed to delete address');
    },
  });

  const defaultMutation = useMutation({
    mutationFn: (id: string) =>
      apiClient.patch(`${ENDPOINTS.ADDRESSES}/${id}/default`).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });

  const addresses: Address[] = data?.addresses ?? [];

  const handleAdd = () => {
    setEditingAddress({ ...EMPTY_ADDRESS });
    setModalVisible(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setModalVisible(true);
  };

  const handleDelete = (address: Address) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(address._id!),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Addresses</Text>
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : addresses.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyIcon}>📍</Text>
          <Text style={styles.emptyTitle}>No Saved Addresses</Text>
          <Text style={styles.emptySubtitle}>Add your delivery address to get started</Text>
          <TouchableOpacity style={styles.addFirstBtn} onPress={handleAdd}>
            <Text style={styles.addFirstText}>ADD ADDRESS</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={item => item._id!}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <AddressCard
              address={item}
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDelete(item)}
              onSetDefault={() => defaultMutation.mutate(item._id!)}
            />
          )}
        />
      )}

      <AddressModal
        visible={modalVisible}
        address={editingAddress}
        onClose={() => setModalVisible(false)}
        onSave={addr => saveMutation.mutate(addr)}
        loading={saveMutation.isPending}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
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
  addBtn: {
    paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: Colors.primary, borderRadius: 100,
  },
  addBtnText: { ...Typography.label, color: Colors.white },
  list: { padding: Spacing.lg, gap: Spacing.md },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { ...Typography.h4, color: Colors.black, marginBottom: 8 },
  emptySubtitle: {
    ...Typography.body2, color: Colors.text.secondary,
    textAlign: 'center', marginBottom: 24,
  },
  addFirstBtn: {
    backgroundColor: Colors.primary, borderRadius: 12,
    paddingHorizontal: 32, paddingVertical: 14,
  },
  addFirstText: { ...Typography.button, color: Colors.white, letterSpacing: 1.5 },
});

const cardStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white, borderRadius: 16, padding: Spacing.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  header: { marginBottom: 8 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  name: { ...Typography.body1, color: Colors.black, fontWeight: '700' },
  defaultBadge: {
    backgroundColor: Colors.primary + '20', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  defaultText: { ...Typography.caption, color: Colors.primary, fontWeight: '700' },
  phone: { ...Typography.body2, color: Colors.text.secondary },
  address: { ...Typography.body2, color: Colors.text.secondary, lineHeight: 22, marginBottom: 12 },
  actions: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  actionBtn: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 100, borderWidth: 1, borderColor: Colors.border,
  },
  actionText: { ...Typography.caption, color: Colors.primary, fontWeight: '600' },
  deleteBtn: { borderColor: Colors.error + '40' },
  deleteText: { ...Typography.caption, color: Colors.error, fontWeight: '600' },
});

const modalStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderColor: Colors.border,
  },
  cancel: { ...Typography.body1, color: Colors.text.secondary },
  title: { ...Typography.h5, color: Colors.black },
  save: { ...Typography.body1, color: Colors.primary, fontWeight: '700' },
  scroll: { padding: Spacing.lg, gap: Spacing.md },
  fieldGroup: {},
  label: { ...Typography.label, color: Colors.text.secondary, letterSpacing: 1, marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    ...Typography.body1, color: Colors.black, backgroundColor: Colors.background,
  },
  defaultRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  checkbox: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  checkmark: { color: Colors.white, fontSize: 14, fontWeight: '700' },
  defaultLabel: { ...Typography.body1, color: Colors.black },
});