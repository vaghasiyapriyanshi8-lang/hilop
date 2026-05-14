import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../theme';
import { apiClient } from '../../services/api/client';
import { ENDPOINTS } from '../../constants/api';

type Props = { navigation: NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'> };

export default function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!email) { Alert.alert('Error', 'Please enter your email'); return; }
    try {
      setLoading(true);
      await apiClient.post(ENDPOINTS.FORGOT_PASSWORD, { email });
      setSent(true);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message ?? 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          {sent
            ? `We've sent an OTP to ₹{email}. Check your inbox.`
            : 'Enter your email and we\'ll send you an OTP to reset your password.'}
        </Text>

        {!sent ? (
          <>
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
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}>
              {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.buttonText}>SEND OTP</Text>}
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('OTPVerification', { email })}>
            <Text style={styles.buttonText}>ENTER OTP</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white, paddingHorizontal: Spacing.lg },
  back: { paddingTop: Spacing.md },
  backText: { ...Typography.body1, color: Colors.primary },
  content: { flex: 1, justifyContent: 'center', paddingBottom: 80 },
  title: { ...Typography.h2, color: Colors.black, marginBottom: 12 },
  subtitle: { ...Typography.body1, color: Colors.text.secondary, marginBottom: 32, lineHeight: 24 },
  inputGroup: { marginBottom: Spacing.lg },
  label: { ...Typography.label, color: Colors.text.secondary, marginBottom: 6, letterSpacing: 1 },
  input: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    ...Typography.body1, color: Colors.black, backgroundColor: Colors.background,
  },
  button: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { ...Typography.button, color: Colors.white, letterSpacing: 2 },
});