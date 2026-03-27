import axios, { AxiosInstance } from 'axios';
import * as crypto from 'crypto';
import { config } from '../config';
import redisClient from '../utils/redis';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InitiatePaymentParams {
  amountKobo: number;
  transactionRef: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  description: string;
}

export interface InitiatePaymentResult {
  paymentUrl: string;
  transactionRef: string;
  amountKobo: number;
}

export interface QueryTransactionResult {
  responseCode: string;
  responseDescription: string;
  transactionRef: string;
  amountKobo: number;
  merchantReference?: string;
}

export interface SendMoneyParams {
  amountKobo: number;
  beneficiaryAccountName: string;
  beneficiaryAccountNumber: string;
  beneficiaryBankCode: string;
  narration: string;
  senderName: string;
  uniqueReference: string;
}

export interface SendMoneyResult {
  responseCode: string;
  transferCode: string;
  responseDescription: string;
}

export interface ResolveBankAccountResult {
  accountName: string;
  accountNumber: string;
  bankCode: string;
}

export interface RefundTransactionParams {
  transactionRef: string;
  amountKobo: number;
  narration: string;
}

export interface RefundTransactionResult {
  responseCode: string;
  refundRef: string;
  responseDescription: string;
}

export interface QueryTransferResult {
  responseCode: string;
  status: string;
  responseDescription: string;
}

// ─── Redis key ────────────────────────────────────────────────────────────────

const ISW_TOKEN_CACHE_KEY = 'isw:access_token';

export class InterswitchClient {
  private readonly http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: config.ISW_BASE_URL,
      timeout: 30_000,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ─── 1. Get Bearer Token ────────────────────────────────────────────────────
  // Calls the OAuth token endpoint using Basic auth (clientId:clientSecret).
  // Token is cached in Redis for (expires_in - 60) seconds.

  async getAccessToken(): Promise<string> {
    // Try Redis cache first
    try {
      const cached = await redisClient.get(ISW_TOKEN_CACHE_KEY);
      if (cached) return cached;
    } catch {
      // Redis unavailable — fall through to fetch fresh token
    }

    const credentials = Buffer.from(
      `${config.ISW_CLIENT_ID}:${config.ISW_CLIENT_SECRET}`,
    ).toString('base64');

    const response = await axios.post(
      config.ISW_PASSPORT_URL,
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    const { access_token, expires_in } = response.data as {
      access_token: string;
      expires_in: number;
    };

    // Cache with TTL = expires_in - 60s to avoid using an expired token
    const ttl = Math.max(expires_in - 60, 60);
    try {
      await redisClient.setEx(ISW_TOKEN_CACHE_KEY, ttl, access_token);
    } catch {
      // Non-fatal — proceed without caching
    }

    return access_token;
  }

  // ─── 2. Initiate Payment (Web Checkout redirect URL) ────────────────────────
  // Constructs the Interswitch Web Checkout URL.
  // The poster is redirected to this URL to complete payment.

  async initiatePayment(params: InitiatePaymentParams): Promise<InitiatePaymentResult> {
    const query = new URLSearchParams({
      merchantcode: config.ISW_MERCHANT_CODE,
      payItemID: config.ISW_PAY_ITEM_ID,
      amount: String(params.amountKobo),
      transactionreference: params.transactionRef,
      customerid: params.customerId,
      customerEmail: params.customerEmail,
      customerName: params.customerName,
      siteredirecturl: config.ISW_REDIRECT_URL,
      currency: '566', // 566 = NGN
    });

    const paymentUrl = `${config.ISW_BASE_URL}/collections/w/pay?${query.toString()}`;

    return {
      paymentUrl,
      transactionRef: params.transactionRef,
      amountKobo: params.amountKobo,
    };
  }

  // ─── 3. Query Payment Status ────────────────────────────────────────────────
  // Verifies the payment status after redirect or webhook.
  // Requires a Hash header to prevent replay attacks.

  async queryTransaction(
    transactionRef: string,
    amountKobo: number,
  ): Promise<QueryTransactionResult> {
    const token = await this.getAccessToken();
    const hash = this._buildQueryHash(transactionRef, amountKobo);

    const response = await this.http.get('/api/v2/purchases', {
      params: {
        merchantcode: config.ISW_MERCHANT_CODE,
        transactionreference: transactionRef,
        amount: amountKobo,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        Hash: hash,
      },
    });

    const data = response.data as Record<string, unknown>;

    return {
      responseCode: String(data.ResponseCode ?? data.responseCode ?? ''),
      responseDescription: String(data.ResponseDescription ?? data.responseDescription ?? ''),
      transactionRef: String(data.TransactionReference ?? transactionRef),
      amountKobo: Number(data.Amount ?? amountKobo),
      merchantReference: data.MerchantReference as string | undefined,
    };
  }

  // ─── 4. Single Transfer (Payout to tasker) ──────────────────────────────────
  // Sends money to a bank account via Interswitch Funds Transfer.

  async sendMoney(params: SendMoneyParams): Promise<SendMoneyResult> {
    const token = await this.getAccessToken();

    const response = await this.http.post(
      '/api/v1/dosingletransfer',
      {
        amount: params.amountKobo,
        beneficiaryAccountName: params.beneficiaryAccountName,
        beneficiaryAccountNumber: params.beneficiaryAccountNumber,
        beneficiaryBankCode: params.beneficiaryBankCode,
        narration: params.narration,
        senderName: params.senderName,
        uniqueReference: params.uniqueReference,
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    const data = response.data as Record<string, unknown>;

    return {
      responseCode: String(data.ResponseCode ?? data.responseCode ?? ''),
      transferCode: String(data.TransferCode ?? data.transferCode ?? ''),
      responseDescription: String(data.ResponseDescription ?? data.responseDescription ?? ''),
    };
  }

  // ─── 5. Resolve Bank Account (Name Enquiry) ─────────────────────────────────
  // Looks up the account name for a given account number and bank code.
  // Used to confirm bank details before saving.

  async resolveBankAccount(
    accountNumber: string,
    bankCode: string,
  ): Promise<ResolveBankAccountResult> {
    const token = await this.getAccessToken();

    const response = await this.http.get(
      `/api/v1/nameenquiry/banks/${bankCode}/accounts/${accountNumber}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    const data = response.data as Record<string, unknown>;

    const accountName = String(
      data.AccountName ?? data.accountName ?? data.BeneficiaryName ?? '',
    );

    if (!accountName) {
      throw new Error('Could not resolve account name from Interswitch');
    }

    return { accountName, accountNumber, bankCode };
  }

  // ─── 6. Refund Transaction ──────────────────────────────────────────────────
  // Triggers a refund for a previously captured payment.

  async refundTransaction(params: RefundTransactionParams): Promise<RefundTransactionResult> {
    const token = await this.getAccessToken();

    const response = await this.http.post(
      '/api/v1/purchases/refund',
      {
        merchantCode: config.ISW_MERCHANT_CODE,
        transactionReference: params.transactionRef,
        amount: params.amountKobo,
        narration: params.narration,
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    const data = response.data as Record<string, unknown>;

    return {
      responseCode: String(data.ResponseCode ?? data.responseCode ?? ''),
      refundRef: String(data.RefundReference ?? data.refundReference ?? data.TransactionReference ?? ''),
      responseDescription: String(data.ResponseDescription ?? data.responseDescription ?? ''),
    };
  }

  // ─── 7. Query Transfer Status ────────────────────────────────────────────────
  // Checks the status of a previously initiated transfer.

  async queryTransfer(uniqueReference: string): Promise<QueryTransferResult> {
    const token = await this.getAccessToken();

    const response = await this.http.get('/api/v1/transfers', {
      params: { uniqueReference },
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = response.data as Record<string, unknown>;

    return {
      responseCode: String(data.ResponseCode ?? data.responseCode ?? ''),
      status: String(data.Status ?? data.status ?? ''),
      responseDescription: String(data.ResponseDescription ?? data.responseDescription ?? ''),
    };
  }

  // ─── Internal helpers ────────────────────────────────────────────────────────

  /**
   * Builds the Hash header required by Interswitch's payment query endpoint.
   * Hash = SHA512(clientId + terminalId + merchantCode + transactionRef + amount + clientSecret)
   */
  private _buildQueryHash(transactionRef: string, amountKobo: number): string {
    const terminalId = config.ISW_TERMINAL_ID;
    const raw = `${config.ISW_CLIENT_ID}${terminalId}${config.ISW_MERCHANT_CODE}${transactionRef}${amountKobo}${config.ISW_CLIENT_SECRET}`;
    return crypto.createHash('sha512').update(raw).digest('hex');
  }

  /**
   * Verifies the HMAC hash on incoming ISW webhook notifications.
   * ISW sends a Hash header: SHA512 of (txnRef + amount + clientSecret)
   */
  verifyWebhookHash(
    receivedHash: string,
    transactionRef: string,
    amountKobo: number,
  ): boolean {
    const raw = `${transactionRef}${amountKobo}${config.ISW_CLIENT_SECRET}`;
    const expected = crypto.createHash('sha512').update(raw).digest('hex');
    // Constant-time comparison to prevent timing attacks
    try {
      return crypto.timingSafeEqual(
        Buffer.from(expected, 'hex'),
        Buffer.from(receivedHash, 'hex'),
      );
    } catch {
      return false;
    }
  }
}

// ─── Singleton ────────────────────────────────────────────────────────────────

export const iswClient = new InterswitchClient();
