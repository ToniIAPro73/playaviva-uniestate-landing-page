"use client";

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

const SITE_URL = "https://azure-bay-residences.vercel.app";

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

type LeadFieldKey =
  | "firstName"
  | "lastName"
  | "email"
  | "privacy"
  | "captcha";

export default function AzureBayLanding() {
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
  const [scrollPosition, setScrollPosition] = useState<"top" | "middle" | "bottom">("top");
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
        title: "Azure Bay Residences",
        subtitle: "PREMIUM BEACHFRONT COMMUNITY",
        description:
          "Invierta en lujo frente al mar en comunidad costera de primer nivel. Rentabilidades del 7-8%",
        price: "Desde €170.000",
        payment: "Pague solo 1% mensual durante 5 años",
        handover: "Entrega Junio 2026",
        cta1: "Descargar Dossier",
        cta2: "Reservar Ahora",
      },
      menu: {
        wynnEffect: "El Efecto Resort",
        investment: "Inversión",
        features: "Características",
        gallery: "Galería",
        apartments: "Apartamentos",
        location: "Ubicación",
        faq: "FAQ",
      },
      wynnEffect: {
        title: "El Efecto Resort de Clase Mundial",
        subtitle: "La oportunidad que está transformando la región costera",
        description:
          "El futuro resort de clase mundial de $5.1 mil millones será un polo de atracción turística y residencial. Su apertura en 2027 está catalizando una revalorización histórica en la comunidad costera premium.",
        stats: [
          {
            icon: TrendingUp,
            value: "+50%",
            label: "Incremento en alquileres",
            sublabel: "Q1 2023 - Q1 2025",
          },
          {
            icon: DollarSign,
            value: "$5.1B",
            label: "Inversión Resort de Clase Mundial",
            sublabel: "Primera de su tipo en la región",
          },
          {
            icon: Calendar,
            value: "Q2 2027",
            label: "Apertura del Resort",
            sublabel: "Momento de máxima revalorización",
          },
        ],
        urgency: {
          title: "¿Por qué invertir AHORA?",
          description:
            "Los inversores sofisticados están posicionándose antes de la apertura del resort en 2027. Azure Bay se entrega en Q2 2026, permitiéndole capitalizar el efecto completo.",
          countdown: "Entrega: Q2 2026 • Resort apertura: Q2 2027",
        },
      },
      features: {
        // FEATURES_1: Development Structure
        development: {
          title: "Estructura del Desarrollo",
          tagline: "Arquitectura contemporánea frente al mar",
          description: [
            "Tres torres icónicas que combinan elegancia atemporal con el entorno costero premium.",
            "Diseño arquitectónico que maximiza vistas panorámicas al Golfo Arábigo desde cada residencia."
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
              price: "Desde 162.000€",
              features: "Cocina integrada, baño premium, balcón privado"
            },
            {
              title: "1 Dormitorio",
              size: "55.74-78.97 m²",
              price: "Desde 285.000€",
              features: "Suite en-suite, vestidor, zona de lavandería"
            },
            {
              title: "2 Dormitorios",
              size: "102.19-111.48 m²",
              price: "Desde 451.000€",
              features: "Dos suites, cocina isla, balcones duales"
            },
            {
              title: "3 Dormitorios",
              size: "157.94-167.22 m²",
              price: "Desde 665.000€",
              features: "Master suite, cuarto de servicio, terraza 25m²"
            }
          ]
        },
        // FEATURES_3: Azure Bay Views
        playaViva: {
          title: "Azure Bay Residences",
          tagline: "Cuatro perspectivas de vida frente al mar",
          tabs: [
            {
              label: "Comunidad Costera",
              image: "/assets/imagenes/view1.webp",
              description: "Comunidad exclusiva en primera línea de playa"
            },
            {
              label: "Diseño Inspirador",
              image: "/assets/imagenes/view2.jpg",
              description: "Arquitectura que captura la esencia del lujo costero"
            },
            {
              label: "Lujo sin Esfuerzo",
              image: "/assets/imagenes/view3.webp",
              description: "Lujo sin esfuerzo en cada detalle"
            },
            {
              label: "Acceso a Playa",
              image: "/assets/imagenes/beach.webp",
              description: "Acceso directo a playas de arena blanca"
            }
          ]
        },
        // FEATURES_4: Amenities Carousel
        amenities: {
          title: "Servicios",
          tagline: "Espacios diseñados para el bienestar",
          items: [
            {
              title: "Cine Exterior",
              image: "/assets/imagenes/cinema.webp",
              description: "Cine al aire libre con proyección bajo las estrellas"
            },
            {
              title: "Spa y Bienestar",
              image: "/assets/imagenes/foto galeria 7.jpg",
              description: "Centro de bienestar con tratamientos de lujo"
            },
            {
              title: "Centro de Fitness",
              image: "/assets/imagenes/foto galeria 4.jpg",
              description: "Gimnasio equipado con tecnología de última generación"
            },
            {
              title: "Piscinas Exteriores",
              image: "/assets/imagenes/Piscina_mejorada.png",
              description: "Piscinas infinity con vistas al mar Arábigo"
            },
            {
              title: "Comercios y Restauración",
              image: "/assets/imagenes/retail.webp",
              description: "Gastronomía y retail de primer nivel"
            }
          ]
        }
      },
      gallery: {
        title: "El Proyecto",
        subtitle: "Diseño arquitectónico excepcional en comunidad costera premium",
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
              "Ideal para renta corporativa o pied-à-terre en comunidad costera premium",
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
              "Vistas de 180° hacia el mar y el skyline de la región",
            ],
            parking: "2 plazas de parking incluidas",
          },
        },
      },
      trust: {
        title: "Respaldado por Líderes Inmobiliarios",
        subtitle: "Uniestate y partners de confianza",
        description:
          "Uniestate Properties es una promotora inmobiliaria consolidada y de confianza en los Emiratos Árabes Unidos (EAU) con una trayectoria que se remonta a 1995. Uniestate UK es la agencia elegida por Uniestate para la comercialización de Azure Bay por su amplia trayectoria en el sector inmobiliario de lujo.",
        partners: "Cobertura en medios especializados",
        readMore: "Leer en el medio",
        articles: [
          {
            date: "10 Noviembre 2025",
            image: "/assets/imagenes/news_1.png",
            alt: "Hotel Management Network - Resort de Clase Mundial",
            source: "Hotel Management Network",
            title: "Resort de lujo de $5.1B anunciado para región costera",
            summary:
              "Desarrollo de resort de lujo refuerza el posicionamiento de la comunidad costera como destino premium en los EAU.",
            url: "https://www.hotelmanagement-network.com/news/wynn-resorts-marjan-second-resort/",
          },
          {
            date: "7 Noviembre 2025",
            image: "/assets/imagenes/news_2.webp",
            alt: "The National - Escape to Dubai",
            source: "The National",
            title: "Escape to Dubai from high-tax Britain more tempting as 75% fear higher rates",
            summary:
              "Reports record migration of wealthy individuals to UAE, with the emirates experiencing 'a net inflow of 9,800 millionaires from around the world in the past year.'",
            url: "https://www.thenationalnews.com/news/uae/2025/11/07/flight-to-dubai-from-high-tax-britain-more-temping-as-75-fear-new-levies/",
          },
          {
            date: "3 Julio 2025",
            image: "/assets/imagenes/news_3.png",
            alt: "Gulf News - Resort de Lujo",
            source: "Gulf News",
            title: "Región costera ve nuevo resort de lujo de clase mundial",
            summary:
              "Características 'primer resort de entretenimiento de la región - resort de $5.1 mil millones' lanzándose en principios de 2027.",
            url: "https://gulfnews.com/business/tourism/uaes-first-gaming-resort-ras-al-khaimah-sees-new-luxury-hotel-at-wynn-al-marjan-1.500185592",
          },
          {
            date: "30 Abril 2025",
            image: "/assets/imagenes/news_4.png",
            alt: "The National - Resort",
            source: "The National",
            title: "Resort de entretenimiento de región costera preparado para 'abrir al mundo'",
            summary:
              "Explora la influencia del resort de entretenimiento de clase mundial en el desarrollo económico regional y el crecimiento del turismo.",
            url: "https://www.thenationalnews.com/business/economy/2025/04/30/uaes-first-casino-resort-set-to-open-up-ras-al-khaimah-to-the-world/",
          },
          {
            date: "18 Marzo 2025",
            image: "/assets/imagenes/news_5.png",
            alt: "Arabian Business - Precios de propiedades",
            source: "Arabian Business",
            title: "Precios de propiedades suben 20% en medio de brecha oferta-demanda",
            summary:
              "Las propiedades frente al mar cerca del futuro resort en la comunidad costera están en mayor demanda, con estudios y unidades de una habitación liderando el aumento.",
            url: "https://www.arabianbusiness.com/industries/real-estate/ras-al-khaimah-real-estate-property-prices-sise-20-amid-growing-supply-demand-gap",
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
            price: "Desde €162.000",
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
            price: "Desde €240.000",
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
            price: "Desde €360.000",
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
            price: "Desde €490.000",
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
          }
        ]
      },
      investment: {
        title: "Oportunidad de Inversión",
        subtitle: "Rendimientos reales impulsados por el Efecto Resort",
        description:
          "Azure Bay Residences representa una oportunidad única de inversión en comunidad costera premium, epicentro de la transformación inmobiliaria de la región. Con un plan de financiamiento flexible del 1% mensual y entrega en Q2 2026, posiciónese antes de la apertura del resort.",
        stats: [
          {
            icon: TrendingUp,
            value: "7-8%",
            label: "Rendimientos",
            description: "Rendimientos actuales en comunidad costera premium",
          },
          {
            icon: TrendingUp,
            value: "+50%",
            label: "Incremento en alquileres",
            description: "Entre Q1 2023 y Q1 2025",
          },
          {
            icon: Award,
            value: "Q2 2026",
            label: "Entrega del proyecto",
            description: "12 meses antes de la apertura del resort",
          },
          {
            icon: DollarSign,
            value: "1%",
            label: "Pago mensual durante 5 años",
            description: "Plan de financiamiento flexible",
          },
        ],
        benefits: [
          "Márgenes de beneficio operativo cercanos al 8%",
          "Proximidad a futuro resort de clase mundial ($5.1B)",
          "Completamente amueblados y con Smart Home",
          "Potencial de apreciación después de la apertura del resort",
        ],
      },
      leadForm: {
        title: "Dossier de Inversión Exclusivo",
        subtitle: "Análisis financiero completo y proyecciones del Efecto Resort",
        badge: "Dossier de Inversión Exclusivo",
        intro: "Análisis financiero completo y proyecciones del Efecto Resort",
        description:
          "Acceda al análisis más completo de la inversión, con proyecciones de rentabilidad, planos arquitectónicos, especificaciones de alto nivel y el impacto financiero del emblemático resort de clase mundial en la comunidad costera premium. Forme parte de una comunidad exclusiva que anticipa las oportunidades antes que el resto del mercado.",
        features: [
          "Escenarios de rentabilidad y salida 2026-2032",
          "Simulación de cashflow con el plan 1% mensual",
          "Plano maestro, tipologías y memorias de calidades",
          "Calendario de hitos, licencias y soporte postventa",
        ],
        form: {
          firstNamePlaceholder: "Nombre",
          lastNamePlaceholder: "Apellidos",
          emailPlaceholder: "Email",
          ctaButton: "Descargar Dossier Exclusivo",
          sending: "Personalizando dossier...",
          privacy:
            "Usamos tus datos solo para enviar el dossier personalizado y activar la automatización descrita.",
          successMessage:
            "Gracias, {{name}}. Tu dossier personalizado se está enviando a tu bandeja.",
          errorMessage:
            "No pudimos completar el envío. Inténtalo de nuevo o contáctanos.",
        },
      },
      location: {
        title: "Comunidad Costera Premium",
        subtitle: "El futuro de la vida de lujo en los EAU",
        description:
          "Situada en las costas de la región, esta comunidad costera premium es una nueva joya arquitectónica que redefine el concepto de vida de lujo. Esta ubicación sin igual combina belleza natural con sofisticación moderna.",
        stats: [
          {
            number: "4",
            label: "Islas Únicas",
            labelEn: "Unique Islands"
          },
          {
            number: "7.8",
            label: "Kilómetros de Playas Vírgenes",
            labelEn: "Kilometers of Pristine Beaches"
          },
          {
            number: "2.7",
            label: "Millones SqM de Tierra Recuperada",
            labelEn: "Million SqM of Reclaimed Land"
          },
          {
            number: "3",
            label: "Hoteles de Clase Mundial Totalmente Operativos",
            labelEn: "Fully Operational World-Class Hotels"
          }
        ]
      },
      faq: {
        eyebrow: "Preguntas estratégicas",
        title: "Preguntas Frecuentes",
        subtitle:
          "Respuestas detalladas basadas en conversaciones con inversores internacionales.",
        highlights: [
          "Información validada junto a marketing, legal y ventas",
          "Datos actualizados trimestralmente según el avance comercial",
          "Disponible en español e inglés bajo solicitud",
        ],
        cta: "Hablar con un especialista",
        questions: [
          {
            question: "¿Qué es Azure Bay Residences?",
            answer:
              "Azure Bay Residences es un desarrollo residencial de lujo en comunidad costera premium compuesto por tres torres con estudios y apartamentos amueblados de 1, 2 y 3 dormitorios orientados a la vida costera moderna.",
          },
          {
            question: "¿Qué tipologías de apartamentos hay disponibles?",
            answer:
              "Hay estudios y apartamentos de 1, 2 y 3 dormitorios que van de 30 a 170 m² (300-1.800 sq ft) con precios desde £150.000. Todas las residencias ofrecen planos abiertos, vistas panorámicas al mar, balcones privados y sistemas de smart home.",
          },
          {
            question: "¿Qué amenidades ofrece Azure Bay Residences?",
            answer:
              "Gimnasio de última generación, spa de lujo, piscinas interiores y exteriores, cine rooftop, áreas infantiles, playa privada, circuitos de jogging y ciclismo, canchas de tenis, retail en planta baja y concierge/seguridad 24/7.",
          },
          {
            question: "¿Cuándo se entregará Azure Bay Residences?",
            answer:
              "La finalización y entrega están previstas para el Q3 2026. Todas las unidades se entregarán totalmente amuebladas para ocupación inmediata o renta.",
          },
          {
            question: "¿Es una buena oportunidad de inversión?",
            answer:
              "Sí. La proximidad al futuro resort de clase mundial, las amenidades resort y el crecimiento acelerado de la comunidad costera respaldan rentabilidades del 7-8% y una elevada apreciación de capital.",
          },
          {
            question: "¿Quién es el desarrollador?",
            answer:
              "Uniestate Properties, firma fundada en 1995 con 30 años de experiencia, más de 3.000 unidades entregadas y 3,5 millones de pies cuadrados desarrollados entre EAU y Reino Unido.",
          },
          {
            question: "¿Cómo funciona el plan de pagos?",
            answer:
              "20% de entrada, 20% durante la construcción, 1% al entregar llaves y el 59% restante con pagos del 1% mensual durante cinco años. Uniestate ofrece financiación interna de aprobación ágil.",
          },
          {
            question: "¿Dónde está ubicado?",
            answer:
              "En comunidad costera premium, con acceso directo a la autopista hacia centros urbanos principales, ubicación perfecta para vida costera de lujo.",
          },
          {
            question: "¿Cuáles son las cuotas de servicio?",
            answer:
              "Las cuotas de servicio se estiman en 18 AED por pie cuadrado.",
          },
        ],
      },
    },
    en: {
      hero: {
        title: "Azure Bay Residences",
        subtitle: "PREMIUM BEACHFRONT COMMUNITY",
        description:
          "Invest in beachfront luxury in premier coastal community. 7-8% rental yields",
        price: "Starting from £150,000",
        payment: "Pay Just 1% Per Month for 5 Years",
        handover: "Handover June 2026",
        cta1: "Download Dossier",
        cta2: "Book Now",
      },
      menu: {
        wynnEffect: "The Resort Effect",
        investment: "Investment",
        features: "Features",
        gallery: "Gallery",
        apartments: "Apartments",
        location: "Location",
        faq: "FAQ",
      },
      wynnEffect: {
        title: "The World-Class Resort Effect",
        subtitle: "The opportunity transforming the coastal region",
        description:
          "The $5.1 billion world-class resort will be a tourism and residential draw. Its 2027 opening is catalyzing historic appreciation in the premium coastal community.",
        stats: [
          {
            icon: TrendingUp,
            value: "+50%",
            label: "Rental increase",
            sublabel: "Q1 2023 - Q1 2025",
          },
          {
            icon: DollarSign,
            value: "$5.1B",
            label: "World-Class Resort Investment",
            sublabel: "First of its kind in the region",
          },
          {
            icon: Calendar,
            value: "Q2 2027",
            label: "Resort Opening",
            sublabel: "Peak appreciation moment",
          },
        ],
        urgency: {
          title: "Why invest NOW?",
          description:
            "Sophisticated investors are positioning themselves before the resort opens in 2027. Azure Bay delivers in Q2 2026, allowing you to capitalize on the full effect.",
          countdown: "Delivery: Q2 2026 • Resort opening: Q2 2027",
        },
      },
      features: {
        // FEATURES_1: Development Structure
        development: {
          title: "Development Structure",
          tagline: "Contemporary architecture facing the sea",
          description: [
            "Three iconic towers combining timeless elegance with the coastal setting of the premium community.",
            "Architectural design that maximizes panoramic views of the Arabian Gulf from every residence."
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
              price: "From £154,800",
              features: "Integrated kitchen, premium bathroom, private balcony"
            },
            {
              title: "1 Bedroom",
              size: "600-850 SqFt",
              price: "From £245,100",
              features: "En-suite bedroom, walk-in closet, laundry area"
            },
            {
              title: "2 Bedrooms",
              size: "1100-1200 SqFt",
              price: "From £387,000",
              features: "Two suites, island kitchen, dual balconies"
            },
            {
              title: "3 Bedrooms",
              size: "1700-1800 SqFt",
              price: "From £570,000",
              features: "Master suite, maid's room, 25m² terrace"
            }
          ]
        },
        // FEATURES_3: Azure Bay Views
        playaViva: {
          title: "Azure Bay Residences",
          tagline: "Four perspectives of beachfront living",
          tabs: [
            {
              label: "Coastal Community",
              image: "/assets/imagenes/view1.webp",
              description: "Exclusive beachfront community"
            },
            {
              label: "Inspired Design",
              image: "/assets/imagenes/view2.jpg",
              description: "Architecture capturing luxury coastal essence"
            },
            {
              label: "Effortless Luxury",
              image: "/assets/imagenes/view3.webp",
              description: "Effortless luxury in every detail"
            },
            {
              label: "Beach Access",
              image: "/assets/imagenes/beach.webp",
              description: "Direct access to white sandy beaches"
            }
          ]
        },
        // FEATURES_4: Amenities Carousel
        amenities: {
          title: "Amenities",
          tagline: "Spaces designed for wellbeing",
          items: [
            {
              title: "Outdoor Cinema",
              image: "/assets/imagenes/cinema.webp",
              description: "Open-air cinema with screenings under the stars"
            },
            {
              title: "Spa & Wellness",
              image: "/assets/imagenes/foto galeria 7.jpg",
              description: "Wellness center with luxury treatments"
            },
            {
              title: "Fitness Center",
              image: "/assets/imagenes/foto galeria 4.jpg",
              description: "Gym equipped with state-of-the-art technology"
            },
            {
              title: "Outdoor Swimming Pools",
              image: "/assets/imagenes/Piscina_mejorada.png",
              description: "Infinity pools with Arabian Sea views"
            },
            {
              title: "Retail & Dining",
              image: "/assets/imagenes/retail.webp",
              description: "World-class dining and retail"
            }
          ]
        }
      },
      gallery: {
        title: "The Project",
        subtitle: "Exceptional architectural design in premium coastal community",
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
              "Perfect for corporate leasing or a pied-à-terre in premium coastal community",
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
              "180° views across the sea and regional skyline",
            ],
            parking: "2 parking spaces included",
          },
        },
      },
      trust: {
        title: "Backed by Real Estate Leaders",
        subtitle: "Uniestate and trusted partners",
        description:
          "Uniestate Properties is a trusted, established developer in the United Arab Emirates dating back to 1995. Uniestate UK is the agency chosen by Uniestate to market Azure Bay thanks to its extensive pedigree within the luxury real estate sector.",
        partners: "Featured in regional media",
        readMore: "Read full article",
        articles: [
          {
            date: "November 10, 2025",
            image: "/assets/imagenes/news_1.png",
            alt: "Hotel Management Network - World-Class Resort",
            source: "Hotel Management Network",
            title: "World-class resort reveals plans for premium coastal region",
            summary:
              "World-class resort announces plans for premium coastal community, reinforcing the region's positioning as a premium UAE destination.",
            url: "https://www.hotelmanagement-network.com/news/wynn-resorts-marjan-second-resort/",
          },
          {
            date: "November 7, 2025",
            image: "/assets/imagenes/news_2.webp",
            alt: "The National - Escape to Dubai",
            source: "The National",
            title: "Escape to Dubai from high-tax Britain more tempting as 75% fear higher rates",
            summary:
              "Reports record migration of wealthy individuals to UAE, with the emirates experiencing 'a net inflow of 9,800 millionaires from around the world in the past year.'",
            url: "https://www.thenationalnews.com/news/uae/2025/11/07/flight-to-dubai-from-high-tax-britain-more-temping-as-75-fear-new-levies/",
          },
          {
            date: "July 3, 2025",
            image: "/assets/imagenes/news_3.png",
            alt: "Gulf News - World-Class Resort",
            source: "Gulf News",
            title: "Premium coastal region sees new world-class resort",
            summary:
              "Features 'first resort of its kind – the $5.1 billion world-class resort' launching in early 2027 with 'ultra-luxury offering, Enclave.'",
            url: "https://gulfnews.com/business/tourism/uaes-first-gaming-resort-ras-al-khaimah-sees-new-luxury-hotel-at-wynn-al-marjan-1.500185592",
          },
          {
            date: "April 30, 2025",
            image: "/assets/imagenes/news_4.png",
            alt: "The National - World-Class Resort",
            source: "The National",
            title: "World-class resort set to 'open up regional economy'",
            summary:
              "Explores the groundbreaking world-class resort's influence on regional economic development and tourism growth.",
            url: "https://www.thenationalnews.com/business/economy/2025/04/30/uaes-first-casino-resort-set-to-open-up-ras-al-khaimah-to-the-world/",
          },
          {
            date: "March 18, 2025",
            image: "/assets/imagenes/news_5.png",
            alt: "Arabian Business - Property prices",
            source: "Arabian Business",
            title: "Property prices rise 20% amid supply-demand gap",
            summary:
              "Beachfront properties near the world-class resort in the coastal region are in hottest demand, with studios and one-bedroom units leading the surge.",
            url: "https://www.arabianbusiness.com/industries/real-estate/ras-al-khaimah-real-estate-property-prices-sise-20-amid-growing-supply-demand-gap",
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
            price: "From £320,000",
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
            price: "From £435,000",
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
          }
        ]
      },
      investment: {
        title: "Investment Opportunity",
        subtitle: "Real yields driven by the Resort Effect",
        description:
          "Azure Bay Residences represents a unique investment opportunity in premium coastal community, the epicenter of the regional real estate transformation. With a flexible 1% monthly financing plan and Q2 2026 delivery, position yourself before the resort opening.",
        stats: [
          {
            icon: TrendingUp,
            value: "7-8%",
            label: "Gross rental yields",
            description: "Current yields in premium coastal community",
          },
          {
            icon: TrendingUp,
            value: "+50%",
            label: "Rental increase",
            description: "Between Q1 2023 and Q1 2025",
          },
          {
            icon: Award,
            value: "Q2 2026",
            label: "Project delivery",
            description: "12 months before resort opens",
          },
          {
            icon: DollarSign,
            value: "1%",
            label: "Monthly payment for 5 years",
            description: "Flexible financing plan",
          },
        ],
        benefits: [
          "Operating profit margins close to 8%",
          "Proximity to World-Class Resort ($5.1B)",
          "Fully furnished and with Smart Home",
          "Potential for appreciation after opening of world-class resort",
        ],
      },
      leadForm: {
        title: "Exclusive Investment Dossier",
        subtitle: "Complete financial analysis and Resort Effect projections",
        badge: "Exclusive Investment Dossier",
        intro: "Comprehensive financial analysis and Resort Effect projections",
        description:
          "Access the most complete investment analysis with profitability projections, architectural plans, specification sheets, and the financial impact of the emblematic world-class resort on the premium coastal community. Join an exclusive community that anticipates opportunities ahead of the market.",
        features: [
          "2026-2032 return scenarios and exit strategies",
          "Cash-flow simulation with the 1% monthly plan",
          "Masterplan, unit typologies, and delivered specs",
          "Milestone calendar, permits, and after-sales support",
        ],
        form: {
          firstNamePlaceholder: "First name",
          lastNamePlaceholder: "Last name",
          emailPlaceholder: "Email",
          ctaButton: "Download Exclusive Dossier",
          sending: "Preparing your dossier...",
          privacy:
            "We only use your details to personalize the dossier and trigger the described automation.",
          successMessage:
            "Thank you, {{name}}. Your personalized dossier is on its way to your inbox.",
          errorMessage:
            "We couldn't finalize the send. Please try again or contact our team.",
        },
      },
      location: {
        title: "Premium Coastal Community",
        subtitle: "The future of luxury living in the UAE",
        description:
          "Located on the coast of the region, this premium coastal community is a new architectural jewel that redefines the concept of luxury living. This unparalleled community combines natural beauty with modern sophistication.",
        stats: [
          {
            number: "4",
            label: "Islas Únicas",
            labelEn: "Unique Islands"
          },
          {
            number: "7.8",
            label: "Kilómetros de Playas Vírgenes",
            labelEn: "Kilometers of Pristine Beaches"
          },
          {
            number: "2.7",
            label: "Millones SqM de Tierra Recuperada",
            labelEn: "Million SqM of Reclaimed Land"
          },
          {
            number: "3",
            label: "Hoteles de Clase Mundial Totalmente Operativos",
            labelEn: "Fully Operational World-Class Hotels"
          }
        ]
      },
      faq: {
        eyebrow: "Strategic Questions",
        title: "Frequently Asked Questions",
        subtitle:
          "Detailed answers based on conversations with international investors",
        highlights: [
          "Information validated alongside marketing, legal, and sales",
          "Data updated quarterly according to commercial progress",
          "Available in Spanish and English upon request",
        ],
        cta: "Speak with a specialist",
        questions: [
          {
            question: "What is Azure Bay Residences?",
            answer:
              "Azure Bay Residences is a luxury residential development on premium coastal community. Three elegant towers offer fully furnished studios plus 1, 2, and 3-bedroom apartments tailored to contemporary beachfront living.",
          },
          {
            question: "What types of apartments are available?",
            answer:
              "Studios plus 1, 2, and 3-bedroom apartments ranging from 300 to 1,800 sq. ft. with starting prices from £150,000. Every residence features open layouts, panoramic sea views, private balconies, and integrated smart-home systems.",
          },
          {
            question: "What amenities does Azure Bay Residences offer?",
            answer:
              "A state-of-the-art fitness center, luxury spa, indoor and outdoor pools, rooftop cinema, children's play areas, private beach access, jogging and cycling tracks, tennis courts, ground-floor retail, and 24/7 concierge and security.",
          },
          {
            question: "When will Azure Bay Residences be completed?",
            answer:
              "Completion and handover are scheduled for Q3 2026. All apartments will be delivered fully furnished and ready for immediate occupancy or rental.",
          },
          {
            question: "Is Azure Bay Residences a good investment opportunity?",
            answer:
              "Yes. Its prime location beside the upcoming world-class resort, resort-grade amenities, and the rapid growth of the premium coastal community support 7-8% rental yields and compelling capital appreciation.",
          },
          {
            question: "Who is the developer of Azure Bay Residences?",
            answer:
              "Uniestate Properties develops Azure Bay Residences. Established in 1995, the developer has 30 years of experience, more than 3,000 delivered units across 3.5 million sq. ft., and over 50,000 satisfied clients.",
          },
          {
            question: "What are the payment terms?",
            answer:
              "A flexible structure with 20% down payment, 20% during construction, 1% at handover, and the remaining 59% through convenient 1% monthly payments over five years via Uniestate's in-house financing.",
          },
          {
            question: "Where is Azure Bay Residences located?",
            answer:
              "In premium coastal community, with direct access to main highways and proximity to major urban centers, perfectly positioned for luxury coastal living.",
          },
          {
            question: "What are the service fees at Azure Bay Residences?",
            answer: "Service fees are charged at AED 18 per square foot.",
          },
        ],
      },
    },
  };

  const t = content[language];
  const priceString = language === "es" ? "162.000€" : "£154,800";
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
    studio: { en: "£154,800", es: "162.000€" },
    oneBed: { en: "£245,100", es: "275.000€" },
    twoBed: { en: "£387,000", es: "467.000€" },
    threeBed: { en: "£570,000", es: "689.000€" },
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
        ? "Residencias frente al mar en comunidad costera premium con entrega llave en mano y plan 1% mensual."
        : "Seafront residences in premium coastal community with turnkey delivery and a 1% monthly plan.",
    url: SITE_URL,
    image: `${SITE_URL}/assets/imagenes/hero-image.webp`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Premium Coastal Community",
      addressCountry: "AE",
    },
    offers: [
      {
        "@type": "AggregateOffer",
        priceCurrency: "GBP",
        lowPrice: "154800",
        highPrice: "570000",
        offerCount: 4,
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "AggregateOffer",
        priceCurrency: "EUR",
        lowPrice: "162000",
        highPrice: "689000",
        offerCount: 4,
        availability: "https://schema.org/InStock",
      },
    ],
    seller: {
      "@type": "Organization",
      name: "Uniestate",
      url: "https://www.uniestate.co.uk",
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
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  };

  const showBackToHero = scrollProgress >= 1;

const orchestrateLeadAutomation = async (
  payload: LeadAutomationPayload,
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
        <link rel="preconnect" href="https://js-eu1.hs-scripts.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://js-eu1.hscollectedforms.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://js-eu1.hs-analytics.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://track-eu1.hubspot.com" crossOrigin="anonymous" />
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
              <ChevronUp className="w-6 h-6 text-gold-warm group-hover:text-white transition-colors duration-300" strokeWidth={3} />
            </button>
          )}

          {/* Scroll Down Button - Show in top and middle sections */}
          {(scrollPosition === "top" || scrollPosition === "middle") && (
            <button
              onClick={scrollToBottom}
              aria-label={language === "es" ? "Ir al final" : "Go to bottom"}
              className="group w-12 h-12 rounded-full bg-linear-to-br from-brown-dark via-taupe-medium to-brown-dark border-2 border-gold-warm/30 hover:border-gold-warm/60 shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_32px_rgba(162,144,96,0.4)] transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
            >
              <ChevronDown className="w-6 h-6 text-gold-warm group-hover:text-white transition-colors duration-300" strokeWidth={3} />
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
          <span className={language === "es" ? "font-bold" : "opacity-60"}>ES</span>
          <span className="mx-2 text-brown-dark/40">|</span>
          <span className={language === "en" ? "font-bold" : "opacity-60"}>EN</span>
        </Button>
      </div>

      {/* Sticky Navigation Menu - Uniestate UK Style */}
      <nav
        className={`landing-nav fixed top-0 left-0 right-0 z-50 bg-cream-light/98 backdrop-blur-md border-b border-brown-dark/10 shadow-sm transition-transform duration-300 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="landing-nav__inner container mx-auto px-4 md:px-6">
          <div className="landing-nav__bar flex items-center justify-between h-14 md:h-16">
            {/* Logo Uniestate */}
            <div className="shrink-0">
              <button
                onClick={() => scrollToSection("uniestate")}
                aria-label={language === "es" ? "Ir a Uniestate" : "Go to Uniestate"}
                className="group relative text-brown-dark text-base md:text-lg font-bold tracking-tight transition-all duration-300 hover:text-gold-warm py-2 px-3 rounded-lg"
                style={{
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  letterSpacing: "0.02em",
                }}
              >
                <span className="relative">
                  UNIESTATE
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

      {/* ... REST OF COMPONENT CODE REMAINS THE SAME ... */}
    </div>
  );
}