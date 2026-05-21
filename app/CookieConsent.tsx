"use client";

import { useEffect, useState } from "react";
import { Cookie, SlidersHorizontal, X } from "lucide-react";

type CookiePreferences = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
  version: "v1";
};

const STORAGE_KEY = "playa-viva-cookie-consent-v1";

const defaults: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  updatedAt: "",
  version: "v1",
};

export default function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(false);
  const [preferences, setPreferences] = useState(defaults);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<CookiePreferences>;
        const savedPreferences = {
          necessary: true,
          analytics: Boolean(parsed.analytics),
          marketing: Boolean(parsed.marketing),
          updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : "",
          version: "v1",
        } satisfies CookiePreferences;

        window.setTimeout(() => setPreferences(savedPreferences), 0);
        return;
      }
    } catch {}

    window.setTimeout(() => setOpen(true), 0);
  }, []);

  useEffect(() => {
    const listener = () => {
      setOpen(true);
      setSettings(true);
    };

    window.addEventListener("playaviva:open-cookie-preferences", listener);
    return () => window.removeEventListener("playaviva:open-cookie-preferences", listener);
  }, []);

  function persist(next: CookiePreferences) {
    const value = {
      ...next,
      necessary: true as const,
      updatedAt: new Date().toISOString(),
      version: "v1" as const,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    setPreferences(value);
    setOpen(false);
    setSettings(false);
  }

  return (
    <>
      <button
        type="button"
        aria-label="Preferencias de cookies"
        onClick={() => {
          setOpen(true);
          setSettings(true);
        }}
        className="fixed bottom-6 left-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#d7c79d]/70 bg-[#11100d]/90 text-[#d7c79d] shadow-[0_18px_45px_rgba(0,0,0,0.26)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-[#f4ead0] hover:text-[#f4ead0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d7c79d]"
      >
        <Cookie className="h-5 w-5" aria-hidden="true" />
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#11100d]/55 px-4 py-6 backdrop-blur-md sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="playa-viva-cookie-title"
        >
          <div className="relative w-full max-w-2xl overflow-hidden rounded-[1.75rem] border border-[#f4ead0]/55 bg-[#f7f1e6] text-[#271c13] shadow-[0_34px_90px_rgba(0,0,0,0.42)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#b39a5f] to-transparent" />
            <button
              type="button"
              aria-label="Cerrar preferencias de cookies"
              onClick={() => setOpen(false)}
              className="absolute right-5 top-5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#271c13]/10 bg-white/50 text-[#5a4f3d] transition hover:bg-white hover:text-[#271c13]"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>

            <div className="p-7 sm:p-9">
              {!settings ? (
                <div className="space-y-7">
                  <div className="max-w-xl space-y-3">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[#a29060]">
                      Playa Viva Residences
                    </p>
                    <h2 id="playa-viva-cookie-title" className="font-serif text-3xl font-semibold tracking-wide text-[#271c13] sm:text-4xl">
                      Preferencias de cookies
                    </h2>
                    <p className="text-sm leading-7 text-[#5a4f3d]">
                      Utilizamos cookies necesarias para operar la landing y preferencias opcionales para mejorar medición y comunicaciones comerciales solo si las autorizas.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button type="button" onClick={() => persist({ ...defaults, analytics: true, marketing: true })} className="rounded-full bg-[#271c13] px-6 py-3 text-sm font-semibold text-[#f8f5f0] shadow-[0_14px_30px_rgba(39,28,19,0.22)] transition hover:bg-[#3d3528]">
                      Aceptar todas
                    </button>
                    <button type="button" onClick={() => setSettings(true)} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#a29060]/55 bg-white/45 px-6 py-3 text-sm font-semibold text-[#271c13] transition hover:border-[#70623d] hover:bg-white">
                      <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                      Configuración
                    </button>
                    <button type="button" onClick={() => persist(defaults)} className="rounded-full px-6 py-3 text-sm font-semibold text-[#5a4f3d] transition hover:bg-white/55 hover:text-[#271c13]">
                      Rechazar opcionales
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="max-w-xl space-y-3">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[#a29060]">
                      Panel de privacidad
                    </p>
                    <h2 id="playa-viva-cookie-title" className="font-serif text-3xl font-semibold tracking-wide text-[#271c13]">
                      Gestionar cookies
                    </h2>
                  </div>

                  <div className="grid gap-3">
                    <CookieRow title="Cookies necesarias" description="Operación del sitio, seguridad, idioma y envío correcto del formulario." checked disabled onChange={() => {}} />
                    <CookieRow title="Analítica" description="Medición agregada para mejorar rendimiento, secciones y experiencia de navegación." checked={preferences.analytics} onChange={(analytics) => setPreferences((current) => ({ ...current, analytics }))} />
                    <CookieRow title="Marketing" description="Preferencias para seguimiento comercial del dossier y comunicaciones relacionadas con el proyecto." checked={preferences.marketing} onChange={(marketing) => setPreferences((current) => ({ ...current, marketing }))} />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button type="button" onClick={() => setSettings(false)} className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#5a4f3d] transition hover:bg-white/55 hover:text-[#271c13]">
                      Volver
                    </button>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button type="button" onClick={() => persist(defaults)} className="rounded-full border border-[#a29060]/45 bg-white/35 px-5 py-2.5 text-sm font-semibold text-[#271c13] transition hover:bg-white">
                        Rechazar opcionales
                      </button>
                      <button type="button" onClick={() => persist(preferences)} className="rounded-full bg-[#271c13] px-5 py-2.5 text-sm font-semibold text-[#f8f5f0] transition hover:bg-[#3d3528]">
                        Guardar preferencias
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function CookieRow({
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-start justify-between gap-5 rounded-2xl border border-[#a29060]/25 bg-white/45 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
      <span>
        <span className="block text-sm font-semibold text-[#271c13]">{title}</span>
        <span className="mt-1 block text-sm leading-6 text-[#5a4f3d]">{description}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-5 w-5 shrink-0 accent-[#a29060]"
      />
    </label>
  );
}
