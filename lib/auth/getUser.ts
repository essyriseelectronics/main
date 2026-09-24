import { cookies } from 'next/headers';
import { decrypt } from '@/lib/auth/session';
import { queryD1 } from '@/lib/db/client';

export type AuthUser = {
  id: string;
  phone: string;
  first_name: string;
  last_name: string;
  email: string | null;
  location: string | null;
  address: string | null;
  role: string;
};

export async function getUser(): Promise<AuthUser | null> {
  // 1. Get the session cookie
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) return null;

  // 2. Decrypt the JWT payload
  const payload = await decrypt(sessionCookie);

  if (!payload || !payload.userId) return null;

  try {
    // 3. Fetch the fresh user details from the D1 database
    const users = await queryD1<AuthUser>(
      `SELECT id, phone, first_name, last_name, email, location, address, role 
       FROM users 
       WHERE id = ? LIMIT 1`,
      [payload.userId as string]
    );

    if (users.length === 0) return null;

    return users[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
}
