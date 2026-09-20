"use server";

import { queryD1 } from "@/lib/db/client";
import { generateOrderNumber, normalizeUgandaPhone } from "@/lib/utils";
import { Product } from "@/types";
import { redirect } from "next/navigation";

export async function createOrder(formData: FormData) {
  const productId = formData.get("product_id") as string;
  const quantity = parseInt(formData.get("quantity") as string, 10);
  const name = formData.get("name") as string;
  const rawPhone = formData.get("phone") as string;
  const location = formData.get("location") as string;
  const address = formData.get("address") as string;
  const note = formData.get("note") as string;

  const phone = normalizeUgandaPhone(rawPhone);

  // 1. Fetch live product to verify price (Security Rule: Never trust client price)
  const products = await queryD1<Product>("SELECT * FROM products WHERE id = ? AND is_active = 1", [productId]);
  if (!products.length) throw new Error("Product unavailable or inactive.");
  
  const product = products[0];
  if (product.availability === "OUT OF STOCK") throw new Error("Product is currently out of stock.");

  const activePrice = product.discount_price || product.price;
  const total = activePrice * quantity;

  // 2. Handle Contact (Upsert logic to prevent duplicate contacts)
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

  // 3. Create Order Record
  const orderId = `ord-${crypto.randomUUID()}`;
  const orderNumber = generateOrderNumber(Math.floor(Math.random() * 999)); // Simple sequence for V1

  await queryD1(
    `INSERT INTO orders (id, order_number, customer_id, customer_name, customer_phone, location, delivery_address, note, total_amount)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
     [orderId, orderNumber, contactId, name, phone, location, address, note, total]
  );

  // 4. Create Order Item Record
  const itemId = `item-${crypto.randomUUID()}`;
  await queryD1(
    `INSERT INTO order_items (id, order_id, product_id, product_name_snapshot, unit_price, quantity, subtotal)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
     [itemId, orderId, product.id, product.name, activePrice, quantity, total]
  );

  // Redirect client to success page
  redirect(`/order/success/${orderNumber}`);
}
