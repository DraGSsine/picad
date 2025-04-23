import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PicAd - Create Professional Ad Images in Seconds | AI-Powered Marketing Tool",
  description: "Transform your product photos into professional advertisements with PicAd. Choose from our extensive template library or upload your own. AI-powered, easy to use, instant results.",
  keywords: "product ad generator, AI advertising tool, marketing image creator, e-commerce ad maker, product advertisement generator, digital marketing tool, ad template library",
  openGraph: {
    title: "PicAd - Turn Products into Stunning Ad Images Instantly",
    description: "Upload your product photos, choose a template from our extensive library (or add your own), and let our AI create professional marketing images for your business.",
    images: [
      {
        url: "/showcase/ad-example-1.jpg",
        width: 1200,
        height: 630,
        alt: "PicAd Example Advertisement",
      }
    ],
  },
  twitter: {
    title: "PicAd - Professional Ad Images in Seconds",
    description: "Upload product → Select template → Get stunning ad. Boost conversions with professional marketing visuals for your products instantly.",
  },
  alternates: {
    canonical: "https://picad.pro",
  },
};