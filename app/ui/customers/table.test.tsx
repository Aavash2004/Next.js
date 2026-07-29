import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { FormattedCustomersTable } from '@/app/lib/definitions';
import CustomersTable from './table';

const customer: FormattedCustomersTable = {
  id: 'cus-1',
  name: 'Amy Burns',
  email: 'amy@burns.com',
  image_url: '/customers/amy-burns.png',
  total_invoices: 3,
  total_pending: '$10.00',
  total_paid: '$250.50',
};

describe('CustomersTable', () => {
  it('renders a row per customer with the pre-formatted totals', async () => {
    render(await CustomersTable({ customers: [customer] }));

    // Once for the mobile card and once for the desktop table row.
    expect(screen.getAllByText('Amy Burns')).toHaveLength(2);
    expect(screen.getAllByText('amy@burns.com')).toHaveLength(2);
    expect(screen.getAllByText('$10.00')).toHaveLength(2);
    expect(screen.getAllByText('$250.50')).toHaveLength(2);
    expect(screen.getByText('3 invoices')).toBeInTheDocument();
    expect(
      screen.getAllByAltText("Amy Burns's profile picture"),
    ).toHaveLength(2);
  });

  it('renders the search box and headers when there are no customers', async () => {
    render(await CustomersTable({ customers: [] }));

    expect(
      screen.getByPlaceholderText('Search customers...'),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('columnheader').map((header) => header.textContent),
    ).toEqual([
      'Name',
      'Email',
      'Total Invoices',
      'Total Pending',
      'Total Paid',
    ]);
  });
});
