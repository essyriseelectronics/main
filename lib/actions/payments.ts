"use server";

import { fetch as undiciFetch, ProxyAgent } from "undici";

export async function initiateMarzPayCollection(data: {
  amount: number;
  phoneNumber?: string; // Required for mobile money, omit for card
  method: "mobile_money" | "card";
  orderId: string;
  customerEmail: string;
}) {
  const apiKey = process.env.MARZPAY_API_KEY;
  const apiSecret = process.env.MARZPAY_API_SECRET;
  const baseUrl = process.env.MARZPAY_API_BASE || "https://wallet.wearemarz.com/api/v1";
  const callbackUrl = process.env.MARZPAY_CALLBACK_URL;
  const fixieUrl = process.env.FIXIE_URL;

  if (!apiKey || !apiSecret) {
    return { error: "Payment gateway is not configured properly." };
  }

  // Create the Base64 Auth string required by MarzPay
  const authHeader = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
  
  // Every API collection must use a new UUID v4 reference
  const reference = crypto.randomUUID();

  // Ensure phone number is in E.164 format for Uganda (+256) if provided
  let formattedPhone = data.phoneNumber;
  if (formattedPhone && formattedPhone.startsWith("0")) {
    formattedPhone = `+256${formattedPhone.substring(1)}`;
  } else if (formattedPhone && !formattedPhone.startsWith("+")) {
    formattedPhone = `+${formattedPhone}`;
  }

  // Prepare the payload based on the payment method
  const payload: Record<string, any> = {
    amount: data.amount,
    reference: reference,
    country: "UG", // Hardcoded for Uganda
    description: `Essyrise Order #${data.orderId}`,
    callback_url: callbackUrl,
    metadata: [
      { orderId: data.orderId },
      { customerEmail: data.customerEmail, isPII: true }
    ]
  };

  if (data.method === "card") {
    payload.method = "card";
  } else {
    if (!formattedPhone) return { error: "Phone number is required for mobile money." };
    payload.phone_number = formattedPhone;
  }

  const headers = {
    "Authorization": `Basic ${authHeader}`,
    "Content-Type": "application/json",
    "Accept": "application/json",
  };

  try {
    let response: Response;

    // Route through Fixie static IP if environment variable is present
    if (fixieUrl) {
      const dispatcher = new ProxyAgent(fixieUrl);
      response = (await undiciFetch(`${baseUrl}/collect-money`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        dispatcher,
      })) as unknown as Response;
    } else {
      response = await fetch(`${baseUrl}/collect-money`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
    }

    const result = (await response.json()) as any;

    if (!response.ok) {
      console.error("MarzPay API Error:", result);
      return { error: result.message || "Payment initiation failed." };
    }

    // For card payments, MarzPay returns a redirect_url
    if (data.method === "card" && result.data?.redirect_url) {
      return { success: true, redirectUrl: result.data.redirect_url, reference };
    }

    // For mobile money, the customer receives a USSD prompt on their phone
    return { 
      success: true, 
      message: "Check your phone to enter your PIN and complete the payment.",
      reference 
    };

  } catch (error) {
    console.error("MarzPay Request Failed:", error);
    return { error: "An unexpected error occurred connecting to the payment gateway." };
  }
}
