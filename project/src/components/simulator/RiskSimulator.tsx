import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  DollarSign,
  Target,
  Shield,
  Zap,
  RefreshCw
} from 'lucide-react';
import { generateSimulationResults } from '../../data/mockData';

export default function RiskSimulator() {
  const [capital, setCapital] = useState(100000);
  const [selectedScenario, setSelectedScenario] = useState(0);
  
  const simulations = useMemo(() => generateSimulationResults(capital), [capital]);
  const currentSimulation = simulations[selectedScenario];

  const scenarios = [
    { name: 'Bull Market', icon: '📈', color: 'emerald' },
    { name: 'Bear Market', icon: '📉', color: 'rose' },
    { name: 'Sideways', icon: '➡️', color: 'blue' },
    { name: 'High Volatility', icon: '🌊', color: 'amber' },
    { name: 'Market Crash', icon: '💥', color: 'red' },
  ];

  const chartData = useMemo(() => {
    if (!currentSimulation) return [];
    
    return currentSimulation.monte_carlo_paths[0].map((_, i) => {
      const dataPoint: Record<string, number> = { index: i };
      currentSimulation.monte_carlo_paths.slice(0, 10).forEach((path, pathIndex) => {
        dataPoint[`path${pathIndex}`] = path[i];
      });
      return dataPoint;
    });
  }, [currentSimulation]);

  const pathColors = [
    '#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#14b8a6'
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/20 border border-violet-400/30 rounded-full text-sm font-medium mb-6">
            <Calculator className="w-4 h-4 text-violet-400" />
            <span className="text-violet-400">Monte Carlo Simulation</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Risk Simulator</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Predict potential returns and worst-case scenarios across different market conditions
          </p>
        </div>

        {/* Capital Input */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Initial Capital
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="number"
                  value={capital}
                  onChange={(e) => setCapital(Number(e.target.value))}
                  className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-lg font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {[50000, 100000, 250000, 500000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setCapital(amount)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    capital === amount
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  ${(amount / 1000).toFixed(0)}k
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scenario Selection */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {scenarios.map((scenario, i) => (
            <button
              key={scenario.name}
              onClick={() => setSelectedScenario(i)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedScenario === i
                  ? `border-${scenario.color}-500 bg-${scenario.color}-500/10`
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
              }`}
            >
              <div className="text-3xl mb-2">{scenario.icon}</div>
              <p className="font-medium text-white text-sm">{scenario.name}</p>
            </button>
          ))}
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-slate-400">Expected Return</span>
            </div>
            <p className={`text-2xl font-bold ${
              currentSimulation.expected_return >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {currentSimulation.expected_return >= 0 ? '+' : ''}{currentSimulation.expected_return.toFixed(1)}%
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-rose-400" />
              <span className="text-sm text-slate-400">Max Drawdown</span>
            </div>
            <p className="text-2xl font-bold text-rose-400">
              {currentSimulation.max_drawdown.toFixed(1)}%
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-amber-400" />
              <span className="text-sm text-slate-400">VaR (95%)</span>
            </div>
            <p className="text-2xl font-bold text-white">
              ${Math.abs(currentSimulation.var_95 - capital).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-violet-400" />
              <span className="text-sm text-slate-400">Loss Probability</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {currentSimulation.probability_of_loss.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Monte Carlo Chart */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Monte Carlo Simulation</h3>
              <p className="text-sm text-slate-400">100 simulated paths based on historical volatility</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </button>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="index" 
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                label={{ value: 'Trading Days', position: 'bottom', fill: '#94a3b8' }}
              />
              <YAxis 
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                domain={['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, 'Portfolio Value']}
              />
              {Array.from({ length: 10 }).map((_, i) => (
                <Line
                  key={i}
                  type="monotone"
                  dataKey={`path${i}`}
                  stroke={pathColors[i]}
                  strokeWidth={1.5}
                  dot={false}
                  opacity={0.7}
                />
              ))}
              {/* Initial Capital Line */}
              <Line
                type="monotone"
                dataKey={() => capital}
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Initial Capital"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Outcome Scenarios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-emerald-400">Best Case (95th %ile)</p>
                <p className="text-2xl font-bold text-white">
                  ${(capital * (1 + currentSimulation.best_month / 100)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-300">
              In the best 5% of scenarios, your portfolio could grow to this value.
            </p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-blue-400">Expected Outcome</p>
                <p className="text-2xl font-bold text-white">
                  ${currentSimulation.final_capital.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-300">
              The average expected portfolio value based on the simulation.
            </p>
          </div>

          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <p className="text-sm text-rose-400">Worst Case (5th %ile)</p>
                <p className="text-2xl font-bold text-white">
                  ${currentSimulation.var_95.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-300">
              In the worst 5% of scenarios, your portfolio could decline to this value.
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-400 mb-2">Important Disclaimer</h4>
              <p className="text-sm text-slate-300">
                This simulation is based on historical data and statistical models. Actual results may vary significantly. 
                Past performance does not guarantee future results. Always conduct your own research and consider consulting 
                a financial advisor before making investment decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

