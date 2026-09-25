"use server";

import { queryD1 } from "@/lib/db/client";
import { generateOrderNumber, normalizeUgandaPhone } from "@/lib/utils";
import { Product, Order } from "@/types";
import { revalidatePath } from "next/cache";

// Type definition for the payload coming from your CheckoutForm
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
  location: string;
  address: string;
  items: CartItem[];
  total: number;
};

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

    await queryD1(
      `INSERT INTO orders (id, order_number, customer_id, customer_name, customer_phone, location, delivery_address, total_amount)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
       [orderId, orderNumber, contactId, name, phone, payload.location, payload.address, total]
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

    return { success: true, orderNumber };
    
  } catch (error) {
    console.error("Failed to create order:", error);
    return { success: false, error: "An unexpected error occurred while placing your order." };
  }
}

// --- READ & UPDATE (Admin Dashboard) ---

export async function getOrders(): Promise<Order[]> {
  try {
    // Fetch all orders, newest first
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
