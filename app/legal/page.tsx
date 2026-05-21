import { LegalPageShell, LegalSection } from "../LegalChrome";

export default function LegalPage() {
  return (
    <LegalPageShell title="Aviso legal">
      <LegalSection title="Titularidad">
        <p>Titular y operador de este sitio: Anclora Group, en colaboración con Uniestate. Playa Viva Residences es una promoción inmobiliaria presentada por Anclora Group. Contacto: hola@anclora.com.</p>
      </LegalSection>

      <LegalSection title="Objeto del sitio">
        <p>Este sitio web tiene como propósito la presentación y captación de interesados en la promoción inmobiliaria Playa Viva Residences, en Al Marjan Island, Ras Al Khaimah, Emiratos Árabes Unidos. No es una plataforma transaccional ni de comercio electrónico.</p>
      </LegalSection>

      <LegalSection title="Propiedad intelectual">
        <p>Todos los contenidos del sitio, incluyendo textos, imágenes, logotipos, renders, diseños y materiales multimedia, son propiedad de Anclora Group, Uniestate o de los titulares que han autorizado su uso. Queda prohibida su reproducción, distribución o modificación sin autorización expresa.</p>
      </LegalSection>

      <LegalSection title="Información comercial">
        <p>Los precios, rendimientos estimados, plazos de entrega y características del proyecto que aparecen en este sitio tienen carácter orientativo y publicitario. La información definitiva y vinculante consta exclusivamente en la documentación contractual oficial del promotor.</p>
      </LegalSection>

      <LegalSection title="Normativa aplicable al proyecto">
        <p>El proyecto Playa Viva Residences se desarrolla bajo la normativa urbanística y de inversión extranjera vigente en Ras Al Khaimah. Para información sobre licencias, permisos y situación registral, contacta directamente con el promotor o con asesores legales especializados.</p>
      </LegalSection>

      <LegalSection title="Exclusión de responsabilidad">
        <p>Anclora Group y Uniestate no garantizan la disponibilidad continua del sitio y no se responsabilizan de daños derivados de su uso, errores u omisiones en la información publicada ni decisiones tomadas basándose exclusivamente en los contenidos de este sitio.</p>
      </LegalSection>

      <LegalSection title="Contacto">
        <p>Para cualquier consulta legal o reclamación: hola@anclora.com. Intentaremos responder en un plazo máximo de 15 días hábiles.</p>
      </LegalSection>
    </LegalPageShell>
  );
}
