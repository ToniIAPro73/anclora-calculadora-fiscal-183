import Stripe from 'stripe';
import { getReportByStripeSessionId, getReportByReportKey } from './_lib/report-store.js';

const stripeKey = process.env.STRIPE_SECRET_KEY;

function getStripeClient() {
  if (!stripeKey) {
    throw new Error('STRIPE_SECRET_KEY not configured');
  }

  return new Stripe(stripeKey, { apiVersion: '2024-12-18.acacia' });
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const sessionId = req.query?.session_id;

  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({ error: 'session_id is required' });
  }

  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent'],
    });
    const report =
      await getReportByStripeSessionId(session.id) ||
      await getReportByReportKey(session.metadata?.report_key);

    const isVerifiedPayment =
      session.mode === 'payment' &&
      session.payment_status === 'paid' &&
      session.status === 'complete';

    return res.status(200).json({
      id: session.id,
      mode: session.mode,
      status: session.status,
      payment_status: session.payment_status,
      customer_details: session.customer_details
        ? {
            email: session.customer_details.email ?? null,
            name: session.customer_details.name ?? null,
          }
        : null,
      metadata: session.metadata ?? {},
      report_payload: {
        name: report?.name ?? null,
        taxId: report?.taxId ?? null,
        documentType: report?.documentType ?? 'passport',
        totalDays: Number(report?.totalDays ?? 0),
        statusLabel: report?.statusLabel ?? null,
        ranges: report?.ranges ?? [],
      },
      client_reference_id: session.client_reference_id ?? null,
      report_key: report?.reportKey ?? session.metadata?.report_key ?? null,
      verified: isVerifiedPayment,
    });
  } catch (error) {
    console.error('Checkout session status error:', error.message);
    return res.status(500).json({ error: 'Unable to verify checkout session' });
  }
}
