import { beforeEach, describe, expect, it, vi } from 'vitest';

class MockAuthError extends Error {
  type: string;

  constructor(type: string) {
    super(type);
    this.type = type;
  }
}

vi.mock('next-auth', () => ({ AuthError: MockAuthError }));
vi.mock('@/auth', () => ({ signIn: vi.fn() }));

const { signIn } = await import('@/auth');
const { authenticate } = await import('./actions');

const signInMock = vi.mocked(signIn);

function credentials(email: string, password: string) {
  const formData = new FormData();
  formData.set('email', email);
  formData.set('password', password);
  return formData;
}

describe('authenticate', () => {
  beforeEach(() => {
    signInMock.mockReset();
  });

  it('signs in with the credentials provider on valid input', async () => {
    const formData = credentials('user@example.com', 'password123');

    await expect(authenticate(undefined, formData)).resolves.toBeUndefined();
    expect(signInMock).toHaveBeenCalledWith('credentials', formData);
  });

  it.each([
    ['not-an-email', 'password123'],
    ['user@example.com', 'short'],
  ])('rejects invalid input (%s / %s) without signing in', async (email, password) => {
    await expect(authenticate(undefined, credentials(email, password))).resolves.toBe(
      'Invalid email or password format.',
    );
    expect(signInMock).not.toHaveBeenCalled();
  });

  it('rejects missing fields', async () => {
    await expect(authenticate(undefined, new FormData())).resolves.toBe(
      'Invalid email or password format.',
    );
    expect(signInMock).not.toHaveBeenCalled();
  });

  it('maps a CredentialsSignin error to an invalid credentials message', async () => {
    signInMock.mockRejectedValueOnce(new MockAuthError('CredentialsSignin'));

    await expect(
      authenticate(undefined, credentials('user@example.com', 'password123')),
    ).resolves.toBe('Invalid credentials.');
  });

  it('maps any other auth error to a generic message', async () => {
    signInMock.mockRejectedValueOnce(new MockAuthError('Configuration'));

    await expect(
      authenticate(undefined, credentials('user@example.com', 'password123')),
    ).resolves.toBe('Something went wrong.');
  });

  it('rethrows non-auth errors', async () => {
    signInMock.mockRejectedValueOnce(new Error('redirect'));

    await expect(
      authenticate(undefined, credentials('user@example.com', 'password123')),
    ).rejects.toThrow('redirect');
  });
});
