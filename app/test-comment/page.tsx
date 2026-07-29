import { neon } from '@neondatabase/serverless';

export default function Page() {
  async function create(formData: FormData) {
    'use server';
    const comment = formData.get('comment');

    if (typeof comment !== 'string' || comment.trim() === '') {
      throw new Error('Comment is required.');
    }

    try {
      const sql = neon(process.env.DATABASE_URL!);
      await sql`INSERT INTO comments (comment) VALUES (${comment.trim()})`;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to create comment.', { cause: error });
    }
  }

  return (
    <form action={create}>
      <input type="text" placeholder="write a comment" name="comment" />
      <button type="submit">Submit</button>
    </form>
  );
}
