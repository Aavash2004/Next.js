import { describe, expect, it } from 'vitest';
import {
  formatCurrency,
  formatDateToLocal,
  generatePagination,
  generateYAxis,
} from './utils';

describe('formatCurrency', () => {
  it('converts cents to a USD string', () => {
    expect(formatCurrency(102500)).toBe('$1,025.00');
  });

  it('rounds to two decimal places', () => {
    expect(formatCurrency(1)).toBe('$0.01');
    expect(formatCurrency(1234)).toBe('$12.34');
  });

  it('handles zero and negative amounts', () => {
    expect(formatCurrency(0)).toBe('$0.00');
    expect(formatCurrency(-500)).toBe('-$5.00');
  });
});

describe('formatDateToLocal', () => {
  it('formats an ISO date with the default locale', () => {
    expect(formatDateToLocal('2023-11-14')).toBe('Nov 14, 2023');
  });

  it('formats with an explicit locale', () => {
    expect(formatDateToLocal('2023-11-14', 'en-GB')).toBe('14 Nov 2023');
  });

  it('accepts a full timestamp', () => {
    expect(formatDateToLocal('2022-01-02T10:20:30.000Z')).toBe('Jan 2, 2022');
  });
});

describe('generateYAxis', () => {
  it('builds labels in 1000 steps down to zero', () => {
    const { yAxisLabels, topLabel } = generateYAxis([
      { month: 'Jan', revenue: 2200 },
      { month: 'Feb', revenue: 1800 },
    ]);

    expect(topLabel).toBe(3000);
    expect(yAxisLabels).toEqual(['$3K', '$2K', '$1K', '$0K']);
  });

  it('rounds the highest record up to the next 1000', () => {
    expect(generateYAxis([{ month: 'Jan', revenue: 1 }]).topLabel).toBe(1000);
  });

  it('returns a single label when all revenue is zero', () => {
    const { yAxisLabels, topLabel } = generateYAxis([
      { month: 'Jan', revenue: 0 },
    ]);

    expect(topLabel).toBe(0);
    expect(yAxisLabels).toEqual(['$0K']);
  });
});

describe('generatePagination', () => {
  it('lists every page when there are 7 or fewer', () => {
    expect(generatePagination(1, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(generatePagination(3, 1)).toEqual([1]);
  });

  it('collapses the middle when the current page is near the start', () => {
    expect(generatePagination(1, 10)).toEqual([1, 2, 3, '...', 9, 10]);
    expect(generatePagination(3, 10)).toEqual([1, 2, 3, '...', 9, 10]);
  });

  it('collapses the middle when the current page is near the end', () => {
    expect(generatePagination(10, 10)).toEqual([1, 2, '...', 8, 9, 10]);
    expect(generatePagination(8, 10)).toEqual([1, 2, '...', 8, 9, 10]);
  });

  it('shows the current page and its neighbours in the middle', () => {
    expect(generatePagination(5, 10)).toEqual([1, '...', 4, 5, 6, '...', 10]);
  });
});
