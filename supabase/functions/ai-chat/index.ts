import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const FREE_DAILY_LIMIT = 10;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, firebaseUid } = await req.json();
    
    if (!firebaseUid) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Check credits
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const today = new Date().toISOString().split("T")[0];

    // Get or create today's credit record
    const { data: creditData } = await supabase
      .from("ai_credits")
      .select("*")
      .eq("firebase_uid", firebaseUid)
      .eq("usage_date", today)
      .maybeSingle();

    const isPro = creditData?.is_pro || false;
    const messagesUsed = creditData?.messages_used || 0;

    if (!isPro && messagesUsed >= FREE_DAILY_LIMIT) {
      return new Response(JSON.stringify({ 
        error: "Daily free limit reached (10 messages). Support us to get unlimited access!",
        limitReached: true,
        messagesUsed,
        limit: FREE_DAILY_LIMIT
      }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Increment usage
    if (creditData) {
      await supabase
        .from("ai_credits")
        .update({ messages_used: messagesUsed + 1 })
        .eq("id", creditData.id);
    } else {
      await supabase
        .from("ai_credits")
        .insert({ firebase_uid: firebaseUid, messages_used: 1, usage_date: today });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { 
            role: "system", 
            content: `You are PrepTrack AI — a friendly, knowledgeable placement preparation assistant built by Binay Paramanik. You help students with:
- Data Structures & Algorithms (DSA)
- Coding interview preparation
- Aptitude and reasoning questions
- Resume building tips
- Mock interview guidance
- Study planning and motivation
- Any tech or placement related queries

Be encouraging, concise, and practical. Use code examples when helpful. Format responses with markdown.`
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "AI service rate limited. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI service credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
