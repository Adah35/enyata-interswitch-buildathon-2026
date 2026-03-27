

export const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
];

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || '5000',
  APP_URL: process.env.APP_URL || 'http://localhost:5000',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',

  // Database
  DATABASE_URL: process.env.DATABASE_URL!,

  // Redis
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',

  // JWT
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

  // Interswitch
  ISW_CLIENT_ID: process.env.ISW_CLIENT_ID!,
  ISW_CLIENT_SECRET: process.env.ISW_CLIENT_SECRET!,
  ISW_MERCHANT_CODE: process.env.ISW_MERCHANT_CODE!,
  ISW_PAY_ITEM_ID: process.env.ISW_PAY_ITEM_ID!,
  ISW_TERMINAL_ID: process.env.ISW_TERMINAL_ID || '3456789012',
  ISW_BASE_URL: process.env.ISW_BASE_URL || 'https://sandbox.interswitchng.com',
  ISW_PASSPORT_URL: process.env.ISW_PASSPORT_URL || 'https://sandbox.interswitchng.com/passport/oauth/token',
  ISW_PAYMENT_NOTIFY_URL: process.env.ISW_PAYMENT_NOTIFY_URL!,
  ISW_REDIRECT_URL: process.env.ISW_REDIRECT_URL!,

  // AWS S3
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET || 'taskly-uploads',

  // Twilio
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID!,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN!,
  TWILIO_VERIFY_SERVICE_SID: process.env.TWILIO_VERIFY_SERVICE_SID!,

  // Resend (Email)
  RESEND_API_KEY: process.env.RESEND_API_KEY!,

  // Admin
  ADMIN_SECRET_KEY: process.env.ADMIN_SECRET_KEY!,

  // Legacy aliases kept for backward compatibility in existing middleware
  JWT_ACCESS_TOKEN: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_TOKEN: process.env.JWT_REFRESH_SECRET!,
};

