import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CreateInvoice, DeleteInvoice, UpdateInvoice } from './buttons';

describe('CreateInvoice', () => {
  it('links to the create invoice page', () => {
    render(<CreateInvoice />);

    const link = screen.getByRole('link', { name: /create invoice/i });
    expect(link).toHaveAttribute('href', '/dashboard/invoices/create');
  });
});

describe('UpdateInvoice', () => {
  it('links back to the invoices list', () => {
    render(<UpdateInvoice id="123" />);

    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/dashboard/invoices',
    );
  });
});

describe('DeleteInvoice', () => {
  it('renders a submit button with an accessible name', () => {
    render(<DeleteInvoice id="123" />);

    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button).toHaveAttribute('type', 'submit');
  });
});
