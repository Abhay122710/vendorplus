/**
 * Hook: useDatasetAnalytics
 * Parses the full vendor dataset CSV from cloud storage.
 * Derives trending products, category demand, weekday patterns,
 * and area-level trends for the AI Hub and Competition tabs.
 */
import { useState, useEffect, useCallback } from "react";
import { fetchCSVFromStorage } from "@/services/dataService";

const DATASET_PATH = "vendor_plus_dataset_1.csv";
const POLL_INTERVAL = 60_000;

export interface DatasetRow {
  area: string;
  shopType: string;
  product: string;
  price: number;
  dayOfWeek: string;
  season: string;
  salesQuantity: number;
  demandLevel: string;
}

export interface TrendingProduct {
  product_name: string;
  trending_score: number;
  trend_direction: "increasing" | "decreasing" | "stable";
  confidence: number;
  stock: number;
}

export interface CategoryDemand {
  category: string;
  demand: number;
}

export interface WeekdayDemand {
  day: string;
  demand: number;
}

export interface AreaTrend {
  product: string;
  area: string;
  totalSales: number;
}

function parseDatasetCSV(text: string): DatasetRow[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  return lines.slice(1).map((line) => {
    const cols = line.split(",").map((c) => c.trim());
    if (cols.length < 8) return null;
    const qty = Number(cols[6]);
    const price = Number(cols[3]);
    if (isNaN(qty) || isNaN(price)) return null;
    return {
      area: cols[0],
      shopType: cols[1],
      product: cols[2],
      price,
      dayOfWeek: cols[4],
      season: cols[5],
      salesQuantity: qty,
      demandLevel: cols[7],
    };
  }).filter(Boolean) as DatasetRow[];
}

function deriveTrending(rows: DatasetRow[]): TrendingProduct[] {
  const productMap = new Map<string, { total: number; highCount: number; count: number }>();
  for (const r of rows) {
    const entry = productMap.get(r.product) || { total: 0, highCount: 0, count: 0 };
    entry.total += r.salesQuantity;
    entry.count++;
    if (r.demandLevel === "High") entry.highCount++;
    productMap.set(r.product, entry);
  }

  const maxSales = Math.max(...Array.from(productMap.values()).map((v) => v.total));

  return Array.from(productMap.entries())
    .map(([name, v]) => {
      const score = Math.round((v.total / maxSales) * 100);
      const highRatio = v.highCount / v.count;
      const direction: "increasing" | "decreasing" | "stable" =
        highRatio > 0.5 ? "increasing" : highRatio < 0.25 ? "decreasing" : "stable";
      return {
        product_name: name,
        trending_score: score,
        trend_direction: direction,
        confidence: Math.round(highRatio * 100) / 100,
        stock: Math.round(Math.random() * 40 + 5),
      };
    })
    .sort((a, b) => b.trending_score - a.trending_score)
    .slice(0, 6);
}

function deriveCategoryDemand(rows: DatasetRow[]): CategoryDemand[] {
  const catMap = new Map<string, number>();
  for (const r of rows) {
    catMap.set(r.shopType, (catMap.get(r.shopType) || 0) + r.salesQuantity);
  }
  const max = Math.max(...Array.from(catMap.values()));
  return Array.from(catMap.entries())
    .map(([category, total]) => ({
      category: category.replace(" Shop", ""),
      demand: Math.round((total / max) * 100),
    }))
    .sort((a, b) => b.demand - a.demand);
}

function deriveWeekdayDemand(rows: DatasetRow[]): WeekdayDemand[] {
  const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const dayAbbr = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayMap = new Map<string, number>();
  for (const r of rows) {
    dayMap.set(r.dayOfWeek, (dayMap.get(r.dayOfWeek) || 0) + r.salesQuantity);
  }
  const max = Math.max(...Array.from(dayMap.values()));
  return dayOrder.map((d, i) => ({
    day: dayAbbr[i],
    demand: Math.round(((dayMap.get(d) || 0) / max) * 100),
  }));
}

function deriveAreaTrends(rows: DatasetRow[]): AreaTrend[] {
  const areaProductMap = new Map<string, Map<string, number>>();
  for (const r of rows) {
    if (!areaProductMap.has(r.area)) areaProductMap.set(r.area, new Map());
    const pm = areaProductMap.get(r.area)!;
    pm.set(r.product, (pm.get(r.product) || 0) + r.salesQuantity);
  }
  const results: AreaTrend[] = [];
  for (const [area, pm] of areaProductMap) {
    let topProduct = "";
    let topSales = 0;
    for (const [product, sales] of pm) {
      if (sales > topSales) { topProduct = product; topSales = sales; }
    }
    results.push({ product: topProduct, area, totalSales: topSales });
  }
  return results.sort((a, b) => b.totalSales - a.totalSales).slice(0, 4);
}

interface DatasetAnalytics {
  trending: TrendingProduct[];
  categories: CategoryDemand[];
  weekday: WeekdayDemand[];
  areaTrends: AreaTrend[];
  rows: DatasetRow[];
  loading: boolean;
  error: string | null;
  live: boolean;
}

export function useDatasetAnalytics(): DatasetAnalytics {
  const [trending, setTrending] = useState<TrendingProduct[]>([]);
  const [categories, setCategories] = useState<CategoryDemand[]>([]);
  const [weekday, setWeekday] = useState<WeekdayDemand[]>([]);
  const [areaTrends, setAreaTrends] = useState<AreaTrend[]>([]);
  const [rows, setRows] = useState<DatasetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [live, setLive] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const text = await fetchCSVFromStorage(DATASET_PATH);
      const parsed = parseDatasetCSV(text);
      if (parsed.length === 0) { setError("Dataset is empty"); return; }

      setRows(parsed);
      setTrending(deriveTrending(parsed));
      setCategories(deriveCategoryDemand(parsed));
      setWeekday(deriveWeekdayDemand(parsed));
      setAreaTrends(deriveAreaTrends(parsed));
      setError(null);
      setLive(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setLive(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { trending, categories, weekday, areaTrends, rows, loading, error, live };
}
