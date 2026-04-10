import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, TrendingUp, Target, ShieldAlert, Info } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { NotificationSettings } from '@/types';

const FIREBASE_PUSH_PLACEHOLDER = 'firebase_fcm_token_placeholder';

interface SettingItem {
  key: keyof Omit<NotificationSettings, 'id' | 'user_id'>;
  label: string;
  description: string;
  icon: typeof Bell;
  iconColor: string;
}

const settingItems: SettingItem[] = [
  {
    key: 'strong_buy_alert',
    label: 'Güçlü Al Sinyali',
    description: 'Yeni GÜÇLÜ AL sinyali oluştuğunda bildir',
    icon: TrendingUp,
    iconColor: Colors.bullish,
  },
  {
    key: 'target_price_alert',
    label: 'Hedef Fiyat',
    description: 'Hisse hedef fiyatına ulaştığında bildir',
    icon: Target,
    iconColor: Colors.primary,
  },
  {
    key: 'stop_loss_alert',
    label: 'Stop-Loss Tetiklendi',
    description: 'Stop-loss seviyesi aşıldığında acil bildir',
    icon: ShieldAlert,
    iconColor: Colors.bearish,
  },
];

const defaultSettings: Omit<NotificationSettings, 'id' | 'user_id'> = {
  strong_buy_alert: true,
  target_price_alert: true,
  stop_loss_alert: true,
};

export default function NotificationsScreen() {
  const { user } = useAuth();
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    if (user) loadSettings();
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('notification_settings')
      .select('strong_buy_alert, target_price_alert, stop_loss_alert')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setSettings({
        strong_buy_alert: data.strong_buy_alert,
        target_price_alert: data.target_price_alert,
        stop_loss_alert: data.stop_loss_alert,
      });
    }
    setLoading(false);
  };

  const handleToggle = async (key: keyof typeof settings, value: boolean) => {
    if (!user) return;
    setSaving(key);
    setSettings((prev) => ({ ...prev, [key]: value }));

    await supabase
      .from('notification_settings')
      .update({ [key]: value })
      .eq('user_id', user.id);

    setSaving(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Bildirim Ayarları</Text>
        <Text style={styles.subtitle}>Hangi olaylarda bildirim almak istediğinizi seçin</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sinyal Bildirimleri</Text>
            <View style={styles.card}>
              {settingItems.map((item, index) => {
                const IconComp = item.icon;
                const isLast = index === settingItems.length - 1;
                return (
                  <View key={item.key}>
                    <View style={styles.settingRow}>
                      <View style={[styles.iconContainer, { backgroundColor: `${item.iconColor}18` }]}>
                        <IconComp color={item.iconColor} size={20} strokeWidth={2} />
                      </View>
                      <View style={styles.settingTextContainer}>
                        <Text style={styles.settingLabel}>{item.label}</Text>
                        <Text style={styles.settingDescription}>{item.description}</Text>
                      </View>
                      <View style={styles.toggleContainer}>
                        {saving === item.key ? (
                          <ActivityIndicator color={Colors.primary} size="small" />
                        ) : (
                          <Switch
                            value={settings[item.key]}
                            onValueChange={(val) => handleToggle(item.key, val)}
                            trackColor={{
                              false: Colors.surfaceAlt,
                              true: 'rgba(26,143,227,0.4)',
                            }}
                            thumbColor={settings[item.key] ? Colors.primary : Colors.textMuted}
                            ios_backgroundColor={Colors.surfaceAlt}
                          />
                        )}
                      </View>
                    </View>
                    {!isLast && <View style={styles.separator} />}
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Info color={Colors.primary} size={16} strokeWidth={2} />
              <Text style={styles.infoTitle}>Firebase Entegrasyonu</Text>
            </View>
            <Text style={styles.infoText}>
              Push bildirimleri için Firebase Cloud Messaging entegrasyonu yapılandırılmaktadır.
              Premium aboneler otomatik olarak bildirim alacaktır.
            </Text>
            <View style={styles.placeholderBadge}>
              <Text style={styles.placeholderText}>FCM Token: Entegrasyon bekleniyor</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle2}>Bildirim Saatleri</Text>
            <Text style={styles.infoText}>
              Sinyaller hafta içi 09:00 - 18:00 saatleri arasında gönderilir.
              Hafta sonu ve piyasa kapalı saatlerde bildirim gönderilmez.
            </Text>
          </View>
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
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
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
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  settingDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
    lineHeight: 17,
  },
  toggleContainer: {
    width: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 72,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
  },
  infoTitle2: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
    lineHeight: 19,
    marginBottom: 12,
  },
  placeholderBadge: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});
