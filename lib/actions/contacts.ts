"use server";

import { queryD1 } from "@/lib/db/client";
import { Contact } from "@/types";
import { normalizeUgandaPhone } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getContacts(): Promise<Contact[]> {
  try {
    const sql = `SELECT * FROM contacts ORDER BY created_at DESC`;
    return await queryD1<Contact>(sql);
  } catch (error) {
    console.error("Failed to fetch contacts", error);
    return [];
  }
}

export async function createContact(formData: FormData) {
  const name = formData.get("name") as string;
  const rawPhone = formData.get("phone") as string;
  const location = formData.get("location") as string;
  const address = formData.get("address") as string;
  const marketingOptIn = formData.get("marketing_opt_in") === "on" ? 1 : 0;

  const phone = normalizeUgandaPhone(rawPhone);
  const id = `cont-${crypto.randomUUID()}`;

  await queryD1(
    `INSERT INTO contacts (id, name, phone, location, address, source, marketing_opt_in)
     VALUES (?, ?, ?, ?, ?, 'MANUAL', ?)
     ON CONFLICT(phone) DO UPDATE SET 
     name = excluded.name, 
     location = excluded.location, 
     address = excluded.address,
     marketing_opt_in = excluded.marketing_opt_in,
     updated_at = CURRENT_TIMESTAMP`,
    [id, name, phone, location, address, marketingOptIn]
  );

  revalidatePath("/admin/contacts");
  redirect("/admin/contacts");
}

export async function importContactsCsv(formData: FormData) {
  const file = formData.get("csv_file") as File;
  if (!file) throw new Error("No file uploaded");

  const text = await file.text();
  const lines = text.split(/\r?\n/);
  
  let importedCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Skip header row if it contains column names
    if (i === 0 && (line.toLowerCase().includes("name") || line.toLowerCase().includes("phone"))) {
      continue;
    }

    const parts = line.split(",").map(p => p.trim().replace(/^["']|["']$/g, ""));
    if (parts.length < 2) continue;

    const name = parts[0] || "Valued Customer";
    const rawPhone = parts[1];
    const location = parts[2] || "Mbarara";
    const address = parts[3] || "";

    if (!rawPhone) continue;

    const phone = normalizeUgandaPhone(rawPhone);
    const id = `cont-${crypto.randomUUID()}`;

    try {
      await queryD1(
        `INSERT INTO contacts (id, name, phone, location, address, source, marketing_opt_in)
         VALUES (?, ?, ?, ?, ?, 'EXCEL_IMPORT', 1)
         ON CONFLICT(phone) DO UPDATE SET 
         name = excluded.name,
         location = COALESCE(excluded.location, contacts.location),
         updated_at = CURRENT_TIMESTAMP`,
        [id, name, phone, location, address]
      );
      importedCount++;
    } catch (err) {
      console.error(`Failed to import line: ${line}`, err);
    }
  }

  revalidatePath("/admin/contacts");
  return { success: true, count: importedCount };
}
