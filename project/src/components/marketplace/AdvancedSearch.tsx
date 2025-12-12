import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Filter,
  Grid,
  List,
  ArrowUpDown
} from 'lucide-react';
import { Strategy, SearchFilters, BrokerType } from '../../types';
import { mockStrategies } from '../../data/mockData';
import { useStore } from '../../store/useStore';

export default function AdvancedSearch() {
  const { addToFavorites, removeFromFavorites, isFavorite, addToCompare, isInCompare, compareList } = useStore();
  
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
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

  const sortOptions = [
    { value: 'roi', label: 'Highest ROI' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'subscribers', label: 'Most Popular' },
    { value: 'sharpe', label: 'Best Sharpe' },
    { value: 'price', label: 'Price: Low to High' },
  ];

  const filteredStrategies = useMemo(() => {
    let result = [...mockStrategies];

    // Text search
    if (filters.query) {
      const query = filters.query.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query) ||
        s.creator_name.toLowerCase().includes(query) ||
        s.tags?.some(t => t.toLowerCase().includes(query))
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
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Strategy Marketplace</h1>
          <p className="text-slate-400 text-sm sm:text-base">Discover {mockStrategies.length}+ verified trading strategies</p>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={filters.query}
              onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
              placeholder="Search strategies, categories, tags..."
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            {filters.query && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, query: '' }))}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors ${
              showFilters ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 bg-white/20 rounded-full text-xs flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Quick Filters - Mobile Friendly */}
        <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
          {categories.slice(0, 4).map((cat) => (
            <button
              key={cat}
              onClick={() => toggleArrayFilter('category', cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                filters.category?.includes(cat)
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
          {riskLevels.map((risk) => (
            <button
              key={risk}
              onClick={() => toggleArrayFilter('risk_level', risk)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                filters.risk_level?.includes(risk)
                  ? risk === 'low' ? 'bg-emerald-500 text-white' :
                    risk === 'medium' ? 'bg-amber-500 text-white' :
                    'bg-rose-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {risk.charAt(0).toUpperCase() + risk.slice(1)} Risk
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - Mobile Drawer / Desktop Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <>
                {/* Mobile Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden fixed inset-0 bg-black/60 z-40"
                />
                
                {/* Filter Panel */}
                <motion.div
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  className="lg:static fixed inset-y-0 left-0 z-50 w-80 bg-slate-900 lg:bg-slate-800/50 lg:backdrop-blur-sm border-r lg:border border-slate-700/50 lg:rounded-xl overflow-y-auto"
                >
                  <div className="sticky top-0 bg-slate-900 lg:bg-transparent p-4 lg:p-6 border-b border-slate-700 lg:border-none flex items-center justify-between">
                    <h3 className="font-semibold text-white">Filters</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={clearFilters}
                        className="text-sm text-slate-400 hover:text-white"
                      >
                        Clear all
                      </button>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="lg:hidden p-2 text-slate-400 hover:text-white"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 lg:p-6 lg:pt-0 space-y-6">
                    {/* Category */}
                    <div>
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
                    <div>
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
                    <div>
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
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-3">
                        Min ROI: <span className="text-emerald-400">{filters.min_roi}%</span>
                      </h4>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={filters.min_roi}
                        onChange={(e) => setFilters(prev => ({ ...prev, min_roi: Number(e.target.value) }))}
                        className="w-full accent-emerald-500"
                      />
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>0%</span>
                        <span>200%</span>
                      </div>
                    </div>

                    {/* Min Win Rate */}
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-3">
                        Min Win Rate: <span className="text-emerald-400">{filters.min_win_rate}%</span>
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
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-3">
                        Min Sharpe: <span className="text-emerald-400">{filters.min_sharpe?.toFixed(1)}</span>
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
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-3">Min Rating</h4>
                      <div className="flex gap-1">
                        {[0, 1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => setFilters(prev => ({ ...prev, min_rating: rating }))}
                            className={`flex-1 py-2 rounded-lg text-sm transition-colors ${
                              (filters.min_rating || 0) >= rating && rating > 0
                                ? 'bg-amber-500 text-white'
                                : rating === 0 && (filters.min_rating || 0) === 0
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-700 text-slate-400'
                            }`}
                          >
                            {rating === 0 ? 'Any' : <Star className="w-4 h-4 mx-auto" />}
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

                  {/* Mobile Apply Button */}
                  <div className="lg:hidden sticky bottom-0 p-4 bg-slate-900 border-t border-slate-700">
                    <button
                      onClick={() => setShowFilters(false)}
                      className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
                    >
                      Show {filteredStrategies.length} Results
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Results */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <p className="text-slate-400 text-sm sm:text-base">
                <span className="text-white font-medium">{filteredStrategies.length}</span> strategies found
              </p>
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                {/* Sort Dropdown */}
                <div className="relative flex-1 sm:flex-initial">
                  <button
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="w-full sm:w-auto flex items-center justify-between gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
                  >
                    <span>{sortOptions.find(o => o.value === filters.sort_by)?.label}</span>
                    <ArrowUpDown className="w-4 h-4 text-slate-400" />
                  </button>
                  
                  {showSortDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowSortDropdown(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden">
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setFilters(prev => ({ ...prev, sort_by: option.value }));
                              setShowSortDropdown(false);
                            }}
                            className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                              filters.sort_by === option.value
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* View Toggle */}
                <div className="flex items-center bg-slate-800 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Strategy Grid/List */}
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6' 
              : 'space-y-4'
            }>
              {filteredStrategies.map((strategy) => {
                const yearPerf = strategy.performance.find(p => p.period === '1Y');
                const favorite = isFavorite(strategy.id);
                const inCompare = isInCompare(strategy.id);

                return (
                  <motion.div
                    key={strategy.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-colors group ${
                      viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
                    }`}
                  >
                    <div className={`p-4 sm:p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <img
                            src={strategy.creator_avatar}
                            alt={strategy.creator_name}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors text-sm sm:text-base truncate">
                                {strategy.name}
                              </h3>
                              {strategy.is_verified && (
                                <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-slate-400 truncate">by {strategy.creator_name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => favorite ? removeFromFavorites(strategy.id) : addToFavorites(strategy.id)}
                            className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                              favorite ? 'text-rose-400 bg-rose-500/10' : 'text-slate-400 hover:text-rose-400 hover:bg-slate-700'
                            }`}
                          >
                            <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${favorite ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={() => addToCompare(strategy.id)}
                            disabled={inCompare || compareList.length >= 4}
                            className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                              inCompare ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-700'
                            } disabled:opacity-50`}
                          >
                            <GitCompare className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4 line-clamp-2">{strategy.description}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                        <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-300">
                          {strategy.category}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-300">
                          {strategy.asset_class}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          strategy.risk_level === 'low' ? 'bg-emerald-500/20 text-emerald-400' :
                          strategy.risk_level === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-rose-500/20 text-rose-400'
                        }`}>
                          {strategy.risk_level.toUpperCase()}
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-3 sm:mb-4">
                        <div>
                          <p className="text-[10px] sm:text-xs text-slate-500 mb-0.5 sm:mb-1">ROI (1Y)</p>
                          <p className="text-sm sm:text-lg font-bold text-emerald-400">+{yearPerf?.roi_percentage}%</p>
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-xs text-slate-500 mb-0.5 sm:mb-1">Win Rate</p>
                          <p className="text-sm sm:text-lg font-bold text-white">{yearPerf?.win_rate}%</p>
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-xs text-slate-500 mb-0.5 sm:mb-1">Sharpe</p>
                          <p className="text-sm sm:text-lg font-bold text-white">{yearPerf?.sharpe_ratio}</p>
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-xs text-slate-500 mb-0.5 sm:mb-1">Drawdown</p>
                          <p className="text-sm sm:text-lg font-bold text-rose-400">{yearPerf?.max_drawdown}%</p>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-slate-700">
                        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
                            {strategy.rating}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            {strategy.total_subscribers.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="text-lg sm:text-xl font-bold text-white">${strategy.price_monthly}<span className="text-xs sm:text-sm text-slate-400 font-normal">/mo</span></span>
                          <Link
                            to={`/strategy/${strategy.id}`}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {filteredStrategies.length === 0 && (
              <div className="text-center py-16 sm:py-20">
                <Filter className="w-12 h-12 sm:w-16 sm:h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No strategies found</h3>
                <p className="text-slate-400 mb-6 text-sm sm:text-base">Try adjusting your filters to see more results</p>
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
