import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getRedirectUrl } from "@/lib/get-redirect";
import { MASTERMIND_REDIRECT } from "@/config/whatsapp-groups";

export async function POST(request: NextRequest) {
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

  // Validate required fields
  if (!name || !email || !phone || !work_experience) {
    return NextResponse.json(
      { success: false, error: "Please fill in all required fields." },
      { status: 400 }
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { success: false, error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  // Determine redirect
  const { group, url } = getRedirectUrl(work_experience, country_code || "");

  // Insert into database
  try {
    const supabase = getSupabase();
    const { error: dbError } = await supabase
      .from("community_applications")
      .insert({
        name,
        email,
        phone,
        work_experience,
        weekend_mastermind: weekend_mastermind ?? false,
        country: country || null,
        country_code: country_code || null,
        redirect_group: group,
        ip_address: ip_address || null,
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
        utm_content: utm_content || null,
        utm_term: utm_term || null,
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
