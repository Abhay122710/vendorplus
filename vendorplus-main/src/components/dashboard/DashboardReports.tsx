import { FileText, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { useDatasetAnalytics } from "@/hooks/use-dataset-analytics";
import { useMLData } from "@/hooks/use-ml-data";
import { generateCSV, downloadFile } from "@/services/dataService";
import { useCallback } from "react";

export default function DashboardReports() {
  const { tr } = useLanguage();
  const { rows, trending, categories, weekday, areaTrends, loading } = useDatasetAnalytics();
  const { topProducts, totalSales } = useMLData();

  const downloadSalesCSV = useCallback(() => {
    if (topProducts.length === 0) return;
    const csv = generateCSV(
      ["Product", "Sales Quantity"],
      topProducts.map((p) => [p.product, String(p.salesQuantity)])
    );
    downloadFile(csv, "top_products_report.csv");
  }, [topProducts]);

  const downloadTrendingCSV = useCallback(() => {
    if (trending.length === 0) return;
    const csv = generateCSV(
      ["Product", "Trending Score", "Direction", "Confidence"],
      trending.map((t) => [t.product_name, String(t.trending_score), t.trend_direction, String(t.confidence)])
    );
    downloadFile(csv, "trending_products_report.csv");
  }, [trending]);

  const downloadCategoryCSV = useCallback(() => {
    if (categories.length === 0) return;
    const csv = generateCSV(
      ["Category", "Demand Score"],
      categories.map((c) => [c.category, String(c.demand)])
    );
    downloadFile(csv, "category_demand_report.csv");
  }, [categories]);

  const downloadAreaCSV = useCallback(() => {
    if (areaTrends.length === 0) return;
    const csv = generateCSV(
      ["Area", "Top Product", "Total Sales"],
      areaTrends.map((a) => [a.area, a.product, String(a.totalSales)])
    );
    downloadFile(csv, "area_trends_report.csv");
  }, [areaTrends]);

  const downloadWeekdayCSV = useCallback(() => {
    if (weekday.length === 0) return;
    const csv = generateCSV(
      ["Day", "Demand Score"],
      weekday.map((w) => [w.day, String(w.demand)])
    );
    downloadFile(csv, "weekday_demand_report.csv");
  }, [weekday]);

  const downloadFullCSV = useCallback(() => {
    if (rows.length === 0) return;
    const csv = generateCSV(
      ["Area", "Shop Type", "Product", "Price", "Day", "Season", "Sales Qty", "Demand Level"],
      rows.map((r) => [r.area, r.shopType, r.product, String(r.price), r.dayOfWeek, r.season, String(r.salesQuantity), r.demandLevel])
    );
    downloadFile(csv, "full_dataset_report.csv");
  }, [rows]);

  const reports = [
    {
      title: tr("dashReports.weeklySales"),
      period: `${topProducts.length} products · ₹${totalSales.toLocaleString("en-IN")} total`,
      onCSV: downloadSalesCSV,
      available: topProducts.length > 0,
    },
    {
      title: tr("dashReports.monthlySales"),
      period: `${trending.length} trending products analyzed`,
      onCSV: downloadTrendingCSV,
      available: trending.length > 0,
    },
    {
      title: tr("dashReports.demandAnalytics"),
      period: `${categories.length} categories · ${weekday.length} days analyzed`,
      onCSV: downloadCategoryCSV,
      available: categories.length > 0,
    },
    {
      title: "Area Trends Report",
      period: `${areaTrends.length} areas with top products`,
      onCSV: downloadAreaCSV,
      available: areaTrends.length > 0,
    },
    {
      title: "Weekday Demand Report",
      period: "Daily demand patterns across the week",
      onCSV: downloadWeekdayCSV,
      available: weekday.length > 0,
    },
    {
      title: "Full Dataset Export",
      period: `${rows.length} records from ML dataset`,
      onCSV: downloadFullCSV,
      available: rows.length > 0,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Loading report data…</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">{tr("dashReports.title")}</h2>

      <div className="space-y-4">
        {reports.map((report, i) => (
          <div key={i} className="flex items-center justify-between rounded-xl border bg-card p-5 shadow-card">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{report.title}</h3>
                <p className="text-sm text-muted-foreground">{report.period}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="gap-2"
                onClick={report.onCSV}
                disabled={!report.available}
              >
                <Download className="h-3.5 w-3.5" /> CSV
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
