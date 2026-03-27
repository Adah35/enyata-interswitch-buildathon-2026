"use strict";
/**
 * SOURCE OF TRUTH: Subscription Plans Configuration
 * All plan data is centralized here to avoid duplication and inconsistencies
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.STRIPE_PLANS = exports.PLANS_CONFIG = exports.STRIPE_CONFIG = void 0;
exports.getPlanFromPriceId = getPlanFromPriceId;
exports.getPlanConfig = getPlanConfig;
exports.getAllPlans = getAllPlans;
exports.getDisplayPlans = getDisplayPlans;
/**
 * Stripe Configuration - Centralized Stripe credentials and keys
 */
exports.STRIPE_CONFIG = {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
};
exports.PLANS_CONFIG = {
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
exports.STRIPE_PLANS = {
    starter: exports.PLANS_CONFIG.starter,
    pro: exports.PLANS_CONFIG.pro,
    scale: exports.PLANS_CONFIG.scale,
    lifetime: exports.PLANS_CONFIG.lifetime,
};
/**
 * Map Stripe price IDs to plan names
 */
function getPlanFromPriceId(priceId) {
    for (const [plan, config] of Object.entries(exports.PLANS_CONFIG)) {
        if (config.priceId === priceId) {
            return plan;
        }
    }
    return null;
}
/**
 * Get plan configuration by name
 */
function getPlanConfig(planName) {
    return exports.PLANS_CONFIG[planName] || null;
}
/**
 * Get all available plans (excluding free plan if needed)
 */
function getAllPlans(includeFree = false) {
    return Object.values(exports.PLANS_CONFIG).filter((plan) => includeFree || plan.id !== 'free');
}
/**
 * Get all plans for display (includes free plan)
 */
function getDisplayPlans() {
    return Object.values(exports.PLANS_CONFIG);
}
//# sourceMappingURL=stripe-plans.js.map