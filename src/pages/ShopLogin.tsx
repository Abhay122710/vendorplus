import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { Store } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function ShopLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginWithUsername, logout } = useAuth();
  const navigate = useNavigate();
  const { tr } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await loginWithUsername(username, password);
    setLoading(false);

    if (!result.success) {
      toast.error(result.error || tr("login.invalidCreds"));
      return;
    }

    if (result.role !== "shopowner") {
      toast.error(tr("shopLogin.notShopkeeper"));
      await logout();
      return;
    }

    toast.success(tr("shopLogin.welcomeBack"));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container flex items-center justify-center py-20">
        <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-card">
          <div className="mb-6 flex flex-col items-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Store className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">{tr("shopLogin.title")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{tr("shopLogin.subtitle")}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">{tr("shopLogin.username")}</Label>
              <Input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder={tr("login.usernamePlaceholder")} required />
            </div>
            <div>
              <Label htmlFor="password">{tr("shopLogin.password")}</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={tr("login.passwordPlaceholder")} required />
            </div>
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                {tr("shopLogin.forgotPassword")}
              </Link>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? tr("shopLogin.signingIn") : tr("shopLogin.signIn")}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {tr("shopLogin.noShop")} <Link to="/register-shop" className="font-medium text-primary hover:underline">{tr("shopLogin.registerShop")}</Link>
          </p>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {tr("shopLogin.customer")} <Link to="/login" className="font-medium text-primary hover:underline">{tr("shopLogin.customerLogin")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
