import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  ChevronDown, 
  ChevronUp,
  Star,
  TrendingUp,
  Users,
  Shield,
  CheckCircle2,
  Heart,
  GitCompare,
  Filter
} from 'lucide-react';
import { Strategy, SearchFilters, BrokerType } from '../../types';
import { mockStrategies } from '../../data/mockData';
import { useStore } from '../../store/useStore';

export default function AdvancedSearch() {
  const { addToFavorites, removeFromFavorites, isFavorite, addToCompare, isInCompare, compareList } = useStore();
  
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState<Partial<SearchFilters>>({
    query: '',
    category: [],
    asset_class: [],
    risk_level: [],
    min_roi: 0,
    max_roi: 200,
    min_win_rate: 0,
    min_capital: 0,
    max_capital: 500000,
    min_sharpe: 0,
    min_rating: 0,
    is_verified: false,
    has_auto_trading: false,
    supported_brokers: [],
    sort_by: 'roi',
    sort_order: 'desc',
  });

  const categories = ['Momentum', 'Arbitrage', 'Mean Reversion', 'Options', 'AI/ML', 'Statistical Arbitrage'];
  const assetClasses = ['Stocks', 'Crypto', 'Forex', 'Derivatives'];
  const riskLevels = ['low', 'medium', 'high'] as const;
  const brokers: BrokerType[] = ['zerodha', 'upstox', 'dhan', 'fyers', 'binance', 'bybit'];
  const timeframes = ['1M', '5M', '15M', '1H', '4H', 'D', 'W'];

  const filteredStrategies = useMemo(() => {
    let result = [...mockStrategies];

    // Text search
    if (filters.query) {
      const query = filters.query.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query) ||
        s.creator_name.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters.category && filters.category.length > 0) {
      result = result.filter(s => filters.category?.includes(s.category));
    }

    // Asset class filter
    if (filters.asset_class && filters.asset_class.length > 0) {
      result = result.filter(s => filters.asset_class?.includes(s.asset_class));
    }

    // Risk level filter
    if (filters.risk_level && filters.risk_level.length > 0) {
      result = result.filter(s => filters.risk_level?.includes(s.risk_level));
    }

    // ROI filter
    if (filters.min_roi !== undefined) {
      result = result.filter(s => {
        const roi = s.performance.find(p => p.period === '1Y')?.roi_percentage || 0;
        return roi >= (filters.min_roi || 0);
      });
    }

    // Win rate filter
    if (filters.min_win_rate) {
      result = result.filter(s => {
        const winRate = s.performance.find(p => p.period === '1Y')?.win_rate || 0;
        return winRate >= filters.min_win_rate!;
      });
    }

    // Capital filter
    if (filters.min_capital !== undefined || filters.max_capital !== undefined) {
      result = result.filter(s => 
        s.min_capital >= (filters.min_capital || 0) &&
        s.min_capital <= (filters.max_capital || Infinity)
      );
    }

    // Sharpe filter
    if (filters.min_sharpe) {
      result = result.filter(s => {
        const sharpe = s.performance.find(p => p.period === '1Y')?.sharpe_ratio || 0;
        return sharpe >= filters.min_sharpe!;
      });
    }

    // Rating filter
    if (filters.min_rating) {
      result = result.filter(s => s.rating >= filters.min_rating!);
    }

    // Verified filter
    if (filters.is_verified) {
      result = result.filter(s => s.is_verified);
    }

    // Sort
    result.sort((a, b) => {
      let aVal = 0, bVal = 0;
      switch (filters.sort_by) {
        case 'roi':
          aVal = a.performance.find(p => p.period === '1Y')?.roi_percentage || 0;
          bVal = b.performance.find(p => p.period === '1Y')?.roi_percentage || 0;
          break;
        case 'rating':
          aVal = a.rating;
          bVal = b.rating;
          break;
        case 'subscribers':
          aVal = a.total_subscribers;
          bVal = b.total_subscribers;
          break;
        case 'sharpe':
          aVal = a.performance.find(p => p.period === '1Y')?.sharpe_ratio || 0;
          bVal = b.performance.find(p => p.period === '1Y')?.sharpe_ratio || 0;
          break;
        case 'price':
          aVal = a.price_monthly;
          bVal = b.price_monthly;
          break;
      }
      return filters.sort_order === 'desc' ? bVal - aVal : aVal - bVal;
    });

    return result;
  }, [filters]);

  const toggleArrayFilter = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => {
      const current = (prev[key] as string[]) || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [key]: updated };
    });
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      category: [],
      asset_class: [],
      risk_level: [],
      min_roi: 0,
      max_roi: 200,
      min_win_rate: 0,
      min_capital: 0,
      max_capital: 500000,
      min_sharpe: 0,
      min_rating: 0,
      is_verified: false,
      has_auto_trading: false,
      supported_brokers: [],
      sort_by: 'roi',
      sort_order: 'desc',
    });
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.category?.length) count += filters.category.length;
    if (filters.asset_class?.length) count += filters.asset_class.length;
    if (filters.risk_level?.length) count += filters.risk_level.length;
    if (filters.min_roi && filters.min_roi > 0) count++;
    if (filters.min_win_rate && filters.min_win_rate > 0) count++;
    if (filters.min_sharpe && filters.min_sharpe > 0) count++;
    if (filters.min_rating && filters.min_rating > 0) count++;
    if (filters.is_verified) count++;
    return count;
  }, [filters]);

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Strategy Marketplace</h1>
          <p className="text-slate-400">Discover {mockStrategies.length}+ verified trading strategies</p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={filters.query}
              onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
              placeholder="Search strategies, categories, or creators..."
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors ${
              showFilters ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 bg-white/20 rounded-full text-xs flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-white">Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-slate-400 hover:text-white"
                  >
                    Clear all
                  </button>
                </div>

                {/* Category */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-slate-300 mb-3">Category</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => toggleArrayFilter('category', cat)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          filters.category?.includes(cat)
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Asset Class */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-slate-300 mb-3">Asset Class</h4>
                  <div className="flex flex-wrap gap-2">
                    {assetClasses.map((asset) => (
                      <button
                        key={asset}
                        onClick={() => toggleArrayFilter('asset_class', asset)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          filters.asset_class?.includes(asset)
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {asset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Risk Level */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-slate-300 mb-3">Risk Level</h4>
                  <div className="flex gap-2">
                    {riskLevels.map((risk) => (
                      <button
                        key={risk}
                        onClick={() => toggleArrayFilter('risk_level', risk)}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          filters.risk_level?.includes(risk)
                            ? risk === 'low' ? 'bg-emerald-500 text-white' :
                              risk === 'medium' ? 'bg-amber-500 text-white' :
                              'bg-rose-500 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {risk.charAt(0).toUpperCase() + risk.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Min ROI */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-slate-300 mb-3">
                    Min ROI: {filters.min_roi}%
                  </h4>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.min_roi}
                    onChange={(e) => setFilters(prev => ({ ...prev, min_roi: Number(e.target.value) }))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                {/* Min Win Rate */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-slate-300 mb-3">
                    Min Win Rate: {filters.min_win_rate}%
                  </h4>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.min_win_rate}
                    onChange={(e) => setFilters(prev => ({ ...prev, min_win_rate: Number(e.target.value) }))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                {/* Min Sharpe */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-slate-300 mb-3">
                    Min Sharpe Ratio: {filters.min_sharpe?.toFixed(1)}
                  </h4>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    value={filters.min_sharpe}
                    onChange={(e) => setFilters(prev => ({ ...prev, min_sharpe: Number(e.target.value) }))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                {/* Min Rating */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-slate-300 mb-3">Min Rating</h4>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setFilters(prev => ({ ...prev, min_rating: rating }))}
                        className={`flex-1 py-2 rounded-lg transition-colors ${
                          (filters.min_rating || 0) >= rating
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-700 text-slate-400'
                        }`}
                      >
                        {rating === 0 ? 'Any' : rating}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Verified Only */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.is_verified}
                    onChange={(e) => setFilters(prev => ({ ...prev, is_verified: e.target.checked }))}
                    className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-slate-300">Verified strategies only</span>
                </label>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-400">
                <span className="text-white font-medium">{filteredStrategies.length}</span> strategies found
              </p>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400">Sort by:</span>
                <select
                  value={filters.sort_by}
                  onChange={(e) => setFilters(prev => ({ ...prev, sort_by: e.target.value }))}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="roi">Highest ROI</option>
                  <option value="rating">Top Rated</option>
                  <option value="subscribers">Most Popular</option>
                  <option value="sharpe">Best Sharpe</option>
                  <option value="price">Price</option>
                </select>
              </div>
            </div>

            {/* Strategy Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredStrategies.map((strategy) => {
                const yearPerf = strategy.performance.find(p => p.period === '1Y');
                const favorite = isFavorite(strategy.id);
                const inCompare = isInCompare(strategy.id);

                return (
                  <div
                    key={strategy.id}
                    className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-colors group"
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
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                                {strategy.name}
                              </h3>
                              {strategy.is_verified && (
                                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                              )}
                            </div>
                            <p className="text-sm text-slate-400">by {strategy.creator_name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => favorite ? removeFromFavorites(strategy.id) : addToFavorites(strategy.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              favorite ? 'text-rose-400 bg-rose-500/10' : 'text-slate-400 hover:text-rose-400 hover:bg-slate-700'
                            }`}
                          >
                            <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={() => addToCompare(strategy.id)}
                            disabled={inCompare || compareList.length >= 4}
                            className={`p-2 rounded-lg transition-colors ${
                              inCompare ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-700'
                            } disabled:opacity-50`}
                          >
                            <GitCompare className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-sm text-slate-400 mb-4 line-clamp-2">{strategy.description}</p>

                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">
                          {strategy.category}
                        </span>
                        <span className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">
                          {strategy.asset_class}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          strategy.risk_level === 'low' ? 'bg-emerald-500/20 text-emerald-400' :
                          strategy.risk_level === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-rose-500/20 text-rose-400'
                        }`}>
                          {strategy.risk_level.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">ROI (1Y)</p>
                          <p className="text-lg font-bold text-emerald-400">+{yearPerf?.roi_percentage}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Win Rate</p>
                          <p className="text-lg font-bold text-white">{yearPerf?.win_rate}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Sharpe</p>
                          <p className="text-lg font-bold text-white">{yearPerf?.sharpe_ratio}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Drawdown</p>
                          <p className="text-lg font-bold text-rose-400">{yearPerf?.max_drawdown}%</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            {strategy.rating}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {strategy.total_subscribers.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xl font-bold text-white">${strategy.price_monthly}/mo</span>
                          <Link
                            to={`/strategy/${strategy.id}`}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredStrategies.length === 0 && (
              <div className="text-center py-20">
                <Filter className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No strategies found</h3>
                <p className="text-slate-400 mb-6">Try adjusting your filters to see more results</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

