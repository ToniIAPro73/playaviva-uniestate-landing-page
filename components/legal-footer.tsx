"use client"

import Link from "next/link"

export function LegalFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-white/10 bg-slate-950 px-5 py-6 text-xs text-slate-400">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p>© {year} Anclora Group — Todos los derechos reservados.</p>
          <p>Playa Viva Residences es una landing de portfolio operada por Anclora Group. La información debe verificarse con documentación oficial del promotor.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/terms" className="hover:text-white">Términos del servicio</Link>
          <Link href="/privacy" className="hover:text-white">Política de privacidad</Link>
          <Link href="/legal" className="hover:text-white">Aviso legal</Link>
          <a href="mailto:hola@anclora.com" className="hover:text-white">hola@anclora.com</a>
          <button type="button" onClick={() => window.dispatchEvent(new Event("anclora:open-cookie-preferences"))} className="hover:text-white">Cookies</button>
        </div>
      </div>
    </footer>
  )
}
