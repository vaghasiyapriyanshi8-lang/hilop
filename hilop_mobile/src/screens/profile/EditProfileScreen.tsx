import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, ActivityIndicator, Alert, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../theme';
import { apiClient } from '../../services/api/client';
import { ENDPOINTS } from '../../constants/api';
import { useAuthStore } from '../../store/slices/authStore';

type Props = {
  navigation: NativeStackNavigationProp<ProfileStackParamList, 'EditProfile'>;
};

export default function EditProfileScreen({ navigation }: Props) {
  const { user, updateUser } = useAuthStore();
  const queryClient = useQueryClient();

  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [activeSection, setActiveSection] = useState<'profile' | 'password'>('profile');

  const profileMutation = useMutation({
    mutationFn: (payload: { name: string; phone: string }) =>
      apiClient.put(ENDPOINTS.UPDATE_PROFILE, payload).then(r => r.data),
    onSuccess: data => {
      updateUser(data.user);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.message ?? 'Update failed');
    },
  });

  const passwordMutation = useMutation({
    mutationFn: (payload: { currentPassword: string; newPassword: string }) =>
      apiClient.put('/users/change-password', payload).then(r => r.data),
    onSuccess: () => {
      Alert.alert('Success', 'Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      navigation.goBack();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.message ?? 'Failed to change password');
    },
  });

  const handleSaveProfile = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    profileMutation.mutate({ name: name.trim(), phone: phone.trim() });
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword) {
      Alert.alert('Error', 'Please fill in both password fields');
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert('Error', 'New password must be at least 8 characters');
      return;
    }
    passwordMutation.mutate({ currentPassword, newPassword });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tab Toggle */}
      <View style={styles.tabs}>
        {(['profile', 'password'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeSection === tab && styles.tabActive]}
            onPress={() => setActiveSection(tab)}>
            <Text style={[styles.tabText, activeSection === tab && styles.tabTextActive]}>
              {tab === 'profile' ? 'Profile Info' : 'Change Password'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {activeSection === 'profile' ? (
          <>
            {/* Avatar */}
            <View style={styles.avatarSection}>
              {user?.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {user?.name?.charAt(0).toUpperCase() ?? 'U'}
                  </Text>
                </View>
              )}
              <TouchableOpacity style={styles.changeAvatarBtn}>
                <Text style={styles.changeAvatarText}>Change Photo</Text>
              </TouchableOpacity>
            </View>

            {/* Fields */}
            <View style={styles.form}>
              {[
                {
                  label: 'FULL NAME',
                  value: name,
                  setter: setName,
                  placeholder: 'Your full name',
                  type: 'default',
                  capitalize: 'words',
                },
                {
                  label: 'EMAIL',
                  value: user?.email ?? '',
                  setter: () => {},
                  placeholder: '',
                  type: 'email-address',
                  capitalize: 'none',
                  disabled: true,
                },
                {
                  label: 'PHONE',
                  value: phone,
                  setter: setPhone,
                  placeholder: '+91 00000 00000',
                  type: 'phone-pad',
                  capitalize: 'none',
                },
              ].map(field => (
                <View key={field.label} style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>{field.label}</Text>
                  <TextInput
                    style={[styles.input, field.disabled && styles.inputDisabled]}
                    value={field.value}
                    onChangeText={field.setter}
                    placeholder={field.placeholder}
                    placeholderTextColor={Colors.text.muted}
                    keyboardType={field.type as any}
                    autoCapitalize={field.capitalize as any}
                    editable={!field.disabled}
                  />
                  {field.disabled && (
                    <Text style={styles.disabledNote}>Email cannot be changed</Text>
                  )}
                </View>
              ))}

              <TouchableOpacity
                style={[styles.saveBtn, profileMutation.isPending && styles.btnDisabled]}
                onPress={handleSaveProfile}
                disabled={profileMutation.isPending}>
                {profileMutation.isPending ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={styles.saveBtnText}>SAVE CHANGES</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.form}>
            <Text style={styles.passwordNote}>
              Choose a strong password with at least 8 characters
            </Text>

            {[
              {
                label: 'CURRENT PASSWORD',
                value: currentPassword,
                setter: setCurrentPassword,
                show: showCurrent,
                toggle: () => setShowCurrent(v => !v),
              },
              {
                label: 'NEW PASSWORD',
                value: newPassword,
                setter: setNewPassword,
                show: showNew,
                toggle: () => setShowNew(v => !v),
              },
            ].map(field => (
              <View key={field.label} style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                <View style={styles.passwordRow}>
                  <TextInput
                    style={styles.passwordInput}
                    value={field.value}
                    onChangeText={field.setter}
                    placeholder="••••••••"
                    placeholderTextColor={Colors.text.muted}
                    secureTextEntry={!field.show}
                  />
                  <TouchableOpacity onPress={field.toggle}>
                    <Text style={styles.toggleText}>
                      {field.show ? 'Hide' : 'Show'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {newPassword.length > 0 && (
              <View style={styles.strengthBar}>
                {[1, 2, 3, 4].map(i => (
                  <View
                    key={i}
                    style={[
                      styles.strengthSegment,
                      newPassword.length >= i * 3 && styles.strengthSegmentFilled,
                      newPassword.length >= 12 && styles.strengthSegmentStrong,
                    ]}
                  />
                ))}
                <Text style={styles.strengthText}>
                  {newPassword.length < 8
                    ? 'Weak'
                    : newPassword.length < 12
                    ? 'Good'
                    : 'Strong'}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.saveBtn, passwordMutation.isPending && styles.btnDisabled]}
              onPress={handleChangePassword}
              disabled={passwordMutation.isPending}>
              {passwordMutation.isPending ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.saveBtnText}>CHANGE PASSWORD</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
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
  tabs: {
    flexDirection: 'row', backgroundColor: Colors.white,
    borderBottomWidth: 1, borderColor: Colors.border,
  },
  tab: {
    flex: 1, paddingVertical: 14, alignItems: 'center',
    borderBottomWidth: 2, borderColor: 'transparent',
  },
  tabActive: { borderColor: Colors.primary },
  tabText: { ...Typography.body2, color: Colors.text.muted, fontWeight: '600' },
  tabTextActive: { color: Colors.primary },
  scroll: { padding: Spacing.lg },
  avatarSection: { alignItems: 'center', marginBottom: Spacing.lg },
  avatar: {
    width: 100, height: 100, borderRadius: 50,
    borderWidth: 3, borderColor: Colors.primary,
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: Colors.primary, alignItems: 'center',
    justifyContent: 'center', marginBottom: 12,
  },
  avatarText: { fontSize: 40, color: Colors.white, fontWeight: '700' },
  changeAvatarBtn: {
    paddingHorizontal: 20, paddingVertical: 8,
    borderRadius: 100, borderWidth: 1.5, borderColor: Colors.primary,
  },
  changeAvatarText: { ...Typography.body2, color: Colors.primary, fontWeight: '600' },
  form: { gap: Spacing.md },
  fieldGroup: {},
  fieldLabel: {
    ...Typography.label, color: Colors.text.secondary,
    letterSpacing: 1, marginBottom: 6,
  },
  input: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    ...Typography.body1, color: Colors.black, backgroundColor: Colors.white,
  },
  inputDisabled: { backgroundColor: Colors.background, color: Colors.text.muted },
  disabledNote: { ...Typography.caption, color: Colors.text.muted, marginTop: 4 },
  passwordNote: {
    ...Typography.body2, color: Colors.text.secondary,
    marginBottom: 4, lineHeight: 20,
  },
  passwordRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border, borderRadius: 12,
    backgroundColor: Colors.white, paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1, paddingVertical: 14,
    ...Typography.body1, color: Colors.black,
  },
  toggleText: { ...Typography.label, color: Colors.primary },
  strengthBar: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: -8,
  },
  strengthSegment: {
    flex: 1, height: 4, borderRadius: 2, backgroundColor: Colors.border,
  },
  strengthSegmentFilled: { backgroundColor: Colors.warning },
  strengthSegmentStrong: { backgroundColor: Colors.success },
  strengthText: { ...Typography.caption, color: Colors.text.secondary, width: 40 },
  saveBtn: {
    backgroundColor: Colors.primary, borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', marginTop: Spacing.sm,
  },
  btnDisabled: { opacity: 0.6 },
  saveBtnText: { ...Typography.button, color: Colors.white, letterSpacing: 1.5 },
});