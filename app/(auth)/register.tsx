import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Link, router } from 'expo-router';
import { TrendingUp, Check } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/colors';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Tüm alanlar zorunludur.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    setLoading(true);
    setError(null);

    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 7);

    const { data, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (authError) {
      setLoading(false);
      if (authError.message.includes('already registered')) {
        setError('Bu e-posta adresi zaten kayıtlı.');
      } else {
        setError('Kayıt sırasında bir hata oluştu.');
      }
      return;
    }

    if (data.user) {
      await supabase.from('user_profiles').insert({
        id: data.user.id,
        email: email.trim(),
        subscription_status: 'trial',
        trial_end_date: trialEndDate.toISOString(),
      });

      await supabase.from('notification_settings').insert({
        user_id: data.user.id,
        strong_buy_alert: true,
        target_price_alert: true,
        stop_loss_alert: true,
      });
    }

    setLoading(false);
    router.replace('/(tabs)');
  };

  const benefits = [
    '7 gün ücretsiz deneme',
    'İlk 3 sinyale tam erişim',
    'Piyasa rejimi takibi',
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <TrendingUp color={Colors.primary} size={32} strokeWidth={2.5} />
          </View>
          <Text style={styles.logoTitle}>BİST Sinyal</Text>
          <Text style={styles.logoSubtitle}>7 Gün Ücretsiz Dene</Text>
        </View>

        <View style={styles.benefitsCard}>
          {benefits.map((b) => (
            <View key={b} style={styles.benefitRow}>
              <View style={styles.checkCircle}>
                <Check color={Colors.bullish} size={12} strokeWidth={3} />
              </View>
              <Text style={styles.benefitText}>{b}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Hesap Oluştur</Text>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>E-posta</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="ornek@email.com"
              placeholderTextColor={Colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Şifre</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Şifre Tekrar</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••••"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Ücretsiz Başla</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Hesabın var mı? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Giriş Yap</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: 'rgba(26,143,227,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(26,143,227,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  logoSubtitle: {
    fontSize: 14,
    color: Colors.bullish,
    marginTop: 4,
    fontFamily: 'Inter-SemiBold',
  },
  benefitsCard: {
    backgroundColor: 'rgba(0,200,150,0.06)',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,200,150,0.2)',
    marginBottom: 20,
    gap: 10,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,200,150,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  errorBox: {
    backgroundColor: 'rgba(255,71,87,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,71,87,0.3)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: Colors.bearish,
    fontSize: 13,
    fontFamily: 'Inter-Regular',
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    fontFamily: 'Inter-Regular',
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  footerLink: {
    color: Colors.primary,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});
