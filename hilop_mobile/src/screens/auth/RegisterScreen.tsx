import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../theme';
import { apiClient } from '../../services/api/client';
import { ENDPOINTS } from '../../constants/api';

type Props = { navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'> };

export default function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    try {
      setLoading(true);
      await apiClient.post(ENDPOINTS.REGISTER, { name, email, phone, password });
      navigation.navigate('OTPVerification', { email });
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message ?? 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.brand}>HILOP</Text>
            <Text style={styles.tagline}>Luxury Timepieces</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the Hilop family</Text>

            {[
              { label: 'FULL NAME', value: name, setter: setName, placeholder: 'John Doe', type: 'default' },
              { label: 'EMAIL', value: email, setter: setEmail, placeholder: 'your@email.com', type: 'email-address' },
              { label: 'PHONE', value: phone, setter: setPhone, placeholder: '+91 00000 00000', type: 'phone-pad' },
            ].map(field => (
              <View key={field.label} style={styles.inputGroup}>
                <Text style={styles.label}>{field.label}</Text>
                <TextInput
                  style={styles.input}
                  value={field.value}
                  onChangeText={field.setter}
                  placeholder={field.placeholder}
                  placeholderTextColor={Colors.text.muted}
                  keyboardType={field.type as any}
                  autoCapitalize={field.type === 'default' ? 'words' : 'none'}
                />
              </View>
            ))}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>PASSWORD</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Min. 8 characters"
                  placeholderTextColor={Colors.text.muted}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Text style={styles.toggle}>{showPassword ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}>
              {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.buttonText}>CREATE ACCOUNT</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginRow} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginLink}>Sign In</Text>
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
  brand: { ...Typography.h1, color: Colors.white, letterSpacing: 12, fontSize: 36 },
  tagline: { ...Typography.caption, color: Colors.primary, letterSpacing: 4, marginTop: 4 },
  form: { backgroundColor: Colors.white, borderRadius: 24, padding: Spacing.lg, marginBottom: Spacing.lg },
  title: { ...Typography.h2, color: Colors.black, marginBottom: 4 },
  subtitle: { ...Typography.body1, color: Colors.text.secondary, marginBottom: 28 },
  inputGroup: { marginBottom: Spacing.md },
  label: { ...Typography.label, color: Colors.text.secondary, marginBottom: 6, letterSpacing: 1 },
  input: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    ...Typography.body1, color: Colors.black, backgroundColor: Colors.background,
  },
  passwordRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border, borderRadius: 12,
    backgroundColor: Colors.background, paddingHorizontal: 16,
  },
  passwordInput: { flex: 1, paddingVertical: 14, ...Typography.body1, color: Colors.black },
  toggle: { ...Typography.label, color: Colors.primary },
  button: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: Spacing.sm },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { ...Typography.button, color: Colors.white, letterSpacing: 2 },
  loginRow: { alignItems: 'center', marginTop: Spacing.md },
  loginText: { ...Typography.body2, color: Colors.text.secondary },
  loginLink: { color: Colors.primary, fontWeight: '700' },
});