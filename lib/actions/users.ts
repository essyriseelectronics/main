'use server';

import { queryD1 } from '@/lib/db/client';
import { revalidatePath } from 'next/cache';

export type UserRecord = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
};

export async function getAllUsers() {
  try {
    return await queryD1<UserRecord>(
      "SELECT id, first_name, last_name, phone, role FROM users ORDER BY first_name ASC"
    );
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
}

export async function updateUserRole(userId: string, newRole: string) {
  try {
    await queryD1(
      "UPDATE users SET role = ? WHERE id = ?",
      [newRole, userId]
    );
    revalidatePath('/admin/users');
    return { success: true, message: 'Role updated successfully' };
  } catch (error) {
    console.error("Failed to update user role:", error);
    return { success: false, error: 'Failed to update role.' };
  }
}
