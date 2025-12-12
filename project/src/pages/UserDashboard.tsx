import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  TrendingUp,
  Heart,
  Bell,
  Settings,
  CreditCard,
  Star,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Wallet,
  Target,
  BarChart3,
  Calendar,
  XCircle,
  Zap,
  RefreshCw
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { useStore, Subscription } from '../store/useStore';
import { mockStrategies, mockNotifications } from '../data/mockData';

// Portfolio performance data
const portfolioData = [
  { date: 'Jan', value: 10000, profit: 0 },
  { date: 'Feb', value: 10850, profit: 850 },
  { date: 'Mar', value: 11200, profit: 1200 },
  { date: 'Apr', value: 10900, profit: 900 },
  { date: 'May', value: 12100, profit: 2100 },
  { date: 'Jun', value: 13500, profit: 3500 },
  { date: 'Jul', value: 14200, profit: 4200 },
  { date: 'Aug', value: 15100, profit: 5100 },
  { date: 'Sep', value: 14800, profit: 4800 },
  { date: 'Oct', value: 16200, profit: 6200 },
  { date: 'Nov', value: 17500, profit: 7500 },
  { date: 'Dec', value: 18900, profit: 8900 },
];

// Asset allocation data
const allocationData = [
  { name: 'Stocks', value: 45, color: '#10B981' },
  { name: 'Crypto', value: 30, color: '#3B82F6' },
  { name: 'Forex', value: 15, color: '#F59E0B' },
  { name: 'Options', value: 10, color: '#8B5CF6' },
];

export default function UserDashboard() {
  const { profile } = useAuth();
  const { favorites, subscriptions, cancelSubscription } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'subscriptions' | 'strategies' | 'performance' | 'activity'>('overview');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Get subscribed strategies from mock data for additional info
  const getStrategyDetails = (strategyId: string) => {
    return mockStrategies.find(s => s.id === strategyId);
  };

  const favoriteStrategies = mockStrategies.filter(s => favorites.includes(s.id));
  const recentNotifications = mockNotifications.slice(0, 5);
  
  // Active subscriptions
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  const cancelledSubscriptions = subscriptions.filter(s => s.status === 'cancelled');

  // Stats
  const stats = {
    totalValue: 18900,
    totalProfit: 8900,
    profitPercent: 89,
    activeStrategies: activeSubscriptions.length || 3,
    totalTrades: 156,
    winRate: 68.5,
    monthlySpend: activeSubscriptions.reduce((acc, sub) => acc + sub.priceMonthly, 0) || 597,
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    setCancellingId(subscriptionId);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    cancelSubscription(subscriptionId);
    setCancellingId(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-emerald-400" />
              Dashboard
            </h1>
            <p className="text-slate-400 mt-1">Welcome back, {profile?.name || 'Trader'}!</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/marketplace"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              Browse Strategies
            </Link>
            <Link
              to="/settings"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'subscriptions', label: 'My Subscriptions', icon: CreditCard },
            { id: 'strategies', label: 'Strategies', icon: TrendingUp },
            { id: 'performance', label: 'Performance', icon: BarChart3 },
            { id: 'activity', label: 'Activity', icon: Clock },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.id === 'subscriptions' && activeSubscriptions.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-xs">
                  {activeSubscriptions.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: 'Portfolio Value', value: `$${stats.totalValue.toLocaleString()}`, icon: Wallet, color: 'text-white', trend: '+12.5%', trendUp: true },
                { label: 'Total Profit', value: `$${stats.totalProfit.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-400', trend: `+${stats.profitPercent}%`, trendUp: true },
                { label: 'Active Strategies', value: stats.activeStrategies, icon: Target, color: 'text-blue-400' },
                { label: 'Total Trades', value: stats.totalTrades, icon: BarChart3, color: 'text-violet-400' },
                { label: 'Win Rate', value: `${stats.winRate}%`, icon: CheckCircle2, color: 'text-emerald-400' },
                { label: 'Monthly Spend', value: `$${stats.monthlySpend}`, icon: CreditCard, color: 'text-amber-400' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    {stat.trend && (
                      <span className={`text-xs flex items-center gap-1 ${stat.trendUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {stat.trend}
                      </span>
                    )}
                  </div>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Portfolio Chart */}
              <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Portfolio Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={portfolioData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
                    <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(v) => `$${v/1000}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px' }}
                      labelStyle={{ color: '#F8FAFC' }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                    />
                    <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Allocation Pie Chart */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Asset Allocation</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px' }}
                      formatter={(value: number) => [`${value}%`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {allocationData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-300">{item.name}</span>
                      </div>
                      <span className="text-white font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Subscriptions Preview & Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Subscriptions Preview */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Active Subscriptions</h3>
                  <button 
                    onClick={() => setActiveTab('subscriptions')}
                    className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center gap-1"
                  >
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                {activeSubscriptions.length > 0 ? (
                  <div className="space-y-4">
                    {activeSubscriptions.slice(0, 3).map((subscription) => (
                      <Link
                        key={subscription.id}
                        to={`/strategy/${subscription.strategyId}`}
                        className="flex items-center gap-4 p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900 transition-colors"
                      >
                        <img
                          src={subscription.creatorAvatar}
                          alt={subscription.creatorName}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{subscription.strategyName}</p>
                          <p className="text-sm text-slate-400">{subscription.creatorName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-emerald-400 font-bold">${subscription.priceMonthly}</p>
                          <p className="text-xs text-slate-400">/month</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CreditCard className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 mb-3">No active subscriptions</p>
                    <Link
                      to="/marketplace"
                      className="text-emerald-400 hover:text-emerald-300 text-sm"
                    >
                      Browse strategies →
                    </Link>
                  </div>
                )}
              </div>

              {/* Recent Notifications */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                  <Link to="/notifications" className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center gap-1">
                    View All <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {recentNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg ${notification.is_read ? 'bg-slate-900/30' : 'bg-emerald-500/10 border border-emerald-500/20'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 mt-2 rounded-full ${notification.is_read ? 'bg-slate-600' : 'bg-emerald-500'}`} />
                        <div>
                          <p className="text-sm text-white font-medium">{notification.title}</p>
                          <p className="text-xs text-slate-400 mt-1">{notification.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subscriptions Tab */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{activeSubscriptions.length}</p>
                    <p className="text-sm text-slate-400">Active Subscriptions</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      ${activeSubscriptions.reduce((acc, sub) => acc + sub.priceMonthly, 0)}
                    </p>
                    <p className="text-sm text-slate-400">Monthly Spend</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{cancelledSubscriptions.length}</p>
                    <p className="text-sm text-slate-400">Cancelled</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Subscriptions */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-400" />
                Active Subscriptions
              </h3>
              {activeSubscriptions.length > 0 ? (
                <div className="grid gap-4">
                  {activeSubscriptions.map((subscription) => {
                    const strategyDetails = getStrategyDetails(subscription.strategyId);
                    return (
                      <motion.div
                        key={subscription.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6"
                      >
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          <img
                            src={subscription.creatorAvatar}
                            alt={subscription.strategyName}
                            className="w-16 h-16 rounded-xl object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-lg font-semibold text-white">{subscription.strategyName}</h4>
                              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs font-medium">
                                Active
                              </span>
                            </div>
                            <p className="text-sm text-slate-400">by {subscription.creatorName}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span className="text-slate-400 flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Started {new Date(subscription.startDate).toLocaleDateString()}
                              </span>
                              <span className="text-slate-400 flex items-center gap-1">
                                <RefreshCw className="w-4 h-4" />
                                Renews {new Date(subscription.nextBillingDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-2xl font-bold text-white">${subscription.priceMonthly}</p>
                              <p className="text-xs text-slate-400">per month</p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Link
                                to={`/strategy/${subscription.strategyId}`}
                                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors text-center"
                              >
                                View Strategy
                              </Link>
                              <button
                                onClick={() => handleCancelSubscription(subscription.id)}
                                disabled={cancellingId === subscription.id}
                                className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                              >
                                {cancellingId === subscription.id ? 'Cancelling...' : 'Cancel'}
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center gap-4 text-sm">
                          <span className="text-slate-400">
                            Payment: {subscription.paymentMethod} •••• {subscription.lastFourDigits}
                          </span>
                          {strategyDetails && (
                            <>
                              <span className="text-emerald-400">
                                +{strategyDetails.performance[0]?.roi_percentage}% ROI
                              </span>
                              <span className="text-slate-400">
                                {strategyDetails.total_subscribers.toLocaleString()} subscribers
                              </span>
                            </>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-12 text-center">
                  <CreditCard className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-white mb-2">No Active Subscriptions</h4>
                  <p className="text-slate-400 mb-4">Subscribe to strategies to start receiving trading signals</p>
                  <Link
                    to="/marketplace"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                  >
                    <Target className="w-4 h-4" />
                    Browse Marketplace
                  </Link>
                </div>
              )}
            </div>

            {/* Cancelled Subscriptions */}
            {cancelledSubscriptions.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-400" />
                  Cancelled Subscriptions
                </h3>
                <div className="grid gap-4">
                  {cancelledSubscriptions.map((subscription) => (
                    <div
                      key={subscription.id}
                      className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-6 opacity-60"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={subscription.creatorAvatar}
                          alt={subscription.strategyName}
                          className="w-12 h-12 rounded-xl object-cover grayscale"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{subscription.strategyName}</h4>
                          <p className="text-sm text-slate-400">by {subscription.creatorName}</p>
                        </div>
                        <span className="px-2 py-1 bg-rose-500/20 text-rose-400 rounded text-xs font-medium">
                          Cancelled
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Strategies Tab */}
        {activeTab === 'strategies' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeSubscriptions.length > 0 ? (
                activeSubscriptions.map((subscription, index) => {
                  const strategy = getStrategyDetails(subscription.strategyId);
                  if (!strategy) return null;
                  
                  return (
                    <motion.div
                      key={subscription.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={strategy.creator_avatar}
                              alt={strategy.creator_name}
                              className="w-12 h-12 rounded-xl object-cover"
                            />
                            <div>
                              <h3 className="font-semibold text-white">{strategy.name}</h3>
                              <p className="text-sm text-slate-400">{strategy.creator_name}</p>
                            </div>
                          </div>
                          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-medium">
                            Active
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center">
                            <p className="text-emerald-400 font-bold">+{strategy.performance[0]?.roi_percentage}%</p>
                            <p className="text-xs text-slate-400">ROI</p>
                          </div>
                          <div className="text-center">
                            <p className="text-white font-bold">{strategy.performance[0]?.win_rate}%</p>
                            <p className="text-xs text-slate-400">Win Rate</p>
                          </div>
                          <div className="text-center">
                            <p className="text-white font-bold">{strategy.performance[0]?.total_trades}</p>
                            <p className="text-xs text-slate-400">Trades</p>
                          </div>
                        </div>

                        <Link
                          to={`/strategy/${strategy.id}`}
                          className="block w-full py-2 text-center bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <Target className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Active Strategies</h3>
                  <p className="text-slate-400 mb-4">Subscribe to strategies to start trading</p>
                  <Link
                    to="/marketplace"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                  >
                    Browse Marketplace
                  </Link>
                </div>
              )}
            </div>

            {/* Favorites Section */}
            {favoriteStrategies.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-400" />
                  Favorites
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteStrategies.slice(0, 3).map((strategy) => (
                    <Link
                      key={strategy.id}
                      to={`/strategy/${strategy.id}`}
                      className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-rose-500/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={strategy.creator_avatar}
                          alt={strategy.creator_name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <h4 className="text-white font-medium">{strategy.name}</h4>
                          <p className="text-sm text-slate-400">{strategy.creator_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-emerald-400 font-bold">+{strategy.performance[0]?.roi_percentage}%</span>
                        <span className="text-slate-400">${strategy.price_monthly}/mo</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            {/* Performance Chart */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Profit/Loss Over Time</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={portfolioData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(v) => `$${v.toLocaleString()}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#F8FAFC' }}
                    formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name === 'profit' ? 'Profit' : 'Value']}
                  />
                  <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={false} name="Portfolio Value" />
                  <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} dot={false} name="Profit" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Performance */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Monthly Returns</h3>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
                {portfolioData.map((month, index) => {
                  const prevValue = index > 0 ? portfolioData[index - 1].value : 10000;
                  const returnPct = ((month.value - prevValue) / prevValue * 100).toFixed(1);
                  const isPositive = parseFloat(returnPct) >= 0;
                  
                  return (
                    <div
                      key={month.date}
                      className={`p-3 rounded-lg text-center ${isPositive ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}
                    >
                      <p className="text-xs text-slate-400 mb-1">{month.date}</p>
                      <p className={`text-sm font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isPositive ? '+' : ''}{returnPct}%
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { action: 'Subscribed to', target: 'Momentum Surge Alpha', time: '2 hours ago', icon: CheckCircle2, color: 'text-emerald-400' },
                { action: 'Added to favorites', target: 'Crypto Arbitrage Pro', time: '5 hours ago', icon: Heart, color: 'text-rose-400' },
                { action: 'Trade executed', target: '+$245.00 profit', time: '1 day ago', icon: TrendingUp, color: 'text-emerald-400' },
                { action: 'Received notification', target: 'New strategy available', time: '2 days ago', icon: Bell, color: 'text-blue-400' },
                { action: 'Profile updated', target: 'Avatar changed', time: '3 days ago', icon: Settings, color: 'text-slate-400' },
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-lg"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-slate-800 ${activity.color}`}>
                    <activity.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white">
                      {activity.action} <span className="font-medium">{activity.target}</span>
                    </p>
                    <p className="text-sm text-slate-400">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
