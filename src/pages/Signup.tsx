import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import logo from "@/assets/logo.jpg";
import { useLanguage } from "@/lib/language-context";

export default function Signup() {
  const [form, setForm] = useState({ username: "", password: "", email: "", name: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { tr } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error(tr("signup.passwordError"));
      return;
    }
    setLoading(true);
    const result = await signup(form.email, form.password, form.name, form.phone, form.username);
    setLoading(false);
    if (result.success) {
      toast.success(tr("signup.success"));
      navigate("/marketplace");
    } else {
      toast.error(result.error || tr("signup.failed"));
    }
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container flex items-center justify-center py-20">
        <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-card">
          <div className="mb-6 flex flex-col items-center">
            <img src={logo} alt="Vendor+" className="mb-4 h-16 w-16 rounded-full object-cover" />
            <h1 className="text-2xl font-bold text-foreground">{tr("signup.title")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{tr("signup.subtitle")}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="signup-name">{tr("signup.fullName")}</Label>
              <Input
                id="signup-name"
                name="name"
                autoComplete="name"
                value={form.name}
                onChange={set("name")}
                placeholder={tr("signup.namePlaceholder")}
                required
              />
            </div>
            <div>
              <Label htmlFor="signup-email">{tr("signup.email")}</Label>
              <Input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={set("email")}
                placeholder={tr("signup.emailPlaceholder")}
                required
              />
            </div>
            <div>
              <Label htmlFor="signup-phone">{tr("signup.phone")}</Label>
              <Input
                id="signup-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={set("phone")}
                placeholder={tr("signup.phonePlaceholder")}
                required
              />
            </div>
            <div>
              <Label htmlFor="signup-username">{tr("signup.username")}</Label>
              <Input
                id="signup-username"
                name="username"
                autoComplete="username"
                value={form.username}
                onChange={set("username")}
                placeholder={tr("signup.usernamePlaceholder")}
                required
              />
            </div>
            <div>
              <Label htmlFor="signup-password">{tr("signup.password")}</Label>
              <Input
                id="signup-password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={set("password")}
                placeholder={tr("signup.passwordPlaceholder")}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? tr("signup.creating") : tr("signup.createAccount")}
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            {tr("signup.maxAccounts")}
          </p>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {tr("signup.haveAccount")} <Link to="/login" className="font-medium text-primary hover:underline">{tr("signup.signIn")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
