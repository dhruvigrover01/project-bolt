import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Users, 
  Shield, 
  CheckCircle2, 
  TrendingUp, 
  Calendar,
  Clock,
  DollarSign,
  Target,
  Activity,
  Heart,
  GitCompare,
  Share2,
  Bell,
  MessageSquare,
  ChevronRight,
  Play,
  ExternalLink,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { mockStrategies, mockReviews, mockVersions } from '../../data/mockData';
import { useStore } from '../../store/useStore';
import { useAuth } from '../../contexts/AuthContext';
import PerformanceDashboard from '../dashboard/PerformanceDashboard';
import BacktestPlayer from '../backtest/BacktestPlayer';
import BrokerIntegration from '../broker/BrokerIntegration';
import ReviewsSection from './ReviewsSection';
import VersionHistory from './VersionHistory';
import AIRatingCard from './AIRatingCard';
import CheckoutModal from '../checkout/CheckoutModal';

export default function StrategyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToFavorites, removeFromFavorites, isFavorite, addToCompare, isInCompare, isSubscribed } = useStore();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'backtest' | 'trading' | 'reviews' | 'versions'>('overview');
  const [showCheckout, setShowCheckout] = useState(false);

  const strategy = useMemo(() => mockStrategies.find(s => s.id === id), [id]);

  if (!strategy) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Strategy not found</h2>
          <Link to="/marketplace" className="text-emerald-400 hover:text-emerald-300">
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const yearPerf = strategy.performance.find(p => p.period === '1Y');
  const sixMonthPerf = strategy.performance.find(p => p.period === '6M');
  const favorite = isFavorite(strategy.id);
  const inCompare = isInCompare(strategy.id);
  const subscribed = isSubscribed(strategy.id);

  const handleSubscribe = () => {
    if (!user) {
      navigate('/login', { state: { from: `/strategy/${strategy.id}` } });
      return;
    }
    setShowCheckout(true);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'backtest', label: 'Backtest', icon: Play },
    { id: 'trading', label: 'Auto-Trading', icon: Zap },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'versions', label: 'Versions', icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-start gap-8">
            {/* Left: Strategy Info */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={strategy.creator_avatar}
                  alt={strategy.creator_name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-white">{strategy.name}</h1>
                    {strategy.is_verified && (
                      <CheckCircle2 className="w-6 h-6 text-blue-400" />
                    )}
                  </div>
                  <p className="text-slate-400">
                    by <Link to={`/creator/${strategy.creator_id}`} className="text-emerald-400 hover:text-emerald-300">{strategy.creator_name}</Link>
                    <span className="mx-2">•</span>
                    v{strategy.version || '1.0.0'}
                  </p>
                </div>
              </div>

              <p className="text-slate-300 mb-6 max-w-2xl">{strategy.description}</p>

              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="px-3 py-1.5 bg-slate-800 rounded-lg text-sm text-slate-300">
                  {strategy.category}
                </span>
                <span className="px-3 py-1.5 bg-slate-800 rounded-lg text-sm text-slate-300">
                  {strategy.asset_class}
                </span>
                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  strategy.risk_level === 'low' ? 'bg-emerald-500/20 text-emerald-400' :
                  strategy.risk_level === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-rose-500/20 text-rose-400'
                }`}>
                  {strategy.risk_level.toUpperCase()} RISK
                </span>
                <span className="px-3 py-1.5 bg-slate-800 rounded-lg text-sm text-slate-300">
                  {strategy.timeframe || 'D'} Timeframe
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-white font-semibold">{strategy.rating}</span>
                  <span className="text-slate-400">({strategy.reviews_count || 0} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <Users className="w-5 h-5" />
                  <span>{strategy.total_subscribers.toLocaleString()} subscribers</span>
                </div>
              </div>
            </div>

            {/* Right: Actions & Price */}
            <div className="lg:w-80">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-400">Monthly Subscription</span>
                  <span className="text-3xl font-bold text-white">${strategy.price_monthly}</span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Min Capital Required</span>
                    <span className="text-white font-medium">${strategy.min_capital.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Avg Monthly Trades</span>
                    <span className="text-white font-medium">{strategy.avg_monthly_trades || 20}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Supported Brokers</span>
                    <span className="text-white font-medium">{strategy.supported_brokers?.length || 3}</span>
                  </div>
                </div>

                {subscribed ? (
                  <div className="w-full py-3 bg-emerald-500/20 text-emerald-400 font-semibold rounded-lg mb-3 flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Subscribed
                  </div>
                ) : (
                  <button 
                    onClick={handleSubscribe}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors mb-3 flex items-center justify-center gap-2"
                  >
                    <Zap className="w-5 h-5" />
                    Subscribe Now
                  </button>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => favorite ? removeFromFavorites(strategy.id) : addToFavorites(strategy.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-colors ${
                      favorite ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
                    {favorite ? 'Saved' : 'Save'}
                  </button>
                  <button
                    onClick={() => addToCompare(strategy.id)}
                    disabled={inCompare}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-colors ${
                      inCompare ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    <GitCompare className="w-5 h-5" />
                    {inCompare ? 'Added' : 'Compare'}
                  </button>
                  <button className="p-2.5 bg-slate-700 text-slate-300 hover:bg-slate-600 rounded-lg transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-400">+{yearPerf?.roi_percentage}%</p>
                  <p className="text-xs text-slate-400">1Y ROI</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-white">{yearPerf?.win_rate}%</p>
                  <p className="text-xs text-slate-400">Win Rate</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-white">{yearPerf?.sharpe_ratio}</p>
                  <p className="text-xs text-slate-400">Sharpe Ratio</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-rose-400">{yearPerf?.max_drawdown}%</p>
                  <p className="text-xs text-slate-400">Max Drawdown</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-800 sticky top-16 bg-slate-950/95 backdrop-blur-sm z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-4 font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* AI Rating */}
              {strategy.ai_rating && (
                <AIRatingCard rating={strategy.ai_rating} />
              )}

              {/* Key Metrics */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Key Performance Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">6M ROI</p>
                    <p className="text-2xl font-bold text-emerald-400">+{sixMonthPerf?.roi_percentage}%</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">1Y ROI</p>
                    <p className="text-2xl font-bold text-emerald-400">+{yearPerf?.roi_percentage}%</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">Total Trades</p>
                    <p className="text-2xl font-bold text-white">{yearPerf?.total_trades}</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">Avg Duration</p>
                    <p className="text-2xl font-bold text-white">{yearPerf?.avg_trade_duration}</p>
                  </div>
                </div>
              </div>

              {/* Strategy Description */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">About This Strategy</h3>
                <div className="prose prose-invert max-w-none">
                  <p className="text-slate-300">{strategy.description}</p>
                  <h4 className="text-white mt-6 mb-3">How It Works</h4>
                  <ul className="text-slate-300 space-y-2">
                    <li>Analyzes market trends using proprietary indicators</li>
                    <li>Identifies high-probability entry points based on momentum signals</li>
                    <li>Implements dynamic position sizing based on volatility</li>
                    <li>Uses adaptive stop-loss and take-profit levels</li>
                  </ul>
                </div>
              </div>

              {/* Tags */}
              {strategy.tags && (
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {strategy.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1.5 bg-slate-700 rounded-lg text-sm text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Creator Card */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Creator</h3>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={strategy.creator_avatar}
                    alt={strategy.creator_name}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div>
                    <p className="font-semibold text-white">{strategy.creator_name}</p>
                    <p className="text-sm text-slate-400">Strategy Creator</p>
                  </div>
                </div>
                <Link
                  to={`/creator/${strategy.creator_id}`}
                  className="block w-full py-2 bg-slate-700 hover:bg-slate-600 text-white text-center rounded-lg transition-colors"
                >
                  View Profile
                </Link>
              </div>

              {/* Risk Warning */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-amber-400 mb-2">Risk Warning</h4>
                    <p className="text-sm text-slate-300">
                      Past performance does not guarantee future results. Trading involves risk of loss. 
                      Only invest what you can afford to lose.
                    </p>
                  </div>
                </div>
              </div>

              {/* Supported Brokers */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Supported Brokers</h3>
                <div className="space-y-2">
                  {(strategy.supported_brokers || ['zerodha', 'upstox', 'binance']).map((broker) => (
                    <div key={broker} className="flex items-center gap-3 p-2 bg-slate-900/50 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span className="text-slate-300 capitalize">{broker}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <PerformanceDashboard strategy={strategy} />
        )}

        {activeTab === 'backtest' && (
          <BacktestPlayer strategyId={strategy.id} />
        )}

        {activeTab === 'trading' && (
          <BrokerIntegration strategyId={strategy.id} />
        )}

        {activeTab === 'reviews' && (
          <ReviewsSection strategyId={strategy.id} reviews={mockReviews} />
        )}

        {activeTab === 'versions' && (
          <VersionHistory versions={mockVersions} />
        )}
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        strategy={{
          id: strategy.id,
          name: strategy.name,
          creator_name: strategy.creator_name,
          creator_avatar: strategy.creator_avatar,
          price_monthly: strategy.price_monthly,
          rating: strategy.rating,
          total_subscribers: strategy.total_subscribers,
        }}
      />
    </div>
  );
}
