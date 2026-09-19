import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import logo from "@/assets/logo.jpg";
import { useLanguage } from "@/lib/language-context";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginWithUsername } = useAuth();
  const navigate = useNavigate();
  const { tr } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await loginWithUsername(username, password);
    setLoading(false);
    if (result.success) {
      toast.success(tr("login.welcomeBack"));
      const { data: profileData } = await supabase
        .from("profiles")
        .select("role")
        .eq("username", username)
        .single();
      if (profileData?.role === "admin") {
        navigate("/admin");
      } else if (profileData?.role === "shopowner") {
        navigate("/dashboard");
      } else {
        navigate("/marketplace");
      }
    } else {
      toast.error(result.error || tr("login.invalidCreds"));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container flex items-center justify-center py-20">
        <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-card">
          <div className="mb-6 flex flex-col items-center">
            <img src={logo} alt="Vendor+" className="mb-4 h-16 w-16 rounded-full object-cover" />
            <h1 className="text-2xl font-bold text-foreground">{tr("login.welcome")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{tr("login.subtitle")}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">{tr("login.username")}</Label>
              <Input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder={tr("login.usernamePlaceholder")} required />
            </div>
            <div>
              <Label htmlFor="password">{tr("login.password")}</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={tr("login.passwordPlaceholder")} required />
            </div>
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                {tr("login.forgotPassword")}
              </Link>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? tr("login.signingIn") : tr("login.signIn")}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {tr("login.noAccount")} <Link to="/signup" className="font-medium text-primary hover:underline">{tr("login.signUp")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
