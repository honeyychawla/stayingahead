"use client";

import { useState, useEffect } from "react";

interface GeoResult {
  country: string;
  countryCode: string;
  ip: string;
  dialCode: string;
  loaded: boolean;
  error: boolean;
}

interface IpApiResponse {
  country_name: string;
  country_code: string;
  ip: string;
  country_calling_code: string;
}

const GEO_TIMEOUT_MS = 5000;

export function useGeo(): GeoResult {
  const [result, setResult] = useState<GeoResult>({
    country: "",
    countryCode: "",
    ip: "",
    dialCode: "",
    loaded: false,
    error: false,
  });

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), GEO_TIMEOUT_MS);

    fetch("https://ipapi.co/json/", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Geo fetch failed");
        return res.json();
      })
      .then((data: IpApiResponse) => {
        setResult({
          country: data.country_name,
          countryCode: data.country_code,
          ip: data.ip,
          dialCode: data.country_calling_code,
          loaded: true,
          error: false,
        });
      })
      .catch(() => {
        setResult((prev) => ({ ...prev, loaded: true, error: true }));
      })
      .finally(() => {
        clearTimeout(timeoutId);
      });

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, []);

  return result;
}
