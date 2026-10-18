/**
 * Hook: useMLData
 * Fetches top_products.csv from cloud storage and provides
 * parsed product sales data with 30s polling for near-realtime updates.
 */
import { useState, useEffect, useCallback } from "react";
import { fetchCSVFromStorage } from "@/services/dataService";

export interface ProductSalesRow {
  product: string;
  salesQuantity: number;
}

interface MLData {
  topProducts: ProductSalesRow[];
  topProduct: string;
  totalSales: number;
  loading: boolean;
  error: string | null;
}

const CSV_PATH = "top_products.csv";
const POLL_INTERVAL = 30_000;

function parseCSV(text: string): ProductSalesRow[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const productIdx = header.findIndex((h) => h === "product");
  const salesIdx = header.findIndex(
    (h) => h === "sales_quantity" || h === "salesquantity"
  );

  if (productIdx === -1 || salesIdx === -1) return [];

  return lines
    .slice(1)
    .map((line) => {
      const cols = line.split(",").map((c) => c.trim());
      if (!cols[productIdx] || !cols[salesIdx]) return null;
      const qty = Number(cols[salesIdx]);
      if (isNaN(qty)) return null;
      return { product: cols[productIdx], salesQuantity: qty };
    })
    .filter(Boolean) as ProductSalesRow[];
}

export function useMLData(): MLData {
  const [topProducts, setTopProducts] = useState<ProductSalesRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const text = await fetchCSVFromStorage(CSV_PATH);

      const parsed = parseCSV(text);

      if (parsed.length === 0) {
        setError("CSV is empty or has invalid format");
        return;
      }

      // Sort descending and take top 10
      const sorted = [...parsed].sort(
        (a, b) => b.salesQuantity - a.salesQuantity
      );
      setTopProducts(sorted.slice(0, 10));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  const topProduct =
    topProducts.length > 0 ? topProducts[0].product : "—";
  const totalSales = topProducts.reduce((s, p) => s + p.salesQuantity, 0);

  return { topProducts, topProduct, totalSales, loading, error };
}
