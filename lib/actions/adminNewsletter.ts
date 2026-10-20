"use server";

import { revalidatePath } from "next/cache";
import { queryD1 } from "@/lib/db/client";

export type Subscriber = {
  id: string;
  email: string;
  created_at?: string;
};

// 1. Get total subscribers & email list
// Added explicit return type: Promise<Subscriber[]>
export async function getSubscribers(): Promise<Subscriber[]> {
  try {
    const subscribers = await queryD1<Subscriber>(
      "SELECT id, email, created_at FROM subscribers ORDER BY created_at DESC"
    );
    return Array.isArray(subscribers) ? subscribers : (subscribers as any)?.results || [];
  } catch (error) {
    console.error("Failed to fetch subscribers:", error);
    return [];
  }
}

// 2. Add single subscriber (Cloudflare D1 + Brevo)
export async function addSingleSubscriber(email: string) {
  const cleanEmail = email.trim().toLowerCase();
  
  if (!cleanEmail || !/^\S+@\S+\.\S+$/.test(cleanEmail)) {
    return { error: "Please enter a valid email address." };
  }

  const id = `sub-${crypto.randomUUID()}`;

  try {
    // Write to Cloudflare D1
    await queryD1(
      `INSERT INTO subscribers (id, email) VALUES (?, ?) ON CONFLICT(email) DO NOTHING`,
      [id, cleanEmail]
    );

    // Write to Brevo API
    const apiKey = process.env.BREVO_API_KEY;
    if (apiKey) {
      await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          email: cleanEmail,
          updateEnabled: true,
        }),
      });
    }

    revalidatePath("/admin/newsletter");
    return { success: true };
  } catch (error) {
    console.error("Error adding subscriber:", error);
    return { error: "Failed to add subscriber." };
  }
}

// 3. Batch import subscribers from Excel/CSV (Cloudflare D1 + Brevo)
export async function batchImportSubscribers(emails: string[]) {
  const validEmails = Array.from(
    new Set(
      emails
        .map((e) => e.trim().toLowerCase())
        .filter((e) => /^\S+@\S+\.\S+$/.test(e))
    )
  );

  if (validEmails.length === 0) {
    return { error: "No valid email addresses found in the uploaded file." };
  }

  try {
    // Insert into Cloudflare D1 in bulk
    for (const email of validEmails) {
      const id = `sub-${crypto.randomUUID()}`;
      await queryD1(
        `INSERT INTO subscribers (id, email) VALUES (?, ?) ON CONFLICT(email) DO NOTHING`,
        [id, email]
      );
    }

    // Batch sync to Brevo
    const apiKey = process.env.BREVO_API_KEY;
    if (apiKey) {
      const brevoContacts = validEmails.map((email) => ({ email }));
      await fetch("https://api.brevo.com/v3/contacts/batch", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({ contacts: brevoContacts }),
      });
    }

    revalidatePath("/admin/newsletter");
    return { success: true, count: validEmails.length };
  } catch (error) {
    console.error("Batch import error:", error);
    return { error: "Failed to process batch import." };
  }
}

// 4. Send Broadcast email via Brevo API to all subscribers
export async function sendBroadcastEmail(subject: string, messageHtml: string) {
  if (!subject.trim() || !messageHtml.trim()) {
    return { error: "Subject and message content are required." };
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return { error: "BREVO_API_KEY environment variable is not configured." };
  }

  try {
    const subscribers = await getSubscribers();
    if (subscribers.length === 0) {
      return { error: "No subscribers found to send email to." };
    }

    // FIX: Explicitly typed `sub` as `Subscriber`
    const recipientList = subscribers.map((sub: Subscriber) => ({ email: sub.email }));

    // Send emails in batches using Brevo's Transactional / Batch Email Endpoint
    // Brevo accepts up to 99 recipients per call in 'to' array or bulk distribution
    const batchSize = 90;
    let sentCount = 0;

    for (let i = 0; i < recipientList.length; i += batchSize) {
      const batch = recipientList.slice(i, i + batchSize);

      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          sender: {
            name: "Essyrise Electronics",
            email: "info@essyriseelectronics.com", // Ensure this sender is verified in Brevo
          },
          to: batch,
          subject: subject,
          htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; rounded: 12px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #0076c0; margin: 0;">ESSY<span style="color: #dc2626;">RISE</span></h1>
                <p style="font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 2px;">Electronics</p>
              </div>
              <div style="color: #374151; font-size: 15px; line-height: 1.6;">
                ${messageHtml.replace(/\n/g, "<br/>")}
              </div>
              <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #9ca3af;">
                <p>You received this email because you subscribed to Essyrise Electronics updates.</p>
                <p>BNK Mall, Room BO23, Mbarara, Uganda</p>
              </div>
            </div>
          `,
        }),
      });

      if (response.ok) {
        sentCount += batch.length;
      } else {
        const errorData = await response.json();
        console.error("Brevo send error:", errorData);
      }
    }

    return { success: true, count: sentCount };
  } catch (error) {
    console.error("Broadcast failed:", error);
    return { error: "An error occurred while sending the broadcast." };
  }
}
