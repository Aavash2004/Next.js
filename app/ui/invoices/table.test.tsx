import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { InvoicesTable as InvoicesTableRow } from '@/app/lib/definitions';

const fetchFilteredInvoices = vi.fn<() => Promise<InvoicesTableRow[]>>();

vi.mock('@/app/lib/data', () => ({ fetchFilteredInvoices }));

const { default: InvoicesTable } = await import('./table');

const invoice: InvoicesTableRow = {
  id: 'inv-1',
  customer_id: 'cus-1',
  name: 'Amy Burns',
  email: 'amy@burns.com',
  image_url: '/customers/amy-burns.png',
  date: '2023-11-14',
  amount: 44800,
  status: 'paid',
};

beforeEach(() => {
  fetchFilteredInvoices.mockReset();
});

describe('InvoicesTable', () => {
  it('fetches the invoices for the requested query and page', async () => {
    fetchFilteredInvoices.mockResolvedValue([]);

    render(await InvoicesTable({ query: 'amy', currentPage: 2 }));

    expect(fetchFilteredInvoices).toHaveBeenCalledWith('amy', 2);
  });

  it('renders each invoice with a formatted amount and date', async () => {
    fetchFilteredInvoices.mockResolvedValue([invoice]);

    render(await InvoicesTable({ query: '', currentPage: 1 }));

    // Once for the mobile card and once for the desktop table row.
    expect(screen.getAllByText('Amy Burns')).toHaveLength(2);
    expect(screen.getAllByText('amy@burns.com')).toHaveLength(2);
    expect(screen.getAllByText('$448.00')).toHaveLength(2);
    expect(screen.getAllByText('Nov 14, 2023')).toHaveLength(2);
    expect(screen.getAllByText('Paid')).toHaveLength(2);
  });

  it('renders update and delete controls per invoice', async () => {
    fetchFilteredInvoices.mockResolvedValue([invoice]);

    render(await InvoicesTable({ query: '', currentPage: 1 }));

    expect(screen.getAllByRole('link')).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: 'Delete' })).toHaveLength(2);
  });

  it('renders the table headers with no invoices', async () => {
    fetchFilteredInvoices.mockResolvedValue([]);

    render(await InvoicesTable({ query: 'nobody', currentPage: 1 }));

    expect(
      screen.getAllByRole('columnheader').map((header) => header.textContent),
    ).toEqual(['Customer', 'Email', 'Amount', 'Date', 'Status', 'Edit']);
    expect(screen.queryAllByRole('row')).toHaveLength(1);
  });
});
