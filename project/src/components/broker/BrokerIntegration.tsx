import { useState } from 'react';
import { 
  Link2, 
  Unlink, 
  Shield, 
  CheckCircle2, 
  AlertCircle,
  Settings,
  Play,
  Pause,
  DollarSign,
  Activity,
  RefreshCw,
  ExternalLink,
  Eye,
  EyeOff
} from 'lucide-react';
import { BrokerType, BrokerConnection, AutoTradingConfig } from '../../types';

interface BrokerIntegrationProps {
  strategyId: string;
}

const brokers: { id: BrokerType; name: string; logo: string; description: string; color: string }[] = [
  { 
    id: 'zerodha', 
    name: 'Zerodha', 
    logo: '🟢', 
    description: 'India\'s largest stock broker',
    color: 'emerald'
  },
  { 
    id: 'upstox', 
    name: 'Upstox', 
    logo: '🟣', 
    description: 'Discount broker with advanced tools',
    color: 'violet'
  },
  { 
    id: 'dhan', 
    name: 'Dhan', 
    logo: '🔵', 
    description: 'Modern trading platform',
    color: 'blue'
  },
  { 
    id: 'fyers', 
    name: 'Fyers', 
    logo: '🟡', 
    description: 'Feature-rich trading platform',
    color: 'amber'
  },
  { 
    id: 'binance', 
    name: 'Binance', 
    logo: '🟨', 
    description: 'World\'s largest crypto exchange',
    color: 'yellow'
  },
  { 
    id: 'bybit', 
    name: 'Bybit', 
    logo: '🟧', 
    description: 'Crypto derivatives exchange',
    color: 'orange'
  },
];

export default function BrokerIntegration({ strategyId }: BrokerIntegrationProps) {
  const [selectedBroker, setSelectedBroker] = useState<BrokerType | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedBrokers, setConnectedBrokers] = useState<BrokerConnection[]>([
    {
      id: '1',
      user_id: 'demo',
      broker: 'zerodha',
      api_key: 'xxxx-xxxx-xxxx-1234',
      api_secret_encrypted: '••••••••••••',
      is_active: true,
      is_paper_trading: false,
      connected_at: '2024-01-15',
      last_sync: new Date().toISOString(),
      account_balance: 245000,
      account_id: 'ZR1234',
      permissions: ['read', 'trade', 'portfolio'],
    }
  ]);
  const [autoTradingConfig, setAutoTradingConfig] = useState<AutoTradingConfig>({
    id: '1',
    user_id: 'demo',
    strategy_id: strategyId,
    broker_connection_id: '1',
    is_active: false,
    max_position_size: 50000,
    max_daily_trades: 10,
    max_daily_loss: 5000,
    stop_loss_percentage: 2,
    take_profit_percentage: 5,
    risk_per_trade: 2,
    created_at: new Date().toISOString(),
  });

  const [formData, setFormData] = useState({
    apiKey: '',
    apiSecret: '',
    isPaperTrading: true,
  });

  const handleConnect = async () => {
    if (!selectedBroker) return;
    
    setIsConnecting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newConnection: BrokerConnection = {
      id: Date.now().toString(),
      user_id: 'demo',
      broker: selectedBroker,
      api_key: formData.apiKey.slice(0, 4) + '-xxxx-xxxx-' + formData.apiKey.slice(-4),
      api_secret_encrypted: '••••••••••••',
      is_active: true,
      is_paper_trading: formData.isPaperTrading,
      connected_at: new Date().toISOString(),
      last_sync: new Date().toISOString(),
      account_balance: 100000,
      account_id: selectedBroker.toUpperCase().slice(0, 2) + Math.random().toString().slice(2, 6),
      permissions: ['read', 'trade', 'portfolio'],
    };
    
    setConnectedBrokers(prev => [...prev, newConnection]);
    setSelectedBroker(null);
    setFormData({ apiKey: '', apiSecret: '', isPaperTrading: true });
    setIsConnecting(false);
  };

  const handleDisconnect = (brokerId: string) => {
    setConnectedBrokers(prev => prev.filter(b => b.id !== brokerId));
  };

  const toggleAutoTrading = () => {
    setAutoTradingConfig(prev => ({ ...prev, is_active: !prev.is_active }));
  };

  return (
    <div className="space-y-6">
      {/* Connected Brokers */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Connected Brokers</h3>
        
        {connectedBrokers.length > 0 ? (
          <div className="space-y-4">
            {connectedBrokers.map((connection) => {
              const broker = brokers.find(b => b.id === connection.broker);
              return (
                <div 
                  key={connection.id}
                  className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{broker?.logo}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-white">{broker?.name}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          connection.is_active 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'bg-slate-700 text-slate-400'
                        }`}>
                          {connection.is_active ? 'Active' : 'Inactive'}
                        </span>
                        {connection.is_paper_trading && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400">
                            Paper Trading
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-400">Account: {connection.account_id}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-slate-400">Balance</p>
                      <p className="text-lg font-bold text-white">
                        ${connection.account_balance.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                        <Settings className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDisconnect(connection.id)}
                        className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                      >
                        <Unlink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Link2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No brokers connected yet</p>
            <p className="text-sm text-slate-500">Connect a broker to enable auto-trading</p>
          </div>
        )}
      </div>

      {/* Auto-Trading Configuration */}
      {connectedBrokers.length > 0 && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Auto-Trading Configuration</h3>
              <p className="text-sm text-slate-400">Configure risk parameters for automated trading</p>
            </div>
            <button
              onClick={toggleAutoTrading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                autoTradingConfig.is_active
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {autoTradingConfig.is_active ? (
                <>
                  <Pause className="w-4 h-4" />
                  Stop Trading
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start Trading
                </>
              )}
            </button>
          </div>

          {autoTradingConfig.is_active && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                <div>
                  <p className="text-emerald-400 font-medium">Auto-trading is active</p>
                  <p className="text-sm text-slate-400">Strategy signals will be executed automatically</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-slate-900/50 rounded-lg p-4">
              <label className="block text-sm text-slate-400 mb-2">Max Position Size</label>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-slate-500" />
                <input
                  type="number"
                  value={autoTradingConfig.max_position_size}
                  onChange={(e) => setAutoTradingConfig(prev => ({ ...prev, max_position_size: Number(e.target.value) }))}
                  className="flex-1 bg-transparent text-white text-lg font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4">
              <label className="block text-sm text-slate-400 mb-2">Max Daily Trades</label>
              <input
                type="number"
                value={autoTradingConfig.max_daily_trades}
                onChange={(e) => setAutoTradingConfig(prev => ({ ...prev, max_daily_trades: Number(e.target.value) }))}
                className="w-full bg-transparent text-white text-lg font-bold focus:outline-none"
              />
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4">
              <label className="block text-sm text-slate-400 mb-2">Max Daily Loss</label>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-slate-500" />
                <input
                  type="number"
                  value={autoTradingConfig.max_daily_loss}
                  onChange={(e) => setAutoTradingConfig(prev => ({ ...prev, max_daily_loss: Number(e.target.value) }))}
                  className="flex-1 bg-transparent text-white text-lg font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4">
              <label className="block text-sm text-slate-400 mb-2">Stop Loss %</label>
              <input
                type="number"
                step="0.1"
                value={autoTradingConfig.stop_loss_percentage}
                onChange={(e) => setAutoTradingConfig(prev => ({ ...prev, stop_loss_percentage: Number(e.target.value) }))}
                className="w-full bg-transparent text-white text-lg font-bold focus:outline-none"
              />
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4">
              <label className="block text-sm text-slate-400 mb-2">Take Profit %</label>
              <input
                type="number"
                step="0.1"
                value={autoTradingConfig.take_profit_percentage}
                onChange={(e) => setAutoTradingConfig(prev => ({ ...prev, take_profit_percentage: Number(e.target.value) }))}
                className="w-full bg-transparent text-white text-lg font-bold focus:outline-none"
              />
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4">
              <label className="block text-sm text-slate-400 mb-2">Risk Per Trade %</label>
              <input
                type="number"
                step="0.1"
                value={autoTradingConfig.risk_per_trade}
                onChange={(e) => setAutoTradingConfig(prev => ({ ...prev, risk_per_trade: Number(e.target.value) }))}
                className="w-full bg-transparent text-white text-lg font-bold focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Connect New Broker */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Connect New Broker</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {brokers.map((broker) => {
            const isConnected = connectedBrokers.some(c => c.broker === broker.id);
            return (
              <button
                key={broker.id}
                onClick={() => !isConnected && setSelectedBroker(broker.id)}
                disabled={isConnected}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedBroker === broker.id
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : isConnected
                    ? 'border-slate-700 bg-slate-900/50 opacity-50 cursor-not-allowed'
                    : 'border-slate-700 hover:border-slate-600 bg-slate-900/50'
                }`}
              >
                <div className="text-3xl mb-2">{broker.logo}</div>
                <p className="font-medium text-white text-sm">{broker.name}</p>
                {isConnected && (
                  <span className="text-xs text-emerald-400">Connected</span>
                )}
              </button>
            );
          })}
        </div>

        {selectedBroker && (
          <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-3xl">{brokers.find(b => b.id === selectedBroker)?.logo}</div>
              <div>
                <h4 className="font-semibold text-white">
                  Connect {brokers.find(b => b.id === selectedBroker)?.name}
                </h4>
                <p className="text-sm text-slate-400">
                  {brokers.find(b => b.id === selectedBroker)?.description}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">API Key</label>
                <input
                  type="text"
                  value={formData.apiKey}
                  onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="Enter your API key"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">API Secret</label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={formData.apiSecret}
                    onChange={(e) => setFormData(prev => ({ ...prev, apiSecret: e.target.value }))}
                    placeholder="Enter your API secret"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPaperTrading}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPaperTrading: e.target.checked }))}
                  className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-slate-300">Enable Paper Trading (Recommended for testing)</span>
              </label>

              <div className="flex items-center gap-4 pt-4">
                <button
                  onClick={handleConnect}
                  disabled={!formData.apiKey || !formData.apiSecret || isConnecting}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Link2 className="w-5 h-5" />
                      Connect Broker
                    </>
                  )}
                </button>
                <button
                  onClick={() => setSelectedBroker(null)}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-400 font-medium text-sm">Your credentials are secure</p>
                  <p className="text-slate-400 text-sm mt-1">
                    API keys are encrypted and stored securely. We never store your API secret in plain text.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

