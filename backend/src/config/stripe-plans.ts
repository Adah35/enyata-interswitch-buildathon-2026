/**
 * SOURCE OF TRUTH: Subscription Plans Configuration
 * All plan data is centralized here to avoid duplication and inconsistencies
 */

/**
 * Stripe Configuration - Centralized Stripe credentials and keys
 */
export const STRIPE_CONFIG = {
  secretKey: process.env.STRIPE_SECRET_KEY || '',
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
} as const;

/**
 * Plan Configuration Interface
 */
interface PlanConfig {
  id: string;
  name: string;
  price: number;
  credits: number;
  billing_interval: 'month' | 'one_time';
  rollover?: number;
  overage_price?: number;
  features: string[];
  priceId: string;
  productId: string;
}

export const PLANS_CONFIG: Record<string, PlanConfig> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    credits: 200,
    billing_interval: 'month',
    features: [
      '200 credits/month',
      '1-2 launches',
      'Basic email support',
    ],
    priceId: '',
    productId: '',
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 29,
    credits: 1000,
    billing_interval: 'month',
    rollover: 0,
    overage_price: 0.05,
    features: [
      '1,000 credits/month',
      'Up to 10 launches',
      'No rollover',
      'Overage: $0.05/credit',
      'Email support',
    ],
    priceId: process.env.STRIPE_STARTER_PRICE_ID || '',
    productId: process.env.STRIPE_STARTER_PRODUCT_ID || '',
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 79,
    credits: 3000,
    billing_interval: 'month',
    rollover: 1000,
    overage_price: 0.04,
    features: [
      '3,000 credits/month',
      'Unlimited launches',
      '1,000 credit rollover',
      'Overage: $0.04/credit',
      'Priority support',
    ],
    priceId: process.env.STRIPE_PRO_PRICE_ID || '',
    productId: process.env.STRIPE_PRO_PRODUCT_ID || '',
  },
  scale: {
    id: 'scale',
    name: 'Scale',
    price: 199,
    credits: 10000,
    billing_interval: 'month',
    rollover: 3000,
    overage_price: 0.03,
    features: [
      '10,000 credits/month',
      'Unlimited launches',
      '3,000 credit rollover',
      'Overage: $0.03/credit',
      'Dedicated support',
    ],
    priceId: process.env.STRIPE_SCALE_PRICE_ID || '',
    productId: process.env.STRIPE_SCALE_PRODUCT_ID || '',
  },
  lifetime: {
    id: 'lifetime',
    name: 'Lifetime',
    price: 299,
    credits: 3000,
    billing_interval: 'one_time',
    features: [
      '3,000 credits/month forever',
      'Unlimited launches',
      'Lifetime access',
      'Priority support',
      'Custom integrations',
    ],
    priceId: process.env.STRIPE_LIFETIME_PRICE_ID || '',
    productId: process.env.STRIPE_LIFETIME_PRODUCT_ID || '',
  },
};

/**
 * Legacy export for backward compatibility
 * @deprecated Use PLANS_CONFIG instead
 */
export const STRIPE_PLANS = {
  starter: PLANS_CONFIG.starter,
  pro: PLANS_CONFIG.pro,
  scale: PLANS_CONFIG.scale,
  lifetime: PLANS_CONFIG.lifetime,
};

/**
 * Map Stripe price IDs to plan names
 */
export function getPlanFromPriceId(priceId: string): string | null {
  for (const [plan, config] of Object.entries(PLANS_CONFIG)) {
    if (config.priceId === priceId) {
      return plan;
    }
  }
  return null;
}

/**
 * Get plan configuration by name
 */
export function getPlanConfig(planName: string): PlanConfig | null {
  return PLANS_CONFIG[planName] || null;
}

/**
 * Get all available plans (excluding free plan if needed)
 */
export function getAllPlans(includeFree: boolean = false): PlanConfig[] {
  return Object.values(PLANS_CONFIG).filter(
    (plan) => includeFree || plan.id !== 'free'
  );
}

/**
 * Get all plans for display (includes free plan)
 */
export function getDisplayPlans(): PlanConfig[] {
  return Object.values(PLANS_CONFIG);
}
