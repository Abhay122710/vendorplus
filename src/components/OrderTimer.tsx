import { useEffect, useState } from "react";
import { Clock, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

interface OrderTimerProps {
  approvedAt: string;
  durationMinutes?: number;
  completed?: boolean;
  className?: string;
}

const pad = (n: number) => n.toString().padStart(2, "0");

export default function OrderTimer({ approvedAt, durationMinutes = 30, completed, className = "" }: OrderTimerProps) {
  const { lang } = useLanguage();
  const totalMs = durationMinutes * 60 * 1000;
  const computeRemaining = () => {
    const elapsed = Date.now() - new Date(approvedAt).getTime();
    return Math.max(0, totalMs - elapsed);
  };
  const [remaining, setRemaining] = useState<number>(computeRemaining());

  useEffect(() => {
    if (completed) return;
    const id = setInterval(() => setRemaining(computeRemaining()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approvedAt, completed]);

  if (completed) {
    return (
      <div className={`inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success ${className}`}>
        <CheckCircle2 className="h-3.5 w-3.5" />
        {lang === "hi" ? "डिलीवर हो गया" : "Delivered"}
      </div>
    );
  }

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const expired = remaining === 0;

  const tone = expired
    ? "bg-destructive/10 text-destructive border-destructive/20"
    : minutes < 5
    ? "bg-warning/10 text-warning border-warning/20"
    : "bg-info/10 text-info border-info/20";

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tabular-nums ${tone} ${className}`}>
      <Clock className="h-3.5 w-3.5" />
      {expired
        ? (lang === "hi" ? "समय समाप्त" : "Time up")
        : `${pad(minutes)}:${pad(seconds)} ${lang === "hi" ? "शेष" : "left"}`}
    </div>
  );
}
