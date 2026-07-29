import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LatestInvoices from './latest-invoices';

describe('LatestInvoices', () => {
  it('renders the heading and refresh hint', async () => {
    render(
      await LatestInvoices({
        latestInvoices: [
          {
            id: 'inv-1',
            name: 'Amy Burns',
            email: 'amy@burns.com',
            image_url: '/customers/amy-burns.png',
            amount: '$448.00',
          },
        ],
      }),
    );

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Latest Invoices',
    );
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Updated just now',
    );
  });

  it('renders without any invoices', async () => {
    const { container } = render(await LatestInvoices({ latestInvoices: [] }));

    expect(container.firstChild).toHaveClass('md:col-span-4');
  });
});
