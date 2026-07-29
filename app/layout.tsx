import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

const preloadRecovery = `
(() => {
  const retryKey = "trifecta-preload-retry";
  const failedCache = "trifecta-core-v3";

  window.addEventListener("trifecta:ready", () => {
    try { sessionStorage.removeItem(retryKey); } catch {}
  });

  window.addEventListener("vite:preloadError", (event) => {
    event.preventDefault();

    let shouldRetry = true;
    try {
      shouldRetry = sessionStorage.getItem(retryKey) !== location.href;
      sessionStorage.setItem(retryKey, location.href);
    } catch {}

    if (!shouldRetry) return;

    const clearStaleCache = "caches" in window
      ? caches.delete(failedCache).catch(() => false)
      : Promise.resolve(false);

    clearStaleCache.finally(() => location.reload());
  });
})();
`;

const baseMetadata: Metadata = {
  title: {
    default: "Trifecta Performance Lab",
    template: "%s · Trifecta Performance Lab",
  },
  description:
    "Arabic-first bilingual trainer platform for Learning Domains, the Trifecta, evidence-based assessment, and AAR.",
  applicationName: "Trifecta Performance Lab",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "64x64" }],
    shortcut: "/favicon.ico",
  },
  other: {
    "content-language": "ar, en",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  return {
    ...baseMetadata,
    metadataBase: new URL(origin),
    openGraph: {
      title: "Trifecta Performance Lab",
      description: "Learning Domains build the learning. The Trifecta diagnoses actual performance.",
      url: origin,
      type: "website",
      images: [{ url: `${origin}/og.png`, width: 1731, height: 909, alt: "Trifecta Performance Lab — Read the whole performance." }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Trifecta Performance Lab",
      description: "Learning Domains build the learning. The Trifecta diagnoses actual performance.",
      images: [`${origin}/og.png`],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#0d0e0e",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <script dangerouslySetInnerHTML={{ __html: preloadRecovery }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
