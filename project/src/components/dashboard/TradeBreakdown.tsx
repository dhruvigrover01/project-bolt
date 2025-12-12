import { useState, useMemo } from 'react';
import {
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
  ScatterChart,
  Scatter,
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Filter, 
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  DollarSign
} from 'lucide-react';
import { Trade } from '../../types';
import { format } from 'date-fns';

interface TradeBreakdownProps {
  trades: Trade[];
}

export default function TradeBreakdown({ trades }: TradeBreakdownProps) {
  const [filter, setFilter] = useState<'all' | 'winners' | 'losers'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'pnl' | 'symbol'>('date');

  const filteredTrades = useMemo(() => {
    let result = [...trades];
    
    if (filter === 'winners') {
      result = result.filter(t => t.pnl > 0);
    } else if (filter === 'losers') {
      result = result.filter(t => t.pnl < 0);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'pnl':
          return b.pnl - a.pnl;
        case 'symbol':
          return a.symbol.localeCompare(b.symbol);
        default:
          return new Date(b.exit_time).getTime() - new Date(a.exit_time).getTime();
      }
    });

    return result;
  }, [trades, filter, sortBy]);

  const stats = useMemo(() => {
    const winners = trades.filter(t => t.pnl > 0);
    const losers = trades.filter(t => t.pnl < 0);
    const totalPnl = trades.reduce((acc, t) => acc + t.pnl, 0);
    const avgWin = winners.length > 0 ? winners.reduce((acc, t) => acc + t.pnl, 0) / winners.length : 0;
    const avgLoss = losers.length > 0 ? Math.abs(losers.reduce((acc, t) => acc + t.pnl, 0) / losers.length) : 0;
    
    return {
      totalTrades: trades.length,
      winners: winners.length,
      losers: losers.length,
      winRate: (winners.length / trades.length) * 100,
      totalPnl,
      avgWin,
      avgLoss,
      profitFactor: avgLoss > 0 ? avgWin / avgLoss : 0,
      largestWin: Math.max(...winners.map(t => t.pnl), 0),
      largestLoss: Math.min(...losers.map(t => t.pnl), 0),
    };
  }, [trades]);

  const pnlDistribution = useMemo(() => {
    const ranges = [
      { range: '< -5%', min: -Infinity, max: -5 },
      { range: '-5% to -2%', min: -5, max: -2 },
      { range: '-2% to 0%', min: -2, max: 0 },
      { range: '0% to 2%', min: 0, max: 2 },
      { range: '2% to 5%', min: 2, max: 5 },
      { range: '> 5%', min: 5, max: Infinity },
    ];

    return ranges.map(({ range, min, max }) => ({
      range,
      count: trades.filter(t => t.pnl_percentage > min && t.pnl_percentage <= max).length,
    }));
  }, [trades]);

  const symbolDistribution = useMemo(() => {
    const symbolMap = new Map<string, { wins: number; losses: number; pnl: number }>();
    
    trades.forEach(trade => {
      const current = symbolMap.get(trade.symbol) || { wins: 0, losses: 0, pnl: 0 };
      symbolMap.set(trade.symbol, {
        wins: current.wins + (trade.pnl > 0 ? 1 : 0),
        losses: current.losses + (trade.pnl < 0 ? 1 : 0),
        pnl: current.pnl + trade.pnl,
      });
    });

    return Array.from(symbolMap.entries()).map(([symbol, data]) => ({
      symbol,
      ...data,
      total: data.wins + data.losses,
    })).sort((a, b) => b.pnl - a.pnl);
  }, [trades]);

  const COLORS = ['#10b981', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
          <p className="text-slate-400 text-sm mb-1">Total Trades</p>
          <p className="text-2xl font-bold text-white">{stats.totalTrades}</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
          <p className="text-slate-400 text-sm mb-1">Win Rate</p>
          <p className="text-2xl font-bold text-emerald-400">{stats.winRate.toFixed(1)}%</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
          <p className="text-slate-400 text-sm mb-1">Total P&L</p>
          <p className={`text-2xl font-bold ${stats.totalPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            ${stats.totalPnl.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
          <p className="text-slate-400 text-sm mb-1">Profit Factor</p>
          <p className="text-2xl font-bold text-white">{stats.profitFactor.toFixed(2)}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Win/Loss Pie Chart */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Win/Loss Distribution</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Winners', value: stats.winners },
                    { name: 'Losers', value: stats.losers },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[0, 1].map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-sm text-slate-300">Winners ({stats.winners})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="text-sm text-slate-300">Losers ({stats.losers})</span>
            </div>
          </div>
        </div>

        {/* P&L Distribution */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">P&L Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={pnlDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="range" 
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 10 }}
              />
              <YAxis 
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                }}
              />
              <Bar 
                dataKey="count" 
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Symbol Performance */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Performance by Symbol</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-slate-400 border-b border-slate-700">
                <th className="pb-3 font-medium">Symbol</th>
                <th className="pb-3 font-medium text-center">Trades</th>
                <th className="pb-3 font-medium text-center">Wins</th>
                <th className="pb-3 font-medium text-center">Losses</th>
                <th className="pb-3 font-medium text-center">Win Rate</th>
                <th className="pb-3 font-medium text-right">P&L</th>
              </tr>
            </thead>
            <tbody>
              {symbolDistribution.slice(0, 8).map((item) => (
                <tr key={item.symbol} className="border-b border-slate-700/50">
                  <td className="py-3 font-medium text-white">{item.symbol}</td>
                  <td className="py-3 text-center text-slate-300">{item.total}</td>
                  <td className="py-3 text-center text-emerald-400">{item.wins}</td>
                  <td className="py-3 text-center text-rose-400">{item.losses}</td>
                  <td className="py-3 text-center text-slate-300">
                    {((item.wins / item.total) * 100).toFixed(1)}%
                  </td>
                  <td className={`py-3 text-right font-medium ${item.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ${item.pnl.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trade List */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Trade History</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-1">
              {(['all', 'winners', 'losers'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    filter === f
                      ? 'bg-emerald-500 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white"
            >
              <option value="date">Sort by Date</option>
              <option value="pnl">Sort by P&L</option>
              <option value="symbol">Sort by Symbol</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-slate-400 border-b border-slate-700">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Symbol</th>
                <th className="pb-3 font-medium">Side</th>
                <th className="pb-3 font-medium text-right">Entry</th>
                <th className="pb-3 font-medium text-right">Exit</th>
                <th className="pb-3 font-medium text-right">Qty</th>
                <th className="pb-3 font-medium text-right">P&L</th>
                <th className="pb-3 font-medium text-right">P&L %</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrades.slice(0, 20).map((trade) => (
                <tr key={trade.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="py-3 text-sm text-slate-300">
                    {format(new Date(trade.exit_time), 'MMM dd, yyyy')}
                  </td>
                  <td className="py-3 font-medium text-white">{trade.symbol}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                      trade.side === 'buy' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {trade.side === 'buy' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {trade.side.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 text-right text-slate-300">${trade.entry_price.toFixed(2)}</td>
                  <td className="py-3 text-right text-slate-300">${trade.exit_price.toFixed(2)}</td>
                  <td className="py-3 text-right text-slate-300">{trade.quantity}</td>
                  <td className={`py-3 text-right font-medium ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ${trade.pnl.toFixed(2)}
                  </td>
                  <td className={`py-3 text-right font-medium ${trade.pnl_percentage >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {trade.pnl_percentage > 0 ? '+' : ''}{trade.pnl_percentage.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTrades.length > 20 && (
          <div className="mt-4 text-center">
            <button className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">
              Load More Trades ({filteredTrades.length - 20} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

