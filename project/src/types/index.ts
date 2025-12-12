// ==================== CORE TYPES ====================

export interface PerformanceMetric {
  id: string;
  strategy_id: string;
  period: string;
  roi_percentage: number;
  sharpe_ratio: number;
  max_drawdown: number;
  win_rate: number;
  total_trades: number;
  avg_trade_duration: string;
  volatility: number;
}

export interface Strategy {
  id: string;
  creator_id: string;
  name: string;
  description: string;
  category: string;
  asset_class: string;
  price_monthly: number;
  min_capital: number;
  risk_level: 'low' | 'medium' | 'high';
  is_verified: boolean;
  total_subscribers: number;
  rating: number;
  created_at: string;
  performance: PerformanceMetric[];
  creator_name: string;
  creator_avatar: string;
  // Extended fields
  version?: string;
  tags?: string[];
  timeframe?: string;
  ai_rating?: AIRating;
  reviews_count?: number;
  avg_monthly_trades?: number;
  supported_brokers?: string[];
}

export interface StrategyCreator {
  id: string;
  name: string;
  bio: string;
  avatar_url: string;
  total_strategies: number;
  avg_rating: number;
}

// ==================== USER & PROFILE TYPES ====================

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
  bio: string;
  location: string;
  website: string;
  twitter: string;
  joined_at: string;
  subscription_tier: SubscriptionTier;
  badges: Badge[];
  achievements: Achievement[];
  skill_tags: string[];
  performance_score: number;
  followers_count: number;
  following_count: number;
  total_earnings: number;
  strategies_created: number;
  strategies_subscribed: number;
  is_verified_creator: boolean;
  referral_code: string;
  referral_earnings: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earned_at: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  max_progress: number;
  completed: boolean;
  completed_at?: string;
  reward_points: number;
}

export type SubscriptionTier = 'free' | 'trader_pro' | 'creator_pro' | 'enterprise';

export interface SubscriptionPlan {
  id: string;
  tier: SubscriptionTier;
  name: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  limits: {
    strategies_access: number;
    backtests_per_month: number;
    api_calls_per_day: number;
    live_trading_slots: number;
    csv_uploads: number;
  };
}

// ==================== TRADING & PERFORMANCE TYPES ====================

export interface Trade {
  id: string;
  strategy_id: string;
  symbol: string;
  side: 'buy' | 'sell';
  entry_price: number;
  exit_price: number;
  quantity: number;
  entry_time: string;
  exit_time: string;
  pnl: number;
  pnl_percentage: number;
  fees: number;
  status: 'open' | 'closed' | 'cancelled';
  notes?: string;
}

export interface EquityCurvePoint {
  date: string;
  equity: number;
  drawdown: number;
  benchmark?: number;
}

export interface MonthlyReturn {
  year: number;
  month: number;
  return_percentage: number;
  trades_count: number;
}

export interface DrawdownPeriod {
  start_date: string;
  end_date: string;
  max_drawdown: number;
  recovery_days: number;
  recovered: boolean;
}

export interface RiskMetrics {
  sharpe_ratio: number;
  sortino_ratio: number;
  max_drawdown: number;
  var_95: number;
  var_99: number;
  cvar_95: number;
  kelly_percentage: number;
  profit_factor: number;
  calmar_ratio: number;
  omega_ratio: number;
  beta: number;
  alpha: number;
  information_ratio: number;
  treynor_ratio: number;
  ulcer_index: number;
  pain_ratio: number;
  tail_ratio: number;
  common_sense_ratio: number;
}

export interface HeatmapData {
  hour: number;
  day: number;
  value: number;
  trades_count: number;
}

// ==================== BACKTEST TYPES ====================

export interface BacktestConfig {
  id: string;
  strategy_id: string;
  start_date: string;
  end_date: string;
  initial_capital: number;
  commission_rate: number;
  slippage: number;
  symbol: string;
  timeframe: string;
}

export interface BacktestResult {
  id: string;
  config: BacktestConfig;
  trades: Trade[];
  equity_curve: EquityCurvePoint[];
  monthly_returns: MonthlyReturn[];
  risk_metrics: RiskMetrics;
  summary: {
    total_return: number;
    cagr: number;
    total_trades: number;
    winning_trades: number;
    losing_trades: number;
    win_rate: number;
    avg_win: number;
    avg_loss: number;
    largest_win: number;
    largest_loss: number;
    avg_holding_period: string;
    exposure_time: number;
  };
  created_at: string;
}

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface BacktestSimulation {
  candles: CandleData[];
  trades: Trade[];
  current_index: number;
  is_playing: boolean;
  speed: number;
  equity: number[];
}

// ==================== BROKER INTEGRATION TYPES ====================

export type BrokerType = 'zerodha' | 'upstox' | 'dhan' | 'fyers' | 'binance' | 'bybit';

export interface BrokerConnection {
  id: string;
  user_id: string;
  broker: BrokerType;
  api_key: string;
  api_secret_encrypted: string;
  is_active: boolean;
  is_paper_trading: boolean;
  connected_at: string;
  last_sync: string;
  account_balance: number;
  account_id: string;
  permissions: string[];
}

export interface BrokerOrder {
  id: string;
  broker_connection_id: string;
  strategy_id: string;
  symbol: string;
  side: 'buy' | 'sell';
  order_type: 'market' | 'limit' | 'stop' | 'stop_limit';
  quantity: number;
  price?: number;
  stop_price?: number;
  status: 'pending' | 'filled' | 'partial' | 'cancelled' | 'rejected';
  filled_quantity: number;
  avg_fill_price: number;
  created_at: string;
  updated_at: string;
  broker_order_id: string;
}

export interface AutoTradingConfig {
  id: string;
  user_id: string;
  strategy_id: string;
  broker_connection_id: string;
  is_active: boolean;
  max_position_size: number;
  max_daily_trades: number;
  max_daily_loss: number;
  stop_loss_percentage: number;
  take_profit_percentage: number;
  risk_per_trade: number;
  created_at: string;
}

// ==================== LEADERBOARD & GAMIFICATION TYPES ====================

export interface LeaderboardEntry {
  rank: number;
  strategy_id: string;
  strategy_name: string;
  creator_id: string;
  creator_name: string;
  creator_avatar: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

export type LeaderboardCategory = 'roi' | 'win_rate' | 'popularity' | 'subscribers' | 'stability' | 'sharpe';

export interface GamificationStats {
  total_points: number;
  level: number;
  level_progress: number;
  next_level_points: number;
  global_rank: number;
  weekly_rank: number;
  streak_days: number;
  achievements_unlocked: number;
  total_achievements: number;
}

// ==================== STRATEGY COMPARISON TYPES ====================

export interface StrategyComparison {
  strategies: Strategy[];
  metrics: {
    metric_name: string;
    values: { strategy_id: string; value: number | string }[];
    best_strategy_id: string;
  }[];
}

// ==================== REVIEW & COMMUNITY TYPES ====================

export interface Review {
  id: string;
  strategy_id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  screenshots: string[];
  helpful_count: number;
  created_at: string;
  updated_at: string;
  is_verified_purchase: boolean;
  creator_response?: {
    content: string;
    created_at: string;
  };
}

export interface Comment {
  id: string;
  parent_id?: string;
  strategy_id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  content: string;
  likes_count: number;
  created_at: string;
  replies?: Comment[];
}

// ==================== VERSION CONTROL TYPES ====================

export interface StrategyVersion {
  id: string;
  strategy_id: string;
  version: string;
  changelog: string;
  changes: {
    type: 'added' | 'changed' | 'fixed' | 'removed';
    description: string;
  }[];
  performance_diff?: {
    metric: string;
    old_value: number;
    new_value: number;
    change_percentage: number;
  }[];
  created_at: string;
  is_current: boolean;
}

// ==================== NOTIFICATION TYPES ====================

export type NotificationType = 
  | 'new_version'
  | 'milestone'
  | 'drawdown_alert'
  | 'trade_executed'
  | 'subscription_expiring'
  | 'new_follower'
  | 'review_received'
  | 'achievement_unlocked'
  | 'price_alert'
  | 'system';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
  action_url?: string;
}

export interface NotificationPreferences {
  email_notifications: boolean;
  push_notifications: boolean;
  new_versions: boolean;
  milestones: boolean;
  drawdown_alerts: boolean;
  trade_executed: boolean;
  subscription_expiring: boolean;
  new_followers: boolean;
  reviews: boolean;
  achievements: boolean;
  price_alerts: boolean;
  marketing: boolean;
}

// ==================== WATCHLIST & FAVORITES TYPES ====================

export interface Watchlist {
  id: string;
  user_id: string;
  name: string;
  description: string;
  strategy_ids: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Collection {
  id: string;
  user_id: string;
  name: string;
  description: string;
  cover_image: string;
  strategy_ids: string[];
  followers_count: number;
  is_public: boolean;
  created_at: string;
}

// ==================== RISK SIMULATOR TYPES ====================

export interface SimulationScenario {
  name: string;
  description: string;
  market_condition: 'bull' | 'bear' | 'sideways' | 'volatile' | 'crash';
  volatility_multiplier: number;
  duration_months: number;
}

export interface SimulationResult {
  scenario: SimulationScenario;
  initial_capital: number;
  final_capital: number;
  max_drawdown: number;
  worst_month: number;
  best_month: number;
  probability_of_loss: number;
  var_95: number;
  expected_return: number;
  monte_carlo_paths: number[][];
}

// ==================== CREATOR ANALYTICS TYPES ====================

export interface CreatorAnalytics {
  total_earnings: number;
  earnings_history: { date: string; amount: number }[];
  total_subscribers: number;
  subscribers_history: { date: string; count: number }[];
  active_strategies: number;
  total_views: number;
  conversion_rate: number;
  avg_subscription_duration: number;
  top_strategies: { strategy_id: string; name: string; earnings: number; subscribers: number }[];
  subscriber_demographics: {
    country: string;
    count: number;
  }[];
  churn_rate: number;
  mrr: number;
  arr: number;
}

// ==================== AFFILIATE TYPES ====================

export interface AffiliateStats {
  referral_code: string;
  total_referrals: number;
  active_referrals: number;
  total_earnings: number;
  pending_earnings: number;
  commission_rate: number;
  referrals: {
    user_id: string;
    user_name: string;
    joined_at: string;
    subscription_tier: SubscriptionTier;
    lifetime_value: number;
    commission_earned: number;
  }[];
  earnings_history: { date: string; amount: number }[];
}

// ==================== AI RATING TYPES ====================

export interface AIRating {
  overall_score: number;
  risk_score: number;
  stability_score: number;
  profitability_index: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  classification: string[];
  confidence: number;
  analysis: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  market_fit: {
    best_conditions: string[];
    worst_conditions: string[];
  };
  similar_strategies: string[];
  generated_at: string;
}

// ==================== SEARCH & FILTER TYPES ====================

export interface SearchFilters {
  query: string;
  category: string[];
  asset_class: string[];
  risk_level: ('low' | 'medium' | 'high')[];
  timeframe: string[];
  min_roi: number;
  max_roi: number;
  min_win_rate: number;
  max_win_rate: number;
  min_capital: number;
  max_capital: number;
  min_sharpe: number;
  min_rating: number;
  is_verified: boolean;
  has_auto_trading: boolean;
  supported_brokers: BrokerType[];
  price_range: { min: number; max: number };
  sort_by: string;
  sort_order: 'asc' | 'desc';
}

// ==================== CSV UPLOAD TYPES ====================

export interface CSVUpload {
  id: string;
  strategy_id: string;
  file_name: string;
  file_type: 'trades' | 'equity_curve' | 'logs';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message?: string;
  rows_processed: number;
  total_rows: number;
  uploaded_at: string;
  processed_at?: string;
}

export interface ParsedTradeCSV {
  symbol: string;
  side: 'buy' | 'sell';
  entry_price: number;
  exit_price: number;
  quantity: number;
  entry_time: string;
  exit_time: string;
  pnl?: number;
}

// ==================== APP STATE TYPES ====================

export interface AppState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  notifications: Notification[];
  unreadNotificationsCount: number;
  watchlists: Watchlist[];
  favorites: string[];
  compareList: string[];
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
}

// ==================== API RESPONSE TYPES ====================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
