import { 
  GitBranch, 
  Plus, 
  Minus, 
  RefreshCw, 
  AlertCircle,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { StrategyVersion } from '../../types';

interface VersionHistoryProps {
  versions: StrategyVersion[];
}

export default function VersionHistory({ versions }: VersionHistoryProps) {
  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'added':
        return <Plus className="w-4 h-4 text-emerald-400" />;
      case 'changed':
        return <RefreshCw className="w-4 h-4 text-blue-400" />;
      case 'fixed':
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
      case 'removed':
        return <Minus className="w-4 h-4 text-rose-400" />;
      default:
        return <RefreshCw className="w-4 h-4 text-slate-400" />;
    }
  };

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'added':
        return 'bg-emerald-500/10 border-emerald-500/30';
      case 'changed':
        return 'bg-blue-500/10 border-blue-500/30';
      case 'fixed':
        return 'bg-amber-500/10 border-amber-500/30';
      case 'removed':
        return 'bg-rose-500/10 border-rose-500/30';
      default:
        return 'bg-slate-500/10 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Version History</h3>
          <p className="text-sm text-slate-400">Track changes and performance improvements</p>
        </div>
        <div className="flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-emerald-400" />
          <span className="text-white font-medium">{versions.length} versions</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-700" />

        {/* Versions */}
        <div className="space-y-6">
          {versions.map((version, index) => (
            <div key={version.id} className="relative pl-16">
              {/* Timeline dot */}
              <div className={`absolute left-4 w-5 h-5 rounded-full border-2 ${
                version.is_current 
                  ? 'bg-emerald-500 border-emerald-400' 
                  : 'bg-slate-800 border-slate-600'
              }`}>
                {version.is_current && (
                  <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-50" />
                )}
              </div>

              {/* Version Card */}
              <div className={`bg-slate-800/50 backdrop-blur-sm border rounded-xl overflow-hidden ${
                version.is_current ? 'border-emerald-500/50' : 'border-slate-700/50'
              }`}>
                {/* Header */}
                <div className="p-4 border-b border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold text-white">v{version.version}</span>
                      {version.is_current && (
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs font-medium">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Clock className="w-4 h-4" />
                      {new Date(version.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                  <p className="text-slate-300 mt-2">{version.changelog}</p>
                </div>

                {/* Changes */}
                <div className="p-4">
                  <h4 className="text-sm font-medium text-slate-400 mb-3">Changes</h4>
                  <div className="space-y-2">
                    {version.changes.map((change, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-3 p-3 rounded-lg border ${getChangeColor(change.type)}`}
                      >
                        {getChangeIcon(change.type)}
                        <div>
                          <span className="text-xs font-medium text-slate-400 uppercase">
                            {change.type}
                          </span>
                          <p className="text-sm text-slate-300">{change.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance Diff */}
                {version.performance_diff && version.performance_diff.length > 0 && (
                  <div className="p-4 bg-slate-900/30 border-t border-slate-700/50">
                    <h4 className="text-sm font-medium text-slate-400 mb-3">Performance Impact</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {version.performance_diff.map((diff, i) => (
                        <div key={i} className="bg-slate-800/50 rounded-lg p-3">
                          <p className="text-xs text-slate-400 mb-1">{diff.metric}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-white">
                              {diff.new_value.toFixed(1)}
                            </span>
                            <span className={`flex items-center gap-0.5 text-xs font-medium ${
                              diff.change_percentage > 0 ? 'text-emerald-400' : 'text-rose-400'
                            }`}>
                              {diff.change_percentage > 0 ? (
                                <TrendingUp className="w-3 h-3" />
                              ) : (
                                <TrendingDown className="w-3 h-3" />
                              )}
                              {diff.change_percentage > 0 ? '+' : ''}{diff.change_percentage.toFixed(1)}%
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            from {diff.old_value.toFixed(1)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rollback Notice */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <GitBranch className="w-6 h-6 text-blue-400 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-400 mb-2">Version Control</h4>
            <p className="text-sm text-slate-300">
              Strategy creators can roll back to previous versions if needed. 
              All subscribers will be notified of version changes automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

