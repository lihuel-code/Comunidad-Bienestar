import "./globals.css";

// 👉 Cuando tengas tu dominio en Vercel, cambiá esta URL.
//    De acá sale el link y la imagen que se ven al compartir en redes/WhatsApp.
const SITE_URL = "https://TU-DOMINIO.vercel.app";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "¿Querés bajar de peso? | Comunidad Bienestar",
  description:
    "Bajá de peso con acompañamiento profesional y una comunidad que te sostiene. Sin dietas imposibles. Reservá tu lugar en el próximo grupo.",
  applicationName: "Comunidad Bienestar",
  manifest: "/site.webmanifest",
  icons: {
    icon: "/assets/favicon.png",
    apple: "/assets/apple-touch-icon.png",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Comunidad Bienestar",
    url: "/",
    title: "¿Querés bajar de peso? | Comunidad Bienestar",
    description:
      "Acompañamiento profesional y una comunidad que te sostiene para lograrlo. Sin dietas imposibles.",
    images: [
      {
        url: "/assets/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Comunidad Bienestar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport = {
  themeColor: "#9B22BD",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HealthAndBeautyBusiness",
  name: "Comunidad Bienestar",
  description:
    "Programa de descenso de peso con acompañamiento profesional y comunidad.",
  url: "https://comunidadbienestar.com.ar/",
  telephone: "+5491153230047",
  email: "comunidadbienestarcobranzas@gmail.com",
  image: "/assets/og-image.jpg",
  areaServed: "AR",
  sameAs: [
    "https://www.facebook.com/bienestarcomunidadok/",
    "https://www.instagram.com/bienestarcomunidadok/",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="es-AR">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
