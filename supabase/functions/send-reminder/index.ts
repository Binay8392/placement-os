import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReminderRequest {
  email: string;
  company: string;
  role: string;
  type: "interview" | "followup";
  date: string;
  notes?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, company, role, type, date, notes }: ReminderRequest = await req.json();

    console.log(`Sending ${type} reminder for ${company} to ${email}`);

    if (!email || !company || !role || !type || !date) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const isInterview = type === "interview";
    const subject = isInterview 
      ? `🎯 Interview Reminder: ${company} - ${role}`
      : `📋 Follow-up Reminder: ${company} - ${role}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px; }
          .highlight { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #667eea; }
          .date { font-size: 24px; font-weight: bold; color: #667eea; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .emoji { font-size: 48px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="emoji">${isInterview ? '🎯' : '📋'}</div>
            <h1>${isInterview ? 'Interview Reminder' : 'Follow-up Reminder'}</h1>
          </div>
          <div class="content">
            <div class="highlight">
              <h2>${company}</h2>
              <p><strong>Role:</strong> ${role}</p>
              <p class="date">📅 ${date}</p>
            </div>
            ${notes ? `<div class="highlight"><p><strong>Notes:</strong> ${notes}</p></div>` : ''}
            <p>${isInterview 
              ? "Don't forget to prepare for your upcoming interview! Review the job description, practice common questions, and get a good night's rest." 
              : "Time to follow up on your application. Reach out to the recruiter or hiring manager to check on your application status."
            }</p>
            <p>Good luck! 🍀</p>
          </div>
          <div class="footer">
            <p>Sent from PrepTrack OS - Your Personal Placement System</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "PrepTrack OS <onboarding@resend.dev>",
        to: [email],
        subject: subject,
        html: html,
      }),
    });

    const responseData = await emailResponse.json();
    
    if (!emailResponse.ok) {
      console.error("Resend API error:", responseData);
      throw new Error(responseData.message || "Failed to send email");
    }

    console.log("Email sent successfully:", responseData);

    return new Response(JSON.stringify({ success: true, data: responseData }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in send-reminder function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
