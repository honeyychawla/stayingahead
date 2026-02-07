export interface CommunityApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  work_experience: string;
  weekend_mastermind: boolean;
  country: string;
  country_code: string;
  redirect_group: string;
  ip_address: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  created_at: string;
}
