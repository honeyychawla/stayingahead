import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getRedirectUrl } from "@/lib/get-redirect";
import { MASTERMIND_REDIRECT } from "@/config/whatsapp-groups";

// --- Rate Limiter (in-memory, IP-based) ---
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per window

const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = requestLog.get(ip) ?? [];

  // Keep only timestamps within the current window
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX) {
    requestLog.set(ip, recent);
    return true;
  }

  recent.push(now);
  requestLog.set(ip, recent);
  return false;
}

// Cleanup stale entries every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of requestLog) {
    const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (recent.length === 0) {
      requestLog.delete(ip);
    } else {
      requestLog.set(ip, recent);
    }
  }
}, 5 * 60 * 1000);

// --- Validation Constants ---
const ALLOWED_EXPERIENCES = [
  "Student",
  "Working Professional",
  "Self Employed",
  "Unemployed",
  "Retired",
  "Others",
];

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_PHONE_LENGTH = 20;

export async function POST(request: NextRequest) {
  // Get client IP for rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please try again in a minute." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const {
    name,
    email,
    phone,
    work_experience,
    weekend_mastermind,
    country,
    country_code,
    ip_address,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
  } = body as {
    name: string;
    email: string;
    phone: string;
    work_experience: string;
    weekend_mastermind: boolean;
    country: string;
    country_code: string;
    ip_address: string;
    utm_source: string;
    utm_medium: string;
    utm_campaign: string;
    utm_content: string;
    utm_term: string;
  };

  // --- Validate required fields ---
  if (!name || !email || !phone || !work_experience) {
    return NextResponse.json(
      { success: false, error: "Please fill in all required fields." },
      { status: 400 }
    );
  }

  // --- Sanitize & enforce length limits ---
  const cleanName = String(name).trim().slice(0, MAX_NAME_LENGTH);
  const cleanEmail = String(email).trim().slice(0, MAX_EMAIL_LENGTH);
  const cleanPhone = String(phone).trim().slice(0, MAX_PHONE_LENGTH);
  const cleanExperience = String(work_experience).trim();

  // --- Validate name ---
  if (cleanName.length < 2) {
    return NextResponse.json(
      { success: false, error: "Name must be at least 2 characters." },
      { status: 400 }
    );
  }

  // --- Validate email format ---
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return NextResponse.json(
      { success: false, error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  // --- Validate phone (7-15 digits, international range) ---
  const phoneDigits = cleanPhone.replace(/\D/g, "");
  if (phoneDigits.length < 7 || phoneDigits.length > 15) {
    return NextResponse.json(
      { success: false, error: "Please enter a valid phone number." },
      { status: 400 }
    );
  }

  // --- Validate work_experience against allowed values ---
  if (!ALLOWED_EXPERIENCES.includes(cleanExperience)) {
    return NextResponse.json(
      { success: false, error: "Invalid work experience selection." },
      { status: 400 }
    );
  }

  // --- Validate country_code (ISO 3166-1 alpha-2) if provided ---
  const cleanCountryCode = country_code ? String(country_code).trim() : "";
  if (cleanCountryCode && !/^[A-Z]{2}$/.test(cleanCountryCode)) {
    return NextResponse.json(
      { success: false, error: "Invalid country code." },
      { status: 400 }
    );
  }

  // Determine redirect
  const { group, url } = getRedirectUrl(cleanExperience, cleanCountryCode);

  // Insert into database
  try {
    const supabase = getSupabase();
    const { error: dbError } = await supabase
      .from("community_applications")
      .insert({
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        work_experience: cleanExperience,
        weekend_mastermind: weekend_mastermind ?? false,
        country: country ? String(country).trim() : null,
        country_code: cleanCountryCode || null,
        redirect_group: group,
        ip_address: ip_address ? String(ip_address).trim() : null,
        utm_source: utm_source ? String(utm_source).trim() : null,
        utm_medium: utm_medium ? String(utm_medium).trim() : null,
        utm_campaign: utm_campaign ? String(utm_campaign).trim() : null,
        utm_content: utm_content ? String(utm_content).trim() : null,
        utm_term: utm_term ? String(utm_term).trim() : null,
      });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json(
        { success: false, error: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Supabase connection error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  // Build response
  const mastermindUrl =
    weekend_mastermind && MASTERMIND_REDIRECT ? MASTERMIND_REDIRECT : null;

  return NextResponse.json({
    success: true,
    redirectUrl: url,
    mastermindUrl,
  });
}
