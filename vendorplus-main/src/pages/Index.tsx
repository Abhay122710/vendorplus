import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Store, BarChart3, Brain, ShieldCheck, MapPin, TrendingUp, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/lib/language-context";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const } }),
};

const featureKeys = [
  { icon: Store, titleKey: "feat.shopLocal.title", descKey: "feat.shopLocal.desc" },
  { icon: BarChart3, titleKey: "feat.analytics.title", descKey: "feat.analytics.desc" },
  { icon: Brain, titleKey: "feat.ai.title", descKey: "feat.ai.desc" },
  { icon: MapPin, titleKey: "feat.heatmap.title", descKey: "feat.heatmap.desc" },
  { icon: ShieldCheck, titleKey: "feat.secure.title", descKey: "feat.secure.desc" },
  { icon: TrendingUp, titleKey: "feat.competition.title", descKey: "feat.competition.desc" },
];

const stepKeys = [
  { step: "01", titleKey: "how.step1.title", descKey: "how.step1.desc" },
  { step: "02", titleKey: "how.step2.title", descKey: "how.step2.desc" },
  { step: "03", titleKey: "how.step3.title", descKey: "how.step3.desc" },
  { step: "04", titleKey: "how.step4.title", descKey: "how.step4.desc" },
];

export default function Index() {
  const { tr } = useLanguage();

  return (
    <motion.div
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-[0.04]" />
        <div className="absolute top-20 -right-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-40 h-[400px] w-[400px] rounded-full bg-accent/5 blur-3xl" />
        <div className="container relative py-20 md:py-32 lg:py-40">
          <motion.div initial="hidden" animate="visible" className="mx-auto max-w-3xl text-center">
            <motion.h1 variants={fadeUp} custom={0} className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl leading-[1.1]">
              {tr("hero.title1")}{" "}
              <span className="text-primary">{tr("hero.title2")}</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={1} className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg leading-relaxed">
              {tr("hero.desc")}
            </motion.p>
            <motion.div variants={fadeUp} custom={2} className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/marketplace">
                <Button size="lg" className="gap-2 px-6 shadow-sm">
                  {tr("hero.browseShops")} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/register-shop">
                <Button size="lg" variant="outline" className="px-6">{tr("hero.registerShop")}</Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="secondary" className="px-6">{tr("hero.customerLogin")}</Button>
              </Link>
              <Link to="/shop-login">
                <Button size="lg" variant="secondary" className="px-6">{tr("hero.shopkeeperLogin")}</Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t bg-muted/40 py-20">
        <div className="container">
          <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl">{tr("how.title")}</h2>
          <p className="mx-auto mt-3 max-w-md text-center text-sm text-muted-foreground">Simple steps to get started with Vendor+</p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stepKeys.map((s, i) => (
              <motion.div
                key={s.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="rounded-xl bg-card p-6 shadow-stat text-center transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5"
              >
                <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                  {s.step}
                </div>
                <h3 className="text-sm font-semibold text-foreground">{tr(s.titleKey)}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{tr(s.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl">{tr("features.title")}</h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-sm text-muted-foreground">
            Everything you need to manage and grow your local business
          </p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featureKeys.map((f, i) => (
              <motion.div
                key={f.titleKey}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="group rounded-xl border bg-card p-6 shadow-stat transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 transition-transform group-hover:scale-105">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">{tr(f.titleKey)}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{tr(f.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-12">
        <div className="container flex flex-col items-center gap-3 text-center text-sm text-muted-foreground">
          <h4 className="text-sm font-semibold text-foreground">Vendor+</h4>
          <p className="max-w-md text-xs leading-relaxed">{tr("footer.desc")}</p>
        </div>
        <div className="container mt-8 border-t pt-6 text-center text-[11px] text-muted-foreground/70">
          {tr("footer.rights")}
        </div>
      </footer>
    </motion.div>
  );
}
