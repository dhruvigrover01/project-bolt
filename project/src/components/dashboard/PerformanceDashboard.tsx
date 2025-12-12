import { useState, useMemo } from 'react';
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
  Legend,
  ComposedChart,
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  DollarSign, 
  Target, 
  Shield,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Zap
} from 'lucide-react';
import { Strategy, EquityCurvePoint, MonthlyReturn, Trade, RiskMetrics } from '../../types';
import { generateEquityCurve, generateMonthlyReturns, generateMockTrades, generateRiskMetrics, generateHeatmapData } from '../../data/mockData';
import RiskAnalysisPanel from './RiskAnalysisPanel';
import TradeBreakdown from './TradeBreakdown';
import Heatmap from './Heatmap';

interface PerformanceDashboardProps {
  strategy: Strategy;
}

export default function PerformanceDashboard({ strategy }: PerformanceDashboardProps) {
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('1Y');
  const [activeTab, setActiveTab] = useState<'overview' | 'trades' | 'risk' | 'heatmap'>('overview');

  const equityCurve = useMemo(() => generateEquityCurve(12, 100000), []);
  const monthlyReturns = useMemo(() => generateMonthlyReturns(2), []);
  const trades = useMemo(() => generateMockTrades(strategy.id, 100), [strategy.id]);
  const riskMetrics = useMemo(() => generateRiskMetrics(), []);
  const heatmapData = useMemo(() => generateHeatmapData(), []);

  const yearPerformance = strategy.performance.find(p => p.period === '1Y');

  const filteredEquityCurve = useMemo(() => {
    const days = timeframe === '1M' ? 30 : timeframe === '3M' ? 90 : timeframe === '6M' ? 180 : timeframe === '1Y' ? 365 : equityCurve.length;
    return equityCurve.slice(-days);
  }, [equityCurve, timeframe]);

  const stats = [
    {
      label: 'Total Return',
      value: `+${yearPerformance?.roi_percentage || 0}%`,
      change: '+12.3%',
      positive: true,
      icon: TrendingUp,
      color: 'emerald',
    },
    {
      label: 'Sharpe Ratio',
      value: yearPerformance?.sharpe_ratio?.toFixed(2) || '0',
      change: '+0.3',
      positive: true,
      icon: Activity,
      color: 'blue',
    },
    {
      label: 'Max Drawdown',
      value: `${yearPerformance?.max_drawdown || 0}%`,
      change: '-2.1%',
      positive: true,
      icon: Shield,
      color: 'amber',
    },
    {
      label: 'Win Rate',
      value: `${yearPerformance?.win_rate || 0}%`,
      change: '+3.2%',
      positive: true,
      icon: Target,
      color: 'violet',
    },
  ];

  const timeframes = ['1M', '3M', '6M', '1Y', 'ALL'] as const;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg bg-${stat.color}-500/20 flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                stat.positive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-700 pb-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'trades', label: 'Trade Breakdown', icon: DollarSign },
          { id: 'risk', label: 'Risk Analysis', icon: Shield },
          { id: 'heatmap', label: 'Performance Heatmap', icon: PieChartIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Timeframe Selector */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Equity Curve</h3>
            <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    timeframe === tf
                      ? 'bg-emerald-500 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Equity Curve Chart */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={filteredEquityCurve}>
                <defs>
                  <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis 
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#f1f5f9' }}
                  formatter={(value: number, name: string) => [
                    name === 'equity' ? `$${value.toLocaleString()}` : `${value.toFixed(2)}%`,
                    name === 'equity' ? 'Portfolio Value' : 'Drawdown'
                  ]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="equity"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#equityGradient)"
                  name="Portfolio Value"
                />
                <Line
                  type="monotone"
                  dataKey="benchmark"
                  stroke="#6366f1"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Benchmark"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Drawdown Chart */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Drawdown</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={filteredEquityCurve}>
                <defs>
                  <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
                />
                <YAxis 
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`${value.toFixed(2)}%`, 'Drawdown']}
                />
                <Area
                  type="monotone"
                  dataKey="drawdown"
                  stroke="#ef4444"
                  fill="url(#drawdownGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Returns Table */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Monthly Returns</h3>
            <MonthlyReturnsTable returns={monthlyReturns} />
          </div>
        </div>
      )}

      {activeTab === 'trades' && (
        <TradeBreakdown trades={trades} />
      )}

      {activeTab === 'risk' && (
        <RiskAnalysisPanel metrics={riskMetrics} />
      )}

      {activeTab === 'heatmap' && (
        <Heatmap data={heatmapData} />
      )}
    </div>
  );
}

// Monthly Returns Table Component
function MonthlyReturnsTable({ returns }: { returns: MonthlyReturn[] }) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const years = [...new Set(returns.map(r => r.year))].sort();

  const getReturnForMonth = (year: number, month: number) => {
    return returns.find(r => r.year === year && r.month === month);
  };

  const getReturnColor = (value: number) => {
    if (value > 10) return 'bg-emerald-500';
    if (value > 5) return 'bg-emerald-400';
    if (value > 0) return 'bg-emerald-300/50';
    if (value > -5) return 'bg-rose-300/50';
    if (value > -10) return 'bg-rose-400';
    return 'bg-rose-500';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left text-sm font-medium text-slate-400 pb-3">Year</th>
            {months.map(month => (
              <th key={month} className="text-center text-sm font-medium text-slate-400 pb-3 px-1">
                {month}
              </th>
            ))}
            <th className="text-center text-sm font-medium text-slate-400 pb-3">YTD</th>
          </tr>
        </thead>
        <tbody>
          {years.map(year => {
            const yearReturns = returns.filter(r => r.year === year);
            const ytd = yearReturns.reduce((acc, r) => acc + r.return_percentage, 0);
            
            return (
              <tr key={year}>
                <td className="text-sm font-medium text-white py-2">{year}</td>
                {months.map((_, monthIndex) => {
                  const monthReturn = getReturnForMonth(year, monthIndex + 1);
                  return (
                    <td key={monthIndex} className="text-center py-2 px-1">
                      {monthReturn ? (
                        <span
                          className={`inline-block w-full py-1 px-2 rounded text-xs font-medium ${getReturnColor(monthReturn.return_percentage)} ${
                            monthReturn.return_percentage > 0 ? 'text-emerald-900' : 'text-rose-900'
                          }`}
                        >
                          {monthReturn.return_percentage > 0 ? '+' : ''}{monthReturn.return_percentage.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                  );
                })}
                <td className="text-center py-2">
                  <span className={`inline-block py-1 px-3 rounded text-sm font-bold ${
                    ytd > 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {ytd > 0 ? '+' : ''}{ytd.toFixed(1)}%
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

