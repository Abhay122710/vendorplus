import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const API_BASE = "https://earl-prettied-convexedly.ngrok-free.dev";
const proxyHeaders = {
  Accept: "application/json",
  "ngrok-skip-browser-warning": "1",
};
const ALLOWED_ML_ENDPOINTS = new Set([
  "/trending",
  "/trending/categories",
  "/trending/areas",
  "/trending/weekdays",
]);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, endpoint, payload } = await req.json();

    let upstreamResponse: Response;

    if (type === "smart-ai") {
      upstreamResponse = await fetch(`${API_BASE}/smart-ai`, {
        method: "POST",
        headers: { ...proxyHeaders, "Content-Type": "application/json" },
        body: JSON.stringify(payload ?? {}),
      });
    } else if (type === "ml") {
      if (typeof endpoint !== "string" || !ALLOWED_ML_ENDPOINTS.has(endpoint)) {
        return new Response(JSON.stringify({ error: "Invalid ML endpoint" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      upstreamResponse = await fetch(`${API_BASE}${endpoint}`, {
        headers: proxyHeaders,
      });
    } else {
      return new Response(JSON.stringify({ error: "Invalid request type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const responseText = await upstreamResponse.text();

    if (!upstreamResponse.ok) {
      console.error("AI dashboard proxy error:", upstreamResponse.status, responseText);
      return new Response(
        JSON.stringify({
          error: "External API request failed",
          status: upstreamResponse.status,
          details: responseText.slice(0, 500),
        }),
        {
          status: upstreamResponse.status === 404 ? 404 : 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(responseText, {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("ai-dashboard proxy failure:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
