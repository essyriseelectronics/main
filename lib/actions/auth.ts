'use server';

import { queryD1 } from '@/lib/db/client';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/auth/session';
import { sendSmsBulk } from '@/lib/sms/provider';

// ==========================================
// 1. UTILITY: Format Phone strictly to 256...
// ==========================================
function formatPhone(phone: string): string | null {
  const cleaned = phone.replace(/\D/g, ''); // Remove spaces, +, etc.
  if (cleaned.startsWith('256') && cleaned.length === 12) return cleaned;
  if (cleaned.startsWith('0') && cleaned.length === 10) return '256' + cleaned.substring(1);
  if (cleaned.length === 9) return '256' + cleaned;
  return null; // Invalid Ugandan format
}

// ==========================================
// 2. REQUEST REGISTRATION OTP
// ==========================================
export async function requestOTP(phoneInput: string) {
  const phone = formatPhone(phoneInput);
  if (!phone) return { success: false, error: 'Invalid phone number format.' };

  // Check if user already exists in auth table
  const existingUsers = await queryD1<{ id: string }>(
    `SELECT id FROM users WHERE phone = ? LIMIT 1`,
    [phone]
  );
  
  if (existingUsers.length > 0) {
    return { success: false, error: 'Phone number is already registered. Please log in.' };
  }

  // Generate a real 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 mins

  try {
    // Store in database
    await queryD1(
      `INSERT INTO otp_codes (phone, code, expires_at) VALUES (?, ?, ?)`,
      [phone, otpCode, expiresAt]
    );

    // Trigger the REAL SMS provider
    const message = `Your Essyrise Electronics verification code is: ${otpCode}. It expires in 10 minutes.`;
    
    // Note: Since your sendSmsBulk accepts an array of phones, we pass it in brackets
    await sendSmsBulk([phone], message);

    return { success: true, message: 'OTP sent successfully', phone };
  } catch (error) {
    console.error('Failed to request OTP:', error);
    return { success: false, error: 'Failed to send OTP SMS. Please try again.' };
  }
}

// ==========================================
// 3. VERIFY OTP & CREATE USER
// ==========================================
export async function verifyAndRegister(phoneInput: string, code: string, passwordInput: string, firstName: string, lastName: string) {
  const phone = formatPhone(phoneInput);
  if (!phone) return { success: false, error: 'Invalid phone number.' };

  // Find the latest active OTP for this phone
  const activeOtps = await queryD1<{ id: number, code: string, expires_at: string, attempts: number }>(
    `SELECT * FROM otp_codes WHERE phone = ? ORDER BY id DESC LIMIT 1`,
    [phone]
  );

  if (activeOtps.length === 0) return { success: false, error: 'No OTP requested.' };
  
  const otpRecord = activeOtps[0];

  // Validate attempts and expiration to prevent brute force
  if (otpRecord.attempts >= 3) return { success: false, error: 'Too many failed attempts. Request a new OTP.' };
  if (new Date(otpRecord.expires_at) < new Date()) return { success: false, error: 'OTP has expired.' };
  
  // Check code match
  if (otpRecord.code !== code) {
    await queryD1(`UPDATE otp_codes SET attempts = attempts + 1 WHERE id = ?`, [otpRecord.id]);
    return { success: false, error: 'Invalid OTP code.' };
  }

  // === SUCCESS! CREATE THE USER ===
  const userId = crypto.randomUUID();
  const contactId = crypto.randomUUID(); 
  const passwordHash = await bcrypt.hash(passwordInput, 10);
  const fullName = `${firstName} ${lastName}`.trim();

  try {
    // 1. Create Core User
    await queryD1(
      `INSERT INTO users (id, phone, password_hash, first_name, last_name) VALUES (?, ?, ?, ?, ?)`,
      [userId, phone, passwordHash, firstName, lastName]
    );

    // 2. Sync to Marketing Contacts (Check if they already checked out as a guest before)
    const existingContacts = await queryD1(`SELECT id FROM contacts WHERE phone = ? LIMIT 1`, [phone]);
    
    if (existingContacts.length === 0) {
      // Create new CRM entry using your table schema
      await queryD1(
        `INSERT INTO contacts (id, name, phone, source, marketing_opt_in, is_active) VALUES (?, ?, ?, 'REGISTER', 1, 1)`,
        [contactId, fullName, phone]
      );
    } else {
      // Update existing CRM entry
      await queryD1(
        `UPDATE contacts SET name = ?, source = 'REGISTER_UPDATE' WHERE phone = ?`,
        [fullName, phone]
      );
    }

    // 3. Clean up the used OTP
    await queryD1(`DELETE FROM otp_codes WHERE id = ?`, [otpRecord.id]);

    // 4. Create the Edge-compatible session (JWT)
    await createSession(userId, 'CUSTOMER', phone);

    return { success: true };
  } catch (err) {
    console.error('Registration Error:', err);
    return { success: false, error: 'Failed to create account.' };
  }
}

// ==========================================
// 4. LOGIN (Phone + Password)
// ==========================================
export async function login(phoneInput: string, passwordInput: string) {
  const phone = formatPhone(phoneInput);
  if (!phone) return { success: false, error: 'Invalid phone number format.' };

  const users = await queryD1<{ id: string, password_hash: string, role: string }>(
    `SELECT id, password_hash, role FROM users WHERE phone = ? LIMIT 1`,
    [phone]
  );

  if (users.length === 0) {
    return { success: false, error: 'Invalid phone number or password.' };
  }

  const user = users[0];
  const isPasswordValid = await bcrypt.compare(passwordInput, user.password_hash);

  if (!isPasswordValid) {
    return { success: false, error: 'Invalid phone number or password.' };
  }

  // Create active session
  await createSession(user.id, user.role, phone);

  return { success: true };
}
