"use client";

import { useState, useEffect, useRef } from "react";
import { COUNTRIES } from "@/lib/countries";
import { useGeo } from "@/hooks/use-geo";
import { useUtm } from "@/hooks/use-utm";

/** Convert ISO 3166-1 alpha-2 code to flag emoji via Regional Indicator Symbols */
function countryFlag(code: string): string {
  return code
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

const EXPERIENCE_OPTIONS = [
  "Student",
  "Working Professional",
  "Self Employed",
  "Unemployed",
  "Retired",
  "Others",
];

const inputClasses =
  "w-full bg-slate-card border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-secondary/60 focus:outline-none focus:border-lime/40 focus-visible:ring-1 focus-visible:ring-lime/40 focus:shadow-[0_0_8px_rgba(196,242,73,0.1)] transition-[color,border-color,box-shadow]";

const selectClasses =
  "bg-slate-card border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-lime/40 focus-visible:ring-1 focus-visible:ring-lime/40 focus:shadow-[0_0_8px_rgba(196,242,73,0.1)] transition-[color,border-color,box-shadow] appearance-none";

function FieldError({ message, id }: { message?: string; id: string }) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      aria-live="polite"
      className="text-red-400 text-xs mt-1"
    >
      {message}
    </p>
  );
}

export default function LeadForm() {
  const geo = useGeo();
  const utm = useUtm();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dialCode, setDialCode] = useState("+91");
  const [dialCountryCode, setDialCountryCode] = useState("IN");
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState("");
  const [enrollMastermind, setEnrollMastermind] = useState(true);
  const [country, setCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [countryEditable, setCountryEditable] = useState(false);
  const [experienceOpen, setExperienceOpen] = useState(false);
  const [dialCodeOpen, setDialCodeOpen] = useState(false);
  const experienceRef = useRef<HTMLDivElement>(null);
  const dialCodeRef = useRef<HTMLDivElement>(null);
  const dialCodeBtnRef = useRef<HTMLButtonElement>(null);
  const [dialCodePos, setDialCodePos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successData, setSuccessData] = useState<{
    redirectUrl: string;
    mastermindUrl: string | null;
  } | null>(null);

  // Sync geo data into form state once loaded
  useEffect(() => {
    if (!geo.loaded) return;

    if (geo.error) {
      setCountryEditable(true);
      setCountry("India");
      setCountryCode("IN");
      return;
    }

    setCountry(geo.country);
    setCountryCode(geo.countryCode);
    setIpAddress(geo.ip);
    if (geo.dialCode) {
      setDialCode(geo.dialCode);
      setDialCountryCode(geo.countryCode);
    }
  }, [geo.loaded, geo.error, geo.country, geo.countryCode, geo.ip, geo.dialCode]);

  // Redirect after success
  useEffect(() => {
    if (!successData) return;

    const timer = setTimeout(() => {
      if (successData.mastermindUrl) {
        window.open(successData.mastermindUrl, "_blank");
      }
      window.location.href = successData.redirectUrl;
    }, 1500);

    return () => clearTimeout(timer);
  }, [successData]);

  // Close dropdowns on outside click (using click instead of mousedown
  // so the option's onClick fires first before this handler runs)
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        experienceRef.current &&
        !experienceRef.current.contains(e.target as Node)
      ) {
        setExperienceOpen(false);
      }
      if (
        dialCodeRef.current &&
        !dialCodeRef.current.contains(e.target as Node) &&
        dialCodeBtnRef.current &&
        !dialCodeBtnRef.current.contains(e.target as Node)
      ) {
        setDialCodeOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  function handleCountryChange(code: string) {
    const match = COUNTRIES.find((c) => c.code === code);
    if (match) {
      setCountry(match.name);
      setCountryCode(match.code);
      setDialCode(match.dialCode);
      setDialCountryCode(match.code);
      // Trim phone if it exceeds new country's max length
      const max = Array.isArray(match.phoneLength) ? match.phoneLength[1] : match.phoneLength;
      if (phone.length > max) setPhone(phone.slice(0, max));
    }
  }

  // Derive phone length constraints from selected dial code country
  const selectedCountry = COUNTRIES.find((c) => c.code === dialCountryCode);
  const phoneMin = selectedCountry
    ? Array.isArray(selectedCountry.phoneLength) ? selectedCountry.phoneLength[0] : selectedCountry.phoneLength
    : 7;
  const phoneMax = selectedCountry
    ? Array.isArray(selectedCountry.phoneLength) ? selectedCountry.phoneLength[1] : selectedCountry.phoneLength
    : 15;

  function isFieldValid(field: string): boolean {
    switch (field) {
      case "name":
        return name.trim().length >= 2;
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
      case "phone":
        return phone.length >= phoneMin && phone.length <= phoneMax;
      case "experience":
        return experience !== "";
      default:
        return false;
    }
  }

  function validate(): boolean {
    const errors: Record<string, string> = {};

    if (!name.trim()) {
      errors.name = "Name is required.";
    } else if (name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (!phone.trim()) {
      errors.phone = "Phone number is required.";
    } else if (phone.length < phoneMin || phone.length > phoneMax) {
      errors.phone = phoneMin === phoneMax
        ? `Phone number must be ${phoneMin} digits.`
        : `Phone number must be ${phoneMin}–${phoneMax} digits.`;
    }

    if (!experience) {
      errors.experience = "Please select your work experience.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: `${dialCode}-${phone.trim()}`,
          work_experience: experience,
          weekend_mastermind: enrollMastermind,
          country,
          country_code: countryCode,
          ip_address: ipAddress,
          utm_source: utm.utmSource,
          utm_medium: utm.utmMedium,
          utm_campaign: utm.utmCampaign,
          utm_content: utm.utmContent,
          utm_term: utm.utmTerm,
        }),
      });

      const result = await res.json();

      if (result.success && result.redirectUrl) {
        setSuccessData({
          redirectUrl: result.redirectUrl,
          mastermindUrl: result.mastermindUrl ?? null,
        });
      } else {
        setError(result.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const validCheckmark = (
    <svg
      className="w-4 h-4 text-lime absolute right-3 top-1/2 -translate-y-1/2"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );

  // Success view
  if (successData) {
    return (
      <section aria-live="polite">
        <div className="bg-slate-card border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_0_30px_rgba(196,242,73,0.08)] flex flex-col items-center justify-center gap-4 min-h-[300px]">
          <div className="relative flex items-center justify-center">
            {/* Pulse ring */}
            <div
              className="absolute w-16 h-16 rounded-full bg-lime/20 animate-[pulse-ring_2s_ease-out_infinite_0.5s]"
              aria-hidden="true"
            />
            {/* Checkmark circle */}
            <div className="w-16 h-16 rounded-full bg-lime/20 flex items-center justify-center animate-[scale-in_0.4s_ease-out] relative">
              <svg
                className="w-8 h-8 text-lime"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                  className="animate-[draw-check_0.4s_ease-out_0.2s_both]"
                  style={{
                    strokeDasharray: 24,
                    strokeDashoffset: 24,
                  }}
                />
              </svg>
            </div>
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            You&apos;re in!
          </h2>
          <p className="text-secondary text-base">
            Redirecting to WhatsApp...
          </p>

          {successData.mastermindUrl && (
            <a
              href={successData.mastermindUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lime text-sm hover:underline"
            >
              Join Weekend AI Mastermind &rarr;
            </a>
          )}
        </div>
      </section>
    );
  }

  return (
    <section>
      {/* Mobile backdrop when dropdown is open — outside form to avoid stacking context issues */}
      {(dialCodeOpen || experienceOpen) && (
        <div
          className="fixed inset-0 bg-black/40 z-[65] sm:hidden"
          onClick={() => {
            setDialCodeOpen(false);
            setExperienceOpen(false);
          }}
          aria-hidden="true"
        />
      )}

      {/* Dial code dropdown — rendered outside form to escape stacking contexts */}
      {dialCodeOpen && (
        <div
          ref={dialCodeRef}
          role="listbox"
          aria-label="Country calling code options"
          className="fixed z-[80] w-64 max-h-[min(15rem,40vh)] overflow-y-auto bg-slate-card border border-white/10 rounded-lg py-1 shadow-[0_8px_30px_rgba(0,0,0,0.5)] dropdown-scroll [touch-action:pan-y]"
          style={{ top: dialCodePos.top, left: dialCodePos.left }}
        >
          {COUNTRIES.map((c) => (
            <button
              key={c.code}
              type="button"
              role="option"
              aria-selected={dialCountryCode === c.code}
              onClick={() => {
                setDialCode(c.dialCode);
                setDialCountryCode(c.code);
                setDialCodeOpen(false);
                // Trim phone if it exceeds new country's max length
                const max = Array.isArray(c.phoneLength) ? c.phoneLength[1] : c.phoneLength;
                if (phone.length > max) setPhone(phone.slice(0, max));
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer hover:bg-lime hover:text-black ${
                dialCountryCode === c.code ? "text-lime" : "text-white"
              }`}
            >
              <span className="mr-2">{countryFlag(c.code)}</span>
              {c.name} ({c.dialCode})
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        aria-busy={loading}
        className="bg-slate-card border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_0_30px_rgba(196,242,73,0.08)] flex flex-col gap-4"
      >
        <fieldset
          disabled={loading}
          className={`flex flex-col gap-4 ${loading ? "opacity-60" : "opacity-100"} transition-opacity duration-300`}
        >
          {/* Name */}
          <div style={{ animationDelay: "0ms" }} className="animate-[fade-in_0.4s_ease-out_both]">
            <label htmlFor="name" className="sr-only">
              Your name
            </label>
            <div className="relative">
              <input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-describedby="name-error"
                aria-invalid={!!fieldErrors.name}
                className={`${inputClasses} ${fieldErrors.name ? "border-red-400/50" : ""} ${name.trim() && isFieldValid("name") ? "pr-10" : ""}`}
              />
              {name.trim() && isFieldValid("name") && validCheckmark}
            </div>
            <FieldError id="name-error" message={fieldErrors.name} />
          </div>

          {/* Email */}
          <div style={{ animationDelay: "60ms" }} className="animate-[fade-in_0.4s_ease-out_both]">
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-describedby="email-error"
                aria-invalid={!!fieldErrors.email}
                className={`${inputClasses} ${fieldErrors.email ? "border-red-400/50" : ""} ${email.trim() && isFieldValid("email") ? "pr-10" : ""}`}
              />
              {email.trim() && isFieldValid("email") && validCheckmark}
            </div>
            <FieldError id="email-error" message={fieldErrors.email} />
          </div>

          {/* Country */}
          <div style={{ animationDelay: "120ms" }} className="animate-[fade-in_0.4s_ease-out_both]">
            <span id="country-label" className="sr-only">Country</span>
            {!geo.loaded ? (
              <div className="w-full bg-slate-card border border-white/10 rounded-lg px-4 py-3 h-12 flex items-center">
                <div className="h-4 w-full max-w-[160px] bg-gray-700 rounded animate-pulse" />
              </div>
            ) : countryEditable ? (
              <>
                <label htmlFor="country-select" className="sr-only">
                  Select country
                </label>
                <select
                  id="country-select"
                  value={countryCode}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  aria-labelledby="country-label"
                  className={`${selectClasses} w-full relative z-[1]`}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <div className="w-full bg-slate-card border border-white/10 rounded-lg px-4 py-3 h-12 flex items-center justify-between">
                <span className="text-white text-sm flex items-center gap-1.5">
                  <span role="img" aria-label="Location pin">
                    📍
                  </span>
                  {country} (detected)
                </span>
                <button
                  type="button"
                  onClick={() => setCountryEditable(true)}
                  className="text-lime text-xs hover:underline shrink-0 cursor-pointer"
                >
                  Change
                </button>
              </div>
            )}
          </div>

          {/* Phone with country code — unified container */}
          <div style={{ animationDelay: "180ms" }} className="animate-[fade-in_0.4s_ease-out_both]">
            <div
              className={`flex items-center bg-slate-card border rounded-lg transition-[color,border-color,box-shadow] ${
                fieldErrors.phone
                  ? "border-red-400/50"
                  : dialCodeOpen
                    ? "border-lime/30 shadow-[0_0_8px_rgba(196,242,73,0.1)]"
                    : "border-white/10"
              } focus-within:border-lime/40 focus-within:ring-1 focus-within:ring-lime/40 focus-within:shadow-[0_0_8px_rgba(196,242,73,0.1)]`}
            >
              {/* Dial code dropdown */}
              <div className="relative shrink-0">
                <label htmlFor="dial-code-btn" className="sr-only">
                  Country calling code
                </label>
                <button
                  id="dial-code-btn"
                  ref={dialCodeBtnRef}
                  type="button"
                  onClick={() => {
                    if (!dialCodeOpen && dialCodeBtnRef.current) {
                      const rect = dialCodeBtnRef.current.getBoundingClientRect();
                      setDialCodePos({ top: rect.bottom + 4, left: rect.left });
                    }
                    setDialCodeOpen(!dialCodeOpen);
                  }}
                  aria-expanded={dialCodeOpen}
                  aria-haspopup="listbox"
                  className="flex items-center gap-1.5 pl-3 pr-2 py-3 cursor-pointer text-white bg-transparent border-none outline-none"
                >
                  <span className="text-base leading-none">{countryFlag(dialCountryCode)}</span>
                  <span className="text-sm">{dialCode}</span>
                  <svg
                    className={`w-3.5 h-3.5 text-secondary/60 transition-transform ${dialCodeOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

              </div>

              {/* Vertical divider */}
              <div className="w-px h-5 bg-white/10 shrink-0" />

              {/* Phone input */}
              <div className="flex-1 relative">
                <label htmlFor="phone" className="sr-only">
                  Phone number
                </label>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={phoneMax}
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "");
                    if (digits.length <= phoneMax) setPhone(digits);
                  }}
                  aria-describedby="phone-error"
                  aria-invalid={!!fieldErrors.phone}
                  className={`w-full bg-transparent border-none rounded-r-lg px-3 py-3 text-white placeholder:text-secondary/60 focus:outline-none ${
                    phone.trim() && isFieldValid("phone") ? "pr-10" : ""
                  }`}
                />
                {phone.trim() && isFieldValid("phone") && validCheckmark}
              </div>
            </div>
            <FieldError id="phone-error" message={fieldErrors.phone} />
          </div>

          {/* Work Experience - Custom Dropdown */}
          <div
            ref={experienceRef}
            className={`relative animate-[fade-in_0.4s_ease-out_both] ${experienceOpen ? "z-[70]" : ""}`}
            style={{ animationDelay: "240ms" }}
          >
            <label htmlFor="experience-btn" className="sr-only">
              Work experience
            </label>
            <button
              id="experience-btn"
              type="button"
              onClick={() => setExperienceOpen(!experienceOpen)}
              aria-expanded={experienceOpen}
              aria-haspopup="listbox"
              aria-describedby="experience-error"
              aria-invalid={!!fieldErrors.experience}
              className={`${selectClasses} w-full text-left flex items-center justify-between cursor-pointer ${
                !experience ? "text-secondary/60" : ""
              } ${fieldErrors.experience ? "border-red-400/50" : ""} ${experienceOpen ? "border-lime/30" : ""}`}
            >
              <span className="flex items-center gap-2">
                {experience || "Work experience"}
                {experience && isFieldValid("experience") && (
                  <svg
                    className="w-4 h-4 text-lime shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              <svg
                className={`w-4 h-4 text-secondary transition-transform ${experienceOpen ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {experienceOpen && (
              <div
                role="listbox"
                aria-label="Work experience options"
                className="absolute z-[70] left-0 right-0 mt-1 bg-slate-card border border-white/10 rounded-lg py-1 shadow-[0_8px_30px_rgba(0,0,0,0.5)] dropdown-scroll [touch-action:pan-y]"
              >
                {EXPERIENCE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    role="option"
                    aria-selected={experience === opt}
                    onClick={() => {
                      setExperience(opt);
                      setExperienceOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer hover:bg-lime hover:text-black ${
                      experience === opt ? "text-lime" : "text-white"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
            <FieldError id="experience-error" message={fieldErrors.experience} />
          </div>

          {/* Mastermind opt-in */}
          <label
            className="flex items-start gap-3 cursor-pointer animate-[fade-in_0.4s_ease-out_both]"
            style={{ animationDelay: "300ms" }}
          >
            <input
              type="checkbox"
              checked={enrollMastermind}
              onChange={(e) => setEnrollMastermind(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-lime rounded cursor-pointer shrink-0"
            />
            <span className="text-sm text-secondary leading-snug">
              Also register me for the{" "}
              <span className="text-white font-medium">Free Weekend AI Masterclass</span>
              <span className="inline-flex items-center ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-lime/15 text-lime align-middle">
                Live &amp; Free
              </span>
              <br />
              <span className="text-secondary/70 text-xs">Live online sessions every Saturday &amp; Sunday</span>
            </span>
          </label>
        </fieldset>

        {/* Bottom section: social proof, error, submit, privacy */}
        <div
          className="flex flex-col gap-4 animate-[fade-in_0.4s_ease-out_both]"
          style={{ animationDelay: "360ms" }}
        >
          {/* Social proof avatars */}
          <div className="flex items-center gap-2.5 justify-center">
            <div className="flex items-center">
              {[
                { src: "/avatar-1.jpg", alt: "Community member" },
                { src: "/avatar-2.jpg", alt: "Community member" },
                { src: "/avatar-3.jpg", alt: "Community member" },
                { src: "/avatar-4.jpg", alt: "Community member" },
              ].map((avatar, i) => (
                <div
                  key={avatar.src}
                  className={`w-8 h-8 rounded-full border-2 border-void overflow-hidden shrink-0 ${i > 0 ? "-ml-2.5" : ""}`}
                >
                  <img
                    src={avatar.src}
                    alt={avatar.alt}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
            <span className="text-secondary text-xs">100,000+ joined</span>
          </div>

          {/* Error message */}
          {error && (
            <div
              role="alert"
              aria-live="polite"
              className="bg-red-500/10 border border-red-400/20 rounded-lg px-4 py-3 text-red-400 text-sm text-center"
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-lime text-black font-semibold rounded-full w-full py-3.5 text-lg transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Joining...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Get Instant Access &rarr;
              </>
            )}
          </button>

          {/* Privacy trust signal */}
          <p className="text-secondary text-xs text-center flex items-center justify-center gap-1.5">
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            Your data is safe. No spam, ever.
          </p>
        </div>
      </form>
    </section>
  );
}
