import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Eye, 
  Star,
  BarChart3,
  PieChart as PieChartIcon,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Download,
  Calendar,
  Edit,
  Trash2,
  Upload,
  X,
  Image,
  Tag,
  DollarSign as PriceIcon,
  AlertCircle,
  CheckCircle2,
  FileText,
  Settings,
  ExternalLink
} from 'lucide-react';
import { mockCreatorAnalytics, mockStrategies } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';

export default function CreatorDashboard() {
  const { profile } = useAuth();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [activeTab, setActiveTab] = useState<'overview' | 'strategies' | 'analytics' | 'earnings'>('overview');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadStep, setUploadStep] = useState(1);
  
  // Form state for new strategy
  const [newStrategy, setNewStrategy] = useState({
    name: '',
    description: '',
    category: 'Momentum',
    asset_class: 'Stocks',
    price_monthly: '',
    min_capital: '',
    risk_level: 'medium',
    timeframe: '4H',
    tags: [] as string[],
    tagInput: '',
  });

  const analytics = mockCreatorAnalytics;
  const myStrategies = mockStrategies.slice(0, 3);

  const stats = [
    {
      label: 'Total Earnings',
      value: `$${analytics.total_earnings.toLocaleString()}`,
      change: '+12.5%',
      positive: true,
      icon: DollarSign,
      color: 'emerald',
    },
    {
      label: 'Total Subscribers',
      value: analytics.total_subscribers.toLocaleString(),
      change: '+8.3%',
      positive: true,
      icon: Users,
      color: 'blue',
    },
    {
      label: 'Monthly Revenue',
      value: `$${analytics.mrr.toLocaleString()}`,
      change: '+15.2%',
      positive: true,
      icon: TrendingUp,
      color: 'violet',
    },
    {
      label: 'Total Views',
      value: analytics.total_views.toLocaleString(),
      change: '+23.1%',
      positive: true,
      icon: Eye,
      color: 'amber',
    },
  ];

  const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6'];

  const handleAddTag = () => {
    if (newStrategy.tagInput && !newStrategy.tags.includes(newStrategy.tagInput)) {
      setNewStrategy({
        ...newStrategy,
        tags: [...newStrategy.tags, newStrategy.tagInput],
        tagInput: '',
      });
    }
  };

  const handleRemoveTag = (tag: string) => {
    setNewStrategy({
      ...newStrategy,
      tags: newStrategy.tags.filter(t => t !== tag),
    });
  };

  const handleSubmitStrategy = () => {
    // In a real app, this would submit to the backend
    console.log('Submitting strategy:', newStrategy);
    setShowUploadModal(false);
    setUploadStep(1);
    setNewStrategy({
      name: '',
      description: '',
      category: 'Momentum',
      asset_class: 'Stocks',
      price_monthly: '',
      min_capital: '',
      risk_level: 'medium',
      timeframe: '4H',
      tags: [],
      tagInput: '',
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Creator Dashboard</h1>
            <p className="text-slate-400">Welcome back, {profile?.name || 'Creator'}! Track your strategy performance and earnings.</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors">
              <Download className="w-5 h-5" />
              Export
            </button>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Strategy
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'strategies', label: 'My Strategies', icon: FileText },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'earnings', label: 'Earnings', icon: DollarSign },
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
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${stat.color}-500/20`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${stat.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {stat.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {stat.change}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Revenue Chart */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Revenue Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.revenue_history}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#F8FAFC' }}
                    formatter={(value: number) => [`$${value}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#10B981" strokeWidth={2} fill="url(#revenueGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Subscriber Growth */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Subscriber Growth</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={analytics.subscriber_history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
                    <YAxis stroke="#94A3B8" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px' }}
                      labelStyle={{ color: '#F8FAFC' }}
                    />
                    <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Strategy Distribution */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Revenue by Strategy</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={analytics.strategy_breakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="revenue"
                    >
                      {analytics.strategy_breakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px' }}
                      formatter={(value: number) => [`$${value}`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Strategies Tab */}
        {activeTab === 'strategies' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">My Strategies ({myStrategies.length})</h3>
              <button 
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Strategy
              </button>
            </div>

            <div className="grid gap-4">
              {myStrategies.map((strategy, index) => (
                <motion.div
                  key={strategy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <img
                      src={strategy.creator_avatar}
                      alt={strategy.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-semibold text-white">{strategy.name}</h4>
                        {strategy.is_verified && (
                          <CheckCircle2 className="w-5 h-5 text-blue-400" />
                        )}
                      </div>
                      <p className="text-sm text-slate-400 line-clamp-1">{strategy.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-slate-400">
                          <Users className="w-4 h-4 inline mr-1" />
                          {strategy.total_subscribers} subscribers
                        </span>
                        <span className="text-slate-400">
                          <Star className="w-4 h-4 inline mr-1 text-yellow-400" />
                          {strategy.rating}
                        </span>
                        <span className="text-emerald-400 font-medium">
                          ${strategy.price_monthly}/mo
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right mr-4">
                        <p className="text-emerald-400 font-bold text-lg">+{strategy.performance[0]?.roi_percentage}%</p>
                        <p className="text-xs text-slate-400">6M ROI</p>
                      </div>
                      <button className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button className="p-2 bg-slate-700 hover:bg-rose-600 text-white rounded-lg transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Views Chart */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Strategy Views</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.views_history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
                  <YAxis stroke="#94A3B8" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#F8FAFC' }}
                  />
                  <Bar dataKey="views" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Geographic Distribution */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-400" />
                Geographic Distribution
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {analytics.geographic_breakdown.map((region) => (
                  <div key={region.region} className="bg-slate-900/50 rounded-lg p-4">
                    <p className="text-white font-medium">{region.region}</p>
                    <p className="text-2xl font-bold text-emerald-400">{region.percentage}%</p>
                    <p className="text-sm text-slate-400">{region.users.toLocaleString()} users</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Earnings Tab */}
        {activeTab === 'earnings' && (
          <div className="space-y-6">
            {/* Earnings Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <p className="text-slate-400 mb-2">Total Earnings</p>
                <p className="text-3xl font-bold text-emerald-400">${analytics.total_earnings.toLocaleString()}</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <p className="text-slate-400 mb-2">This Month</p>
                <p className="text-3xl font-bold text-white">${analytics.mrr.toLocaleString()}</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <p className="text-slate-400 mb-2">Pending Payout</p>
                <p className="text-3xl font-bold text-amber-400">$2,450</p>
              </div>
            </div>

            {/* Earnings History */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Earnings History</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Date</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Strategy</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Type</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-medium">Amount</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { date: 'Dec 10, 2024', strategy: 'Momentum Surge Alpha', type: 'Subscription', amount: 299, status: 'Paid' },
                      { date: 'Dec 9, 2024', strategy: 'Crypto Arbitrage Pro', type: 'Subscription', amount: 499, status: 'Paid' },
                      { date: 'Dec 8, 2024', strategy: 'Momentum Surge Alpha', type: 'Subscription', amount: 299, status: 'Paid' },
                      { date: 'Dec 7, 2024', strategy: 'Options Wheel Strategy', type: 'Subscription', amount: 199, status: 'Pending' },
                      { date: 'Dec 5, 2024', strategy: 'Momentum Surge Alpha', type: 'Tip', amount: 50, status: 'Paid' },
                    ].map((transaction, index) => (
                      <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="py-3 px-4 text-slate-300">{transaction.date}</td>
                        <td className="py-3 px-4 text-white">{transaction.strategy}</td>
                        <td className="py-3 px-4 text-slate-400">{transaction.type}</td>
                        <td className="py-3 px-4 text-right text-emerald-400 font-medium">${transaction.amount}</td>
                        <td className="py-3 px-4 text-right">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            transaction.status === 'Paid' 
                              ? 'bg-emerald-500/20 text-emerald-400' 
                              : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Upload Strategy Modal */}
        <AnimatePresence>
          {showUploadModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowUploadModal(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                  <h2 className="text-xl font-bold text-white">Create New Strategy</h2>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Progress Steps */}
                <div className="px-6 py-4 border-b border-slate-700">
                  <div className="flex items-center justify-between">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                          uploadStep >= step ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'
                        }`}>
                          {step}
                        </div>
                        <span className={`ml-2 text-sm ${uploadStep >= step ? 'text-white' : 'text-slate-400'}`}>
                          {step === 1 ? 'Basic Info' : step === 2 ? 'Details' : 'Pricing'}
                        </span>
                        {step < 3 && <div className={`w-16 h-0.5 mx-4 ${uploadStep > step ? 'bg-emerald-500' : 'bg-slate-700'}`} />}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {uploadStep === 1 && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Strategy Name *</label>
                        <input
                          type="text"
                          value={newStrategy.name}
                          onChange={(e) => setNewStrategy({ ...newStrategy, name: e.target.value })}
                          placeholder="e.g., Momentum Surge Alpha"
                          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Description *</label>
                        <textarea
                          value={newStrategy.description}
                          onChange={(e) => setNewStrategy({ ...newStrategy, description: e.target.value })}
                          placeholder="Describe your strategy, its approach, and what makes it unique..."
                          rows={4}
                          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                          <select
                            value={newStrategy.category}
                            onChange={(e) => setNewStrategy({ ...newStrategy, category: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                          >
                            <option value="Momentum">Momentum</option>
                            <option value="Mean Reversion">Mean Reversion</option>
                            <option value="Arbitrage">Arbitrage</option>
                            <option value="Trend Following">Trend Following</option>
                            <option value="Scalping">Scalping</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Asset Class</label>
                          <select
                            value={newStrategy.asset_class}
                            onChange={(e) => setNewStrategy({ ...newStrategy, asset_class: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                          >
                            <option value="Stocks">Stocks</option>
                            <option value="Crypto">Crypto</option>
                            <option value="Forex">Forex</option>
                            <option value="Options">Options</option>
                            <option value="Futures">Futures</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {uploadStep === 2 && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Risk Level</label>
                          <select
                            value={newStrategy.risk_level}
                            onChange={(e) => setNewStrategy({ ...newStrategy, risk_level: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Timeframe</label>
                          <select
                            value={newStrategy.timeframe}
                            onChange={(e) => setNewStrategy({ ...newStrategy, timeframe: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                          >
                            <option value="1M">1 Minute</option>
                            <option value="5M">5 Minutes</option>
                            <option value="15M">15 Minutes</option>
                            <option value="1H">1 Hour</option>
                            <option value="4H">4 Hours</option>
                            <option value="1D">Daily</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Tags</label>
                        <div className="flex gap-2 mb-2 flex-wrap">
                          {newStrategy.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm flex items-center gap-1"
                            >
                              {tag}
                              <button onClick={() => handleRemoveTag(tag)} className="hover:text-emerald-300">
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newStrategy.tagInput}
                            onChange={(e) => setNewStrategy({ ...newStrategy, tagInput: e.target.value })}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                            placeholder="Add tags..."
                            className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                          />
                          <button
                            onClick={handleAddTag}
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Upload Performance Data</label>
                        <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer">
                          <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                          <p className="text-slate-300 mb-1">Drag and drop files here</p>
                          <p className="text-sm text-slate-500">CSV, Excel, or JSON format</p>
                        </div>
                      </div>
                    </>
                  )}

                  {uploadStep === 3 && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Monthly Price ($) *</label>
                          <input
                            type="number"
                            value={newStrategy.price_monthly}
                            onChange={(e) => setNewStrategy({ ...newStrategy, price_monthly: e.target.value })}
                            placeholder="299"
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Minimum Capital ($)</label>
                          <input
                            type="number"
                            value={newStrategy.min_capital}
                            onChange={(e) => setNewStrategy({ ...newStrategy, min_capital: e.target.value })}
                            placeholder="10000"
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                        <h4 className="text-white font-medium mb-2">Revenue Split</h4>
                        <p className="text-sm text-slate-400 mb-3">AlgoMart takes a 20% platform fee on all earnings</p>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">Your earnings per subscription:</span>
                          <span className="text-emerald-400 font-bold text-lg">
                            ${newStrategy.price_monthly ? (parseFloat(newStrategy.price_monthly) * 0.8).toFixed(2) : '0.00'}
                          </span>
                        </div>
                      </div>
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="text-amber-400 font-medium">Before publishing</p>
                          <p className="text-slate-400">Your strategy will be reviewed by our team to ensure quality standards. This usually takes 24-48 hours.</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-3 p-6 border-t border-slate-700">
                  {uploadStep > 1 && (
                    <button
                      onClick={() => setUploadStep(uploadStep - 1)}
                      className="flex-1 py-3 px-4 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition-colors"
                    >
                      Back
                    </button>
                  )}
                  {uploadStep < 3 ? (
                    <button
                      onClick={() => setUploadStep(uploadStep + 1)}
                      className="flex-1 py-3 px-4 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitStrategy}
                      className="flex-1 py-3 px-4 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Submit for Review
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
