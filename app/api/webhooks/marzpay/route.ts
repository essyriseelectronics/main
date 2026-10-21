import { NextResponse } from "next/server";
import { queryD1 } from "@/lib/db/client";
import { sendOrderReceiptEmail, sendStatusUpdateEmail } from "@/lib/actions/orders";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Handle dashboard webhook wrapper ({ data: {...} }) or direct callback payloads
    const payload = body.data ? body.data : body;

    // Extract our custom order ID from the metadata
    const orderIdObj = payload.metadata?.find((m: any) => m.orderId);
    const orderId = orderIdObj ? orderIdObj.orderId : null;

    if (!orderId) {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // 1. PAYMENT SUCCESSFUL
    if (payload.event_type === "collection.completed") {
      // Mark as CONFIRMED in Database
      await queryD1(
        `UPDATE orders SET status = 'CONFIRMED', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [orderId]
      );

      // Trigger the rich HTML receipt email to customer and admin
      await sendOrderReceiptEmail(orderId);

    // 2. PAYMENT FAILED OR TIMED OUT
    } else if (payload.event_type === "collection.failed" || payload.event_type === "collection.cancelled") {
      // Mark as CANCELLED in Database
      await queryD1(
        `UPDATE orders SET status = 'CANCELLED', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [orderId]
      );

      // Fetch the order to get the email address and trigger the Failure email
      const orders = await queryD1<any>("SELECT * FROM orders WHERE id = ?", [orderId]);
      const order = Array.isArray(orders) ? orders[0] : (orders as any)?.results?.[0];
      
      if (order) {
        await sendStatusUpdateEmail(order, "PAYMENT_FAILED");
      }
    }

    // Always return HTTP 200 quickly to acknowledge receipt to MarzPay
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
