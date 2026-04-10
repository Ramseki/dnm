import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

interface ScoreBarProps {
  score: number;
}

function getScoreColor(score: number): string {
  if (score >= 75) return Colors.bullish;
  if (score >= 50) return '#FFB800';
  if (score >= 25) return '#FF8C00';
  return Colors.bearish;
}

export default function ScoreBar({ score }: ScoreBarProps) {
  const color = getScoreColor(score);
  const width = `${score}%` as const;

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
});
