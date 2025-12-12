import { supabase } from '../lib/supabase';
import { Strategy, UserProfile, Review, Trade, BacktestResult } from '../types';
import { mockStrategies, mockReviews, generateMockTrades, generateRiskMetrics, generateEquityCurve, generateMonthlyReturns } from '../data/mockData';

// Configuration for API behavior
const USE_MOCK_DATA = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://your-project.supabase.co';

// ==================== STRATEGIES API ====================

export const strategiesApi = {
  /**
   * Get all strategies with optional filters
   */
  async getAll(filters?: {
    category?: string;
    asset_class?: string;
    risk_level?: string;
    min_roi?: number;
    max_price?: number;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    page?: number;
    per_page?: number;
  }): Promise<{ data: Strategy[]; total: number; page: number; per_page: number }> {
    if (USE_MOCK_DATA) {
      let filtered = [...mockStrategies];
      
      if (filters?.category) {
        filtered = filtered.filter(s => s.category.toLowerCase() === filters.category?.toLowerCase());
      }
      if (filters?.asset_class) {
        filtered = filtered.filter(s => s.asset_class.toLowerCase() === filters.asset_class?.toLowerCase());
      }
      if (filters?.risk_level) {
        filtered = filtered.filter(s => s.risk_level === filters.risk_level);
      }
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(s => 
          s.name.toLowerCase().includes(search) || 
          s.description.toLowerCase().includes(search) ||
          s.creator_name.toLowerCase().includes(search)
        );
      }
      if (filters?.min_roi) {
        filtered = filtered.filter(s => (s.performance[0]?.roi_percentage || 0) >= filters.min_roi!);
      }
      if (filters?.max_price) {
        filtered = filtered.filter(s => s.price_monthly <= filters.max_price!);
      }

      // Sorting
      if (filters?.sort_by) {
        filtered.sort((a, b) => {
          let aVal: number, bVal: number;
          switch (filters.sort_by) {
            case 'roi':
              aVal = a.performance[0]?.roi_percentage || 0;
              bVal = b.performance[0]?.roi_percentage || 0;
              break;
            case 'rating':
              aVal = a.rating;
              bVal = b.rating;
              break;
            case 'subscribers':
              aVal = a.total_subscribers;
              bVal = b.total_subscribers;
              break;
            case 'price':
              aVal = a.price_monthly;
              bVal = b.price_monthly;
              break;
            default:
              return 0;
          }
          return filters.sort_order === 'asc' ? aVal - bVal : bVal - aVal;
        });
      }

      const page = filters?.page || 1;
      const per_page = filters?.per_page || 10;
      const start = (page - 1) * per_page;
      const paginatedData = filtered.slice(start, start + per_page);

      return {
        data: paginatedData,
        total: filtered.length,
        page,
        per_page,
      };
    }

    // Real Supabase query
    let query = supabase
      .from('strategies')
      .select('*, performance_metrics(*), creators:profiles!creator_id(*)', { count: 'exact' });

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.asset_class) {
      query = query.eq('asset_class', filters.asset_class);
    }
    if (filters?.risk_level) {
      query = query.eq('risk_level', filters.risk_level);
    }
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }
    if (filters?.max_price) {
      query = query.lte('price_monthly', filters.max_price);
    }

    const page = filters?.page || 1;
    const per_page = filters?.per_page || 10;
    query = query.range((page - 1) * per_page, page * per_page - 1);

    if (filters?.sort_by) {
      query = query.order(filters.sort_by, { ascending: filters.sort_order === 'asc' });
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: data || [],
      total: count || 0,
      page,
      per_page,
    };
  },

  /**
   * Get single strategy by ID
   */
  async getById(id: string): Promise<Strategy | null> {
    if (USE_MOCK_DATA) {
      const strategy = mockStrategies.find(s => s.id === id);
      return strategy || null;
    }

    const { data, error } = await supabase
      .from('strategies')
      .select('*, performance_metrics(*), creators:profiles!creator_id(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get strategies by creator
   */
  async getByCreator(creatorId: string): Promise<Strategy[]> {
    if (USE_MOCK_DATA) {
      return mockStrategies.filter(s => s.creator_id === creatorId);
    }

    const { data, error } = await supabase
      .from('strategies')
      .select('*, performance_metrics(*)')
      .eq('creator_id', creatorId);

    if (error) throw error;
    return data || [];
  },

  /**
   * Get featured/trending strategies
   */
  async getFeatured(): Promise<Strategy[]> {
    if (USE_MOCK_DATA) {
      return mockStrategies.slice(0, 4);
    }

    const { data, error } = await supabase
      .from('strategies')
      .select('*, performance_metrics(*), creators:profiles!creator_id(*)')
      .eq('is_verified', true)
      .order('total_subscribers', { ascending: false })
      .limit(4);

    if (error) throw error;
    return data || [];
  },

  /**
   * Get strategy trades
   */
  async getTrades(strategyId: string, limit: number = 50): Promise<Trade[]> {
    if (USE_MOCK_DATA) {
      return generateMockTrades(strategyId, limit);
    }

    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('strategy_id', strategyId)
      .order('exit_time', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  /**
   * Get strategy backtest results
   */
  async getBacktestResults(strategyId: string): Promise<BacktestResult | null> {
    if (USE_MOCK_DATA) {
      return {
        id: `backtest-${strategyId}`,
        config: {
          id: `config-${strategyId}`,
          strategy_id: strategyId,
          start_date: '2023-01-01',
          end_date: '2024-01-01',
          initial_capital: 100000,
          commission_rate: 0.001,
          slippage: 0.0005,
          symbol: 'AAPL',
          timeframe: '1H',
        },
        trades: generateMockTrades(strategyId, 50),
        equity_curve: generateEquityCurve(12, 100000),
        monthly_returns: generateMonthlyReturns(2),
        risk_metrics: generateRiskMetrics(),
        summary: {
          total_return: 87.3,
          cagr: 42.5,
          total_trades: 243,
          winning_trades: 173,
          losing_trades: 70,
          win_rate: 71.2,
          avg_win: 2.8,
          avg_loss: -1.5,
          largest_win: 15.2,
          largest_loss: -6.8,
          avg_holding_period: '7.8 days',
          exposure_time: 65,
        },
        created_at: new Date().toISOString(),
      };
    }

    const { data, error } = await supabase
      .from('backtest_results')
      .select('*')
      .eq('strategy_id', strategyId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    return data;
  },
};

// ==================== REVIEWS API ====================

export const reviewsApi = {
  /**
   * Get reviews for a strategy
   */
  async getByStrategy(strategyId: string, page: number = 1, per_page: number = 10): Promise<{ data: Review[]; total: number }> {
    if (USE_MOCK_DATA) {
      const filtered = mockReviews.filter(r => r.strategy_id === strategyId);
      return {
        data: filtered.slice((page - 1) * per_page, page * per_page),
        total: filtered.length,
      };
    }

    const { data, error, count } = await supabase
      .from('reviews')
      .select('*, users:profiles!user_id(*)', { count: 'exact' })
      .eq('strategy_id', strategyId)
      .order('created_at', { ascending: false })
      .range((page - 1) * per_page, page * per_page - 1);

    if (error) throw error;
    return { data: data || [], total: count || 0 };
  },

  /**
   * Create a review
   */
  async create(review: Omit<Review, 'id' | 'created_at' | 'updated_at' | 'helpful_count'>): Promise<Review> {
    if (USE_MOCK_DATA) {
      const newReview: Review = {
        ...review,
        id: `review-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        helpful_count: 0,
      };
      return newReview;
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert(review)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Mark review as helpful
   */
  async markHelpful(reviewId: string): Promise<void> {
    if (USE_MOCK_DATA) return;

    const { error } = await supabase.rpc('increment_review_helpful', { review_id: reviewId });
    if (error) throw error;
  },
};

// ==================== USER API ====================

export const usersApi = {
  /**
   * Get user profile by ID
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    if (USE_MOCK_DATA) {
      // Return mock user
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    if (USE_MOCK_DATA) {
      return { ...updates, id: userId } as UserProfile;
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get user's subscribed strategies
   */
  async getSubscribedStrategies(userId: string): Promise<Strategy[]> {
    if (USE_MOCK_DATA) {
      return mockStrategies.slice(0, 3);
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .select('strategies(*)')
      .eq('user_id', userId)
      .eq('status', 'active');

    if (error) throw error;
    return data?.map(d => d.strategies as unknown as Strategy) || [];
  },

  /**
   * Subscribe to a strategy
   */
  async subscribeToStrategy(userId: string, strategyId: string): Promise<void> {
    if (USE_MOCK_DATA) return;

    const { error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        strategy_id: strategyId,
        status: 'active',
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });

    if (error) throw error;
  },

  /**
   * Unsubscribe from a strategy
   */
  async unsubscribeFromStrategy(userId: string, strategyId: string): Promise<void> {
    if (USE_MOCK_DATA) return;

    const { error } = await supabase
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('user_id', userId)
      .eq('strategy_id', strategyId);

    if (error) throw error;
  },
};

// ==================== LEADERBOARD API ====================

export const leaderboardApi = {
  /**
   * Get leaderboard by category
   */
  async getByCategory(category: string, limit: number = 10) {
    if (USE_MOCK_DATA) {
      const { generateLeaderboard } = await import('../data/mockData');
      return generateLeaderboard(category).slice(0, limit);
    }

    let orderColumn = 'total_subscribers';
    switch (category) {
      case 'roi':
        orderColumn = 'roi_6m';
        break;
      case 'win_rate':
        orderColumn = 'win_rate';
        break;
      case 'sharpe':
        orderColumn = 'sharpe_ratio';
        break;
      case 'stability':
        orderColumn = 'max_drawdown';
        break;
    }

    const { data, error } = await supabase
      .from('strategy_rankings')
      .select('*, strategies(*), profiles(*)')
      .order(orderColumn, { ascending: category === 'stability' })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },
};
