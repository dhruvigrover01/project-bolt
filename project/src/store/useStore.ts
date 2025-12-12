import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Notification, 
  Watchlist, 
} from '../types';

// Subscription type
export interface Subscription {
  id: string;
  strategyId: string;
  strategyName: string;
  creatorName: string;
  creatorAvatar: string;
  priceMonthly: number;
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  nextBillingDate: string;
  paymentMethod: string;
  lastFourDigits: string;
}

interface AppStore {
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Notifications (local state, synced with backend separately)
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  setNotifications: (notifications: Notification[]) => void;

  // Watchlists & Favorites (local state, synced with backend separately)
  watchlists: Watchlist[];
  favorites: string[];
  addToFavorites: (strategyId: string) => void;
  removeFromFavorites: (strategyId: string) => void;
  toggleFavorite: (strategyId: string) => void;
  isFavorite: (strategyId: string) => boolean;
  setFavorites: (favorites: string[]) => void;
  createWatchlist: (watchlist: Watchlist) => void;
  addToWatchlist: (watchlistId: string, strategyId: string) => void;
  removeFromWatchlist: (watchlistId: string, strategyId: string) => void;
  setWatchlists: (watchlists: Watchlist[]) => void;

  // Subscriptions
  subscriptions: Subscription[];
  addSubscription: (subscription: Subscription) => void;
  removeSubscription: (subscriptionId: string) => void;
  cancelSubscription: (subscriptionId: string) => void;
  isSubscribed: (strategyId: string) => boolean;
  getSubscription: (strategyId: string) => Subscription | undefined;

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

  // Reset store (on logout)
  reset: () => void;
}

const initialState = {
  theme: 'dark' as const,
  notifications: [],
  unreadCount: 0,
  watchlists: [],
  favorites: [],
  subscriptions: [],
  compareList: [],
  sidebarOpen: true,
  modalOpen: null,
  searchQuery: '',
  recentSearches: [],
};

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Theme
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),

      // Notifications
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
      setNotifications: (notifications) => set({ 
        notifications,
        unreadCount: notifications.filter(n => !n.is_read).length,
      }),

      // Watchlists & Favorites
      addToFavorites: (strategyId) => set((state) => ({
        favorites: [...state.favorites, strategyId],
      })),
      removeFromFavorites: (strategyId) => set((state) => ({
        favorites: state.favorites.filter((id) => id !== strategyId),
      })),
      toggleFavorite: (strategyId) => set((state) => ({
        favorites: state.favorites.includes(strategyId)
          ? state.favorites.filter((id) => id !== strategyId)
          : [...state.favorites, strategyId],
      })),
      isFavorite: (strategyId) => get().favorites.includes(strategyId),
      setFavorites: (favorites) => set({ favorites }),
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
      setWatchlists: (watchlists) => set({ watchlists }),

      // Subscriptions
      addSubscription: (subscription) => set((state) => ({
        subscriptions: [...state.subscriptions, subscription],
      })),
      removeSubscription: (subscriptionId) => set((state) => ({
        subscriptions: state.subscriptions.filter((s) => s.id !== subscriptionId),
      })),
      cancelSubscription: (subscriptionId) => set((state) => ({
        subscriptions: state.subscriptions.map((s) =>
          s.id === subscriptionId ? { ...s, status: 'cancelled' as const } : s
        ),
      })),
      isSubscribed: (strategyId) => 
        get().subscriptions.some((s) => s.strategyId === strategyId && s.status === 'active'),
      getSubscription: (strategyId) => 
        get().subscriptions.find((s) => s.strategyId === strategyId),

      // Compare
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
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setModalOpen: (modal) => set({ modalOpen: modal }),

      // Search
      setSearchQuery: (query) => set({ searchQuery: query }),
      addRecentSearch: (query) => set((state) => ({
        recentSearches: [query, ...state.recentSearches.filter((q) => q !== query)].slice(0, 10),
      })),

      // Reset (call on logout)
      reset: () => set({
        ...initialState,
        theme: get().theme, // Keep theme preference
      }),
    }),
    {
      name: 'algomart-storage',
      partialize: (state) => ({
        theme: state.theme,
        favorites: state.favorites,
        watchlists: state.watchlists,
        recentSearches: state.recentSearches,
        compareList: state.compareList,
        subscriptions: state.subscriptions,
      }),
    }
  )
);

export const demoUser = {
  id: "demo-1",
  name: "Demo User",
  email: "demo@algomart.com",
};
