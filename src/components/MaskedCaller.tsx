import { useState } from "react";
import { useOrders } from "@/lib/order-context";
import { demoShops } from "@/lib/demo-data";
import { Phone, PhoneOff, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useLanguage } from "@/lib/language-context";

interface MaskedCallerProps {
  shopId: string;
  shopName: string;
  customerName: string;
}

const SHOP_OWNER_NUMBER = "+918476003000";


export default function MaskedCaller({ shopId, shopName, customerName }: MaskedCallerProps) {
  const { addCallLog } = useOrders();
  const { tr } = useLanguage();
  const [calling, setCalling] = useState(false);
  const [maskedNum, setMaskedNum] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [intervalId, setIntervalId] = useState<ReturnType<typeof setInterval> | null>(null);

  const startCall = () => {
    const masked = SHOP_OWNER_NUMBER;
    setMaskedNum(masked);
    setCalling(true);
    setCallDuration(0);

    const id = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    setIntervalId(id);

    toast.info(tr("masked.connecting").replace("{num}", masked));
  };

  const endCall = () => {
    if (intervalId) clearInterval(intervalId);
    setCalling(false);

    addCallLog({
      type: "masked",
      caller_id: "customer",
      receiver_id: shopId,
      caller_name: customerName,
      receiver_name: shopName,
      masked_number: maskedNum || "",
      call_duration: callDuration,
      timestamp: new Date().toISOString(),
      status: "completed",
    });

    toast.success(tr("masked.callEnded").replace("{duration}", formatDuration(callDuration)));
    setMaskedNum(null);
    setCallDuration(0);
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div>
      {!calling ? (
        <Button variant="outline" className="gap-2" onClick={startCall}>
          <Shield className="h-4 w-4" />
          <Phone className="h-4 w-4" />
          {tr("masked.callButton")}
        </Button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border-2 border-success/30 bg-card p-4 shadow-card"
          >
            <div className="flex items-center gap-3">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                <Phone className="h-5 w-5 text-success" />
              </motion.div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{tr("masked.active")}</p>
                <p className="text-xs text-muted-foreground">
                  <Shield className="mr-1 inline h-3 w-3" />
                  {tr("masked.via")} {maskedNum}
                </p>
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatDuration(callDuration)}
                </div>
              </div>
              <Button size="sm" variant="destructive" className="gap-1" onClick={endCall}>
                <PhoneOff className="h-4 w-4" /> {tr("masked.end")}
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {tr("masked.privacy")}
            </p>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
