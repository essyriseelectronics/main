'use server';

import { queryD1 } from '@/lib/db/client';
import { revalidatePath } from 'next/cache';

export type StoreSettings = {
  maintenance_mode: boolean;
  store_phone: string;
  support_email: string;
};

// Fetch all settings and format them into a usable object
export async function getSettings(): Promise<StoreSettings> {
  try {
    const rawSettings = await queryD1<{ key: string; value: string }>(
      "SELECT * FROM settings"
    );

    // Default fallback values
    const settings: StoreSettings = {
      maintenance_mode: false,
      store_phone: '+256700000000',
      support_email: 'support@essyrise.com',
    };

    // Map database rows to the object
    rawSettings.forEach((setting) => {
      if (setting.key === 'maintenance_mode') {
        settings.maintenance_mode = setting.value === 'true';
      } else if (setting.key in settings) {
        (settings as any)[setting.key] = setting.value;
      }
    });

    return settings;
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return { maintenance_mode: false, store_phone: '', support_email: '' };
  }
}

// Update a single boolean setting (like the toggle)
export async function toggleMaintenanceMode(isActive: boolean) {
  try {
    await queryD1(
      `INSERT INTO settings (key, value, updated_at) 
       VALUES ('maintenance_mode', ?, CURRENT_TIMESTAMP) 
       ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = CURRENT_TIMESTAMP`,
      [isActive ? 'true' : 'false', isActive ? 'true' : 'false']
    );

    revalidatePath('/', 'layout'); // Refresh the whole app so maintenance mode kicks in globally
    revalidatePath('/admin/settings');
    
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle maintenance mode:", error);
    return { success: false, error: 'Failed to update maintenance mode.' };
  }
}

// Update text settings (Contact info, etc.)
export async function updateGeneralSettings(formData: FormData) {
  const phone = formData.get('store_phone') as string;
  const email = formData.get('support_email') as string;

  try {
    await queryD1(
      `INSERT INTO settings (key, value, updated_at) VALUES ('store_phone', ?, CURRENT_TIMESTAMP) 
       ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = CURRENT_TIMESTAMP`,
      [phone, phone]
    );
    
    await queryD1(
      `INSERT INTO settings (key, value, updated_at) VALUES ('support_email', ?, CURRENT_TIMESTAMP) 
       ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = CURRENT_TIMESTAMP`,
      [email, email]
    );

    revalidatePath('/admin/settings');
    return { success: true, message: 'Settings saved successfully' };
  } catch (error) {
    console.error("Failed to save settings:", error);
    return { success: false, error: 'Failed to save settings.' };
  }
}
