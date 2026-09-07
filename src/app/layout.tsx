import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    template: "%s | Resin Art by Tanvi",
    default: "Resin Art by Tanvi",
  },
  description:
    "Discover handcrafted resin art and immersive workshops in Calgary, AB. Shop resin trays, coasters, paintings, or book a workshop today.",
  openGraph: {
    type: "website",
    siteName: "Resin Art by Tanvi",
    images: [
      {
        url: "/images/art/art-1.jpg",
        width: 1200,
        height: 630,
        alt: "Handcrafted resin art by Tanvi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/art/art-1.jpg"],
  },
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorantGaramond.variable} antialiased`}>
      <body className="min-h-screen flex flex-col font-cormorant-garamond tracking-wide">
        <NuqsAdapter>{children}</NuqsAdapter>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
