import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Crown, Calendar, LogOut, ChevronRight, Star, Shield, Clock } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    setProfile(data);
    setLoading(false);
  };

  const handleSignOut = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const getSubscriptionLabel = () => {
    if (!profile) return { label: 'Yükleniyor...', color: Colors.textMuted };
    if (profile.subscription_status === 'active') {
      return { label: 'Premium Aktif', color: Colors.gold };
    }
    if (profile.subscription_status === 'trial') {
      return { label: 'Ücretsiz Deneme', color: Colors.primary };
    }
    return { label: 'Pasif', color: Colors.bearish };
  };

  const getEndDateLabel = () => {
    if (!profile) return null;
    if (profile.subscription_status === 'active' && profile.subscription_end_date) {
      const date = new Date(profile.subscription_end_date);
      return `Bitiş: ${date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    }
    if (profile.subscription_status === 'trial' && profile.trial_end_date) {
      const date = new Date(profile.trial_end_date);
      const now = new Date();
      const diff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (diff > 0) return `Deneme: ${diff} gün kaldı`;
      return 'Deneme süresi doldu';
    }
    return null;
  };

  const subStatus = getSubscriptionLabel();
  const endDate = getEndDateLabel();
  const isPremium = profile?.subscription_status === 'active';
  const isTrial = profile?.subscription_status === 'trial';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Profil</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <User color={Colors.primary} size={32} strokeWidth={1.5} />
              </View>
              {isPremium && (
                <View style={styles.crownBadge}>
                  <Crown color={Colors.gold} size={12} fill={Colors.gold} />
                </View>
              )}
            </View>
            <Text style={styles.emailText}>{user?.email}</Text>
            <Text style={styles.memberSince}>
              Üye: {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString('tr-TR', {
                    month: 'long',
                    year: 'numeric',
                  })
                : '—'}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Abonelik Durumu</Text>
            <View style={[
              styles.subscriptionCard,
              isPremium && styles.subscriptionCardPremium,
              isTrial && styles.subscriptionCardTrial,
            ]}>
              <View style={styles.subscriptionIconContainer}>
                {isPremium ? (
                  <Star color={Colors.gold} size={24} fill={Colors.gold} />
                ) : isTrial ? (
                  <Clock color={Colors.primary} size={24} strokeWidth={2} />
                ) : (
                  <Shield color={Colors.textMuted} size={24} strokeWidth={2} />
                )}
              </View>
              <View style={styles.subscriptionInfo}>
                <Text style={[styles.subscriptionLabel, { color: subStatus.color }]}>
                  {subStatus.label}
                </Text>
                {endDate && (
                  <Text style={styles.subscriptionDate}>{endDate}</Text>
                )}
              </View>
              {!isPremium && (
                <TouchableOpacity
                  style={styles.upgradeButton}
                  onPress={() => router.push('/(tabs)/subscription')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.upgradeButtonText}>Yükselt</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {isPremium && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Premium Avantajlarınız</Text>
              <View style={styles.benefitsCard}>
                {[
                  'Tüm sinyallere erişim',
                  'Push bildirimleri aktif',
                  'Hedef fiyat takibi',
                  'Günlük rapor',
                  'Stop-loss alarmları',
                ].map((benefit) => (
                  <View key={benefit} style={styles.benefitRow}>
                    <View style={styles.benefitDot} />
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hesap</Text>
            <View style={styles.card}>
              <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
                <Text style={styles.menuLabel}>Gizlilik Politikası</Text>
                <ChevronRight color={Colors.textMuted} size={18} />
              </TouchableOpacity>
              <View style={styles.menuSeparator} />
              <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
                <Text style={styles.menuLabel}>Kullanım Koşulları</Text>
                <ChevronRight color={Colors.textMuted} size={18} />
              </TouchableOpacity>
              <View style={styles.menuSeparator} />
              <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
                <Text style={styles.menuLabel}>Destek</Text>
                <ChevronRight color={Colors.textMuted} size={18} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
            activeOpacity={0.8}
          >
            <LogOut color={Colors.bearish} size={18} strokeWidth={2} />
            <Text style={styles.signOutText}>Çıkış Yap</Text>
          </TouchableOpacity>

          <Text style={styles.versionText}>BİST Sinyal v1.0.0</Text>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 14,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(26,143,227,0.12)',
    borderWidth: 2,
    borderColor: 'rgba(26,143,227,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crownBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,184,0,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,184,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  subscriptionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 14,
  },
  subscriptionCardPremium: {
    borderColor: 'rgba(255,184,0,0.3)',
    backgroundColor: 'rgba(255,184,0,0.05)',
  },
  subscriptionCardTrial: {
    borderColor: 'rgba(26,143,227,0.3)',
    backgroundColor: 'rgba(26,143,227,0.05)',
  },
  subscriptionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscriptionInfo: {
    flex: 1,
  },
  subscriptionLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginBottom: 3,
  },
  subscriptionDate: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  upgradeButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
  },
  benefitsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  benefitDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.gold,
  },
  benefitText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontFamily: 'Inter-Regular',
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  menuLabel: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontFamily: 'Inter-Regular',
  },
  menuSeparator: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 16,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,71,87,0.25)',
    backgroundColor: 'rgba(255,71,87,0.06)',
    marginBottom: 20,
  },
  signOutText: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: Colors.bearish,
  },
  versionText: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    marginBottom: 32,
  },
  Calendar: {
    color: Colors.textMuted,
  },
});
