import { useState } from "react";
import { useOrders } from "@/lib/order-context";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertTriangle, Globe, PackageCheck } from "lucide-react";
import { toast } from "sonner";
import RobocallSimulator from "@/components/RobocallSimulator";
import OrderTimer from "@/components/OrderTimer";
import { useLanguage, translateOrderStatus, callLangLabels } from "@/lib/language-context";
import { trd } from "@/lib/demo-translations";

const statusStyle: Record<string, string> = {
  Pending: "bg-warning/10 text-warning border-warning/20",
  Confirmed: "bg-success/10 text-success border-success/20",
  Cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  Partial: "bg-info/10 text-info border-info/20",
  Completed: "bg-primary/10 text-primary border-primary/20",
};

export default function DashboardOrders() {
  const { getShopOrders, updateOrderStatus } = useOrders();
  const { tr, lang } = useLanguage();
  const allOrders = getShopOrders("s1");
  const [tab, setTab] = useState<"active" | "completed">("active");

  const orders = tab === "active"
    ? allOrders.filter(o => o.status !== "Completed")
    : allOrders.filter(o => o.status === "Completed");

  const savedLang = (localStorage.getItem("callLang") as "en" | "hi") || "en";
  const [callLang, setCallLang] = useState<"en" | "hi">(savedLang);
  const [pendingLang, setPendingLang] = useState<"en" | "hi">(savedLang);
  const [saved, setSaved] = useState(true);

  const handleLangChange = (newLang: "en" | "hi") => {
    if (saved && newLang !== callLang) {
      setPendingLang(newLang);
      setSaved(false);
    }
  };

  const handleSave = () => {
    setCallLang(pendingLang);
    localStorage.setItem("callLang", pendingLang);
    setSaved(true);
    toast.success(lang === "en" ? "Call language saved!" : "कॉल भाषा सहेजी गई!");
  };

  const handleAction = (orderId: string, status: "Confirmed" | "Cancelled" | "Partial" | "Completed") => {
    updateOrderStatus(orderId, status);
    const msgs: Record<string, string> = {
      Confirmed: tr("dashOrders.orderApproved"),
      Cancelled: tr("dashOrders.orderCancelled"),
      Partial: tr("dashOrders.orderPartial"),
      Completed: tr("dashOrders.orderDelivered"),
    };
    toast.success(msgs[status]);
  };

  const clLabel = (key: string) => callLangLabels[key]?.[lang] || key;

  const completedCount = allOrders.filter(o => o.status === "Completed").length;
  const activeCount = allOrders.length - completedCount;

  return (
    <div className="space-y-6">
      {/* Call Language Toggle */}
      <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-card">
        <div className="flex items-center gap-3">
          <Globe className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-semibold text-foreground">{clLabel("callLang.title")}</p>
            <p className="text-xs text-muted-foreground">
              {clLabel("callLang.desc")}: <span className="font-medium text-foreground">{callLang === "en" ? clLabel("callLang.english") : clLabel("callLang.hindi")}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-lg border bg-muted p-1">
            <button
              onClick={() => handleLangChange("en")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${pendingLang === "en" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              English
            </button>
            <button
              onClick={() => handleLangChange("hi")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${pendingLang === "hi" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              हिंदी
            </button>
          </div>
          {!saved && (
            <Button size="sm" onClick={handleSave} className="gap-1">
              {lang === "en" ? "Save" : "सहेजें"}
            </Button>
          )}
        </div>
      </div>

      {/* Robocall simulator for pending orders */}
      <RobocallSimulator shopId="s1" callLang={callLang} />

      {/* Tabs */}
      <div className="flex gap-2 rounded-xl bg-muted/50 p-1.5">
        <button
          onClick={() => setTab("active")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
            tab === "active" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {tr("dashOrders.tabActive")}
          <span className={`flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${tab === "active" ? "bg-white/25" : "bg-muted text-muted-foreground"}`}>
            {activeCount}
          </span>
        </button>
        <button
          onClick={() => setTab("completed")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
            tab === "completed" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {tr("dashOrders.tabCompleted")}
          <span className={`flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${tab === "completed" ? "bg-white/25" : "bg-muted text-muted-foreground"}`}>
            {completedCount}
          </span>
        </button>
      </div>

      <h2 className="text-xl font-semibold text-foreground">{tr("dashOrders.title").replace("{count}", String(orders.length))}</h2>

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="rounded-xl border bg-card p-5 shadow-card">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{order.customer_name}</h3>
                <p className="text-xs text-muted-foreground">{new Date(order.timestamp).toLocaleString()}</p>
                {order.customer_phone && <p className="text-xs text-muted-foreground">📱 {tr("common.phone")}: {order.customer_phone}</p>}
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyle[order.status]}`}>
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
            <div className="mt-3 space-y-1">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{trd(item.product_name, lang)} × {item.quantity}</span>
                  <span className="text-foreground">₹{item.price}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t pt-3">
              <span className="text-sm font-medium text-muted-foreground">{tr("common.total")}</span>
              <span className="text-lg font-bold text-primary">₹{order.total_amount}</span>
            </div>
            {order.status === "Pending" && (
              <div className="mt-3 flex gap-2 border-t pt-3">
                <Button size="sm" className="gap-1 flex-1" onClick={() => handleAction(order.id, "Confirmed")}>
                  <CheckCircle className="h-3.5 w-3.5" /> {tr("dashOrders.approve")}
                </Button>
                <Button size="sm" variant="outline" className="gap-1 flex-1" onClick={() => handleAction(order.id, "Cancelled")}>
                  <XCircle className="h-3.5 w-3.5" /> {tr("dashOrders.cancel")}
                </Button>
                <Button size="sm" variant="outline" className="gap-1 flex-1" onClick={() => handleAction(order.id, "Partial")}>
                  <AlertTriangle className="h-3.5 w-3.5" /> {tr("dashOrders.partial")}
                </Button>
              </div>
            )}
            {order.status === "Confirmed" && (
              <div className="mt-3 border-t pt-3">
                <Button size="sm" className="w-full gap-1" onClick={() => handleAction(order.id, "Completed")}>
                  <PackageCheck className="h-3.5 w-3.5" /> {tr("dashOrders.delivered")}
                </Button>
              </div>
            )}
          </div>
        ))}
        {orders.length === 0 && (
          <div className="rounded-xl border bg-card py-12 text-center text-sm text-muted-foreground">
            {tab === "completed"
              ? (lang === "hi" ? "अभी तक कोई पूर्ण ऑर्डर नहीं" : "No completed orders yet")
              : (lang === "hi" ? "कोई सक्रिय ऑर्डर नहीं" : "No active orders")}
          </div>
        )}
      </div>
    </div>
  );
}
