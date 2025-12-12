import { useState } from 'react';
import { 
  Check, 
  X, 
  Zap, 
  Crown, 
  Building2, 
  Star,
  ArrowRight
} from 'lucide-react';
import { subscriptionPlans } from '../../data/mockData';
import { SubscriptionTier } from '../../types';

export default function SubscriptionPlans() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

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

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
            Unlock premium features and take your trading to the next level
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-slate-800 rounded-xl p-2">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                billingPeriod === 'monthly'
                  ? 'bg-emerald-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                billingPeriod === 'yearly'
                  ? 'bg-emerald-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Yearly
              <span className="ml-2 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs">
                Save up to 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subscriptionPlans.map((plan) => {
            const Icon = getIcon(plan.tier);
            const isPopular = plan.tier === 'trader_pro';
            const price = billingPeriod === 'monthly' ? plan.price_monthly : Math.round(plan.price_yearly / 12);

            return (
              <div
                key={plan.id}
                className={`relative bg-slate-800/50 backdrop-blur-sm border rounded-2xl overflow-hidden ${
                  isPopular ? 'border-emerald-500' : 'border-slate-700/50'
                }`}
              >
                {isPopular && (
                  <div className="absolute top-0 left-0 right-0 bg-emerald-500 text-white text-center py-1 text-sm font-medium">
                    Most Popular
                  </div>
                )}

                <div className={`p-6 ${isPopular ? 'pt-10' : ''}`}>
                  {/* Icon & Name */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getGradient(plan.tier)} flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white">
                        ${price}
                      </span>
                      <span className="text-slate-400">/mo</span>
                    </div>
                    {billingPeriod === 'yearly' && plan.price_monthly > 0 && (
                      <p className="text-sm text-emerald-400 mt-1">
                        Save {savings(plan)}% with yearly billing
                      </p>
                    )}
                    {billingPeriod === 'yearly' && (
                      <p className="text-sm text-slate-500">
                        ${plan.price_yearly} billed annually
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <button
                    className={`w-full py-3 rounded-lg font-semibold transition-colors mb-6 ${
                      isPopular
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    }`}
                  >
                    {plan.price_monthly === 0 ? 'Get Started Free' : 'Subscribe Now'}
                  </button>

                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Limits */}
                  <div className="mt-6 pt-6 border-t border-slate-700/50">
                    <p className="text-sm font-medium text-slate-400 mb-3">Limits</p>
                    <div className="space-y-2 text-sm">
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
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
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
                a: 'We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Absolutely. You can cancel your subscription at any time with no cancellation fees.',
              },
            ].map((faq, i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <h4 className="font-semibold text-white mb-2">{faq.q}</h4>
                <p className="text-slate-400 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise CTA */}
        <div className="mt-16 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border border-violet-500/30 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Need a Custom Solution?</h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Our Enterprise plan offers custom integrations, dedicated support, and flexible pricing for teams and institutions.
          </p>
          <button className="inline-flex items-center gap-2 px-8 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors">
            Contact Sales
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

