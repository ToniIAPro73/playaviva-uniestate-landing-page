"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Cookie, FileText, Mail } from "lucide-react";

export type LegalBlock = {
  title: string;
  body: string;
};

export function LegalPageShell({
  title,
  eyebrow = "Playa Viva Residences - Anclora Group",
  children,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#f8f5f0] text-[#271c13]">
      <div className="relative overflow-hidden border-b border-[#a29060]/20 bg-[#15120d] text-[#f8f5f0]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(162,144,96,0.28),transparent_48%)]" />
        <div className="relative mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-20">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[#d7c79d]">{eyebrow}</p>
          <h1 className="mt-4 font-serif text-4xl font-semibold tracking-wide sm:text-5xl">{title}</h1>
          <p className="mt-4 text-sm text-[#d7c79d]/80">Última actualización: 17 de mayo de 2026</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        <div className="space-y-5">{children}</div>
        <LegalNav />
      </div>

      <SiteFooter />
    </main>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[1.35rem] border border-[#a29060]/28 bg-white/70 p-6 shadow-[0_18px_60px_rgba(39,28,19,0.08)] backdrop-blur">
      <h2 className="font-serif text-2xl font-semibold tracking-wide text-[#3d3528]">{title}</h2>
      <div className="mt-3 text-sm leading-8 text-[#5a4f3d]">{children}</div>
    </section>
  );
}

export function LegalNav() {
  const linkClass =
    "inline-flex items-center gap-2 rounded-full border border-[#a29060]/35 bg-white/55 px-5 py-2.5 text-sm font-semibold text-[#3d3528] transition hover:border-[#70623d] hover:bg-white";

  return (
    <nav className="mt-10 flex flex-wrap gap-3" aria-label="Navegacion legal">
      <Link href="/privacy" className={linkClass}>
        <FileText className="h-4 w-4" aria-hidden="true" />
        Privacidad
      </Link>
      <Link href="/terms" className={linkClass}>
        <FileText className="h-4 w-4" aria-hidden="true" />
        Términos
      </Link>
      <Link href="/legal" className={linkClass}>
        <FileText className="h-4 w-4" aria-hidden="true" />
        Aviso legal
      </Link>
      <Link href="/" className={linkClass}>
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Volver
      </Link>
    </nav>
  );
}

export function SiteFooter({ language = "es" }: { language?: "es" | "en" }) {
  const isSpanish = language === "es";

  return (
    <footer className="border-t border-[#a29060]/25 bg-[#15120d] px-6 py-10 text-[#f8f5f0]">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.35fr_1fr_1fr]">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#d7c79d]">Playa Viva Residences</p>
          <p className="max-w-xl text-sm leading-7 text-[#f8f5f0]/72">
            {isSpanish
              ? "Landing de inversión operada por Anclora Group en colaboración comercial con Uniestate."
              : "Investment landing operated by Anclora Group in commercial collaboration with Uniestate."}
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-[#f8f5f0]">{isSpanish ? "Legal" : "Legal"}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#f8f5f0]/72">
            <Link href="/terms" className="transition hover:text-[#f8f5f0]">{isSpanish ? "Términos" : "Terms"}</Link>
            <Link href="/privacy" className="transition hover:text-[#f8f5f0]">{isSpanish ? "Privacidad" : "Privacy"}</Link>
            <Link href="/legal" className="transition hover:text-[#f8f5f0]">{isSpanish ? "Aviso legal" : "Legal notice"}</Link>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-[#f8f5f0]">{isSpanish ? "Contacto" : "Contact"}</p>
          <a href="mailto:hola@anclora.com" className="inline-flex items-center gap-2 text-sm text-[#f8f5f0]/72 transition hover:text-[#f8f5f0]">
            <Mail className="h-4 w-4" aria-hidden="true" />
            hola@anclora.com
          </a>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("playaviva:open-cookie-preferences"))}
            className="flex w-fit items-center gap-2 rounded-full border border-[#d7c79d]/35 bg-white/5 px-3 py-1.5 text-xs text-[#f8f5f0]/78 transition hover:border-[#d7c79d] hover:text-[#f8f5f0]"
          >
            <Cookie className="h-3.5 w-3.5" aria-hidden="true" />
            {isSpanish ? "Preferencias de cookies" : "Cookie preferences"}
          </button>
        </div>

        <p className="border-t border-[#f8f5f0]/10 pt-5 text-sm text-[#f8f5f0]/60 md:col-span-3">
          © 2026 Anclora Group. {isSpanish ? "Todos los derechos reservados." : "All rights reserved."}
        </p>
      </div>
    </footer>
  );
}
