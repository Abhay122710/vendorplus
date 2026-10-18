import { describe, it, expect, vi, afterEach } from "vitest";
import { fetchPrediction, ML_API_INFO } from "@/lib/ml/api";

describe("ML API Client", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("exposes base configuration and endpoint contract", () => {
    expect(ML_API_INFO.endpoint).toBe("/predict");
    expect(ML_API_INFO.framework).toBe("FastAPI");
    expect(ML_API_INFO.service).toBe("ml-api/main.py");
  });

  it("successfully parses prediction response from live or mocked server", async () => {
    const mockResponse = {
      prediction: 120.5,
      label: "High demand expected for Cold Drinks",
      confidence: 0.88,
      demand_level: "High",
      top_product: "Cold Drinks",
      area: "Bidholi",
      season: "Summer",
      revenue_potential: 5400,
      accuracy: 0.91,
      features_used: ["Area", "Shop_Type", "Product", "Sales_Quantity", "Price", "Day_of_Week", "Season"],
      model_version: "1.0.0",
      generated_at: new Date().toISOString(),
    };

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    }));

    const result = await fetchPrediction();
    expect(result.prediction).toBe(120.5);
    expect(result.demand_level).toBe("High");
    expect(result.top_product).toBe("Cold Drinks");
    expect(result.confidence).toBe(0.88);
  });

  it("gracefully falls back to deterministic mock when network fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network connection refused")));

    const result = await fetchPrediction();
    expect(result).toBeDefined();
    expect(result.prediction).toBe(128);
    expect(result.demand_level).toBe("High");
    expect(result.top_product).toBe("Cold Drinks");
    expect(result.features_used.length).toBeGreaterThan(0);
  });

  it("gracefully falls back when API returns HTTP 500", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: "Internal Server Error" }),
    }));

    const result = await fetchPrediction();
    expect(result).toBeDefined();
    expect(result.prediction).toBe(128);
  });
});
