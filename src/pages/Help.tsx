import { useState } from "react";
import { useAuth, isNetworkError } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { Send, MessageSquare, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";

export default function Help() {
  const { user, profile } = useAuth();
  const [email, setEmail] = useState(profile?.email || user?.email || "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { tr } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error(tr("help.loginFirst")); return; }
    if (!email.trim() || !message.trim()) { toast.error(tr("help.fillAll")); return; }
    setLoading(true);
    let failed = false;
    try {
      const { error } = await supabase.from("complaints").insert({
        user_id: user.id,
        email: email.trim(),
        message: message.trim(),
      });
      if (error && !isNetworkError(error)) {
        failed = true;
      }
    } catch (err) {
      if (!isNetworkError(err)) {
        failed = true;
      }
    }
    setLoading(false);
    if (failed) {
      toast.error(tr("help.failed"));
    } else {
      setSent(true);
      toast.success(tr("help.success"));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container flex items-center justify-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg rounded-2xl border bg-card p-8 shadow-card"
        >
          <div className="mb-6 flex flex-col items-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <MessageSquare className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">{tr("help.title")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {sent ? tr("help.received") : tr("help.subtitle")}
            </p>
          </div>

          {sent ? (
            <div className="space-y-4 text-center">
              <CheckCircle className="mx-auto h-14 w-14 text-success" />
              <p className="text-sm text-muted-foreground">{tr("help.submitted")}</p>
              <Button variant="outline" className="w-full" onClick={() => { setSent(false); setMessage(""); }}>
                {tr("help.submitAnother")}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">{tr("help.yourEmail")}</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={tr("signup.emailPlaceholder")} required />
              </div>
              <div>
                <Label htmlFor="message">{tr("help.yourMessage")}</Label>
                <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder={tr("help.messagePlaceholder")} rows={5} required />
              </div>
              <Button type="submit" className="w-full gap-2" disabled={loading || !user}>
                <Send className="h-4 w-4" />
                {loading ? tr("help.submitting") : tr("help.submit")}
              </Button>
              {!user && (
                <p className="text-center text-xs text-destructive">{tr("help.loginRequired")}</p>
              )}
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
