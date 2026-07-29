import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type SqlCall = { text: string; values: unknown[] };

const results: unknown[] = [];
const calls: SqlCall[] = [];

const sqlMock = vi.fn((strings: TemplateStringsArray, ...values: unknown[]) => {
  calls.push({ text: strings.join('?').replace(/\s+/g, ' ').trim(), values });
  const next = results.shift();
  return next instanceof Error ? Promise.reject(next) : Promise.resolve(next);
});

vi.mock('postgres', () => ({ default: vi.fn(() => sqlMock) }));

const data = await import('./data');

/** Queues the rows returned by the next `sql` call(s), in order. */
function queue(...rows: unknown[]) {
  results.push(...rows);
}

beforeEach(() => {
  results.length = 0;
  calls.length = 0;
  sqlMock.mockClear();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('fetchRevenue', () => {
  it('returns the revenue rows unchanged', async () => {
    const revenue = [{ month: 'Jan', revenue: 2000 }];
    queue(revenue);

    await expect(data.fetchRevenue()).resolves.toBe(revenue);
  });

  it('throws a friendly error when the query fails', async () => {
    queue(new Error('connection lost'));

    await expect(data.fetchRevenue()).rejects.toThrow(
      'Failed to fetch revenue data.',
    );
  });
});

describe('fetchLatestInvoices', () => {
  it('formats the amount of every invoice', async () => {
    queue([
      { id: '1', name: 'Amy', email: 'amy@x.com', image_url: '/a.png', amount: 5000 },
      { id: '2', name: 'Bob', email: 'bob@x.com', image_url: '/b.png', amount: 12 },
    ]);

    await expect(data.fetchLatestInvoices()).resolves.toEqual([
      { id: '1', name: 'Amy', email: 'amy@x.com', image_url: '/a.png', amount: '$50.00' },
      { id: '2', name: 'Bob', email: 'bob@x.com', image_url: '/b.png', amount: '$0.12' },
    ]);
  });

  it('throws a friendly error when the query fails', async () => {
    queue(new Error('boom'));

    await expect(data.fetchLatestInvoices()).rejects.toThrow(
      'Failed to fetch the latest invoices.',
    );
  });
});

describe('fetchCardData', () => {
  it('aggregates the counts and formats the totals', async () => {
    queue([{ count: '13' }], [{ count: '7' }], [{ paid: 15000, pending: 2500 }]);

    await expect(data.fetchCardData()).resolves.toEqual({
      numberOfInvoices: 13,
      numberOfCustomers: 7,
      totalPaidInvoices: '$150.00',
      totalPendingInvoices: '$25.00',
    });
  });

  it('falls back to zero when the aggregates are null', async () => {
    queue([{ count: null }], [{ count: null }], [{ paid: null, pending: null }]);

    await expect(data.fetchCardData()).resolves.toEqual({
      numberOfInvoices: 0,
      numberOfCustomers: 0,
      totalPaidInvoices: '$0.00',
      totalPendingInvoices: '$0.00',
    });
  });

  it('throws a friendly error when a query fails', async () => {
    queue([{ count: '1' }], [{ count: '1' }], new Error('boom'));

    await expect(data.fetchCardData()).rejects.toThrow(
      'Failed to fetch card data.',
    );
  });
});

describe('fetchFilteredInvoices', () => {
  it('searches every column and pages by six items', async () => {
    const invoices = [{ id: '1' }];
    queue(invoices);

    await expect(data.fetchFilteredInvoices('amy', 3)).resolves.toBe(invoices);
    expect(calls[0].values).toEqual([
      '%amy%',
      '%amy%',
      '%amy%',
      '%amy%',
      '%amy%',
      6,
      12,
    ]);
  });

  it('starts at offset zero on the first page', async () => {
    queue([]);

    await data.fetchFilteredInvoices('', 1);

    expect(calls[0].values.at(-1)).toBe(0);
  });

  it('throws a friendly error when the query fails', async () => {
    queue(new Error('boom'));

    await expect(data.fetchFilteredInvoices('amy', 1)).rejects.toThrow(
      'Failed to fetch invoices.',
    );
  });
});

describe('fetchInvoicesPages', () => {
  it('rounds the page count up', async () => {
    queue([{ count: '13' }]);

    await expect(data.fetchInvoicesPages('amy')).resolves.toBe(3);
  });

  it('returns zero pages when nothing matches', async () => {
    queue([{ count: '0' }]);

    await expect(data.fetchInvoicesPages('nobody')).resolves.toBe(0);
  });

  it('throws a friendly error when the query fails', async () => {
    queue(new Error('boom'));

    await expect(data.fetchInvoicesPages('amy')).rejects.toThrow(
      'Failed to fetch total number of invoices.',
    );
  });
});

describe('fetchInvoiceById', () => {
  it('converts the amount from cents to dollars', async () => {
    queue([{ id: '1', customer_id: 'c1', amount: 9950, status: 'paid' }]);

    await expect(data.fetchInvoiceById('1')).resolves.toEqual({
      id: '1',
      customer_id: 'c1',
      amount: 99.5,
      status: 'paid',
    });
    expect(calls[0].values).toEqual(['1']);
  });

  it('triggers a 404 for an unknown id', async () => {
    queue([]);

    await expect(data.fetchInvoiceById('missing')).rejects.toThrow(
      /NEXT_HTTP_ERROR_FALLBACK;404/,
    );
  });

  it('throws a friendly error when the query fails', async () => {
    queue(new Error('boom'));

    await expect(data.fetchInvoiceById('1')).rejects.toThrow(
      'Failed to fetch invoice.',
    );
  });
});

describe('fetchCustomers', () => {
  it('returns the customer fields', async () => {
    const customers = [{ id: '1', name: 'Amy' }];
    queue(customers);

    await expect(data.fetchCustomers()).resolves.toBe(customers);
  });

  it('throws a friendly error when the query fails', async () => {
    queue(new Error('boom'));

    await expect(data.fetchCustomers()).rejects.toThrow(
      'Failed to fetch all customers.',
    );
  });
});

describe('fetchFilteredCustomers', () => {
  it('formats the pending and paid totals', async () => {
    queue([
      {
        id: '1',
        name: 'Amy',
        email: 'amy@x.com',
        image_url: '/a.png',
        total_invoices: 2,
        total_pending: 1000,
        total_paid: 25050,
      },
    ]);

    await expect(data.fetchFilteredCustomers('amy')).resolves.toEqual([
      {
        id: '1',
        name: 'Amy',
        email: 'amy@x.com',
        image_url: '/a.png',
        total_invoices: 2,
        total_pending: '$10.00',
        total_paid: '$250.50',
      },
    ]);
    expect(calls[0].values).toEqual(['%amy%', '%amy%']);
  });

  it('throws a friendly error when the query fails', async () => {
    queue(new Error('boom'));

    await expect(data.fetchFilteredCustomers('amy')).rejects.toThrow(
      'Failed to fetch customer table.',
    );
  });
});
