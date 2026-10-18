import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkTwilioStatus, dispatchRobocall, SHOP_OWNER_NUMBER } from "@/lib/telephony";

describe("telephony service", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("exports a valid SHOP_OWNER_NUMBER", () => {
    expect(SHOP_OWNER_NUMBER).toBeDefined();
    expect(SHOP_OWNER_NUMBER).toMatch(/^\+[1-9]\d{6,14}$/);
  });

  it("fetches Twilio status from /api/twilio-status if available", async () => {
    const mockStatus = {
      connected: true,
      accountSid: "AC_MOCK_ACCOUNT_SID_FOR_TESTING",
      friendlyName: "My First Twilio Account",
      type: "Trial",
      status: "active",
      phoneNumbers: [],
      hasPhoneNumber: false,
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockStatus,
    } as unknown as Response);

    const result = await checkTwilioStatus();
    expect(result.connected).toBe(true);
    expect(result.accountSid).toBe("AC_MOCK_ACCOUNT_SID_FOR_TESTING");
    expect(result.hasPhoneNumber).toBe(false);
  });

  it("handles dispatchRobocall with dev server proxy response", async () => {
    const mockResponse = {
      success: false,
      reason: "NO_TWILIO_NUMBER",
      simulated: true,
      message: "Twilio account connected! But no Twilio phone number is provisioned yet.",
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as unknown as Response);

    const result = await dispatchRobocall({
      phone: SHOP_OWNER_NUMBER,
      message: "Test notification",
      orderId: "o_12345",
      language: "en",
    });

    expect(result.reason).toBe("NO_TWILIO_NUMBER");
    expect(result.simulated).toBe(true);
  });

  it("falls back gracefully when fetch throws", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network failed"));

    const result = await dispatchRobocall({
      phone: SHOP_OWNER_NUMBER,
      message: "Test message",
      orderId: "o_test",
      language: "en",
    });

    expect(result.simulated).toBe(true);
    expect(result.reason).toBe("OFFLINE");
  });
});
