import { supabase } from '../lib/supabase';
import { Notification, NotificationType, NotificationPreferences } from '../types';

// ==================== NOTIFICATION SERVICE ====================

export const notificationService = {
  /**
   * Get user's notifications
   */
  async getAll(userId: string, limit: number = 50): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  /**
   * Get unread count
   */
  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return count || 0;
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;
  },

  /**
   * Mark all as read
   */
  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
  },

  /**
   * Delete notification
   */
  async delete(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
  },

  /**
   * Clear all notifications
   */
  async clearAll(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  },

  /**
   * Subscribe to real-time notifications
   */
  subscribeToNotifications(
    userId: string,
    onNotification: (notification: Notification) => void
  ): () => void {
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          onNotification(payload.new as Notification);
        }
      )
      .subscribe();

    // Return unsubscribe function
    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Create a notification (typically called from backend)
   */
  async create(notification: Omit<Notification, 'id' | 'created_at'>): Promise<Notification> {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ==================== NOTIFICATION PREFERENCES ====================

export const notificationPreferencesService = {
  /**
   * Get user's notification preferences
   */
  async get(userId: string): Promise<NotificationPreferences> {
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      // Return defaults if not found
      return {
        email_notifications: true,
        push_notifications: true,
        new_versions: true,
        milestones: true,
        drawdown_alerts: true,
        trade_executed: true,
        subscription_expiring: true,
        new_followers: true,
        reviews: true,
        achievements: true,
        price_alerts: true,
        marketing: false,
      };
    }

    return data;
  },

  /**
   * Update notification preferences
   */
  async update(
    userId: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<void> {
    const { error } = await supabase
      .from('notification_preferences')
      .upsert({
        user_id: userId,
        ...preferences,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
  },
};

// ==================== NOTIFICATION HELPERS ====================

export const notificationHelpers = {
  /**
   * Get icon for notification type
   */
  getIcon(type: NotificationType): string {
    const icons: Record<NotificationType, string> = {
      new_version: '🔄',
      milestone: '🏆',
      drawdown_alert: '⚠️',
      trade_executed: '📈',
      subscription_expiring: '⏰',
      new_follower: '👤',
      review_received: '⭐',
      achievement_unlocked: '🎖️',
      price_alert: '💰',
      system: '🔔',
    };
    return icons[type] || '🔔';
  },

  /**
   * Get color for notification type
   */
  getColor(type: NotificationType): string {
    const colors: Record<NotificationType, string> = {
      new_version: 'blue',
      milestone: 'emerald',
      drawdown_alert: 'amber',
      trade_executed: 'cyan',
      subscription_expiring: 'orange',
      new_follower: 'violet',
      review_received: 'yellow',
      achievement_unlocked: 'purple',
      price_alert: 'green',
      system: 'slate',
    };
    return colors[type] || 'slate';
  },

  /**
   * Format notification time
   */
  formatTime(createdAt: string): string {
    const date = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  },

  /**
   * Group notifications by date
   */
  groupByDate(notifications: Notification[]): Record<string, Notification[]> {
    const groups: Record<string, Notification[]> = {
      Today: [],
      Yesterday: [],
      'This Week': [],
      Earlier: [],
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 86400000);
    const weekAgo = new Date(today.getTime() - 7 * 86400000);

    notifications.forEach((notification) => {
      const date = new Date(notification.created_at);
      
      if (date >= today) {
        groups['Today'].push(notification);
      } else if (date >= yesterday) {
        groups['Yesterday'].push(notification);
      } else if (date >= weekAgo) {
        groups['This Week'].push(notification);
      } else {
        groups['Earlier'].push(notification);
      }
    });

    return groups;
  },
};

// ==================== LOCAL NOTIFICATION QUEUE ====================

// For demo/offline mode, we can create local notifications
export const localNotificationQueue = {
  notifications: [] as Notification[],

  /**
   * Add a local notification
   */
  add(notification: Omit<Notification, 'id' | 'created_at'>): Notification {
    const newNotification: Notification = {
      ...notification,
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
    };

    this.notifications.unshift(newNotification);
    
    // Trigger custom event for listeners
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('local-notification', { detail: newNotification })
      );
    }

    return newNotification;
  },

  /**
   * Get all local notifications
   */
  getAll(): Notification[] {
    return this.notifications;
  },

  /**
   * Mark as read
   */
  markAsRead(id: string): void {
    const notification = this.notifications.find((n) => n.id === id);
    if (notification) {
      notification.is_read = true;
    }
  },

  /**
   * Clear all
   */
  clear(): void {
    this.notifications = [];
  },
};

// ==================== DEMO NOTIFICATIONS ====================

export const createDemoNotifications = (): Notification[] => [
  {
    id: 'demo_1',
    user_id: 'demo',
    type: 'new_version',
    title: 'Strategy Updated',
    message: 'Momentum Surge Alpha has been updated to version 2.4.1 with improved risk management.',
    is_read: false,
    created_at: new Date(Date.now() - 5 * 60000).toISOString(),
    action_url: '/strategy/1',
  },
  {
    id: 'demo_2',
    user_id: 'demo',
    type: 'milestone',
    title: 'Milestone Achieved! 🎉',
    message: 'Your portfolio reached $50,000 in total profits. Congratulations!',
    is_read: false,
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: 'demo_3',
    user_id: 'demo',
    type: 'drawdown_alert',
    title: 'Drawdown Alert',
    message: 'Options Gamma Scalper has reached -10% drawdown. Consider reviewing your risk settings.',
    is_read: false,
    created_at: new Date(Date.now() - 6 * 3600000).toISOString(),
    action_url: '/strategy/4',
  },
  {
    id: 'demo_4',
    user_id: 'demo',
    type: 'trade_executed',
    title: 'Trade Executed',
    message: 'AI Sentiment Trader: Bought 100 shares of NVDA at $450.23',
    is_read: true,
    created_at: new Date(Date.now() - 12 * 3600000).toISOString(),
  },
  {
    id: 'demo_5',
    user_id: 'demo',
    type: 'achievement_unlocked',
    title: 'Achievement Unlocked!',
    message: 'You earned the "Profit Master" badge for reaching $10,000 in profits!',
    is_read: true,
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: 'demo_6',
    user_id: 'demo',
    type: 'subscription_expiring',
    title: 'Subscription Expiring Soon',
    message: 'Your subscription to Crypto Arbitrage Pro expires in 3 days. Renew now to avoid interruption.',
    is_read: true,
    created_at: new Date(Date.now() - 48 * 3600000).toISOString(),
    action_url: '/strategy/2',
  },
  {
    id: 'demo_7',
    user_id: 'demo',
    type: 'new_follower',
    title: 'New Follower',
    message: 'Sarah Williams started following you.',
    is_read: true,
    created_at: new Date(Date.now() - 72 * 3600000).toISOString(),
  },
  {
    id: 'demo_8',
    user_id: 'demo',
    type: 'review_received',
    title: 'New Review',
    message: 'Michael Chen left a 5-star review on your "Mean Reversion Elite" strategy.',
    is_read: true,
    created_at: new Date(Date.now() - 96 * 3600000).toISOString(),
    action_url: '/strategy/3',
  },
];
