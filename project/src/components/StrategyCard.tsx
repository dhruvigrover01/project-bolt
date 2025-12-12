import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, Shield, Users, Star, CheckCircle2, Heart, BarChart2, Zap } from 'lucide-react';
import { Strategy } from '../types';
import { useStore } from '../store/useStore';
import { useAuth } from '../contexts/AuthContext';
import CheckoutModal from './checkout/CheckoutModal';

interface StrategyCardProps {
  strategy: Strategy;
}

export default function StrategyCard({ strategy }: StrategyCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toggleFavorite, isFavorite, isSubscribed } = useStore();
  const [showCheckout, setShowCheckout] = useState(false);
  
  const yearPerformance = strategy.performance.find((p) => p.period === '1Y');
  const sixMonthPerformance = strategy.performance.find((p) => p.period === '6M');
  const favorite = isFavorite(strategy.id);
  const subscribed = isSubscribed(strategy.id);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      case 'medium':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'high':
        return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      default:
        return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  const handleSubscribe = () => {
    if (!user) {
      navigate('/login', { state: { from: `/strategy/${strategy.id}` } });
      return;
    }
    setShowCheckout(true);
  };

  return (
    <>
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Link 
                  to={`/strategy/${strategy.id}`}
                  className="text-lg font-bold text-white hover:text-emerald-400 transition-colors truncate"
                >
                  {strategy.name}
                </Link>
                {strategy.is_verified && (
                  <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <img
                  src={strategy.creator_avatar}
                  alt={strategy.creator_name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="truncate">{strategy.creator_name}</span>
                <span className="flex items-center gap-1 flex-shrink-0">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {strategy.rating}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => toggleFavorite(strategy.id)}
                className={`p-2 rounded-lg transition-colors ${
                  favorite 
                    ? 'bg-rose-500/20 text-rose-400' 
                    : 'bg-slate-700/50 text-slate-400 hover:text-rose-400'
                }`}
              >
                <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
              </button>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold border ${getRiskColor(
                  strategy.risk_level
                )}`}
              >
                {strategy.risk_level.toUpperCase()}
              </span>
            </div>
          </div>

          <p className="text-slate-400 text-sm mb-4 line-clamp-2">
            {strategy.description}
          </p>

          <div className="flex gap-2 mb-4 flex-wrap">
            <span className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded-full text-xs font-medium">
              {strategy.category}
            </span>
            <span className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded-full text-xs font-medium">
              {strategy.asset_class}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4 p-4 bg-slate-900/50 rounded-xl">
            <div>
              <div className="text-xs text-slate-500 mb-1">6M ROI</div>
              <div className="text-xl font-bold text-emerald-400 flex items-center gap-1">
                +{sixMonthPerformance?.roi_percentage}%
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">1Y ROI</div>
              <div className="text-xl font-bold text-emerald-400 flex items-center gap-1">
                +{yearPerformance?.roi_percentage}%
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Sharpe Ratio</div>
              <div className="text-lg font-bold text-white">
                {yearPerformance?.sharpe_ratio}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Win Rate</div>
              <div className="text-lg font-bold text-white">
                {yearPerformance?.win_rate}%
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4 text-sm text-slate-400">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{strategy.total_subscribers.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              <span>${strategy.min_capital.toLocaleString()} min</span>
            </div>
            <div className="flex items-center gap-1">
              <BarChart2 className="w-4 h-4" />
              <span>{strategy.timeframe}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
            <div>
              <div className="text-xs text-slate-500">Monthly</div>
              <div className="text-2xl font-bold text-white">
                ${strategy.price_monthly}
              </div>
            </div>
            {subscribed ? (
              <Link
                to={`/strategy/${strategy.id}`}
                className="px-5 py-2.5 bg-emerald-500/20 text-emerald-400 font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Subscribed
              </Link>
            ) : (
              <button 
                onClick={handleSubscribe}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Subscribe
              </button>
            )}
          </div>
        </div>
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
    </>
  );
}
