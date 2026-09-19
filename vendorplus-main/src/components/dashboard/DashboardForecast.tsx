import { demoPredictions } from "@/lib/demo-data";
import { Brain, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useLanguage } from "@/lib/language-context";
import { trd } from "@/lib/demo-translations";

const forecastChart = [
  { week: "Week 1", actual: 80, predicted: 82 },
  { week: "Week 2", actual: 95, predicted: 90 },
  { week: "Week 3", actual: 100, predicted: 105 },
  { week: "Week 4", actual: 110, predicted: 112 },
  { week: "Week 5", actual: 120, predicted: 118 },
  { week: "Week 6", actual: null, predicted: 130 },
  { week: "Week 7", actual: null, predicted: 138 },
];

export default function DashboardForecast() {
  const { tr, lang } = useLanguage();
  const localizedForecast = forecastChart.map((item, index) => ({ ...item, week: tr(`chart.week${index + 1}`) }));
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Brain className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">{tr("forecast.title")}</h2>
          <p className="text-sm text-muted-foreground">{tr("forecast.subtitle")}</p>
        </div>
      </div>

      {/* Forecast chart */}
      <div className="rounded-xl border bg-card p-6 shadow-card">
        <h3 className="mb-4 font-semibold text-foreground">{tr("forecast.chartTitle")}</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={localizedForecast}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 20%, 88%)" />
            <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(20, 10%, 45%)" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(20, 10%, 45%)" />
            <Tooltip />
            <Line type="monotone" dataKey="actual" stroke="hsl(38, 80%, 55%)" strokeWidth={2} dot={{ fill: "hsl(38, 80%, 55%)" }} name={tr("forecast.actual")} />
            <Line type="monotone" dataKey="predicted" stroke="hsl(15, 60%, 40%)" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: "hsl(15, 60%, 40%)" }} name={tr("forecast.predicted")} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Prediction cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {demoPredictions.map(pred => (
          <div key={pred.id} className="rounded-xl border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">{trd(pred.product_name, lang)}</h3>
              {pred.trend === "up" ? <TrendingUp className="h-5 w-5 text-success" /> : <TrendingDown className="h-5 w-5 text-destructive" />}
            </div>
            <div className="mt-3">
              <span className="text-3xl font-bold text-primary">{pred.predicted_demand}</span>
              <span className="ml-1 text-sm text-muted-foreground">{tr("forecast.units")}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{tr("chart.nextWeek")}</span>
              <span className="rounded-full bg-success/10 px-2 py-0.5 text-success font-medium">{pred.confidence}% {tr("forecast.confidence")}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
