import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  X, 
  Zap, 
  Crown, 
  Building2, 
  Star,
  ArrowRight,
  Loader2,
  CreditCard
} from 'lucide-react';
import { subscriptionPlans } from '../../data/mockData';
import { SubscriptionTier } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { stripeService } from '../../services/payments';

export default function SubscriptionPlans() {
  const { user, profile } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const getIcon = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'free':
        return Star;
      case 'trader_pro':
        return Zap;
      case 'creator_pro':
        return Crown;
      case 'enterprise':
        return Building2;
      default:
        return Star;
    }
  };

  const getGradient = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'free':
        return 'from-slate-600 to-slate-700';
      case 'trader_pro':
        return 'from-blue-500 to-cyan-500';
      case 'creator_pro':
        return 'from-violet-500 to-purple-600';
      case 'enterprise':
        return 'from-amber-500 to-orange-600';
      default:
        return 'from-slate-600 to-slate-700';
    }
  };

  const savings = (plan: typeof subscriptionPlans[0]) => {
    if (plan.price_monthly === 0) return 0;
    const monthlyCost = plan.price_monthly * 12;
    const yearlyCost = plan.price_yearly;
    return Math.round(((monthlyCost - yearlyCost) / monthlyCost) * 100);
  };

  const handleSubscribe = async (planId: string, price: number) => {
    if (!user) {
      window.location.href = `/login?redirect=/pricing`;
      return;
    }

    if (price === 0) {
      // Free plan - just redirect to dashboard
      window.location.href = '/dashboard';
      return;
    }

    setLoadingPlan(planId);
    try {
      const session = await stripeService.createPlanCheckout(
        planId,
        price,
        billingPeriod,
        user.id
      );
      window.location.href = session.url;
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  const currentTier = profile?.subscription_tier || 'free';

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
          >
            Choose Your Plan
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-6 sm:mb-8"
          >
            Unlock premium features and take your trading to the next level
          </motion.p>

          {/* Billing Toggle */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 sm:gap-4 bg-slate-800 rounded-xl p-1.5 sm:p-2"
          >
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                billingPeriod === 'monthly'
                  ? 'bg-emerald-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base flex items-center gap-2 ${
                billingPeriod === 'yearly'
                  ? 'bg-emerald-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Yearly
              <span className="hidden sm:inline px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs">
                Save 20%
              </span>
            </button>
          </motion.div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {subscriptionPlans.map((plan, index) => {
            const Icon = getIcon(plan.tier);
            const isPopular = plan.tier === 'trader_pro';
            const isCurrent = currentTier === plan.tier;
            const price = billingPeriod === 'monthly' ? plan.price_monthly : Math.round(plan.price_yearly / 12);

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`relative bg-slate-800/50 backdrop-blur-sm border rounded-2xl overflow-hidden ${
                  isPopular ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 
                  isCurrent ? 'border-blue-500' : 'border-slate-700/50'
                }`}
              >
                {isPopular && (
                  <div className="absolute top-0 left-0 right-0 bg-emerald-500 text-white text-center py-1 text-xs sm:text-sm font-medium">
                    Most Popular
                  </div>
                )}
                {isCurrent && !isPopular && (
                  <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-center py-1 text-xs sm:text-sm font-medium">
                    Current Plan
                  </div>
                )}

                <div className={`p-4 sm:p-6 ${isPopular || isCurrent ? 'pt-8 sm:pt-10' : ''}`}>
                  {/* Icon & Name */}
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${getGradient(plan.tier)} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{plan.name}</h3>

                  {/* Price */}
                  <div className="mb-4 sm:mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-bold text-white">
                        ${price}
                      </span>
                      <span className="text-slate-400 text-sm">/mo</span>
                    </div>
                    {billingPeriod === 'yearly' && plan.price_monthly > 0 && (
                      <p className="text-xs sm:text-sm text-emerald-400 mt-1">
                        Save {savings(plan)}% with yearly billing
                      </p>
                    )}
                    {billingPeriod === 'yearly' && plan.price_yearly > 0 && (
                      <p className="text-xs sm:text-sm text-slate-500">
                        ${plan.price_yearly} billed annually
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => handleSubscribe(plan.id, price)}
                    disabled={loadingPlan === plan.id || isCurrent}
                    className={`w-full py-2.5 sm:py-3 rounded-lg font-semibold transition-all mb-4 sm:mb-6 flex items-center justify-center gap-2 text-sm sm:text-base ${
                      isCurrent
                        ? 'bg-blue-500/20 text-blue-400 cursor-default'
                        : isPopular
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    } disabled:opacity-50`}
                  >
                    {loadingPlan === plan.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : isCurrent ? (
                      'Current Plan'
                    ) : (
                      <>
                        {plan.price_monthly === 0 ? (
                          'Get Started Free'
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4" />
                            Subscribe Now
                          </>
                        )}
                      </>
                    )}
                  </button>

                  {/* Features */}
                  <ul className="space-y-2 sm:space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 sm:gap-3">
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Limits */}
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-700/50">
                    <p className="text-xs sm:text-sm font-medium text-slate-400 mb-2 sm:mb-3">Limits</p>
                    <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Strategies</span>
                        <span className="text-white">
                          {plan.limits.strategies_access === -1 ? 'Unlimited' : plan.limits.strategies_access}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Backtests/mo</span>
                        <span className="text-white">
                          {plan.limits.backtests_per_month === -1 ? 'Unlimited' : plan.limits.backtests_per_month}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Live Trading</span>
                        <span className="text-white">
                          {plan.limits.live_trading_slots === -1 ? 'Unlimited' : plan.limits.live_trading_slots === 0 ? 'No' : plan.limits.live_trading_slots}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Payment Methods */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 mb-4">Secure payments powered by</p>
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-slate-400">
              <CreditCard className="w-5 h-5" />
              <span>Stripe</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .757-.629h6.034c2.085 0 3.684.475 4.752 1.414.956.841 1.442 2.058 1.442 3.617 0 .38-.034.768-.102 1.15-.61 3.418-2.706 5.154-6.23 5.154H9.433a.77.77 0 0 0-.758.629l-.94 5.479a.641.641 0 0 1-.633.54h-.026v.263z"/>
              </svg>
              <span>PayPal</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
              </svg>
              <span>Crypto</span>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 sm:mt-20">
          <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-6 sm:mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {[
              {
                q: 'Can I change my plan later?',
                a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.',
              },
              {
                q: 'Is there a free trial?',
                a: 'Yes! All paid plans come with a 14-day free trial. No credit card required.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, PayPal, and cryptocurrency (ETH, USDT, USDC).',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Absolutely. You can cancel your subscription at any time with no cancellation fees.',
              },
            ].map((faq, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 sm:p-6"
              >
                <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">{faq.q}</h4>
                <p className="text-slate-400 text-xs sm:text-sm">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Enterprise CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 sm:mt-16 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border border-violet-500/30 rounded-2xl p-6 sm:p-8 text-center"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Need a Custom Solution?</h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto text-sm sm:text-base">
            Our Enterprise plan offers custom integrations, dedicated support, and flexible pricing for teams and institutions.
          </p>
          <button className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors text-sm sm:text-base">
            Contact Sales
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
