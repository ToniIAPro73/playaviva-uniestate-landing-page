import { LegalPageShell, LegalSection } from "../LegalChrome";

export default function PrivacyPage() {
  return (
    <LegalPageShell title="Política de privacidad">
      <LegalSection title="Responsable del tratamiento">
        <p>Anclora Group es el responsable del tratamiento de los datos personales recabados a través de esta landing page, en colaboración con Uniestate como agente comercial del proyecto. Contacto: hola@anclora.com.</p>
      </LegalSection>

      <LegalSection title="Datos que tratamos">
        <p>Recabamos los datos que facilitas voluntariamente a través del formulario de contacto: nombre, email, teléfono e idioma de preferencia. Estos datos son necesarios para enviarte el dossier del proyecto y atender tu consulta. También podemos registrar datos técnicos de navegación necesarios para la operación del sitio.</p>
      </LegalSection>

      <LegalSection title="Finalidad y base legal">
        <p>Tratamos tus datos para atender tu consulta sobre Playa Viva Residences, enviarte el dossier de inversión personalizado, gestionar el proceso de captación de interesados y enviarte información comercial relevante sobre el proyecto. La base legal es tu consentimiento y el interés legítimo de Anclora Group y Uniestate en la gestión comercial de la promoción.</p>
      </LegalSection>

      <LegalSection title="Conservación">
        <p>Los datos se conservan durante el tiempo necesario para atender tu solicitud y, si corresponde, durante la vigencia del proceso comercial de la promoción. Una vez concluida la relación, se eliminarán o anonimizarán salvo que exista obligación legal de conservarlos.</p>
      </LegalSection>

      <LegalSection title="Destinatarios">
        <p>Tus datos pueden compartirse con Uniestate y agentes comerciales directamente vinculados al proyecto Playa Viva Residences, así como con proveedores tecnológicos bajo acuerdos de encargo de tratamiento. No vendemos datos personales.</p>
      </LegalSection>

      <LegalSection title="Tus derechos">
        <p>Puedes ejercer tus derechos de acceso, rectificación, supresión, limitación del tratamiento, portabilidad y oposición escribiendo a hola@anclora.com. También puedes reclamar ante la autoridad de control competente.</p>
      </LegalSection>

      <LegalSection title="Cookies">
        <p>Este sitio utiliza cookies técnicas necesarias para su funcionamiento. Pueden guardarse preferencias opcionales de análisis o marketing si las autorizas desde el panel de cookies.</p>
      </LegalSection>
    </LegalPageShell>
  );
}
