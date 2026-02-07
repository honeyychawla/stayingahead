"use client";

import { useState, useEffect, useRef } from "react";
import { COUNTRIES } from "@/lib/countries";
import { useGeo } from "@/hooks/use-geo";
import { useUtm } from "@/hooks/use-utm";

const EXPERIENCE_OPTIONS = [
  "Student",
  "Working Professional",
  "Self Employed",
  "Unemployed",
  "Retired",
  "Others",
];

const inputClasses =
  "w-full bg-slate-card border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-secondary/60 focus:outline-none focus:border-lime/40 focus-visible:ring-1 focus-visible:ring-lime/40 transition-colors";

const selectClasses =
  "bg-slate-card border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-lime/40 focus-visible:ring-1 focus-visible:ring-lime/40 transition-colors appearance-none";

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
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState("");
  const [enrollMastermind, setEnrollMastermind] = useState(false);
  const [country, setCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [countryEditable, setCountryEditable] = useState(false);
  const [experienceOpen, setExperienceOpen] = useState(false);
  const experienceRef = useRef<HTMLDivElement>(null);

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
    if (geo.dialCode) setDialCode(geo.dialCode);
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

  // Close experience dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        experienceRef.current &&
        !experienceRef.current.contains(e.target as Node)
      ) {
        setExperienceOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleCountryChange(code: string) {
    const match = COUNTRIES.find((c) => c.code === code);
    if (match) {
      setCountry(match.name);
      setCountryCode(match.code);
      setDialCode(match.dialCode);
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

    const digitsOnly = phone.replace(/\D/g, "");
    if (!phone.trim()) {
      errors.phone = "Phone number is required.";
    } else if (digitsOnly.length < 10) {
      errors.phone = "Phone number must be at least 10 digits.";
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

  // Success view
  if (successData) {
    return (
      <section aria-live="polite">
        <div className="bg-slate-card border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_0_30px_rgba(196,242,73,0.08)] flex flex-col items-center justify-center gap-4 min-h-[300px]">
          <div className="w-16 h-16 rounded-full bg-lime/20 flex items-center justify-center animate-[scale-in_0.4s_ease-out]">
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
    <section className="animate-[fade-in_0.5s_ease-out]">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-slate-card border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_0_30px_rgba(196,242,73,0.08)] flex flex-col gap-4"
      >
        <fieldset disabled={loading} className="contents">
          {/* Name */}
          <div>
            <label htmlFor="name" className="sr-only">
              Your name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-describedby="name-error"
              aria-invalid={!!fieldErrors.name}
              className={`${inputClasses} ${fieldErrors.name ? "border-red-400/50" : ""}`}
            />
            <FieldError id="name-error" message={fieldErrors.name} />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-describedby="email-error"
              aria-invalid={!!fieldErrors.email}
              className={`${inputClasses} ${fieldErrors.email ? "border-red-400/50" : ""}`}
            />
            <FieldError id="email-error" message={fieldErrors.email} />
          </div>

          {/* Phone with country code */}
          <div>
            <div className="flex gap-2">
              <label htmlFor="dial-code" className="sr-only">
                Country calling code
              </label>
              <select
                id="dial-code"
                value={dialCode}
                onChange={(e) => setDialCode(e.target.value)}
                className={`${selectClasses} w-28 shrink-0`}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.dialCode}>
                    {c.dialCode} {c.code}
                  </option>
                ))}
              </select>
              <div className="flex-1">
                <label htmlFor="phone" className="sr-only">
                  Phone number
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  aria-describedby="phone-error"
                  aria-invalid={!!fieldErrors.phone}
                  className={`${inputClasses} ${fieldErrors.phone ? "border-red-400/50" : ""}`}
                />
              </div>
            </div>
            <FieldError id="phone-error" message={fieldErrors.phone} />
          </div>

          {/* Work Experience - Custom Dropdown */}
          <div ref={experienceRef} className="relative">
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
              } ${fieldErrors.experience ? "border-red-400/50" : ""}`}
            >
              {experience || "Work experience"}
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
                className="absolute z-[70] left-0 right-0 mt-1 bg-slate-card border border-white/10 rounded-lg py-1 shadow-lg"
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

          {/* Mastermind toggle */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-secondary" id="mastermind-label">
              Enrol in Weekend AI Mastermind (Free)?
            </label>
            <div
              className="flex gap-2"
              role="group"
              aria-labelledby="mastermind-label"
            >
              <button
                type="button"
                onClick={() => setEnrollMastermind(true)}
                aria-pressed={enrollMastermind}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  enrollMastermind
                    ? "bg-lime text-black"
                    : "bg-white/5 border border-white/10 text-white"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setEnrollMastermind(false)}
                aria-pressed={!enrollMastermind}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  !enrollMastermind
                    ? "bg-lime text-black"
                    : "bg-white/5 border border-white/10 text-white"
                }`}
              >
                No
              </button>
            </div>
          </div>

          {/* Country */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-secondary" id="country-label">
              Country
            </label>
            {!geo.loaded ? (
              <div className="bg-slate-card border border-white/10 rounded-lg px-4 py-2 h-10">
                <div className="h-4 w-32 bg-gray-700 rounded animate-pulse mt-0.5" />
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
                  className={`${selectClasses} w-full`}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span className="bg-slate-card border border-white/10 rounded-lg px-4 py-2 text-white text-sm">
                  <span role="img" aria-label="Location pin">
                    📍
                  </span>{" "}
                  {country} (detected)
                </span>
                <button
                  type="button"
                  onClick={() => setCountryEditable(true)}
                  className="text-lime text-sm hover:underline"
                >
                  Change
                </button>
              </div>
            )}
          </div>
        </fieldset>

        {/* Error message */}
        {error && (
          <p
            role="alert"
            aria-live="polite"
            className="text-red-400 text-sm text-center"
          >
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-lime text-black font-semibold rounded-full w-full py-3.5 text-lg transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2 flex items-center justify-center gap-2"
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
            "Join the Community \u2192"
          )}
        </button>

        <p className="text-secondary text-sm text-center">
          Join 10,000+ AI enthusiasts
        </p>
      </form>
    </section>
  );
}
