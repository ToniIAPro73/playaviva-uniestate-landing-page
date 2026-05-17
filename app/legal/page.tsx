export default function LegalPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-300">Playa Viva Residences — Anclora Group</p>
          <h1 className="text-4xl font-semibold">Aviso legal</h1>
          <p className="text-xs text-slate-400">Última actualización: 17 de mayo de 2026</p>
        </div>

        <Section title="Titularidad">
          <p>Titular y operador de este sitio: Anclora Group, en colaboración con Uniestate. Playa Viva Residences es una promoción inmobiliaria presentada por Anclora Group. No se afirma registro concedido de marca. Contacto: hola@anclora.com.</p>
        </Section>

        <Section title="Objeto del sitio">
          <p>Este sitio web tiene como propósito la presentación y captación de interesados en la promoción inmobiliaria Playa Viva Residences (Al Marjan Island, Ras Al Khaimah, Emiratos Árabes Unidos). No es una plataforma transaccional ni de comercio electrónico.</p>
        </Section>

        <Section title="Propiedad intelectual">
          <p>Todos los contenidos del sitio (textos, imágenes, logotipos, renders, diseños y materiales multimedia) son propiedad de Anclora Group, Uniestate o de los titulares que han autorizado su uso. Queda prohibida su reproducción, distribución o modificación sin autorización expresa.</p>
        </Section>

        <Section title="Información comercial">
          <p>Los precios, rendimientos estimados, plazos de entrega y características del proyecto que aparecen en este sitio tienen carácter orientativo y publicitario. La información definitiva y vinculante consta exclusivamente en la documentación contractual oficial del promotor.</p>
        </Section>

        <Section title="Normativa aplicable al proyecto">
          <p>El proyecto Playa Viva Residences se desarrolla bajo la normativa urbanística y de inversión extranjera vigente en el Emirato de Ras Al Khaimah. Para información sobre licencias, permisos y situación registral, contacta directamente con el promotor o con asesores legales especializados.</p>
        </Section>

        <Section title="Exclusión de responsabilidad">
          <p>Anclora Group y Uniestate no garantizan la disponibilidad continua del sitio y no se responsabilizan de daños derivados de su uso, de errores u omisiones en la información publicada ni de decisiones tomadas basándose exclusivamente en los contenidos de este sitio.</p>
        </Section>

        <Section title="Legislación aplicable">
          <p>Este aviso legal se rige por la legislación española. Cualquier controversia relativa a este sitio web se someterá a los tribunales españoles competentes, salvo que la normativa de consumo establezca otra jurisdicción.</p>
        </Section>

        <Section title="Contacto">
          <p>Para cualquier consulta legal o reclamación: hola@anclora.com. Intentaremos responder en un plazo máximo de 15 días hábiles.</p>
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
