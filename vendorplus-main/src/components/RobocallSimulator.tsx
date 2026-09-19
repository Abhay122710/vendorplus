import { useState, useEffect } from "react";
import { useOrders } from "@/lib/order-context";
import { demoShops, Order } from "@/lib/demo-data";
import { Phone, CheckCircle, XCircle, AlertTriangle, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useLanguage } from "@/lib/language-context";
import { trd } from "@/lib/demo-translations";

interface RobocallSimulatorProps {
  shopId: string;
  callLang?: "en" | "hi";
}

export default function RobocallSimulator({ shopId, callLang = "en" }: RobocallSimulatorProps) {
  const { getPendingNotifications, updateOrderStatus, dismissNotification } = useOrders();
  const { tr, lang } = useLanguage();
  const pendingOrders = getPendingNotifications(shopId);
  const [activeCall, setActiveCall] = useState<Order | null>(null);
  const [callPhase, setCallPhase] = useState<"ringing" | "speaking" | "waiting" | "done">("ringing");
  const [spokenText, setSpokenText] = useState("");
  const shop = demoShops.find(s => s.id === shopId);

  useEffect(() => {
    if (!activeCall && pendingOrders.length > 0) {
      setActiveCall(pendingOrders[0]);
      setCallPhase("ringing");
    }
  }, [pendingOrders, activeCall]);

  useEffect(() => {
    if (!activeCall || callPhase !== "ringing") return;
    const timer = setTimeout(() => {
      setCallPhase("speaking");

      const itemsList = activeCall.items.map(i => `${i.quantity}× ${i.product_name}`).join(", ");
      const itemsListHi = activeCall.items.map(i => `${i.quantity} ${trd(i.product_name, "hi")}`).join(", ");

      const transcript = callLang === "hi"
        ? `आपको Vendor Plus पर एक नया ऑर्डर मिला है। ग्राहक ${activeCall.customer_name} ने ऑर्डर किया है: ${itemsListHi}। कुल ऑर्डर राशि ₹${activeCall.total_amount} है। स्वीकार करने के लिए 1 दबाएं, रद्द करने के लिए 2 दबाएं, कुछ आइटम उपलब्ध नहीं हैं तो 3 दबाएं।`
        : `You have received a new order on Vendor Plus. Customer ${activeCall.customer_name} has ordered: ${itemsList}. Total order value is ₹${activeCall.total_amount}. Press 1 to approve, press 2 to cancel, press 3 if some items are unavailable.`;

      let i = 0;
      const typeTimer = setInterval(() => {
        if (i < transcript.length) {
          setSpokenText(transcript.slice(0, i + 1));
          i++;
        } else {
          clearInterval(typeTimer);
          setCallPhase("waiting");
        }
      }, 25);
      return () => clearInterval(typeTimer);
    }, 2000);
    return () => clearTimeout(timer);
  }, [activeCall, callPhase, callLang]);

  const handleResponse = (key: 1 | 2 | 3) => {
    if (!activeCall) return;
    const statusMap: Record<number, Order["status"]> = { 1: "Confirmed", 2: "Cancelled", 3: "Partial" };
    const msgMap: Record<number, string> = {
      1: tr("robocall.approvedToast"),
      2: tr("robocall.cancelledToast"),
      3: tr("robocall.partialToast"),
    };
    updateOrderStatus(activeCall.id, statusMap[key]);
    toast.success(msgMap[key]);
    setCallPhase("done");
    dismissNotification(activeCall.id);
    setTimeout(() => {
      setActiveCall(null);
      setSpokenText("");
      setCallPhase("ringing");
    }, 1500);
  };

  if (!activeCall) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="mb-6 overflow-hidden rounded-2xl border-2 border-primary/30 bg-card shadow-glow"
      >
        {/* Call header */}
        <div className="gradient-primary p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-card/20">
              <Phone className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary-foreground">
                {callPhase === "ringing" ? tr("robocall.incoming") : callPhase === "speaking" ? tr("robocall.speaking") : callPhase === "waiting" ? tr("robocall.awaiting") : tr("robocall.ended")}
              </p>
              <p className="text-xs text-primary-foreground/80">{tr("robocall.system")} • {callLang === "hi" ? "हिंदी" : "English"}</p>
            </div>
            {callPhase === "ringing" && (
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="ml-auto">
                <Volume2 className="h-6 w-6 text-primary-foreground" />
              </motion.div>
            )}
          </div>
        </div>

        <div className="p-5">
          {/* Transcript */}
          {(callPhase === "speaking" || callPhase === "waiting") && (
            <div className="mb-4 rounded-lg bg-muted p-4">
              <p className="mb-1 text-xs font-semibold text-muted-foreground">{tr("robocall.voice")}</p>
              <p className="text-sm text-foreground leading-relaxed">
                {spokenText}
                {callPhase === "speaking" && <span className="animate-pulse">▌</span>}
              </p>
            </div>
          )}

          {callPhase === "ringing" && (
            <div className="text-center">
              <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-lg font-medium text-foreground">
                {tr("robocall.calling").replace("{number}", "+918476003000").replace("{shop}", trd(shop?.shop_name || "", lang))}
              </motion.div>
              <p className="mt-1 text-sm text-muted-foreground">{tr("robocall.orderFrom").replace("{customer}", activeCall.customer_name)}</p>
            </div>
          )}

          {/* Response buttons */}
          {callPhase === "waiting" && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground mb-3">{tr("robocall.selectResponse")}</p>
              <Button className="w-full justify-start gap-3" onClick={() => handleResponse(1)}>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-success/20 text-sm font-bold text-success">1</span>
                <CheckCircle className="h-4 w-4 text-success" /> {tr("robocall.approveOrder")}
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3" onClick={() => handleResponse(2)}>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-destructive/20 text-sm font-bold text-destructive">2</span>
                <XCircle className="h-4 w-4 text-destructive" /> {tr("robocall.cancelOrder")}
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3" onClick={() => handleResponse(3)}>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-warning/20 text-sm font-bold text-warning">3</span>
                <AlertTriangle className="h-4 w-4 text-warning" /> {tr("robocall.itemsUnavailable")}
              </Button>
            </div>
          )}

          {callPhase === "done" && (
            <div className="text-center">
              <CheckCircle className="mx-auto h-10 w-10 text-success" />
              <p className="mt-2 font-medium text-foreground">{tr("robocall.responseRecorded")}</p>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
