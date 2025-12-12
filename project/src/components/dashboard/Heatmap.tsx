import { HeatmapData } from '../../types';

interface HeatmapProps {
  data: HeatmapData[];
}

export default function Heatmap({ data }: HeatmapProps) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getColor = (value: number) => {
    if (value > 30) return 'bg-emerald-500';
    if (value > 15) return 'bg-emerald-400';
    if (value > 5) return 'bg-emerald-300/50';
    if (value > -5) return 'bg-slate-600';
    if (value > -15) return 'bg-rose-300/50';
    if (value > -30) return 'bg-rose-400';
    return 'bg-rose-500';
  };

  const getValue = (day: number, hour: number) => {
    const cell = data.find(d => d.day === day && d.hour === hour);
    return cell?.value || 0;
  };

  const getTradesCount = (day: number, hour: number) => {
    const cell = data.find(d => d.day === day && d.hour === hour);
    return cell?.trades_count || 0;
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Performance by Day & Hour</h3>
        <p className="text-sm text-slate-400 mb-6">
          Analyze your strategy's performance patterns across different days and hours
        </p>

        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Hour Labels */}
            <div className="flex mb-2">
              <div className="w-16" />
              {hours.map((hour) => (
                <div key={hour} className="flex-1 text-center text-xs text-slate-400">
                  {hour.toString().padStart(2, '0')}
                </div>
              ))}
            </div>

            {/* Heatmap Grid */}
            {days.map((day, dayIndex) => (
              <div key={day} className="flex items-center mb-1">
                <div className="w-16 text-sm text-slate-400">{day}</div>
                <div className="flex-1 flex gap-0.5">
                  {hours.map((hour) => {
                    const value = getValue(dayIndex, hour);
                    const trades = getTradesCount(dayIndex, hour);
                    return (
                      <div
                        key={hour}
                        className={`flex-1 h-8 rounded ${getColor(value)} cursor-pointer transition-transform hover:scale-110 hover:z-10`}
                        title={`${day} ${hour}:00 - P&L: ${value.toFixed(1)}%, Trades: ${trades}`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <span className="text-xs text-slate-400">Loss</span>
              <div className="flex gap-1">
                <div className="w-6 h-4 rounded bg-rose-500" />
                <div className="w-6 h-4 rounded bg-rose-400" />
                <div className="w-6 h-4 rounded bg-rose-300/50" />
                <div className="w-6 h-4 rounded bg-slate-600" />
                <div className="w-6 h-4 rounded bg-emerald-300/50" />
                <div className="w-6 h-4 rounded bg-emerald-400" />
                <div className="w-6 h-4 rounded bg-emerald-500" />
              </div>
              <span className="text-xs text-slate-400">Profit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Best/Worst Times */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-emerald-400 mb-4">🎯 Best Trading Times</h4>
          <div className="space-y-3">
            {data
              .sort((a, b) => b.value - a.value)
              .slice(0, 5)
              .map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-lg">
                  <span className="text-slate-300">
                    {days[item.day]} {item.hour.toString().padStart(2, '0')}:00
                  </span>
                  <div className="text-right">
                    <span className="text-emerald-400 font-bold">+{item.value.toFixed(1)}%</span>
                    <span className="text-slate-400 text-sm ml-2">({item.trades_count} trades)</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-rose-400 mb-4">⚠️ Worst Trading Times</h4>
          <div className="space-y-3">
            {data
              .sort((a, b) => a.value - b.value)
              .slice(0, 5)
              .map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-rose-500/10 rounded-lg">
                  <span className="text-slate-300">
                    {days[item.day]} {item.hour.toString().padStart(2, '0')}:00
                  </span>
                  <div className="text-right">
                    <span className="text-rose-400 font-bold">{item.value.toFixed(1)}%</span>
                    <span className="text-slate-400 text-sm ml-2">({item.trades_count} trades)</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-br from-blue-500/10 to-violet-500/10 border border-blue-500/30 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">📊 Performance Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-1">Most Active Day</p>
            <p className="text-xl font-bold text-white">Tuesday</p>
            <p className="text-sm text-emerald-400">+15.3% avg return</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-1">Best Hour</p>
            <p className="text-xl font-bold text-white">10:00 AM</p>
            <p className="text-sm text-emerald-400">+8.7% avg return</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-1">Avoid Trading</p>
            <p className="text-xl font-bold text-white">Monday 15:00</p>
            <p className="text-sm text-rose-400">-12.4% avg return</p>
          </div>
        </div>
      </div>
    </div>
  );
}

