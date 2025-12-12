import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Gift,
  Settings,
  Trash2,
  Check,
  Filter,
  Users,
  Star,
  Clock,
  Zap,
  DollarSign,
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useStore } from '../../store/useStore';
import { createDemoNotifications, notificationHelpers } from '../../services/notifications';
import { Notification, NotificationType } from '../../types';

export default function NotificationCenter() {
  const { user } = useAuth();
  const { setNotifications: setStoreNotifications } = useStore();
  
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [typeFilter, setTypeFilter] = useState<NotificationType | 'all'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedPrefs, setExpandedPrefs] = useState(false);

  // Load notifications
  useEffect(() => {
    const demoNotifications = createDemoNotifications();
    setNotifications(demoNotifications);
    setStoreNotifications(demoNotifications);
  }, [setStoreNotifications]);

  const getIcon = (type: NotificationType) => {
    const iconMap: Record<NotificationType, React.ReactNode> = {
      new_version: <TrendingUp className="w-5 h-5 text-blue-400" />,
      milestone: <Gift className="w-5 h-5 text-emerald-400" />,
      drawdown_alert: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      trade_executed: <Zap className="w-5 h-5 text-cyan-400" />,
      subscription_expiring: <Clock className="w-5 h-5 text-orange-400" />,
      new_follower: <Users className="w-5 h-5 text-violet-400" />,
      review_received: <Star className="w-5 h-5 text-yellow-400" />,
      achievement_unlocked: <CheckCircle2 className="w-5 h-5 text-purple-400" />,
      price_alert: <DollarSign className="w-5 h-5 text-green-400" />,
      system: <Bell className="w-5 h-5 text-slate-400" />,
    };
    return iconMap[type] || <Bell className="w-5 h-5 text-slate-400" />;
  };

  const getTypeColor = (type: NotificationType) => {
    const colorMap: Record<NotificationType, string> = {
      new_version: 'bg-blue-500/10 border-blue-500/30',
      milestone: 'bg-emerald-500/10 border-emerald-500/30',
      drawdown_alert: 'bg-amber-500/10 border-amber-500/30',
      trade_executed: 'bg-cyan-500/10 border-cyan-500/30',
      subscription_expiring: 'bg-orange-500/10 border-orange-500/30',
      new_follower: 'bg-violet-500/10 border-violet-500/30',
      review_received: 'bg-yellow-500/10 border-yellow-500/30',
      achievement_unlocked: 'bg-purple-500/10 border-purple-500/30',
      price_alert: 'bg-green-500/10 border-green-500/30',
      system: 'bg-slate-500/10 border-slate-500/30',
    };
    return colorMap[type] || 'bg-slate-500/10 border-slate-500/30';
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      if (filter === 'unread' && n.is_read) return false;
      if (typeFilter !== 'all' && n.type !== typeFilter) return false;
      return true;
    });
  }, [notifications, filter, typeFilter]);

  const groupedNotifications = useMemo(() => {
    return notificationHelpers.groupByDate(filteredNotifications);
  }, [filteredNotifications]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, is_read: true } : n
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const refreshNotifications = async () => {
    setLoading(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    const demoNotifications = createDemoNotifications();
    setNotifications(demoNotifications);
    setLoading(false);
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Notification preferences
  const [preferences, setPreferences] = useState({
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
  });

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Notifications</h1>
            <p className="text-slate-400">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={refreshNotifications}
              disabled={loading}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            >
              <Check className="w-4 h-4" />
              <span className="hidden sm:inline">Mark all read</span>
            </button>
            <Link
              to="/settings"
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6">
          <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-emerald-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-emerald-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </button>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 sm:px-4 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 w-full sm:w-auto"
          >
            <option value="all">All Types</option>
            <option value="new_version">Strategy Updates</option>
            <option value="milestone">Milestones</option>
            <option value="drawdown_alert">Alerts</option>
            <option value="trade_executed">Trades</option>
            <option value="achievement_unlocked">Achievements</option>
            <option value="new_follower">Social</option>
            <option value="review_received">Reviews</option>
          </select>
        </div>

        {/* Notifications List */}
        <AnimatePresence mode="popLayout">
          {Object.entries(groupedNotifications).map(([group, items]) => {
            if (items.length === 0) return null;

            return (
              <div key={group} className="mb-6">
                <h3 className="text-sm font-medium text-slate-500 mb-3">{group}</h3>
                <div className="space-y-3">
                  {items.map((notification) => (
                    <motion.div
                      key={notification.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className={`bg-slate-800/50 border rounded-xl p-4 transition-all hover:bg-slate-800/70 ${
                        !notification.is_read 
                          ? 'border-emerald-500/30 bg-emerald-500/5' 
                          : 'border-slate-700/50'
                      }`}
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getTypeColor(notification.type)}`}>
                          {getIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 sm:gap-4">
                            <div className="min-w-0">
                              <h4 className="font-medium text-white truncate">
                                {notification.title}
                              </h4>
                              <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                            </div>
                            {!notification.is_read && (
                              <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 mt-2" />
                            )}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-3">
                            <span className="text-xs text-slate-500">
                              {notificationHelpers.formatTime(notification.created_at)}
                            </span>
                            
                            <div className="flex items-center gap-2">
                              {notification.action_url && (
                                <Link
                                  to={notification.action_url}
                                  className="text-xs text-emerald-400 hover:text-emerald-300"
                                >
                                  View Details
                                </Link>
                              )}
                              {!notification.is_read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-xs text-slate-400 hover:text-white"
                                >
                                  Mark as read
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="text-xs text-slate-400 hover:text-rose-400"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </AnimatePresence>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-16">
            <Bell className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No notifications</h3>
            <p className="text-slate-400">
              {filter === 'unread' 
                ? 'All caught up! No unread notifications.' 
                : 'You have no notifications yet.'}
            </p>
          </div>
        )}

        {/* Clear All */}
        {notifications.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={clearAll}
              className="text-sm text-slate-400 hover:text-rose-400 transition-colors"
            >
              Clear all notifications
            </button>
          </div>
        )}

        {/* Notification Settings */}
        <div className="mt-12 bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
          <button
            onClick={() => setExpandedPrefs(!expandedPrefs)}
            className="w-full flex items-center justify-between p-6 hover:bg-slate-800/50 transition-colors"
          >
            <div>
              <h3 className="text-lg font-semibold text-white text-left">Notification Preferences</h3>
              <p className="text-sm text-slate-400 text-left">Manage what notifications you receive</p>
            </div>
            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${
              expandedPrefs ? 'rotate-180' : ''
            }`} />
          </button>

          <AnimatePresence>
            {expandedPrefs && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 pt-0 border-t border-slate-700/50">
                  {/* Global Settings */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <label className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl cursor-pointer">
                      <div>
                        <p className="text-white font-medium">Email Notifications</p>
                        <p className="text-sm text-slate-400">Receive notifications via email</p>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={preferences.email_notifications}
                          onChange={() => togglePreference('email_notifications')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </div>
                    </label>
                    <label className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl cursor-pointer">
                      <div>
                        <p className="text-white font-medium">Push Notifications</p>
                        <p className="text-sm text-slate-400">Browser push notifications</p>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={preferences.push_notifications}
                          onChange={() => togglePreference('push_notifications')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </div>
                    </label>
                  </div>

                  {/* Specific Preferences */}
                  <div className="space-y-4">
                    {[
                      { key: 'new_versions', label: 'Strategy Updates', desc: 'New versions and changelogs' },
                      { key: 'trade_executed', label: 'Trade Alerts', desc: 'When trades are executed' },
                      { key: 'drawdown_alerts', label: 'Drawdown Alerts', desc: 'When drawdown exceeds threshold' },
                      { key: 'milestones', label: 'Milestones', desc: 'Achievement and profit milestones' },
                      { key: 'price_alerts', label: 'Price Alerts', desc: 'Strategy price changes' },
                      { key: 'subscription_expiring', label: 'Subscription Reminders', desc: 'Before subscriptions expire' },
                      { key: 'new_followers', label: 'Social Updates', desc: 'New followers and mentions' },
                      { key: 'reviews', label: 'Review Notifications', desc: 'Reviews on your strategies' },
                      { key: 'marketing', label: 'Marketing', desc: 'News, tips, and promotions' },
                    ].map((pref) => (
                      <div key={pref.key} className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-white font-medium">{pref.label}</p>
                          <p className="text-sm text-slate-400">{pref.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences[pref.key as keyof typeof preferences]}
                            onChange={() => togglePreference(pref.key as keyof typeof preferences)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
