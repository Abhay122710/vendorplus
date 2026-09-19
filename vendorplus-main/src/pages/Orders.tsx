import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useOrders } from "@/lib/order-context";
import { Navigate } from "react-router-dom";
import { Clock, CheckCircle2, XCircle, AlertTriangle, Package, ArrowLeft, PackageCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import OrderTimer from "@/components/OrderTimer";
import { Link } from "react-router-dom";
import { useLanguage, translateOrderStatus } from "@/lib/language-context";
import { trd } from "@/lib/demo-translations";

export default function Orders() {
  const { user, profile } = useAuth();
  const { orders } = useOrders();
  const [activeTab, setActiveTab] = useState<string>("Pending");
  const { tr, lang } = useLanguage();

  if (!user) return <Navigate to="/login" />;

  const tabs = [
    { id: "Pending", label: tr("orders.pending"), icon: Clock, color: "text-warning", bg: "bg-warning/10", activeBg: "bg-warning text-warning-foreground" },
    { id: "Confirmed", label: tr("orders.approved"), icon: CheckCircle2, color: "text-success", bg: "bg-success/10", activeBg: "bg-success text-white" },
    { id: "Completed", label: tr("orders.completed"), icon: PackageCheck, color: "text-primary", bg: "bg-primary/10", activeBg: "bg-primary text-primary-foreground" },
    { id: "Cancelled", label: tr("orders.denied"), icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", activeBg: "bg-destructive text-destructive-foreground" },
  ] as const;

  const statusConfig: Record<string, { icon: typeof Clock; color: string; bg: string }> = {
    Pending: { icon: Clock, color: "text-warning", bg: "bg-warning/10" },
    Confirmed: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
    Cancelled: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
    Partial: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" },
    Completed: { icon: PackageCheck, color: "text-primary", bg: "bg-primary/10" },
  };

  const userOrders = orders.filter(
    (o) => o.customer_phone === profile?.phone || o.customer_name === profile?.name
  );

  const filteredOrders = userOrders.filter((o) => {
    if (activeTab === "Cancelled") return o.status === "Cancelled" || o.status === "Partial";
    return o.status === activeTab;
  });

  const counts = {
    Pending: userOrders.filter((o) => o.status === "Pending").length,
    Confirmed: userOrders.filter((o) => o.status === "Confirmed").length,
    Completed: userOrders.filter((o) => o.status === "Completed").length,
    Cancelled: userOrders.filter((o) => o.status === "Cancelled" || o.status === "Partial").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-3xl py-8">
        <div className="mb-6 flex items-center gap-3">
          <Link to="/marketplace">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{tr("orders.title")}</h1>
            <p className="text-sm text-muted-foreground">{tr("orders.subtitle")}</p>
          </div>
        </div>

        <div className="mb-6 flex gap-2 rounded-xl bg-muted/50 p-1.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? tab.activeBg + " shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {counts[tab.id as keyof typeof counts] > 0 && (
                  <span
                    className={`flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                      isActive ? "bg-white/25 text-inherit" : tab.bg + " " + tab.color
                    }`}
                  >
                    {counts[tab.id as keyof typeof counts]}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="space-y-3">
          {filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-3 rounded-xl border bg-card py-16 text-center"
            >
              <Package className="h-12 w-12 text-muted-foreground/30" />
              <p className="text-muted-foreground">{tr("orders.noOrders").replace("{status}", activeTab.toLowerCase())}</p>
            </motion.div>
          ) : (
            filteredOrders.map((order, i) => {
              const cfg = statusConfig[order.status] || statusConfig.Pending;
              const StatusIcon = cfg.icon;
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Card className="overflow-hidden transition-colors hover:bg-muted/20">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-muted-foreground">#{order.id}</p>
                          <p className="mt-1 text-sm font-semibold text-foreground">
                            {order.items.map((item) => `${item.quantity}× ${trd(item.product_name, lang)}`).join(", ")}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">₹{order.total_amount}</span>
                            <span>
                              {new Date(order.timestamp).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-2">
                          <span
                            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cfg.bg} ${cfg.color}`}
                          >
                            <StatusIcon className="h-3.5 w-3.5" />
                            {translateOrderStatus(order.status, tr)}
                          </span>
                          {order.status === "Confirmed" && (
                            <OrderTimer approvedAt={order.approved_at || order.timestamp} />
                          )}
                          {order.status === "Completed" && (
                            <OrderTimer approvedAt={order.approved_at || order.timestamp} completed />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
