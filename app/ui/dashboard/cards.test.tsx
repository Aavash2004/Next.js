import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CardWrapper, { Card } from './cards';

describe('CardWrapper', () => {
  it('renders nothing while the dashboard cards are disabled', async () => {
    const { container } = render(await CardWrapper());

    expect(container).toBeEmptyDOMElement();
  });
});

describe('Card', () => {
  it('renders the title and value', () => {
    render(<Card title="Collected" value="$150.00" type="collected" />);

    expect(
      screen.getByRole('heading', { level: 3, name: 'Collected' }),
    ).toBeInTheDocument();
    expect(screen.getByText('$150.00')).toBeInTheDocument();
  });

  it('accepts a numeric value', () => {
    render(<Card title="Total Invoices" value={13} type="invoices" />);

    expect(screen.getByText('13')).toBeInTheDocument();
  });

  it('renders an icon for every card type', () => {
    const types = ['collected', 'pending', 'invoices', 'customers'] as const;

    for (const type of types) {
      const { container, unmount } = render(
        <Card title={type} value={0} type={type} />,
      );
      expect(container.querySelector('svg')).toBeInTheDocument();
      unmount();
    }
  });
});
