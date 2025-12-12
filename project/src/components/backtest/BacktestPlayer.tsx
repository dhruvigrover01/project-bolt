import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  FastForward,
  Rewind,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target
} from 'lucide-react';
import { CandleData, Trade } from '../../types';
import { generateCandleData, generateMockTrades } from '../../data/mockData';

interface BacktestPlayerProps {
  strategyId: string;
}

export default function BacktestPlayer({ strategyId }: BacktestPlayerProps) {
  const [candles, setCandles] = useState<CandleData[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [equity, setEquity] = useState(100000);
  const [openPosition, setOpenPosition] = useState<{ side: 'long' | 'short'; entry: number; size: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const candleData = generateCandleData(300);
    const tradeData = generateMockTrades(strategyId, 30);
    setCandles(candleData);
    setTrades(tradeData);
  }, [strategyId]);

  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = rect.width;
    const height = rect.height;

    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Get visible candles
    const visibleCandles = candles.slice(Math.max(0, currentIndex - 100), currentIndex + 1);
    if (visibleCandles.length === 0) return;

    // Calculate price range
    const prices = visibleCandles.flatMap(c => [c.high, c.low]);
    const minPrice = Math.min(...prices) * 0.998;
    const maxPrice = Math.max(...prices) * 1.002;
    const priceRange = maxPrice - minPrice;

    // Draw grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = (height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();

      // Price labels
      const price = maxPrice - (priceRange / 5) * i;
      ctx.fillStyle = '#64748b';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText(`$${price.toFixed(2)}`, 5, y + 12);
    }

    // Draw candles
    const candleWidth = Math.max(2, (width - 80) / Math.min(visibleCandles.length, 100) - 2);
    const startX = 60;

    visibleCandles.forEach((candle, i) => {
      const x = startX + i * (candleWidth + 2);
      const isGreen = candle.close >= candle.open;

      const openY = height - ((candle.open - minPrice) / priceRange) * height;
      const closeY = height - ((candle.close - minPrice) / priceRange) * height;
      const highY = height - ((candle.high - minPrice) / priceRange) * height;
      const lowY = height - ((candle.low - minPrice) / priceRange) * height;

      // Wick
      ctx.strokeStyle = isGreen ? '#10b981' : '#ef4444';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + candleWidth / 2, highY);
      ctx.lineTo(x + candleWidth / 2, lowY);
      ctx.stroke();

      // Body
      ctx.fillStyle = isGreen ? '#10b981' : '#ef4444';
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.max(1, Math.abs(closeY - openY));
      ctx.fillRect(x, bodyTop, candleWidth, bodyHeight);
    });

    // Draw trade markers
    const currentTime = candles[currentIndex]?.time || 0;
    trades.forEach(trade => {
      const entryTime = new Date(trade.entry_time).getTime();
      const exitTime = new Date(trade.exit_time).getTime();
      
      if (entryTime <= currentTime) {
        const entryIndex = visibleCandles.findIndex(c => c.time >= entryTime);
        if (entryIndex >= 0) {
          const x = startX + entryIndex * (candleWidth + 2) + candleWidth / 2;
          const y = height - ((trade.entry_price - minPrice) / priceRange) * height;
          
          // Entry marker
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fillStyle = trade.side === 'buy' ? '#10b981' : '#ef4444';
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      if (exitTime <= currentTime) {
        const exitIndex = visibleCandles.findIndex(c => c.time >= exitTime);
        if (exitIndex >= 0) {
          const x = startX + exitIndex * (candleWidth + 2) + candleWidth / 2;
          const y = height - ((trade.exit_price - minPrice) / priceRange) * height;
          
          // Exit marker
          ctx.beginPath();
          ctx.rect(x - 5, y - 5, 10, 10);
          ctx.fillStyle = trade.pnl > 0 ? '#10b981' : '#ef4444';
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
    });

    // Current price line
    if (visibleCandles.length > 0) {
      const currentPrice = visibleCandles[visibleCandles.length - 1].close;
      const currentY = height - ((currentPrice - minPrice) / priceRange) * height;
      
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, currentY);
      ctx.lineTo(width, currentY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Price label
      ctx.fillStyle = '#6366f1';
      ctx.fillRect(width - 70, currentY - 10, 65, 20);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText(`$${currentPrice.toFixed(2)}`, width - 65, currentY + 4);
    }
  }, [candles, currentIndex, trades]);

  useEffect(() => {
    drawChart();
  }, [drawChart]);

  useEffect(() => {
    if (isPlaying && currentIndex < candles.length - 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= candles.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 100 / speed);

      return () => clearInterval(interval);
    }
  }, [isPlaying, speed, candles.length, currentIndex]);

  const handlePlayPause = () => {
    if (currentIndex >= candles.length - 1) {
      setCurrentIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
    setEquity(100000);
    setOpenPosition(null);
  };

  const handleSkipBack = () => {
    setCurrentIndex(prev => Math.max(0, prev - 10));
  };

  const handleSkipForward = () => {
    setCurrentIndex(prev => Math.min(candles.length - 1, prev + 10));
  };

  const currentCandle = candles[currentIndex];
  const progress = candles.length > 0 ? (currentIndex / (candles.length - 1)) * 100 : 0;

  // Calculate running P&L
  const completedTrades = trades.filter(t => {
    const exitTime = new Date(t.exit_time).getTime();
    return exitTime <= (currentCandle?.time || 0);
  });
  const runningPnl = completedTrades.reduce((acc, t) => acc + t.pnl, 0);
  const currentEquity = 100000 + runningPnl;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Live Backtest Simulation</h3>
            <p className="text-sm text-slate-400">Watch the strategy execute trades in real-time</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              isPlaying ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
            }`}>
              {isPlaying ? 'Playing' : 'Paused'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4 p-4 bg-slate-900/50 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Equity</p>
            <p className="text-lg font-bold text-white">${currentEquity.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${runningPnl >= 0 ? 'bg-emerald-500/20' : 'bg-rose-500/20'} flex items-center justify-center`}>
            {runningPnl >= 0 ? <TrendingUp className="w-5 h-5 text-emerald-400" /> : <TrendingDown className="w-5 h-5 text-rose-400" />}
          </div>
          <div>
            <p className="text-xs text-slate-400">P&L</p>
            <p className={`text-lg font-bold ${runningPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {runningPnl >= 0 ? '+' : ''}${runningPnl.toFixed(0)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Trades</p>
            <p className="text-lg font-bold text-white">{completedTrades.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Win Rate</p>
            <p className="text-lg font-bold text-white">
              {completedTrades.length > 0 
                ? ((completedTrades.filter(t => t.pnl > 0).length / completedTrades.length) * 100).toFixed(1)
                : '0'}%
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-[400px] p-4">
        <canvas
          ref={canvasRef}
          className="w-full h-full rounded-lg"
          style={{ width: '100%', height: '100%' }}
        />
        
        {/* Candle Info Overlay */}
        {currentCandle && (
          <div className="absolute top-6 left-6 bg-slate-900/90 backdrop-blur-sm rounded-lg p-3 text-sm">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <span className="text-slate-400">O:</span>
              <span className="text-white font-mono">${currentCandle.open.toFixed(2)}</span>
              <span className="text-slate-400">H:</span>
              <span className="text-emerald-400 font-mono">${currentCandle.high.toFixed(2)}</span>
              <span className="text-slate-400">L:</span>
              <span className="text-rose-400 font-mono">${currentCandle.low.toFixed(2)}</span>
              <span className="text-slate-400">C:</span>
              <span className={`font-mono ${currentCandle.close >= currentCandle.open ? 'text-emerald-400' : 'text-rose-400'}`}>
                ${currentCandle.close.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="px-4 pb-2">
        <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="absolute h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-slate-400">
          <span>Candle {currentIndex + 1} / {candles.length}</span>
          <span>{progress.toFixed(1)}%</span>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={handleReset}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={handleSkipBack}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Rewind className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          <button
            onClick={handlePlayPause}
            className="p-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full transition-colors"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </button>
          <button
            onClick={() => setCurrentIndex(prev => Math.min(candles.length - 1, prev + 1))}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <SkipForward className="w-5 h-5" />
          </button>
          <button
            onClick={handleSkipForward}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <FastForward className="w-5 h-5" />
          </button>

          {/* Speed Control */}
          <div className="ml-4 flex items-center gap-2 bg-slate-800 rounded-lg p-1">
            {[0.5, 1, 2, 4].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  speed === s
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Trade Log */}
      <div className="p-4 border-t border-slate-700/50 max-h-48 overflow-y-auto">
        <h4 className="text-sm font-medium text-slate-400 mb-2">Recent Trades</h4>
        <div className="space-y-2">
          {completedTrades.slice(-5).reverse().map((trade) => (
            <div key={trade.id} className="flex items-center justify-between p-2 bg-slate-900/50 rounded-lg text-sm">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  trade.side === 'buy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {trade.side.toUpperCase()}
                </span>
                <span className="text-white">{trade.symbol}</span>
              </div>
              <span className={`font-medium ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
              </span>
            </div>
          ))}
          {completedTrades.length === 0 && (
            <p className="text-slate-500 text-sm text-center py-4">No trades executed yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

