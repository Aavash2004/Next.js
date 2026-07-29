import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: () => '/dashboard' }));

const { default: SideNav } = await import('./sidenav');

describe('SideNav', () => {
  it('links the logo to the home page', () => {
    render(<SideNav />);

    expect(screen.getByRole('link', { name: /acme/i })).toHaveAttribute(
      'href',
      '/',
    );
  });

  it('renders the navigation links', () => {
    render(<SideNav />);

    expect(
      screen.getAllByRole('link').map((link) => link.getAttribute('href')),
    ).toEqual(['/', '/dashboard', '/invoices', '/Customers']);
  });

  it('renders a sign out button inside a form', () => {
    render(<SideNav />);

    const button = screen.getByRole('button', { name: 'Sign Out' });
    expect(button.closest('form')).toBeInTheDocument();
  });
});
