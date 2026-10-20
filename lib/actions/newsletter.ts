"use server";

import { queryD1 } from "@/lib/db/client";

export async function subscribeEmail(formData: FormData) {
  const email = formData.get("email") as string;

  // 1. Basic email validation
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return { error: "Please provide a valid email address." };
  }

  const id = `sub-${crypto.randomUUID()}`;

  try {
    // 2. Save to your D1 Database (Your existing logic)
    await queryD1(
      `INSERT INTO subscribers (id, email) VALUES (?, ?) ON CONFLICT(email) DO NOTHING`, 
      [id, email]
    );

    // 3. Send to Brevo API
    const apiKey = process.env.BREVO_API_KEY;
    
    if (apiKey) {
      const response = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          email: email,
          updateEnabled: true, // Silently updates if they already exist in Brevo
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error("Brevo API Error:", data);
        // We log the error but don't throw, so the user still gets a success message 
        // since it was successfully saved to your local D1 database.
      }
    } else {
      console.warn("BREVO_API_KEY is missing. Saved to local DB only.");
    }

    return { success: true };
  } catch (error) {
    console.error("Newsletter error:", error);
    return { error: "Failed to subscribe. Please try again." };
  }
}
