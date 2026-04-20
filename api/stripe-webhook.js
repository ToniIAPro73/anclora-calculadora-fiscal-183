import Stripe from 'stripe';
import { updateReportPaymentStatus } from './_lib/report-store.js';

const stripeKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

function getStripeClient() {
  if (!stripeKey) {
    throw new Error('STRIPE_SECRET_KEY not configured');
  }

  return new Stripe(stripeKey, { apiVersion: '2024-12-18.acacia' });
}

async function readRawBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!webhookSecret) {
    return res.status(500).json({ error: 'STRIPE_WEBHOOK_SECRET not configured' });
  }

  const signature = req.headers['stripe-signature'];
  if (!signature) {
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  try {
    const stripe = getStripeClient();
    const payload = await readRawBody(req);
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        await updateReportPaymentStatus({
          reportKey: session.metadata?.report_key ?? null,
          stripeSessionId: session.id,
          stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : null,
          paymentStatus: session.payment_status === 'paid' ? 'paid' : 'completed',
          customerEmail: session.customer_details?.email ?? null,
        });
        console.log('Stripe webhook: checkout.session.completed', {
          id: session.id,
          client_reference_id: session.client_reference_id,
          payment_status: session.payment_status,
          metadata: session.metadata,
        });
        break;
      }
      case 'checkout.session.expired': {
        const session = event.data.object;
        await updateReportPaymentStatus({
          reportKey: session.metadata?.report_key ?? null,
          stripeSessionId: session.id,
          paymentStatus: 'expired',
          customerEmail: session.customer_details?.email ?? null,
        });
        console.log('Stripe webhook: checkout.session.expired', {
          id: session.id,
          client_reference_id: session.client_reference_id,
        });
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        await updateReportPaymentStatus({
          reportKey: paymentIntent.metadata?.report_key ?? null,
          stripePaymentIntentId: paymentIntent.id,
          paymentStatus: 'failed',
          customerEmail: paymentIntent.receipt_email ?? null,
        });
        console.log('Stripe webhook: payment_intent.payment_failed', {
          id: paymentIntent.id,
          metadata: paymentIntent.metadata,
        });
        break;
      }
      default:
        console.log('Stripe webhook: unhandled event type', event.type);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Stripe webhook verification failed:', error.message);
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }
}
