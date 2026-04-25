import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;
let schemaReadyPromise;

function getSql() {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL not configured');
  }

  return neon(databaseUrl);
}

async function ensureSchema() {
  if (!schemaReadyPromise) {
    const sql = getSql();
    schemaReadyPromise = sql.query(`
      CREATE TABLE IF NOT EXISTS premium_reports (
        report_key TEXT PRIMARY KEY,
        stripe_session_id TEXT UNIQUE,
        stripe_payment_intent_id TEXT,
        client_reference_id TEXT,
        source TEXT NOT NULL,
        product_type TEXT NOT NULL,
        name TEXT NOT NULL,
        tax_id TEXT NOT NULL,
        document_type TEXT NOT NULL,
        language TEXT NOT NULL DEFAULT 'es',
        fiscal_year INTEGER NOT NULL DEFAULT 2026,
        total_days INTEGER NOT NULL,
        status_label TEXT,
        ranges_json JSONB NOT NULL DEFAULT '[]'::jsonb,
        delivery_token_hash TEXT,
        delivery_token_expires_at TIMESTAMPTZ,
        payment_status TEXT NOT NULL DEFAULT 'pending',
        customer_email TEXT,
        paid_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    schemaReadyPromise = schemaReadyPromise.then(async () => {
      await sql.query("ALTER TABLE premium_reports ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'es'");
      await sql.query('ALTER TABLE premium_reports ADD COLUMN IF NOT EXISTS fiscal_year INTEGER NOT NULL DEFAULT 2026');
      await sql.query('ALTER TABLE premium_reports ADD COLUMN IF NOT EXISTS delivery_token_hash TEXT');
      await sql.query('ALTER TABLE premium_reports ADD COLUMN IF NOT EXISTS delivery_token_expires_at TIMESTAMPTZ');
    });
  }

  await schemaReadyPromise;
}

function mapRowToReport(row) {
  if (!row) return null;

  return {
    reportKey: row.report_key,
    stripeSessionId: row.stripe_session_id,
    stripePaymentIntentId: row.stripe_payment_intent_id,
    clientReferenceId: row.client_reference_id,
    source: row.source,
    productType: row.product_type,
    name: row.name,
    taxId: row.tax_id,
    documentType: row.document_type,
    language: row.language ?? 'es',
    fiscalYear: row.fiscal_year,
    totalDays: row.total_days,
    statusLabel: row.status_label,
    ranges: Array.isArray(row.ranges_json) ? row.ranges_json : [],
    deliveryTokenHash: row.delivery_token_hash,
    deliveryTokenExpiresAt: row.delivery_token_expires_at,
    paymentStatus: row.payment_status,
    customerEmail: row.customer_email,
    paidAt: row.paid_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function createDraftReport({
  reportKey,
  source,
  productType,
  name,
  taxId,
  documentType,
  language = 'es',
  customerEmail = null,
  fiscalYear,
  totalDays,
  statusLabel,
  ranges,
  deliveryTokenHash = null,
  deliveryTokenExpiresAt = null,
}) {
  await ensureSchema();
  const sql = getSql();

  const result = await sql.query(
    `
      INSERT INTO premium_reports (
        report_key,
        source,
        product_type,
        name,
        tax_id,
        document_type,
        language,
        fiscal_year,
        total_days,
        status_label,
        ranges_json,
        delivery_token_hash,
        delivery_token_expires_at,
        payment_status,
        customer_email
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CAST($11 AS jsonb), $12, $13, 'pending', $14)
      RETURNING *
    `,
    [
      reportKey,
      source,
      productType,
      name,
      taxId,
      documentType,
      language,
      fiscalYear,
      totalDays,
      statusLabel,
      JSON.stringify(ranges ?? []),
      deliveryTokenHash,
      deliveryTokenExpiresAt,
      customerEmail,
    ],
  );

  return mapRowToReport(result[0]);
}

export async function attachStripeSession({
  reportKey,
  stripeSessionId,
  clientReferenceId,
}) {
  await ensureSchema();
  const sql = getSql();

  const result = await sql.query(
    `
      UPDATE premium_reports
      SET
        stripe_session_id = $2,
        client_reference_id = $3,
        updated_at = NOW()
      WHERE report_key = $1
      RETURNING *
    `,
    [reportKey, stripeSessionId, clientReferenceId],
  );

  return mapRowToReport(result[0]);
}

export async function updateReportPaymentStatus({
  reportKey = null,
  stripeSessionId = null,
  stripePaymentIntentId = null,
  paymentStatus,
  customerEmail = null,
}) {
  if (!reportKey && !stripeSessionId) {
    throw new Error('reportKey or stripeSessionId is required to update payment status');
  }

  await ensureSchema();
  const sql = getSql();

  const result = await sql.query(
    `
      UPDATE premium_reports
      SET
        stripe_payment_intent_id = COALESCE($3, stripe_payment_intent_id),
        payment_status = $4,
        customer_email = COALESCE($5, customer_email),
        paid_at = CASE WHEN $4 = 'paid' THEN COALESCE(paid_at, NOW()) ELSE paid_at END,
        updated_at = NOW()
      WHERE ($1 IS NOT NULL AND report_key = $1)
         OR ($2 IS NOT NULL AND stripe_session_id = $2)
      RETURNING *
    `,
    [reportKey, stripeSessionId, stripePaymentIntentId, paymentStatus, customerEmail],
  );

  return mapRowToReport(result[0]);
}

export async function getReportByStripeSessionId(stripeSessionId) {
  await ensureSchema();
  const sql = getSql();

  const result = await sql.query(
    `
      SELECT *
      FROM premium_reports
      WHERE stripe_session_id = $1
      LIMIT 1
    `,
    [stripeSessionId],
  );

  return mapRowToReport(result[0]);
}

export async function getReportByReportKey(reportKey) {
  await ensureSchema();
  const sql = getSql();

  const result = await sql.query(
    `
      SELECT *
      FROM premium_reports
      WHERE report_key = $1
      LIMIT 1
    `,
    [reportKey],
  );

  return mapRowToReport(result[0]);
}
