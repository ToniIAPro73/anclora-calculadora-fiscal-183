
import { differenceInDays, max } from 'date-fns';

/**
 * Merges overlapping or contiguous date ranges
 * @param {Array<{start: Date, end: Date, days: number}>} ranges 
 * @returns {{merged: Array<{start: Date, end: Date, days: number}>, hasOverlap: boolean}}
 */
export const mergeDateRanges = (ranges) => {
  if (!ranges || ranges.length === 0) return { merged: [], hasOverlap: false };

  // Sort ranges chronologically by start date
  const sortedRanges = [...ranges].sort((a, b) => a.start.getTime() - b.start.getTime());

  const merged = [{ ...sortedRanges[0] }];
  let hasOverlap = false;

  for (let i = 1; i < sortedRanges.length; i++) {
    const current = sortedRanges[i];
    const lastMerged = merged[merged.length - 1];

    // If current start date is before or equal to the last merged end date, they overlap
    if (current.start <= lastMerged.end) {
      hasOverlap = true;
      lastMerged.end = max([lastMerged.end, current.end]);
      // Recalculate days for the newly merged block
      lastMerged.days = differenceInDays(lastMerged.end, lastMerged.start) + 1;
    } else {
      merged.push({ ...current });
    }
  }

  return { merged, hasOverlap };
};

/**
 * Calculates total unique days from a pre-merged array of date ranges
 * @param {Array<{start: Date, end: Date, days: number}>} mergedRanges 
 * @returns {number} Total unique days
 */
export const calculateUniqueDays = (mergedRanges) => {
  return mergedRanges.reduce((sum, range) => sum + range.days, 0);
};
