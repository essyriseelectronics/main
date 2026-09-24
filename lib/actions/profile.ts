'use server';

import { queryD1 } from '@/lib/db/client';
import { getUser } from '@/lib/auth/getUser';
import { destroySession } from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateProfile(formData: FormData) {
  const user = await getUser();
  
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const firstName = formData.get('first_name') as string;
  const lastName = formData.get('last_name') as string;
  const email = formData.get('email') as string;
  const location = formData.get('location') as string;
  const address = formData.get('address') as string;

  const fullName = `${firstName} ${lastName}`.trim();

  try {
    // 1. Update Core User Table
    await queryD1(
      `UPDATE users 
       SET first_name = ?, last_name = ?, email = ?, location = ?, address = ? 
       WHERE id = ?`,
      [firstName, lastName, email, location, address, user.id]
    );

    // 2. Sync updates to the Marketing Contacts table
    await queryD1(
      `UPDATE contacts 
       SET name = ?, location = ?, address = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE phone = ?`,
      [fullName, location, address, user.phone]
    );

    // Refresh the page data
    revalidatePath('/profile');
    
    return { success: true, message: 'Profile updated successfully!' };
  } catch (error) {
    console.error('Profile Update Error:', error);
    return { success: false, error: 'Failed to update profile.' };
  }
}

export async function logoutUser() {
  await destroySession();
  redirect('/login');
}
