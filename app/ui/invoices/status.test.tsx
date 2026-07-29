import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import InvoiceStatus from './status';

describe('InvoiceStatus', () => {
  it('renders the pending state', () => {
    const { container } = render(<InvoiceStatus status="pending" />);

    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.queryByText('Paid')).not.toBeInTheDocument();
    expect(container.firstChild).toHaveClass('bg-gray-100', 'text-gray-500');
  });

  it('renders the paid state', () => {
    const { container } = render(<InvoiceStatus status="paid" />);

    expect(screen.getByText('Paid')).toBeInTheDocument();
    expect(screen.queryByText('Pending')).not.toBeInTheDocument();
    expect(container.firstChild).toHaveClass('bg-green-500', 'text-white');
  });

  it('renders nothing but the badge for an unknown status', () => {
    const { container } = render(<InvoiceStatus status="archived" />);

    expect(container.firstChild).toBeEmptyDOMElement();
    expect(container.firstChild).not.toHaveClass('bg-gray-100', 'bg-green-500');
  });
});
