import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../theme';
import { apiClient } from '../../services/api/client';
import { ENDPOINTS } from '../../constants/api';
import { useAuthStore } from '../../store/slices/authStore';

type Props = { navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'> };

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore(s => s.setAuth);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      setLoading(true);
      const { data } = await apiClient.post(ENDPOINTS.LOGIN, { email, password });
      setAuth(data.user, data.accessToken, data.refreshToken);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.brand}>HILOP</Text>
            <Text style={styles.tagline}>Luxury Timepieces</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                placeholderTextColor={Colors.text.muted}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>PASSWORD</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.text.muted}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Text style={styles.toggle}>{showPassword ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotRow}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.buttonText}>SIGN IN</Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerText}>
                Don't have an account?{' '}
                <Text style={styles.registerLink}>Create one</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: Colors.black },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.lg },
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: 40 },
  brand: {
    ...Typography.h1,
    color: Colors.white,
    letterSpacing: 12,
    fontSize: 36,
  },
  tagline: {
    ...Typography.caption,
    color: Colors.primary,
    letterSpacing: 4,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  form: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  title: { ...Typography.h2, color: Colors.black, marginBottom: 4 },
  subtitle: { ...Typography.body1, color: Colors.text.secondary, marginBottom: 28 },
  inputGroup: { marginBottom: Spacing.md },
  label: {
    ...Typography.label,
    color: Colors.text.secondary,
    marginBottom: 6,
    letterSpacing: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    ...Typography.body1,
    color: Colors.black,
    backgroundColor: Colors.background,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
  },
  passwordInput: { flex: 1, paddingVertical: 14, ...Typography.body1, color: Colors.black },
  toggle: { ...Typography.label, color: Colors.primary },
  forgotRow: { alignItems: 'flex-end', marginBottom: Spacing.lg },
  forgotText: { ...Typography.body2, color: Colors.primary },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { ...Typography.button, color: Colors.white, letterSpacing: 2 },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  divider: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { ...Typography.body2, color: Colors.text.muted, marginHorizontal: 12 },
  registerButton: { alignItems: 'center' },
  registerText: { ...Typography.body2, color: Colors.text.secondary },
  registerLink: { color: Colors.primary, fontWeight: '700' },
}); 