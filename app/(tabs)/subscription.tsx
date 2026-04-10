import { useState } from 'react';
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
import { Check, Star, Bell, Target, FileText, Shield } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

const IYZICO_WEBHOOK_URL = process.env.EXPO_PUBLIC_API_BASE_URL + '/payments/iyzico/webhook';

const features = [
  {
    icon: Star,
    text: 'Tüm sinyallere tam erişim',
    subtext: 'GÜÇLÜ AL, AL, İZLE, SAT, GÜÇLÜ SAT',
  },
  {
    icon: Bell,
    text: 'Anlık push bildirimleri',
    subtext: 'Sinyal oluştuğunda anında haberdar ol',
  },
  {
    icon: Target,
    text: 'Hedef fiyat takibi',
    subtext: 'Hedef gerçekleşince otomatik bildirim',
  },
  {
    icon: FileText,
    text: 'Günlük analiz raporu',
    subtext: 'Her sabah piyasa özeti ve öneriler',
  },
  {
    icon: Shield,
    text: 'Stop-loss alarmları',
    subtext: 'Risk yönetimi için otomatik uyarılar',
  },
];

export default function SubscriptionScreen() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      Alert.alert(
        'Yakında!',
        'Ödeme sistemi entegrasyonu devam ediyor. Çok yakında hizmetinizde olacak.',
        [{ text: 'Tamam' }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.premiumBadge}>
            <Star color={Colors.gold} size={16} fill={Colors.gold} />
            <Text style={styles.premiumBadgeText}>PREMIUM</Text>
          </View>
          <Text style={styles.title}>Profesyonel Borsa{'\n'}Sinyallerine Erişin</Text>
          <Text style={styles.subtitle}>
            Algoritmik analizle desteklenen gerçek zamanlı sinyaller
          </Text>
        </View>

        <View style={styles.pricingCard}>
          <View style={styles.pricingHeader}>
            <View>
              <Text style={styles.planName}>Premium Plan</Text>
              <Text style={styles.planDescription}>Aylık abonelik, istediğinizde iptal</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.currency}>₺</Text>
              <Text style={styles.price}>99</Text>
              <Text style={styles.period}>/ay</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.featuresContainer}>
            {features.map((feature, index) => {
              const IconComp = feature.icon;
              return (
                <View key={index} style={styles.featureRow}>
                  <View style={styles.featureIconContainer}>
                    <IconComp color={Colors.primary} size={18} strokeWidth={2} />
                  </View>
                  <View style={styles.featureTextContainer}>
                    <Text style={styles.featureText}>{feature.text}</Text>
                    <Text style={styles.featureSubtext}>{feature.subtext}</Text>
                  </View>
                  <View style={styles.checkContainer}>
                    <Check color={Colors.bullish} size={16} strokeWidth={3} />
                  </View>
                </View>
              );
            })}
          </View>

          <TouchableOpacity
            style={[styles.subscribeButton, loading && styles.buttonDisabled]}
            onPress={handleSubscribe}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Star color="#fff" size={18} fill="#fff" />
                <Text style={styles.subscribeButtonText}>Abone Ol — ₺99/ay</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            iyzico güvencesiyle güvenli ödeme. İstediğiniz zaman iptal edebilirsiniz.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Nasıl Çalışır?</Text>
          <View style={styles.stepList}>
            {[
              'Algoritmamız 400+ BIST hissesini sürekli analiz eder',
              'Teknik ve temel analiz birleşimi sinyal oluşturur',
              'Sinyaller gerçek zamanlı olarak güncellenir',
              'Hedef ve stop-loss seviyeleri otomatik hesaplanır',
            ].map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{i + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 8,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,184,0,0.12)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,184,0,0.3)',
    marginBottom: 16,
  },
  premiumBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: Colors.gold,
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    lineHeight: 21,
  },
  pricingCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  pricingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  planName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
  },
  planDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  currency: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  price: {
    fontSize: 40,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
    lineHeight: 44,
  },
  period: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
    marginBottom: 6,
    marginLeft: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 20,
  },
  featuresContainer: {
    gap: 14,
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(26,143,227,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTextContainer: {
    flex: 1,
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
  },
  featureSubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  checkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,200,150,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscribeButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 12,
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  stepList: {
    gap: 14,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    color: Colors.textSecondary,
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
    lineHeight: 19,
  },
});
