"use server";

import { queryD1 } from "@/lib/db/client";
import { generateOrderNumber, normalizeUgandaPhone } from "@/lib/utils";
import { Product, Order } from "@/types";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// --- CREATE (Public Checkout) ---

export async function createOrder(formData: FormData) {
  const productId = formData.get("product_id") as string;
  const quantity = parseInt(formData.get("quantity") as string, 10);
  const name = formData.get("name") as string;
  const rawPhone = formData.get("phone") as string;
  const location = formData.get("location") as string;
  const address = formData.get("address") as string;
  const note = formData.get("note") as string;

  const phone = normalizeUgandaPhone(rawPhone);

  const products = await queryD1<Product>("SELECT * FROM products WHERE id = ? AND is_active = 1", [productId]);
  if (!products.length) throw new Error("Product unavailable or inactive.");
  
  const product = products[0];
  if (product.availability === "OUT OF STOCK") throw new Error("Product is currently out of stock.");

  const activePrice = product.discount_price || product.price;
  const total = activePrice * quantity;

  let contactId = `cont-${crypto.randomUUID()}`;
  const existingContacts = await queryD1<{id: string}>("SELECT id FROM contacts WHERE phone = ?", [phone]);
  
  if (existingContacts.length > 0) {
    contactId = existingContacts[0].id;
    await queryD1(
      "UPDATE contacts SET name = ?, location = ?, address = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", 
      [name, location, address, contactId]
    );
  } else {
    await queryD1(
      "INSERT INTO contacts (id, name, phone, location, address, source) VALUES (?, ?, ?, ?, ?, 'ORDER')", 
      [contactId, name, phone, location, address]
    );
  }

  const orderId = `ord-${crypto.randomUUID()}`;
  const orderNumber = generateOrderNumber(Math.floor(Math.random() * 999));

  await queryD1(
    `INSERT INTO orders (id, order_number, customer_id, customer_name, customer_phone, location, delivery_address, note, total_amount)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
     [orderId, orderNumber, contactId, name, phone, location, address, note, total]
  );

  const itemId = `item-${crypto.randomUUID()}`;
  await queryD1(
    `INSERT INTO order_items (id, order_id, product_id, product_name_snapshot, unit_price, quantity, subtotal)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
     [itemId, orderId, product.id, product.name, activePrice, quantity, total]
  );

  // Clear admin cache so the new order appears immediately
  revalidatePath("/admin/orders");
  revalidatePath("/admin");

  redirect(`/order/success/${orderNumber}`);
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
