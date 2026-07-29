import { neon } from '@neondatabase/serverless';
import { z } from 'zod';
import { auth } from '@/auth';

const CommentSchema = z.string().trim().min(1).max(1000);

export default function Page() {
  async function create(formData: FormData) {
    'use server';
    const session = await auth();
    if (!session?.user) {
      throw new Error('Unauthorized');
    }

    const parsedComment = CommentSchema.safeParse(formData.get('comment'));
    if (!parsedComment.success) {
      throw new Error('Invalid comment.');
    }

    const sql = neon(process.env.DATABASE_URL!);
    await sql.query('INSERT INTO comments (comment) VALUES ($1)', [
      parsedComment.data,
    ]);
  }

  return (
    <form action={create}>
      <input
        type="text"
        placeholder="write a comment"
        name="comment"
        maxLength={1000}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
}
