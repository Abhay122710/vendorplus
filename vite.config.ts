import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

function escapeXml(text: string): string {
  return (text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const accountSid = env.TWILIO_ACCOUNT_SID || env.VITE_TWILIO_ACCOUNT_SID || "";
  const authToken = env.TWILIO_AUTH_TOKEN || env.VITE_TWILIO_AUTH_TOKEN || "";
  const configuredPhone = env.TWILIO_PHONE_NUMBER || env.VITE_TWILIO_PHONE_NUMBER || "";

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [
      react(),
      {
        name: "twilio-robocall-dev-server",
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url?.startsWith("/api/twilio-status") && req.method === "GET") {
              try {
                const authHeader = "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64");
                const [accRes, numRes, outRes] = await Promise.all([
                  fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}.json`, {
                    headers: { Authorization: authHeader }
                  }),
                  fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/IncomingPhoneNumbers.json`, {
                    headers: { Authorization: authHeader }
                  }),
                  fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/OutgoingCallerIds.json`, {
                    headers: { Authorization: authHeader }
                  }),
                ]);

                const accountData = accRes.ok ? await accRes.json() : null;
                const numbersData = numRes.ok ? await numRes.json() : null;
                const callerIdsData = outRes.ok ? await outRes.json() : null;

                const incomingNumbers = Array.isArray(numbersData?.incoming_phone_numbers)
                  ? numbersData.incoming_phone_numbers.map((n: { phone_number: string }) => n.phone_number)
                  : [];
                const verifiedCallerIds = Array.isArray(callerIdsData?.outgoing_caller_ids)
                  ? callerIdsData.outgoing_caller_ids.map((c: { phone_number: string }) => c.phone_number)
                  : [];

                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({
                  connected: accRes.ok,
                  accountSid,
                  friendlyName: accountData?.friendly_name,
                  type: accountData?.type,
                  status: accountData?.status,
                  phoneNumbers: incomingNumbers,
                  verifiedCallerIds,
                  hasPhoneNumber: incomingNumbers.length > 0 || Boolean(configuredPhone),
                  activePhone: configuredPhone || incomingNumbers[0] || null,
                }));
                return;
              } catch (err: unknown) {
                res.setHeader("Content-Type", "application/json");
                res.statusCode = 500;
                res.end(JSON.stringify({ connected: false, error: err instanceof Error ? err.message : "Twilio status check failed" }));
                return;
              }
            }

            if (req.url?.startsWith("/api/robocall") && req.method === "POST") {
              let bodyStr = "";
              req.on("data", (chunk: Buffer) => { bodyStr += chunk.toString(); });
              req.on("end", async () => {
                try {
                  const body = JSON.parse(bodyStr || "{}");
                  const { phone, message, language } = body;
                  const shopOwnerNumber = env.VITE_SHOP_OWNER_PHONE || "+918476003000";
                  const targetPhone = phone || shopOwnerNumber;

                  const authHeader = "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64");

                  let senderPhone = configuredPhone;
                  if (!senderPhone) {
                    try {
                      const numRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/IncomingPhoneNumbers.json`, {
                        headers: { Authorization: authHeader }
                      });
                      if (numRes.ok) {
                        const numData = await numRes.json();
                        if (numData?.incoming_phone_numbers?.length > 0) {
                          senderPhone = numData.incoming_phone_numbers[0].phone_number;
                        }
                      }
                    } catch {
                      // ignore lookup failure
                    }
                  }

                  if (!senderPhone) {
                    res.setHeader("Content-Type", "application/json");
                    res.statusCode = 200;
                    res.end(JSON.stringify({
                      success: false,
                      reason: "NO_TWILIO_NUMBER",
                      simulated: true,
                      message: "Twilio account connected! But no Twilio phone number is provisioned yet. Claim a free phone number in your Twilio Console to place live calls.",
                    }));
                    return;
                  }

                  const callLang = language === "hi" ? "hi-IN" : "en-IN";
                  const voice = "alice";
                  const gatherPrompt = language === "hi"
                    ? "स्वीकार करने के लिए 1 दबाएं। रद्द करने के लिए 2 दबाएं।"
                    : "Press 1 to approve. Press 2 to cancel.";

                  const twiml = `<Response>
                    <Say voice="${voice}" language="${callLang}">${escapeXml(message)}</Say>
                    <Gather numDigits="1">
                      <Say voice="${voice}" language="${callLang}">${escapeXml(gatherPrompt)}</Say>
                    </Gather>
                  </Response>`;

                  const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls.json`;
                  const params = new URLSearchParams();
                  params.append("To", targetPhone);
                  params.append("From", senderPhone);
                  params.append("Twiml", twiml);

                  const twilioRes = await fetch(twilioUrl, {
                    method: "POST",
                    headers: {
                      Authorization: authHeader,
                      "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: params.toString(),
                  });

                  const twilioJson = await twilioRes.json();

                  if (!twilioRes.ok) {
                    res.setHeader("Content-Type", "application/json");
                    res.statusCode = 200;
                    res.end(JSON.stringify({
                      success: false,
                      reason: "TWILIO_ERROR",
                      error: twilioJson.message || "Twilio call dispatch failed",
                      code: twilioJson.code,
                      simulated: true,
                    }));
                    return;
                  }

                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify({
                    success: true,
                    callSid: twilioJson.sid,
                    status: twilioJson.status,
                    from: senderPhone,
                    to: targetPhone,
                  }));
                } catch (err: unknown) {
                  res.setHeader("Content-Type", "application/json");
                  res.statusCode = 500;
                  res.end(JSON.stringify({ success: false, error: err instanceof Error ? err.message : "Internal error" }));
                }
              });
              return;
            }

            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
