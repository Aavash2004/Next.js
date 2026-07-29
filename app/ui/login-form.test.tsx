import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LoginForm from './login-form';

describe('LoginForm', () => {
  it('renders a required email field', () => {
    render(<LoginForm />);

    const email = screen.getByLabelText('Email');
    expect(email).toHaveAttribute('type', 'email');
    expect(email).toHaveAttribute('name', 'email');
    expect(email).toBeRequired();
  });

  it('renders a required password field with a minimum length', () => {
    render(<LoginForm />);

    const password = screen.getByLabelText('Password');
    expect(password).toHaveAttribute('type', 'password');
    expect(password).toHaveAttribute('name', 'password');
    expect(password).toBeRequired();
    expect(password).toHaveAttribute('minlength', '6');
  });

  it('renders the submit button and heading', () => {
    render(<LoginForm />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Please log in to continue.',
    );
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });
});
