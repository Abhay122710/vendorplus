import { Flame, TrendingUp, BarChart3 } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { trd } from "@/lib/demo-translations";

export default function DashboardInsights() {
  const { tr, lang } = useLanguage();
  const insights = [
    { product: "Samosa", score: 95, trend: "up", note: tr("aiHub.insight1") },
    { product: "Gulab Jamun", score: 78, trend: "up", note: tr("aiHub.insight2") },
    { product: "Chocolate Cake", score: 65, trend: "stable", note: tr("aiHub.insight3") },
    { product: "Kaju Katli", score: 82, trend: "up", note: tr("aiHub.insight4") },
  ];
  const areaTrends = [tr("aiHub.areaTrend1"), tr("aiHub.areaTrend2"), tr("aiHub.areaTrend3")];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">{tr("insights.title")}</h2>

      {/* Area alerts */}
      <div className="rounded-xl border-l-4 border-l-primary bg-primary/5 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Flame className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground">{tr("insights.trendingInArea")}</span>
        </div>
        <ul className="space-y-2">
          {areaTrends.map((note, i) => (
            <li key={i} className="text-sm text-muted-foreground">📍 {note}</li>
          ))}
        </ul>
      </div>

      {/* Product demand scores */}
      <div className="grid gap-4 sm:grid-cols-2">
        {insights.map(item => (
          <div key={item.product} className="rounded-xl border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">{trd(item.product, lang)}</h3>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-sm font-bold text-primary">{item.score}</span>
              </div>
            </div>
            <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${item.score}%` }} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{item.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
