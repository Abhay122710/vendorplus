import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { Mail, ArrowLeft } from "lucide-react";
import logo from "@/assets/logo.jpg";
import { useLanguage } from "@/lib/language-context";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();
  const { tr } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await resetPassword(email);
    setLoading(false);
    if (result.success) {
      setSent(true);
      toast.success(tr("forgot.success"));
    } else {
      toast.error(result.error || tr("forgot.failed"));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container flex items-center justify-center py-20">
        <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-card">
          <div className="mb-6 flex flex-col items-center">
            <img src={logo} alt="Vendor+" className="mb-4 h-16 w-16 rounded-full object-cover" />
            <h1 className="text-2xl font-bold text-foreground">{tr("forgot.title")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {sent ? tr("forgot.checkInbox") : tr("forgot.subtitle")}
            </p>
          </div>

          {sent ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <Mail className="h-8 w-8 text-success" />
              </div>
              <p className="text-sm text-muted-foreground">
                {tr("forgot.sentMsg")} <strong className="text-foreground">{email}</strong>. {tr("forgot.checkEmail")}
              </p>
              <Button variant="outline" className="w-full gap-2" onClick={() => setSent(false)}>
                {tr("forgot.sendAgain")}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">{tr("forgot.emailLabel")}</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={tr("signup.emailPlaceholder")} required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? tr("forgot.sending") : tr("forgot.sendLink")}
              </Button>
            </form>
          )}

          <Link to="/login" className="mt-6 flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> {tr("forgot.backToLogin")}
          </Link>
        </div>
      </div>
    </div>
  );
}
