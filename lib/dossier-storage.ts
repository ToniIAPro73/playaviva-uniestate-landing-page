import * as os from "os";
import * as path from "path";

/**
 * Detecta automáticamente la ruta correcta para almacenar PDFs según el entorno
 * - Vercel/Producción: /tmp/dossiers (directorio temporal en Linux)
 * - Local/Development: C:\Users\Usuario\Documents\Dossiers_Personalizados_PlayaViva (Windows)
 */
export const getLocalDossierDir = () => {
  // Detectar si estamos en Vercel o entorno de producción
  const isVercel = Boolean(process.env.VERCEL);
  const isProduction = process.env.NODE_ENV === "production";

  // En Vercel o producción, usar directorio temporal de Linux
  if (isVercel || isProduction) {
    return "/tmp/dossiers";
  }

  // En desarrollo local (Windows), usar la carpeta de documentos del usuario
  const documentsDir = path.join(os.homedir(), "Documents");
  return path.join(documentsDir, "Dossiers_Personalizados_PlayaViva");
};

export type ResolvedS3Config = {
  endpoint?: string;
  bucket?: string;
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
};

export type S3Region = {
  endpoint: string;
  region: string;
  name: string; // Human-readable name for logging
};

export const normalizeBucketName = (value?: string | null) => {
  if (!value) return undefined;
  const trimmed = value.trim().replace(/(^\/+|\/+$)/g, "");
  if (!trimmed) return undefined;
  return trimmed
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9.-]/gi, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
};

export const splitEndpoint = (rawEndpoint?: string, bucket?: string) => {
  if (!rawEndpoint) {
    return { endpoint: undefined, bucket };
  }

  try {
    const url = new URL(rawEndpoint);

    // Path-style endpoint e.g. https://s3.example.com/my-bucket
    if (!bucket && url.pathname && url.pathname !== "/") {
      const [firstSegment] = url.pathname.replace(/^\/+/, "").split("/");
      if (firstSegment) {
        return {
          endpoint: `${url.protocol}//${url.host}`,
          bucket: firstSegment,
        };
      }
    }

    // Virtual-hosted-style endpoint e.g. https://my-bucket.s3.amazonaws.com
    if (!bucket) {
      const hostParts = url.hostname.split(".");
      if (hostParts.length > 3) {
        const [maybeBucket, ...rest] = hostParts;
        return {
          endpoint: `${url.protocol}//${rest.join(".")}${
            url.port ? `:${url.port}` : ""
          }`,
          bucket: maybeBucket,
        };
      }
    }

    return {
      endpoint: rawEndpoint,
      bucket,
    };
  } catch {
    return {
      endpoint: rawEndpoint,
      bucket,
    };
  }
};

export const resolveS3Config = (): ResolvedS3Config => {
  // ✅ FORZAR R2 SIEMPRE - IGNORAR CUALQUIER OTRA CONFIGURACIÓN
  return {
    endpoint:
      "https://8356c3c60dba9459607901d4a6f93b3a.r2.cloudflarestorage.com",
    bucket: "playa-viva-dossiers",
    region: "auto",
    accessKeyId: "57a411843155a9028467f9575faeb2d3",
    secretAccessKey:
      "d15b1bbad71eb90c89157cb7759034cd5652bfc1add1d7019937291a2541499e",
  };
};

export const isS3Enabled = (config: ResolvedS3Config): boolean => {
  // Check if essential S3 configuration is present
  // We need at least: endpoint, bucket, and both access credentials
  return Boolean(
    config.endpoint &&
      config.bucket &&
      config.accessKeyId &&
      config.secretAccessKey
  );
};

export const shouldUseS3Storage = (config?: ResolvedS3Config) => {
  // ✅ FORZAR TRUE - SIEMPRE USAR S3/R2
  return true;
};

/**
 * ✅ FORZAR R2 - IGNORAR IDRIVE COMPLETAMENTE
 */
export const getS3Regions = (): S3Region[] => {
  return [
    {
      endpoint:
        "https://8356c3c60dba9459607901d4a6f93b3a.r2.cloudflarestorage.com",
      region: "auto",
      name: "Cloudflare R2",
    },
  ];
};

/**
 * Returns available S3 regions configured for failover
 * Primary: Frankfurt (eu-west-4)
 * Fallback: Paris (eu-central-2)
 */
// Esta función está obsoleta ahora, pero la dejamos por compatibilidad
export const getS3RegionsFallback = (): S3Region[] => {
  return [
    {
      endpoint: "s3.eu-west-4.idrivee2.com",
      region: "eu-west-4",
      name: "Frankfurt",
    },
    {
      endpoint: "s3.eu-central-2.idrivee2.com",
      region: "eu-central-2",
      name: "Paris",
    },
  ];
};
