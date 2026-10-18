import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { useOrders } from "@/lib/order-context";
import { demoShops } from "@/lib/demo-data";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/lib/language-context";
import { trd } from "@/lib/demo-translations";

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, total, shopId } = useCart();
  const { user, profile } = useAuth();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();
  const shop = demoShops.find(s => s.id === shopId);
  const { tr, lang } = useLanguage();

  const handleCheckout = () => {
    if (!user) { toast.error(tr("cart.loginFirst")); navigate("/login"); return; }
    if (!shopId || !shop) return;

    const order = placeOrder({
      customer_name: profile?.name || user?.email || "Customer",
      customer_phone: profile?.phone || "",
      shop_id: shopId,
      total_amount: total,
      items: items.map((item, idx) => ({
        id: `oi_${Date.now()}_${idx}`,
        order_id: "",
        product_id: item.product.id,
        product_name: item.product.product_name,
        quantity: item.quantity,
        price: item.product.price * item.quantity,
      })),
    });

    toast.success(tr("cart.orderPlaced"), { duration: 5000 });
    clearCart();
    navigate("/marketplace");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-2xl py-8">
        <h1 className="mb-6 text-3xl font-bold text-foreground">{tr("cart.title")}</h1>

        {items.length === 0 ? (
          <div className="rounded-xl border bg-card p-12 text-center shadow-card">
            <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
            <p className="text-lg font-medium text-muted-foreground">{tr("cart.empty")}</p>
            <Button className="mt-4" onClick={() => navigate("/marketplace")}>{tr("cart.browseShops")}</Button>
          </div>
        ) : (
          <>
            {shop && <p className="mb-4 text-sm text-muted-foreground">{tr("cart.itemsFrom")} <span className="font-semibold text-foreground">{trd(shop.shop_name, lang)}</span></p>}
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.product.id} className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-card">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{trd(item.product.product_name, lang)}</h3>
                    <p className="text-sm text-primary font-medium">₹{item.product.price}/{trd(item.product.unit, lang)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                  </div>
                  <span className="w-20 text-right font-semibold text-foreground">₹{item.product.price * item.quantity}</span>
                  <Button size="icon" variant="ghost" onClick={() => removeItem(item.product.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl border bg-card p-6 shadow-card">
              <div className="flex items-center justify-between text-lg font-bold text-foreground">
                <span>{tr("cart.total")}</span>
                <span className="text-primary">₹{total}</span>
              </div>
              <Button className="mt-4 w-full" size="lg" onClick={handleCheckout}>{tr("cart.placeOrder")}</Button>
              <p className="mt-2 text-center text-xs text-muted-foreground">{tr("cart.robocallNote")}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
