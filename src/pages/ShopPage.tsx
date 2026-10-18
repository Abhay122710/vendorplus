import { useParams } from "react-router-dom";
import { demoShops, demoProducts } from "@/lib/demo-data";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { Star, MapPin, ShoppingCart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import { trd } from "@/lib/demo-translations";

export default function ShopPage() {
  const { id } = useParams();
  const shop = demoShops.find(s => s.id === id);
  const products = demoProducts.filter(p => p.shop_id === id);
  const { addItem } = useCart();
  const { user, profile } = useAuth();
  const { tr, lang } = useLanguage();

  if (!shop) return <div className="min-h-screen bg-background"><Navbar /><div className="container py-20 text-center text-muted-foreground">{tr("shop.notFound")}</div></div>;

  const handleAdd = (product: typeof products[0]) => {
    if (!user) { toast.error(tr("shop.loginToAdd")); return; }
    if (profile?.role && profile.role !== "customer") { toast.error(tr("shop.onlyCustomers")); return; }
    addItem(product, shop.id);
    toast.success(`${trd(product.product_name, lang)} ${tr("shop.addedToCart")}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <div className="mb-8 rounded-2xl border bg-card p-8 shadow-card">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{trd(shop.shop_name, lang)}</h1>
            <p className="mt-2 text-muted-foreground">{trd(shop.description, lang)}</p>
            <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-primary text-primary" /> {shop.rating}</span>
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {trd(shop.area, lang)}, {trd(shop.city, lang)}</span>
            </div>
          </div>
        </div>

        <h2 className="mb-6 text-xl font-semibold text-foreground">{tr("shop.products")} ({products.length})</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.04, type: "spring", stiffness: 260, damping: 20 }}
              whileHover={{ y: -6, scale: 1.03, boxShadow: "0 20px 40px -12px hsl(var(--primary) / 0.15)" }}
              whileTap={{ scale: 0.97 }}
              className="group cursor-pointer rounded-xl border bg-card p-5 shadow-card transition-colors hover:border-primary/30"
            >
              <div className="relative mb-3 flex h-24 items-center justify-center overflow-hidden rounded-lg bg-muted/40">
                <Package className="h-10 w-10 text-muted-foreground/40" />
                {p.stock > 0 && p.stock <= 5 && (
                  <span className="absolute right-2 top-2 rounded-full bg-warning/90 px-2 py-0.5 text-[10px] font-bold text-warning-foreground">
                    {tr("shop.onlyLeft").replace("{n}", String(p.stock))}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary">{trd(p.product_name, lang)}</h3>
              <p className="text-xs text-muted-foreground">{trd(p.category, lang)}</p>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-primary">₹{p.price}</span>
                  <span className="ml-1 text-xs text-muted-foreground">/{trd(p.unit, lang)}</span>
                </div>
                <span className={`text-xs font-medium ${p.stock > 0 ? "text-success" : "text-destructive"}`}>
                  {p.stock > 0 ? `${p.stock} ${tr("shop.inStock")}` : tr("shop.outOfStock")}
                </span>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
                <Button size="sm" className="mt-3 w-full gap-2 transition-all" disabled={p.stock === 0} onClick={() => handleAdd(p)}>
                  <ShoppingCart className="h-4 w-4" /> {tr("shop.addToCart")}
                </Button>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
