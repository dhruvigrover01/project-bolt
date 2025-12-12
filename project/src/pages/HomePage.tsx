import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Shield, 
  Zap, 
  ChevronRight, 
  Search, 
  BarChart3, 
  Link2, 
  Rocket,
  Star,
  Users,
  Award,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  Play
} from 'lucide-react';
import { mockStrategies } from '../data/mockData';
import { useStore } from '../store/useStore';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToFavorites, isFavorite } = useStore();

  const filteredStrategies = useMemo(() => {
    if (selectedCategory === 'All') return mockStrategies.slice(0, 6);
    return mockStrategies.filter(s => s.category === selectedCategory).slice(0, 6);
  }, [selectedCategory]);

  const categories = ['All', 'Momentum', 'Arbitrage', 'Mean Reversion', 'AI/ML'];

  const stats = [
    { icon: TrendingUp, value: '$2.4B+', label: 'Trading Volume', color: 'emerald' },
    { icon: Users, value: '15,000+', label: 'Active Traders', color: 'blue' },
    { icon: Award, value: '500+', label: 'Verified Strategies', color: 'amber' },
    { icon: DollarSign, value: '67%', label: 'Avg. Annual ROI', color: 'violet' },
  ];

  const features = [
    {
      icon: TrendingUp,
      title: 'Verified Performance',
      description: 'All strategies come with independently verified historical performance data and real-time metrics.',
      color: 'from-emerald-500 to-cyan-500',
    },
    {
      icon: Zap,
      title: 'Auto-Trading',
      description: 'Connect your broker API and let strategies execute trades automatically with full control.',
      color: 'from-blue-500 to-violet-500',
    },
    {
      icon: Shield,
      title: 'Risk Management',
      description: 'Comprehensive risk metrics including drawdown, Sharpe ratio, and VaR for informed decisions.',
      color: 'from-amber-500 to-orange-500',
    },
  ];

  const steps = [
    { icon: Search, title: 'Browse Strategies', description: 'Explore hundreds of verified algorithmic trading strategies with transparent performance metrics.' },
    { icon: BarChart3, title: 'Compare Performance', description: 'Analyze ROI, Sharpe ratios, win rates, and risk metrics to find strategies that match your goals.' },
    { icon: Link2, title: 'Connect Broker API', description: 'Securely link your brokerage account via API for seamless automated trade execution.' },
    { icon: Rocket, title: 'Start Auto-Trading', description: 'Activate your chosen strategy and let it trade automatically based on proven algorithms.' },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900/20 to-slate-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzEwYjk4MSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')] opacity-30" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-400/30 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">AI-Powered Strategy Analysis</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Algorithmic Trading
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Strategy Marketplace
              </span>
            </h1>

            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              Discover, compare, and rent high-performing algorithmic trading strategies from verified quant developers. Auto-trade with proven strategies and transparent performance metrics.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/marketplace"
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 flex items-center gap-2 group"
              >
                Browse Strategies
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/creator-dashboard"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl transition-all duration-200 border border-white/10 hover:border-white/20 flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Become a Creator
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      </div>

      {/* Stats Section */}
      <div className="bg-slate-900/50 py-16 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className={`w-16 h-16 bg-${stat.color}-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-8 h-8 text-${stat.color}-400`} />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Strategies */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Featured Strategies</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Browse our collection of high-performing algorithmic trading strategies
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Strategy Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStrategies.map((strategy) => {
              const yearPerf = strategy.performance.find(p => p.period === '1Y');
              return (
                <Link
                  key={strategy.id}
                  to={`/strategy/${strategy.id}`}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 group"
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
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        strategy.risk_level === 'low' ? 'bg-emerald-500/20 text-emerald-400' :
                        strategy.risk_level === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-rose-500/20 text-rose-400'
                      }`}>
                        {strategy.risk_level.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">{strategy.description}</p>

                    <div className="grid grid-cols-3 gap-4 mb-4">
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
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                      <div className="flex items-center gap-3 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          {strategy.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {strategy.total_subscribers.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-white">${strategy.price_monthly}/mo</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors"
            >
              View All Strategies
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-slate-900/50 py-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Get started with algorithmic trading in four simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="relative group">
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-emerald-500/50 hover:bg-slate-800/70 transition-all duration-300 h-full">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {index + 1}
                  </div>

                  <div className="w-14 h-14 bg-slate-700/50 rounded-xl flex items-center justify-center mb-4 mt-4 group-hover:scale-110 transition-transform">
                    <step.icon className="w-7 h-7 text-emerald-400" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{step.description}</p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-slate-600 to-transparent z-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20 border border-emerald-500/30 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzEwYjk4MSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')] opacity-20" />
            
            <h2 className="text-3xl font-bold text-white mb-4 relative z-10">
              Ready to Start Algo Trading?
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto relative z-10">
              Join thousands of traders using AlgoMart to automate their trading with proven strategies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link
                to="/marketplace"
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-emerald-500/25"
              >
                Get Started Free
              </Link>
              <Link
                to="/pricing"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors border border-white/20"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

