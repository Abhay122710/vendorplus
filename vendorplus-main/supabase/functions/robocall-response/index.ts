import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const orderId = url.searchParams.get("orderId") || "";

    // Twilio sends form-encoded data
    const formData = await req.formData();
    const digits = formData.get("Digits")?.toString() || "";

    console.log(`Order ${orderId} - Digit pressed: ${digits}`);

    let statusText = "pending";
    let sayMessage = "";

    switch (digits) {
      case "1":
        statusText = "Confirmed";
        sayMessage = "Order approved. Thank you!";
        break;
      case "2":
        statusText = "Cancelled";
        sayMessage = "Order cancelled. Thank you!";
        break;
      case "3":
        statusText = "Partial";
        sayMessage = "Order marked as partially available. Thank you!";
        break;
      default:
        sayMessage = "Invalid input. Order remains pending. Goodbye.";
        break;
    }

    // Save the response to the database using service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error } = await supabase.from("order_call_responses").insert({
      order_id: orderId,
      digit: digits,
      status: statusText,
    });

    if (error) {
      console.error("DB insert error:", error);
    } else {
      console.log(`Saved response for order ${orderId}: ${statusText}`);
    }

    // Return TwiML response
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice" language="en-IN">${sayMessage}</Say>
</Response>`;

    return new Response(twiml, {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error) {
    console.error("Robocall response error:", error);
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice" language="en-IN">An error occurred processing your response. Goodbye.</Say>
</Response>`;
    return new Response(twiml, {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  }
});
