import { describe, expect, it } from 'vitest';
import handler from './calculate-residency.js';

function createResponse() {
  return {
    statusCode: 200,
    payload: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
  };
}

describe('calculate-residency api', () => {
  it('calculates overlapping YYYY-MM-DD ranges without shifting calendar days', () => {
    const req = {
      method: 'POST',
      body: {
        fiscalYear: 2026,
        ranges: [
          { start: '2026-01-01', end: '2026-01-10' },
          { start: '2026-01-05', end: '2026-01-15' },
        ],
      },
    };
    const res = createResponse();

    handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.payload.totalDays).toBe(15);
    expect(res.payload.hasOverlap).toBe(true);
    expect(res.payload.mergedRanges).toEqual([
      { start: '2026-01-01', end: '2026-01-15', days: 15 },
    ]);
    expect(res.payload.annotatedRanges[0]).toMatchObject({
      start: '2026-01-01',
      end: '2026-01-10',
      days: 10,
      overlapDays: 6,
    });
  });

  it('rejects invalid date ranges', () => {
    const req = {
      method: 'POST',
      body: {
        ranges: [{ start: '2026-02-01', end: '2026-01-01' }],
      },
    };
    const res = createResponse();

    handler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.payload).toEqual({ error: 'Invalid date ranges' });
  });
});
