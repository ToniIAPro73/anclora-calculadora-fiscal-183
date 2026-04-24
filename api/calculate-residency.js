import { z } from 'zod';
import { calculateFiscalSummary, toDayKey } from '../src/lib/fiscalSummary.js';

const calculatePayloadSchema = z.object({
  fiscalYear: z.number().int().min(1900).max(2100).optional(),
  limit: z.number().int().min(1).max(366).optional(),
  warningThreshold: z.number().int().min(1).max(366).optional(),
  ranges: z.array(z.object({
    start: z.union([z.string(), z.date()]),
    end: z.union([z.string(), z.date()]),
  })).min(1).max(366),
});

function serializeRange(range) {
  return {
    start: toDayKey(range.start),
    end: toDayKey(range.end),
    days: range.days,
    ...(Number.isInteger(range.overlapDays) ? { overlapDays: range.overlapDays } : {}),
  };
}

function normalizeDateInput(value) {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  return value;
}

function normalizeInputRange(range) {
  return {
    start: normalizeDateInput(range.start),
    end: normalizeDateInput(range.end),
  };
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const parsedPayload = calculatePayloadSchema.safeParse(req.body || {});
  if (!parsedPayload.success) {
    return res.status(400).json({ error: 'Invalid calculation payload' });
  }

  try {
    const { ranges, fiscalYear, limit, warningThreshold } = parsedPayload.data;
    const summary = calculateFiscalSummary(ranges.map(normalizeInputRange), { limit, warningThreshold });

    return res.status(200).json({
      fiscalYear: fiscalYear ?? new Date().getFullYear(),
      limit: summary.limit,
      warningThreshold: summary.warningThreshold,
      totalDays: summary.totalDays,
      remainingDays: summary.remainingDays,
      exceededDays: summary.exceededDays,
      percentageUsed: summary.percentageUsed,
      hasOverlap: summary.hasOverlap,
      status: summary.status,
      mergedRanges: summary.mergedRanges.map(serializeRange),
      annotatedRanges: summary.annotatedRanges.map(serializeRange),
    });
  } catch {
    return res.status(400).json({ error: 'Invalid date ranges' });
  }
}
