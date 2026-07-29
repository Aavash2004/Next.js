import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './button';

describe('Button', () => {
  it('renders its children inside a button element', () => {
    render(<Button>Log in</Button>);

    expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument();
  });

  it('merges the extra class names with the base styles', () => {
    render(<Button className="w-full">Log in</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full', 'bg-blue-500');
  });

  it('forwards the remaining props to the button element', () => {
    const onClick = vi.fn();
    render(
      <Button type="submit" aria-disabled="true" onClick={onClick}>
        Submit
      </Button>,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('aria-disabled', 'true');

    button.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
