"use server";

import { queryD1 } from "@/lib/db/client";
import { getSmsBalance, sendSmsBulk } from "@/lib/sms/provider";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function fetchSmsDashboardData() {
  const balanceData = await getSmsBalance();
  const campaigns = await queryD1("SELECT * FROM sms_campaigns ORDER BY created_at DESC LIMIT 10");
  const contacts = await queryD1<{ count: number }>("SELECT count(*) as count FROM contacts WHERE is_active = 1 AND marketing_opt_in = 1");

  return {
    balance: balanceData,
    campaigns,
    marketableContactsCount: contacts[0]?.count || 0,
  };
}

export async function launchSmsCampaign(formData: FormData) {
  const campaignName = formData.get("campaign_name") as string;
  const messageTemplate = formData.get("message") as string;
  
  // 1. Fetch all eligible contacts
  const contacts = await queryD1<{ phone: string, name: string }>(
    "SELECT phone, name FROM contacts WHERE is_active = 1 AND marketing_opt_in = 1"
  );

  if (contacts.length === 0) {
    throw new Error("No eligible contacts found to send to.");
  }

  // 2. Personalization processing
  // Since MarzSMS bulk endpoint accepts one message for multiple numbers, 
  // true server-side personalization (unique messages per user) requires sending individually 
  // or batching in smaller chunks. For V1 general broadcasts, we will standardize the name if bulk is used.
  // If the template contains {name}, we map and send individually (which respects rate limits).
  
  let estimatedCost = 0;
  
  if (messageTemplate.includes("{name}")) {
    // Highly personalized: We must send individually to inject names
    // Note: For 2,000+ contacts, this should be moved to a Cloudflare Worker Queue.
    // For V1 MVP, we process synchronously.
    for (const contact of contacts) {
      const personalizedMessage = messageTemplate.replace(/{name}/g, contact.name.split(' ')[0]);
      await sendSmsBulk([contact.phone], personalizedMessage);
    }
    // Rough estimate: Assuming 1 unit per message for cost tracking
    estimatedCost = contacts.length * 30; // 30 UGX fallback
  } else {
    // General Broadcast: Use MarzSMS queued bulk endpoint for speed
    const phones = contacts.map(c => c.phone);
    const result = await sendSmsBulk(phones, messageTemplate);
    estimatedCost = result.estimated_cost || (contacts.length * 30);
  }

  // 3. Save Campaign History to D1
  const campaignId = `camp-${crypto.randomUUID()}`;
  await queryD1(
    `INSERT INTO sms_campaigns (id, name, type, message_template, recipient_count, estimated_cost, status) 
     VALUES (?, ?, ?, ?, ?, ?, 'COMPLETED')`,
    [campaignId, campaignName, 'GENERAL_BROADCAST', messageTemplate, contacts.length, estimatedCost]
  );

  revalidatePath("/admin/sms");
  redirect("/admin/sms");
}
