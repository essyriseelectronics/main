'use server';

import { queryD1 } from '@/lib/db/client';
import bcrypt from 'bcryptjs';
import { sendSmsBulk } from '@/lib/sms/provider';

// UTILITY: Format Phone strictly to 256...
function formatPhone(phone: string): string | null {
  const cleaned = phone.replace(/\D/g, ''); 
  if (cleaned.startsWith('256') && cleaned.length === 12) return cleaned;
  if (cleaned.startsWith('0') && cleaned.length === 10) return '256' + cleaned.substring(1);
  if (cleaned.length === 9) return '256' + cleaned;
  return null; 
}

// REQUEST RESET OTP
export async function requestPasswordResetOTP(phoneInput: string) {
  const phone = formatPhone(phoneInput);
  if (!phone) return { success: false, error: 'Invalid phone number format.' };

  // Check if user actually exists
  const existingUsers = await queryD1<{ id: string }>(
    `SELECT id FROM users WHERE phone = ? LIMIT 1`,
    [phone]
  );
  
  if (existingUsers.length === 0) {
    return { success: false, error: 'No account found with this phone number.' };
  }

  // Generate a 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 mins

  try {
    // Store in database
    await queryD1(
      `INSERT INTO otp_codes (phone, code, expires_at) VALUES (?, ?, ?)`,
      [phone, otpCode, expiresAt]
    );

    // Trigger the REAL SMS provider
    const message = `Your Essyrise Electronics password reset code is: ${otpCode}. It expires in 10 minutes.`;
    await sendSmsBulk([phone], message);

    return { success: true, message: 'OTP sent successfully', phone };
  } catch (error) {
    console.error('Failed to request reset OTP:', error);
    return { success: false, error: 'Failed to send SMS. Please try again.' };
  }
}

// VERIFY OTP & RESET PASSWORD
export async function resetPassword(phoneInput: string, code: string, newPasswordInput: string) {
  const phone = formatPhone(phoneInput);
  if (!phone) return { success: false, error: 'Invalid phone number.' };

  // Find the latest active OTP for this phone
  const activeOtps = await queryD1<{ id: number, code: string, expires_at: string, attempts: number }>(
    `SELECT * FROM otp_codes WHERE phone = ? ORDER BY id DESC LIMIT 1`,
    [phone]
  );

  if (activeOtps.length === 0) return { success: false, error: 'No reset request found.' };
  
  const otpRecord = activeOtps[0];

  // Validate attempts and expiration
  if (otpRecord.attempts >= 3) return { success: false, error: 'Too many failed attempts. Request a new OTP.' };
  if (new Date(otpRecord.expires_at) < new Date()) return { success: false, error: 'OTP has expired.' };
  
  // Check code match
  if (otpRecord.code !== code) {
    await queryD1(`UPDATE otp_codes SET attempts = attempts + 1 WHERE id = ?`, [otpRecord.id]);
    return { success: false, error: 'Invalid OTP code.' };
  }

  // Update Password
  try {
    const passwordHash = await bcrypt.hash(newPasswordInput, 10);

    await queryD1(
      `UPDATE users SET password_hash = ? WHERE phone = ?`,
      [passwordHash, phone]
    );

    // Clean up the used OTP
    await queryD1(`DELETE FROM otp_codes WHERE id = ?`, [otpRecord.id]);

    return { success: true };
  } catch (err) {
    console.error('Password Reset Error:', err);
    return { success: false, error: 'Failed to reset password.' };
  }
}
