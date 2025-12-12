import { SlidersHorizontal, TrendingUp, Shield } from 'lucide-react';

interface FilterBarProps {
  selectedCategory: string;
  selectedAssetClass: string;
  selectedRisk: string;
  sortBy: string;
  onCategoryChange: (category: string) => void;
  onAssetClassChange: (assetClass: string) => void;
  onRiskChange: (risk: string) => void;
  onSortChange: (sort: string) => void;
}

export default function FilterBar({
  selectedCategory,
  selectedAssetClass,
  selectedRisk,
  sortBy,
  onCategoryChange,
  onAssetClassChange,
  onRiskChange,
  onSortChange,
}: FilterBarProps) {
  const categories = [
    'All',
    'Momentum',
    'Arbitrage',
    'Mean Reversion',
    'Options',
    'AI/ML',
    'Statistical Arbitrage',
  ];

  const assetClasses = ['All', 'Stocks', 'Crypto', 'Forex', 'Derivatives'];
  const riskLevels = ['All', 'Low', 'Medium', 'High'];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filter Strategies</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Asset Class
            </label>
            <select
              value={selectedAssetClass}
              onChange={(e) => onAssetClassChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {assetClasses.map((asset) => (
                <option key={asset} value={asset}>
                  {asset}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Shield className="w-4 h-4" />
              Risk Level
            </label>
            <select
              value={selectedRisk}
              onChange={(e) => onRiskChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {riskLevels.map((risk) => (
                <option key={risk} value={risk}>
                  {risk}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="roi">Highest ROI</option>
              <option value="rating">Top Rated</option>
              <option value="subscribers">Most Popular</option>
              <option value="sharpe">Best Sharpe Ratio</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
