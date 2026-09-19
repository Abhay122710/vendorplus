import { useState, useEffect } from "react";
import { Brain, Flame, TrendingUp, TrendingDown, Minus, AlertTriangle, BarChart3, Calendar, RefreshCw, Loader2, Zap, ShieldAlert, CheckCircle2, Lightbulb, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { demoPredictions } from "@/lib/demo-data";
import { useLanguage, translateTrendDirection } from "@/lib/language-context";
import { trd } from "@/lib/demo-translations";
import { useDatasetAnalytics } from "@/hooks/use-dataset-analytics";

interface SmartAIResponse {
  demand: string;
  recommendation: string;
  stock_alert: string;
  trending: string;
  explanation: string[];
}

const MOCK_SMART_AI: SmartAIResponse = {
  demand: "High",
  recommendation: "Stock up on cold beverages and snacks. Afternoon rush expected due to hot weather and campus proximity.",
  stock_alert: "Low stock alert — restock samosas and cold drinks before 2 PM.",
  trending: "Cold Coffee",
  explanation: [
    "Hot weather drives 40% more cold beverage sales.",
    "Afternoon time slot historically sees peak footfall.",
    "Current stock of 10 units won't last beyond 3 PM at current rate.",
    "Campus proximity means student crowd peaks at 1-3 PM.",
  ],
};

const insightsData = [
  { product: "Samosa", score: 95, trend: "up", note: "Consistently highest demand near Bidholi Gate" },
  { product: "Gulab Jamun", score: 78, trend: "up", note: "Demand increasing ahead of festival season" },
  { product: "Chocolate Cake", score: 65, trend: "stable", note: "Steady weekend demand" },
  { product: "Kaju Katli", score: 82, trend: "up", note: "Trending in your area this week" },
] as const;

const forecastChart = [
  { week: "Week 1", actual: 80, predicted: 82 },
  { week: "Week 2", actual: 95, predicted: 90 },
  { week: "Week 3", actual: 100, predicted: 105 },
  { week: "Week 4", actual: 110, predicted: 112 },
  { week: "Week 5", actual: 120, predicted: 118 },
  { week: "Week 6", actual: null, predicted: 130 },
  { week: "Week 7", actual: null, predicted: 138 },
];

function TrendIcon({ direction }: { direction: string }) {
  if (direction === "increasing" || direction === "up") return <TrendingUp className="h-4 w-4 text-success" />;
  if (direction === "decreasing") return <TrendingDown className="h-4 w-4 text-destructive" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

export default function DashboardAIHub() {
  const { tr, lang } = useLanguage();
  const { trending: mlTrending, categories: mlCategories, weekday: mlWeekday, areaTrends, loading: mlLoading, error: mlError, live: mlLive } = useDatasetAnalytics();

  // Smart AI uses static insights derived from dataset context
  const [smartLoading, setSmartLoading] = useState(true);
  const [ai, setAi] = useState<SmartAIResponse>(MOCK_SMART_AI);

  useEffect(() => {
    // Generate smart AI insights from dataset when available
    if (!mlLoading && mlTrending.length > 0) {
      const topProduct = mlTrending[0]?.product_name || "Samosa";
      const lowStockProducts = mlTrending.filter(p => (p.stock ?? 0) < 15);
      const stockAlert = lowStockProducts.length > 0
        ? `Low stock alert — restock ${lowStockProducts.map(p => p.product_name).join(", ")} soon.`
        : "Stock levels are healthy across all trending products.";

      const topCategory = mlCategories[0]?.category || "Snacks";
      const peakDay = [...mlWeekday].sort((a, b) => b.demand - a.demand)[0]?.day || "Sat";

      setAi({
        demand: mlTrending[0]?.trend_direction === "increasing" ? "High" : "Medium",
        recommendation: `Focus on ${topCategory} category — it leads demand. ${topProduct} is the top trending product. Peak sales day is ${peakDay}.`,
        stock_alert: stockAlert,
        trending: topProduct,
        explanation: [
          `${topProduct} has the highest trending score of ${mlTrending[0]?.trending_score || 0} across all products.`,
          `${topCategory} category shows strongest overall demand from the dataset.`,
          `${peakDay} is the busiest sales day — plan staffing and stock accordingly.`,
          areaTrends.length > 0
            ? `${areaTrends[0].product} dominates in ${areaTrends[0].area} with ${areaTrends[0].totalSales} total sales.`
            : "Area-level trends are being analyzed.",
        ],
      });
    }
    setSmartLoading(mlLoading);
  }, [mlLoading, mlTrending, mlCategories, mlWeekday, areaTrends]);

  const isUrgent = ai.stock_alert?.toLowerCase().match(/urgent|low|restock|alert/);
  const localizedForecast = forecastChart.map((item, index) => ({ ...item, week: tr(`chart.week${index + 1}`) }));
  const localizedWeekday = mlWeekday.map((item) => ({ ...item, day: tr(`day.${item.day.toLowerCase()}`) }));
  const localizedCategories = mlCategories.map((item) => ({ ...item, category: trd(item.category, lang) }));

  const demandLabel = ai.demand === "High" ? tr("aiHub.demandHigh") : ai.demand;
  const stockAlertLabel = ai.stock_alert;
  const recommendationLabel = ai.recommendation;
  const explanationLabels = ai.explanation || [];

  const areaTrendLabels = areaTrends.length > 0
    ? areaTrends.slice(0, 3).map(a => `${trd(a.product, lang)} is trending in ${a.area} (${a.totalSales} sales)`)
    : [tr("aiHub.areaTrend1"), tr("aiHub.areaTrend2"), tr("aiHub.areaTrend3")];

  const insightNotes = [tr("aiHub.insight1"), tr("aiHub.insight2"), tr("aiHub.insight3"), tr("aiHub.insight4")];

  // Dynamic insights from dataset if available
  const displayInsights = mlTrending.length >= 4
    ? mlTrending.slice(0, 4).map((p, i) => ({
        product: p.product_name,
        score: p.trending_score,
        trend: p.trend_direction === "increasing" ? "up" : p.trend_direction === "decreasing" ? "down" : "stable",
        note: insightNotes[i] || "",
      }))
    : insightsData.map((item, i) => ({ ...item, note: insightNotes[i] }));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{tr("aiHub.title")}</h2>
            <p className="text-sm text-muted-foreground">{tr("aiHub.subtitle")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {mlError && (
            <Badge variant="outline" className="text-xs text-warning border-warning/30">{tr("aiHub.demo")}</Badge>
          )}
          <Badge variant="outline" className="gap-1.5 text-xs">
            <span className={`h-1.5 w-1.5 rounded-full ${mlLive ? "bg-success" : "bg-warning"} animate-pulse`} />
            {mlLive ? tr("aiHub.connected") : tr("aiHub.offline")}
          </Badge>
        </div>
      </div>

      <section>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" /> {tr("aiHub.smartInsights")}
        </h3>
        {smartLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">{tr("aiHub.loading")}</span>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-4">
              <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Zap className="h-4 w-4 text-primary" /> {tr("aiHub.demandLevel")}
                  </CardTitle>
                </CardHeader>
                <CardContent><p className="text-2xl font-bold text-primary">{demandLabel}</p></CardContent>
              </Card>

              <Card className="border-accent/30 bg-gradient-to-br from-accent/10 to-accent/20">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Flame className="h-4 w-4 text-accent" /> {tr("aiHub.trendingProduct")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className="text-sm bg-accent/20 text-accent-foreground border-accent/30 hover:bg-accent/30">
                    <TrendingUp className="h-3.5 w-3.5 mr-1.5" /> {trd(ai.trending, lang)}
                  </Badge>
                </CardContent>
              </Card>

              <Card className={isUrgent ? "border-destructive/50 bg-gradient-to-br from-destructive/5 to-destructive/10" : "border-success/30 bg-gradient-to-br from-success/5 to-success/10"}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    {isUrgent ? <ShieldAlert className="h-4 w-4 text-destructive" /> : <CheckCircle2 className="h-4 w-4 text-success" />}
                    {tr("aiHub.stockStatus")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-sm font-semibold ${isUrgent ? "text-destructive" : "text-success"}`}>{stockAlertLabel}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Lightbulb className="h-5 w-5 text-primary" /> {tr("aiHub.recommendation")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="text-sm text-foreground leading-relaxed">{recommendationLabel}</p>
                </div>
              </CardContent>
            </Card>

            {explanationLabels.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Brain className="h-5 w-5 text-primary" /> {tr("aiHub.reasoning")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {explanationLabels.map((point, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{i + 1}</span>
                        <p className="text-sm text-muted-foreground leading-relaxed">{point}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </section>

      <section>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Flame className="h-5 w-5 text-primary" /> {tr("aiHub.demandInsights")}
        </h3>

        <div className="rounded-xl border-l-4 border-l-primary bg-primary/5 p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">{tr("aiHub.trendingInArea")}</span>
          </div>
          <ul className="space-y-2">
            {areaTrendLabels.map((note, i) => (
              <li key={i} className="text-sm text-muted-foreground">📍 {note}</li>
            ))}
          </ul>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {displayInsights.map((item, index) => (
            <div key={item.product} className="rounded-xl border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground">{trd(item.product, lang)}</h4>
                <div className="flex items-center gap-1">
                  <TrendIcon direction={item.trend} />
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
      </section>

      <section>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" /> {tr("aiHub.forecastTitle")}
        </h3>

        <div className="rounded-xl border bg-card p-6 shadow-sm mb-4">
          <h4 className="mb-4 font-semibold text-foreground">{tr("aiHub.forecastChartTitle")}</h4>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={localizedForecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(35 20% 88%)" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Line type="monotone" dataKey="actual" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} name={tr("aiHub.actual")} />
              <Line type="monotone" dataKey="predicted" stroke="hsl(var(--accent))" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: "hsl(var(--accent))" }} name={tr("aiHub.predicted")} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {demoPredictions.map((pred) => (
            <div key={pred.id} className="rounded-xl border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground">{trd(pred.product_name, lang)}</h4>
                {pred.trend === "up" ? <TrendingUp className="h-5 w-5 text-success" /> : <TrendingDown className="h-5 w-5 text-destructive" />}
              </div>
              <div className="mt-3">
                <span className="text-3xl font-bold text-primary">{pred.predicted_demand}</span>
                <span className="ml-1 text-sm text-muted-foreground">{tr("aiHub.units")}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{tr("chart.nextWeek")}</span>
                <span className="rounded-full bg-success/10 px-2 py-0.5 text-success font-medium">{pred.confidence}% {tr("aiHub.confidence")}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" /> {tr("aiHub.mlAnalytics")}
          {mlLive && <Badge variant="outline" className="text-xs gap-1 ml-2"><span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> {tr("aiHub.live")}</Badge>}
        </h3>

        <div className="rounded-xl border bg-card p-6 shadow-sm mb-4">
          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Flame className="h-4 w-4 text-primary" /> {tr("aiHub.trendingProducts")}
          </h4>
          {mlLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {mlTrending.map((p) => (
                <div key={p.product_name} className="rounded-lg border bg-background p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-foreground">{trd(p.product_name, lang)}</h5>
                    <div className="flex items-center gap-1.5">
                      <TrendIcon direction={p.trend_direction} />
                      <span className="text-xs capitalize text-muted-foreground">{translateTrendDirection(p.trend_direction, tr)}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{tr("aiHub.trendingScore")}</span>
                      <span className="font-bold text-primary">{p.trending_score}</span>
                    </div>
                    <Progress value={p.trending_score} className="h-2" />
                  </div>
                  {p.trending_score >= 70 && (p.stock ?? 0) < 10 && (
                    <Badge variant="destructive" className="text-xs gap-1">
                      <AlertTriangle className="h-3 w-3" /> {tr("aiHub.restockRecommended")}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" /> {tr("aiHub.categoryDemand")}
            </h4>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={localizedCategories}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(35 20% 88%)" />
                <XAxis dataKey="category" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Bar dataKey="demand" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" /> {tr("aiHub.weeklyDemandTrends")}
            </h4>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={localizedWeekday}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(35 20% 88%)" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Line type="monotone" dataKey="demand" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ fill: "hsl(var(--primary))", r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
