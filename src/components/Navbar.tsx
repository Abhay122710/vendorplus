import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useLanguage, translateRole } from "@/lib/language-context";
import { ShoppingCart, LogOut, User, Menu, X, ClipboardList, Mail, Phone, ShieldCheck, HelpCircle, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import logo from "@/assets/logo.jpg";
import { useState } from "react";

export default function Navbar() {
  const { user, profile, logout } = useAuth();
  const { items } = useCart();
  const { lang, setLang, tr } = useLanguage();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const toggleLang = () => setLang(lang === "en" ? "hi" : "en");

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Vendor+" className="h-10 w-10 rounded-full object-cover" />
          <span className="text-xl font-bold text-foreground">Vendor<span className="text-primary">+</span></span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Language toggle */}
          <Button variant="ghost" size="sm" onClick={toggleLang} className="gap-1.5 text-muted-foreground hover:text-foreground">
            <Globe className="h-4 w-4" />
            {tr("lang.switch")}
          </Button>

          <Link to="/marketplace" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{tr("nav.browseShops")}</Link>
          <Link to="/help" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"><HelpCircle className="h-3.5 w-3.5" />{tr("nav.help")}</Link>
          {user ? (
            <>
              {profile?.role === "admin" && <Link to="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{tr("nav.admin")}</Link>}
              {profile?.role === "shopowner" && <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{tr("nav.dashboard")}</Link>}

              {(!profile?.role || profile?.role === "customer") && (
                <Link to="/orders" className="relative text-muted-foreground hover:text-foreground transition-colors" title={tr("nav.myOrders")}>
                  <ClipboardList className="h-5 w-5" />
                </Link>
              )}

              {(!profile?.role || profile?.role === "customer") && (
                <Link to="/cart" className="relative text-muted-foreground hover:text-foreground transition-colors">
                  <ShoppingCart className="h-5 w-5" />
                  {items.length > 0 && <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{items.length}</span>}
                </Link>
              )}

              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-1.5 rounded-full bg-secondary p-1 pr-3 transition-colors hover:bg-secondary/80">
                    <Avatar className="h-7 w-7 border border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                        {(profile?.name || user?.email || "U").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-secondary-foreground max-w-[100px] truncate">
                      {profile?.name || user?.email?.split("@")[0] || "User"}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-72 p-0">
                  <div className="flex flex-col items-center gap-2 p-5 pb-3">
                    <Avatar className="h-14 w-14 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-lg font-bold text-primary">
                        {(profile?.name || user?.email || "U").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <p className="font-semibold text-foreground">{profile?.name || tr("navbar.user")}</p>
                      <span className="mt-0.5 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary capitalize">
                        <ShieldCheck className="mr-1 h-3 w-3" />
                        {translateRole(profile?.role || "customer", tr)}
                      </span>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2 p-4 text-sm">
                    <div className="flex items-center gap-2.5 text-muted-foreground">
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{profile?.email || user?.email || "—"}</span>
                    </div>
                    {profile?.phone && (
                      <div className="flex items-center gap-2.5 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5 shrink-0" />
                        <span>{profile.phone}</span>
                      </div>
                    )}
                    {profile?.username && (
                      <div className="flex items-center gap-2.5 text-muted-foreground">
                        <User className="h-3.5 w-3.5 shrink-0" />
                        <span>@{profile.username}</span>
                      </div>
                    )}
                  </div>
                  <Separator />
                  <div className="p-2">
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-destructive hover:text-destructive" onClick={handleLogout}>
                      <LogOut className="h-4 w-4" /> {tr("nav.logout")}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </>
          ) : (
            <>
              <Link to="/login"><Button variant="outline" size="sm">{tr("nav.login")}</Button></Link>
              <Link to="/signup"><Button size="sm">{tr("nav.signup")}</Button></Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-card p-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Button variant="ghost" size="sm" onClick={toggleLang} className="justify-start gap-2">
              <Globe className="h-4 w-4" /> {tr("lang.switch")}
            </Button>
            <Link to="/marketplace" className="text-sm font-medium" onClick={() => setMobileOpen(false)}>{tr("nav.browseShops")}</Link>
            <Link to="/help" className="text-sm font-medium" onClick={() => setMobileOpen(false)}>{tr("nav.help")}</Link>
            {user ? (
              <>
                {profile?.role === "admin" && <Link to="/admin" className="text-sm font-medium" onClick={() => setMobileOpen(false)}>{tr("nav.admin")}</Link>}
                {profile?.role === "shopowner" && <Link to="/dashboard" className="text-sm font-medium" onClick={() => setMobileOpen(false)}>{tr("nav.dashboard")}</Link>}
                {(!profile?.role || profile?.role === "customer") && (
                  <>
                    <Link to="/orders" className="text-sm font-medium" onClick={() => setMobileOpen(false)}>{tr("nav.myOrders")}</Link>
                    <Link to="/cart" className="text-sm font-medium" onClick={() => setMobileOpen(false)}>{tr("nav.cart")} ({items.length})</Link>
                  </>
                )}
                <Button variant="ghost" size="sm" onClick={() => { handleLogout(); setMobileOpen(false); }}>{tr("nav.logout")}</Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}><Button variant="outline" size="sm" className="w-full">{tr("nav.login")}</Button></Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)}><Button size="sm" className="w-full">{tr("nav.signup")}</Button></Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
