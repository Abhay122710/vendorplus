import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { trd } from "@/lib/demo-translations";
import { useDatasetAnalytics } from "@/hooks/use-dataset-analytics";
import { useMemo } from "react";

export default function DashboardCompetition() {
  const { tr, lang } = useLanguage();
  const { rows, loading, live } = useDatasetAnalytics();

  // Derive competition-style data: compare top products across areas (simulating shops)
  const competitorData = useMemo(() => {
    if (rows.length === 0) return [];

    // Get all areas and top 5 products
    const productTotals = new Map<string, number>();
    const areaProductMap = new Map<string, Map<string, number>>();

    for (const r of rows) {
      productTotals.set(r.product, (productTotals.get(r.product) || 0) + r.salesQuantity);
      if (!areaProductMap.has(r.area)) areaProductMap.set(r.area, new Map());
      const pm = areaProductMap.get(r.area)!;
      pm.set(r.product, (pm.get(r.product) || 0) + r.salesQuantity);
    }

    const topProducts = Array.from(productTotals.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);

    // Pick top 3 areas as "shops" for comparison
    const areaTotals = Array.from(areaProductMap.entries())
      .map(([area, pm]) => ({ area, total: Array.from(pm.values()).reduce((s, v) => s + v, 0) }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);

    return topProducts.map((product) => {
      const entry: Record<string, string | number> = { product };
      areaTotals.forEach((a, i) => {
        const key = i === 0 ? "yourShop" : `competitor${i}`;
        entry[key] = areaProductMap.get(a.area)?.get(product) || 0;
      });
      return entry;
    });
  }, [rows]);

  // Dynamic insights from the dataset
  const insights = useMemo(() => {
    if (rows.length === 0) return [tr("dashCompetition.insight1"), tr("dashCompetition.insight2"), tr("dashCompetition.insight3")];

    const areaSales = new Map<string, number>();
    const areaProducts = new Map<string, Map<string, number>>();
    for (const r of rows) {
      areaSales.set(r.area, (areaSales.get(r.area) || 0) + r.salesQuantity);
      if (!areaProducts.has(r.area)) areaProducts.set(r.area, new Map());
      const pm = areaProducts.get(r.area)!;
      pm.set(r.product, (pm.get(r.product) || 0) + r.salesQuantity);
    }

    const sortedAreas = Array.from(areaSales.entries()).sort((a, b) => b[1] - a[1]);
    const topArea = sortedAreas[0];
    const secondArea = sortedAreas[1];

    const topAreaProduct = topArea ? Array.from(areaProducts.get(topArea[0])!.entries()).sort((a, b) => b[1] - a[1])[0] : null;

    return [
      topArea ? `${topArea[0]} leads with ${topArea[1].toLocaleString()} total sales across all products.` : tr("dashCompetition.insight1"),
      topAreaProduct ? `${topAreaProduct[0]} is the best seller in ${topArea![0]} with ${topAreaProduct[1].toLocaleString()} units.` : tr("dashCompetition.insight2"),
      secondArea ? `${secondArea[0]} is close behind with ${secondArea[1].toLocaleString()} sales — strong competition.` : tr("dashCompetition.insight3"),
    ];
  }, [rows, tr]);

  const areaNames = useMemo(() => {
    if (rows.length === 0) return [tr("dashCompetition.yourShop"), tr("dashCompetition.easyGrab"), tr("dashCompetition.radhe")];
    const areas = new Map<string, number>();
    for (const r of rows) areas.set(r.area, (areas.get(r.area) || 0) + r.salesQuantity);
    return Array.from(areas.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([a]) => a);
  }, [rows, tr]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Loading competition data…</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">{tr("dashCompetition.title")}</h2>

      {/* Insights */}
      <div className="space-y-3">
        {insights.map((ins, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg border bg-card p-4 shadow-card">
            <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-sm text-muted-foreground">{ins}</p>
          </div>
        ))}
      </div>

      {/* Comparison chart */}
      <div className="rounded-xl border bg-card p-6 shadow-card">
        <h3 className="mb-4 font-semibold text-foreground">{tr("dashCompetition.chartTitle")}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={competitorData.map((item) => ({ ...item, product: trd(item.product as string, lang) }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 20%, 88%)" />
            <XAxis dataKey="product" tick={{ fontSize: 12 }} stroke="hsl(20, 10%, 45%)" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(20, 10%, 45%)" />
            <Tooltip />
            <Bar dataKey="yourShop" fill="hsl(38, 80%, 55%)" name={areaNames[0] || tr("dashCompetition.yourShop")} radius={[4, 4, 0, 0]} />
            <Bar dataKey="competitor1" fill="hsl(15, 60%, 40%)" name={areaNames[1] || tr("dashCompetition.easyGrab")} radius={[4, 4, 0, 0]} />
            <Bar dataKey="competitor2" fill="hsl(217, 91%, 60%)" name={areaNames[2] || tr("dashCompetition.radhe")} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
