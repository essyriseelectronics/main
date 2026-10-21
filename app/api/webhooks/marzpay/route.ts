import { NextResponse } from "next/server";
import { queryD1 } from "@/lib/db/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Handle dashboard webhook wrapper ({ data: {...} }) or direct callback payloads
    const payload = body.data ? body.data : body;

    // We only care about completed collections
    if (payload.event_type === "collection.completed") {
      const transactionId = payload.transaction?.uuid;
      const ourReference = payload.transaction?.reference; // The UUID we generated
      const providerRef = payload.collection?.provider_transaction_id; // The MTN/Airtel ID
      const amount = payload.collection?.amount?.raw;
      const status = payload.transaction?.status;

      // Extract our custom metadata
      const orderIdObj = payload.metadata?.find((m: any) => m.orderId);
      const orderId = orderIdObj ? orderIdObj.orderId : null;

      if (status === "completed" && orderId) {
        // TODO: Update your D1 Database to mark the order as PAID
        /*
        await queryD1(
          `UPDATE orders SET payment_status = 'paid', provider_transaction_id = ? WHERE id = ?`,
          [providerRef, orderId]
        );
        */
        
        console.log(`Payment successful for Order: ${orderId}. MarzPay Ref: ${transactionId}`);
      }
    } else if (payload.event_type === "collection.failed") {
      // Handle failed payments
      console.warn(`Payment failed for reference: ${payload.transaction?.reference}`);
    }

    // Always return HTTP 200 quickly to acknowledge receipt
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
