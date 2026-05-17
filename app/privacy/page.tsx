export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-300">Playa Viva Residences — Anclora Group</p>
          <h1 className="text-4xl font-semibold">Política de privacidad</h1>
          <p className="text-xs text-slate-400">Última actualización: 17 de mayo de 2026</p>
        </div>

        <Section title="Responsable del tratamiento">
          <p>Anclora Group es el responsable del tratamiento de los datos personales recabados a través de esta landing page, en colaboración con Uniestate como agente comercial del proyecto. Contacto: hola@anclora.com.</p>
        </Section>

        <Section title="Datos que tratamos">
          <p>Recabamos los datos que facilitas voluntariamente a través del formulario de contacto: nombre, email, teléfono e idioma de preferencia. Estos datos son necesarios para enviarte el dossier del proyecto y atender tu consulta. También podemos registrar datos técnicos de navegación (IP, navegador) necesarios para la operación del sitio.</p>
        </Section>

        <Section title="Finalidad y base legal">
          <p>Tratamos tus datos para: (1) atender tu consulta sobre Playa Viva Residences, (2) enviarte el dossier de inversión personalizado, (3) gestionar el proceso de captación de interesados y (4) enviarte información comercial relevante sobre el proyecto. La base legal es tu consentimiento y el interés legítimo de Anclora Group y Uniestate en la gestión comercial de la promoción.</p>
        </Section>

        <Section title="Conservación">
          <p>Los datos se conservan durante el tiempo necesario para atender tu solicitud y, si corresponde, durante la vigencia del proceso comercial de la promoción. Una vez concluida la relación, se eliminarán o anonimizarán salvo que exista obligación legal de conservarlos.</p>
        </Section>

        <Section title="Destinatarios">
          <p>Tus datos pueden ser compartidos con Uniestate y los agentes comerciales directamente vinculados al proyecto Playa Viva Residences, así como con proveedores de servicios tecnológicos (CRM, email, almacenamiento) bajo acuerdos de encargo de tratamiento. No vendemos datos personales.</p>
        </Section>

        <Section title="Tus derechos">
          <p>Puedes ejercer tus derechos de acceso, rectificación, supresión, limitación del tratamiento, portabilidad y oposición escribiendo a hola@anclora.com. También puedes reclamar ante la autoridad de control competente (AEPD en España).</p>
        </Section>

        <Section title="Cookies">
          <p>Este sitio utiliza cookies técnicas necesarias para su funcionamiento. Pueden guardarse preferencias opcionales de análisis o marketing si las autorizas desde el panel de cookies flotante.</p>
        </Section>

        <Section title="Seguridad">
          <p>Aplicamos medidas técnicas y organizativas adecuadas para proteger tus datos frente a accesos no autorizados, pérdida o alteración, incluyendo el uso de conexiones cifradas y almacenamiento seguro en la nube.</p>
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
