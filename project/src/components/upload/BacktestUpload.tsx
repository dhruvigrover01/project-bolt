import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  X,
  Download,
  RefreshCw,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { ParsedTradeCSV, Trade } from '../../types';

export default function BacktestUpload() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedTradeCSV[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<{
    totalTrades: number;
    winRate: number;
    totalPnl: number;
    avgWin: number;
    avgLoss: number;
    profitFactor: number;
    sharpeRatio: number;
    maxDrawdown: number;
  } | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadedFile(file);
    setError(null);
    setIsProcessing(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const trades = results.data.map((row: any) => ({
            symbol: row.symbol || row.Symbol || row.SYMBOL,
            side: (row.side || row.Side || row.SIDE || 'buy').toLowerCase() as 'buy' | 'sell',
            entry_price: parseFloat(row.entry_price || row.EntryPrice || row.entry || 0),
            exit_price: parseFloat(row.exit_price || row.ExitPrice || row.exit || 0),
            quantity: parseFloat(row.quantity || row.Quantity || row.qty || 1),
            entry_time: row.entry_time || row.EntryTime || row.entry_date || new Date().toISOString(),
            exit_time: row.exit_time || row.ExitTime || row.exit_date || new Date().toISOString(),
            pnl: parseFloat(row.pnl || row.PnL || row.profit || 0),
          }));

          setParsedData(trades);
          calculateMetrics(trades);
          setIsProcessing(false);
        } catch (err) {
          setError('Failed to parse CSV file. Please check the format.');
          setIsProcessing(false);
        }
      },
      error: (err) => {
        setError(`Error parsing file: ${err.message}`);
        setIsProcessing(false);
      },
    });
  }, []);

  const calculateMetrics = (trades: ParsedTradeCSV[]) => {
    if (trades.length === 0) return;

    // Calculate PnL for each trade if not provided
    const tradesWithPnl = trades.map(trade => ({
      ...trade,
      pnl: trade.pnl || (trade.exit_price - trade.entry_price) * trade.quantity * (trade.side === 'buy' ? 1 : -1),
    }));

    const winners = tradesWithPnl.filter(t => t.pnl > 0);
    const losers = tradesWithPnl.filter(t => t.pnl < 0);
    const totalPnl = tradesWithPnl.reduce((acc, t) => acc + t.pnl, 0);
    const grossProfit = winners.reduce((acc, t) => acc + t.pnl, 0);
    const grossLoss = Math.abs(losers.reduce((acc, t) => acc + t.pnl, 0));

    // Calculate drawdown
    let peak = 0;
    let maxDrawdown = 0;
    let runningPnl = 0;
    tradesWithPnl.forEach(trade => {
      runningPnl += trade.pnl;
      if (runningPnl > peak) peak = runningPnl;
      const drawdown = peak > 0 ? ((peak - runningPnl) / peak) * 100 : 0;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    });

    // Calculate Sharpe (simplified)
    const returns = tradesWithPnl.map(t => t.pnl);
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const stdDev = Math.sqrt(returns.reduce((acc, r) => acc + Math.pow(r - avgReturn, 2), 0) / returns.length);
    const sharpeRatio = stdDev > 0 ? (avgReturn / stdDev) * Math.sqrt(252) : 0;

    setMetrics({
      totalTrades: trades.length,
      winRate: (winners.length / trades.length) * 100,
      totalPnl,
      avgWin: winners.length > 0 ? grossProfit / winners.length : 0,
      avgLoss: losers.length > 0 ? grossLoss / losers.length : 0,
      profitFactor: grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0,
      sharpeRatio,
      maxDrawdown,
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
  });

  const clearUpload = () => {
    setUploadedFile(null);
    setParsedData([]);
    setMetrics(null);
    setError(null);
  };

  const downloadTemplate = () => {
    const template = 'symbol,side,entry_price,exit_price,quantity,entry_time,exit_time\nAAPL,buy,150.00,155.00,100,2024-01-15T10:30:00,2024-01-16T14:00:00\nGOOGL,sell,140.00,135.00,50,2024-01-17T09:00:00,2024-01-18T11:30:00';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backtest_template.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">Upload Backtest Results</h1>
          <p className="text-slate-400">
            Upload your trade history CSV to automatically generate performance metrics
          </p>
        </div>

        {/* Upload Zone */}
        {!uploadedFile && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
              isDragActive
                ? 'border-emerald-500 bg-emerald-500/10'
                : 'border-slate-700 hover:border-slate-600 bg-slate-800/30'
            }`}
          >
            <input {...getInputProps()} />
            <div className="w-16 h-16 rounded-2xl bg-slate-700 flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-lg font-medium text-white mb-2">
              {isDragActive ? 'Drop your file here' : 'Drag & drop your CSV file'}
            </p>
            <p className="text-slate-400 mb-4">or click to browse</p>
            <p className="text-sm text-slate-500">Supports CSV, XLS, XLSX files</p>
          </div>
        )}

        {/* Template Download */}
        {!uploadedFile && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={downloadTemplate}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              Download Template
            </button>
          </div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 text-center">
            <RefreshCw className="w-12 h-12 text-emerald-400 mx-auto mb-4 animate-spin" />
            <p className="text-white font-medium">Processing your file...</p>
            <p className="text-slate-400 text-sm">Analyzing trades and calculating metrics</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-rose-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-rose-400 font-medium">{error}</p>
              <button
                onClick={clearUpload}
                className="mt-2 text-sm text-slate-400 hover:text-white"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {uploadedFile && metrics && !isProcessing && (
          <div className="space-y-6">
            {/* File Info */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium text-white">{uploadedFile.name}</p>
                  <p className="text-sm text-slate-400">
                    {parsedData.length} trades parsed • {(uploadedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={clearUpload}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <p className="text-slate-400 text-sm mb-1">Total Trades</p>
                <p className="text-2xl font-bold text-white">{metrics.totalTrades}</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <p className="text-slate-400 text-sm mb-1">Win Rate</p>
                <p className="text-2xl font-bold text-emerald-400">{metrics.winRate.toFixed(1)}%</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <p className="text-slate-400 text-sm mb-1">Total P&L</p>
                <p className={`text-2xl font-bold ${metrics.totalPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ${metrics.totalPnl.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <p className="text-slate-400 text-sm mb-1">Profit Factor</p>
                <p className="text-2xl font-bold text-white">
                  {metrics.profitFactor === Infinity ? '∞' : metrics.profitFactor.toFixed(2)}
                </p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <p className="text-slate-400 text-sm mb-1">Avg Win</p>
                <p className="text-2xl font-bold text-emerald-400">
                  ${metrics.avgWin.toFixed(0)}
                </p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <p className="text-slate-400 text-sm mb-1">Avg Loss</p>
                <p className="text-2xl font-bold text-rose-400">
                  ${metrics.avgLoss.toFixed(0)}
                </p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <p className="text-slate-400 text-sm mb-1">Sharpe Ratio</p>
                <p className="text-2xl font-bold text-white">{metrics.sharpeRatio.toFixed(2)}</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <p className="text-slate-400 text-sm mb-1">Max Drawdown</p>
                <p className="text-2xl font-bold text-rose-400">{metrics.maxDrawdown.toFixed(1)}%</p>
              </div>
            </div>

            {/* Trade Preview */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Trade Preview</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-slate-400 border-b border-slate-700">
                      <th className="pb-3 font-medium">Symbol</th>
                      <th className="pb-3 font-medium">Side</th>
                      <th className="pb-3 font-medium text-right">Entry</th>
                      <th className="pb-3 font-medium text-right">Exit</th>
                      <th className="pb-3 font-medium text-right">Qty</th>
                      <th className="pb-3 font-medium text-right">P&L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.slice(0, 10).map((trade, i) => {
                      const pnl = trade.pnl || (trade.exit_price - trade.entry_price) * trade.quantity * (trade.side === 'buy' ? 1 : -1);
                      return (
                        <tr key={i} className="border-b border-slate-700/50">
                          <td className="py-3 font-medium text-white">{trade.symbol}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              trade.side === 'buy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                            }`}>
                              {trade.side.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 text-right text-slate-300">${trade.entry_price.toFixed(2)}</td>
                          <td className="py-3 text-right text-slate-300">${trade.exit_price.toFixed(2)}</td>
                          <td className="py-3 text-right text-slate-300">{trade.quantity}</td>
                          <td className={`py-3 text-right font-medium ${pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            ${pnl.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {parsedData.length > 10 && (
                <p className="text-center text-slate-400 text-sm mt-4">
                  Showing 10 of {parsedData.length} trades
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors">
                <BarChart3 className="w-5 h-5" />
                Generate Full Report
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors">
                <TrendingUp className="w-5 h-5" />
                Create Strategy
              </button>
            </div>
          </div>
        )}

        {/* Format Guide */}
        <div className="mt-12 bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">CSV Format Guide</h3>
          <p className="text-slate-400 mb-4">Your CSV should include the following columns:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'symbol', desc: 'Trading symbol (e.g., AAPL)' },
              { name: 'side', desc: 'buy or sell' },
              { name: 'entry_price', desc: 'Entry price' },
              { name: 'exit_price', desc: 'Exit price' },
              { name: 'quantity', desc: 'Position size' },
              { name: 'entry_time', desc: 'Entry timestamp' },
              { name: 'exit_time', desc: 'Exit timestamp' },
              { name: 'pnl', desc: 'Profit/Loss (optional)' },
            ].map((col) => (
              <div key={col.name} className="bg-slate-900/50 rounded-lg p-3">
                <code className="text-emerald-400 text-sm">{col.name}</code>
                <p className="text-xs text-slate-400 mt-1">{col.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

