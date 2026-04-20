// Vercel Serverless Function — create-checkout-session
// Mock mode: no Stripe keys needed. Real mode: set STRIPE_SECRET_KEY env var.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { name, taxId, totalDays, statusLabel } = req.body || {};

  if (!name || !taxId) {
    return res.status(400).json({ error: 'name and taxId are required' });
  }

  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000';
  const protocol = host.startsWith('localhost') ? 'http' : 'https';
  const baseUrl = process.env.VITE_APP_URL || `${protocol}://${host}`;

  const stripeKey = process.env.STRIPE_SECRET_KEY;

  // ── REAL STRIPE MODE ──────────────────────────────────────────
  if (stripeKey && (stripeKey.startsWith('sk_test_') || stripeKey.startsWith('sk_live_'))) {
    try {
      const { default: Stripe } = await import('stripe');
      const stripe = new Stripe(stripeKey, { apiVersion: '2024-12-18.acacia' });

      const priceId = process.env.VITE_STRIPE_PRICE_ID;
      if (!priceId) return res.status(500).json({ error: 'VITE_STRIPE_PRICE_ID not configured' });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'payment',
        success_url: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/?cancelled=true`,
        metadata: { name, taxId, totalDays: String(totalDays), statusLabel },
        payment_intent_data: {
          metadata: { name, taxId, totalDays: String(totalDays) },
        },
      });

      return res.status(200).json({ url: session.url, mode: 'stripe' });
    } catch (err) {
      console.error('Stripe error:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  // ── MOCK MODE (no real Stripe keys) ──────────────────────────
  return res.status(200).json({
    url: '/payment-mock',
    mode: 'mock',
  });
}
