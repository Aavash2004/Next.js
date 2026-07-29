import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Pagination from './pagination';

describe('Pagination', () => {
  it('renders nothing while the pagination markup is disabled', () => {
    const { container } = render(<Pagination totalPages={10} />);

    expect(container).toBeEmptyDOMElement();
  });
});
