import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CreditCard, 
  Wallet, 
  CheckCircle2, 
  Loader2,
  Shield,
  Lock,
  ArrowRight,
  Copy,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { Strategy } from '../../types';
import { stripeService, paypalService, cryptoService, PaymentMethod } from '../../services/payments';
import { useAuth } from '../../contexts/AuthContext';

// PayPal icon
const PayPalIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .757-.629h6.034c2.085 0 3.684.475 4.752 1.414.956.841 1.442 2.058 1.442 3.617 0 .38-.034.768-.102 1.15-.61 3.418-2.706 5.154-6.23 5.154H9.433a.77.77 0 0 0-.758.629l-.94 5.479a.641.641 0 0 1-.633.54h-.026v.263z"/>
  </svg>
);

// Crypto icons
const EthIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
  </svg>
);

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  strategy: Strategy;
  billingPeriod?: 'monthly' | 'yearly';
}

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  strategy,
  billingPeriod = 'monthly'
}: CheckoutModalProps) {
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cryptoDetails, setCryptoDetails] = useState<{
    address: string;
    amount: number;
    currency: string;
    paymentId: string;
  } | null>(null);
  const [step, setStep] = useState<'select' | 'crypto' | 'processing' | 'success'>('select');
  const [cryptoCurrency, setCryptoCurrency] = useState<'ETH' | 'USDT' | 'USDC'>('USDT');

  const price = billingPeriod === 'yearly' 
    ? Math.round(strategy.price_monthly * 12 * 0.8)
    : strategy.price_monthly;

  const handleStripeCheckout = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const session = await stripeService.createStrategyCheckout(
        strategy.id,
        price,
        user.id
      );
      
      // Redirect to Stripe checkout
      window.location.href = session.url;
    } catch (err) {
      setError('Failed to create checkout session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayPalCheckout = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const { orderId } = await paypalService.createOrder(
        strategy.id,
        price,
        user.id
      );

      // In real implementation, load PayPal SDK and render buttons
      // For now, simulate redirect
      setStep('processing');
      
      setTimeout(async () => {
        await paypalService.captureOrder(orderId);
        setStep('success');
      }, 2000);
    } catch (err) {
      setError('Failed to create PayPal order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCryptoCheckout = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const details = await cryptoService.getPaymentAddress(
        strategy.id,
        price,
        user.id,
        cryptoCurrency
      );
      
      setCryptoDetails(details);
      setStep('crypto');
    } catch (err) {
      setError('Failed to generate payment address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWalletPayment = async () => {
    if (!cryptoDetails) return;
    setLoading(true);
    setError(null);

    try {
      const walletAddress = await cryptoService.connectWallet();
      if (!walletAddress) {
        throw new Error('Please connect your wallet first');
      }

      const txHash = await cryptoService.sendPayment(
        cryptoDetails.address,
        cryptoDetails.amount,
        cryptoCurrency
      );

      setStep('processing');

      // Verify payment
      await cryptoService.verifyPayment(cryptoDetails.paymentId, txHash);
      setStep('success');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div>
              <h2 className="text-xl font-bold text-white">Subscribe to Strategy</h2>
              <p className="text-sm text-slate-400">{strategy.name}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 'select' && (
              <>
                {/* Price Summary */}
                <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400">Strategy subscription</span>
                    <span className="text-white">${strategy.price_monthly}/mo</span>
                  </div>
                  {billingPeriod === 'yearly' && (
                    <div className="flex items-center justify-between mb-2 text-emerald-400">
                      <span>Annual discount (20%)</span>
                      <span>-${Math.round(strategy.price_monthly * 12 * 0.2)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-2xl font-bold text-white">
                      ${price}
                      <span className="text-sm text-slate-400 font-normal">
                        /{billingPeriod === 'yearly' ? 'year' : 'month'}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-center gap-2 p-3 mb-4 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                {/* Payment Methods */}
                <div className="space-y-3 mb-6">
                  <p className="text-sm font-medium text-slate-300">Select payment method</p>
                  
                  {/* Stripe */}
                  <button
                    onClick={() => setPaymentMethod('stripe')}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                      paymentMethod === 'stripe'
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      paymentMethod === 'stripe' ? 'bg-emerald-500/20' : 'bg-slate-800'
                    }`}>
                      <CreditCard className={`w-5 h-5 ${
                        paymentMethod === 'stripe' ? 'text-emerald-400' : 'text-slate-400'
                      }`} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-white">Credit / Debit Card</p>
                      <p className="text-sm text-slate-400">Visa, Mastercard, Amex</p>
                    </div>
                    {paymentMethod === 'stripe' && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    )}
                  </button>

                  {/* PayPal */}
                  <button
                    onClick={() => setPaymentMethod('paypal')}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                      paymentMethod === 'paypal'
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      paymentMethod === 'paypal' ? 'bg-emerald-500/20' : 'bg-slate-800'
                    }`}>
                      <PayPalIcon />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-white">PayPal</p>
                      <p className="text-sm text-slate-400">Pay with your PayPal account</p>
                    </div>
                    {paymentMethod === 'paypal' && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    )}
                  </button>

                  {/* Crypto */}
                  <button
                    onClick={() => setPaymentMethod('crypto')}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                      paymentMethod === 'crypto'
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      paymentMethod === 'crypto' ? 'bg-emerald-500/20' : 'bg-slate-800'
                    }`}>
                      <Wallet className={`w-5 h-5 ${
                        paymentMethod === 'crypto' ? 'text-emerald-400' : 'text-slate-400'
                      }`} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-white">Cryptocurrency</p>
                      <p className="text-sm text-slate-400">ETH, USDT, USDC</p>
                    </div>
                    {paymentMethod === 'crypto' && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    )}
                  </button>
                </div>

                {/* Crypto Currency Selection */}
                {paymentMethod === 'crypto' && (
                  <div className="mb-6">
                    <p className="text-sm font-medium text-slate-300 mb-3">Select cryptocurrency</p>
                    <div className="flex gap-2">
                      {(['ETH', 'USDT', 'USDC'] as const).map((currency) => (
                        <button
                          key={currency}
                          onClick={() => setCryptoCurrency(currency)}
                          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                            cryptoCurrency === currency
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {currency}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Security Note */}
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                  <Shield className="w-4 h-4" />
                  <span>Secure payment powered by industry-leading encryption</span>
                </div>

                {/* Submit Button */}
                <button
                  onClick={
                    paymentMethod === 'stripe' ? handleStripeCheckout :
                    paymentMethod === 'paypal' ? handlePayPalCheckout :
                    handleCryptoCheckout
                  }
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      {paymentMethod === 'crypto' ? 'Generate Payment Address' : `Pay $${price}`}
                    </>
                  )}
                </button>
              </>
            )}

            {step === 'crypto' && cryptoDetails && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <EthIcon />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Send {cryptoDetails.amount.toFixed(6)} {cryptoDetails.currency}
                  </h3>
                  <p className="text-sm text-slate-400">to the address below</p>
                </div>

                {/* Address */}
                <div className="bg-slate-800 rounded-xl p-4 mb-4">
                  <p className="text-xs text-slate-400 mb-2">Payment Address</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm text-white break-all">
                      {cryptoDetails.address}
                    </code>
                    <button
                      onClick={() => copyToClipboard(cryptoDetails.address)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Amount */}
                <div className="bg-slate-800 rounded-xl p-4 mb-6">
                  <p className="text-xs text-slate-400 mb-2">Exact Amount</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-lg font-mono text-white">
                      {cryptoDetails.amount.toFixed(6)} {cryptoDetails.currency}
                    </code>
                    <button
                      onClick={() => copyToClipboard(cryptoDetails.amount.toFixed(6))}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('select')}
                    className="flex-1 py-3 px-4 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleWalletPayment}
                    disabled={loading}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-cyan-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Wallet className="w-4 h-4" />
                        Pay with Wallet
                      </>
                    )}
                  </button>
                </div>
              </>
            )}

            {step === 'processing' && (
              <div className="text-center py-8">
                <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Processing Payment</h3>
                <p className="text-slate-400">Please wait while we confirm your payment...</p>
              </div>
            )}

            {step === 'success' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Payment Successful!</h3>
                <p className="text-slate-400 mb-6">
                  You now have access to {strategy.name}
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
                >
                  Start Trading
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
