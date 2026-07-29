import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Search from './search';

describe('Search', () => {
  it('renders a labelled input using the given placeholder', () => {
    render(<Search placeholder="Search invoices..." />);

    const input = screen.getByPlaceholderText('Search invoices...');
    expect(input).toBeInTheDocument();
    expect(screen.getByText('Search')).toHaveAttribute('for', 'search');
  });

  it('leaves the input empty so it is fully controlled by the user', () => {
    render(<Search placeholder="Search customers..." />);

    expect(screen.getByPlaceholderText('Search customers...')).toHaveValue('');
  });
});
