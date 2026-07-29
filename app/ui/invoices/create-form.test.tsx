import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { CustomerField } from '@/app/lib/definitions';
import Form from './create-form';

const customers: CustomerField[] = [
  { id: 'cus-1', name: 'Amy Burns' },
  { id: 'cus-2', name: 'Balazs Orban' },
];

describe('CreateInvoiceForm', () => {
  it('lists the customers behind a disabled placeholder option', () => {
    render(<Form customers={customers} />);

    const select = screen.getByLabelText('Choose customer');
    expect(
      screen.getAllByRole('option').map((option) => option.textContent),
    ).toEqual(['Select a customer', 'Amy Burns', 'Balazs Orban']);
    expect(screen.getByRole('option', { name: 'Select a customer' })).toBeDisabled();
    expect(select).toHaveValue('');
  });

  it('renders an empty amount field accepting cents', () => {
    render(<Form customers={customers} />);

    const amount = screen.getByLabelText('Choose an amount');
    expect(amount).toHaveAttribute('type', 'number');
    expect(amount).toHaveAttribute('step', '0.01');
    expect(amount).toHaveValue(null);
  });

  it('renders both status radios unchecked', () => {
    render(<Form customers={customers} />);

    expect(screen.getByRole('radio', { name: /pending/i })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: /paid/i })).not.toBeChecked();
  });

  it('renders a cancel link and a submit button', () => {
    render(<Form customers={customers} />);

    expect(screen.getByRole('link', { name: 'Cancel' })).toHaveAttribute(
      'href',
      '/dashboard/invoices',
    );
    expect(
      screen.getByRole('button', { name: 'Create Invoice' }),
    ).toHaveAttribute('type', 'submit');
  });
});
