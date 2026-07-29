import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Breadcrumbs from './breadcrumbs';

describe('Breadcrumbs', () => {
  it('renders a link per crumb with separators in between', () => {
    render(
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/invoices' },
          { label: 'Create Invoice', href: '/invoices/create', active: true },
        ]}
      />,
    );

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/invoices');
    expect(links[1]).toHaveAttribute('href', '/invoices/create');
    expect(screen.getAllByText('/')).toHaveLength(1);
  });

  it('marks only the active crumb as current', () => {
    render(
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/invoices' },
          { label: 'Edit Invoice', href: '/invoices/1/edit', active: true },
        ]}
      />,
    );

    const crumbs = screen.getAllByRole('listitem');
    expect(crumbs[0]).not.toHaveAttribute('aria-current');
    expect(crumbs[1]).toHaveAttribute('aria-current', 'true');
    expect(crumbs[1]).toHaveClass('text-gray-900');
    expect(crumbs[0]).toHaveClass('text-gray-500');
  });

  it('renders no separator for a single crumb', () => {
    render(<Breadcrumbs breadcrumbs={[{ label: 'Invoices', href: '/invoices' }]} />);

    expect(screen.queryByText('/')).not.toBeInTheDocument();
  });
});
