import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { neon } from '@neondatabase/serverless';

async function getUser(email: string) {
  const sql = neon(process.env.DATABASE_URL!);
  const users = await sql`
    SELECT id, name, email, password FROM users WHERE email=${email}
  `;
  return users[0];
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) {
            return { id: user.id, name: user.name, email: user.email };
          }
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});