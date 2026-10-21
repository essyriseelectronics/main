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

// --- HELPER: Send Order Received Email via Brevo ---
async function sendOrderConfirmationEmail(payload: CheckoutPayload, orderNumber: string, customerName: string) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return;

  const resolveImageUrl = (url: string | null) => {
    if (!url) return "https://essyriseelectronics.com/192.png";
    if (url.startsWith("http")) return url;
    return `https://essyriseelectronics.com${url}`;
  };

  const domain = "https://essyriseelectronics.com";
  const paymentText = payload.paymentMethod === "cash_on_delivery" ? "Cash on Delivery" : "Online Payment";

  const itemsHtml = payload.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; width: 60px;">
        <img src="${resolveImageUrl(item.image_url)}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: contain; border-radius: 8px;" />
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #f3f4f6;">
        <a href="${domain}/products/${item.slug}" style="text-decoration: none; color: #111827; font-weight: bold; font-size: 14px;">${item.name}</a>
        <div style="color: #6b7280; font-size: 12px; margin-top: 4px;">Qty: ${item.quantity}</div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; text-align: right; font-weight: bold; color: #0076c0; font-size: 14px;">
        UGX ${(item.price * item.quantity).toLocaleString()}
      </td>
    </tr>
  `).join("");

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #0076c0; padding: 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">ESSYRISE ELECTRONICS</h1>
      </div>
      <div style="padding: 32px 24px;">
        <h2 style="color: #111827; margin-top: 0;">Order Received!</h2>
        <p style="color: #4b5563;">Hi ${customerName},<br/><br/>We have received your order <strong>#${orderNumber}</strong>.</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">${itemsHtml}</table>
        <div style="margin-top: 24px; text-align: right; padding-top: 16px; border-top: 2px solid #f3f4f6;">
          <p style="margin: 4px 0; color: #6b7280;">Payment Method: <strong>${paymentText}</strong></p>
          <p style="margin: 4px 0; font-size: 18px;">Total: <strong style="color: #0076c0;">UGX ${payload.total.toLocaleString()}</strong></p>
        </div>
      </div>
    </div>
  `;

  try {
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json", "api-key": apiKey },
      body: JSON.stringify({
        sender: { name: "Essyrise Electronics", email: "info@essyriseelectronics.com" },
        to: [{ email: payload.email, name: customerName }],
        bcc: [{ email: "essyriseelectronics@gmail.com", name: "Essyrise Admin" }],
        subject: `Order Received - #${orderNumber}`,
        htmlContent: emailHtml,
      }),
    });
  } catch (error) { console.error("Email failed", error); }
}

// --- HELPER: Send Status Update Email via Brevo ---
async function sendStatusUpdateEmail(order: any, newStatus: string) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey || !order.customer_email) return;

  let statusMessage = "";
  let subject = "";

  switch (newStatus) {
    case "PROCESSING":
      subject = `Your order #${order.order_number} is being processed`;
      statusMessage = "Great news! We are currently processing your order and getting it ready for dispatch.";
      break;
    case "READY_FOR_DELIVERY":
      subject = `Your order #${order.order_number} is out for delivery!`;
      statusMessage = "Your order has left our store and is on its way to you. Our delivery team will contact you shortly.";
      break;
    case "DELIVERED":
      subject = `Your order #${order.order_number} has been delivered`;
      statusMessage = "Your order has been successfully delivered. Thank you for shopping with Essyrise Electronics!";
      break;
    case "CANCELLED":
      subject = `Order Update - #${order.order_number}`;
      statusMessage = "Unfortunately, your order has been cancelled. If you believe this is a mistake, please contact our support team.";
      break;
    default:
      return; // Don't send emails for other statuses
  }

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #0076c0; padding: 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px;">Order Update</h1>
      </div>
      <div style="padding: 32px 24px; text-align: center;">
        <h2 style="color: #111827;">Hi ${order.customer_name},</h2>
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-top: 16px;">${statusMessage}</p>
        <p style="color: #9ca3af; font-size: 13px; margin-top: 32px;">Order Number: #${order.order_number}</p>
      </div>
    </div>
  `;

  try {
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json", "api-key": apiKey },
      body: JSON.stringify({
        sender: { name: "Essyrise Electronics", email: "info@essyriseelectronics.com" },
        to: [{ email: order.customer_email, name: order.customer_name }],
        subject: subject,
        htmlContent: emailHtml,
      }),
    });
  } catch (error) { console.error("Status email failed", error); }
}

// --- CREATE (Public Checkout) ---
export async function createOrder(payload: CheckoutPayload) {
  try {
    const name = `${payload.firstName} ${payload.lastName}`.trim();
    const phone = normalizeUgandaPhone(payload.phone);
    
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

    const orderId = `ord-${crypto.randomUUID()}`;
    const orderNumber = generateOrderNumber(Math.floor(Math.random() * 999));
    const initialStatus = payload.paymentMethod === "cash_on_delivery" ? "PROCESSING" : "NEW";

    // UPDATED: Now saving customer_email and payment_method to DB
    await queryD1(
      `INSERT INTO orders (id, order_number, customer_id, customer_name, customer_phone, customer_email, location, delivery_address, total_amount, status, payment_method)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
       [orderId, orderNumber, contactId, name, phone, payload.email, payload.location, payload.address, payload.total, initialStatus, payload.paymentMethod]
    );

    for (const item of payload.items) {
      const itemId = `item-${crypto.randomUUID()}`;
      await queryD1(
        `INSERT INTO order_items (id, order_id, product_id, product_name_snapshot, unit_price, quantity, subtotal)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
         [itemId, orderId, item.id, item.name, item.price, item.quantity, (item.price * item.quantity)]
      );
    }

    revalidatePath("/admin/orders");
    revalidatePath("/admin");

    if (payload.email) sendOrderConfirmationEmail(payload, orderNumber, name);

    if (payload.paymentMethod !== "cash_on_delivery") {
      const paymentResponse = await initiateMarzPayCollection({
        amount: payload.total,
        phoneNumber: phone,
        method: payload.paymentMethod,
        orderId: orderId, 
        customerEmail: payload.email || "info@essyriseelectronics.com"
      });

      if (paymentResponse.error) return { success: false, error: paymentResponse.error };
      return { success: true, orderNumber, paymentMethod: payload.paymentMethod, redirectUrl: paymentResponse.redirectUrl, message: paymentResponse.message };
    }

    return { success: true, orderNumber, paymentMethod: "cash_on_delivery" };
  } catch (error) {
    console.error("Failed to create order:", error);
    return { success: false, error: "An unexpected error occurred while placing your order." };
  }
}

// --- READ & UPDATE (Admin Dashboard) ---
export async function getOrders(): Promise<Order[]> {
  try {
    return await queryD1<Order>(`SELECT * FROM orders ORDER BY created_at DESC`);
  } catch (error) {
    console.error("Failed to fetch orders", error);
    return [];
  }
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    // 1. Fetch the order to get the email BEFORE updating
    const orders = await queryD1<any>("SELECT * FROM orders WHERE id = ?", [orderId]);
    const order = Array.isArray(orders) ? orders[0] : (orders as any)?.results?.[0];

    // 2. Update the status in the database
    await queryD1(
      `UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [newStatus, orderId]
    );

    // 3. Trigger the email to the customer
    if (order && order.customer_email) {
      await sendStatusUpdateEmail(order, newStatus);
    }

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Failed to update order status", error);
    throw new Error("Could not update status.");
  }
}
