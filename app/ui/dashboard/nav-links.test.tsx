import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const usePathname = vi.fn<() => string>();

vi.mock('next/navigation', () => ({ usePathname }));

const { default: NavLinks } = await import('./nav-links');

afterEach(() => {
  usePathname.mockReset();
});

describe('NavLinks', () => {
  it('renders a link for every navigation entry', () => {
    usePathname.mockReturnValue('/dashboard');
    render(<NavLinks />);

    expect(
      screen.getAllByRole('link').map((link) => link.getAttribute('href')),
    ).toEqual(['/dashboard', '/invoices', '/Customers']);
  });

  it('highlights the link matching the current pathname', () => {
    usePathname.mockReturnValue('/invoices');
    render(<NavLinks />);

    expect(screen.getByRole('link', { name: 'Invoices' })).toHaveClass(
      'bg-sky-100',
      'text-blue-600',
    );
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveClass(
      'bg-sky-100',
    );
  });

  it('highlights nothing on an unrelated pathname', () => {
    usePathname.mockReturnValue('/login');
    render(<NavLinks />);

    for (const link of screen.getAllByRole('link')) {
      expect(link).not.toHaveClass('bg-sky-100');
    }
  });
});
