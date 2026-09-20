// Environment variables required in Vercel:
// MARZSMS_API_KEY
// MARZSMS_API_SECRET
// MARZSMS_API_BASE=https://sms.wearemarz.com/api/v1

const API_BASE = process.env.MARZSMS_API_BASE || "https://sms.wearemarz.com/api/v1";

function getAuthHeader() {
  const apiKey = process.env.MARZSMS_API_KEY;
  const apiSecret = process.env.MARZSMS_API_SECRET;
  
  if (!apiKey || !apiSecret) {
    throw new Error("MarzSMS credentials are missing from environment variables.");
  }
  
  return `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`;
}

export async function getSmsBalance() {
  try {
    const response = await fetch(`${API_BASE}/account/balance`, {
      method: "GET",
      headers: {
        "Authorization": getAuthHeader(),
        "Accept": "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.message || "Failed to fetch balance");

    return {
      balance: data.data.balance,
      costPerSms: data.data.cost_per_sms,
      currency: data.data.currency,
    };
  } catch (error) {
    console.error("MarzSMS Balance Error:", error);
    return null; // Return null so the UI can gracefully fallback if the API is down
  }
}

export async function sendSmsBulk(recipients: string[], message: string) {
  if (recipients.length === 0) throw new Error("No recipients provided.");

  // MarzSMS expects a comma-separated list for bulk sending
  const recipientString = recipients.join(",");

  const response = await fetch(`${API_BASE}/sms/send`, {
    method: "POST",
    headers: {
      "Authorization": getAuthHeader(),
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      recipient: recipientString,
      message: message,
    }),
  });

  const data = await response.json();
  
  if (!data.success) {
    console.error("MarzSMS Send Error:", data);
    throw new Error(data.message || "Failed to dispatch SMS campaign.");
  }

  // Returns data for both 200 (single) and 202 (bulk queued) statuses
  return data.data; 
}
