import { demoProducts, demoOrders } from "@/lib/demo-data";
import { Package, ShoppingCart, TrendingUp, DollarSign, AlertCircle, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { useLanguage } from "@/lib/language-context";
import { trd } from "@/lib/demo-translations";
import { useMLData } from "@/hooks/use-ml-data";

const salesTrend = [
  { day: "Mar 1", sales: 3450 },
  { day: "Mar 2", sales: 2550 },
  { day: "Mar 3", sales: 3100 },
  { day: "Mar 4", sales: 2800 },
  { day: "Mar 5", sales: 3200 },
  { day: "Mar 6", sales: 1800 },
  { day: "Mar 7", sales: 4550 },
];

export default function DashboardOverview() {
  const { tr, lang } = useLanguage();
  const { topProducts, topProduct, totalSales, loading, error } = useMLData();

  const stats = [
    {
      label: tr("dash.totalProducts"),
      value: demoProducts.filter((p) => p.shop_id === "s1").length,
      icon: Package,
      color: "bg-primary/10 text-primary",
      trend: "+3 this week",
    },
    {
      label: tr("dash.todaySales"),
      value: loading ? "..." : `₹${totalSales.toLocaleString("en-IN")}`,
      icon: DollarSign,
      color: "bg-success/10 text-success",
      trend: "+12% vs yesterday",
    },
    {
      label: tr("dash.ordersToday"),
      value: demoOrders.filter((o) => o.shop_id === "s1").length,
      icon: ShoppingCart,
      color: "bg-info/10 text-info",
      trend: "5 pending",
    },
    {
      label: tr("dash.topProduct"),
      value: loading ? "..." : trd(topProduct, lang),
      icon: TrendingUp,
      color: "bg-warning/10 text-warning",
      trend: "Highest demand",
    },
  ];

  const chartData = topProducts.map((p) => ({
    name: trd(p.product, lang),
    value: p.salesQuantity,
  }));

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="group rounded-xl border bg-card p-5 shadow-stat transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold text-foreground leading-none mt-2">{s.value}</p>
                <p className="text-[11px] text-muted-foreground/70 mt-1.5">{s.trend}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color} transition-transform group-hover:scale-105`}>
                <s.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2.5 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error} — showing cached data.</span>
        </div>
      )}

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sales Trend - Area chart for modern feel */}
        <div className="rounded-xl border bg-card p-6 shadow-stat">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">{tr("dash.salesTrend")}</h3>
            <span className="text-[11px] text-muted-foreground">Last 7 days</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={salesTrend}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(38, 80%, 55%)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(38, 80%, 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 20%, 90%)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(20, 10%, 55%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(20, 10%, 55%)" }} axisLine={false} tickLine={false} width={45} />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(35, 20%, 88%)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  fontSize: "12px",
                }}
              />
              <Area type="monotone" dataKey="sales" stroke="hsl(38, 80%, 55%)" strokeWidth={2} fill="url(#salesGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="rounded-xl border bg-card p-6 shadow-stat">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">{tr("dash.topProductsChart")}</h3>
            <span className="text-[11px] text-muted-foreground">From ML analysis</span>
          </div>
          {loading ? (
            <div className="flex h-[240px] items-center justify-center text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span className="text-sm">Loading data…</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 20%, 90%)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "hsl(20, 10%, 55%)" }}
                  angle={-30}
                  textAnchor="end"
                  height={55}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={{ fontSize: 11, fill: "hsl(20, 10%, 55%)" }} axisLine={false} tickLine={false} width={40} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(35, 20%, 88%)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="value" fill="hsl(38, 80%, 55%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
