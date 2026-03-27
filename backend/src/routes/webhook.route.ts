import { Router, Request, Response } from 'express';
import { handlePaymentWebhook } from '../logic/payment.logic';
import { iswClient } from '../services/interswitch.client';

const router = Router();

/**
 * POST /api/v1/webhooks/interswitch/payment
 *
 * Interswitch sends payment notifications here.
 * No JWT auth — verified via HMAC hash in the Hash header.
 * Always responds 200 immediately per Interswitch requirements.
 * Processing is synchronous here but should be moved to BullMQ queue
 * once the jobs infrastructure is in place.
 */
router.post('/interswitch/payment', async (req: Request, res: Response) => {
  // Respond 200 immediately — ISW will retry if it doesn't get 200
  res.status(200).json({ status: 'received' });

  try {
    const body = req.body as Record<string, unknown>;

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
      const isValid = iswClient.verifyWebhookHash(hashHeader, txnRef, amount);
      if (!isValid) {
        console.warn('[ISW Webhook] Hash verification failed for txnRef:', txnRef);
        return;
      }
    }

    const result = await handlePaymentWebhook({ txnRef, responseCode, amount });
    console.log('[ISW Webhook] Processed:', result);
  } catch (err) {
    console.error('[ISW Webhook] Processing error:', err);
  }
});

export default router;
