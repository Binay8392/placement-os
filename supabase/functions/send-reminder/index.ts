import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Simple in-memory rate limiter
const rateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 3600000; // 1 hour

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = rateLimits.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimits.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) return true;
  entry.count++;
  return false;
}

// Email validation
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

// Sanitize HTML content to prevent injection
function sanitize(str: string | undefined): string {
  if (!str) return '';
  return str.replace(/[<>&"']/g, (c) => {
    const map: Record<string, string> = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' };
    return map[c] || c;
  }).slice(0, 1000); // Limit length
}

interface ReminderRequest {
  email: string;
  company?: string;
  role?: string;
  type: "interview" | "followup" | "exam";
  date: string;
  notes?: string;
  examName?: string;
  organization?: string;
  category?: string;
  postName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate authorization header exists
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing authorization" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data: ReminderRequest = await req.json();
    const { email, type, date, notes } = data;

    // Validate required fields
    if (!email || !type || !date) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate type
    if (!["interview", "followup", "exam"].includes(type)) {
      return new Response(
        JSON.stringify({ error: "Invalid reminder type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Rate limit by email
    if (isRateLimited(email)) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Sending ${type} reminder to ${email}`);

    let subject: string;
    let html: string;

    if (type === "exam") {
      const { examName, organization, category, postName } = data;
      
      if (!examName || !organization) {
        return new Response(
          JSON.stringify({ error: "Missing exam details" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const safeExamName = sanitize(examName);
      const safeOrg = sanitize(organization);
      const safeCategory = sanitize(category);
      const safePostName = sanitize(postName);
      const safeDate = sanitize(date);
      const safeNotes = sanitize(notes);

      subject = `📝 Exam Reminder: ${safeExamName} - ${safeOrg}`;
      
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px; }
            .highlight { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #f59e0b; }
            .date { font-size: 24px; font-weight: bold; color: #f59e0b; }
            .category { display: inline-block; background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 20px; font-size: 12px; text-transform: uppercase; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .emoji { font-size: 48px; }
            .checklist { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; }
            .checklist li { margin: 8px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="emoji">📝</div>
              <h1>Exam Reminder</h1>
            </div>
            <div class="content">
              <div class="highlight">
                <span class="category">${safeCategory || 'Govt Exam'}</span>
                <h2>${safeExamName}</h2>
                <p><strong>Organization:</strong> ${safeOrg}</p>
                ${safePostName ? `<p><strong>Post:</strong> ${safePostName}</p>` : ''}
                <p class="date">📅 ${safeDate}</p>
              </div>
              ${safeNotes ? `<div class="highlight"><p><strong>Notes:</strong> ${safeNotes}</p></div>` : ''}
              <div class="checklist">
                <p><strong>📋 Pre-Exam Checklist:</strong></p>
                <ul>
                  <li>✅ Check admit card &amp; ID proof</li>
                  <li>✅ Know your exam center location</li>
                  <li>✅ Carry required stationery</li>
                  <li>✅ Reach exam center 1 hour early</li>
                  <li>✅ Get proper rest before exam day</li>
                </ul>
              </div>
              <p>Best of luck for your exam! 🍀</p>
            </div>
            <div class="footer">
              <p>Sent from PrepTrack OS - Your Personal Placement System</p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else {
      const { company, role } = data;
      
      if (!company || !role) {
        return new Response(
          JSON.stringify({ error: "Missing company or role" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const safeCompany = sanitize(company);
      const safeRole = sanitize(role);
      const safeDate = sanitize(date);
      const safeNotes = sanitize(notes);

      const isInterview = type === "interview";
      subject = isInterview 
        ? `🎯 Interview Reminder: ${safeCompany} - ${safeRole}`
        : `📋 Follow-up Reminder: ${safeCompany} - ${safeRole}`;

      html = `
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
                <h2>${safeCompany}</h2>
                <p><strong>Role:</strong> ${safeRole}</p>
                <p class="date">📅 ${safeDate}</p>
              </div>
              ${safeNotes ? `<div class="highlight"><p><strong>Notes:</strong> ${safeNotes}</p></div>` : ''}
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
    }

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
