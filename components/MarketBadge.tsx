import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { MarketRegime } from '@/types';

interface MarketBadgeProps {
  regime: MarketRegime;
}

const regimeConfig = {
  BOĞA: {
    color: Colors.bullish,
    bgColor: 'rgba(0,200,150,0.12)',
    borderColor: 'rgba(0,200,150,0.3)',
    label: 'Piyasa Rejimi: BOĞA',
    Icon: TrendingUp,
  },
  AYI: {
    color: Colors.bearish,
    bgColor: 'rgba(255,71,87,0.12)',
    borderColor: 'rgba(255,71,87,0.3)',
    label: 'Piyasa Rejimi: AYI',
    Icon: TrendingDown,
  },
  YATAY: {
    color: Colors.warning,
    bgColor: 'rgba(255,184,0,0.12)',
    borderColor: 'rgba(255,184,0,0.3)',
    label: 'Piyasa Rejimi: YATAY',
    Icon: Minus,
  },
};

export default function MarketBadge({ regime }: MarketBadgeProps) {
  const config = regimeConfig[regime];
  const IconComp = config.Icon;

  return (
    <View style={[styles.badge, { backgroundColor: config.bgColor, borderColor: config.borderColor }]}>
      <IconComp color={config.color} size={16} strokeWidth={2.5} />
      <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 0.3,
  },
});
