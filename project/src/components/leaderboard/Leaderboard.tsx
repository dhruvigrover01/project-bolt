import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trophy, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Target, 
  Shield,
  Medal,
  Crown,
  Flame,
  Star,
  ChevronUp,
  ChevronDown,
  Minus
} from 'lucide-react';
import { LeaderboardCategory, LeaderboardEntry } from '../../types';
import { generateLeaderboard, mockStrategies } from '../../data/mockData';

export default function Leaderboard() {
  const [category, setCategory] = useState<LeaderboardCategory>('roi');
  const [timeframe, setTimeframe] = useState<'1W' | '1M' | '3M' | '1Y' | 'ALL'>('1M');

  const leaderboardData = useMemo(() => generateLeaderboard(category), [category]);

  const categories: { id: LeaderboardCategory; label: string; icon: typeof Trophy }[] = [
    { id: 'roi', label: 'Highest ROI', icon: TrendingUp },
    { id: 'win_rate', label: 'Win Rate', icon: Target },
    { id: 'subscribers', label: 'Most Popular', icon: Users },
    { id: 'sharpe', label: 'Best Sharpe', icon: Shield },
    { id: 'stability', label: 'Most Stable', icon: Medal },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-slate-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-slate-400">#{rank}</span>;
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable', change: number) => {
    if (trend === 'up') {
      return (
        <span className="flex items-center gap-1 text-emerald-400 text-sm">
          <ChevronUp className="w-4 h-4" />
          {change}
        </span>
      );
    }
    if (trend === 'down') {
      return (
        <span className="flex items-center gap-1 text-rose-400 text-sm">
          <ChevronDown className="w-4 h-4" />
          {Math.abs(change)}
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-slate-400 text-sm">
        <Minus className="w-4 h-4" />
        0
      </span>
    );
  };

  const formatValue = (value: number, category: LeaderboardCategory) => {
    switch (category) {
      case 'roi':
        return `+${value.toFixed(1)}%`;
      case 'win_rate':
        return `${value.toFixed(1)}%`;
      case 'subscribers':
        return value.toLocaleString();
      case 'sharpe':
        return value.toFixed(2);
      case 'stability':
        return value.toFixed(1);
      default:
        return value.toString();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-400/30 rounded-full text-sm font-medium mb-6">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400">Strategy Rankings</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Leaderboard</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Discover the top-performing strategies ranked by various metrics
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                category === cat.id
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center justify-center gap-1 mb-8 bg-slate-800/50 rounded-lg p-1 w-fit mx-auto">
          {(['1W', '1M', '3M', '1Y', 'ALL'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timeframe === tf
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {leaderboardData.slice(0, 3).map((entry, index) => {
            const positions = [1, 0, 2]; // Display order: 2nd, 1st, 3rd
            const actualIndex = positions[index];
            const item = leaderboardData[actualIndex];
            const strategy = mockStrategies.find(s => s.id === item.strategy_id);
            
            return (
              <Link
                key={item.strategy_id}
                to={`/strategy/${item.strategy_id}`}
                className={`relative bg-gradient-to-br rounded-2xl p-6 transition-transform hover:scale-105 ${
                  actualIndex === 0
                    ? 'from-yellow-500/20 to-amber-600/20 border-2 border-yellow-500/50 md:order-2 md:-mt-4'
                    : actualIndex === 1
                    ? 'from-slate-400/20 to-slate-500/20 border border-slate-400/30 md:order-1'
                    : 'from-amber-600/20 to-orange-700/20 border border-amber-600/30 md:order-3'
                }`}
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  {getRankIcon(actualIndex + 1)}
                </div>

                <div className="text-center mt-4">
                  <img
                    src={item.creator_avatar}
                    alt={item.creator_name}
                    className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-white/20"
                  />
                  <h3 className="font-bold text-white text-lg mb-1">{item.strategy_name}</h3>
                  <p className="text-slate-400 text-sm mb-4">by {item.creator_name}</p>
                  
                  <div className={`text-3xl font-bold mb-2 ${
                    actualIndex === 0 ? 'text-yellow-400' : 
                    actualIndex === 1 ? 'text-slate-300' : 'text-amber-500'
                  }`}>
                    {formatValue(item.value, category)}
                  </div>
                  
                  <div className="flex items-center justify-center gap-2">
                    {getTrendIcon(item.trend, item.change)}
                    <span className="text-slate-500 text-sm">vs last period</span>
                  </div>
                </div>

                {actualIndex === 0 && (
                  <div className="absolute -top-2 -right-2">
                    <Flame className="w-8 h-8 text-orange-500 animate-pulse" />
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Full Leaderboard Table */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left text-sm font-medium text-slate-400 p-4">Rank</th>
                  <th className="text-left text-sm font-medium text-slate-400 p-4">Strategy</th>
                  <th className="text-left text-sm font-medium text-slate-400 p-4">Creator</th>
                  <th className="text-center text-sm font-medium text-slate-400 p-4">
                    {categories.find(c => c.id === category)?.label}
                  </th>
                  <th className="text-center text-sm font-medium text-slate-400 p-4">Change</th>
                  <th className="text-center text-sm font-medium text-slate-400 p-4">Rating</th>
                  <th className="text-right text-sm font-medium text-slate-400 p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((entry) => {
                  const strategy = mockStrategies.find(s => s.id === entry.strategy_id);
                  return (
                    <tr 
                      key={entry.strategy_id}
                      className="border-b border-slate-700/30 hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center justify-center w-10 h-10">
                          {getRankIcon(entry.rank)}
                        </div>
                      </td>
                      <td className="p-4">
                        <Link 
                          to={`/strategy/${entry.strategy_id}`}
                          className="font-medium text-white hover:text-emerald-400 transition-colors"
                        >
                          {entry.strategy_name}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-400">
                            {strategy?.category}
                          </span>
                          <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-400">
                            {strategy?.asset_class}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={entry.creator_avatar}
                            alt={entry.creator_name}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="text-slate-300">{entry.creator_name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-lg font-bold text-emerald-400">
                          {formatValue(entry.value, category)}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {getTrendIcon(entry.trend, entry.change)}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-white">{strategy?.rating}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          to={`/strategy/${entry.strategy_id}`}
                          className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-500/30 transition-colors"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Gamification Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">1,247</p>
                <p className="text-sm text-slate-400">Your Points</p>
              </div>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full" />
            </div>
            <p className="text-xs text-slate-400 mt-2">253 points to next level</p>
          </div>

          <div className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Flame className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">12</p>
                <p className="text-sm text-slate-400">Day Streak</p>
              </div>
            </div>
            <p className="text-sm text-amber-400">🔥 Keep it going!</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/20 to-green-600/20 border border-emerald-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Medal className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">8 / 24</p>
                <p className="text-sm text-slate-400">Achievements</p>
              </div>
            </div>
            <p className="text-sm text-emerald-400">3 achievements close to unlock</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">#156</p>
                <p className="text-sm text-slate-400">Global Rank</p>
              </div>
            </div>
            <p className="text-sm text-blue-400">Top 5% of traders</p>
          </div>
        </div>
      </div>
    </div>
  );
}

