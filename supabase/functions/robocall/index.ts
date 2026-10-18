const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, message, orderId, language } = await req.json();
    const callLang = language === "hi" ? "hi" : "en";
    const shopOwnerNumber = "+918476003000";
    const targetPhone = phone || shopOwnerNumber;

    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ success: false, error: "Message is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (message.length > 1000) {
      return new Response(
        JSON.stringify({ success: false, error: "Message is too long" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!orderId || typeof orderId !== "string") {
      return new Response(
        JSON.stringify({ success: false, error: "Order ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const phoneRegex = /^\+[1-9]\d{6,14}$/;
    if (!phoneRegex.test(targetPhone)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid phone number format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (targetPhone !== shopOwnerNumber) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid destination phone number" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioPhone = Deno.env.get("TWILIO_PHONE_NUMBER");

    if (!accountSid || !authToken || !twilioPhone) {
      console.error("Missing Twilio credentials");
      return new Response(
        JSON.stringify({ success: false, error: "Twilio not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const twimlLang = callLang === "hi" ? "hi-IN" : "en-IN";
    const voice = "alice";

    const gatherPrompt = callLang === "hi"
      ? "स्वीकार करने के लिए 1 दबाएं। रद्द करने के लिए 2 दबाएं। कुछ आइटम उपलब्ध नहीं हैं तो 3 दबाएं।"
      : "Press 1 to approve. Press 2 to cancel. Press 3 if some items are unavailable.";

    const noInputMsg = callLang === "hi"
      ? "कोई इनपुट नहीं मिला। अलविदा।"
      : "No input received. Goodbye.";

    const twiml = `<Response>
  <Say voice="${voice}" language="${twimlLang}">${escapeXml(message)}</Say>
  <Gather numDigits="1" action="${Deno.env.get("SUPABASE_URL")}/functions/v1/robocall-response?orderId=${encodeURIComponent(orderId)}" method="POST">
    <Say voice="${voice}" language="${twimlLang}">${escapeXml(gatherPrompt)}</Say>
  </Gather>
  <Say voice="${voice}" language="${twimlLang}">${escapeXml(noInputMsg)}</Say>
</Response>`;

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls.json`;

    const params = new URLSearchParams();
    params.append("To", targetPhone);
    params.append("From", twilioPhone);
    params.append("Twiml", twiml);

    const response = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        "Authorization": "Basic " + btoa(`${accountSid}:${authToken}`),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Twilio error:", result);
      return new Response(
        JSON.stringify({ success: false, error: result.message || "Twilio call failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Call initiated:", result.sid, "for order:", orderId);

    return new Response(
      JSON.stringify({ success: true, callSid: result.sid, status: result.status }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Robocall error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
