import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useOrders } from "@/lib/order-context";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { demoShops, areaData } from "@/lib/demo-data";
import {
  LayoutDashboard, Store, ShoppingCart, Users, MapPin, LogOut, Phone,
  PhoneIncoming, Shield, Plus, Trash2, Edit, MessageSquare, Package, Save, X, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage, translateOrderStatus, translateComplaintStatus, translateCallStatus } from "@/lib/language-context";
import { trd } from "@/lib/demo-translations";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import logo from "@/assets/logo.jpg";

interface DBProduct {
  id: string;
  shop_id: string;
  product_name: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
  image: string | null;
  created_at: string;
}

interface DBShop {
  id: string;
  shop_name: string;
  owner_name: string;
  owner_id: string | null;
  category: string;
  phone: string;
  city: string;
  area: string;
  pincode: string;
  rating: number;
  description: string;
  image: string | null;
  approved: boolean;
  created_at: string;
}

interface DBComplaint {
  id: string;
  user_id: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const { user, profile, logout } = useAuth();
  const { orders, callLogs } = useOrders();
  const navigate = useNavigate();
  const [active, setActive] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tr, lang } = useLanguage();

  const navItems = [
    { id: "overview", label: tr("admin.dashboard"), icon: LayoutDashboard },
    { id: "products", label: tr("admin.products"), icon: Package },
    { id: "shops", label: tr("admin.shopRequests"), icon: Store },
    { id: "orders", label: tr("admin.orders"), icon: ShoppingCart },
    { id: "complaints", label: tr("admin.complaints"), icon: MessageSquare },
    { id: "heatmap", label: tr("admin.demandMap"), icon: MapPin },
    { id: "calls", label: tr("admin.callLogs"), icon: Phone },
  ];

  // DB state
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [shops, setShops] = useState<DBShop[]>([]);
  const [complaints, setComplaints] = useState<DBComplaint[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Product form
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState({ shop_id: "", product_name: "", category: "", price: "", unit: "piece", stock: "" });

  // Shop edit
  const [editingShop, setEditingShop] = useState<string | null>(null);
  const [shopEditForm, setShopEditForm] = useState<Partial<DBShop>>({});

  const fetchAll = async () => {
    setLoadingData(true);
    try {
      const [prodRes, shopRes, compRes] = await Promise.all([
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("shops").select("*").order("created_at", { ascending: false }),
        supabase.from("complaints").select("*").order("created_at", { ascending: false }),
      ]);
      if (prodRes.data) setProducts(prodRes.data as DBProduct[]);
      if (shopRes.data) setShops(shopRes.data as DBShop[]);
      if (compRes.data) setComplaints(compRes.data as DBComplaint[]);
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user && profile?.role === "admin") {
      fetchAll();
    }
  }, [user, profile]);

  if (!user || profile?.role !== "admin") return <Navigate to="/login" />;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Product CRUD
  const addProduct = async () => {
    if (!productForm.product_name || !productForm.shop_id) {
      toast.error(tr("admin.productRequired"));
      return;
    }
    const { error } = await supabase.from("products").insert({
      shop_id: productForm.shop_id,
      product_name: productForm.product_name,
      category: productForm.category,
      price: Number(productForm.price) || 0,
      unit: productForm.unit,
      stock: Number(productForm.stock) || 0,
    });
    if (error) {
      toast.error(tr("admin.failedAddProduct"));
    } else {
      toast.success(tr("admin.productAddedSuccess"));
      setShowProductForm(false);
      setProductForm({ shop_id: "", product_name: "", category: "", price: "", unit: "piece", stock: "" });
      fetchAll();
    }
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error(tr("admin.failedDelete"));
    else { toast.success(tr("admin.deleted")); fetchAll(); }
  };

  // Shop edit
  const startEditShop = (shop: DBShop) => {
    setEditingShop(shop.id);
    setShopEditForm({ ...shop });
  };

  const saveShop = async () => {
    if (!editingShop) return;
    const { error } = await supabase.from("shops").update({
      shop_name: shopEditForm.shop_name,
      owner_name: shopEditForm.owner_name,
      category: shopEditForm.category,
      phone: shopEditForm.phone,
      city: shopEditForm.city,
      area: shopEditForm.area,
      pincode: shopEditForm.pincode,
      description: shopEditForm.description,
      approved: shopEditForm.approved,
    }).eq("id", editingShop);
    if (error) toast.error(tr("admin.failedUpdateShop"));
    else { toast.success(tr("admin.shopUpdated")); setEditingShop(null); fetchAll(); }
  };

  const toggleApprove = async (shop: DBShop) => {
    const { error } = await supabase.from("shops").update({ approved: !shop.approved }).eq("id", shop.id);
    if (error) toast.error(tr("admin.failed"));
    else { toast.success(shop.approved ? tr("admin.shopDisapproved") : tr("admin.shopApproved")); fetchAll(); }
  };

  // Complaint status
  const updateComplaintStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("complaints").update({ status }).eq("id", id);
    if (error) toast.error(tr("admin.failed"));
    else { toast.success(tr("admin.markedAs").replace("{status}", status)); fetchAll(); }
  };

  const callStatusStyle: Record<string, string> = {
    initiated: "bg-warning/10 text-warning",
    completed: "bg-success/10 text-success",
    missed: "bg-destructive/10 text-destructive",
  };

  const allShops = [...demoShops, ...shops.map(s => ({ ...s, id: s.id }))];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-16"} flex flex-col border-r bg-sidebar transition-all duration-300`}>
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
          <img src={logo} alt="Vendor+" className="h-8 w-8 rounded-full" />
          {sidebarOpen && <span className="text-lg font-bold text-sidebar-foreground">{tr("admin.title").split(" ")[0]}<span className="text-sidebar-primary">{tr("admin.title").split(" ").slice(1).join(" ")}</span></span>}
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActive(item.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${active === item.id ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"}`}>
              <item.icon className="h-4 w-4 shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent">
            <LogOut className="h-4 w-4 shrink-0" />
            {sidebarOpen && <span>{tr("admin.logout")}</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-card/80 px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}><LayoutDashboard className="h-5 w-5" /></Button>
            <h1 className="text-lg font-semibold text-foreground capitalize">{navItems.find(n => n.id === active)?.label}</h1>
          </div>
          <span className="text-sm text-muted-foreground">Admin</span>
        </header>

        <div className="p-6">
          {/* OVERVIEW */}
          {active === "overview" && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: tr("admin.totalShops"), value: allShops.length, icon: Store },
                  { label: tr("admin.totalOrders"), value: orders.length, icon: ShoppingCart },
                  { label: tr("admin.dbProducts"), value: products.length, icon: Package },
                  { label: tr("admin.complaintsCount"), value: complaints.length, icon: MessageSquare },
                ].map(s => (
                  <div key={s.label} className="rounded-xl border bg-card p-5 shadow-card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{s.label}</p>
                        <p className="mt-1 text-2xl font-bold text-foreground">{s.value}</p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <s.icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRODUCTS */}
          {active === "products" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{tr("admin.productsInDb").replace("{count}", String(products.length))}</p>
                <Button size="sm" className="gap-1" onClick={() => setShowProductForm(!showProductForm)}>
                  {showProductForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {showProductForm ? tr("admin.cancel") : tr("admin.addProduct")}
                </Button>
              </div>

              {showProductForm && (
                <div className="rounded-xl border bg-card p-5 shadow-card space-y-3">
                  <h3 className="font-semibold text-foreground">{tr("admin.newProduct")}</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div><Label>{tr("admin.productName")}</Label><Input value={productForm.product_name} onChange={e => setProductForm(p => ({ ...p, product_name: e.target.value }))} /></div>
                    <div><Label>{tr("admin.shopId")}</Label><Input value={productForm.shop_id} onChange={e => setProductForm(p => ({ ...p, shop_id: e.target.value }))} placeholder={tr("admin.shopIdPlaceholder")} /></div>
                    <div><Label>{tr("admin.categoryLabel")}</Label><Input value={productForm.category} onChange={e => setProductForm(p => ({ ...p, category: e.target.value }))} /></div>
                    <div><Label>{tr("admin.price")}</Label><Input type="number" value={productForm.price} onChange={e => setProductForm(p => ({ ...p, price: e.target.value }))} /></div>
                    <div><Label>{tr("admin.unit")}</Label><Input value={productForm.unit} onChange={e => setProductForm(p => ({ ...p, unit: e.target.value }))} /></div>
                    <div><Label>{tr("admin.stock")}</Label><Input type="number" value={productForm.stock} onChange={e => setProductForm(p => ({ ...p, stock: e.target.value }))} /></div>
                  </div>
                  <Button className="gap-1" onClick={addProduct}><Save className="h-4 w-4" /> {tr("admin.saveProduct")}</Button>
                </div>
              )}

              {products.length === 0 && !showProductForm && (
                <div className="rounded-xl border bg-card p-8 text-center shadow-card">
                  <Package className="mx-auto h-10 w-10 text-muted-foreground/40" />
                  <p className="mt-2 text-muted-foreground">{tr("admin.noProducts")}</p>
                </div>
              )}

              {products.map(p => (
                <div key={p.id} className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-card">
                  <div>
                    <h3 className="font-semibold text-foreground">{p.product_name}</h3>
                    <p className="text-xs text-muted-foreground">{p.category} · ₹{p.price}/{p.unit} · Stock: {p.stock}</p>
                    <p className="text-xs text-muted-foreground">Shop: {p.shop_id}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => deleteProduct(p.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* SHOP REQUESTS */}
          {active === "shops" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{tr("admin.registeredShops").replace("{count}", String(shops.length))}</p>

              {shops.length === 0 && (
                <div className="rounded-xl border bg-card p-8 text-center shadow-card">
                  <Store className="mx-auto h-10 w-10 text-muted-foreground/40" />
                  <p className="mt-2 text-muted-foreground">{tr("admin.noShopRequests")}</p>
                </div>
              )}

              {shops.map(shop => (
                <div key={shop.id} className="rounded-xl border bg-card p-5 shadow-card">
                  {editingShop === shop.id ? (
                    <div className="space-y-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div><Label>{tr("admin.shopName")}</Label><Input value={shopEditForm.shop_name || ""} onChange={e => setShopEditForm(f => ({ ...f, shop_name: e.target.value }))} /></div>
                        <div><Label>{tr("admin.owner")}</Label><Input value={shopEditForm.owner_name || ""} onChange={e => setShopEditForm(f => ({ ...f, owner_name: e.target.value }))} /></div>
                        <div><Label>{tr("admin.shopCategory")}</Label><Input value={shopEditForm.category || ""} onChange={e => setShopEditForm(f => ({ ...f, category: e.target.value }))} /></div>
                        <div><Label>{tr("admin.shopPhone")}</Label><Input value={shopEditForm.phone || ""} onChange={e => setShopEditForm(f => ({ ...f, phone: e.target.value }))} /></div>
                        <div><Label>{tr("admin.shopCity")}</Label><Input value={shopEditForm.city || ""} onChange={e => setShopEditForm(f => ({ ...f, city: e.target.value }))} /></div>
                        <div><Label>{tr("admin.shopArea")}</Label><Input value={shopEditForm.area || ""} onChange={e => setShopEditForm(f => ({ ...f, area: e.target.value }))} /></div>
                        <div><Label>{tr("admin.shopPincode")}</Label><Input value={shopEditForm.pincode || ""} onChange={e => setShopEditForm(f => ({ ...f, pincode: e.target.value }))} /></div>
                        <div><Label>{tr("admin.shopDescription")}</Label><Input value={shopEditForm.description || ""} onChange={e => setShopEditForm(f => ({ ...f, description: e.target.value }))} /></div>
                      </div>
                      <div className="flex gap-2">
                      <Button size="sm" className="gap-1" onClick={saveShop}><Save className="h-4 w-4" /> {tr("admin.save")}</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingShop(null)}>{tr("admin.cancel")}</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{trd(shop.shop_name, lang)}</h3>
                        <p className="text-sm text-muted-foreground">{shop.owner_name} · {shop.area}, {shop.city}</p>
                        <p className="text-xs text-muted-foreground mt-1">📱 {shop.phone} · {shop.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${shop.approved ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                          {shop.approved ? tr("admin.approved") : tr("admin.pending")}
                        </span>
                        <Button variant="ghost" size="icon" onClick={() => toggleApprove(shop)}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => startEditShop(shop)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ORDERS */}
          {active === "orders" && (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="rounded-xl border bg-card p-5 shadow-card">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{order.customer_name}</h3>
                       <p className="text-xs text-muted-foreground">{tr("common.shop")}: {trd(demoShops.find(s => s.id === order.shop_id)?.shop_name || order.shop_id, lang)} · {new Date(order.timestamp).toLocaleString(lang === "hi" ? "hi-IN" : "en-IN")}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${order.status === "Confirmed" ? "bg-success/10 text-success" : order.status === "Pending" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>{translateOrderStatus(order.status, tr)}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{order.items.map(i => `${trd(i.product_name, lang)} ×${i.quantity}`).join(", ")}</p>
                  <p className="mt-1 font-semibold text-primary">₹{order.total_amount}</p>
                </div>
              ))}
            </div>
          )}

          {/* COMPLAINTS */}
          {active === "complaints" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{tr("admin.complaintsReceived").replace("{count}", String(complaints.length))}</p>

              {complaints.length === 0 && (
                <div className="rounded-xl border bg-card p-8 text-center shadow-card">
                  <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground/40" />
                  <p className="mt-2 text-muted-foreground">{tr("admin.noComplaints")}</p>
                </div>
              )}

              {complaints.map(c => (
                <div key={c.id} className="rounded-xl border bg-card p-5 shadow-card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground text-sm">{c.email}</p>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${c.status === "open" ? "bg-warning/10 text-warning" : c.status === "resolved" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                          {translateComplaintStatus(c.status, tr)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{c.message}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString(lang === "hi" ? "hi-IN" : "en-IN")}</p>
                    </div>
                    <div className="flex gap-1 ml-3">
                      {c.status !== "resolved" && (
                        <Button size="sm" variant="outline" className="text-xs gap-1" onClick={() => updateComplaintStatus(c.id, "resolved")}>
                          <Check className="h-3 w-3" /> {tr("admin.resolve")}
                        </Button>
                      )}
                      {c.status !== "closed" && (
                        <Button size="sm" variant="ghost" className="text-xs" onClick={() => updateComplaintStatus(c.id, "closed")}>
                          {tr("admin.close")}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* HEATMAP */}
          {active === "heatmap" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{tr("admin.areaDemand")}</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {areaData.map(area => (
                  <div key={area.area} className="rounded-xl border bg-card p-5 shadow-card">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-foreground">{trd(area.area, lang)}</h3>
                      <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${area.demand > 85 ? "bg-destructive/10 text-destructive" : area.demand > 60 ? "bg-warning/10 text-warning" : "bg-success/10 text-success"}`}>{area.demand}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden mb-3">
                      <div className={`h-full rounded-full ${area.demand > 85 ? "bg-destructive" : area.demand > 60 ? "bg-warning" : "bg-success"}`} style={{ width: `${area.demand}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground"><span className="font-medium">{tr("admin.top")}</span> {area.topProducts.map(p => trd(p, lang)).join(", ")}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CALLS */}
          {active === "calls" && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3 mb-6">
                <div className="rounded-xl border bg-card p-5 shadow-card">
                  <p className="text-sm text-muted-foreground">{tr("admin.totalCalls")}</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{callLogs.length}</p>
                </div>
                <div className="rounded-xl border bg-card p-5 shadow-card">
                  <p className="text-sm text-muted-foreground">{tr("admin.robocalls")}</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{callLogs.filter(c => c.type === "robocall").length}</p>
                </div>
                <div className="rounded-xl border bg-card p-5 shadow-card">
                  <p className="text-sm text-muted-foreground">{tr("admin.maskedCalls")}</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{callLogs.filter(c => c.type === "masked").length}</p>
                </div>
              </div>
              {callLogs.map(log => (
                <div key={log.id} className="rounded-xl border bg-card p-5 shadow-card">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${log.type === "robocall" ? "bg-primary/10" : "bg-info/10"}`}>
                        {log.type === "robocall" ? <PhoneIncoming className="h-5 w-5 text-primary" /> : <Shield className="h-5 w-5 text-info" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{log.type === "robocall" ? "🤖 Robocall" : "🔒 Masked Call"}</h3>
                        <p className="text-xs text-muted-foreground">{log.caller_name} → {log.receiver_name}</p>
                        <p className="text-xs text-muted-foreground">{tr("admin.maskedNumber")}: {log.masked_number} · {new Date(log.timestamp).toLocaleString(lang === "hi" ? "hi-IN" : "en-IN")}</p>
                      </div>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${callStatusStyle[log.status]}`}>{translateCallStatus(log.status, tr)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
