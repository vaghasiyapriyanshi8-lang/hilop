import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../theme';
import { apiClient } from '../../services/api/client';
import { ENDPOINTS } from '../../constants/api';
import { useAuthStore } from '../../store/slices/authStore';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'OTPVerification'>;
  route: RouteProp<AuthStackParamList, 'OTPVerification'>;
};

export default function OTPVerificationScreen({ navigation, route }: Props) {
  const { email } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);
  const setAuth = useAuthStore(s => s.setAuth);

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputs.current[index + 1]?.focus();
    if (!value && index > 0) inputs.current[index - 1]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) { Alert.alert('Error', 'Please enter the complete OTP'); return; }
    try {
      setLoading(true);
      const { data } = await apiClient.post(ENDPOINTS.VERIFY_OTP, { email, otp: code });
      if (data.accessToken) {
        setAuth(data.user, data.accessToken, data.refreshToken);
      } else {
        Alert.alert('Success', 'Email verified! Please login.');
        navigation.navigate('Login');
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message ?? 'Invalid OTP');
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
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to{'\n'}
          <Text style={styles.email}>{email}</Text>
        </Text>

        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => { inputs.current[index] = ref; }}
              style={[styles.otpInput, digit ? styles.otpFilled : null]}
              value={digit}
              onChangeText={value => handleChange(value, index)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleVerify}
          disabled={loading}>
          {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.buttonText}>VERIFY</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.resendRow}>
          <Text style={styles.resendText}>
            Didn't receive? <Text style={styles.resendLink}>Resend OTP</Text>
          </Text>
        </TouchableOpacity>
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
  subtitle: { ...Typography.body1, color: Colors.text.secondary, marginBottom: 40, lineHeight: 24 },
  email: { color: Colors.black, fontWeight: '600' },
  otpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
  otpInput: {
    width: 48, height: 56, borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: 12, ...Typography.h3, color: Colors.black, backgroundColor: Colors.background,
  },
  otpFilled: { borderColor: Colors.primary, backgroundColor: Colors.white },
  button: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { ...Typography.button, color: Colors.white, letterSpacing: 2 },
  resendRow: { alignItems: 'center', marginTop: Spacing.lg },
  resendText: { ...Typography.body2, color: Colors.text.secondary },
  resendLink: { color: Colors.primary, fontWeight: '700' },
});