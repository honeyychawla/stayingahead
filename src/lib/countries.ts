export interface Country {
  code: string;
  dialCode: string;
  name: string;
}

export const COUNTRIES: Country[] = [
  { code: "IN", dialCode: "+91", name: "India" },
  { code: "AF", dialCode: "+93", name: "Afghanistan" },
  { code: "AU", dialCode: "+61", name: "Australia" },
  { code: "BD", dialCode: "+880", name: "Bangladesh" },
  { code: "BR", dialCode: "+55", name: "Brazil" },
  { code: "CA", dialCode: "+1", name: "Canada" },
  { code: "CN", dialCode: "+86", name: "China" },
  { code: "DE", dialCode: "+49", name: "Germany" },
  { code: "EG", dialCode: "+20", name: "Egypt" },
  { code: "FR", dialCode: "+33", name: "France" },
  { code: "GB", dialCode: "+44", name: "United Kingdom" },
  { code: "GH", dialCode: "+233", name: "Ghana" },
  { code: "ID", dialCode: "+62", name: "Indonesia" },
  { code: "IE", dialCode: "+353", name: "Ireland" },
  { code: "IL", dialCode: "+972", name: "Israel" },
  { code: "IT", dialCode: "+39", name: "Italy" },
  { code: "JP", dialCode: "+81", name: "Japan" },
  { code: "KE", dialCode: "+254", name: "Kenya" },
  { code: "KR", dialCode: "+82", name: "South Korea" },
  { code: "LK", dialCode: "+94", name: "Sri Lanka" },
  { code: "MY", dialCode: "+60", name: "Malaysia" },
  { code: "MX", dialCode: "+52", name: "Mexico" },
  { code: "NG", dialCode: "+234", name: "Nigeria" },
  { code: "NL", dialCode: "+31", name: "Netherlands" },
  { code: "NP", dialCode: "+977", name: "Nepal" },
  { code: "NZ", dialCode: "+64", name: "New Zealand" },
  { code: "PH", dialCode: "+63", name: "Philippines" },
  { code: "PK", dialCode: "+92", name: "Pakistan" },
  { code: "SA", dialCode: "+966", name: "Saudi Arabia" },
  { code: "SG", dialCode: "+65", name: "Singapore" },
  { code: "TH", dialCode: "+66", name: "Thailand" },
  { code: "TR", dialCode: "+90", name: "Turkey" },
  { code: "AE", dialCode: "+971", name: "UAE" },
  { code: "US", dialCode: "+1", name: "United States" },
  { code: "VN", dialCode: "+84", name: "Vietnam" },
  { code: "ZA", dialCode: "+27", name: "South Africa" },
];

export function getCountryName(isoCode: string): string {
  const country = COUNTRIES.find(
    (c) => c.code === isoCode.toUpperCase()
  );
  return country?.name ?? isoCode;
}
