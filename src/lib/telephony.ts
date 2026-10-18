import { supabase } from "@/integrations/supabase/client";

export interface TwilioStatus {
  connected: boolean;
  accountSid?: string;
  friendlyName?: string;
  type?: string;
  status?: string;
  phoneNumbers?: string[];
  verifiedCallerIds?: string[];
  hasPhoneNumber?: boolean;
  activePhone?: string | null;
  error?: string;
}

export interface RobocallPayload {
  phone: string;
  message: string;
  orderId: string;
  language: string;
}

export interface RobocallResult {
  success: boolean;
  callSid?: string;
  from?: string;
  to?: string;
  status?: string;
  simulated?: boolean;
  reason?: "NO_TWILIO_NUMBER" | "TWILIO_ERROR" | "NETWORK_ERROR" | "SUPABASE_UNAVAILABLE" | "OFFLINE";
  message?: string;
  error?: string;
}

export const SHOP_OWNER_NUMBER = import.meta.env.VITE_SHOP_OWNER_PHONE || "+918476003000";

/**
 * Check Twilio account connection and provisioned phone status
 */
export async function checkTwilioStatus(): Promise<TwilioStatus> {
  try {
    const res = await fetch("/api/twilio-status");
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Vite middleware may not be present in static builds
  }

  const sid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
  return {
    connected: Boolean(sid),
    accountSid: sid,
    hasPhoneNumber: Boolean(import.meta.env.VITE_TWILIO_PHONE_NUMBER),
    activePhone: import.meta.env.VITE_TWILIO_PHONE_NUMBER || null,
  };
}

/**
 * Dispatch robocall to shop owner via local Vite proxy or Supabase Edge Function
 */
export async function dispatchRobocall(payload: RobocallPayload): Promise<RobocallResult> {
  // 1. Try local dev server Twilio proxy first
  try {
    const devRes = await fetch("/api/robocall", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (devRes.ok) {
      const data: RobocallResult = await devRes.json();
      return data;
    }
  } catch {
    // Continue to Supabase edge function fallback
  }

  // 2. Try remote Supabase edge function
  try {
    const { data, error } = await supabase.functions.invoke("robocall", {
      body: payload,
    });

    if (!error && data?.success) {
      return {
        success: true,
        callSid: data.callSid,
        status: data.status,
      };
    }

    if (data && !data.success) {
      return {
        success: false,
        error: data.error || "Robocall service rejected call",
        reason: "TWILIO_ERROR",
        simulated: true,
      };
    }
  } catch (err) {
    console.warn("Supabase robocall edge function unavailable:", err);
  }

  // 3. Resilient fallback for offline/trial environment
  return {
    success: false,
    reason: "OFFLINE",
    simulated: true,
    message: "Twilio credentials linked. Running in simulated IVR demo mode.",
  };
}
