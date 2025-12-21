use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import Head from "next/head";
import Script from "next/script";
import Image from "next/image";
import HubSpotScript from "./HubSpotScript";
import { Button } from "@/components/ui/button";
import {
  Globe,
  MapPin,
  Home,
  Star,
  Users,
  Phone,
  TrendingUp,
  Calendar,
  DollarSign,
  Award,
  CheckCircle2,
  Download,
  Mail,
  ArrowUpRight,
  ShieldCheck,
  Bot,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
const ALTCHA_TRANSLATIONS: Record<
  "es" | "en",
  {
    label: string;
    verified: string;
    failed: string;
  }
> = {
  es: {
    label: "Verificación privada (ALTCHA)",
    verified: "✓ Verificado",
    failed: "Intenta nuevamente",
  },
  en: {
    label: "Private verification (ALTCHA)",
    verified: "✓ Verified",
    failed: "Try again",
  },
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "altcha-widget": JSX.IntrinsicElements["div"] & {
        challengeurl: string;
        name?: string;
        hidefooter?: string;
        hidelogo?: string;
        strings?: string;
        language?: "es" | "en";
        theme?: string;
      };
    }
  }
}

const SITE_URL = "https://azurebay-meridian.vercel.app";

type LeadAutomationPayload = {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  language: "es" | "en";
  page?: string;
  timestamp?: string;
  dossierFileName?: string;
  utm: Record<string, string>;
  workflow?: string;
  altchaPayload: string;
};

type LeadAutomationResult = {
  success: boolean;
  hubspot_success?: boolean;
  pdf_success?: boolean;
  pdf_url?: string | null;
  message?: string;
};

type LeadFieldKey = "firstName" | "lastName" | "email" | "privacy" | "captcha";

export default function PlayaVivaLanding() {
  const [language, setLanguage] = useState<"es" | "en">("es");
  const [activeGalleryTab, setActiveGalleryTab] = useState<
    "servicios" | "interior" | "sitios" | "video"
  >("servicios");
  const [animationStates, setAnimationStates] = useState({
    backgroundImage: false,
    logo: false,
    subtitle: false,
    description: false,
    priceBox: false,
    ctaButtons: false,
    scrollIndicator: false,
  });
  const [visibleSections, setVisibleSections] = useState({
    wynnEffect: false,
    investment: false,
    features: false,
    gallery: false,
    apartments: false,
    trust: false,
    location: false,
    faq: false,
    leadForm: false,
    footer: false,
  });

  const [showMenu, setShowMenu] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollPosition, setScrollPosition] = useState<
    "top" | "middle" | "bottom"
  >("top");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [automationFeedback, setAutomationFeedback] = useState<{
    type: "success" | "error";
    userName: string;
  } | null>(null);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [hasLoadedHubSpotScript, setHasLoadedHubSpotScript] = useState(false);
  const [validationMessage, setValidationMessage] = useState<{
    field: LeadFieldKey;
    message: string;
  } | null>(null);
  const [activeApartment, setActiveApartment] = useState<
    "studio" | "oneBed" | "twoBed" | "threeBed"
  >("studio");
  const [activePlayaVivaTab, setActivePlayaVivaTab] = useState(0);
  const [locationView, setLocationView] = useState<"map" | "collage">("map");
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const privacyRef = useRef<HTMLInputElement>(null);
  const altchaRef = useRef<HTMLDivElement>(null);

  // Fit hero to viewport height (especially for mobile landscape)
  const heroStackRef = useRef<HTMLDivElement>(null);
  const [heroScale, setHeroScale] = useState(1);

  const fitHeroToViewport = () => {
    const el = heroStackRef.current;
    if (!el) return;
    const navOffset = window.innerHeight <= 500 ? 80 : 24;
    const available = window.innerHeight - navOffset;
    const rect = el.getBoundingClientRect();
    const scale = Math.min(1, available / rect.height);
    setHeroScale(scale > 0 ? scale : 1);
  };

  useEffect(() => {
    const startAnimationSequence = () => {
      // Background aparece inmediatamente y se espera 3seg
      setAnimationStates((prev) => ({ ...prev, backgroundImage: true }));

      // Logo aparece después de 3seg de espera, dura 2.5seg
      setTimeout(() => {
        setAnimationStates((prev) => ({ ...prev, logo: true }));
      }, 3000);

      // Subtítulo (AL MARJAN ISLAND) - empieza después del logo (3+2.5=5.5seg), dura 2seg
      setTimeout(() => {
        setAnimationStates((prev) => ({ ...prev, subtitle: true }));
      }, 5500);

      // Descripción - empieza después del subtítulo (5.5+2=7.5seg), dura 2seg
      setTimeout(() => {
        setAnimationStates((prev) => ({ ...prev, description: true }));
      }, 7500);

      // Price box - empieza después de descripción (7.5+2=9.5seg), dura 2seg
      setTimeout(() => {
        setAnimationStates((prev) => ({ ...prev, priceBox: true }));
      }, 9500);

      // Botón CTA - empieza después de price box (9.5+2=11.5seg), dura 2seg
      setTimeout(() => {
        setAnimationStates((prev) => ({ ...prev, ctaButtons: true }));
      }, 11500);

      // Scroll indicator - empieza después del botón (11.5+2=13.5seg)
      setTimeout(() => {
        setAnimationStates((prev) => ({ ...prev, scrollIndicator: true }));
      }, 13500);
    };
    startAnimationSequence();
  }, []);

  useEffect(() => {
    fitHeroToViewport();
  }, []);
  useEffect(() => {
    let resizeRaf: number | null = null;

    const scheduleResize = () => {
      if (resizeRaf !== null) return;
      resizeRaf = window.requestAnimationFrame(() => {
        resizeRaf = null;
        fitHeroToViewport();
      });
    };

    window.addEventListener("resize", scheduleResize, { passive: true });
    window.addEventListener("orientationchange", scheduleResize);

    return () => {
      if (resizeRaf !== null) {
        window.cancelAnimationFrame(resizeRaf);
      }
      window.removeEventListener("resize", scheduleResize);
      window.removeEventListener("orientationchange", scheduleResize);
    };
  }, []);

  // Clear validation message when language changes
  useEffect(() => {
    if (validationMessage) {
      setValidationMessage(null);
    }
  }, [language, validationMessage]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    let scrollRaf: number | null = null;

    const updateScrollState = () => {
      const currentScroll = window.scrollY;

      // Calculate scroll progress for hero section (0 to 1)
      const heroHeight = window.innerHeight;
      const progress = Math.min(currentScroll / heroHeight, 1);
      setScrollProgress(progress);

      // Show navbar after scrolling past hero section
      setShowNavbar(currentScroll > window.innerHeight * 0.8);

      // Determine scroll position for navigation buttons
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const scrollableHeight = scrollHeight - clientHeight;
      const scrollPercentage =
        scrollableHeight > 0 ? (currentScroll / scrollableHeight) * 100 : 0;

      if (scrollPercentage < 15) {
        setScrollPosition("top");
      } else if (scrollPercentage > 85) {
        setScrollPosition("bottom");
      } else {
        setScrollPosition("middle");
      }

      const checkSectionVisibility = (
        ref: React.RefObject<HTMLDivElement | null>,
        sectionKey: keyof typeof visibleSections
      ) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        setVisibleSections((prev) => ({
          ...prev,
          [sectionKey]: isVisible || currentScroll > 300,
        }));
      };
      checkSectionVisibility(wynnEffectRef, "wynnEffect");
      checkSectionVisibility(investmentRef, "investment");
      checkSectionVisibility(featuresRef, "features");
      checkSectionVisibility(galleryRef, "gallery");
      checkSectionVisibility(apartmentsRef, "apartments");
      checkSectionVisibility(trustRef, "trust");
      checkSectionVisibility(locationRef, "location");
      checkSectionVisibility(faqRef, "faq");
      checkSectionVisibility(leadFormRef, "leadForm");
      checkSectionVisibility(footerRef, "footer");
      scrollRaf = null;
    };

    const onScroll = () => {
      if (scrollRaf !== null) return;
      scrollRaf = window.requestAnimationFrame(updateScrollState);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateScrollState();

    return () => {
      if (scrollRaf !== null) {
        window.cancelAnimationFrame(scrollRaf);
      }
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;

    (async () => {
      const globalAny = window as any;
      if (!globalAny.__altchaI18nLoaded) {
        try {
          await import("altcha/i18n/all");
          globalAny.__altchaI18nLoaded = true;
        } catch (error) {
          console.error("[ALTCHA] Unable to load i18n bundle:", error);
          return;
        }
      }

      if (cancelled) return;
      const registry = globalAny.altchaI18n;
      if (!registry) return;

      (["es", "en"] as const).forEach((locale) => {
        registry.set(locale, {
          ...(registry.get(locale) ?? {}),
          ...ALTCHA_TRANSLATIONS[locale],
        });
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [language]);

  useEffect(() => {
    if (privacyAccepted && !hasLoadedHubSpotScript) {
      setHasLoadedHubSpotScript(true);
    }
  }, [privacyAccepted, hasLoadedHubSpotScript]);

  const wynnEffectRef = useRef<HTMLDivElement>(null);
  const investmentRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const apartmentsRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const leadFormRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const content = {
    es: {
      hero: {
        title: "Azure Bay",
        subtitle: "AZURE BAY • DISTRITO COSTERO EN EXPANSIÓN",
        description:
          "Caso de estudio (portfolio): complejo residencial ficticio frente al mar, impulsado por la futura Azure Grand Marina (primavera 2027). Proyecciones orientativas.",
        price: "Desde €198.000",
        payment: "Pague solo 1% mensual durante 5 años",
        handover: "Entrega Q3 2026",
        cta1: "Descargar Dossier",
        cta2: "Reservar Ahora",
      },
      menu: {
        wynnEffect: "El Efecto Marina",
        investment: "Inversión",
        features: "Características",
        gallery: "Galería",
        apartments: "Apartamentos",
        location: "Ubicación",
        faq: "FAQ",
      },
      wynnEffect: {
        title: "El Efecto Marina",
        subtitle: "El catalizador que está transformando Azure Bay District",
        description:
          "La futura Azure Grand Marina & Signature Boulevard (apertura prevista en primavera de 2027) está atrayendo inversión, turismo y nueva demanda residencial. El mercado se posiciona antes del hito para capturar el ciclo completo de apreciación del waterfront.",
        stats: [
          {
            icon: TrendingUp,
            value: "+32%",
            label: "Impulso de demanda",
            sublabel: "Proyección 2025–2027",
          },
          {
            icon: DollarSign,
            value: "€3.4B",
            label: "Inversión en distrito",
            sublabel: "Marina + boulevard + retail",
          },
          {
            icon: Calendar,
            value: "Prim. 2027",
            label: "Apertura Marina",
            sublabel: "Hito de consolidación",
          },
        ],
        urgency: {
          title: "¿Por qué posicionarse AHORA?",
          description:
            "Los inversores sofisticados se adelantan a la apertura de la marina y a la activación del paseo comercial. Azure Bay se entrega en Q3 2026, para capturar la ventana de apreciación previa y posterior al lanzamiento.",
          countdown: "Entrega: Q3 2026 • Apertura Marina: Primavera 2027",
        },
      },
      features: {
        // FEATURES_1: Development Structure
        development: {
          title: "Estructura del Desarrollo",
          tagline: "Arquitectura contemporánea frente al mar",
          description: [
            "Tres torres icónicas que combinan elegancia atemporal con el entorno costero de Azure Bay District.",
            "Diseño arquitectónico que maximiza vistas panorámicas al mar abierto desde cada residencia.",
          ],
          image: "/assets/imagenes/collage_estructura_es.png",
        },
        // FEATURES_2: Specifications
        specifications: {
          title: "Especificaciones",
          tagline: "Detalles que definen la excelencia",
          cards: [
            {
              title: "Studios",
              size: "27.87-42.9 m²",
              price: "Desde 192.000€",
              features: "Cocina integrada, baño premium, balcón privado",
            },
            {
              title: "1 Dormitorio",
              size: "55.74-78.97 m²",
              price: "Desde 325.000€",
              features: "Suite en-suite, vestidor, zona de lavandería",
            },
            {
              title: "2 Dormitorios",
              size: "102.19-111.48 m²",
              price: "Desde 540.000€",
              features: "Dos suites, cocina isla, balcones duales",
            },
            {
              title: "3 Dormitorios",
              size: "157.94-167.22 m²",
              price: "Desde 740.000€",
              features: "Master suite, cuarto de servicio, terraza 25m²",
            },
          ],
        },
        // FEATURES_3: Azure Bay Views
        playaViva: {
          title: "Azure Bay",
          tagline: "Cuatro perspectivas de vida frente al mar",
          tabs: [
            {
              label: "Comunidad Costera",
              image: "/assets/imagenes/view1.webp",
              description: "Comunidad exclusiva en primera línea de playa",
            },
            {
              label: "Diseño Inspirador",
              image: "/assets/imagenes/view2.jpg",
              description:
                "Arquitectura que captura la esencia del Mediterráneo",
            },
            {
              label: "Lujo sin Esfuerzo",
              image: "/assets/imagenes/view3.webp",
              description: "Lujo sin esfuerzo en cada detalle",
            },
            {
              label: "Acceso a Playa",
              image: "/assets/imagenes/beach.webp",
              description: "Acceso directo a playas de arena blanca",
            },
          ],
        },
        // FEATURES_4: Amenities Carousel
        amenities: {
          title: "Servicios",
          tagline: "Espacios diseñados para el bienestar",
          items: [
            {
              title: "Cine Exterior",
              image: "/assets/imagenes/cinema.webp",
              description:
                "Cine al aire libre con proyección bajo las estrellas",
            },
            {
              title: "Spa y Bienestar",
              image: "/assets/imagenes/foto galeria 7.jpg",
              description: "Centro de bienestar con tratamientos de lujo",
            },
            {
              title: "Centro de Fitness",
              image: "/assets/imagenes/foto galeria 4.jpg",
              description:
                "Gimnasio equipado con tecnología de última generación",
            },
            {
              title: "Piscinas Exteriores",
              image: "/assets/imagenes/Piscina_mejorada.png",
              description: "Piscinas infinity con vistas al mar Arábigo",
            },
            {
              title: "Comercios y Restauración",
              image: "/assets/imagenes/retail.webp",
              description: "Gastronomía y retail de primer nivel",
            },
          ],
        },
      },
      gallery: {
        title: "El Proyecto",
        subtitle: "Diseño arquitectónico excepcional en Azure Bay District",
        description:
          "Explore la elegancia y sofisticación de Azure Bay a través de renders de alta resolución y fotografías del entorno.",
      },
      apartments: {
        title: "Colección de Apartamentos",
        subtitle: "Espacios diseñados para cada perfil inversor",
        description:
          "Desde estudios boutique hasta áticos de tres dormitorios, cada tipología ofrece vistas al mar, entrega llave en mano y acceso al plan de pago del 1% mensual.",
        note: "Los precios son estimaciones orientativas basadas en el tipo de cambio vigente y pueden variar sin previo aviso.",
        tabs: {
          studio: {
            label: "Estudio",
            headline: "Estudios boutique frente al mar",
            description:
              "Distribución abierta con cocina integrada, ventanales de piso a techo y balcón privado hacia el Golfo.",
            highlights: [
              "Totalmente amueblados con domótica y electrodomésticos premium",
              "Baño hotelero con acabados de piedra natural",
              "Ideal para renta corporativa o pied-à-terre en Azure Coast",
            ],
            parking: "Opción de aparcacoches gratuito para residentes",
          },
          oneBed: {
            label: "1 Habitación",
            headline: "Suite residencial con sala independiente",
            description:
              "Salón comedor con cocina lineal, dormitorio en suite y balcón profundo para disfrutar del skyline.",
            highlights: [
              "Vestidor cerrado y baño principal con doble lavabo",
              "Zona de lavandería y almacenamiento oculto",
              "Elegible para paquete de gestión de rentas llave en mano",
            ],
            parking: "1 plaza de parking (aprox. 11.750€)",
          },
          twoBed: {
            label: "2 Habitaciones",
            headline: "Plantas angulares con vistas duales",
            description:
              "Dos dormitorios en suite, cocina con isla y sala envolvente que accede a dos balcones panorámicos.",
            highlights: [
              "Dormitorio principal tipo master con lounge privado",
              "Baño secundario con ventilación natural y tocador doble",
              "Espacio flexible para despacho o family room",
            ],
            parking: "1 plaza de parking incluida",
          },
          threeBed: {
            label: "3 Habitaciones",
            headline: "Residencias familiares con terraza envolvente",
            description:
              "Amplia zona social, cocina cerrada y tres suites con acceso directo a una terraza de más de 25 m².",
            highlights: [
              "Habitación principal con baño spa y walk-in closet de 6 metros",
              "Cuarto de servicio con baño independiente",
              "Vistas de 180° hacia el mar y el skyline de la Azure Grand Marina",
            ],
            parking: "2 plazas de parking incluidas",
          },
        },
      },
      trust: {
        title: "Caso de Estudio (Portfolio)",
        subtitle: "Landing premium + automatización de captación",
        description:
          "Proyecto ficticio creado por Anclora Cognitive Solutions (Anclora Nexus Group) para demostrar un servicio integral: diseño UI premium, copy bilingüe, estructura de conversión y automatización del lead magnet (dossier).",
        partners: "Cobertura (mock) para contexto narrativo",
        readMore: "Ver ejemplo",
        articles: [
          {
            date: "Mayo 2026",
            image: "/assets/imagenes/news_1.png",
            alt: "Coastal Development Review - Azure Grand Marina",
            source: "Coastal Development Review",
            title: "Azure Grand Marina: el nuevo polo del waterfront",
            summary:
              "Anuncio de la marina, boulevard comercial y oferta gastronómica como catalizador del distrito costero.",
            url: "https://example.com",
          },
          {
            date: "Abril 2026",
            image: "/assets/imagenes/news_2.webp",
            alt: "Global Wealth Digest - Coastal migration",
            source: "Global Wealth Digest",
            title: "La nueva ola de inversión en distritos costeros emergentes",
            summary:
              "Tendencias de movilidad de capital hacia zonas premium frente al mar con infraestructuras planificadas.",
            url: "https://example.com",
          },
          {
            date: "Febrero 2026",
            image: "/assets/imagenes/news_3.png",
            alt: "Marina & Hospitality Report - Signature Boulevard",
            source: "Marina & Hospitality Report",
            title: "Signature Boulevard: retail y hospitality en primera línea",
            summary:
              "Cómo el mix de retail, hotelería y ocio eleva la demanda residencial y la ocupación turística.",
            url: "https://example.com",
          },
          {
            date: "Enero 2026",
            image: "/assets/imagenes/news_4.png",
            alt: "Coastal Economics - Infrastructure impact",
            source: "Coastal Economics",
            title: "Infraestructura y apreciación: el ciclo del waterfront",
            summary:
              "Guía de lectura para inversores: fases de apreciación antes y después de un gran hito urbano.",
            url: "https://example.com",
          },
          {
            date: "Noviembre 2025",
            image: "/assets/imagenes/news_5.png",
            alt: "Residential Market Insights - Supply & demand",
            source: "Residential Market Insights",
            title:
              "Oferta vs demanda: por qué suben los alquileres en zonas prime",
            summary:
              "Factores que explican el incremento de alquileres en productos turnkey frente al mar (análisis ilustrativo).",
            url: "https://example.com",
          },
        ],
      },
      specifications: {
        title: "Especificaciones",
        subtitle: "Unidades diseñadas para el inversor sofisticado",
        description:
          "Desde estudios compactos hasta amplios apartamentos de 3 dormitorios, todas las unidades incluyen acabados premium, domótica y entrega totalmente amueblada.",
        units: [
          {
            type: "Studio",
            size: "37-45 m²",
            price: "Desde €170,000",
            features: [
              "Smart Home",
              "Totalmente amueblado",
              "Balcón privado",
              "Cocina equipada",
            ],
          },
          {
            type: "1 Dormitorio",
            size: "65-75 m²",
            price: "Desde €240,000",
            features: [
              "Smart Home",
              "Totalmente amueblado",
              "Balcón amplio",
              "Dormitorio principal en-suite",
            ],
          },
          {
            type: "2 Dormitorios",
            size: "95-110 m²",
            price: "Desde €350,000",
            features: [
              "Smart Home",
              "Totalmente amueblado",
              "2 Balcones",
              "Dormitorios en-suite",
            ],
          },
          {
            type: "3 Dormitorios",
            size: "135-160 m²",
            price: "Desde €480,000",
            features: [
              "Smart Home",
              "Totalmente amueblado",
              "Terraza amplia",
              "3 Baños completos",
            ],
          },
        ],
      },
      paymentPlan: {
        title: "Plan de Pago",
        subtitle: "Inversión flexible con términos competitivos",
        description:
          "40% durante construcción antes de entrega. Balance 60% a 1% mensual durante 60 meses post-entrega.",
        mainPayment: "40%",
        mainLabel: "Al Comprar",
        postHandover: "60%",
        postLabel: "Post-Entrega",
        postDetails: "1% mensual durante 60 meses",
        features: [
          "Esquema flexible para inversores internacionales",
          "Maximiza tu liquidez durante el periodo de construcción",
        ],
        cards: [
          {
            text: "Accede a la propiedad sin complicaciones: tu inversión se ajusta a ti.",
          },
          {
            text: "Empieza a vivir tu sueño ahora y paga cómodamente a lo largo del tiempo.",
          },
        ],
      },
      investment: {
        title: "Oportunidad de Inversión",
        subtitle: "Rentabilidad impulsada por el Efecto Marina",
        description:
          "Azure Bay es un caso de estudio (proyecto ficticio) diseñado para ilustrar cómo se presenta un activo premium en un distrito costero emergente. Con un plan flexible del 1% mensual y entrega en Q3 2026, el posicionamiento se produce antes de la apertura de la Azure Grand Marina en primavera de 2027.",
        stats: [
          {
            icon: TrendingUp,
            value: "6–8%",
            label: "Rentabilidad bruta objetivo",
            description: "Proyección ilustrativa (según escenarios)",
          },
          {
            icon: TrendingUp,
            value: "+32%",
            label: "Impulso de demanda",
            description: "Hasta el hito de primavera 2027",
          },
          {
            icon: Award,
            value: "Q3 2026",
            label: "Entrega del proyecto",
            description: "Antes del catalizador 2027",
          },
          {
            icon: DollarSign,
            value: "1%",
            label: "Pago mensual",
            description: "Durante 60 meses post‐entrega",
          },
        ],
        benefits: [
          "Catalizador de demanda: Azure Grand Marina (primavera 2027)",
          "Unidades amuebladas + domótica (ejemplo de especificación)",
          "Potencial de apreciación por consolidación del distrito costero",
          "Estrategias de salida y sensibilidad de escenarios en el dossier",
        ],
      },
      leadForm: {
        title: "Dossier de Inversión (Demo)",
        subtitle: "Escenarios financieros + proyecciones del Efecto Marina",
        badge: "Portfolio Demo",
        intro: "Escenarios ilustrativos y proyecciones del Efecto Marina",
        description:
          "Acceda a un dossier de ejemplo con proyecciones de rentabilidad, planos, tipologías y el impacto del catalizador urbano (Azure Grand Marina) sobre Azure Bay District. Caso de estudio creado por Anclora Cognitive Solutions (Anclora Nexus Group).",
        features: [
          "Escenarios 2026–2032 y estrategias de salida",
          "Simulación de cashflow con plan 1% mensual",
          "Tipologías, planos y memorias de calidades (demo)",
          "Calendario de hitos y automatización de seguimiento",
        ],
        form: {
          firstNamePlaceholder: "Nombre",
          lastNamePlaceholder: "Apellidos",
          emailPlaceholder: "Email",
          ctaButton: "Descargar Dossier (Demo)",
          sending: "Preparando tu dossier...",
          privacy:
            "Usamos tus datos solo para personalizar el dossier demo y disparar la automatización descrita.",
          successMessage:
            "Gracias, {{name}}. Tu dossier demo se está enviando a tu bandeja.",
          errorMessage:
            "No pudimos completar el envío. Inténtalo de nuevo o contáctanos.",
        },
      },
      location: {
        title: "Azure Bay District",
        subtitle: "Un waterfront emergente con visión 2030",
        description:
          "Distrito costero planificado para combinar vida residencial premium, paseo marítimo, marina y retail. Ubicación omitida intencionalmente (caso de estudio/portfolio).",
        stats: [
          {
            number: "9",
            label: "Km de paseo marítimo",
            labelEn: "Km of seafront promenade",
          },
          {
            number: "2.3",
            label: "Millones m² masterplan",
            labelEn: "Million m² masterplan",
          },
          {
            number: "3",
            label: "Zonas de marina + retail",
            labelEn: "Marina + retail zones",
          },
          {
            number: "25",
            label: "Min al aeropuerto (demo)",
            labelEn: "Min to airport (demo)",
          },
        ],
      },
      faq: {
        eyebrow: "Preguntas estratégicas",
        title: "Preguntas Frecuentes",
        subtitle:
          "Respuestas orientativas para un caso de estudio (portfolio).",
        highlights: [
          "Proyecto ficticio usado como ejemplo de servicio",
          "Copy bilingüe + estructura de conversión",
          "Automatización del lead magnet incluida en el flujo",
        ],
        cta: "Hablar con un especialista",
        questions: [
          {
            question: "¿Qué es Azure Bay?",
            answer:
              "Azure Bay es un complejo residencial ficticio creado como caso de estudio para mostrar cómo diseñamos una landing premium y una narrativa de inversión alrededor de un distrito costero emergente.",
          },
          {
            question: "¿Qué tipologías de apartamentos hay disponibles?",
            answer:
              "Estudios y unidades de 1, 2 y 3 dormitorios (ejemplo). El objetivo es ilustrar cómo se presenta cada tipología con beneficios claros, highlights y un encaje para distintos perfiles de inversor.",
          },
          {
            question: "¿Qué amenidades ofrece Azure Bay?",
            answer:
              "Amenidades tipo resort (ejemplo): spa, piscinas interior/exterior, rooftop lounge, gimnasio, kids club, playa privada y servicios de concierge 24/7. El listado es configurable según el producto real.",
          },
          {
            question: "¿Cuándo se entregará Azure Bay?",
            answer:
              "La entrega ilustrativa está fijada en Q3 2026, para posicionar al inversor antes del hito urbano principal: la apertura de Azure Grand Marina en primavera de 2027.",
          },
          {
            question: "¿Es una buena oportunidad de inversión?",
            answer:
              "En este caso de estudio, el argumento de inversión se apoya en un catalizador urbano (marina + boulevard) que incrementa demanda y puede impulsar rentas y apreciación. El dossier demo incluye escenarios y sensibilidad.",
          },
          {
            question: "¿Quién es el desarrollador?",
            answer:
              "Meridian Coastal Group (ficticio). El objetivo es demostrar el servicio de Anclora Cognitive Solutions: diseño, copy, estructura de conversión y automatización de captación.",
          },
          {
            question: "¿Cómo funciona el plan de pagos?",
            answer:
              "Ejemplo: 40% durante construcción antes de la entrega, y 60% post‐entrega con pagos del 1% mensual durante 60 meses. El plan se adapta a condiciones reales de cada promotor.",
          },
          {
            question: "¿Dónde está ubicado?",
            answer:
              "Ubicación omitida intencionalmente (portfolio). Se presenta como un distrito costero emergente en primera línea de playa, con un gran catalizador (Azure Grand Marina) previsto para 2027.",
          },
          {
            question: "¿Cuáles son las cuotas de servicio?",
            answer:
              "En un caso real dependen de amenidades y operación. En el dossier demo se incluiría una estimación y el detalle de qué cubren (mantenimiento, seguridad, zonas comunes, etc.).",
          },
        ],
      },
    },
    en: {
      hero: {
        title: "Azure Bay",
        subtitle: "AZURE BAY • EMERGING COASTAL DISTRICT",
        description:
          "Portfolio case study: a fictional beachfront residential concept accelerated by the upcoming Azure Grand Marina (Spring 2027). Indicative projections.",
        price: "Starting from £165,000",
        payment: "Pay Just 1% Per Month for 5 Years",
        handover: "Handover Q3 2026",
        cta1: "Download Dossier",
        cta2: "Book Now",
      },
      menu: {
        wynnEffect: "The Marina Effect",
        investment: "Investment",
        features: "Features",
        gallery: "Gallery",
        apartments: "Apartments",
        location: "Location",
        faq: "FAQ",
      },
      wynnEffect: {
        title: "The Marina Effect",
        subtitle: "The catalyst reshaping Azure Bay District",
        description:
          "The upcoming Azure Grand Marina & Signature Boulevard (opening Spring 2027) is attracting capital, tourism, and new residential demand. Investors position ahead of the milestone to capture the full waterfront appreciation cycle.",
        stats: [
          {
            icon: TrendingUp,
            value: "+32%",
            label: "Demand uplift",
            sublabel: "Indicative 2025–2027",
          },
          {
            icon: DollarSign,
            value: "€3.4B",
            label: "District investment",
            sublabel: "Marina + boulevard + retail",
          },
          {
            icon: Calendar,
            value: "Spring 2027",
            label: "Marina opening",
            sublabel: "Consolidation trigger",
          },
        ],
        urgency: {
          title: "Why position NOW?",
          description:
            "Sophisticated investors move early, ahead of the marina launch and commercial promenade activation. Azure Bay delivers in Q3 2026, aligning you with the pre‐ and post‐launch window.",
          countdown: "Delivery: Q3 2026 • Marina opening: Spring 2027",
        },
      },
      features: {
        // FEATURES_1: Development Structure
        development: {
          title: "Development Structure",
          tagline: "Contemporary architecture facing the sea",
          description: [
            "Three iconic towers combining timeless elegance with the coastal setting of Azure Bay District.",
            "Architectural design that maximizes panoramic views of the open sea from every residence.",
          ],
          image: "/assets/imagenes/collage_estructura_en.png",
        },
        // FEATURES_2: Specifications
        specifications: {
          title: "Specifications",
          tagline: "Details that define excellence",
          cards: [
            {
              title: "Studios",
              size: "300-462 SqFt",
              price: "From £146,200",
              features: "Integrated kitchen, premium bathroom, private balcony",
            },
            {
              title: "1 Bedroom",
              size: "600-850 SqFt",
              price: "From £245,100",
              features: "En-suite bedroom, walk-in closet, laundry area",
            },
            {
              title: "2 Bedrooms",
              size: "1100-1200 SqFt",
              price: "From £387,000",
              features: "Two suites, island kitchen, dual balconies",
            },
            {
              title: "3 Bedrooms",
              size: "1700-1800 SqFt",
              price: "From £559,000",
              features: "Master suite, maid's room, 25m² terrace",
            },
          ],
        },
        // FEATURES_3: Azure Bay Views
        playaViva: {
          title: "Azure Bay",
          tagline: "Four perspectives of beachfront living",
          tabs: [
            {
              label: "Coastal Community",
              image: "/assets/imagenes/view1.webp",
              description: "Exclusive beachfront community",
            },
            {
              label: "Inspired Design",
              image: "/assets/imagenes/view2.jpg",
              description: "Architecture capturing Mediterranean essence",
            },
            {
              label: "Effortless Luxury",
              image: "/assets/imagenes/view3.webp",
              description: "Effortless luxury in every detail",
            },
            {
              label: "Beach Access",
              image: "/assets/imagenes/beach.webp",
              description: "Direct access to white sandy beaches",
            },
          ],
        },
        // FEATURES_4: Amenities Carousel
        amenities: {
          title: "Amenities",
          tagline: "Spaces designed for wellbeing",
          items: [
            {
              title: "Outdoor Cinema",
              image: "/assets/imagenes/cinema.webp",
              description: "Open-air cinema with screenings under the stars",
            },
            {
              title: "Spa & Wellness",
              image: "/assets/imagenes/foto galeria 7.jpg",
              description: "Wellness center with luxury treatments",
            },
            {
              title: "Fitness Center",
              image: "/assets/imagenes/foto galeria 4.jpg",
              description: "Gym equipped with state-of-the-art technology",
            },
            {
              title: "Outdoor Swimming Pools",
              image: "/assets/imagenes/Piscina_mejorada.png",
              description: "Infinity pools with Arabian Sea views",
            },
            {
              title: "Retail & Dining",
              image: "/assets/imagenes/retail.webp",
              description: "World-class dining and retail",
            },
          ],
        },
      },
      gallery: {
        title: "The Project",
        subtitle: "Exceptional architectural design in Azure Bay District",
        description:
          "Explore the elegance and sophistication of Azure Bay through high-resolution renders and environmental photography.",
      },
      apartments: {
        title: "Apartment Collection",
        subtitle: "Layouts tailored to every investment profile",
        description:
          "From boutique studios to three-bedroom residences, each typology delivers sea views, turnkey interiors, and access to the 1% monthly payment plan.",
        note: "Prices are indicative estimates based on prevailing FX and may adjust at the time of reservation.",
        tabs: {
          studio: {
            label: "Studio",
            headline: "Boutique studios facing the sea",
            description:
              "Open-plan living with integrated kitchen, floor-to-ceiling glazing, and a private balcony overlooking the Gulf.",
            highlights: [
              "Fully furnished with smart-home package and premium appliances",
              "Hotel-inspired bathroom wrapped in natural stone",
              "Perfect for corporate leasing or a pied-à-terre in Azure Coast",
            ],
            parking: "Complimentary valet option for residents",
          },
          oneBed: {
            label: "1 Bedroom",
            headline: "One-bedroom suite with defined living zones",
            description:
              "Separate living/dining area, en-suite bedroom, and a deep balcony to capture the skyline.",
            highlights: [
              "Walk-in wardrobe plus primary bathroom with double vanity",
              "Dedicated laundry and concealed storage",
              "Eligible for turnkey rental management",
            ],
            parking: "1 parking space (approx. £10,380)",
          },
          twoBed: {
            label: "2 Bedrooms",
            headline: "Corner layouts with dual-aspect views",
            description:
              "Two en-suite bedrooms, island kitchen, and wraparound living room opening onto twin panoramic balconies.",
            highlights: [
              "Primary suite with private lounge corner",
              "Secondary bath with natural ventilation and twin vanity",
              "Flexible den for office or family room use",
            ],
            parking: "1 parking space included",
          },
          threeBed: {
            label: "3 Bedrooms",
            headline: "Family residences with sweeping terrace",
            description:
              "Expansive great room, closed kitchen, and three suites that spill onto a 25 m² terrace.",
            highlights: [
              "Owner's suite with spa bathroom and 6-metre walk-in wardrobe",
              "Maid's room with dedicated bathroom",
              "180° views across the sea and the Azure Grand Marina skyline",
            ],
            parking: "2 parking spaces included",
          },
        },
      },
      trust: {
        title: "Case Study (Portfolio)",
        subtitle: "Premium landing + lead automation",
        description:
          "Fictional project created by Anclora Cognitive Solutions (Anclora Nexus Group) to showcase an end‐to‐end service: premium UI, bilingual copy, conversion structure and lead‐magnet automation (dossier).",
        partners: "Mock coverage for narrative context",
        readMore: "View example",
        articles: [
          {
            date: "May 2026",
            image: "/assets/imagenes/news_1.png",
            alt: "Coastal Development Review - Azure Grand Marina",
            source: "Coastal Development Review",
            title: "Azure Grand Marina: the next waterfront hub",
            summary:
              "Announcement of the marina, commercial boulevard and dining scene as the district catalyst.",
            url: "https://example.com",
          },
          {
            date: "April 2026",
            image: "/assets/imagenes/news_2.webp",
            alt: "Global Wealth Digest - Coastal migration",
            source: "Global Wealth Digest",
            title: "Capital shifts towards emerging coastal districts",
            summary:
              "Investor patterns favouring prime beachfront zones with planned infrastructure and hospitality.",
            url: "https://example.com",
          },
          {
            date: "February 2026",
            image: "/assets/imagenes/news_3.png",
            alt: "Marina & Hospitality Report - Signature Boulevard",
            source: "Marina & Hospitality Report",
            title: "Signature Boulevard: retail & hospitality on the seafront",
            summary:
              "How curated retail and leisure programmes boost residential demand and tourist occupancy.",
            url: "https://example.com",
          },
          {
            date: "January 2026",
            image: "/assets/imagenes/news_4.png",
            alt: "Coastal Economics - Infrastructure impact",
            source: "Coastal Economics",
            title: "Infrastructure and appreciation: the waterfront cycle",
            summary:
              "Investor lens: the pre‐ and post‐milestone appreciation phases around major urban catalysts.",
            url: "https://example.com",
          },
          {
            date: "November 2025",
            image: "/assets/imagenes/news_5.png",
            alt: "Residential Market Insights - Supply & demand",
            source: "Residential Market Insights",
            title: "Supply vs demand: why rents rise in prime turnkey products",
            summary:
              "Illustrative analysis of rental pressure drivers for furnished beachfront residences.",
            url: "https://example.com",
          },
        ],
      },
      specifications: {
        title: "Specifications",
        subtitle: "Units designed for the sophisticated investor",
        description:
          "From compact studios to spacious 3-bedroom apartments, all units include premium finishes, home automation and fully furnished delivery.",
        units: [
          {
            type: "Studio",
            size: "37-45 m²",
            price: "From £150,000",
            features: [
              "Smart Home",
              "Fully furnished",
              "Private balcony",
              "Equipped kitchen",
            ],
          },
          {
            type: "1 Bedroom",
            size: "65-75 m²",
            price: "From £210,000",
            features: [
              "Smart Home",
              "Fully furnished",
              "Spacious balcony",
              "Master bedroom en-suite",
            ],
          },
          {
            type: "2 Bedrooms",
            size: "95-110 m²",
            price: "From £310,000",
            features: [
              "Smart Home",
              "Fully furnished",
              "2 Balconies",
              "En-suite bedrooms",
            ],
          },
          {
            type: "3 Bedrooms",
            size: "135-160 m²",
            price: "From £420,000",
            features: [
              "Smart Home",
              "Fully furnished",
              "Large terrace",
              "3 Full bathrooms",
            ],
          },
        ],
      },
      paymentPlan: {
        title: "Payment Plan",
        subtitle: "Flexible investment with competitive terms",
        description:
          "40% during construction before handover. Balance 60% at 1% per month for 60 months post-handover.",
        mainPayment: "40%",
        mainLabel: "On Purchase",
        postHandover: "60%",
        postLabel: "Post-Handover",
        postDetails: "1% per month for 60 months",
        features: [
          "Flexible scheme for international investors",
          "Maximize your liquidity during construction period",
        ],
        cards: [
          {
            text: "Unlock the door to effortless ownership—your investment adapts to you.",
          },
          {
            text: "Start living your dream today, pay comfortably over time.",
          },
        ],
      },
      investment: {
        title: "Investment Opportunity",
        subtitle: "Returns accelerated by the Marina Effect",
        description:
          "Azure Bay is a portfolio case study (fictional project) designed to showcase how a premium waterfront asset is positioned within an emerging coastal district. With a flexible 1% monthly plan and Q3 2026 handover, the timing aligns ahead of the Azure Grand Marina opening in Spring 2027.",
        stats: [
          {
            icon: TrendingUp,
            value: "6–8%",
            label: "Target gross yield",
            description: "Illustrative projection (scenario‐based)",
          },
          {
            icon: TrendingUp,
            value: "+32%",
            label: "Demand uplift",
            description: "Into the Spring 2027 milestone",
          },
          {
            icon: Award,
            value: "Q3 2026",
            label: "Project handover",
            description: "Ahead of the 2027 catalyst",
          },
          {
            icon: DollarSign,
            value: "1%",
            label: "Monthly payment",
            description: "For 60 months post‐handover",
          },
        ],
        benefits: [
          "Demand catalyst: Azure Grand Marina (Spring 2027)",
          "Turnkey furnishing + smart home (sample spec)",
          "Appreciation potential as the district consolidates",
          "Exit strategies and scenario sensitivity in the dossier",
        ],
      },
      leadForm: {
        title: "Investment Dossier (Demo)",
        subtitle: "Financial scenarios + Marina Effect projections",
        badge: "Portfolio Demo",
        intro: "Illustrative scenarios and Marina Effect projections",
        description:
          "Access a sample dossier with return scenarios, layouts, specs and the projected impact of the urban catalyst (Azure Grand Marina) on Azure Bay District. Portfolio case study built by Anclora Cognitive Solutions (Anclora Nexus Group).",
        features: [
          "2026–2032 scenarios and exit strategies",
          "Cash‐flow simulation with the 1% monthly plan",
          "Masterplan, typologies and delivered specs (demo)",
          "Milestone calendar + follow‐up automation",
        ],
        form: {
          firstNamePlaceholder: "First name",
          lastNamePlaceholder: "Last name",
          emailPlaceholder: "Email",
          ctaButton: "Download Dossier (Demo)",
          sending: "Preparing your dossier...",
          privacy:
            "We only use your details to personalise the demo dossier and trigger the described automation.",
          successMessage:
            "Thank you, {{name}}. Your demo dossier is on its way to your inbox.",
          errorMessage:
            "We couldn't finalise the send. Please try again or contact our team.",
        },
      },
      location: {
        title: "Azure Bay District",
        subtitle: "An emerging waterfront vision for 2030",
        description:
          "A masterplanned coastal district combining premium residential living, a seafront promenade, marina infrastructure and curated retail. Location intentionally omitted (portfolio case study).",
        stats: [
          {
            number: "9",
            label: "Km de paseo marítimo",
            labelEn: "Km of seafront promenade",
          },
          {
            number: "2.3",
            label: "Millones m² masterplan",
            labelEn: "Million m² masterplan",
          },
          {
            number: "3",
            label: "Zonas de marina + retail",
            labelEn: "Marina + retail zones",
          },
          {
            number: "25",
            label: "Min al aeropuerto (demo)",
            labelEn: "Min to airport (demo)",
          },
        ],
      },
      faq: {
        eyebrow: "Strategic Questions",
        title: "Frequently Asked Questions",
        subtitle: "Indicative answers for a portfolio case study.",
        highlights: [
          "Fictional project used as a service example",
          "Bilingual copy + conversion structure",
          "Lead‐magnet automation included in the flow",
        ],
        cta: "Speak to a specialist",
        questions: [
          {
            question: "What is Azure Bay?",
            answer:
              "Azure Bay is a fictional residential concept built as a portfolio case study to showcase a premium landing page and an investment narrative around an emerging coastal district.",
          },
          {
            question: "What types of apartments are available?",
            answer:
              "Studios and 1, 2 and 3‐bed layouts (illustrative). The goal is to demonstrate how each typology is positioned with clear benefits, highlights and fit for different investor profiles.",
          },
          {
            question: "What amenities does Azure Bay offer?",
            answer:
              "Resort‐style amenities (illustrative): spa, indoor/outdoor pools, rooftop lounge, gym, kids club, private beach and 24/7 concierge. The list is configurable per real product.",
          },
          {
            question: "When will Azure Bay be completed?",
            answer:
              "Illustrative delivery is set to Q3 2026, positioning investors ahead of the key urban milestone: the Azure Grand Marina opening in Spring 2027.",
          },
          {
            question: "Is Azure Bay a good investment opportunity?",
            answer:
              "In this case study, the investment argument is driven by an urban catalyst (marina + boulevard) that can lift demand, rents and capital appreciation. The demo dossier includes scenarios and sensitivity.",
          },
          {
            question: "Who is the developer of Azure Bay?",
            answer:
              "Meridian Coastal Group (fictional). The objective is to showcase Anclora Cognitive Solutions' service: design, copy, conversion structure and lead automation.",
          },
          {
            question: "What are the payment terms?",
            answer:
              "Example: 40% during construction before handover, and 60% post‐handover via 1% monthly payments across 60 months. The structure is adapted to each developer's real terms.",
          },
          {
            question: "Where is Azure Bay located?",
            answer:
              "Location is intentionally omitted (portfolio). It is presented as a beachfront district in expansion, supported by a major catalyst (Azure Grand Marina) planned for 2027.",
          },
          {
            question: "What are the service fees at Azure Bay?",
            answer:
              "In real projects they depend on amenities and operations. In the demo dossier we would include an estimate and a clear breakdown of what the fees cover.",
          },
        ],
      },
    },
  };

  const t = content[language];
  const priceString = language === "es" ? "192.000€" : "£172,000";
  const pricePrefix = language === "es" ? "Desde" : "Starting from";
  const mobileMenuLabels =
    language === "es"
      ? { open: "Abrir menú de navegación", close: "Cerrar menú de navegación" }
      : { open: "Open navigation menu", close: "Close navigation menu" };
  const languageToggleAriaLabel =
    language === "es"
      ? "ES | EN — Cambia el idioma a inglés"
      : "ES | EN — Switch language to Spanish";

  const apartmentConfigs = {
    studio: {
      image: "/assets/imagenes/studio.webp",
      sizeSqftRange: [300, 462] as [number, number],
      bedrooms: 0,
      bathrooms: 1,
    },
    oneBed: {
      image: "/assets/imagenes/1-bedroom.webp",
      sizeSqftRange: [600, 850] as [number, number],
      bedrooms: 1,
      bathrooms: 1,
    },
    twoBed: {
      image: "/assets/imagenes/2-bedroom.webp",
      sizeSqftRange: [1100, 1200] as [number, number],
      bedrooms: 2,
      bathrooms: 1,
    },
    threeBed: {
      image: "/assets/imagenes/3-bedroom.png",
      sizeSqftRange: [1700, 1800] as [number, number],
      bedrooms: 3,
      bathrooms: 2,
    },
  };

  const apartmentPrices = {
    studio: { en: "£172,000", es: "192.000€" },
    oneBed: { en: "£325,000", es: "370.000€" },
    twoBed: { en: "£526,000", es: "598.000€" },
    threeBed: { en: "£795,000", es: "905.000€" },
  } as const;

  const formatSizeRange = (range: [number, number]) => {
    if (language === "es") {
      const sqm = range.map((value) => Math.round(value / 10.7639));
      return `${sqm[0]}-${sqm[1]} m²`;
    }
    return `${range[0]}-${range[1]} sq ft`;
  };

  const formatBedroomValue = (count: number) => {
    if (count === 0) {
      return language === "es" ? "Estudio" : "Studio";
    }
    const plural = count > 1;
    return language === "es"
      ? `${count} ${plural ? "habitaciones" : "habitación"}`
      : `${count} ${plural ? "bedrooms" : "bedroom"}`;
  };

  const formatBathroomValue = (count: number) => {
    const valueString =
      language === "es" ? count.toString().replace(".", ",") : count.toString();
    const plural = count > 1;
    return language === "es"
      ? `${valueString} ${plural ? "baños" : "baño"}`
      : `${valueString} ${plural ? "baths" : "bath"}`;
  };

  const infoLabels = {
    size: language === "es" ? "Superficie" : "Interior size",
    price: language === "es" ? "Desde" : "From",
    bedrooms: language === "es" ? "Dormitorios" : "Bedrooms",
    bathrooms: language === "es" ? "Baños" : "Bathrooms",
    parking: "Parking",
  };

  const statCardBaseClasses =
    "rounded-2xl border border-gold-warm/30 p-4 shadow-sm bg-linear-to-br from-[#fdf9f3] via-[#f7ede1] to-[#f1e2d3] text-brown-dark transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:brightness-95";

  const apartmentCopy = t.apartments.tabs[activeApartment];
  const activeApartmentConfig = apartmentConfigs[activeApartment];
  const activeApartmentPrice = apartmentPrices[activeApartment][language];
  const highlightItems = [...apartmentCopy.highlights, t.apartments.note];
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: "Azure Bay Residences",
    description:
      language === "es"
        ? "Residencias frente al mar en Azure Bay District con entrega llave en mano y plan 1% mensual."
        : "Seafront residences in Azure Bay District with turnkey delivery and a 1% monthly plan.",
    url: SITE_URL,
    image: `${SITE_URL}/assets/imagenes/hero-image.webp`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Azure Bay District",
      addressLocality: "Coastal Zone",
      addressCountry: "AE",
    },
    offers: [
      {
        "@type": "AggregateOffer",
        priceCurrency: "GBP",
        lowPrice: "172000",
        highPrice: "795000",
        offerCount: 4,
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "AggregateOffer",
        priceCurrency: "EUR",
        lowPrice: "192000",
        highPrice: "905000",
        offerCount: 4,
        availability: "https://schema.org/InStock",
      },
    ],
    seller: {
      "@type": "Organization",
      name: "Meridian Coastal Group",
      url: "https://www.meridiancoastalgroup.com",
    },
  };
  const featureColumns = [
    t.leadForm.features.slice(0, 2),
    t.leadForm.features.slice(2),
  ];
  const LuxuryBadge = ({
    label,
    alignment = "center",
  }: {
    label: string;
    alignment?: "start" | "center";
  }) => (
    <div
      className={`inline-flex w-full ${
        alignment === "center" ? "justify-center" : "justify-start"
      }`}
    >
      <div className="relative px-10 py-3.5 rounded-full border-2 border-[#A29060] bg-linear-to-br from-[#f5f1ea]/95 via-white/90 to-[#ede8df]/95 text-[#A29060] font-bold tracking-[0.35em] shadow-[0_8px_32px_rgba(162,144,96,0.3),0_0_0_1px_rgba(162,144,96,0.2)_inset,0_1px_2px_rgba(255,255,255,0.8)_inset] backdrop-blur-md overflow-hidden group transition-all duration-500 hover:shadow-[0_16px_48px_rgba(162,144,96,0.6),0_0_60px_rgba(162,144,96,0.3),0_0_0_2px_rgba(162,144,96,0.5)_inset,0_2px_4px_rgba(255,255,255,1)_inset] hover:scale-105 hover:border-[#d4b876] cursor-pointer">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-[#A29060]/60 to-transparent group-hover:via-[#d4b876] transition-all duration-500"></div>
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/60 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out"></div>
        <div className="absolute inset-0 bg-linear-to-br from-[#A29060]/0 via-[#A29060]/0 to-[#A29060]/0 group-hover:from-[#A29060]/10 group-hover:via-white/20 group-hover:to-[#d4b876]/10 transition-all duration-500"></div>
        <div
          className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #A29060 1px, transparent 0)",
            backgroundSize: "16px 16px",
          }}
        ></div>
        <span className="relative z-10 group-hover:drop-shadow-[0_0_8px_rgba(162,144,96,0.4)] transition-all duration-500 uppercase tracking-[0.35em] text-xs md:text-sm">
          {label}
        </span>
      </div>
    </div>
  );
  const nameLabel = language === "es" ? "Nombre completo" : "Full name";
  const emailLabel = "Email";

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setShowMenu(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  const showBackToHero = scrollProgress >= 1;

  const orchestrateLeadAutomation = async (
    payload: LeadAutomationPayload
  ): Promise<LeadAutomationResult> => {
    const getHubSpotCookie = () => {
      if (typeof document === "undefined") return "";
      const cookies = document.cookie.split(";");
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split("=");
        if (name === "hubspotutk") {
          return value;
        }
      }
      return "";
    };

    const hubspotutk = getHubSpotCookie() || `generated_${Date.now()}`;
    const pageUri =
      typeof window !== "undefined" ? window.location.href : SITE_URL;

    const response = await fetch("/api/submit-lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: payload.firstName,
        lastName: payload.lastName,
        fullName: payload.fullName,
        email: payload.email,
        language: payload.language,
        hubspotutk,
        pageUri,
        utm: payload.utm,
        altchaPayload: payload.altchaPayload,
      }),
    });

    if (!response.ok) {
      let errorMessage = "Error procesando lead";
      try {
        const errorData = await response.json();
        errorMessage = errorData?.error || errorMessage;
      } catch {
        // swallow
      }
      throw new Error(errorMessage);
    }

    return response.json();
  };

  const fieldErrorCopy: Record<LeadFieldKey, string> = {
    firstName:
      language === "es"
        ? "Indica tu nombre para personalizar el dossier."
        : "Please include your first name so we can personalize the dossier.",
    lastName:
      language === "es"
        ? "Añade tus apellidos para continuar."
        : "Please add your last name to continue.",
    email:
      language === "es"
        ? "Necesitamos tu email para enviarte el dossier."
        : "We need your email address to deliver the dossier.",
    privacy:
      language === "es"
        ? "Debes aceptar la política de privacidad para recibir el dossier."
        : "You must accept the privacy policy before receiving the dossier.",
    captcha:
      language === "es"
        ? "Completa la verificación de seguridad para continuar."
        : "Please complete the security verification to continue.",
  };

  const emailInvalidCopy =
    language === "es"
      ? "Introduce un correo electrónico válido."
      : "Please enter a valid email address.";
  const altchaErrorCopy =
    language === "es"
      ? "Completa la verificación de seguridad antes de solicitar el dossier."
      : "Please complete the security verification before requesting the dossier.";

  const altchaTitle =
    language === "es"
      ? "Protección ALTCHA sin fricción"
      : "ALTCHA frictionless protection";
  const altchaCopy =
    language === "es"
      ? "ALTCHA verifica silenciosamente en tu dispositivo sin rastrear ni mostrar badges ajenos. Mantiene fuera a los bots sin romper la experiencia de lujo."
      : "ALTCHA verifies silently on-device with zero tracking or foreign badges, blocking bots without breaking the luxury experience.";
  const altchaStrings =
    language === "es"
      ? '{"label":"Verificando...","verified":"✓ Verificado","failed":"Vuelve a intentarlo"}'
      : '{"label":"Verifying...","verified":"✓ Verified","failed":"Please try again"}';
  const consentTitle =
    language === "es" ? "Privacidad de datos" : "Data privacy";
  const consentCopy =
    language === "es"
      ? "Añade un campo de privacidad de datos cuando necesites el consentimiento explícito de tus contactos. Refuerza la confianza y mantiene la trazabilidad legal."
      : "Add a dedicated data-privacy field whenever you need your contacts' consent. It reinforces trust and keeps compliance effortless.";
  const privacyCheckboxLabel =
    language === "es"
      ? "Acepto la política de privacidad y autorizo el uso de mis datos para recibir el dossier personalizado."
      : "I accept the privacy policy and authorise the use of my data to receive the personalised dossier.";

  const focusField = (
    ref: { current: HTMLElement | null },
    field: LeadFieldKey,
    message: string
  ) => {
    setValidationMessage({ field, message });
    requestAnimationFrame(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      if (ref.current instanceof HTMLElement) {
        ref.current.focus();
      }
    });
  };

  const handleLeadSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const urlParams = new URLSearchParams(window.location.search);
    const utmData: Record<string, string> = {
      utm_source: urlParams.get("utm_source") || "",
      utm_medium: urlParams.get("utm_medium") || "",
      utm_campaign: urlParams.get("utm_campaign") || "",
      utm_term: urlParams.get("utm_term") || "",
      utm_content: urlParams.get("utm_content") || "",
    };

    const trimmedFirstName = formData.firstName.trim();
    const trimmedLastName = formData.lastName.trim();
    const trimmedEmail = formData.email.trim();
    const fallbackName = language === "es" ? "inversor" : "investor";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedFirstName) {
      focusField(firstNameRef, "firstName", fieldErrorCopy.firstName);
      return;
    }

    if (!trimmedLastName) {
      focusField(lastNameRef, "lastName", fieldErrorCopy.lastName);
      return;
    }

    if (!trimmedEmail) {
      focusField(emailRef, "email", fieldErrorCopy.email);
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      focusField(emailRef, "email", emailInvalidCopy);
      return;
    }

    const formElement = event.currentTarget;
    const formEntries = new FormData(formElement);
    const altchaPayload = formEntries.get("altcha_payload")?.toString() ?? "";

    if (!altchaPayload) {
      focusField(altchaRef, "captcha", altchaErrorCopy);
      return;
    }

    if (!privacyAccepted) {
      focusField(privacyRef, "privacy", fieldErrorCopy.privacy);
      return;
    }

    setIsSubmitting(true);
    setAutomationFeedback(null);
    setValidationMessage(null);

    try {
      const leadData: LeadAutomationPayload = {
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        fullName: `${trimmedFirstName} ${trimmedLastName}`.trim(),
        email: trimmedEmail,
        language,
        utm: utmData,
        altchaPayload,
      };

      const result = await orchestrateLeadAutomation(leadData);

      if (result?.pdf_url) {
        const absoluteUrl = result.pdf_url.startsWith("http")
          ? result.pdf_url
          : `${window.location.origin}${result.pdf_url}`;
        const link = document.createElement("a");
        link.href = absoluteUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setAutomationFeedback({
        type: "success",
        userName: trimmedFirstName || fallbackName,
      });
      setFormData({ firstName: "", lastName: "", email: "" });
      setPrivacyAccepted(false);

      setTimeout(() => {
        setAutomationFeedback(null);
      }, 5000);
    } catch (error) {
      console.error("Lead automation failed", error);
      setAutomationFeedback({
        type: "error",
        userName: "",
      });

      setTimeout(() => {
        setAutomationFeedback(null);
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-light">
      <Head>
        <link
          rel="preconnect"
          href="https://js-eu1.hs-scripts.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://js-eu1.hscollectedforms.net"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://js-eu1.hs-analytics.net"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://track-eu1.hubspot.com"
          crossOrigin="anonymous"
        />
        <link rel="preload" href="/hero-background.png" as="image" />
      </Head>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Script
        src="/vendor/altcha.js"
        type="module"
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />
      {hasLoadedHubSpotScript && <HubSpotScript />}
      {/* Navigation and Language Toggle - Fixed Bottom Right */}
      <div className="fixed bottom-6 right-6 z-100 flex flex-col items-end gap-3">
        {/* Scroll Navigation Buttons */}
        <div className="flex flex-col gap-2">
          {/* Scroll Up Button - Show in middle and bottom sections */}
          {(scrollPosition === "middle" || scrollPosition === "bottom") && (
            <button
              onClick={scrollToTop}
              aria-label={language === "es" ? "Ir al inicio" : "Go to top"}
              className="group w-12 h-12 rounded-full bg-linear-to-br from-brown-dark via-taupe-medium to-brown-dark border-2 border-gold-warm/30 hover:border-gold-warm/60 shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_32px_rgba(162,144,96,0.4)] transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
            >
              <ChevronUp
                className="w-6 h-6 text-gold-warm group-hover:text-white transition-colors duration-300"
                strokeWidth={3}
              />
            </button>
          )}

          {/* Scroll Down Button - Show in top and middle sections */}
          {(scrollPosition === "top" || scrollPosition === "middle") && (
            <button
              onClick={scrollToBottom}
              aria-label={language === "es" ? "Ir al final" : "Go to bottom"}
              className="group w-12 h-12 rounded-full bg-linear-to-br from-brown-dark via-taupe-medium to-brown-dark border-2 border-gold-warm/30 hover:border-gold-warm/60 shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_32px_rgba(162,144,96,0.4)] transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
            >
              <ChevronDown
                className="w-6 h-6 text-gold-warm group-hover:text-white transition-colors duration-300"
                strokeWidth={3}
              />
            </button>
          )}
        </div>

        {/* Language Toggle - Simple */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLanguage(language === "es" ? "en" : "es")}
          className="bg-white/95 backdrop-blur-sm border-brown-dark/20 hover:bg-cream-light text-brown-dark shadow-lg rounded-full px-4 py-2"
          aria-label={languageToggleAriaLabel}
        >
          <span className={language === "es" ? "font-bold" : "opacity-60"}>
            ES
          </span>
          <span className="mx-2 text-brown-dark/40">|</span>
          <span className={language === "en" ? "font-bold" : "opacity-60"}>
            EN
          </span>
        </Button>
      </div>

      {/* Sticky Navigation Menu - Meridian Coastal Group Style */}
      <nav
        className={`landing-nav fixed top-0 left-0 right-0 z-50 bg-cream-light/98 backdrop-blur-md border-b border-brown-dark/10 shadow-sm transition-transform duration-300 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="landing-nav__inner container mx-auto px-4 md:px-6">
          <div className="landing-nav__bar flex items-center justify-between h-14 md:h-16">
            {/* Logo Meridian Coastal Group */}
            <div className="shrink-0">
              <button
                onClick={() => scrollToSection("meridian")}
                aria-label={
                  language === "es"
                    ? "Ir a Meridian Coastal Group"
                    : "Go to Meridian Coastal Group"
                }
                className="group relative text-brown-dark text-base md:text-lg font-bold tracking-tight transition-all duration-300 hover:text-gold-warm py-2 px-3 rounded-lg"
                style={{
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  letterSpacing: "0.02em",
                }}
              >
                <span className="relative">
                  MERIDIAN COASTAL
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-gold-warm via-[#8B7355] to-transparent group-hover:w-full transition-all duration-500 ease-out" />
                </span>
              </button>
            </div>

            {/* Desktop Menu - Centered (shows on tablet landscape and up) */}
            <div className="hidden md:flex items-center space-x-1 flex-1 justify-center">
              <button
                onClick={() => scrollToSection("wynn-effect")}
                aria-label={t.menu.wynnEffect}
                className="text-brown-dark/70 hover:text-brown-dark transition-all duration-200 text-xs md:text-sm font-normal px-2 md:px-3 py-2 hover:underline underline-offset-4 decoration-gold-warm hover:-translate-y-0.5"
              >
                {t.menu.wynnEffect}
              </button>
              <button
                onClick={() => scrollToSection("investment")}
                aria-label={t.menu.investment}
                className="text-brown-dark/70 hover:text-brown-dark transition-all duration-200 text-xs md:text-sm font-normal px-2 md:px-3 py-2 hover:underline underline-offset-4 decoration-gold-warm hover:-translate-y-0.5"
              >
                {t.menu.investment}
              </button>
              <button
                onClick={() => scrollToSection("features")}
                aria-label={t.menu.features}
                className="text-brown-dark/70 hover:text-brown-dark transition-all duration-200 text-xs md:text-sm font-normal px-2 md:px-3 py-2 hover:underline underline-offset-4 decoration-gold-warm hover:-translate-y-0.5"
              >
                {t.menu.features}
              </button>
              <button
                onClick={() => scrollToSection("gallery")}
                aria-label={t.menu.gallery}
                className="text-brown-dark/70 hover:text-brown-dark transition-all duration-200 text-xs md:text-sm font-normal px-2 md:px-3 py-2 hover:underline underline-offset-4 decoration-gold-warm hover:-translate-y-0.5"
              >
                {t.menu.gallery}
              </button>
              <button
                onClick={() => scrollToSection("apartments")}
                aria-label={t.menu.apartments}
                className="text-brown-dark/70 hover:text-brown-dark transition-all duration-200 text-xs md:text-sm font-normal px-2 md:px-3 py-2 hover:underline underline-offset-4 decoration-gold-warm hover:-translate-y-0.5"
              >
                {t.menu.apartments}
              </button>
              <button
                onClick={() => scrollToSection("location")}
                aria-label={t.menu.location}
                className="text-brown-dark/70 hover:text-brown-dark transition-all duration-200 text-xs md:text-sm font-normal px-2 md:px-3 py-2 hover:underline underline-offset-4 decoration-gold-warm hover:-translate-y-0.5"
              >
                {t.menu.location}
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                aria-label={t.menu.faq}
                className="text-brown-dark/70 hover:text-brown-dark transition-all duration-200 text-xs md:text-sm font-normal px-2 md:px-3 py-2 hover:underline underline-offset-4 decoration-gold-warm hover:-translate-y-0.5"
              >
                {t.menu.faq}
              </button>
            </div>

            {/* Book Now Button - Desktop */}
            <div className="hidden md:block shrink-0">
              <Button
                onClick={() => scrollToSection("dossier")}
                className="bg-gold-warm hover:bg-gold-warm/90 text-brown-dark font-semibold px-4 md:px-6 py-1.5 md:py-2 text-xs md:text-sm rounded-md shadow-md transition-all duration-200 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {language === "es" ? "Dossier Exclusivo" : "Exclusive Dossier"}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="md:hidden text-brown-dark hover:text-gold-warm p-2"
              aria-label={
                showMenu ? mobileMenuLabels.close : mobileMenuLabels.open
              }
              aria-expanded={showMenu}
              aria-controls="mobile-nav-menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {showMenu ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {showMenu && (
            <div
              id="mobile-nav-menu"
              className="md:hidden py-4 border-t border-brown-dark/10 bg-cream-light"
            >
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => scrollToSection("wynn-effect")}
                  aria-label={t.menu.wynnEffect}
                  className="text-brown-dark/70 hover:text-brown-dark transition-all duration-200 text-sm font-normal text-left py-2 hover:underline underline-offset-4 decoration-gold-warm"
                >
                  {t.menu.wynnEffect}
                </button>
                <button
                  onClick={() => scrollToSection("investment")}
                  aria-label={t.menu.investment}
                  className="text-brown-dark/70 hover:text-brown-dark transition-all duration-200 text-sm font-normal text-left py-2 hover:underline underline-offset-4 decoration-gold-warm"
                >
                  {t.menu.investment}
                </button>
                <button
                  onClick={() => scrollToSection("features")}
                  aria-label={t.menu.features}
                  className="text-brown-dark/70 hover:text-brown-dark transition-all duration-200 text-sm font-normal text-left py-2 hover:underline underline-offset-4 decoration-gold-warm"
                >
                  {t.menu.features}
                </button>
                <button
                  onClick={() => scrollToSection("gallery")}
                  aria-label={t.menu.gallery}
                  className="text-brown-dark/70 hover:text-brown-dark transition-all duration-200 text-sm font-normal text-left py-2 hover:underline underline-offset-4 decoration-gold-warm"
                >
                  {t.menu.gallery}
                </button>
                <button
                  onClick={() => scrollToSection("apartments")}
                  aria-label={t.menu.apartments}
                  className="text-brown-dark/70 hover:text-brown-dark transition-all duration-200 text-sm font-normal text-left py-2 hover:underline underline-offset-4 decoration-gold-warm"
                >
                  {t.menu.apartments}
                </button>
                <button
                  onClick={() => scrollToSection("location")}
                  aria-label={t.menu.location}
                  className="text-brown-dark/70 hover:text-brown-dark transition-all duration-200 text-sm font-normal text-left py-2 hover:underline underline-offset-4 decoration-gold-warm"
                >
                  {t.menu.location}
                </button>
                <button
                  onClick={() => scrollToSection("faq")}
                  aria-label={t.menu.faq}
                  className="text-brown-dark/70 hover:text-brown-dark transition-all duration-200 text-sm font-normal text-left py-2 hover:underline underline-offset-4 decoration-gold-warm"
                >
                  {t.menu.faq}
                </button>
                <Button
                  onClick={() => scrollToSection("dossier")}
                  size="sm"
                  className="bg-gold-warm hover:bg-gold-warm/90 text-brown-dark font-semibold px-4 py-1.5 text-xs rounded-md shadow-md w-full mt-2 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {language === "es"
                    ? "Dossier Exclusivo"
                    : "Exclusive Dossier"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ==================== SECCIÓN: HERO ==================== */}
      {/* Hero Section */}
      <section
        id="hero"
        className="hero-section relative min-h-svh overflow-hidden pt-14 md:pt-0"
      >
        {/* Background */}
        <div
          className="absolute inset-0 z-0 transition-all ease-out"
          style={{
            opacity: animationStates.backgroundImage ? 1 : 0,
            transform: animationStates.backgroundImage
              ? "scale(1)"
              : "scale(1.05)",
            filter: animationStates.logo
              ? `brightness(${0.55 + scrollProgress * 0.45}) saturate(${
                  0.4 + scrollProgress * 0.6
                }) blur(${3 - scrollProgress * 3}px)`
              : "brightness(1) saturate(1) blur(0px)",
            transitionDuration: animationStates.logo ? "2000ms" : "700ms",
          }}
        >
          <Image
            src="/hero-background.png"
            alt="Azure Bay Coastal District"
            fill
            priority
            sizes="100vw"
            quality={60}
            className="object-cover"
            onError={(e) => {
              e.currentTarget.src = "/fixed-hero-background.png";
            }}
          />
        </div>

        {/* Content */}
        <div
          className="hero-content relative z-10 h-full flex flex-col items-center justify-center px-4"
          style={{
            opacity: 1 - scrollProgress,
            transition: "opacity 0.1s linear",
          }}
        >
          <div
            ref={heroStackRef}
            className="hero-container container max-w-6xl mx-auto"
            style={{
              transform: heroScale < 1 ? `scale(${heroScale})` : undefined,
              transformOrigin: "top center",
            }}
          >
            <div
              translate="no"
              className="hero-stack flex flex-col items-center justify-center text-center space-y-2 mt-0"
            >
              {/* Logo */}
              <div
                className="transition-all ease-out mt-12"
                style={{
                  opacity: animationStates.logo ? 1 : 0,
                  transform: animationStates.logo ? "scale(1)" : "scale(0.3)",
                  filter: animationStates.logo ? "blur(0px)" : "blur(12px)",
                  transitionDuration: "2500ms",
                }}
              >
                <div className="flex justify-center">
                  <Image
                    src="/logo-playa-viva.png"
                    alt="Azure Bay Logo"
                    width={640}
                    height={256}
                    priority
                    quality={60}
                    className="w-auto h-36 sm:h-48 md:h-56 lg:h-64 xl:h-72 drop-shadow-[0_0_40px_rgba(255,255,255,0.8)] filter brightness-110 contrast-110 object-contain"
                    sizes="(max-width: 640px) 70vw, (max-width: 1024px) 40vw, 30vw"
                  />
                </div>
              </div>

              {/* Subtitle pill: stronger background for readability + gold halo */}
              <div
                className="transition-all ease-out"
                style={{
                  opacity: animationStates.subtitle ? 1 : 0,
                  transform: animationStates.subtitle
                    ? "scale(1)"
                    : "scale(0.3)",
                  filter: animationStates.subtitle ? "blur(0px)" : "blur(12px)",
                  transitionDuration: "2000ms",
                }}
              >
                <div className="hero-subtitle inline-block bg-black/65 sm:bg-black/55 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 border border-gold-warm/60 ring-2 ring-gold-warm/75 shadow-[0_0_40px_rgba(162,144,96,0.7)]">
                  <p className="font-arabic text-gold-warm text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold tracking-[0.02em] sm:tracking-[0.04em] md:tracking-[0.06em] uppercase [text-shadow:0_1px_8px_rgba(0,0,0,0.65)] whitespace-nowrap">
                    {t.hero.subtitle}
                  </p>
                </div>
              </div>

              {/* Description - Multi-line support with improved formatting */}
              <div
                className="transition-all ease-out max-w-4xl px-2"
                style={{
                  opacity: animationStates.description ? 1 : 0,
                  transform: animationStates.description
                    ? "scale(1)"
                    : "scale(0.3)",
                  filter: animationStates.description
                    ? "blur(0px)"
                    : "blur(12px)",
                  transitionDuration: "2000ms",
                }}
              >
                <div className="hero-description relative mx-auto">
                  <p className="relative text-[#FFFFFF] text-xs sm:text-sm md:text-base font-medium leading-relaxed tracking-[0.01em] text-center">
                    {t.hero.description}
                  </p>
                </div>
              </div>

              {/* Price Card: solid background enforced + stronger gold halo on hover */}
              <div
                className="transition-all ease-out"
                style={{
                  opacity: animationStates.priceBox ? 1 : 0,
                  transform: animationStates.priceBox
                    ? "scale(1)"
                    : "scale(0.3)",
                  filter: animationStates.priceBox ? "blur(0px)" : "blur(12px)",
                  transitionDuration: "2000ms",
                }}
              >
                <div className="relative">
                  <div
                    className="hero-price-card rounded-2xl p-3 sm:p-4 shadow-2xl max-w-[90vw] sm:max-w-160 mx-auto transition-all duration-200 border-2 border-brown-dark/85 ring-2 ring-gold-warm/65 hover:-translate-y-[3px] hover:ring-gold-warm/85 hover:shadow-[0_24px_52px_rgba(0,0,0,0.6),0_0_56px_rgba(162,144,96,0.7)]"
                    style={{ backgroundColor: "#6E5F46" }} // sólido y opaco garantizado
                  >
                    <div className="space-y-1.5 sm:space-y-2 text-center">
                      <div className="hero-price-value text-gold-warm text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold whitespace-nowrap [text-shadow:1px_1px_3px_rgba(0,0,0,0.9)]">
                        {pricePrefix}
                        {"\u00A0"}
                        {priceString}
                      </div>
                      <div className="hero-price-payment text-cream-light text-xs sm:text-sm md:text-base font-medium [text-shadow:1px_1px_2px_rgba(0,0,0,0.8)]">
                        {t.hero.payment}
                      </div>
                      <div className="hero-price-handover text-cream-light text-xs sm:text-xs md:text-sm font-medium [text-shadow:0_1px_2px_rgba(0,0,0,0.85)]">
                        {t.hero.handover}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button: Single Dossier download button centered */}
              <div
                className="transition-all ease-out"
                style={{
                  opacity: animationStates.ctaButtons ? 1 : 0,
                  transform: animationStates.ctaButtons
                    ? "scale(1)"
                    : "scale(0.3)",
                  filter: animationStates.ctaButtons
                    ? "blur(0px)"
                    : "blur(12px)",
                  transitionDuration: "2000ms",
                }}
              >
                <div className="flex flex-col gap-3 items-center">
                  <Button
                    onClick={() => scrollToSection("dossier")}
                    size="lg"
                    className="hero-cta bg-gold-warm text-brown-dark font-bold antialiased tracking-wide px-10 py-4 text-base sm:text-lg rounded-xl border-2 border-brown-dark/85 ring-2 ring-gold-warm/65 shadow-2xl transition-all duration-200 hover:bg-gold-warm/80 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(0,0,0,0.55),0_0_48px_rgba(162,144,96,0.65)] hover:ring-gold-warm/85 hover:scale-105"
                  >
                    <span className="flex items-center gap-3">
                      <Download className="h-5 w-5" />
                      <span>
                        {language === "es"
                          ? "Dossier Exclusivo"
                          : "Exclusive Dossier"}
                      </span>
                    </span>
                  </Button>

                  {/* Scroll Indicator (sm+) */}
                  <div
                    className="hero-scroll-indicator mt-2 hidden sm:flex justify-center pointer-events-none animate-bounce"
                    style={{
                      opacity: animationStates.scrollIndicator ? 1 : 0,
                      transform: animationStates.scrollIndicator
                        ? "translateY(0px)"
                        : "translateY(20px)",
                    }}
                  >
                    <div className="w-6 h-10 border-2 border-yellow-400/70 rounded-full flex items-start justify-center p-2">
                      <div className="w-1.5 h-3 bg-yellow-400/80 rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECCIÓN: WYNN EFFECT ==================== */}
      {/* The Wynn Effect - CRITICAL SECTION */}
      <section
        id="wynn-effect"
        ref={wynnEffectRef}
        className="relative py-20 md:py-32 bg-linear-to-br from-brown-dark via-brown-dark to-olive-brown overflow-hidden"
        style={{
          opacity: visibleSections.wynnEffect ? 1 : 0,
          transform: visibleSections.wynnEffect
            ? "translateY(0px)"
            : "translateY(50px)",
          transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, ${`var(--gold-warm)`} 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <LuxuryBadge
              label={
                language === "es"
                  ? "Oportunidad Histórica"
                  : "Historic Opportunity"
              }
            />
            <h2
              className="text-4xl md:text-6xl font-light text-cream-light mb-6 font-arabic"
              style={{
                opacity: visibleSections.wynnEffect ? 1 : 0,
                transform: visibleSections.wynnEffect
                  ? "translateY(0px)"
                  : "translateY(20px)",
                transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s",
              }}
            >
              {t.wynnEffect.title}
            </h2>
            <h3
              className="text-xl md:text-2xl text-gold-warm mb-8"
              style={{
                opacity: visibleSections.wynnEffect ? 1 : 0,
                transform: visibleSections.wynnEffect
                  ? "translateY(0px)"
                  : "translateY(20px)",
                transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s",
              }}
            >
              {t.wynnEffect.subtitle}
            </h3>
            <p
              className="text-cream-light/90 text-base md:text-lg leading-relaxed"
              style={{
                opacity: visibleSections.wynnEffect ? 1 : 0,
                transform: visibleSections.wynnEffect
                  ? "translateY(0px)"
                  : "translateY(20px)",
                transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s",
              }}
            >
              {t.wynnEffect.description}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-16 max-w-6xl mx-auto">
            {t.wynnEffect.stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white border-2 border-gold-warm/40 rounded-2xl p-8 text-center shadow-xl hover:border-gold-warm hover:shadow-2xl hover:shadow-gold-warm/30 transition-all duration-300 hover:-translate-y-2"
                style={{
                  opacity: visibleSections.wynnEffect ? 1 : 0,
                  transform: visibleSections.wynnEffect
                    ? "translateY(0px)"
                    : "translateY(30px)",
                  transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${
                    0.4 + index * 0.1
                  }s`,
                }}
              >
                <div className="flex justify-center mb-6">
                  <div className="bg-gold-warm/20 p-4 rounded-full">
                    <stat.icon className="h-10 w-10 text-gold-warm" />
                  </div>
                </div>
                <div className="text-5xl md:text-6xl font-bold text-gold-warm mb-3">
                  {stat.value}
                </div>
                <h4 className="text-brown-dark text-lg md:text-xl font-semibold mb-2">
                  {stat.label}
                </h4>
                <p className="text-taupe-warm text-sm">{stat.sublabel}</p>
              </div>
            ))}
          </div>

          {/* Urgency Banner */}
          <div
            className="max-w-4xl mx-auto bg-linear-to-r from-gold-warm/20 via-gold-warm/30 to-gold-warm/20 border-2 border-gold-warm rounded-2xl p-8 md:p-12"
            style={{
              opacity: visibleSections.wynnEffect ? 1 : 0,
              transform: visibleSections.wynnEffect
                ? "translateY(0px)"
                : "translateY(30px)",
              transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.7s",
            }}
          >
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-cream-light mb-4">
                {t.wynnEffect.urgency.title}
              </h3>
              <p className="text-cream-light/90 text-base md:text-lg leading-relaxed mb-6">
                {t.wynnEffect.urgency.description}
              </p>
              <div className="inline-block bg-brown-dark/50 rounded-lg px-6 py-3 border border-gold-warm/40">
                <p className="text-gold-warm font-semibold text-sm md:text-base tracking-wide">
                  {t.wynnEffect.urgency.countdown}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER WITH MERIDIAN BRANDING */}
      <section
        id="meridian"
        ref={footerRef}
        className="relative py-16 md:py-20 bg-[#f8f5f0]"
        style={{
          opacity: visibleSections.footer ? 1 : 0,
          transform: visibleSections.footer
            ? "translateY(0px)"
            : "translateY(30px)",
          transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* MERIDIAN COASTAL GROUP Branding */}
            <div className="text-center mb-8 md:mb-10">
              <h2 className="text-4xl md:text-5xl font-light text-[#5a4f3d] mb-3 tracking-[0.15em] uppercase">
                MERIDIAN COASTAL GROUP
              </h2>
              <p className="text-[#6E5F46] text-sm md:text-base leading-relaxed max-w-4xl mx-auto">
                {language === "es"
                  ? "Developer ficticio especializado en proyectos inmobiliarios residenciales de lujo en distritos costeros emergentes. Este proyecto es un caso de estudio creado para demostrar nuestras capacidades de consultoría e implementación."
                  : "Fictional developer specializing in luxury residential real estate projects in emerging coastal districts. This project is a case study created to demonstrate our consulting and implementation capabilities."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
