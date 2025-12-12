import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  X,
  CreditCard,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Shield,
  Calendar,
  DollarSign,
  Zap,
  Star
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useStore, Subscription } from '../../store/useStore';

interface Strategy {
  id: string;
  name: string;
  creator_name: string;
  creator_avatar: string;
  price_monthly: number;
  rating?: number;
  total_subscribers?: number;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  strategy: Strategy;
}

// Check if Stripe is configured
const isStripeConfigured = () => {
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  return stripeKey && stripeKey !== 'pk_test_your_key_here' && stripeKey.startsWith('pk_');
};

export default function CheckoutModal({ isOpen, onClose, strategy }: CheckoutModalProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addSubscription, isSubscribed, addNotification } = useStore();
  
  const [step, setStep] = useState<'details' | 'payment' | 'processing' | 'success' | 'error'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const stripeEnabled = isStripeConfigured();
  const alreadySubscribed = isSubscribed(strategy.id);

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  // Format expiry date
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  // Handle mock payment
  const handleMockPayment = async () => {
    setIsProcessing(true);
    setStep('processing');

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create subscription
    const subscription: Subscription = {
      id: `sub_${Date.now()}`,
      strategyId: strategy.id,
      strategyName: strategy.name,
      creatorName: strategy.creator_name,
      creatorAvatar: strategy.creator_avatar,
      priceMonthly: strategy.price_monthly,
      status: 'active',
      startDate: new Date().toISOString(),
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      paymentMethod: paymentMethod === 'card' ? 'Visa' : 'PayPal',
      lastFourDigits: cardDetails.number.slice(-4) || '4242',
    };

    addSubscription(subscription);

    // Add notification
    addNotification({
      id: `notif_${Date.now()}`,
      user_id: user?.id || 'demo',
      type: 'subscription',
      title: 'Subscription Activated!',
      message: `You are now subscribed to ${strategy.name}`,
      is_read: false,
      created_at: new Date().toISOString(),
      action_url: `/strategy/${strategy.id}`,
    });

    setIsProcessing(false);
    setStep('success');
  };

  // Handle Stripe payment (placeholder for real integration)
  const handleStripePayment = async () => {
    // In a real app, this would:
    // 1. Create a PaymentIntent on your backend
    // 2. Use Stripe Elements to collect card details
    // 3. Confirm the payment with Stripe
    // 4. Handle the result

    // For now, fallback to mock payment
    await handleMockPayment();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate card details
    if (paymentMethod === 'card') {
      if (!cardDetails.number || cardDetails.number.replace(/\s/g, '').length < 16) {
        setError('Please enter a valid card number');
        return;
      }
      if (!cardDetails.expiry || cardDetails.expiry.length < 5) {
        setError('Please enter a valid expiry date');
        return;
      }
      if (!cardDetails.cvc || cardDetails.cvc.length < 3) {
        setError('Please enter a valid CVC');
        return;
      }
      if (!cardDetails.name) {
        setError('Please enter the cardholder name');
        return;
      }
    }

    if (stripeEnabled) {
      await handleStripePayment();
    } else {
      await handleMockPayment();
    }
  };

  const handleClose = () => {
    if (step === 'success') {
      navigate('/dashboard');
    }
    setStep('details');
    setError(null);
    setCardDetails({ number: '', expiry: '', cvc: '', name: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <h2 className="text-xl font-bold text-white">
              {step === 'success' ? 'Payment Successful!' : 
               step === 'processing' ? 'Processing Payment...' :
               step === 'error' ? 'Payment Failed' : 'Subscribe to Strategy'}
            </h2>
            {step !== 'processing' && (
              <button
                onClick={handleClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Already Subscribed */}
            {alreadySubscribed && step === 'details' && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-6 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <div>
                  <p className="text-emerald-400 font-medium">Already Subscribed</p>
                  <p className="text-sm text-slate-400">You have an active subscription to this strategy</p>
                </div>
              </div>
            )}

            {/* Details Step */}
            {step === 'details' && !alreadySubscribed && (
              <>
                {/* Strategy Summary */}
                <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={strategy.creator_avatar}
                      alt={strategy.creator_name}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{strategy.name}</h3>
                      <p className="text-sm text-slate-400">by {strategy.creator_name}</p>
                      {strategy.rating && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm text-white">{strategy.rating}</span>
                          {strategy.total_subscribers && (
                            <span className="text-sm text-slate-400">
                              • {strategy.total_subscribers.toLocaleString()} subscribers
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300">Monthly Subscription</span>
                    <span className="text-2xl font-bold text-white">${strategy.price_monthly}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span>Billed monthly, cancel anytime</span>
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-3 mb-6">
                  {[
                    { icon: Zap, text: 'Instant access to all trading signals' },
                    { icon: Shield, text: 'Full performance analytics' },
                    { icon: DollarSign, text: 'Priority support from creator' },
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <benefit.icon className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span className="text-slate-300">{benefit.text}</span>
                    </div>
                  ))}
                </div>

                {/* Demo Mode Notice */}
                {!stripeEnabled && (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-amber-400 font-medium">Demo Mode</p>
                      <p className="text-slate-400">Stripe is not configured. Using mock payment for testing.</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setStep('payment')}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Continue to Payment
                </button>
              </>
            )}

            {/* Payment Step */}
            {step === 'payment' && (
              <form onSubmit={handleSubmit}>
                {/* Payment Method Selection */}
                <div className="flex gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 p-4 rounded-xl border-2 transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                    }`}
                  >
                    <CreditCard className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === 'card' ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <p className={`text-sm font-medium ${paymentMethod === 'card' ? 'text-emerald-400' : 'text-slate-300'}`}>
                      Credit Card
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`flex-1 p-4 rounded-xl border-2 transition-colors ${
                      paymentMethod === 'paypal'
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                    }`}
                  >
                    <div className={`w-6 h-6 mx-auto mb-2 font-bold ${paymentMethod === 'paypal' ? 'text-emerald-400' : 'text-slate-400'}`}>
                      PP
                    </div>
                    <p className={`text-sm font-medium ${paymentMethod === 'paypal' ? 'text-emerald-400' : 'text-slate-300'}`}>
                      PayPal
                    </p>
                  </button>
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Card Number</label>
                      <input
                        type="text"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({ ...cardDetails, number: formatCardNumber(e.target.value) })}
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Expiry Date</label>
                        <input
                          type="text"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: formatExpiry(e.target.value) })}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">CVC</label>
                        <input
                          type="text"
                          value={cardDetails.cvc}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                          placeholder="123"
                          maxLength={4}
                          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="bg-slate-800/50 rounded-xl p-6 text-center">
                    <p className="text-slate-300 mb-2">You will be redirected to PayPal</p>
                    <p className="text-sm text-slate-500">to complete your payment securely</p>
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-center gap-2 text-rose-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                {/* Order Summary */}
                <div className="mt-6 p-4 bg-slate-800/50 rounded-xl">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Strategy subscription</span>
                    <span className="text-white">${strategy.price_monthly}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-3 pb-3 border-b border-slate-700">
                    <span className="text-slate-400">Platform fee</span>
                    <span className="text-white">$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white font-medium">Total</span>
                    <span className="text-emerald-400 font-bold text-lg">${strategy.price_monthly}/mo</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setStep('details')}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Pay ${strategy.price_monthly}
                  </button>
                </div>

                <p className="text-center text-xs text-slate-500 mt-4 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" />
                  Secured by {stripeEnabled ? 'Stripe' : 'Mock Payment'}
                </p>
              </form>
            )}

            {/* Processing Step */}
            {step === 'processing' && (
              <div className="py-12 text-center">
                <Loader2 className="w-16 h-16 text-emerald-400 animate-spin mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-white mb-2">Processing your payment...</h3>
                <p className="text-slate-400">Please wait while we confirm your subscription</p>
              </div>
            )}

            {/* Success Step */}
            {step === 'success' && (
              <div className="py-8 text-center">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Subscription Activated!</h3>
                <p className="text-slate-400 mb-6">
                  You now have access to {strategy.name}
                </p>
                <div className="bg-slate-800/50 rounded-xl p-4 mb-6 text-left">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Strategy</span>
                    <span className="text-white">{strategy.name}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Amount</span>
                    <span className="text-emerald-400">${strategy.price_monthly}/mo</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Next billing</span>
                    <span className="text-white">
                      {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/strategy/${strategy.id}`)}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors"
                  >
                    View Strategy
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            )}

            {/* Error Step */}
            {step === 'error' && (
              <div className="py-8 text-center">
                <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-10 h-10 text-rose-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Payment Failed</h3>
                <p className="text-slate-400 mb-6">{error || 'Something went wrong. Please try again.'}</p>
                <button
                  onClick={() => setStep('payment')}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
