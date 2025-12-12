import { useState, useEffect, useCallback } from 'react';
import { strategiesApi, reviewsApi, usersApi, leaderboardApi } from '../services/api';
import { Strategy, Review, UserProfile, Trade, BacktestResult } from '../types';

// ==================== GENERIC FETCH HOOK ====================

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

function useFetch<T>(
  fetchFn: () => Promise<T>,
  dependencies: unknown[] = []
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// ==================== STRATEGIES HOOKS ====================

export interface UseStrategiesOptions {
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
}

export function useStrategies(options: UseStrategiesOptions = {}) {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStrategies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await strategiesApi.getAll(options);
      setStrategies(result.data);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch strategies'));
    } finally {
      setLoading(false);
    }
  }, [
    options.category,
    options.asset_class,
    options.risk_level,
    options.min_roi,
    options.max_price,
    options.search,
    options.sort_by,
    options.sort_order,
    options.page,
    options.per_page,
  ]);

  useEffect(() => {
    fetchStrategies();
  }, [fetchStrategies]);

  return {
    strategies,
    total,
    loading,
    error,
    refetch: fetchStrategies,
    page: options.page || 1,
    per_page: options.per_page || 10,
    totalPages: Math.ceil(total / (options.per_page || 10)),
  };
}

export function useStrategy(id: string | undefined) {
  return useFetch<Strategy | null>(
    () => (id ? strategiesApi.getById(id) : Promise.resolve(null)),
    [id]
  );
}

export function useFeaturedStrategies() {
  return useFetch<Strategy[]>(() => strategiesApi.getFeatured(), []);
}

export function useStrategyTrades(strategyId: string | undefined, limit: number = 50) {
  return useFetch<Trade[]>(
    () => (strategyId ? strategiesApi.getTrades(strategyId, limit) : Promise.resolve([])),
    [strategyId, limit]
  );
}

export function useBacktestResults(strategyId: string | undefined) {
  return useFetch<BacktestResult | null>(
    () => (strategyId ? strategiesApi.getBacktestResults(strategyId) : Promise.resolve(null)),
    [strategyId]
  );
}

// ==================== REVIEWS HOOKS ====================

export function useReviews(strategyId: string | undefined, page: number = 1, perPage: number = 10) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchReviews = useCallback(async () => {
    if (!strategyId) {
      setReviews([]);
      setTotal(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await reviewsApi.getByStrategy(strategyId, page, perPage);
      setReviews(result.data);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch reviews'));
    } finally {
      setLoading(false);
    }
  }, [strategyId, page, perPage]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const createReview = useCallback(
    async (review: Omit<Review, 'id' | 'created_at' | 'updated_at' | 'helpful_count'>) => {
      const newReview = await reviewsApi.create(review);
      setReviews((prev) => [newReview, ...prev]);
      setTotal((prev) => prev + 1);
      return newReview;
    },
    []
  );

  const markHelpful = useCallback(async (reviewId: string) => {
    await reviewsApi.markHelpful(reviewId);
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpful_count: r.helpful_count + 1 } : r))
    );
  }, []);

  return {
    reviews,
    total,
    loading,
    error,
    refetch: fetchReviews,
    createReview,
    markHelpful,
  };
}

// ==================== USER HOOKS ====================

export function useUserProfile(userId: string | undefined) {
  return useFetch<UserProfile | null>(
    () => (userId ? usersApi.getProfile(userId) : Promise.resolve(null)),
    [userId]
  );
}

export function useSubscribedStrategies(userId: string | undefined) {
  return useFetch<Strategy[]>(
    () => (userId ? usersApi.getSubscribedStrategies(userId) : Promise.resolve([])),
    [userId]
  );
}

export function useSubscription(userId: string | undefined, strategyId: string | undefined) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const subscribe = useCallback(async () => {
    if (!userId || !strategyId) return;
    setLoading(true);
    try {
      await usersApi.subscribeToStrategy(userId, strategyId);
      setIsSubscribed(true);
    } finally {
      setLoading(false);
    }
  }, [userId, strategyId]);

  const unsubscribe = useCallback(async () => {
    if (!userId || !strategyId) return;
    setLoading(true);
    try {
      await usersApi.unsubscribeFromStrategy(userId, strategyId);
      setIsSubscribed(false);
    } finally {
      setLoading(false);
    }
  }, [userId, strategyId]);

  return { isSubscribed, loading, subscribe, unsubscribe };
}

// ==================== LEADERBOARD HOOKS ====================

export function useLeaderboard(category: string, limit: number = 10) {
  return useFetch(
    () => leaderboardApi.getByCategory(category, limit),
    [category, limit]
  );
}
