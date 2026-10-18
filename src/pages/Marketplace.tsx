import { useState } from "react";
import { Link } from "react-router-dom";
import { demoShops } from "@/lib/demo-data";
import { Star, MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/lib/language-context";
import { trd } from "@/lib/demo-translations";

const categoryColors: Record<string, string> = {
  Confectionary: "bg-primary/10 text-primary",
  "Fruit Shop": "bg-success/10 text-success",
  Café: "bg-info/10 text-info",
  Stationary: "bg-accent/10 text-accent",
  "Juice Bar": "bg-warning/10 text-warning",
  "General Store": "bg-secondary text-secondary-foreground",
};

export default function Marketplace() {
  const [search, setSearch] = useState("");
  const { tr, lang } = useLanguage();
  const shops = demoShops.filter(s => s.approved && (s.shop_name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase())));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{tr("marketplace.title")}</h1>
          <p className="mt-1 text-muted-foreground">{tr("marketplace.subtitle")}</p>
        </div>

        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder={tr("marketplace.searchPlaceholder")} value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shops.map((shop, i) => (
            <motion.div key={shop.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="group rounded-xl border bg-card p-6 shadow-card transition-all hover:shadow-card-hover">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{trd(shop.shop_name, lang)}</h3>
                  <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[shop.category] || "bg-muted text-muted-foreground"}`}>{trd(shop.category, lang)}</span>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5">
                  <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                  <span className="text-sm font-semibold text-primary">{shop.rating}</span>
                </div>
              </div>
              <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{trd(shop.description, lang)}</p>
              <div className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> {trd(shop.area, lang)}, {trd(shop.city, lang)}
              </div>
              <div>
                <Link to={`/shop/${shop.id}`} className="w-full"><Button size="sm" className="w-full">{tr("marketplace.viewProducts")}</Button></Link>
              </div>
            </motion.div>
          ))}
        </div>

        {shops.length === 0 && <p className="mt-12 text-center text-muted-foreground">{tr("marketplace.noShops")}</p>}
      </div>
    </div>
  );
}
