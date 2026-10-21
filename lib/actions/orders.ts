"use server";

import { queryD1 } from "@/lib/db/client";
import { generateOrderNumber, normalizeUgandaPhone } from "@/lib/utils";
import { Product, Order } from "@/types";
import { revalidatePath } from "next/cache";
import { initiateMarzPayCollection } from "./payments";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
};

export type CheckoutPayload = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  location: string;
  address: string;
  items: CartItem[];
  total: number;
  paymentMethod: "mobile_money" | "card" | "cash_on_delivery";
};

// --- HELPER: Send Email via Brevo ---
async function sendOrderConfirmationEmail(payload: CheckoutPayload, orderNumber: string, customerName: string) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("Missing BREVO_API_KEY. Skipping email notification.");
    return;
  }

  // Ensure image URLs are absolute for the email client
  const resolveImageUrl = (url: string | null) => {
    if (!url) return "https://essyriseelectronics.com/192.png"; // Fallback logo
    if (url.startsWith("http")) return url;
    return `https://essyriseelectronics.com${url}`;
  };

  const domain = "https://essyriseelectronics.com";
  
  const paymentText = payload.paymentMethod === "cash_on_delivery" 
    ? "Cash on Delivery (Please have exact amount ready)" 
    : "Online Payment (MTN/Airtel/Card)";

  const itemsHtml = payload.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; width: 60px;">
        <img src="${resolveImageUrl(item.image_url)}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: contain; border-radius: 8px; border: 1px solid #e5e7eb;" />
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #f3f4f6;">
        <a href="${domain}/products/${item.slug}" style="text-decoration: none; color: #111827; font-weight: bold; font-size: 14px;">
          ${item.name}
        </a>
        <div style="color: #6b7280; font-size: 12px; margin-top: 4px;">Qty: ${item.quantity}</div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; text-align: right; font-weight: bold; color: #0076c0; font-size: 14px;">
        UGX ${(item.price * item.quantity).toLocaleString()}
      </td>
    </tr>
  `).join("");

  const emailHtml = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #0076c0; padding: 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">ESSYRISE ELECTRONICS</h1>
      </div>
      
      <div style="padding: 32px 24px;">
        <h2 style="color: #111827; font-size: 20px; margin-top: 0;">Order Received!</h2>
        <p style="color: #4b5563; line-height: 1.6; font-size: 15px;">
          Hi ${customerName},<br/><br/>
          Thank you for shopping with us! We have received your order <strong>#${orderNumber}</strong>. 
          Our team is preparing it for delivery to <strong>${payload.location}</strong>.
        </p>

        <h3 style="color: #111827; font-size: 16px; margin-top: 32px; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
          ${itemsHtml}
        </table>

        <div style="margin-top: 24px; text-align: right; padding-top: 16px; border-top: 2px solid #f3f4f6;">
          <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">Payment Method: <strong style="color: #111827;">${paymentText}</strong></p>
          <p style="margin: 4px 0; font-size: 18px; color: #111827;">Total: <strong style="color: #0076c0;">UGX ${payload.total.toLocaleString()}</strong></p>
        </div>

        <div style="margin-top: 32px; background-color: #f9fafb; padding: 16px; border-radius: 8px;">
          <h4 style="margin-top: 0; color: #111827; font-size: 14px; margin-bottom: 8px;">Delivery Details</h4>
          <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.5;">
            <strong>Name:</strong> ${customerName}<br/>
            <strong>Phone:</strong> ${payload.phone}<br/>
            <strong>Address:</strong> ${payload.address}, ${payload.location}
          </p>
        </div>
      </div>
      
      <div style="background-color: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
        <p style="margin: 0;">Essyrise Electronics | BNK Mall, Room BO23, Mbarara, Uganda</p>
        <p style="margin: 4px 0 0 0;">Call us: 0784 269 950 | 0759 984 350</p>
      </div>
    </div>
  `;

  try {
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: {
          name: "Essyrise Electronics",
          email: "info@essyriseelectronics.com", // Your verified Brevo sender
        },
        to: [
          { email: payload.email, name: customerName } // Customer Email
        ],
        bcc: [
          { email: "essyriseelectronics@gmail.com", name: "Essyrise Admin" } // Admin Email gets a blind copy!
        ],
        subject: `Order Received - #${orderNumber} (Essyrise Electronics)`,
        htmlContent: emailHtml,
      }),
    });
  } catch (error) {
    console.error("Failed to send order email via Brevo:", error);
  }
}


// --- CREATE (Public Checkout) ---

export async function createOrder(payload: CheckoutPayload) {
  try {
    const name = `${payload.firstName} ${payload.lastName}`.trim();
    const phone = normalizeUgandaPhone(payload.phone);
    const total = payload.total;

    // 1. CRM / Contact Management (Upsert)
    let contactId = `cont-${crypto.randomUUID()}`;
    const existingContacts = await queryD1<{id: string}>("SELECT id FROM contacts WHERE phone = ?", [phone]);

    if (existingContacts.length > 0) {
      contactId = existingContacts[0].id;
      await queryD1(
        "UPDATE contacts SET name = ?, location = ?, address = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", 
        [name, payload.location, payload.address, contactId]
      );
    } else {
      await queryD1(
        "INSERT INTO contacts (id, name, phone, location, address, source) VALUES (?, ?, ?, ?, ?, 'ORDER')", 
        [contactId, name, phone, payload.location, payload.address]
      );
    }

    // 2. Create the main Order record
    const orderId = `ord-${crypto.randomUUID()}`;
    const orderNumber = generateOrderNumber(Math.floor(Math.random() * 999));
    
    const initialStatus = payload.paymentMethod === "cash_on_delivery" ? "processing" : "pending_payment";

    await queryD1(
      `INSERT INTO orders (id, order_number, customer_id, customer_name, customer_phone, location, delivery_address, total_amount, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
       [orderId, orderNumber, contactId, name, phone, payload.location, payload.address, total, initialStatus]
    );

    // 3. Loop through cart items and insert them into order_items
    for (const item of payload.items) {
      const itemId = `item-${crypto.randomUUID()}`;
      const subtotal = item.price * item.quantity;

      await queryD1(
        `INSERT INTO order_items (id, order_id, product_id, product_name_snapshot, unit_price, quantity, subtotal)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
         [itemId, orderId, item.id, item.name, item.price, item.quantity, subtotal]
      );
    }

    // Clear admin cache so the new order appears immediately
    revalidatePath("/admin/orders");
    revalidatePath("/admin");

    // 4. Send Confirmation Email asynchronously (don't wait/block the UI)
    if (payload.email) {
      sendOrderConfirmationEmail(payload, orderNumber, name);
    }

    // 5. Handle Online Payments via MarzPay
    if (payload.paymentMethod !== "cash_on_delivery") {
      const paymentResponse = await initiateMarzPayCollection({
        amount: total,
        phoneNumber: phone,
        method: payload.paymentMethod,
        orderId: orderId, 
        customerEmail: payload.email || "info@essyriseelectronics.com"
      });

      if (paymentResponse.error) {
        return { success: false, error: paymentResponse.error };
      }

      return { 
        success: true, 
        orderNumber, 
        paymentMethod: payload.paymentMethod,
        redirectUrl: paymentResponse.redirectUrl, 
        message: paymentResponse.message 
      };
    }

    // If Cash on Delivery, just return success
    return { success: true, orderNumber, paymentMethod: "cash_on_delivery" };
    
  } catch (error) {
    console.error("Failed to create order:", error);
    return { success: false, error: "An unexpected error occurred while placing your order." };
  }
}

// --- READ & UPDATE (Admin Dashboard) ---

export async function getOrders(): Promise<Order[]> {
  try {
    const sql = `SELECT * FROM orders ORDER BY created_at DESC`;
    return await queryD1<Order>(sql);
  } catch (error) {
    console.error("Failed to fetch orders", error);
    return [];
  }
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    await queryD1(
      `UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [newStatus, orderId]
    );
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Failed to update order status", error);
    throw new Error("Could not update status.");
  }
}
