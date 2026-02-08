export interface Country {
  code: string;
  dialCode: string;
  name: string;
  phoneLength: number | [number, number]; // digits excluding country code; [min, max] for variable-length
}

export const COUNTRIES: Country[] = [
  { code: "IN", dialCode: "+91", name: "India", phoneLength: 10 },
  { code: "AF", dialCode: "+93", name: "Afghanistan", phoneLength: 9 },
  { code: "AU", dialCode: "+61", name: "Australia", phoneLength: 9 },
  { code: "BD", dialCode: "+880", name: "Bangladesh", phoneLength: 10 },
  { code: "BR", dialCode: "+55", name: "Brazil", phoneLength: 11 },
  { code: "CA", dialCode: "+1", name: "Canada", phoneLength: 10 },
  { code: "CN", dialCode: "+86", name: "China", phoneLength: 11 },
  { code: "DE", dialCode: "+49", name: "Germany", phoneLength: 10 },
  { code: "EG", dialCode: "+20", name: "Egypt", phoneLength: 10 },
  { code: "FR", dialCode: "+33", name: "France", phoneLength: 9 },
  { code: "GB", dialCode: "+44", name: "United Kingdom", phoneLength: 10 },
  { code: "GH", dialCode: "+233", name: "Ghana", phoneLength: 9 },
  { code: "ID", dialCode: "+62", name: "Indonesia", phoneLength: 11 },
  { code: "IE", dialCode: "+353", name: "Ireland", phoneLength: 9 },
  { code: "IL", dialCode: "+972", name: "Israel", phoneLength: 9 },
  { code: "IT", dialCode: "+39", name: "Italy", phoneLength: 10 },
  { code: "JP", dialCode: "+81", name: "Japan", phoneLength: 11 },
  { code: "KE", dialCode: "+254", name: "Kenya", phoneLength: 10 },
  { code: "KR", dialCode: "+82", name: "South Korea", phoneLength: [7, 8] },
  { code: "LK", dialCode: "+94", name: "Sri Lanka", phoneLength: 7 },
  { code: "MY", dialCode: "+60", name: "Malaysia", phoneLength: 7 },
  { code: "MX", dialCode: "+52", name: "Mexico", phoneLength: 10 },
  { code: "NG", dialCode: "+234", name: "Nigeria", phoneLength: 8 },
  { code: "NL", dialCode: "+31", name: "Netherlands", phoneLength: 9 },
  { code: "NP", dialCode: "+977", name: "Nepal", phoneLength: 10 },
  { code: "NZ", dialCode: "+64", name: "New Zealand", phoneLength: [8, 9] },
  { code: "PH", dialCode: "+63", name: "Philippines", phoneLength: 10 },
  { code: "PK", dialCode: "+92", name: "Pakistan", phoneLength: 10 },
  { code: "SA", dialCode: "+966", name: "Saudi Arabia", phoneLength: 9 },
  { code: "SG", dialCode: "+65", name: "Singapore", phoneLength: 8 },
  { code: "TH", dialCode: "+66", name: "Thailand", phoneLength: 9 },
  { code: "TR", dialCode: "+90", name: "Turkey", phoneLength: 11 },
  { code: "AE", dialCode: "+971", name: "UAE", phoneLength: 9 },
  { code: "US", dialCode: "+1", name: "United States", phoneLength: 10 },
  { code: "VN", dialCode: "+84", name: "Vietnam", phoneLength: 9 },
  { code: "ZA", dialCode: "+27", name: "South Africa", phoneLength: 9 },
];

export function getCountryName(isoCode: string): string {
  const country = COUNTRIES.find(
    (c) => c.code === isoCode.toUpperCase()
  );
  return country?.name ?? isoCode;
}
