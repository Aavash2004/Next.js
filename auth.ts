import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { neon } from '@neondatabase/serverless';
import type { User } from '@/app/lib/definitions';

const sql = neon(process.env.DATABASE_URL!);

async function getUser(email: string): Promise<User | undefined> {
  try {
    const users = await sql`SELECT * FROM users WHERE email=${email}`;
    return users[0] as User | undefined;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user.', { cause: error });
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          console.warn(
            'Invalid credentials format:',
            parsedCredentials.error.flatten().fieldErrors,
          );
          return null;
        }

        const { email, password } = parsedCredentials.data;
        const user = await getUser(email);
        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) return null;

        return user;
      },
    }),
  ],
});