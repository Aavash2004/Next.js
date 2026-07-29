import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import RevenueChart from './revenue-chart';

describe('RevenueChart', () => {
  it('renders the section heading', async () => {
    render(await RevenueChart({ revenue: [{ month: 'Jan', revenue: 2000 }] }));

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Recent Revenue',
    );
  });

  it('renders without revenue data', async () => {
    const { container } = render(await RevenueChart({ revenue: [] }));

    expect(container.firstChild).toHaveClass('w-full', 'md:col-span-4');
  });
});
