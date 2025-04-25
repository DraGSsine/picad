import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PicAd | Transform Products into Stunning Ads",
  description: "Upload your products, select from our ad templates or use your own, and let PicAd AI generate professional marketing images instantly. Save time and boost conversions with stunning product advertisements.",
  keywords: "ad image generator, product ad creator, AI marketing images, advertisement templates, product marketing tool, digital ad maker, e-commerce ad generator",
  authors: [{ name: "PicAd Team" }],
  creator: "PicAd",
  publisher: "PicAd",
  openGraph: {
    title: "PicAd - Transform Your Products Into Eye-Catching Advertisements",
    description: "Generate professional ad images in seconds. Upload your product, choose a template, and create stunning marketing visuals with our AI-powered platform.",
    url: "https://picad.space",
    siteName: "PicAd",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "PicAd - AI Ad Image Generator",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PicAd - AI-Powered Ad Image Generator",
    description: "Create professional ad images instantly. Upload your product, select a template, get stunning marketing visuals.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://picad.space",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}