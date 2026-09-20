"use server";

import { queryD1 } from "@/lib/db/client";

export async function subscribeEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const id = `sub-${crypto.randomUUID()}`;

  try {
    await queryD1(
      `INSERT INTO subscribers (id, email) VALUES (?, ?) ON CONFLICT(email) DO NOTHING`, 
      [id, email]
    );
    return { success: true };
  } catch (error) {
    console.error("Newsletter error:", error);
    throw new Error("Failed to subscribe");
  }
}
