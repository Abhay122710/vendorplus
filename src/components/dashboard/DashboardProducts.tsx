import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, AlertTriangle, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useLanguage } from "@/lib/language-context";
import { trd } from "@/lib/demo-translations";

interface Product {
  id: string;
  product_name: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
  shop_id: string;
  image: string | null;
}

const defaultForm = { product_name: "", category: "", price: 0, unit: "piece", stock: 0 };
const units = ["piece", "kg", "packet", "dozen", "box", "glass", "plate", "bundle"];

export default function DashboardProducts() {
  const { user } = useAuth();
  const { tr, lang } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [shopId, setShopId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<"all" | "out_of_stock" | "low_stock">("all");

  useEffect(() => {
    if (user) fetchShopAndProducts();
  }, [user]);

  const fetchShopAndProducts = async () => {
    setLoading(true);
    // Get shop owned by this user
    const { data: shops } = await supabase
      .from("shops")
      .select("id")
      .eq("owner_id", user!.id)
      .limit(1);

    if (shops && shops.length > 0) {
      const sid = shops[0].id;
      setShopId(sid);
      const { data: prods } = await supabase
        .from("products")
        .select("*")
        .eq("shop_id", sid)
        .order("product_name");
      setProducts((prods as Product[]) || []);
    }
    setLoading(false);
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(defaultForm);
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({ product_name: p.product_name, category: p.category, price: p.price, unit: p.unit, stock: p.stock });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.product_name || !shopId) return;
    setSaving(true);

    if (editingId) {
      const { error } = await supabase.from("products").update({
        product_name: form.product_name,
        category: form.category,
        price: form.price,
        unit: form.unit,
        stock: form.stock,
      }).eq("id", editingId);
      if (error) toast.error(error.message);
      else toast.success(tr("dashProducts.productUpdated"));
    } else {
      const { error } = await supabase.from("products").insert({
        product_name: form.product_name,
        category: form.category,
        price: form.price,
        unit: form.unit,
        stock: form.stock,
        shop_id: shopId,
      });
      if (error) toast.error(error.message);
      else toast.success(tr("dashProducts.productAdded"));
    }

    setSaving(false);
    setDialogOpen(false);
    fetchShopAndProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(tr("dashProducts.deleteConfirm"))) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success(tr("dashProducts.productDeleted"));
      fetchShopAndProducts();
    }
  };

  const filtered = products.filter(p => {
    if (filter === "out_of_stock") return p.stock === 0;
    if (filter === "low_stock") return p.stock > 0 && p.stock <= 10;
    return true;
  });

  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 10).length;

  if (loading) return <div className="flex items-center justify-center py-20 text-muted-foreground">{tr("dashProducts.loading")}</div>;
  if (!shopId) return <div className="text-center py-20 text-muted-foreground">{tr("dashProducts.noShop")}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{tr("dashProducts.title")}</h2>
          <p className="text-sm text-muted-foreground">{tr("dashProducts.productsTotal").replace("{count}", String(products.length))}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2" onClick={openAdd}><Plus className="h-4 w-4" /> {tr("dashProducts.addProduct")}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? tr("dashProducts.editProduct") : tr("dashProducts.addProduct")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>{tr("dashProducts.productName")}</Label><Input value={form.product_name} onChange={e => setForm(f => ({ ...f, product_name: e.target.value }))} placeholder={tr("dashProducts.productNamePlaceholder")} required /></div>
              <div><Label>{tr("common.category")}</Label><Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder={tr("dashProducts.categoryPlaceholder")} /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label>{tr("common.price")} (₹)</Label><Input type="number" min={0} value={form.price} onChange={e => setForm(f => ({ ...f, price: +e.target.value }))} /></div>
                <div>
                  <Label>{tr("common.unit")}</Label>
                  <Select value={form.unit} onValueChange={v => setForm(f => ({ ...f, unit: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{units.map(u => <SelectItem key={u} value={u}>{trd(u, lang)}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>{tr("common.stock")}</Label><Input type="number" min={0} value={form.stock} onChange={e => setForm(f => ({ ...f, stock: +e.target.value }))} /></div>
              </div>
              <Button className="w-full" disabled={saving || !form.product_name} onClick={handleSave}>
                {saving ? tr("dashProducts.saving") : editingId ? tr("dashProducts.updateProduct") : tr("dashProducts.addProduct")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stock alerts */}
      {(outOfStockCount > 0 || lowStockCount > 0) && (
        <div className="flex flex-wrap gap-3">
          {outOfStockCount > 0 && (
            <button onClick={() => setFilter(f => f === "out_of_stock" ? "all" : "out_of_stock")}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${filter === "out_of_stock" ? "border-destructive bg-destructive/10 text-destructive" : "border-border text-muted-foreground hover:bg-muted"}`}>
              <AlertTriangle className="h-4 w-4" />
              {outOfStockCount} {tr("dashProducts.outOfStock")}
            </button>
          )}
          {lowStockCount > 0 && (
            <button onClick={() => setFilter(f => f === "low_stock" ? "all" : "low_stock")}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${filter === "low_stock" ? "border-warning bg-warning/10 text-warning" : "border-border text-muted-foreground hover:bg-muted"}`}>
              <Package className="h-4 w-4" />
              {lowStockCount} {tr("dashProducts.lowStock")}
            </button>
          )}
          {filter !== "all" && (
            <button onClick={() => setFilter("all")} className="text-sm text-primary hover:underline">{tr("common.showAll")}</button>
          )}
        </div>
      )}

      <div className="rounded-xl border bg-card shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{tr("common.product")}</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{tr("common.category")}</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">{tr("common.price")}</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">{tr("common.stock")}</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">{tr("common.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                {filter !== "all" ? tr("dashProducts.noProductsFilter") : tr("dashProducts.noProductsYet")}
              </td></tr>
            )}
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">
                  <div className="flex items-center gap-2">
                    {trd(p.product_name, lang)}
                    {p.stock === 0 && <Badge variant="destructive" className="text-[10px]">{tr("dashProducts.outOfStock")}</Badge>}
                    {p.stock > 0 && p.stock <= 10 && <Badge variant="secondary" className="text-[10px] border-warning text-warning">{tr("dashProducts.lowStock")}</Badge>}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{trd(p.category, lang)}</td>
                <td className="px-4 py-3 text-right text-foreground">₹{p.price}/{trd(p.unit, lang)}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`font-medium ${p.stock === 0 ? "text-destructive" : p.stock <= 10 ? "text-warning" : "text-primary"}`}>{p.stock}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(p)}><Edit className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
