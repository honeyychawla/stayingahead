import { WHATSAPP_GROUPS } from "@/config/whatsapp-groups";

export function getRedirectUrl(
  workExperience: string,
  countryCode: string
): { group: string; url: string } {
  if (workExperience === "Student") {
    return { group: "student_channel", url: WHATSAPP_GROUPS.student_channel };
  }
  if (countryCode === "IN") {
    return { group: "india_community", url: WHATSAPP_GROUPS.india_community };
  }
  return {
    group: "international_community",
    url: WHATSAPP_GROUPS.international_community,
  };
}
