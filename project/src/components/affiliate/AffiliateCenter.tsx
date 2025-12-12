import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { 
  Users, 
  DollarSign, 
  Copy, 
  CheckCircle2, 
  Share2,
  Gift,
  TrendingUp,
  ExternalLink,
  Twitter,
  Linkedin,
  Mail
} from 'lucide-react';
import { mockAffiliateStats } from '../../data/mockData';

export default function AffiliateCenter() {
  const [copied, setCopied] = useState(false);
  const stats = mockAffiliateStats;
  const referralLink = `https://algomart.com/ref/${stats.referral_code}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    { name: 'Twitter', icon: Twitter, url: `https://twitter.com/intent/tweet?text=Join%20AlgoMart%20and%20start%20algo%20trading!&url=${encodeURIComponent(referralLink)}` },
    { name: 'LinkedIn', icon: Linkedin, url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}` },
    { name: 'Email', icon: Mail, url: `mailto:?subject=Join%20AlgoMart&body=Check%20out%20AlgoMart%20for%20algorithmic%20trading%20strategies:%20${encodeURIComponent(referralLink)}` },
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-400/30 rounded-full text-sm font-medium mb-6">
            <Gift className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400">Affiliate Program</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Earn by Referring</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Share AlgoMart with your network and earn {stats.commission_rate}% commission on all referral subscriptions
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-slate-400 text-sm">Total Referrals</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.total_referrals}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-slate-400 text-sm">Active</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.active_referrals}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-amber-400" />
              <span className="text-slate-400 text-sm">Total Earned</span>
            </div>
            <p className="text-3xl font-bold text-emerald-400">${stats.total_earnings.toLocaleString()}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-violet-400" />
              <span className="text-slate-400 text-sm">Pending</span>
            </div>
            <p className="text-3xl font-bold text-white">${stats.pending_earnings}</p>
          </div>
        </div>

        {/* Referral Link */}
        <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Your Referral Link</h3>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-slate-900/50 rounded-lg px-4 py-3 font-mono text-emerald-400 truncate">
              {referralLink}
            </div>
            <button
              onClick={copyToClipboard}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                copied
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy
                </>
              )}
            </button>
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-3 mt-4">
            <span className="text-sm text-slate-400">Share via:</span>
            {shareLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                <link.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Earnings Chart */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-6">Earnings History</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.earnings_history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="date" 
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
              />
              <YAxis 
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Earnings']}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Referrals Table */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-6">Recent Referrals</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-slate-400 border-b border-slate-700">
                  <th className="pb-3 font-medium">User</th>
                  <th className="pb-3 font-medium">Joined</th>
                  <th className="pb-3 font-medium">Plan</th>
                  <th className="pb-3 font-medium text-right">Lifetime Value</th>
                  <th className="pb-3 font-medium text-right">Your Earnings</th>
                </tr>
              </thead>
              <tbody>
                {stats.referrals.map((referral) => (
                  <tr key={referral.user_id} className="border-b border-slate-700/50">
                    <td className="py-4 text-white font-medium">{referral.user_name}</td>
                    <td className="py-4 text-slate-400">
                      {new Date(referral.joined_at).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        referral.subscription_tier === 'creator_pro'
                          ? 'bg-violet-500/20 text-violet-400'
                          : referral.subscription_tier === 'trader_pro'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-slate-700 text-slate-300'
                      }`}>
                        {referral.subscription_tier.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 text-right text-slate-300">
                      ${referral.lifetime_value.toLocaleString()}
                    </td>
                    <td className="py-4 text-right text-emerald-400 font-medium">
                      ${referral.commission_earned.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">1. Share Your Link</h4>
              <p className="text-sm text-slate-400">
                Share your unique referral link with friends, followers, or your community
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-emerald-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">2. They Subscribe</h4>
              <p className="text-sm text-slate-400">
                When someone signs up using your link and subscribes to a paid plan
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-amber-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">3. Earn Commission</h4>
              <p className="text-sm text-slate-400">
                You earn {stats.commission_rate}% of their subscription for the first year
              </p>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>
            By participating in the affiliate program, you agree to our{' '}
            <a href="#" className="text-emerald-400 hover:text-emerald-300">Affiliate Terms</a>.
            Commissions are paid monthly for active subscriptions.
          </p>
        </div>
      </div>
    </div>
  );
}

