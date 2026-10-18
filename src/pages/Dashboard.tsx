import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Package, ShoppingCart, Brain, TrendingUp, FileText,
  LogOut, LayoutDashboard, Globe, ChevronLeft, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import DashboardProducts from "@/components/dashboard/DashboardProducts";
import DashboardOrders from "@/components/dashboard/DashboardOrders";
import DashboardCompetition from "@/components/dashboard/DashboardCompetition";
import DashboardReports from "@/components/dashboard/DashboardReports";
import DashboardAIHub from "@/components/dashboard/DashboardAIHub";
import logo from "@/assets/logo.jpg";
import { useLanguage } from "@/lib/language-context";

const navItems = [
  { id: "overview", icon: LayoutDashboard, labelKey: "dash.dashboard" },
  { id: "products", icon: Package, labelKey: "dash.products" },
  { id: "orders", icon: ShoppingCart, labelKey: "dash.orders" },
  { id: "ai-hub", icon: Brain, labelKey: "dash.aiHub" },
  { id: "competition", icon: TrendingUp, labelKey: "dash.competition" },
  { id: "reports", icon: FileText, labelKey: "dash.reports" },
];

export default function Dashboard() {
  const { user, profile, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const { tr, lang, setLang } = useLanguage();

  if (loading || (user && !profile))
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">{tr("dash.loading")}</span>
        </div>
      </div>
    );

  if (!user || profile?.role !== "shopowner") return <Navigate to="/login" />;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  const toggleLang = () => setLang(lang === "en" ? "hi" : "en");

  const renderContent = () => {
    switch (active) {
      case "overview": return <DashboardOverview />;
      case "products": return <DashboardProducts />;
      case "orders": return <DashboardOrders />;
      case "ai-hub": return <DashboardAIHub />;
      case "competition": return <DashboardCompetition />;
      case "reports": return <DashboardReports />;
      default: return <DashboardOverview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${collapsed ? "w-[68px]" : "w-60"} relative flex flex-col border-r bg-sidebar transition-all duration-300 ease-in-out`}
      >
        {/* Logo */}
        <div
          className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-4 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="Vendor+" className="h-8 w-8 rounded-lg object-cover shadow-sm" />
          {!collapsed && (
            <span className="text-lg font-bold text-sidebar-foreground tracking-tight">
              Vendor<span className="text-sidebar-primary">+</span>
            </span>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 space-y-0.5 p-2 mt-2">
          {navItems.map((item) => {
            const isActive = active === item.id;
            const btn = (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`group flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className={`h-[18px] w-[18px] shrink-0 transition-colors ${isActive ? "" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80"}`} />
                {!collapsed && <span>{tr(item.labelKey)}</span>}
              </button>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>{btn}</TooltipTrigger>
                  <TooltipContent side="right" className="text-xs">{tr(item.labelKey)}</TooltipContent>
                </Tooltip>
              );
            }
            return btn;
          })}
        </nav>

        {/* Bottom actions */}
        <div className="border-t border-sidebar-border p-2 space-y-0.5">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
          >
            <LogOut className="h-[18px] w-[18px] shrink-0 text-sidebar-foreground/50" />
            {!collapsed && <span>{tr("dash.logout")}</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border bg-card text-muted-foreground shadow-sm hover:bg-muted transition-colors"
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto dashboard-scroll">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-card/90 px-6 backdrop-blur-md">
          <h1 className="text-[15px] font-semibold text-foreground">
            {navItems.find((n) => n.id === active)?.labelKey
              ? tr(navItems.find((n) => n.id === active)!.labelKey)
              : "Dashboard"}
          </h1>
          <div className="flex items-center gap-3 text-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLang}
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground h-8"
            >
              <Globe className="h-3.5 w-3.5" />
              {tr("lang.switch")}
            </Button>
            <div className="h-5 w-px bg-border" />
            <span className="text-xs text-muted-foreground">
              {profile?.name || user?.email || tr("dash.shopOwner")}
            </span>
          </div>
        </header>

        {/* Page content */}
        <div className="p-6 page-enter">{renderContent()}</div>
      </main>
    </div>
  );
}
