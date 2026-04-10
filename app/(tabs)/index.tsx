import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import MarketBadge from '@/components/MarketBadge';
import SignalCard from '@/components/SignalCard';
import { marketRegime, getSignalsByType } from '@/lib/mockData';
import { Signal, SignalType } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

type TabKey = SignalType;

const TABS: { key: TabKey; label: string; color: string }[] = [
  { key: 'GÜÇLÜ_AL', label: 'GÜÇLÜ AL', color: Colors.bullish },
  { key: 'AL', label: 'AL', color: '#4CAF50' },
  { key: 'İZLE', label: 'İZLE', color: Colors.warning },
  { key: 'SAT', label: 'SAT', color: '#FF8C00' },
  { key: 'GÜÇLÜ_SAT', label: 'GÜÇLÜ SAT', color: Colors.bearish },
];

const FREE_SIGNAL_LIMIT = 3;

export default function SignalsScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>('GÜÇLÜ_AL');
  const [isPremium, setIsPremium] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) checkSubscription();
  }, [user]);

  const checkSubscription = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('user_profiles')
      .select('subscription_status, subscription_end_date')
      .eq('id', user.id)
      .maybeSingle();

    if (data) {
      const isActive =
        data.subscription_status === 'active' &&
        data.subscription_end_date &&
        new Date(data.subscription_end_date) > new Date();
      setIsPremium(isActive);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await checkSubscription();
    setRefreshing(false);
  };

  const signals = getSignalsByType(activeTab);
  const activeTabConfig = TABS.find((t) => t.key === activeTab)!;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>BİST Sinyal</Text>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>CANLI</Text>
          </View>
        </View>
        <MarketBadge regime={marketRegime} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabScrollView}
        contentContainerStyle={styles.tabContainer}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = getSignalsByType(tab.key).length;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                isActive && { borderColor: tab.color, backgroundColor: `${tab.color}18` },
              ]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, isActive && { color: tab.color }]}>
                {tab.label}
              </Text>
              {count > 0 && (
                <View style={[styles.tabBadge, { backgroundColor: isActive ? tab.color : Colors.surfaceAlt }]}>
                  <Text style={[styles.tabBadgeText, !isActive && { color: Colors.textMuted }]}>
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        {signals.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyTitle}>Sinyal Yok</Text>
            <Text style={styles.emptyText}>
              Bu kategoride şu an aktif sinyal bulunmuyor.
            </Text>
          </View>
        ) : (
          signals.map((signal, index) => {
            const isLocked = !isPremium && index >= FREE_SIGNAL_LIMIT;
            return (
              <SignalCard
                key={signal.id}
                signal={signal}
                locked={isLocked}
              />
            );
          })
        )}

        {!isPremium && signals.length > FREE_SIGNAL_LIMIT && (
          <View style={styles.upgradePrompt}>
            <Text style={styles.upgradeTitle}>
              +{signals.length - FREE_SIGNAL_LIMIT} sinyal gizli
            </Text>
            <Text style={styles.upgradeText}>
              Tüm sinyallere erişmek için Premium'a geçin
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
    letterSpacing: 0.3,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,200,150,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,200,150,0.25)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.bullish,
  },
  liveText: {
    fontSize: 11,
    color: Colors.bullish,
    fontFamily: 'Inter-Bold',
    letterSpacing: 1,
  },
  tabScrollView: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    flexDirection: 'row',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
    backgroundColor: Colors.surface,
  },
  tabText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textSecondary,
    letterSpacing: 0.3,
  },
  tabBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  tabBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: Colors.background,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    fontFamily: 'Inter-Regular',
  },
  upgradePrompt: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
    backgroundColor: 'rgba(26,143,227,0.08)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(26,143,227,0.2)',
    alignItems: 'center',
  },
  upgradeTitle: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: Colors.primary,
    marginBottom: 4,
  },
  upgradeText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});
