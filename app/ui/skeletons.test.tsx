import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import DashboardSkeleton, {
  CardSkeleton,
  CardsSkeleton,
  InvoiceSkeleton,
  InvoicesMobileSkeleton,
  InvoicesTableSkeleton,
  LatestInvoicesSkeleton,
  RevenueChartSkeleton,
  TableRowSkeleton,
} from './skeletons';

describe('skeletons', () => {
  it('animates the top level placeholders', () => {
    const { container } = render(<CardSkeleton />);

    expect(container.firstChild).toHaveClass(
      'before:animate-[shimmer_2s_infinite]',
    );
  });

  it('renders four card placeholders', () => {
    const { container } = render(<CardsSkeleton />);

    expect(container.children).toHaveLength(4);
  });

  it('renders the revenue chart placeholder', () => {
    const { container } = render(<RevenueChartSkeleton />);

    expect(container.firstChild).toHaveClass('md:col-span-4');
  });

  it('renders five invoice placeholders in the latest invoices card', () => {
    const { container } = render(<LatestInvoicesSkeleton />);
    const { container: single } = render(<InvoiceSkeleton />);

    expect(container.querySelectorAll('.border-b')).toHaveLength(5);
    expect(single.firstChild).toHaveClass('border-b');
  });

  it('composes the dashboard placeholder from the card and chart placeholders', () => {
    const { container } = render(<DashboardSkeleton />);

    expect(container.querySelectorAll('.shadow-sm')).toHaveLength(4);
    expect(container.querySelectorAll('.md\\:col-span-4')).toHaveLength(2);
  });

  it('renders six rows and six mobile cards in the invoices table placeholder', () => {
    const { container } = render(<InvoicesTableSkeleton />);

    expect(container.querySelectorAll('tbody tr')).toHaveLength(6);
    expect(container.querySelectorAll('.md\\:hidden > div')).toHaveLength(6);
    expect(container.querySelectorAll('th')).toHaveLength(6);
  });

  it('renders a table row placeholder with one cell per column', () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRowSkeleton />
        </tbody>
      </table>,
    );

    expect(container.querySelectorAll('td')).toHaveLength(6);
  });

  it('renders the mobile invoice placeholder', () => {
    const { container } = render(<InvoicesMobileSkeleton />);

    expect(container.firstChild).toHaveClass('rounded-md', 'bg-white');
  });
});
