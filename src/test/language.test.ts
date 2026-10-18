import { describe, it, expect } from "vitest";
import { translations, translateOrderStatus, translateComplaintStatus, translateCallStatus } from "@/lib/language-context";
import { trd } from "@/lib/demo-translations";

describe("Language & Translation Context", () => {
  const trEn = (key: string) => translations[key]?.en || key;
  const trHi = (key: string) => translations[key]?.hi || key;

  it("provides comprehensive English translations for core keys", () => {
    expect(translations["dash.dashboard"]?.en).toBe("Dashboard");
    expect(translations["cart.title"]?.en).toBe("Shopping Cart");
    expect(translations["marketplace.title"]?.en).toBe("Local Shops");
    expect(translations["login.welcome"]?.en).toBe("Welcome Back");
  });

  it("provides corresponding Hindi translations in Devanagari script", () => {
    expect(translations["dash.dashboard"]?.hi).toBe("डैशबोर्ड");
    expect(translations["cart.title"]?.hi).toBe("शॉपिंग कार्ट");
    expect(translations["marketplace.title"]?.hi).toBe("स्थानीय दुकानें");
    expect(translations["login.welcome"]?.hi).toBe("वापसी पर स्वागत है");
  });

  it("translates order statuses correctly in English and Hindi", () => {
    expect(translateOrderStatus("Pending", trEn)).toBe("Pending");
    expect(translateOrderStatus("Pending", trHi)).toBe("लंबित");

    expect(translateOrderStatus("Confirmed", trEn)).toBe("Confirmed");
    expect(translateOrderStatus("Confirmed", trHi)).toBe("स्वीकृत");

    expect(translateOrderStatus("Completed", trEn)).toBe("Completed");
    expect(translateOrderStatus("Completed", trHi)).toBe("पूरा");

    expect(translateOrderStatus("Cancelled", trEn)).toBe("Cancelled");
    expect(translateOrderStatus("Cancelled", trHi)).toBe("रद्द");
  });

  it("translates complaint and call statuses accurately", () => {
    expect(translateComplaintStatus("open", trEn)).toBe("Open");
    expect(translateComplaintStatus("open", trHi)).toBe("खुला");
    expect(translateComplaintStatus("resolved", trHi)).toBe("सुलझा");

    expect(translateCallStatus("initiated", trEn)).toBe("Initiated");
    expect(translateCallStatus("initiated", trHi)).toBe("शुरू");
  });

  it("translates dynamic demo data using trd helper", () => {
    expect(trd("Big Bite Confectionary", "hi")).toBe("बिग बाइट कन्फेक्शनरी");
    expect(trd("Big Bite Confectionary", "en")).toBe("Big Bite Confectionary");
    expect(trd("Kandoli", "hi")).toBe("कंडोली");
    expect(trd("Kandoli", "en")).toBe("Kandoli");
    expect(trd("Dehradun", "hi")).toBe("देहरादून");

    // Untranslated strings should return original string as fallback
    expect(trd("Nonexistent Custom String", "hi")).toBe("Nonexistent Custom String");
  });
});
