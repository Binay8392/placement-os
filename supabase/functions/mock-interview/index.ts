import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, config, answers } = await req.json();
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    if (action === "generate-questions") {
      const prompt = `You are an expert interviewer. Generate ${config.questionCount} interview questions for a ${config.difficulty} ${config.type} interview for a ${config.role} role.${config.companyStyle ? ` Style: ${config.companyStyle} company.` : ''}${config.customTopic ? ` Focus on: ${config.customTopic}` : ''}

Return ONLY a JSON array of objects with "id" (q1, q2...), "question", "category", and "expectedKeywords" (array of 3-5 key terms expected in a good answer).

Example: [{"id":"q1","question":"Explain closures in JavaScript","category":"JavaScript","expectedKeywords":["scope","function","variable","lexical","closure"]}]`;

      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        }),
      });

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || "[]";
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      const questions = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

      return new Response(JSON.stringify({ questions }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "evaluate-answers") {
      const prompt = `You are an expert interview evaluator. Evaluate these interview answers for a ${config.type} interview (${config.difficulty} difficulty, ${config.role} role).

Answers:
${answers.map((a: any, i: number) => `Q${i + 1}: ${a.question}\nA${i + 1}: ${a.answer || "(No answer provided)"}\nTime spent: ${a.timeSpent}s`).join('\n\n')}

Return ONLY valid JSON with this exact structure:
{
  "scores": { "overall": 0-100, "confidence": 0-100, "technicalDepth": 0-100, "communication": 0-100 },
  "feedback": {
    "strengths": ["strength1", "strength2", "strength3"],
    "weaknesses": ["weakness1", "weakness2"],
    "improvements": ["improvement1", "improvement2", "improvement3"],
    "topicsToRevise": ["topic1", "topic2", "topic3"]
  }
}

Score generously but fairly. Consider answer length, keyword coverage, clarity, and time management. Empty answers should heavily reduce scores.`;

      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
        }),
      });

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || "{}";
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const evaluation = jsonMatch ? JSON.parse(jsonMatch[0]) : {
        scores: { overall: 50, confidence: 50, technicalDepth: 50, communication: 50 },
        feedback: { strengths: [], weaknesses: [], improvements: [], topicsToRevise: [] },
      };

      return new Response(JSON.stringify(evaluation), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
