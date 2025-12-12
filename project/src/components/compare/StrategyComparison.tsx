import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  X, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  Target, 
  DollarSign,
  Activity,
  Clock,
  Users,
  Star,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useStore } from '../../store/useStore';
import { mockStrategies } from '../../data/mockData';

export default function StrategyComparison() {
  const navigate = useNavigate();
  const { compareList, removeFromCompare, clearCompare } = useStore();

  const strategies = useMemo(() => {
    return compareList.map(id => mockStrategies.find(s => s.id === id)).filter(Boolean);
  }, [compareList]);

  const radarData = useMemo(() => {
    const metrics = ['ROI', 'Win Rate', 'Sharpe', 'Stability', 'Popularity'];
    return metrics.map(metric => {
      const data: Record<string, number | string> = { metric };
      strategies.forEach((strategy, index) => {
        if (!strategy) return;
        const perf = strategy.performance.find(p => p.period === '1Y');
        switch (metric) {
          case 'ROI':
            data[`strategy${index}`] = Math.min(100, (perf?.roi_percentage || 0));
            break;
          case 'Win Rate':
            data[`strategy${index}`] = perf?.win_rate || 0;
            break;
          case 'Sharpe':
            data[`strategy${index}`] = Math.min(100, (perf?.sharpe_ratio || 0) * 25);
            break;
          case 'Stability':
            data[`strategy${index}`] = 100 + (perf?.max_drawdown || 0) * 2;
            break;
          case 'Popularity':
            data[`strategy${index}`] = Math.min(100, (strategy.total_subscribers / 25));
            break;
        }
      });
      return data;
    });
  }, [strategies]);

  const colors = ['#10b981', '#6366f1', '#f59e0b', '#ef4444'];

  const comparisonMetrics = [
    { 
      name: 'Annual ROI', 
      key: 'roi',
      getValue: (s: typeof strategies[0]) => s?.performance.find(p => p.period === '1Y')?.roi_percentage || 0,
      format: (v: number) => `+${v.toFixed(1)}%`,
      higherIsBetter: true,
    },
    { 
      name: 'Win Rate', 
      key: 'win_rate',
      getValue: (s: typeof strategies[0]) => s?.performance.find(p => p.period === '1Y')?.win_rate || 0,
      format: (v: number) => `${v.toFixed(1)}%`,
      higherIsBetter: true,
    },
    { 
      name: 'Sharpe Ratio', 
      key: 'sharpe',
      getValue: (s: typeof strategies[0]) => s?.performance.find(p => p.period === '1Y')?.sharpe_ratio || 0,
      format: (v: number) => v.toFixed(2),
      higherIsBetter: true,
    },
    { 
      name: 'Max Drawdown', 
      key: 'drawdown',
      getValue: (s: typeof strategies[0]) => s?.performance.find(p => p.period === '1Y')?.max_drawdown || 0,
      format: (v: number) => `${v.toFixed(1)}%`,
      higherIsBetter: false,
    },
    { 
      name: 'Volatility', 
      key: 'volatility',
      getValue: (s: typeof strategies[0]) => s?.performance.find(p => p.period === '1Y')?.volatility || 0,
      format: (v: number) => `${v.toFixed(1)}%`,
      higherIsBetter: false,
    },
    { 
      name: 'Total Trades', 
      key: 'trades',
      getValue: (s: typeof strategies[0]) => s?.performance.find(p => p.period === '1Y')?.total_trades || 0,
      format: (v: number) => v.toString(),
      higherIsBetter: null,
    },
    { 
      name: 'Min Capital', 
      key: 'capital',
      getValue: (s: typeof strategies[0]) => s?.min_capital || 0,
      format: (v: number) => `$${v.toLocaleString()}`,
      higherIsBetter: false,
    },
    { 
      name: 'Monthly Price', 
      key: 'price',
      getValue: (s: typeof strategies[0]) => s?.price_monthly || 0,
      format: (v: number) => `$${v}`,
      higherIsBetter: false,
    },
    { 
      name: 'Subscribers', 
      key: 'subscribers',
      getValue: (s: typeof strategies[0]) => s?.total_subscribers || 0,
      format: (v: number) => v.toLocaleString(),
      higherIsBetter: true,
    },
    { 
      name: 'Rating', 
      key: 'rating',
      getValue: (s: typeof strategies[0]) => s?.rating || 0,
      format: (v: number) => v.toFixed(1),
      higherIsBetter: true,
    },
  ];

  const getBestValue = (metric: typeof comparisonMetrics[0]) => {
    const values = strategies.map(s => metric.getValue(s));
    if (metric.higherIsBetter === true) {
      return Math.max(...values);
    } else if (metric.higherIsBetter === false) {
      return Math.min(...values);
    }
    return null;
  };

  if (strategies.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Activity className="w-10 h-10 text-slate-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">No Strategies to Compare</h2>
            <p className="text-slate-400 mb-8">
              Add strategies to your compare list to see them side by side
            </p>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors"
            >
              Browse Strategies
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Compare Strategies</h1>
            <p className="text-slate-400">Analyze strategies side by side</p>
          </div>
          <button
            onClick={clearCompare}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Strategy Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {strategies.map((strategy, index) => (
            <div
              key={strategy?.id}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 relative"
              style={{ borderTopColor: colors[index], borderTopWidth: '3px' }}
            >
              <button
                onClick={() => strategy && removeFromCompare(strategy.id)}
                className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={strategy?.creator_avatar}
                  alt={strategy?.creator_name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-white text-sm line-clamp-1">{strategy?.name}</h3>
                  <p className="text-xs text-slate-400">{strategy?.creator_name}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  strategy?.risk_level === 'low' ? 'bg-emerald-500/20 text-emerald-400' :
                  strategy?.risk_level === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-rose-500/20 text-rose-400'
                }`}>
                  {strategy?.risk_level?.toUpperCase()}
                </span>
                {strategy?.is_verified && (
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                )}
              </div>

              <Link
                to={`/strategy/${strategy?.id}`}
                className="block text-center py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                View Details
              </Link>
            </div>
          ))}

          {strategies.length < 4 && (
            <Link
              to="/marketplace"
              className="bg-slate-800/30 border-2 border-dashed border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-emerald-500/50 hover:bg-slate-800/50 transition-colors min-h-[180px]"
            >
              <Plus className="w-8 h-8 text-slate-500" />
              <span className="text-slate-400 text-sm">Add Strategy</span>
            </Link>
          )}
        </div>

        {/* Radar Chart */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Performance Overview</h3>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
              {strategies.map((strategy, index) => (
                <Radar
                  key={strategy?.id}
                  name={strategy?.name || ''}
                  dataKey={`strategy${index}`}
                  stroke={colors[index]}
                  fill={colors[index]}
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              ))}
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Comparison Table */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left text-sm font-medium text-slate-400 p-4 sticky left-0 bg-slate-800/90">
                    Metric
                  </th>
                  {strategies.map((strategy, index) => (
                    <th 
                      key={strategy?.id} 
                      className="text-center text-sm font-medium p-4 min-w-[150px]"
                      style={{ color: colors[index] }}
                    >
                      {strategy?.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonMetrics.map((metric) => {
                  const bestValue = getBestValue(metric);
                  return (
                    <tr key={metric.key} className="border-b border-slate-700/30">
                      <td className="p-4 text-slate-300 font-medium sticky left-0 bg-slate-800/90">
                        {metric.name}
                      </td>
                      {strategies.map((strategy, index) => {
                        const value = metric.getValue(strategy);
                        const isBest = bestValue !== null && value === bestValue;
                        return (
                          <td key={strategy?.id} className="p-4 text-center">
                            <span className={`text-lg font-bold ${
                              isBest ? 'text-emerald-400' : 'text-white'
                            }`}>
                              {metric.format(value)}
                            </span>
                            {isBest && (
                              <span className="ml-2 text-emerald-400">
                                <CheckCircle2 className="w-4 h-4 inline" />
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}

                {/* Features Row */}
                <tr className="border-b border-slate-700/30">
                  <td className="p-4 text-slate-300 font-medium sticky left-0 bg-slate-800/90">
                    Category
                  </td>
                  {strategies.map((strategy) => (
                    <td key={strategy?.id} className="p-4 text-center">
                      <span className="px-3 py-1 bg-slate-700 rounded-full text-sm text-white">
                        {strategy?.category}
                      </span>
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-slate-700/30">
                  <td className="p-4 text-slate-300 font-medium sticky left-0 bg-slate-800/90">
                    Asset Class
                  </td>
                  {strategies.map((strategy) => (
                    <td key={strategy?.id} className="p-4 text-center">
                      <span className="px-3 py-1 bg-slate-700 rounded-full text-sm text-white">
                        {strategy?.asset_class}
                      </span>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 text-slate-300 font-medium sticky left-0 bg-slate-800/90">
                    Timeframe
                  </td>
                  {strategies.map((strategy) => (
                    <td key={strategy?.id} className="p-4 text-center text-white">
                      {strategy?.timeframe || 'D'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendation */}
        <div className="mt-8 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-emerald-400 mb-4">🎯 AI Recommendation</h3>
          <p className="text-slate-300 mb-4">
            Based on your comparison, <strong className="text-white">{strategies[0]?.name}</strong> shows 
            the best risk-adjusted returns with a Sharpe ratio of {strategies[0]?.performance.find(p => p.period === '1Y')?.sharpe_ratio?.toFixed(2)}. 
            However, if you prioritize stability, consider <strong className="text-white">{strategies[1]?.name}</strong> with 
            lower drawdown characteristics.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to={`/strategy/${strategies[0]?.id}`}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors"
            >
              View Top Pick
            </Link>
            <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors">
              Export Comparison
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

