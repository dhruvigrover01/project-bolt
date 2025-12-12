import { TrendingUp, Shield, Users, Star, CheckCircle2 } from 'lucide-react';
import { Strategy } from '../types';

interface StrategyCardProps {
  strategy: Strategy;
}

export default function StrategyCard({ strategy }: StrategyCardProps) {
  const yearPerformance = strategy.performance.find((p) => p.period === '1Y');
  const sixMonthPerformance = strategy.performance.find((p) => p.period === '6M');

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'medium':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-gray-900">{strategy.name}</h3>
              {strategy.is_verified && (
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
              <img
                src={strategy.creator_avatar}
                alt={strategy.creator_name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span>{strategy.creator_name}</span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {strategy.rating}
              </span>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRiskColor(
              strategy.risk_level
            )}`}
          >
            {strategy.risk_level.toUpperCase()} RISK
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {strategy.description}
        </p>

        <div className="flex gap-2 mb-4">
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            {strategy.category}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            {strategy.asset_class}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
          <div>
            <div className="text-xs text-gray-600 mb-1">6M ROI</div>
            <div className="text-2xl font-bold text-green-600 flex items-center gap-1">
              +{sixMonthPerformance?.roi_percentage}%
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">1Y ROI</div>
            <div className="text-2xl font-bold text-green-600 flex items-center gap-1">
              +{yearPerformance?.roi_percentage}%
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Sharpe Ratio</div>
            <div className="text-lg font-bold text-gray-900">
              {yearPerformance?.sharpe_ratio}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Win Rate</div>
            <div className="text-lg font-bold text-gray-900">
              {yearPerformance?.win_rate}%
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{strategy.total_subscribers.toLocaleString()} subscribers</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4" />
            <span>Min ${strategy.min_capital.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div>
            <div className="text-xs text-gray-600">Monthly Rental</div>
            <div className="text-2xl font-bold text-gray-900">
              ${strategy.price_monthly}
            </div>
          </div>
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg">
            Rent Strategy
          </button>
        </div>
      </div>
    </div>
  );
}
