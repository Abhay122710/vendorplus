import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import logo from "@/assets/logo.jpg";
import { useLanguage } from "@/lib/language-context";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const { tr } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error(tr("reset.minLength")); return; }
    if (password !== confirm) { toast.error(tr("reset.mismatch")); return; }
    setLoading(true);
    const result = await updatePassword(password);
    setLoading(false);
    if (result.success) {
      setDone(true);
      toast.success(tr("reset.success"));
      setTimeout(() => navigate("/login"), 2000);
    } else {
      toast.error(result.error || tr("reset.failed"));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container flex items-center justify-center py-20">
        <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-card">
          <div className="mb-6 flex flex-col items-center">
            <img src={logo} alt="Vendor+" className="mb-4 h-16 w-16 rounded-full object-cover" />
            <h1 className="text-2xl font-bold text-foreground">{tr("reset.title")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{tr("reset.subtitle")}</p>
          </div>

          {done ? (
            <div className="space-y-4 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-success" />
              <p className="text-sm text-muted-foreground">{tr("reset.redirecting")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password">{tr("reset.newPassword")}</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={tr("signup.passwordPlaceholder")} required />
              </div>
              <div>
                <Label htmlFor="confirm">{tr("reset.confirmPassword")}</Label>
                <Input id="confirm" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder={tr("reset.confirmPassword")} required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? tr("reset.updating") : tr("reset.update")}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
