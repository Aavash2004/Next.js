import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AcmeLogo from './acme-logo';

describe('AcmeLogo', () => {
  it('renders the brand name with the display font', () => {
    const { container } = render(<AcmeLogo />);

    expect(screen.getByText('Acme')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('lusitana');
  });

  it('renders the globe icon', () => {
    const { container } = render(<AcmeLogo />);

    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
