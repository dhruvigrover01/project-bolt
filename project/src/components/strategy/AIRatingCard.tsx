import { 
  Brain, 
  Shield, 
  TrendingUp, 
  Target, 
  Zap,
  CheckCircle2,
  AlertCircle,
  Info
} from 'lucide-react';
import { AIRating } from '../../types';

interface AIRatingCardProps {
  rating: AIRating;
}

export default function AIRatingCard({ rating }: AIRatingCardProps) {
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'intermediate':
        return 'bg-blue-500/20 text-blue-400';
      case 'advanced':
        return 'bg-amber-500/20 text-amber-400';
      case 'expert':
        return 'bg-rose-500/20 text-rose-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-cyan-500';
    if (score >= 60) return 'from-blue-500 to-violet-500';
    if (score >= 40) return 'from-amber-500 to-orange-500';
    return 'from-rose-500 to-red-500';
  };

  return (
    <div className="bg-gradient-to-br from-violet-500/10 via-slate-800/50 to-cyan-500/10 border border-violet-500/30 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">AI Strategy Analysis</h3>
              <p className="text-sm text-slate-400">
                Confidence: {(rating.confidence * 100).toFixed(0)}%
              </p>
            </div>
          </div>
          <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getDifficultyColor(rating.difficulty_level)}`}>
            {rating.difficulty_level.charAt(0).toUpperCase() + rating.difficulty_level.slice(1)} Level
          </div>
        </div>
      </div>

      {/* Scores Grid */}
      <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-2">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="#334155"
                strokeWidth="6"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="url(#overallGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${(rating.overall_score / 100) * 226} 226`}
              />
              <defs>
                <linearGradient id="overallGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xl font-bold ${getScoreColor(rating.overall_score)}`}>
                {rating.overall_score}
              </span>
            </div>
          </div>
          <p className="text-sm font-medium text-white">Overall Score</p>
        </div>

        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-2">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="40" cy="40" r="36" fill="none" stroke="#334155" strokeWidth="6" />
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="#10b981"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${(rating.risk_score / 100) * 226} 226`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-emerald-400">{rating.risk_score}</span>
            </div>
          </div>
          <p className="text-sm font-medium text-white">Risk Score</p>
        </div>

        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-2">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="40" cy="40" r="36" fill="none" stroke="#334155" strokeWidth="6" />
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${(rating.stability_score / 100) * 226} 226`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-blue-400">{rating.stability_score}</span>
            </div>
          </div>
          <p className="text-sm font-medium text-white">Stability</p>
        </div>

        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-2">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="40" cy="40" r="36" fill="none" stroke="#334155" strokeWidth="6" />
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${(rating.profitability_index / 100) * 226} 226`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-amber-400">{rating.profitability_index}</span>
            </div>
          </div>
          <p className="text-sm font-medium text-white">Profitability</p>
        </div>
      </div>

      {/* Classification */}
      <div className="px-6 pb-4">
        <div className="flex flex-wrap gap-2">
          {rating.classification.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-slate-700/50 rounded-full text-sm text-slate-300">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Analysis */}
      <div className="p-6 border-t border-slate-700/50 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div>
          <h4 className="flex items-center gap-2 text-emerald-400 font-medium mb-3">
            <CheckCircle2 className="w-5 h-5" />
            Strengths
          </h4>
          <ul className="space-y-2">
            {rating.analysis.strengths.map((strength, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-emerald-400 mt-1">•</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div>
          <h4 className="flex items-center gap-2 text-amber-400 font-medium mb-3">
            <AlertCircle className="w-5 h-5" />
            Weaknesses
          </h4>
          <ul className="space-y-2">
            {rating.analysis.weaknesses.map((weakness, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-amber-400 mt-1">•</span>
                {weakness}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Market Fit */}
      <div className="p-6 border-t border-slate-700/50">
        <h4 className="flex items-center gap-2 text-white font-medium mb-4">
          <Target className="w-5 h-5 text-blue-400" />
          Market Conditions
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
            <p className="text-sm font-medium text-emerald-400 mb-2">Best Conditions</p>
            <div className="flex flex-wrap gap-2">
              {rating.market_fit.best_conditions.map((condition, i) => (
                <span key={i} className="px-2 py-1 bg-emerald-500/20 rounded text-xs text-emerald-300">
                  {condition}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-4">
            <p className="text-sm font-medium text-rose-400 mb-2">Worst Conditions</p>
            <div className="flex flex-wrap gap-2">
              {rating.market_fit.worst_conditions.map((condition, i) => (
                <span key={i} className="px-2 py-1 bg-rose-500/20 rounded text-xs text-rose-300">
                  {condition}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="p-6 border-t border-slate-700/50 bg-slate-900/30">
        <h4 className="flex items-center gap-2 text-white font-medium mb-3">
          <Info className="w-5 h-5 text-cyan-400" />
          AI Recommendations
        </h4>
        <ul className="space-y-2">
          {rating.analysis.recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
              <Zap className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

