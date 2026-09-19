import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import logo from "@/assets/logo.jpg";
import { Store, User, MapPin } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

const shopCategories = [
  "Confectionary", "Fruit Shop", "General Store", "Stationary",
  "Grocery", "Bakery", "Pharmacy", "Electronics", "Clothing", "Other"
];

export default function RegisterShop() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { tr } = useLanguage();

  const [userForm, setUserForm] = useState({ username: "", password: "", email: "", name: "", phone: "" });
  const [shopForm, setShopForm] = useState({ shop_name: "", category: "", description: "", city: "", area: "", pincode: "", phone: "" });

  const setUser = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setUserForm(prev => ({ ...prev, [key]: e.target.value }));

  const setShop = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setShopForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (userForm.password.length < 6) {
      toast.error(tr("signup.passwordError"));
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopForm.shop_name || !shopForm.category) {
      toast.error(tr("help.fillAll"));
      return;
    }
    setLoading(true);

    const result = await signup(userForm.email, userForm.password, userForm.name, userForm.phone, userForm.username);
    if (!result.success) {
      toast.error(result.error || tr("signup.failed"));
      setLoading(false);
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      await new Promise(r => setTimeout(r, 1500));
    }
    const { data: { session: currentSession } } = await supabase.auth.getSession();

    if (!currentSession) {
      toast.error(tr("login.invalidCreds"));
      setLoading(false);
      navigate("/login");
      return;
    }

    await supabase.from("profiles").update({ role: "shopowner" }).eq("id", currentSession.user.id);

    const { error: shopError } = await supabase.from("shops").insert({
      shop_name: shopForm.shop_name,
      owner_id: currentSession.user.id,
      owner_name: userForm.name,
      category: shopForm.category,
      description: shopForm.description,
      phone: shopForm.phone || userForm.phone,
      city: shopForm.city,
      area: shopForm.area,
      pincode: shopForm.pincode,
      approved: false,
    });

    if (shopError) {
      toast.error(shopError.message);
    } else {
      toast.success(tr("register.success"));
    }

    setLoading(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container flex items-center justify-center py-12">
        <div className="w-full max-w-lg rounded-2xl border bg-card p-8 shadow-card">
          <div className="mb-6 flex flex-col items-center">
            <img src={logo} alt="Vendor+" className="mb-4 h-16 w-16 rounded-full object-cover" />
            <h1 className="text-2xl font-bold text-foreground">{tr("register.title")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {step === 1 ? tr("register.step1") : tr("register.step2")}
            </p>
            <div className="mt-4 flex gap-2">
              <div className={`h-2 w-16 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
              <div className={`h-2 w-16 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
            </div>
          </div>

          {step === 1 ? (
            <form onSubmit={handleNext} className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                <User className="h-4 w-4" /> {tr("register.ownerDetails")}
              </div>
              <div><Label>{tr("register.fullName")}</Label><Input value={userForm.name} onChange={setUser("name")} placeholder={tr("signup.namePlaceholder")} required /></div>
              <div><Label>{tr("register.email")}</Label><Input type="email" value={userForm.email} onChange={setUser("email")} placeholder={tr("signup.emailPlaceholder")} required /></div>
              <div><Label>{tr("register.phone")}</Label><Input value={userForm.phone} onChange={setUser("phone")} placeholder={tr("signup.phonePlaceholder")} required /></div>
              <div><Label>{tr("register.username")}</Label><Input value={userForm.username} onChange={setUser("username")} placeholder={tr("signup.usernamePlaceholder")} required /></div>
              <div><Label>{tr("register.password")}</Label><Input type="password" value={userForm.password} onChange={setUser("password")} placeholder={tr("signup.passwordPlaceholder")} required /></div>
              <Button type="submit" className="w-full">{tr("register.next")}</Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                <Store className="h-4 w-4" /> {tr("register.shopDetails")}
              </div>
              <div><Label>{tr("register.shopName")}</Label><Input value={shopForm.shop_name} onChange={setShop("shop_name")} placeholder="e.g. Big Bite Confectionary" required /></div>
              <div>
                <Label>{tr("register.category")}</Label>
                <Select value={shopForm.category} onValueChange={v => setShopForm(prev => ({ ...prev, category: v }))}>
                  <SelectTrigger><SelectValue placeholder={tr("register.selectCategory")} /></SelectTrigger>
                  <SelectContent>
                    {shopCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>{tr("register.description")}</Label><Textarea value={shopForm.description} onChange={setShop("description")} placeholder={tr("register.descPlaceholder")} rows={3} /></div>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mt-4 mb-2">
                <MapPin className="h-4 w-4" /> {tr("register.location")}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>{tr("register.city")}</Label><Input value={shopForm.city} onChange={setShop("city")} placeholder={tr("register.city")} required /></div>
                <div><Label>{tr("register.pincode")}</Label><Input value={shopForm.pincode} onChange={setShop("pincode")} placeholder="248007" required /></div>
              </div>
              <div><Label>{tr("register.area")}</Label><Input value={shopForm.area} onChange={setShop("area")} placeholder="e.g. Bidholi, UPES" required /></div>
              <div><Label>{tr("register.shopPhone")}</Label><Input value={shopForm.phone} onChange={setShop("phone")} placeholder={tr("register.shopPhonePlaceholder")} /></div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>{tr("register.back")}</Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? tr("register.registering") : tr("register.submit")}
                </Button>
              </div>
            </form>
          )}

          <p className="mt-4 text-center text-sm text-muted-foreground">
            {tr("register.haveAccount")} <Link to="/login" className="font-medium text-primary hover:underline">{tr("register.signIn")}</Link>
          </p>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            {tr("register.customerSignup")} <Link to="/signup" className="font-medium text-primary hover:underline">{tr("register.customerLink")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
