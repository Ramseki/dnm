export type SignalType = 'GÜÇLÜ_AL' | 'AL' | 'İZLE' | 'SAT' | 'GÜÇLÜ_SAT';
export type MarketRegime = 'BOĞA' | 'AYI' | 'YATAY';

export interface Signal {
  id: string;
  ticker: string;
  name: string;
  signal: SignalType;
  score: number;
  price: number;
  targetPrice: number;
  targetPercent: number;
  stopLoss: number;
  stopPercent: number;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  subscription_status: 'active' | 'inactive' | 'trial';
  subscription_end_date: string | null;
  trial_end_date: string | null;
  created_at: string;
}

export interface NotificationSettings {
  id: string;
  user_id: string;
  strong_buy_alert: boolean;
  target_price_alert: boolean;
  stop_loss_alert: boolean;
}
