import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  UserProfile, 
  Notification, 
  Watchlist, 
  Strategy,
  SubscriptionTier 
} from '../types';

interface AppStore {
  // User state
  user: UserProfile | null;
  isAuthenticated: boolean;
  setUser: (user: UserProfile | null) => void;
  login: (user: UserProfile) => void;
  logout: () => void;

  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Notifications
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;

  // Watchlists & Favorites
  watchlists: Watchlist[];
  favorites: string[];
  addToFavorites: (strategyId: string) => void;
  removeFromFavorites: (strategyId: string) => void;
  isFavorite: (strategyId: string) => boolean;
  createWatchlist: (watchlist: Watchlist) => void;
  addToWatchlist: (watchlistId: string, strategyId: string) => void;
  removeFromWatchlist: (watchlistId: string, strategyId: string) => void;

  // Compare
  compareList: string[];
  addToCompare: (strategyId: string) => void;
  removeFromCompare: (strategyId: string) => void;
  clearCompare: () => void;
  isInCompare: (strategyId: string) => boolean;

  // UI State
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  modalOpen: string | null;
  setModalOpen: (modal: string | null) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
}

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // User state
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),

      // Theme
      theme: 'dark',
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),

      // Notifications
      notifications: [],
      unreadCount: 0,
      addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      })),
      markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      })),
      markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
        unreadCount: 0,
      })),
      clearNotifications: () => set({ notifications: [], unreadCount: 0 }),

      // Watchlists & Favorites
      watchlists: [],
      favorites: [],
      addToFavorites: (strategyId) => set((state) => ({
        favorites: [...state.favorites, strategyId],
      })),
      removeFromFavorites: (strategyId) => set((state) => ({
        favorites: state.favorites.filter((id) => id !== strategyId),
      })),
      isFavorite: (strategyId) => get().favorites.includes(strategyId),
      createWatchlist: (watchlist) => set((state) => ({
        watchlists: [...state.watchlists, watchlist],
      })),
      addToWatchlist: (watchlistId, strategyId) => set((state) => ({
        watchlists: state.watchlists.map((w) =>
          w.id === watchlistId
            ? { ...w, strategy_ids: [...w.strategy_ids, strategyId] }
            : w
        ),
      })),
      removeFromWatchlist: (watchlistId, strategyId) => set((state) => ({
        watchlists: state.watchlists.map((w) =>
          w.id === watchlistId
            ? { ...w, strategy_ids: w.strategy_ids.filter((id) => id !== strategyId) }
            : w
        ),
      })),

      // Compare
      compareList: [],
      addToCompare: (strategyId) => set((state) => {
        if (state.compareList.length >= 4) return state;
        if (state.compareList.includes(strategyId)) return state;
        return { compareList: [...state.compareList, strategyId] };
      }),
      removeFromCompare: (strategyId) => set((state) => ({
        compareList: state.compareList.filter((id) => id !== strategyId),
      })),
      clearCompare: () => set({ compareList: [] }),
      isInCompare: (strategyId) => get().compareList.includes(strategyId),

      // UI State
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      modalOpen: null,
      setModalOpen: (modal) => set({ modalOpen: modal }),

      // Search
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      recentSearches: [],
      addRecentSearch: (query) => set((state) => ({
        recentSearches: [query, ...state.recentSearches.filter((q) => q !== query)].slice(0, 10),
      })),
    }),
    {
      name: 'algomart-storage',
      partialize: (state) => ({
        theme: state.theme,
        favorites: state.favorites,
        watchlists: state.watchlists,
        recentSearches: state.recentSearches,
      }),
    }
  )
);

// Demo user for testing
export const demoUser: UserProfile = {
  id: 'demo-user-1',
  email: 'demo@algomart.com',
  name: 'Alex Thompson',
  avatar_url: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150',
  bio: 'Quantitative trader with 8+ years of experience in algorithmic trading.',
  location: 'New York, USA',
  website: 'https://alexthompson.dev',
  twitter: '@alextrader',
  joined_at: '2023-06-15',
  subscription_tier: 'trader_pro' as SubscriptionTier,
  badges: [
    { id: '1', name: 'Early Adopter', description: 'Joined during beta', icon: '🚀', color: '#3B82F6', earned_at: '2023-06-15', rarity: 'rare' },
    { id: '2', name: 'Top Performer', description: 'Achieved 100%+ ROI', icon: '🏆', color: '#F59E0B', earned_at: '2024-01-20', rarity: 'epic' },
    { id: '3', name: 'Community Leader', description: '100+ helpful reviews', icon: '⭐', color: '#10B981', earned_at: '2024-03-10', rarity: 'legendary' },
  ],
  achievements: [
    { id: '1', name: 'First Trade', description: 'Execute your first trade', icon: '📈', progress: 1, max_progress: 1, completed: true, completed_at: '2023-06-16', reward_points: 100 },
    { id: '2', name: 'Strategy Hunter', description: 'Subscribe to 10 strategies', icon: '🎯', progress: 7, max_progress: 10, completed: false, reward_points: 500 },
    { id: '3', name: 'Profit Master', description: 'Earn $10,000 in profits', icon: '💰', progress: 8500, max_progress: 10000, completed: false, reward_points: 1000 },
  ],
  skill_tags: ['Momentum Trading', 'Risk Management', 'Python', 'Machine Learning'],
  performance_score: 87,
  followers_count: 1234,
  following_count: 56,
  total_earnings: 45670,
  strategies_created: 3,
  strategies_subscribed: 7,
  is_verified_creator: true,
  referral_code: 'ALEX2024',
  referral_earnings: 2340,
};

