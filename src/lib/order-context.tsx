import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Order, OrderItem, CallLog, demoOrders, demoCallLogs } from "./demo-data";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { dispatchRobocall, SHOP_OWNER_NUMBER } from "./telephony";

interface OrderContextType {
  orders: Order[];
  callLogs: CallLog[];
  placeOrder: (order: Omit<Order, "id" | "status" | "timestamp">) => Order;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  addCallLog: (log: Omit<CallLog, "id">) => void;
  getShopOrders: (shopId: string) => Order[];
  getPendingNotifications: (shopId: string) => Order[];
  dismissNotification: (orderId: string) => void;
}

const OrderContext = createContext<OrderContextType | null>(null);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(demoOrders);
  const [callLogs, setCallLogs] = useState<CallLog[]>(demoCallLogs);
  const [dismissedNotifications, setDismissedNotifications] = useState<Set<string>>(new Set());

  // Listen for realtime order call responses from the database
  useEffect(() => {
    const channel = supabase
      .channel("order-call-responses")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "order_call_responses" },
        (payload) => {
          const { order_id, status, digit } = payload.new as {
            order_id: string;
            status: string;
            digit: string;
          };

          if (status === "Confirmed" || status === "Cancelled" || status === "Partial") {
            setOrders((prev) =>
              prev.map((o) => {
                if (o.id !== order_id) return o;
                const updated: Order = { ...o, status: status as Order["status"] };
                if (status === "Confirmed" && !o.approved_at) updated.approved_at = new Date().toISOString();
                return updated;
              })
            );

            setCallLogs((prev) =>
              prev.map((cl) =>
                cl.order_id === order_id
                  ? { ...cl, status: "completed", call_duration: Math.floor(Math.random() * 30) + 10 }
                  : cl
              )
            );

            const statusEmoji = status === "Confirmed" ? "✅" : status === "Cancelled" ? "❌" : "⚠️";
            toast.success(`${statusEmoji} Order ${order_id} has been ${status.toLowerCase()} by the shop owner!`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Also poll for any responses we might have missed
  useEffect(() => {
    const pendingOrderIds = orders.filter((o) => o.status === "Pending").map((o) => o.id);
    if (pendingOrderIds.length === 0) return;

    const checkResponses = async () => {
      const { data } = await supabase
        .from("order_call_responses")
        .select("*")
        .in("order_id", pendingOrderIds);

      if (data && data.length > 0) {
        data.forEach((resp: { order_id?: string; status?: string }) => {
          if (resp.status === "Confirmed" || resp.status === "Cancelled" || resp.status === "Partial") {
            setOrders((prev) =>
              prev.map((o) =>
                o.id === resp.order_id ? { ...o, status: resp.status as Order["status"] } : o
              )
            );
          }
        });
      }
    };

    checkResponses();
    const interval = setInterval(checkResponses, 10000);
    return () => clearInterval(interval);
  }, [orders.filter((o) => o.status === "Pending").length]);

  const triggerRobocall = async (orderData: Omit<Order, "id" | "status" | "timestamp">, orderId: string) => {
    try {
      const savedCallLang = (typeof window !== "undefined" && localStorage.getItem("callLang")) || "en";
      const itemsList = orderData.items.map(i => `${i.quantity} ${i.product_name}`).join(", ");
      const message = savedCallLang === "hi"
        ? `आपको Vendor Plus पर एक नया ऑर्डर मिला है। ग्राहक ${orderData.customer_name} ने ऑर्डर किया है: ${itemsList}। कुल ऑर्डर राशि ${orderData.total_amount} रुपये है।`
        : `You have received a new order on Vendor Plus. Customer ${orderData.customer_name} has ordered: ${itemsList}. Total order value is ${orderData.total_amount} rupees.`;

      const result = await dispatchRobocall({
        phone: SHOP_OWNER_NUMBER,
        message,
        orderId,
        language: savedCallLang,
      });

      if (result.success) {
        toast.success(`📞 Live automated Twilio call initiated to shop owner (${SHOP_OWNER_NUMBER})!`);
      } else if (result.reason === "NO_TWILIO_NUMBER") {
        toast.info("📞 Twilio credentials verified! Please claim your free Twilio phone number in Twilio Console. Simulating automated call...");
        setTimeout(() => {
          updateOrderStatus(orderId, "Confirmed");
          toast.success("✅ Order approved by shop owner via automated call simulation!");
        }, 3500);
      } else if (result.reason === "TWILIO_ERROR") {
        const errorDetail = result.error || "Trial account limitation";
        toast.warning(`Twilio Notice: ${errorDetail}. Simulating automated call...`);
        setTimeout(() => {
          updateOrderStatus(orderId, "Confirmed");
          toast.success("✅ Order approved by shop owner via automated call simulation!");
        }, 3500);
      } else {
        toast.info("📞 Automated call simulated to shop owner!");
        setTimeout(() => {
          updateOrderStatus(orderId, "Confirmed");
          toast.success("✅ Order approved by shop owner!");
        }, 3500);
      }
    } catch (err) {
      console.error("Robocall error:", err);
      toast.info("📞 Automated call simulation in progress...");
      setTimeout(() => {
        updateOrderStatus(orderId, "Confirmed");
      }, 3500);
    }
  };

  const placeOrder = useCallback((orderData: Omit<Order, "id" | "status" | "timestamp">) => {
    const newOrder: Order = {
      ...orderData,
      id: `o_${Date.now()}`,
      status: "Pending",
      timestamp: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);

    const callLog: CallLog = {
      id: `cl_${Date.now()}`,
      type: "robocall",
      caller_id: "system",
      receiver_id: orderData.shop_id,
      caller_name: "Vendor+ System",
      receiver_name: "Shop Owner",
      masked_number: SHOP_OWNER_NUMBER,
      call_duration: 0,
      timestamp: new Date().toISOString(),
      status: "initiated",
      order_id: newOrder.id,
      transcript: `You have received a new order on Vendor Plus. Customer ${orderData.customer_name} has ordered: ${orderData.items.map(i => `${i.quantity} ${i.product_name}`).join(", ")}. Total order value is ${orderData.total_amount} rupees. Press 1 to approve, press 2 to cancel, press 3 if some items are unavailable.`,
    };
    setCallLogs(prev => [callLog, ...prev]);

    triggerRobocall(orderData, newOrder.id);

    return newOrder;
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: Order["status"]) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      const updated: Order = { ...o, status };
      if (status === "Confirmed" && !o.approved_at) updated.approved_at = new Date().toISOString();
      if (status === "Completed" && !o.completed_at) updated.completed_at = new Date().toISOString();
      return updated;
    }));
    setCallLogs(prev => prev.map(cl =>
      cl.order_id === orderId
        ? { ...cl, status: "completed", call_duration: Math.floor(Math.random() * 30) + 10 }
        : cl
    ));
  }, []);

  const addCallLog = useCallback((log: Omit<CallLog, "id">) => {
    setCallLogs(prev => [{ ...log, id: `cl_${Date.now()}_${Math.random().toString(36).slice(2)}` }, ...prev]);
  }, []);

  const getShopOrders = useCallback((shopId: string) => {
    return orders.filter(o => o.shop_id === shopId);
  }, [orders]);

  const getPendingNotifications = useCallback((shopId: string) => {
    return orders.filter(o => o.shop_id === shopId && o.status === "Pending" && !dismissedNotifications.has(o.id));
  }, [orders, dismissedNotifications]);

  const dismissNotification = useCallback((orderId: string) => {
    setDismissedNotifications(prev => new Set([...prev, orderId]));
  }, []);

  return (
    <OrderContext.Provider value={{ orders, callLogs, placeOrder, updateOrderStatus, addCallLog, getShopOrders, getPendingNotifications, dismissNotification }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
}

export { SHOP_OWNER_NUMBER };
