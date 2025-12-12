import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Loader2, PartyPopper, Zap } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Simulate verification (in real app, verify with backend)
    const verifyPayment = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLoading(false);
    };

    verifyPayment();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Processing your payment...</h2>
          <p className="text-slate-400">Please wait while we confirm your subscription.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Payment Failed</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
          >
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <PartyPopper className="w-6 h-6 text-amber-400" />
            <span className="text-amber-400 font-semibold">Welcome to Pro!</span>
            <PartyPopper className="w-6 h-6 text-amber-400" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Payment Successful!
          </h1>
          <p className="text-lg text-slate-400 mb-8">
            Your subscription is now active. You have full access to all premium features.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-white mb-4">What's Next?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: '🎯', title: 'Browse Strategies', desc: 'Explore premium strategies' },
              { icon: '📊', title: 'Connect Broker', desc: 'Start live trading' },
              { icon: '🔔', title: 'Set Alerts', desc: 'Never miss a trade' },
            ].map((item, i) => (
              <div key={i} className="text-center p-4 bg-slate-900/50 rounded-xl">
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <p className="font-medium text-white text-sm">{item.title}</p>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/marketplace"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
          >
            <Zap className="w-5 h-5" />
            Explore Strategies
          </Link>
          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-sm text-slate-500"
        >
          A confirmation email has been sent to your registered email address.
        </motion.p>
      </div>
    </div>
  );
}
