import Stripe from 'stripe';
import { createDraftReport, attachStripeSession } from './_lib/report-store.js';

// Vercel Serverless Function — create-checkout-session
// Real mode: Stripe Checkout con configuración server-side.
// Mock mode: solo permitido fuera de producción si faltan credenciales.

function normalizeBaseUrl(value) {
  return value.replace(/\/+$/, '');
}

function buildClientReferenceId(taxId) {
  const normalizedTaxId = String(taxId || '')
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .slice(-24);

  return `regla183_${Date.now()}_${normalizedTaxId || 'guest'}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { name, taxId, totalDays, statusLabel, documentType = 'passport', ranges = [] } = req.body || {};

  if (!name || !taxId) {
    return res.status(400).json({ error: 'name and taxId are required' });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;
  const appUrl = process.env.APP_URL;
  const databaseUrl = process.env.DATABASE_URL;
  const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';

  // ── REAL STRIPE MODE ──────────────────────────────────────────
  if (stripeKey) {
    try {
      const stripe = new Stripe(stripeKey, { apiVersion: '2024-12-18.acacia' });
      const baseUrl = normalizeBaseUrl(appUrl || '');

      if (!stripeKey.startsWith('sk_test_') && !stripeKey.startsWith('sk_live_')) {
        return res.status(500).json({ error: 'STRIPE_SECRET_KEY has invalid format' });
      }

      if (!priceId) {
        return res.status(500).json({ error: 'STRIPE_PRICE_ID not configured' });
      }

      if (!baseUrl) {
        return res.status(500).json({ error: 'APP_URL not configured' });
      }

      if (!databaseUrl) {
        return res.status(500).json({ error: 'DATABASE_URL not configured' });
      }

      const reportKey = crypto.randomUUID();
      const clientReferenceId = buildClientReferenceId(taxId);

      await createDraftReport({
        reportKey,
        source: 'regla183',
        productType: 'premium_report',
        name,
        taxId,
        documentType: String(documentType || 'passport'),
        totalDays: Number(totalDays ?? 0),
        statusLabel: String(statusLabel ?? ''),
        ranges,
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'payment',
        success_url: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/?cancelled=true`,
        client_reference_id: clientReferenceId,
        metadata: {
          source: 'regla183',
          product_type: 'premium_report',
          report_key: reportKey,
        },
        payment_intent_data: {
          metadata: {
            source: 'regla183',
            product_type: 'premium_report',
            report_key: reportKey,
          },
        },
      });

      await attachStripeSession({
        reportKey,
        stripeSessionId: session.id,
        clientReferenceId,
      });

      return res.status(200).json({ url: session.url, mode: 'stripe' });
    } catch (err) {
      console.error('Stripe error:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  // ── MOCK / DEV MODE ──────────────────────────────────────────
  if (isProduction) {
    return res.status(500).json({ error: 'Stripe is not configured for production' });
  }

  return res.status(200).json({
    url: '/payment-mock',
    mode: 'mock_dev',
  });
}
