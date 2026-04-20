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
        total_days INTEGER NOT NULL,
        status_label TEXT,
        ranges_json JSONB NOT NULL DEFAULT '[]'::jsonb,
        payment_status TEXT NOT NULL DEFAULT 'pending',
        customer_email TEXT,
        paid_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
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
    totalDays: row.total_days,
    statusLabel: row.status_label,
    ranges: Array.isArray(row.ranges_json) ? row.ranges_json : [],
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
  totalDays,
  statusLabel,
  ranges,
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
        total_days,
        status_label,
        ranges_json,
        payment_status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CAST($9 AS jsonb), 'pending')
      RETURNING *
    `,
    [
      reportKey,
      source,
      productType,
      name,
      taxId,
      documentType,
      totalDays,
      statusLabel,
      JSON.stringify(ranges ?? []),
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
      WHERE report_key = COALESCE($1, report_key)
         OR stripe_session_id = COALESCE($2, stripe_session_id)
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
