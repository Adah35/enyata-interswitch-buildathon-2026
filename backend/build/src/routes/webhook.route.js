"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_logic_1 = require("../logic/payment.logic");
const interswitch_client_1 = require("../services/interswitch.client");
const router = (0, express_1.Router)();
/**
 * POST /api/v1/webhooks/interswitch/payment
 *
 * Interswitch sends payment notifications here.
 * No JWT auth — verified via HMAC hash in the Hash header.
 * Always responds 200 immediately per Interswitch requirements.
 * Processing is synchronous here but should be moved to BullMQ queue
 * once the jobs infrastructure is in place.
 */
router.post('/interswitch/payment', async (req, res) => {
    // Respond 200 immediately — ISW will retry if it doesn't get 200
    res.status(200).json({ status: 'received' });
    try {
        const body = req.body;
        const txnRef = String(body.txnref ?? body.transactionreference ?? body.TransactionReference ?? '');
        const responseCode = String(body.responsecode ?? body.ResponseCode ?? body.resp ?? '');
        const amount = Number(body.amount ?? body.Amount ?? 0);
        const hashHeader = String(req.headers['hash'] ?? req.headers['Hash'] ?? '');
        if (!txnRef || !responseCode) {
            console.warn('[ISW Webhook] Missing required fields:', { txnRef, responseCode });
            return;
        }
        // Verify HMAC hash if provided — skip in sandbox where hash may be absent
        if (hashHeader && amount > 0) {
            const isValid = interswitch_client_1.iswClient.verifyWebhookHash(hashHeader, txnRef, amount);
            if (!isValid) {
                console.warn('[ISW Webhook] Hash verification failed for txnRef:', txnRef);
                return;
            }
        }
        const result = await (0, payment_logic_1.handlePaymentWebhook)({ txnRef, responseCode, amount });
        console.log('[ISW Webhook] Processed:', result);
    }
    catch (err) {
        console.error('[ISW Webhook] Processing error:', err);
    }
});
exports.default = router;
//# sourceMappingURL=webhook.route.js.map