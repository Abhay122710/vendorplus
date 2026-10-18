import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, BarChart3, MapPin, Calendar, Flame, RefreshCw, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage, translateTrendDirection } from "@/lib/language-context";
import { trd } from "@/lib/demo-translations";

const API_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/smart-ai`;

interface TrendingProduct {
  product_name: string;
  trending_score: number;
  trend_direction: "increasing" | "decreasing" | "stable";
  confidence?: number;
  stock?: number;
}

interface CategoryDemand {
  category: string;
  demand: number;
}

interface AreaDemand {
  area: string;
  product: string;
  demand: number;
}

interface WeekdayDemand {
  day: string;
  demand: number;
}

function useFetchData<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}${endpoint}`);
      if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [endpoint]);

  return { data, loading, error, refetch: fetchData };
}

function TrendIcon({ direction }: { direction: string }) {
  if (direction === "increasing") return <TrendingUp className="h-4 w-4 text-success" />;
  if (direction === "decreasing") return <TrendingDown className="h-4 w-4 text-destructive" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

function LoadingState() {
  const { tr } = useLanguage();
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <span className="ml-2 text-sm text-muted-foreground">{tr("analytics.loadingData")}</span>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  const { tr } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertTriangle className="h-8 w-8 text-warning mb-2" />
      <p className="text-sm text-muted-foreground mb-3">{message}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> {tr("smartAI.retry")}
      </Button>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-card">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function TrendingProducts() {
  const { tr, lang } = useLanguage();
  const { data, loading, error, refetch } = useFetchData<TrendingProduct[]>("/trending");
  if (loading) return <SectionCard title={tr("analytics.trendingProducts")} icon={Flame}><LoadingState /></SectionCard>;
  if (error || !data) return <SectionCard title={tr("analytics.trendingProducts")} icon={Flame}><ErrorState message={error || tr("smartAI.noData")} onRetry={refetch} /></SectionCard>;

  const needsRestock = (p: TrendingProduct) => p.trending_score >= 70 && p.stock !== undefined && p.stock < 10;

  return (
    <SectionCard title={tr("analytics.trendingProducts")} icon={Flame}>
      <div className="grid gap-4 sm:grid-cols-2">
        {data.map((product) => (
          <div key={product.product_name} className="rounded-lg border bg-background p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">{trd(product.product_name, lang)}</h4>
              <div className="flex items-center gap-1.5">
                <TrendIcon direction={product.trend_direction} />
                <span className="text-xs capitalize text-muted-foreground">{translateTrendDirection(product.trend_direction, tr)}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{tr("analytics.trendingScore")}</span>
                <span className="font-bold text-primary">{product.trending_score}</span>
              </div>
              <Progress value={product.trending_score} className="h-2" />
            </div>
            {product.confidence !== undefined && (
              <p className="text-xs text-muted-foreground">{tr("analytics.confidence")}: {(product.confidence * 100).toFixed(0)}%</p>
            )}
            {needsRestock(product) && (
              <Badge variant="destructive" className="text-xs gap-1">
                <AlertTriangle className="h-3 w-3" /> {tr("analytics.restockRecommended")}
              </Badge>
            )}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function CategoryDemandChart() {
  const { tr } = useLanguage();
  const { data, loading, error, refetch } = useFetchData<CategoryDemand[]>("/trending/categories");
  if (loading) return <SectionCard title={tr("analytics.categoryDemand")} icon={BarChart3}><LoadingState /></SectionCard>;
  if (error || !data) return <SectionCard title={tr("analytics.categoryDemand")} icon={BarChart3}><ErrorState message={error || tr("smartAI.noData")} onRetry={refetch} /></SectionCard>;

  return (
    <SectionCard title={tr("analytics.categoryDemand")} icon={BarChart3}>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 20%, 88%)" />
          <XAxis dataKey="category" tick={{ fontSize: 12 }} stroke="hsl(20, 10%, 45%)" />
          <YAxis tick={{ fontSize: 12 }} stroke="hsl(20, 10%, 45%)" />
          <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(35, 20%, 88%)" }} />
          <Bar dataKey="demand" fill="hsl(38, 80%, 55%)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </SectionCard>
  );
}

function AreaDemandChart() {
  const { tr } = useLanguage();
  const { data, loading, error, refetch } = useFetchData<AreaDemand[]>("/trending/areas");
  if (loading) return <SectionCard title={tr("analytics.areaDemand")} icon={MapPin}><LoadingState /></SectionCard>;
  if (error || !data) return <SectionCard title={tr("analytics.areaDemand")} icon={MapPin}><ErrorState message={error || tr("smartAI.noData")} onRetry={refetch} /></SectionCard>;

  return (
    <SectionCard title={tr("analytics.areaDemand")} icon={MapPin}>
      <div className="space-y-3">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg border bg-background p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{item.product}</p>
              <p className="text-xs text-muted-foreground">{item.area}</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-primary">{item.demand}</span>
              <p className="text-xs text-muted-foreground">{tr("analytics.demand")}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function WeeklyTrendsChart() {
  const { tr } = useLanguage();
  const { data, loading, error, refetch } = useFetchData<WeekdayDemand[]>("/trending/weekdays");
  if (loading) return <SectionCard title={tr("analytics.weeklyTrends")} icon={Calendar}><LoadingState /></SectionCard>;
  if (error || !data) return <SectionCard title={tr("analytics.weeklyTrends")} icon={Calendar}><ErrorState message={error || tr("smartAI.noData")} onRetry={refetch} /></SectionCard>;

  return (
    <SectionCard title={tr("analytics.weeklyTrends")} icon={Calendar}>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 20%, 88%)" />
          <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(20, 10%, 45%)" />
          <YAxis tick={{ fontSize: 12 }} stroke="hsl(20, 10%, 45%)" />
          <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(35, 20%, 88%)" }} />
          <Line type="monotone" dataKey="demand" stroke="hsl(38, 80%, 55%)" strokeWidth={2.5} dot={{ fill: "hsl(38, 80%, 55%)", r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </SectionCard>
  );
}

export default function DashboardAnalytics() {
  const { tr } = useLanguage();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">{tr("analytics.title")}</h2>
        <Badge variant="outline" className="gap-1 text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          {tr("analytics.live")}
        </Badge>
      </div>

      <TrendingProducts />

      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryDemandChart />
        <WeeklyTrendsChart />
      </div>

      <AreaDemandChart />
    </div>
  );
}
