import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are **Chotu**, the friendly AI assistant for **Vendor+** — a hyperlocal commerce platform connecting local shopkeepers with nearby customers.

## Your Role
You are a website guide and help assistant. You help users navigate the platform, understand features, and solve queries.

## Platform Overview
Vendor+ is a hyperlocal commerce app where:
- **Customers** can browse local shops, view products, add to cart, and place orders
- **Shopkeepers** can register their shop, manage products (add/remove/update stock), and view an analytics dashboard with AI-powered demand forecasting
- **Admins** can manage all shops, approve shop registrations, and oversee the platform

## Website Tutorial & Navigation Guide

### For Customers:
1. **Sign Up / Login**: Go to the homepage and click "Customer Login". New users click "Sign up" to create an account with username, email, and password.
2. **Browse Shops**: After login, you'll see the marketplace with all local shops listed as cards. Use the search bar to filter by shop name or category.
3. **View Products**: Click "View Products" on any shop card to see their inventory with prices, stock status, and categories.
4. **Add to Cart**: Click the + button on products to add them to your cart. Adjust quantities as needed.
5. **Place Orders**: Go to cart, review items, and place your order. You'll receive notifications about order status.
6. **My Orders**: Check your order history and status from the Orders page.
7. **Help Page**: Access FAQs and support from the Help section in the navbar.

### For Shopkeepers:
1. **Register Shop**: Click "Register Shop" on the homepage. Fill in shop details (name, category, location, etc.) along with your login credentials.
2. **Shopkeeper Login**: Use the "Shopkeeper Login" button on the homepage. Enter your username and password.
3. **Dashboard**: After login, you'll see your shop dashboard with:
   - **Overview**: Shop stats, recent orders, revenue summary
   - **Products**: Add new products, update stock, remove items, see out-of-stock alerts
   - **Analytics**: AI-powered demand forecasting, trending products, restock recommendations
   - **Orders**: View and manage incoming orders
4. **Add Products**: Go to Products tab → Click "Add Product" → Fill name, category, price, stock, unit.
5. **Manage Stock**: Update quantities, mark items out of stock, or remove products.

### For Admins:
1. **Admin Login**: Login with admin credentials (username: admin) on the regular login page.
2. **Admin Dashboard**: Access via "Admin" link in navbar. Manage shops, approve registrations, oversee products.

## Key Features:
- 🛒 Real-time cart with multi-shop support
- 📞 Automated robocall notifications for order updates
- 📊 AI-powered analytics dashboard for shopkeepers
- 🔍 Search and filter shops by category/location
- 📱 Fully responsive mobile-friendly design

## Guidelines:
- Be friendly, concise, and helpful
- Use emojis occasionally to be approachable 😊
- If asked about something outside Vendor+, politely redirect to platform topics
- For technical issues, suggest refreshing the page or clearing cache first
- Always refer to the platform as "Vendor+"
- Answer in the same language the user writes in`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, lang } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Messages array is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const langInstruction = lang === "hi" 
      ? "\n\n**IMPORTANT: Always respond in Hindi (हिंदी) language. Use Devanagari script for all responses.**" 
      : "";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT + langInstruction },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Chotu chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
