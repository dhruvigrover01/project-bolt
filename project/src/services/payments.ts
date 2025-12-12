import { supabase } from '../lib/supabase';

// ==================== TYPES ====================

export type PaymentMethod = 'stripe' | 'paypal' | 'crypto';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method: PaymentMethod;
  metadata: {
    strategy_id?: string;
    subscription_tier?: string;
    user_id: string;
  };
  client_secret?: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  strategy_id?: string;
  plan_id?: string;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  payment_method: PaymentMethod;
  amount: number;
  currency: string;
}

export interface CheckoutSession {
  id: string;
  url: string;
  expires_at: string;
}

// ==================== MOCK MODE ====================

const USE_MOCK = !import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// ==================== STRIPE INTEGRATION ====================

export const stripeService = {
  /**
   * Create a checkout session for strategy subscription
   */
  async createStrategyCheckout(
    strategyId: string,
    priceMonthly: number,
    userId: string
  ): Promise<CheckoutSession> {
    if (USE_MOCK) {
      // Mock checkout session
      return {
        id: `cs_mock_${Date.now()}`,
        url: `/checkout/success?session_id=mock_${strategyId}`,
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      };
    }

    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        strategy_id: strategyId,
        price: priceMonthly * 100, // Convert to cents
        user_id: userId,
        success_url: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/strategy/${strategyId}?cancelled=true`,
      },
    });

    if (error) throw error;
    return data;
  },

  /**
   * Create a checkout session for platform subscription
   */
  async createPlanCheckout(
    planId: string,
    priceMonthly: number,
    billingPeriod: 'monthly' | 'yearly',
    userId: string
  ): Promise<CheckoutSession> {
    if (USE_MOCK) {
      return {
        id: `cs_mock_${Date.now()}`,
        url: `/checkout/success?session_id=mock_${planId}`,
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      };
    }

    const price = billingPeriod === 'yearly' 
      ? Math.round(priceMonthly * 12 * 0.8) // 20% discount
      : priceMonthly;

    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        plan_id: planId,
        price: price * 100,
        billing_period: billingPeriod,
        user_id: userId,
        success_url: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/pricing?cancelled=true`,
      },
    });

    if (error) throw error;
    return data;
  },

  /**
   * Get subscription status
   */
  async getSubscription(userId: string): Promise<Subscription | null> {
    if (USE_MOCK) {
      return null;
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error) return null;
    return data;
  },

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<void> {
    if (USE_MOCK) return;

    const { error } = await supabase.functions.invoke('cancel-subscription', {
      body: { subscription_id: subscriptionId },
    });

    if (error) throw error;
  },

  /**
   * Update payment method
   */
  async updatePaymentMethod(userId: string): Promise<CheckoutSession> {
    if (USE_MOCK) {
      return {
        id: `cs_mock_${Date.now()}`,
        url: '/settings?updated=true',
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      };
    }

    const { data, error } = await supabase.functions.invoke('create-portal-session', {
      body: {
        user_id: userId,
        return_url: `${window.location.origin}/settings`,
      },
    });

    if (error) throw error;
    return data;
  },
};

// ==================== PAYPAL INTEGRATION ====================

export const paypalService = {
  /**
   * Create PayPal order for strategy purchase
   */
  async createOrder(
    strategyId: string,
    amount: number,
    userId: string
  ): Promise<{ orderId: string }> {
    if (USE_MOCK) {
      return { orderId: `PAYPAL_MOCK_${Date.now()}` };
    }

    const { data, error } = await supabase.functions.invoke('create-paypal-order', {
      body: {
        strategy_id: strategyId,
        amount,
        user_id: userId,
      },
    });

    if (error) throw error;
    return data;
  },

  /**
   * Capture PayPal order after approval
   */
  async captureOrder(orderId: string): Promise<PaymentIntent> {
    if (USE_MOCK) {
      return {
        id: orderId,
        amount: 0,
        currency: 'USD',
        status: 'completed',
        payment_method: 'paypal',
        metadata: { user_id: 'mock' },
        created_at: new Date().toISOString(),
      };
    }

    const { data, error } = await supabase.functions.invoke('capture-paypal-order', {
      body: { order_id: orderId },
    });

    if (error) throw error;
    return data;
  },
};

// ==================== CRYPTO/TOKEN PAYMENTS ====================

export const cryptoService = {
  /**
   * Get wallet address for payment
   */
  async getPaymentAddress(
    strategyId: string,
    amount: number,
    userId: string,
    currency: 'ETH' | 'USDT' | 'USDC'
  ): Promise<{
    address: string;
    amount: number;
    currency: string;
    expiresAt: string;
    paymentId: string;
  }> {
    if (USE_MOCK) {
      return {
        address: '0x742d35Cc6634C0532925a3b844Bc9e7595f3f800',
        amount: currency === 'ETH' ? amount / 2000 : amount, // Mock ETH conversion
        currency,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        paymentId: `CRYPTO_${Date.now()}`,
      };
    }

    const { data, error } = await supabase.functions.invoke('create-crypto-payment', {
      body: {
        strategy_id: strategyId,
        amount,
        user_id: userId,
        currency,
      },
    });

    if (error) throw error;
    return data;
  },

  /**
   * Verify crypto payment
   */
  async verifyPayment(paymentId: string, txHash: string): Promise<PaymentIntent> {
    if (USE_MOCK) {
      return {
        id: paymentId,
        amount: 0,
        currency: 'USDT',
        status: 'completed',
        payment_method: 'crypto',
        metadata: { user_id: 'mock' },
        created_at: new Date().toISOString(),
      };
    }

    const { data, error } = await supabase.functions.invoke('verify-crypto-payment', {
      body: { payment_id: paymentId, tx_hash: txHash },
    });

    if (error) throw error;
    return data;
  },

  /**
   * Connect wallet for token payments
   */
  async connectWallet(): Promise<string | null> {
    if (typeof window === 'undefined' || !window.ethereum) {
      return null;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      }) as string[];
      return accounts[0] || null;
    } catch {
      return null;
    }
  },

  /**
   * Send token payment
   */
  async sendPayment(
    toAddress: string,
    amount: number,
    currency: 'ETH' | 'USDT' | 'USDC'
  ): Promise<string> {
    if (!window.ethereum) {
      throw new Error('No wallet connected');
    }

    // For ETH payments
    if (currency === 'ETH') {
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          to: toAddress,
          value: `0x${(amount * 1e18).toString(16)}`,
        }],
      });
      return txHash as string;
    }

    // For ERC-20 tokens (USDT, USDC) - would need contract interaction
    // This is simplified - real implementation would use ethers.js or web3.js
    throw new Error('ERC-20 payments require additional setup');
  },
};

// ==================== PAYMENT HISTORY ====================

export const paymentHistoryService = {
  /**
   * Get user's payment history
   */
  async getHistory(userId: string): Promise<PaymentIntent[]> {
    if (USE_MOCK) {
      return [
        {
          id: 'pay_1',
          amount: 299,
          currency: 'USD',
          status: 'completed',
          payment_method: 'stripe',
          metadata: { user_id: userId, strategy_id: '1' },
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'pay_2',
          amount: 49,
          currency: 'USD',
          status: 'completed',
          payment_method: 'stripe',
          metadata: { user_id: userId, subscription_tier: 'trader_pro' },
          created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
    }

    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get active subscriptions
   */
  async getActiveSubscriptions(userId: string): Promise<Subscription[]> {
    if (USE_MOCK) {
      return [];
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .in('status', ['active', 'trialing']);

    if (error) throw error;
    return data || [];
  },
};
