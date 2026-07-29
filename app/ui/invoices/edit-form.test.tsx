import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { CustomerField, InvoiceForm } from '@/app/lib/definitions';
import EditInvoiceForm from './edit-form';

const customers: CustomerField[] = [
  { id: 'cus-1', name: 'Amy Burns' },
  { id: 'cus-2', name: 'Balazs Orban' },
];

const invoice: InvoiceForm = {
  id: 'inv-1',
  customer_id: 'cus-2',
  amount: 448,
  status: 'paid',
};

describe('EditInvoiceForm', () => {
  it('preselects the invoice customer and amount', () => {
    render(<EditInvoiceForm invoice={invoice} customers={customers} />);

    expect(screen.getByLabelText('Choose customer')).toHaveValue('cus-2');
    expect(screen.getByLabelText('Choose an amount')).toHaveValue(448);
  });

  it('checks the radio matching the invoice status', () => {
    render(<EditInvoiceForm invoice={invoice} customers={customers} />);

    expect(screen.getByRole('radio', { name: /paid/i })).toBeChecked();
    expect(screen.getByRole('radio', { name: /pending/i })).not.toBeChecked();
  });

  it('checks the pending radio for a pending invoice', () => {
    render(
      <EditInvoiceForm
        invoice={{ ...invoice, status: 'pending' }}
        customers={customers}
      />,
    );

    expect(screen.getByRole('radio', { name: /pending/i })).toBeChecked();
    expect(screen.getByRole('radio', { name: /paid/i })).not.toBeChecked();
  });

  it('renders a cancel link and a submit button', () => {
    render(<EditInvoiceForm invoice={invoice} customers={customers} />);

    expect(screen.getByRole('link', { name: 'Cancel' })).toHaveAttribute(
      'href',
      '/dashboard/invoices',
    );
    expect(screen.getByRole('button', { name: 'Edit Invoice' })).toHaveAttribute(
      'type',
      'submit',
    );
  });
});
