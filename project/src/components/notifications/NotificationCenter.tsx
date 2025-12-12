import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Gift,
  Settings,
  Trash2,
  Check,
  Filter
} from 'lucide-react';
import { mockNotifications } from '../../data/mockData';
import { NotificationType } from '../../types';

export default function NotificationCenter() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [typeFilter, setTypeFilter] = useState<NotificationType | 'all'>('all');
  const [notifications, setNotifications] = useState(mockNotifications);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'new_version':
        return <TrendingUp className="w-5 h-5 text-blue-400" />;
      case 'milestone':
        return <Gift className="w-5 h-5 text-emerald-400" />;
      case 'drawdown_alert':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'achievement_unlocked':
        return <CheckCircle2 className="w-5 h-5 text-violet-400" />;
      default:
        return <Bell className="w-5 h-5 text-slate-400" />;
    }
  };

  const getTypeColor = (type: NotificationType) => {
    switch (type) {
      case 'new_version':
        return 'bg-blue-500/10 border-blue-500/30';
      case 'milestone':
        return 'bg-emerald-500/10 border-emerald-500/30';
      case 'drawdown_alert':
        return 'bg-amber-500/10 border-amber-500/30';
      case 'achievement_unlocked':
        return 'bg-violet-500/10 border-violet-500/30';
      default:
        return 'bg-slate-500/10 border-slate-500/30';
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread' && n.is_read) return false;
    if (typeFilter !== 'all' && n.type !== typeFilter) return false;
    return true;
  });

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

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Notifications</h1>
            <p className="text-slate-400">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            >
              <Check className="w-4 h-4" />
              Mark all read
            </button>
            <Link
              to="/settings/notifications"
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-emerald-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-emerald-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Unread
            </button>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Types</option>
            <option value="new_version">Updates</option>
            <option value="milestone">Milestones</option>
            <option value="drawdown_alert">Alerts</option>
            <option value="achievement_unlocked">Achievements</option>
          </select>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-slate-800/50 border rounded-xl p-4 transition-all hover:bg-slate-800/70 ${
                  !notification.is_read ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-700/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getTypeColor(notification.type)}`}>
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-medium text-white">{notification.title}</h4>
                        <p className="text-sm text-slate-400 mt-1">{notification.message}</p>
                      </div>
                      {!notification.is_read && (
                        <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 mt-2" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs text-slate-500">
                        {new Date(notification.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
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
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Bell className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No notifications</h3>
            <p className="text-slate-400">
              {filter === 'unread' ? 'All caught up! No unread notifications.' : 'You have no notifications yet.'}
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
        <div className="mt-12 bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
          <div className="space-y-4">
            {[
              { label: 'Strategy Updates', desc: 'New versions and changelogs', enabled: true },
              { label: 'Trade Alerts', desc: 'When trades are executed', enabled: true },
              { label: 'Drawdown Alerts', desc: 'When drawdown exceeds threshold', enabled: true },
              { label: 'Milestones', desc: 'Achievement and profit milestones', enabled: true },
              { label: 'Marketing', desc: 'News, tips, and promotions', enabled: false },
            ].map((pref) => (
              <div key={pref.label} className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{pref.label}</p>
                  <p className="text-sm text-slate-400">{pref.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={pref.enabled}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

