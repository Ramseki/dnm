import { View, Text, StyleSheet } from 'react-native';
import { Lock } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Signal } from '@/types';
import ScoreBar from './ScoreBar';

interface SignalCardProps {
  signal: Signal;
  locked?: boolean;
}

export default function SignalCard({ signal, locked = false }: SignalCardProps) {
  return (
    <View style={[styles.card, locked && styles.lockedCard]}>
      {locked && (
        <View style={styles.lockOverlay}>
          <View style={styles.lockIconContainer}>
            <Lock color={Colors.textSecondary} size={20} />
          </View>
          <Text style={styles.lockText}>Premium içerik</Text>
        </View>
      )}
      <View style={[styles.cardContent, locked && styles.blurred]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.ticker}>{signal.ticker}</Text>
            <Text style={styles.name}>{signal.name}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>₺{signal.price.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.scoreContainer}>
          <View style={styles.scoreHeader}>
            <Text style={styles.scoreLabel}>Sinyal Gücü</Text>
            <Text style={styles.scoreValue}>{signal.score}/100</Text>
          </View>
          <ScoreBar score={signal.score} />
        </View>

        <View style={styles.targetsRow}>
          <View style={styles.targetItem}>
            <Text style={styles.targetLabel}>Hedef</Text>
            <Text style={styles.targetPrice}>₺{signal.targetPrice.toFixed(2)}</Text>
            <Text style={styles.targetPercent}>+{signal.targetPercent.toFixed(1)}%</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.targetItem}>
            <Text style={styles.targetLabel}>Stop-Loss</Text>
            <Text style={styles.stopPrice}>₺{signal.stopLoss.toFixed(2)}</Text>
            <Text style={styles.stopPercent}>{signal.stopPercent.toFixed(1)}%</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  lockedCard: {
    borderColor: Colors.borderLight,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(10,14,26,0.75)',
    borderRadius: 16,
  },
  lockIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  lockText: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 8,
    fontFamily: 'Inter-Medium',
  },
  blurred: {
    opacity: 0.25,
  },
  cardContent: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  ticker: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
  },
  scoreContainer: {
    marginBottom: 14,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  scoreLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  scoreValue: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Medium',
  },
  targetsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 10,
    padding: 12,
  },
  targetItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 12,
  },
  targetLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  targetPrice: {
    fontSize: 14,
    color: Colors.bullish,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  stopPrice: {
    fontSize: 14,
    color: Colors.bearish,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  targetPercent: {
    fontSize: 12,
    color: Colors.bullish,
    fontFamily: 'Inter-Medium',
  },
  stopPercent: {
    fontSize: 12,
    color: Colors.bearish,
    fontFamily: 'Inter-Medium',
  },
});
