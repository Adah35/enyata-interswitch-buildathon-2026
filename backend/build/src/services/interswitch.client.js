"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.iswClient = exports.InterswitchClient = void 0;
const axios_1 = __importDefault(require("axios"));
const crypto = __importStar(require("crypto"));
const config_1 = require("../config");
const redis_1 = __importDefault(require("../utils/redis"));
// ─── Redis key ────────────────────────────────────────────────────────────────
const ISW_TOKEN_CACHE_KEY = 'isw:access_token';
class InterswitchClient {
    constructor() {
        this.http = axios_1.default.create({
            baseURL: config_1.config.ISW_BASE_URL,
            timeout: 30000,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    // ─── 1. Get Bearer Token ────────────────────────────────────────────────────
    // Calls the OAuth token endpoint using Basic auth (clientId:clientSecret).
    // Token is cached in Redis for (expires_in - 60) seconds.
    async getAccessToken() {
        // Try Redis cache first
        try {
            const cached = await redis_1.default.get(ISW_TOKEN_CACHE_KEY);
            if (cached)
                return cached;
        }
        catch {
            // Redis unavailable — fall through to fetch fresh token
        }
        const credentials = Buffer.from(`${config_1.config.ISW_CLIENT_ID}:${config_1.config.ISW_CLIENT_SECRET}`).toString('base64');
        const response = await axios_1.default.post(config_1.config.ISW_PASSPORT_URL, 'grant_type=client_credentials', {
            headers: {
                Authorization: `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        const { access_token, expires_in } = response.data;
        // Cache with TTL = expires_in - 60s to avoid using an expired token
        const ttl = Math.max(expires_in - 60, 60);
        try {
            await redis_1.default.setEx(ISW_TOKEN_CACHE_KEY, ttl, access_token);
        }
        catch {
            // Non-fatal — proceed without caching
        }
        return access_token;
    }
    // ─── 2. Initiate Payment (Web Checkout redirect URL) ────────────────────────
    // Constructs the Interswitch Web Checkout URL.
    // The poster is redirected to this URL to complete payment.
    async initiatePayment(params) {
        const query = new URLSearchParams({
            merchantcode: config_1.config.ISW_MERCHANT_CODE,
            payItemID: config_1.config.ISW_PAY_ITEM_ID,
            amount: String(params.amountKobo),
            transactionreference: params.transactionRef,
            customerid: params.customerId,
            customerEmail: params.customerEmail,
            customerName: params.customerName,
            siteredirecturl: config_1.config.ISW_REDIRECT_URL,
            currency: '566', // 566 = NGN
        });
        const paymentUrl = `${config_1.config.ISW_BASE_URL}/collections/w/pay?${query.toString()}`;
        return {
            paymentUrl,
            transactionRef: params.transactionRef,
            amountKobo: params.amountKobo,
        };
    }
    // ─── 3. Query Payment Status ────────────────────────────────────────────────
    // Verifies the payment status after redirect or webhook.
    // Requires a Hash header to prevent replay attacks.
    async queryTransaction(transactionRef, amountKobo) {
        const token = await this.getAccessToken();
        const hash = this._buildQueryHash(transactionRef, amountKobo);
        const response = await this.http.get('/api/v2/purchases', {
            params: {
                merchantcode: config_1.config.ISW_MERCHANT_CODE,
                transactionreference: transactionRef,
                amount: amountKobo,
            },
            headers: {
                Authorization: `Bearer ${token}`,
                Hash: hash,
            },
        });
        const data = response.data;
        return {
            responseCode: String(data.ResponseCode ?? data.responseCode ?? ''),
            responseDescription: String(data.ResponseDescription ?? data.responseDescription ?? ''),
            transactionRef: String(data.TransactionReference ?? transactionRef),
            amountKobo: Number(data.Amount ?? amountKobo),
            merchantReference: data.MerchantReference,
        };
    }
    // ─── 4. Single Transfer (Payout to tasker) ──────────────────────────────────
    // Sends money to a bank account via Interswitch Funds Transfer.
    async sendMoney(params) {
        const token = await this.getAccessToken();
        const response = await this.http.post('/api/v1/dosingletransfer', {
            amount: params.amountKobo,
            beneficiaryAccountName: params.beneficiaryAccountName,
            beneficiaryAccountNumber: params.beneficiaryAccountNumber,
            beneficiaryBankCode: params.beneficiaryBankCode,
            narration: params.narration,
            senderName: params.senderName,
            uniqueReference: params.uniqueReference,
        }, { headers: { Authorization: `Bearer ${token}` } });
        const data = response.data;
        return {
            responseCode: String(data.ResponseCode ?? data.responseCode ?? ''),
            transferCode: String(data.TransferCode ?? data.transferCode ?? ''),
            responseDescription: String(data.ResponseDescription ?? data.responseDescription ?? ''),
        };
    }
    // ─── 5. Resolve Bank Account (Name Enquiry) ─────────────────────────────────
    // Looks up the account name for a given account number and bank code.
    // Used to confirm bank details before saving.
    async resolveBankAccount(accountNumber, bankCode) {
        const token = await this.getAccessToken();
        const response = await this.http.get(`/api/v1/nameenquiry/banks/${bankCode}/accounts/${accountNumber}`, { headers: { Authorization: `Bearer ${token}` } });
        const data = response.data;
        const accountName = String(data.AccountName ?? data.accountName ?? data.BeneficiaryName ?? '');
        if (!accountName) {
            throw new Error('Could not resolve account name from Interswitch');
        }
        return { accountName, accountNumber, bankCode };
    }
    // ─── 6. Refund Transaction ──────────────────────────────────────────────────
    // Triggers a refund for a previously captured payment.
    async refundTransaction(params) {
        const token = await this.getAccessToken();
        const response = await this.http.post('/api/v1/purchases/refund', {
            merchantCode: config_1.config.ISW_MERCHANT_CODE,
            transactionReference: params.transactionRef,
            amount: params.amountKobo,
            narration: params.narration,
        }, { headers: { Authorization: `Bearer ${token}` } });
        const data = response.data;
        return {
            responseCode: String(data.ResponseCode ?? data.responseCode ?? ''),
            refundRef: String(data.RefundReference ?? data.refundReference ?? data.TransactionReference ?? ''),
            responseDescription: String(data.ResponseDescription ?? data.responseDescription ?? ''),
        };
    }
    // ─── 7. Query Transfer Status ────────────────────────────────────────────────
    // Checks the status of a previously initiated transfer.
    async queryTransfer(uniqueReference) {
        const token = await this.getAccessToken();
        const response = await this.http.get('/api/v1/transfers', {
            params: { uniqueReference },
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
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
    _buildQueryHash(transactionRef, amountKobo) {
        const terminalId = config_1.config.ISW_TERMINAL_ID;
        const raw = `${config_1.config.ISW_CLIENT_ID}${terminalId}${config_1.config.ISW_MERCHANT_CODE}${transactionRef}${amountKobo}${config_1.config.ISW_CLIENT_SECRET}`;
        return crypto.createHash('sha512').update(raw).digest('hex');
    }
    /**
     * Verifies the HMAC hash on incoming ISW webhook notifications.
     * ISW sends a Hash header: SHA512 of (txnRef + amount + clientSecret)
     */
    verifyWebhookHash(receivedHash, transactionRef, amountKobo) {
        const raw = `${transactionRef}${amountKobo}${config_1.config.ISW_CLIENT_SECRET}`;
        const expected = crypto.createHash('sha512').update(raw).digest('hex');
        // Constant-time comparison to prevent timing attacks
        try {
            return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(receivedHash, 'hex'));
        }
        catch {
            return false;
        }
    }
}
exports.InterswitchClient = InterswitchClient;
// ─── Singleton ────────────────────────────────────────────────────────────────
exports.iswClient = new InterswitchClient();
//# sourceMappingURL=interswitch.client.js.map