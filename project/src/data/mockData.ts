import { 
  Strategy, 
  Trade, 
  EquityCurvePoint, 
  MonthlyReturn, 
  RiskMetrics,
  Review,
  StrategyVersion,
  LeaderboardEntry,
  CandleData,
  HeatmapData,
  Notification,
  AIRating,
  SubscriptionPlan,
  CreatorAnalytics,
  AffiliateStats,
  SimulationResult,
  BacktestResult
} from '../types';

// ==================== STRATEGIES ====================

export const mockStrategies: Strategy[] = [
  {
    id: '1',
    creator_id: '1',
    name: 'Momentum Surge Alpha',
    description: 'Advanced momentum trading strategy utilizing machine learning to identify trend breakouts in high-volume equities. Optimized for medium-term holds with adaptive stop-loss mechanisms.',
    category: 'Momentum',
    asset_class: 'Stocks',
    price_monthly: 299,
    min_capital: 25000,
    risk_level: 'medium',
    is_verified: true,
    total_subscribers: 1847,
    rating: 4.8,
    created_at: '2024-01-15',
    creator_name: 'Dr. Sarah Chen',
    creator_avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    version: '2.4.1',
    tags: ['ML', 'Breakout', 'Trend Following'],
    timeframe: '4H',
    reviews_count: 234,
    avg_monthly_trades: 15,
    supported_brokers: ['zerodha', 'upstox', 'binance'],
    ai_rating: {
      overall_score: 87,
      risk_score: 72,
      stability_score: 81,
      profitability_index: 89,
      difficulty_level: 'intermediate',
      classification: ['Trend Following', 'Momentum', 'ML-Based'],
      confidence: 0.92,
      analysis: {
        strengths: ['Strong trend capture', 'Adaptive risk management', 'Low correlation to market'],
        weaknesses: ['Underperforms in sideways markets', 'Higher drawdown during reversals'],
        recommendations: ['Best suited for trending markets', 'Consider reducing position size during low volatility'],
      },
      market_fit: {
        best_conditions: ['Bull markets', 'High volatility', 'Strong trends'],
        worst_conditions: ['Sideways markets', 'Low volume periods'],
      },
      similar_strategies: ['2', '5'],
      generated_at: '2024-03-15',
    },
    performance: [
      {
        id: '1',
        strategy_id: '1',
        period: '6M',
        roi_percentage: 42.5,
        sharpe_ratio: 2.1,
        max_drawdown: -8.3,
        win_rate: 68.5,
        total_trades: 127,
        avg_trade_duration: '8.2 days',
        volatility: 15.2,
      },
      {
        id: '2',
        strategy_id: '1',
        period: '1Y',
        roi_percentage: 87.3,
        sharpe_ratio: 2.4,
        max_drawdown: -12.1,
        win_rate: 71.2,
        total_trades: 243,
        avg_trade_duration: '7.8 days',
        volatility: 16.1,
      },
    ],
  },
  {
    id: '2',
    creator_id: '2',
    name: 'Crypto Arbitrage Pro',
    description: 'High-frequency arbitrage strategy exploiting price differences across multiple cryptocurrency exchanges. Automated execution with sub-second response times.',
    category: 'Arbitrage',
    asset_class: 'Crypto',
    price_monthly: 499,
    min_capital: 10000,
    risk_level: 'low',
    is_verified: true,
    total_subscribers: 2341,
    rating: 4.9,
    created_at: '2023-11-20',
    creator_name: 'Marcus Rodriguez',
    creator_avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    version: '3.1.0',
    tags: ['HFT', 'Arbitrage', 'Multi-Exchange'],
    timeframe: '1M',
    reviews_count: 456,
    avg_monthly_trades: 4500,
    supported_brokers: ['binance', 'bybit'],
    ai_rating: {
      overall_score: 94,
      risk_score: 92,
      stability_score: 95,
      profitability_index: 78,
      difficulty_level: 'advanced',
      classification: ['Arbitrage', 'Market Neutral', 'HFT'],
      confidence: 0.96,
      analysis: {
        strengths: ['Very consistent returns', 'Low drawdown', 'Market neutral'],
        weaknesses: ['Requires fast execution', 'High capital for meaningful returns'],
        recommendations: ['Ensure low latency connection', 'Monitor exchange fees closely'],
      },
      market_fit: {
        best_conditions: ['Any market condition', 'High volume periods'],
        worst_conditions: ['Exchange outages', 'Low liquidity'],
      },
      similar_strategies: ['6'],
      generated_at: '2024-03-15',
    },
    performance: [
      {
        id: '3',
        strategy_id: '2',
        period: '6M',
        roi_percentage: 28.7,
        sharpe_ratio: 3.8,
        max_drawdown: -3.2,
        win_rate: 89.3,
        total_trades: 4821,
        avg_trade_duration: '3.2 min',
        volatility: 5.1,
      },
      {
        id: '4',
        strategy_id: '2',
        period: '1Y',
        roi_percentage: 61.4,
        sharpe_ratio: 3.6,
        max_drawdown: -4.7,
        win_rate: 87.8,
        total_trades: 9243,
        avg_trade_duration: '3.5 min',
        volatility: 5.8,
      },
    ],
  },
  {
    id: '3',
    creator_id: '3',
    name: 'Mean Reversion Elite',
    description: 'Statistical mean reversion strategy for forex pairs. Uses proprietary indicators to identify overbought/oversold conditions with high probability reversals.',
    category: 'Mean Reversion',
    asset_class: 'Forex',
    price_monthly: 399,
    min_capital: 50000,
    risk_level: 'medium',
    is_verified: true,
    total_subscribers: 1523,
    rating: 4.7,
    created_at: '2024-02-10',
    creator_name: 'Elena Volkov',
    creator_avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
    version: '1.8.2',
    tags: ['Statistical', 'Forex', 'Mean Reversion'],
    timeframe: '1H',
    reviews_count: 189,
    avg_monthly_trades: 45,
    supported_brokers: ['zerodha', 'fyers', 'dhan'],
    ai_rating: {
      overall_score: 82,
      risk_score: 78,
      stability_score: 85,
      profitability_index: 76,
      difficulty_level: 'intermediate',
      classification: ['Mean Reversion', 'Statistical', 'Forex'],
      confidence: 0.88,
      analysis: {
        strengths: ['Consistent in ranging markets', 'Good risk-reward ratio', 'Clear entry/exit signals'],
        weaknesses: ['Struggles in strong trends', 'Requires patience'],
        recommendations: ['Avoid during major news events', 'Best for major currency pairs'],
      },
      market_fit: {
        best_conditions: ['Ranging markets', 'Normal volatility'],
        worst_conditions: ['Strong trends', 'News-driven moves'],
      },
      similar_strategies: ['6'],
      generated_at: '2024-03-15',
    },
    performance: [
      {
        id: '5',
        strategy_id: '3',
        period: '6M',
        roi_percentage: 34.2,
        sharpe_ratio: 2.7,
        max_drawdown: -6.8,
        win_rate: 73.1,
        total_trades: 198,
        avg_trade_duration: '4.3 days',
        volatility: 11.4,
      },
      {
        id: '6',
        strategy_id: '3',
        period: '1Y',
        roi_percentage: 72.8,
        sharpe_ratio: 2.9,
        max_drawdown: -9.2,
        win_rate: 74.6,
        total_trades: 387,
        avg_trade_duration: '4.1 days',
        volatility: 12.1,
      },
    ],
  },
  {
    id: '4',
    creator_id: '4',
    name: 'Options Gamma Scalper',
    description: 'Sophisticated options trading strategy targeting gamma scalping opportunities on S&P 500 index options. Profit from market volatility with hedged positions.',
    category: 'Options',
    asset_class: 'Derivatives',
    price_monthly: 599,
    min_capital: 100000,
    risk_level: 'high',
    is_verified: true,
    total_subscribers: 892,
    rating: 4.6,
    created_at: '2023-12-05',
    creator_name: 'James Patterson',
    creator_avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    version: '2.0.0',
    tags: ['Options', 'Gamma', 'Volatility'],
    timeframe: '15M',
    reviews_count: 98,
    avg_monthly_trades: 120,
    supported_brokers: ['zerodha', 'upstox', 'dhan'],
    ai_rating: {
      overall_score: 79,
      risk_score: 58,
      stability_score: 65,
      profitability_index: 91,
      difficulty_level: 'expert',
      classification: ['Options', 'Volatility', 'Delta Neutral'],
      confidence: 0.85,
      analysis: {
        strengths: ['High profit potential', 'Works in any market direction', 'Professional-grade strategy'],
        weaknesses: ['High complexity', 'Requires significant capital', 'Higher drawdowns possible'],
        recommendations: ['Only for experienced traders', 'Start with paper trading'],
      },
      market_fit: {
        best_conditions: ['High volatility', 'Major events', 'Earnings season'],
        worst_conditions: ['Low volatility', 'Holiday periods'],
      },
      similar_strategies: [],
      generated_at: '2024-03-15',
    },
    performance: [
      {
        id: '7',
        strategy_id: '4',
        period: '6M',
        roi_percentage: 51.3,
        sharpe_ratio: 1.9,
        max_drawdown: -15.4,
        win_rate: 62.7,
        total_trades: 89,
        avg_trade_duration: '2.1 days',
        volatility: 22.8,
      },
      {
        id: '8',
        strategy_id: '4',
        period: '1Y',
        roi_percentage: 118.6,
        sharpe_ratio: 2.1,
        max_drawdown: -18.3,
        win_rate: 64.2,
        total_trades: 176,
        avg_trade_duration: '2.3 days',
        volatility: 24.1,
      },
    ],
  },
  {
    id: '5',
    creator_id: '5',
    name: 'AI Sentiment Trader',
    description: 'Machine learning model analyzing social media sentiment, news flow, and market data to predict short-term price movements in tech stocks.',
    category: 'AI/ML',
    asset_class: 'Stocks',
    price_monthly: 449,
    min_capital: 30000,
    risk_level: 'medium',
    is_verified: true,
    total_subscribers: 1672,
    rating: 4.8,
    created_at: '2024-03-01',
    creator_name: 'Dr. Akira Tanaka',
    creator_avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    version: '4.2.0',
    tags: ['AI', 'NLP', 'Sentiment', 'Tech Stocks'],
    timeframe: 'D',
    reviews_count: 312,
    avg_monthly_trades: 22,
    supported_brokers: ['zerodha', 'upstox', 'binance', 'bybit'],
    ai_rating: {
      overall_score: 88,
      risk_score: 74,
      stability_score: 79,
      profitability_index: 86,
      difficulty_level: 'intermediate',
      classification: ['AI/ML', 'Sentiment', 'News-Based'],
      confidence: 0.91,
      analysis: {
        strengths: ['Unique data sources', 'Adapts to market sentiment', 'Strong in tech sector'],
        weaknesses: ['Dependent on data quality', 'Can be affected by fake news'],
        recommendations: ['Best for tech-heavy portfolios', 'Combine with fundamental analysis'],
      },
      market_fit: {
        best_conditions: ['News-driven markets', 'Earnings season', 'Product launches'],
        worst_conditions: ['Low news flow', 'Holiday periods'],
      },
      similar_strategies: ['1'],
      generated_at: '2024-03-15',
    },
    performance: [
      {
        id: '9',
        strategy_id: '5',
        period: '6M',
        roi_percentage: 45.8,
        sharpe_ratio: 2.3,
        max_drawdown: -10.2,
        win_rate: 69.4,
        total_trades: 156,
        avg_trade_duration: '5.7 days',
        volatility: 17.3,
      },
      {
        id: '10',
        strategy_id: '5',
        period: '1Y',
        roi_percentage: 94.2,
        sharpe_ratio: 2.5,
        max_drawdown: -13.8,
        win_rate: 71.8,
        total_trades: 298,
        avg_trade_duration: '5.4 days',
        volatility: 18.2,
      },
    ],
  },
  {
    id: '6',
    creator_id: '6',
    name: 'Pairs Trading Engine',
    description: 'Statistical arbitrage strategy identifying correlated stock pairs and trading their spread convergence. Market-neutral approach with consistent returns.',
    category: 'Statistical Arbitrage',
    asset_class: 'Stocks',
    price_monthly: 349,
    min_capital: 40000,
    risk_level: 'low',
    is_verified: true,
    total_subscribers: 1289,
    rating: 4.7,
    created_at: '2024-01-25',
    creator_name: 'Rachel Kim',
    creator_avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    version: '1.5.3',
    tags: ['Pairs', 'Market Neutral', 'Statistical'],
    timeframe: '1H',
    reviews_count: 167,
    avg_monthly_trades: 35,
    supported_brokers: ['zerodha', 'upstox', 'fyers', 'dhan'],
    ai_rating: {
      overall_score: 85,
      risk_score: 88,
      stability_score: 91,
      profitability_index: 72,
      difficulty_level: 'intermediate',
      classification: ['Statistical Arbitrage', 'Market Neutral', 'Pairs Trading'],
      confidence: 0.93,
      analysis: {
        strengths: ['Market neutral', 'Consistent returns', 'Low correlation to market'],
        weaknesses: ['Lower absolute returns', 'Requires capital for both legs'],
        recommendations: ['Great for portfolio diversification', 'Best with highly correlated pairs'],
      },
      market_fit: {
        best_conditions: ['Any market condition', 'Normal correlation regime'],
        worst_conditions: ['Correlation breakdown', 'Market stress'],
      },
      similar_strategies: ['2', '3'],
      generated_at: '2024-03-15',
    },
    performance: [
      {
        id: '11',
        strategy_id: '6',
        period: '6M',
        roi_percentage: 24.6,
        sharpe_ratio: 3.2,
        max_drawdown: -4.1,
        win_rate: 81.3,
        total_trades: 312,
        avg_trade_duration: '6.8 days',
        volatility: 6.8,
      },
      {
        id: '12',
        strategy_id: '6',
        period: '1Y',
        roi_percentage: 52.3,
        sharpe_ratio: 3.4,
        max_drawdown: -5.6,
        win_rate: 79.8,
        total_trades: 598,
        avg_trade_duration: '7.1 days',
        volatility: 7.2,
      },
    ],
  },
];

// ==================== TRADES ====================

export const generateMockTrades = (strategyId: string, count: number = 50): Trade[] => {
  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA', 'BTC/USDT', 'ETH/USDT'];
  const trades: Trade[] = [];
  
  for (let i = 0; i < count; i++) {
    const entryPrice = 100 + Math.random() * 400;
    const isWin = Math.random() > 0.35;
    const pnlPercentage = isWin 
      ? Math.random() * 15 + 1 
      : -(Math.random() * 8 + 1);
    const exitPrice = entryPrice * (1 + pnlPercentage / 100);
    const quantity = Math.floor(Math.random() * 100) + 10;
    
    const entryDate = new Date(2024, 0, 1);
    entryDate.setDate(entryDate.getDate() + Math.floor(Math.random() * 300));
    const exitDate = new Date(entryDate);
    exitDate.setDate(exitDate.getDate() + Math.floor(Math.random() * 14) + 1);
    
    trades.push({
      id: `trade-${strategyId}-${i}`,
      strategy_id: strategyId,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      side: Math.random() > 0.5 ? 'buy' : 'sell',
      entry_price: entryPrice,
      exit_price: exitPrice,
      quantity,
      entry_time: entryDate.toISOString(),
      exit_time: exitDate.toISOString(),
      pnl: (exitPrice - entryPrice) * quantity,
      pnl_percentage: pnlPercentage,
      fees: entryPrice * quantity * 0.001,
      status: 'closed',
    });
  }
  
  return trades.sort((a, b) => new Date(b.exit_time).getTime() - new Date(a.exit_time).getTime());
};

// ==================== EQUITY CURVE ====================

export const generateEquityCurve = (months: number = 12, initialCapital: number = 100000): EquityCurvePoint[] => {
  const points: EquityCurvePoint[] = [];
  let equity = initialCapital;
  let maxEquity = equity;
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  
  for (let i = 0; i < months * 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    const dailyReturn = (Math.random() - 0.45) * 3;
    equity *= (1 + dailyReturn / 100);
    maxEquity = Math.max(maxEquity, equity);
    const drawdown = ((equity - maxEquity) / maxEquity) * 100;
    
    points.push({
      date: date.toISOString().split('T')[0],
      equity: Math.round(equity),
      drawdown: Math.round(drawdown * 100) / 100,
      benchmark: initialCapital * (1 + (i / (months * 30)) * 0.12),
    });
  }
  
  return points;
};

// ==================== MONTHLY RETURNS ====================

export const generateMonthlyReturns = (years: number = 2): MonthlyReturn[] => {
  const returns: MonthlyReturn[] = [];
  const currentDate = new Date();
  
  for (let y = 0; y < years; y++) {
    for (let m = 0; m < 12; m++) {
      const year = currentDate.getFullYear() - years + y + 1;
      if (year === currentDate.getFullYear() && m > currentDate.getMonth()) break;
      
      returns.push({
        year,
        month: m + 1,
        return_percentage: (Math.random() - 0.3) * 20,
        trades_count: Math.floor(Math.random() * 30) + 5,
      });
    }
  }
  
  return returns;
};

// ==================== RISK METRICS ====================

export const generateRiskMetrics = (): RiskMetrics => ({
  sharpe_ratio: 2.1 + Math.random() * 1.5,
  sortino_ratio: 2.8 + Math.random() * 1.5,
  max_drawdown: -(5 + Math.random() * 15),
  var_95: -(2 + Math.random() * 3),
  var_99: -(3 + Math.random() * 5),
  cvar_95: -(3 + Math.random() * 4),
  kelly_percentage: 15 + Math.random() * 20,
  profit_factor: 1.5 + Math.random() * 1.5,
  calmar_ratio: 2 + Math.random() * 2,
  omega_ratio: 1.5 + Math.random() * 1,
  beta: 0.3 + Math.random() * 0.7,
  alpha: 5 + Math.random() * 15,
  information_ratio: 0.8 + Math.random() * 0.8,
  treynor_ratio: 10 + Math.random() * 10,
  ulcer_index: 3 + Math.random() * 5,
  pain_ratio: 1 + Math.random() * 2,
  tail_ratio: 1 + Math.random() * 0.5,
  common_sense_ratio: 1.5 + Math.random() * 1,
});

// ==================== HEATMAP DATA ====================

export const generateHeatmapData = (): HeatmapData[] => {
  const data: HeatmapData[] = [];
  
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      data.push({
        day,
        hour,
        value: Math.random() * 100 - 50,
        trades_count: Math.floor(Math.random() * 20),
      });
    }
  }
  
  return data;
};

// ==================== CANDLE DATA ====================

export const generateCandleData = (count: number = 200): CandleData[] => {
  const candles: CandleData[] = [];
  let price = 100 + Math.random() * 50;
  const startTime = Date.now() - count * 3600000;
  
  for (let i = 0; i < count; i++) {
    const volatility = Math.random() * 3;
    const direction = Math.random() > 0.48 ? 1 : -1;
    const change = direction * volatility;
    
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * volatility;
    const low = Math.min(open, close) - Math.random() * volatility;
    
    candles.push({
      time: startTime + i * 3600000,
      open,
      high,
      low,
      close,
      volume: Math.floor(Math.random() * 1000000) + 100000,
    });
    
    price = close;
  }
  
  return candles;
};

// ==================== REVIEWS ====================

export const mockReviews: Review[] = [
  {
    id: '1',
    strategy_id: '1',
    user_id: 'user1',
    user_name: 'Michael Chen',
    user_avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    title: 'Exceptional performance and support',
    content: 'I have been using this strategy for 6 months and the results have exceeded my expectations. The creator is very responsive and provides excellent documentation.',
    pros: ['Consistent returns', 'Great documentation', 'Responsive creator'],
    cons: ['Requires patience during drawdowns'],
    screenshots: [],
    helpful_count: 45,
    created_at: '2024-02-15',
    updated_at: '2024-02-15',
    is_verified_purchase: true,
    creator_response: {
      content: 'Thank you for the kind words! Happy to help anytime.',
      created_at: '2024-02-16',
    },
  },
  {
    id: '2',
    strategy_id: '1',
    user_id: 'user2',
    user_name: 'Sarah Williams',
    user_avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 4,
    title: 'Solid strategy with room for improvement',
    content: 'Good overall performance. The strategy works well in trending markets but struggles a bit during consolidation periods. Would love to see more frequent updates.',
    pros: ['Good risk management', 'Clear signals'],
    cons: ['Underperforms in sideways markets', 'Updates could be more frequent'],
    screenshots: [],
    helpful_count: 23,
    created_at: '2024-03-01',
    updated_at: '2024-03-01',
    is_verified_purchase: true,
  },
];

// ==================== VERSIONS ====================

export const mockVersions: StrategyVersion[] = [
  {
    id: 'v1',
    strategy_id: '1',
    version: '2.4.1',
    changelog: 'Bug fixes and performance improvements',
    changes: [
      { type: 'fixed', description: 'Fixed edge case in stop-loss calculation' },
      { type: 'changed', description: 'Optimized entry signal timing' },
    ],
    performance_diff: [
      { metric: 'Win Rate', old_value: 69.8, new_value: 71.2, change_percentage: 2.0 },
      { metric: 'Sharpe Ratio', old_value: 2.2, new_value: 2.4, change_percentage: 9.1 },
    ],
    created_at: '2024-03-10',
    is_current: true,
  },
  {
    id: 'v2',
    strategy_id: '1',
    version: '2.4.0',
    changelog: 'Major update with new ML model',
    changes: [
      { type: 'added', description: 'New machine learning model for trend detection' },
      { type: 'added', description: 'Support for additional timeframes' },
      { type: 'changed', description: 'Improved risk management module' },
    ],
    created_at: '2024-02-15',
    is_current: false,
  },
  {
    id: 'v3',
    strategy_id: '1',
    version: '2.3.0',
    changelog: 'Added support for new brokers',
    changes: [
      { type: 'added', description: 'Support for Upstox API' },
      { type: 'added', description: 'Support for Binance API' },
      { type: 'fixed', description: 'Memory leak in data processing' },
    ],
    created_at: '2024-01-20',
    is_current: false,
  },
];

// ==================== LEADERBOARDS ====================

export const generateLeaderboard = (category: string): LeaderboardEntry[] => {
  return mockStrategies
    .map((s, i) => {
      let value = 0;
      switch (category) {
        case 'roi':
          value = s.performance[1]?.roi_percentage || 0;
          break;
        case 'win_rate':
          value = s.performance[1]?.win_rate || 0;
          break;
        case 'subscribers':
          value = s.total_subscribers;
          break;
        case 'sharpe':
          value = s.performance[1]?.sharpe_ratio || 0;
          break;
        case 'stability':
          value = 100 + (s.performance[1]?.max_drawdown || 0);
          break;
        default:
          value = s.rating * 20;
      }
      
      return {
        rank: i + 1,
        strategy_id: s.id,
        strategy_name: s.name,
        creator_id: s.creator_id,
        creator_name: s.creator_name,
        creator_avatar: s.creator_avatar,
        value,
        change: Math.floor(Math.random() * 5) - 2,
        trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable',
      };
    })
    .sort((a, b) => b.value - a.value)
    .map((entry, i) => ({ ...entry, rank: i + 1 }));
};

// ==================== NOTIFICATIONS ====================

export const mockNotifications: Notification[] = [
  {
    id: '1',
    user_id: 'demo',
    type: 'new_version',
    title: 'Strategy Updated',
    message: 'Momentum Surge Alpha has been updated to version 2.4.1',
    is_read: false,
    created_at: new Date().toISOString(),
    action_url: '/strategy/1',
  },
  {
    id: '2',
    user_id: 'demo',
    type: 'milestone',
    title: 'Milestone Achieved!',
    message: 'Your portfolio reached $50,000 in profits!',
    is_read: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    user_id: 'demo',
    type: 'drawdown_alert',
    title: 'Drawdown Alert',
    message: 'Options Gamma Scalper has reached -10% drawdown',
    is_read: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    action_url: '/strategy/4',
  },
  {
    id: '4',
    user_id: 'demo',
    type: 'achievement_unlocked',
    title: 'Achievement Unlocked!',
    message: 'You earned the "Profit Master" badge!',
    is_read: true,
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

// ==================== SUBSCRIPTION PLANS ====================

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    tier: 'free',
    name: 'Free',
    price_monthly: 0,
    price_yearly: 0,
    features: [
      'Browse all strategies',
      'Basic performance metrics',
      'Community access',
      '1 watchlist',
      'Email support',
    ],
    limits: {
      strategies_access: 3,
      backtests_per_month: 5,
      api_calls_per_day: 100,
      live_trading_slots: 0,
      csv_uploads: 1,
    },
  },
  {
    id: 'trader_pro',
    tier: 'trader_pro',
    name: 'Trader Pro',
    price_monthly: 49,
    price_yearly: 470,
    features: [
      'Everything in Free',
      'Advanced analytics',
      'Risk analysis tools',
      'Unlimited watchlists',
      'Strategy comparison',
      'Priority support',
      'Live trading (3 strategies)',
      'Mobile app access',
    ],
    limits: {
      strategies_access: 10,
      backtests_per_month: 50,
      api_calls_per_day: 5000,
      live_trading_slots: 3,
      csv_uploads: 10,
    },
  },
  {
    id: 'creator_pro',
    tier: 'creator_pro',
    name: 'Creator Pro',
    price_monthly: 99,
    price_yearly: 950,
    features: [
      'Everything in Trader Pro',
      'Create unlimited strategies',
      'Advanced backtest tools',
      'Strategy version control',
      'Creator analytics dashboard',
      'Revenue sharing (80%)',
      'Featured placement',
      'Dedicated support',
    ],
    limits: {
      strategies_access: -1,
      backtests_per_month: -1,
      api_calls_per_day: 50000,
      live_trading_slots: 10,
      csv_uploads: -1,
    },
  },
  {
    id: 'enterprise',
    tier: 'enterprise',
    name: 'Enterprise',
    price_monthly: 499,
    price_yearly: 4790,
    features: [
      'Everything in Creator Pro',
      'White-label solution',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantee',
      'Custom revenue sharing',
      'API access',
      'Team management',
    ],
    limits: {
      strategies_access: -1,
      backtests_per_month: -1,
      api_calls_per_day: -1,
      live_trading_slots: -1,
      csv_uploads: -1,
    },
  },
];

// ==================== CREATOR ANALYTICS ====================

export const mockCreatorAnalytics: CreatorAnalytics = {
  total_earnings: 45670,
  earnings_history: Array.from({ length: 12 }, (_, i) => ({
    date: new Date(2024, i, 1).toISOString().split('T')[0],
    amount: 3000 + Math.random() * 2000,
  })),
  total_subscribers: 4523,
  subscribers_history: Array.from({ length: 12 }, (_, i) => ({
    date: new Date(2024, i, 1).toISOString().split('T')[0],
    count: 300 + i * 50 + Math.floor(Math.random() * 100),
  })),
  active_strategies: 6,
  total_views: 125000,
  conversion_rate: 4.2,
  avg_subscription_duration: 8.5,
  top_strategies: [
    { strategy_id: '1', name: 'Momentum Surge Alpha', earnings: 15000, subscribers: 1847 },
    { strategy_id: '2', name: 'Crypto Arbitrage Pro', earnings: 12000, subscribers: 2341 },
    { strategy_id: '5', name: 'AI Sentiment Trader', earnings: 8000, subscribers: 1672 },
  ],
  subscriber_demographics: [
    { country: 'United States', count: 1500 },
    { country: 'India', count: 1200 },
    { country: 'United Kingdom', count: 450 },
    { country: 'Germany', count: 380 },
    { country: 'Canada', count: 320 },
  ],
  churn_rate: 5.2,
  mrr: 12500,
  arr: 150000,
};

// ==================== AFFILIATE STATS ====================

export const mockAffiliateStats: AffiliateStats = {
  referral_code: 'ALEX2024',
  total_referrals: 156,
  active_referrals: 89,
  total_earnings: 4560,
  pending_earnings: 340,
  commission_rate: 20,
  referrals: [
    { user_id: 'ref1', user_name: 'John D.', joined_at: '2024-01-15', subscription_tier: 'trader_pro', lifetime_value: 490, commission_earned: 98 },
    { user_id: 'ref2', user_name: 'Sarah M.', joined_at: '2024-02-20', subscription_tier: 'creator_pro', lifetime_value: 990, commission_earned: 198 },
    { user_id: 'ref3', user_name: 'Mike R.', joined_at: '2024-03-05', subscription_tier: 'trader_pro', lifetime_value: 245, commission_earned: 49 },
  ],
  earnings_history: Array.from({ length: 6 }, (_, i) => ({
    date: new Date(2024, i, 1).toISOString().split('T')[0],
    amount: 500 + Math.random() * 500,
  })),
};

// ==================== SIMULATION RESULTS ====================

export const generateSimulationResults = (initialCapital: number = 100000): SimulationResult[] => {
  const scenarios = [
    { name: 'Bull Market', description: 'Strong upward trend', market_condition: 'bull' as const, volatility_multiplier: 0.8, duration_months: 12 },
    { name: 'Bear Market', description: 'Prolonged downtrend', market_condition: 'bear' as const, volatility_multiplier: 1.2, duration_months: 12 },
    { name: 'Sideways', description: 'Range-bound market', market_condition: 'sideways' as const, volatility_multiplier: 0.6, duration_months: 12 },
    { name: 'High Volatility', description: 'Increased market swings', market_condition: 'volatile' as const, volatility_multiplier: 1.5, duration_months: 12 },
    { name: 'Market Crash', description: 'Severe market decline', market_condition: 'crash' as const, volatility_multiplier: 2.0, duration_months: 6 },
  ];
  
  return scenarios.map(scenario => {
    const paths: number[][] = [];
    for (let p = 0; p < 100; p++) {
      const path: number[] = [initialCapital];
      let equity = initialCapital;
      for (let i = 0; i < scenario.duration_months * 20; i++) {
        const baseReturn = scenario.market_condition === 'bull' ? 0.3 :
                          scenario.market_condition === 'bear' ? -0.2 :
                          scenario.market_condition === 'crash' ? -0.5 : 0.1;
        const dailyReturn = (baseReturn + (Math.random() - 0.5) * scenario.volatility_multiplier * 2) / 20;
        equity *= (1 + dailyReturn / 100);
        path.push(equity);
      }
      paths.push(path);
    }
    
    const finalValues = paths.map(p => p[p.length - 1]);
    const sortedFinals = [...finalValues].sort((a, b) => a - b);
    
    return {
      scenario,
      initial_capital: initialCapital,
      final_capital: finalValues.reduce((a, b) => a + b, 0) / finalValues.length,
      max_drawdown: Math.min(...paths.flat().map((v, i, arr) => {
        const max = Math.max(...arr.slice(0, i + 1));
        return ((v - max) / max) * 100;
      })),
      worst_month: Math.min(...finalValues.map(v => ((v - initialCapital) / initialCapital) * 100)),
      best_month: Math.max(...finalValues.map(v => ((v - initialCapital) / initialCapital) * 100)),
      probability_of_loss: (finalValues.filter(v => v < initialCapital).length / finalValues.length) * 100,
      var_95: sortedFinals[Math.floor(sortedFinals.length * 0.05)],
      expected_return: ((finalValues.reduce((a, b) => a + b, 0) / finalValues.length - initialCapital) / initialCapital) * 100,
      monte_carlo_paths: paths.slice(0, 20),
    };
  });
};
