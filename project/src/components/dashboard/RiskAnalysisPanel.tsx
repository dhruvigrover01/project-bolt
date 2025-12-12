import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Target, 
  Activity,
  Zap,
  BarChart3,
  PieChart
} from 'lucide-react';
import { RiskMetrics } from '../../types';

interface RiskAnalysisPanelProps {
  metrics: RiskMetrics;
}

export default function RiskAnalysisPanel({ metrics }: RiskAnalysisPanelProps) {
  const riskCategories = [
    {
      title: 'Return Metrics',
      icon: TrendingUp,
      color: 'emerald',
      metrics: [
        { name: 'Sharpe Ratio', value: metrics.sharpe_ratio.toFixed(2), description: 'Risk-adjusted return measure', good: metrics.sharpe_ratio > 1.5 },
        { name: 'Sortino Ratio', value: metrics.sortino_ratio.toFixed(2), description: 'Downside risk-adjusted return', good: metrics.sortino_ratio > 2 },
        { name: 'Calmar Ratio', value: metrics.calmar_ratio.toFixed(2), description: 'Return to max drawdown ratio', good: metrics.calmar_ratio > 1 },
        { name: 'Omega Ratio', value: metrics.omega_ratio.toFixed(2), description: 'Probability-weighted ratio', good: metrics.omega_ratio > 1.5 },
      ],
    },
    {
      title: 'Risk Metrics',
      icon: Shield,
      color: 'blue',
      metrics: [
        { name: 'Max Drawdown', value: `${metrics.max_drawdown.toFixed(2)}%`, description: 'Largest peak-to-trough decline', good: metrics.max_drawdown > -15 },
        { name: 'VaR (95%)', value: `${metrics.var_95.toFixed(2)}%`, description: 'Value at Risk at 95% confidence', good: metrics.var_95 > -3 },
        { name: 'VaR (99%)', value: `${metrics.var_99.toFixed(2)}%`, description: 'Value at Risk at 99% confidence', good: metrics.var_99 > -5 },
        { name: 'CVaR (95%)', value: `${metrics.cvar_95.toFixed(2)}%`, description: 'Expected loss beyond VaR', good: metrics.cvar_95 > -4 },
      ],
    },
    {
      title: 'Position Sizing',
      icon: Target,
      color: 'amber',
      metrics: [
        { name: 'Kelly %', value: `${metrics.kelly_percentage.toFixed(1)}%`, description: 'Optimal position size', good: metrics.kelly_percentage > 10 && metrics.kelly_percentage < 30 },
        { name: 'Profit Factor', value: metrics.profit_factor.toFixed(2), description: 'Gross profit / Gross loss', good: metrics.profit_factor > 1.5 },
        { name: 'Tail Ratio', value: metrics.tail_ratio.toFixed(2), description: 'Right tail vs left tail ratio', good: metrics.tail_ratio > 1 },
        { name: 'Common Sense', value: metrics.common_sense_ratio.toFixed(2), description: 'Profit factor × Tail ratio', good: metrics.common_sense_ratio > 1.5 },
      ],
    },
    {
      title: 'Market Metrics',
      icon: Activity,
      color: 'violet',
      metrics: [
        { name: 'Beta', value: metrics.beta.toFixed(2), description: 'Market sensitivity', good: metrics.beta < 1 },
        { name: 'Alpha', value: `${metrics.alpha.toFixed(2)}%`, description: 'Excess return over benchmark', good: metrics.alpha > 5 },
        { name: 'Information Ratio', value: metrics.information_ratio.toFixed(2), description: 'Active return per unit of risk', good: metrics.information_ratio > 0.5 },
        { name: 'Treynor Ratio', value: metrics.treynor_ratio.toFixed(2), description: 'Return per unit of market risk', good: metrics.treynor_ratio > 10 },
      ],
    },
  ];

  const getRiskLevel = () => {
    let score = 0;
    if (metrics.sharpe_ratio > 2) score += 20;
    else if (metrics.sharpe_ratio > 1) score += 10;
    if (metrics.max_drawdown > -10) score += 20;
    else if (metrics.max_drawdown > -20) score += 10;
    if (metrics.profit_factor > 2) score += 20;
    else if (metrics.profit_factor > 1.5) score += 10;
    if (metrics.sortino_ratio > 2.5) score += 20;
    else if (metrics.sortino_ratio > 1.5) score += 10;
    if (metrics.kelly_percentage > 15 && metrics.kelly_percentage < 25) score += 20;
    else if (metrics.kelly_percentage > 10) score += 10;
    
    if (score >= 80) return { level: 'Low Risk', color: 'emerald', score };
    if (score >= 50) return { level: 'Medium Risk', color: 'amber', score };
    return { level: 'High Risk', color: 'rose', score };
  };

  const riskLevel = getRiskLevel();

  return (
    <div className="space-y-6">
      {/* Risk Score Card */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Risk Assessment</h3>
            <p className="text-slate-400 text-sm">Comprehensive risk analysis based on multiple metrics</p>
          </div>
          <div className={`px-4 py-2 rounded-lg bg-${riskLevel.color}-500/20 border border-${riskLevel.color}-500/30`}>
            <span className={`text-${riskLevel.color}-400 font-semibold`}>{riskLevel.level}</span>
          </div>
        </div>

        {/* Risk Score Gauge */}
        <div className="flex items-center gap-6">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="#334155"
                strokeWidth="12"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke={riskLevel.color === 'emerald' ? '#10b981' : riskLevel.color === 'amber' ? '#f59e0b' : '#ef4444'}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${(riskLevel.score / 100) * 352} 352`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">{riskLevel.score}</span>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-slate-400 text-xs mb-1">Sharpe Ratio</p>
              <p className="text-xl font-bold text-white">{metrics.sharpe_ratio.toFixed(2)}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-slate-400 text-xs mb-1">Max Drawdown</p>
              <p className="text-xl font-bold text-white">{metrics.max_drawdown.toFixed(1)}%</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-slate-400 text-xs mb-1">Profit Factor</p>
              <p className="text-xl font-bold text-white">{metrics.profit_factor.toFixed(2)}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-slate-400 text-xs mb-1">Kelly %</p>
              <p className="text-xl font-bold text-white">{metrics.kelly_percentage.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {riskCategories.map((category) => (
          <div
            key={category.title}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-lg bg-${category.color}-500/20 flex items-center justify-center`}>
                <category.icon className={`w-5 h-5 text-${category.color}-400`} />
              </div>
              <h3 className="text-lg font-semibold text-white">{category.title}</h3>
            </div>

            <div className="space-y-3">
              {category.metrics.map((metric) => (
                <div
                  key={metric.name}
                  className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{metric.name}</p>
                    <p className="text-xs text-slate-400">{metric.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${metric.good ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {metric.value}
                    </span>
                    {metric.good ? (
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Risk Warnings */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-lg font-semibold text-amber-400 mb-2">Risk Considerations</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>• Past performance does not guarantee future results</li>
              <li>• Maximum drawdown can exceed historical levels during market stress</li>
              <li>• Kelly percentage suggests optimal sizing but should be used with caution</li>
              <li>• VaR estimates may underestimate tail risks in extreme market conditions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

