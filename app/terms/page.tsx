export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-300">Playa Viva Residences — Anclora Group</p>
          <h1 className="text-4xl font-semibold">Términos del servicio</h1>
          <p className="text-xs text-slate-400">Última actualización: 17 de mayo de 2026</p>
        </div>

        <Section title="Operador">
          <p>Esta landing page es operada por Anclora Group en colaboración con Uniestate para la captación de interesados en la promoción inmobiliaria Playa Viva Residences (Al Marjan Island, Ras Al Khaimah). Contacto: hola@anclora.com.</p>
        </Section>

        <Section title="Naturaleza de la información">
          <p>La información, imágenes, renders, planos, precios orientativos y proyecciones de rentabilidad contenidos en este sitio tienen carácter informativo y publicitario. No constituyen oferta vinculante, contrato de reserva ni compromiso de venta. Los datos definitivos figurarán exclusivamente en los documentos contractuales firmados entre las partes y en la documentación oficial del promotor.</p>
        </Section>

        <Section title="Uso del sitio">
          <p>El acceso y uso de este sitio es libre y gratuito para personas interesadas en el proyecto. Queda prohibido el uso para fines ilícitos, la reproducción no autorizada de contenidos o cualquier acción que pueda perjudicar a Anclora Group, Uniestate o a terceros.</p>
        </Section>

        <Section title="Formulario de contacto y dossier">
          <p>Los datos facilitados a través del formulario de captación se utilizan para atender tu consulta, enviarte el dossier del proyecto y gestionar tu interés en Playa Viva Residences. No se realizan cesiones a terceros no vinculados al proyecto sin tu consentimiento.</p>
        </Section>

        <Section title="Asesoramiento profesional">
          <p>La información publicada no sustituye el asesoramiento legal, fiscal o financiero profesional. Antes de tomar cualquier decisión de inversión, te recomendamos consultar con asesores cualificados, revisar la documentación oficial del promotor y verificar las licencias y permisos vigentes del proyecto.</p>
        </Section>

        <Section title="Propiedad intelectual">
          <p>Los textos, imágenes, logotipos, diseños y materiales multimedia publicados son propiedad de Anclora Group, Uniestate o de los titulares que han autorizado su uso. Queda prohibida su reproducción total o parcial sin autorización escrita.</p>
        </Section>

        <Section title="Limitación de responsabilidad">
          <p>Anclora Group y Uniestate no se responsabilizan de los daños derivados del uso de este sitio ni de la exactitud de proyecciones de rentabilidad o disponibilidad de unidades que pueden variar sin previo aviso según las condiciones del mercado.</p>
        </Section>

        <Section title="Ley aplicable">
          <p>Estos términos se rigen por la ley española. Para cualquier controversia derivada del uso de este sitio, las partes se someten a los tribunales competentes según la normativa aplicable.</p>
        </Section>
      </div>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-2">
      <h2 className="text-xl font-semibold text-teal-100">{title}</h2>
      <div className="text-sm leading-7 text-slate-300">{children}</div>
    </div>
  )
}
