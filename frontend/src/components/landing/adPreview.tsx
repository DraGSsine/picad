"use client";
import { useState, useEffect } from "react";
import { AspectRatio } from "../ui/aspect-ratio";
import { CursorMagicSelection01Icon, SparklesIcon, Download01Icon } from "hugeicons-react";
import Image from "next/image";

const AdPreview = () => {
  const [currentPreview, setCurrentPreview] = useState(0);
  const previewCount = 3;
  const [isHovered, setIsHovered] = useState(false);

  // Products that correspond to each ad creative
  const products = [
    {
      name: "Premium Headphones",
      image: "/adsTemplats/42.jfif",
      category: "Electronics",
    },
    {
      name: "Luxury Watch Collection",
      image: "/adsTemplats/51.jfif",
      category: "Fashion",
    },
    {
      name: "Organic Skincare",
      image: "/adsTemplats/77.jfif",
      category: "Beauty",
    },
  ];

  // Ad creatives generated for each product
  const adCreatives = [
    {
      headline: "Experience Sound Perfection",
      subheadline: "Noise Cancellation • 40h Battery",
      cta: "Shop Now",
      bgGradient: "from-primary to-indigo-800",
      accent: "text-primary",
      accentBg: "bg-primary",
      highlight: "Premium Quality",
    },
    {
      headline: "Timeless Elegance",
      subheadline: "Limited Edition • Swiss Made",
      cta: "View Collection",
      bgGradient: "from-blue-800 to-cyan-600",
      accent: "text-blue-700",
      accentBg: "bg-blue-100",
      highlight: "Luxury Design",
    },
    {
      headline: "Natural Beauty",
      subheadline: "100% Organic • Cruelty Free",
      cta: "Discover More",
      bgGradient: "from-emerald-600 to-teal-500",
      accent: "text-emerald-700",
      accentBg: "bg-emerald-100",
      highlight: "Eco-Friendly",
    },
  ];

  // Auto-rotate previews
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPreview((prev) => (prev + 1) % previewCount);
    }, 6000);
    return () => clearInterval(interval);
  }, [previewCount]);

  return (
    <div 
      className="relative mx-auto py-6 h-[600px] w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background decorations */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-primary/20 rounded-full blur-3xl z-0 animate-pulse-slow"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-amber-300/20 to-rose-300/20 rounded-full blur-3xl z-0 animate-pulse-slow"></div>
      
      {/* Main container - wider and taller */}
      <div className="relative h-full p-1 rounded-xl bg-gradient-to-br from-white/90 via-indigo-100/50 to-white/90 shadow-lg shadow-indigo-200/30">
        {/* Main content - taking up more space */}
        <div className="relative bg-white/95 backdrop-blur-sm rounded-lg border border-indigo-100/50 h-full overflow-hidden shadow-inner">
          {/* UI Header with minimal decoration */}
          <div className="flex justify-between items-center p-3 border-b border-gray-100">
            <div className="flex items-center space-x-1.5">
              <div className="h-3 w-3 rounded-full bg-rose-400"></div>
              <div className="h-3 w-3 rounded-full bg-amber-400"></div>
              <div className="h-3 w-3 rounded-full bg-emerald-400"></div>
            </div>
            <div className="flex items-center bg-indigo-50 px-3 py-1 rounded-full">
              <span className="text-xs font-medium text-indigo-700 mr-1.5">AI Ad Preview</span>
              <SparklesIcon size={12} className="text-amber-500" />
            </div>
          </div>

          {/* Main preview area - Side by side with 2:3 aspect ratio */}
          <div className="relative flex h-[calc(100%-4rem)] gap-4 p-4">
            {/* Left side - Product with 2:3 aspect ratio */}
            <div className="relative w-1/2 h-full flex items-center justify-center">
              <div className="w-full h-auto" style={{ maxHeight: "100%" }}>
                <AspectRatio ratio={2/3} className="rounded-lg shadow-md overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="animate-spin-slow">
                      <div className="h-8 w-8 rounded-full border-4 border-indigo-200 border-t-indigo-500"></div>
                    </div>
                  </div>
                  
                  {/* Product image */}
                  <Image
                    src={products[currentPreview].image}
                    alt={products[currentPreview].name}
                    fill
                    sizes="50vw"
                    className="object-cover"
                    priority
                  />

                  {/* Product label */}
                  <div className="absolute top-3 left-3 bg-white/85 px-3 py-1 rounded-full z-20">
                    <span className="text-xs font-medium text-gray-800">
                      {products[currentPreview].category}
                    </span>
                  </div>

                  {/* Product name display */}
                  <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-lg z-20">
                    <span className="text-sm font-medium text-white">
                      {products[currentPreview].name}
                    </span>
                  </div>
                </AspectRatio>
              </div>
            </div>

            {/* Right side - Generated Ad with 2:3 aspect ratio */}
            <div className="relative w-1/2 h-full flex items-center justify-center">
              <div className="w-full h-auto" style={{ maxHeight: "100%" }}>
                <AspectRatio ratio={2/3} className="rounded-lg shadow-md overflow-hidden">
                  <div
                    className={`absolute inset-0 flex flex-col justify-between bg-gradient-to-br ${adCreatives[currentPreview].bgGradient} p-6`}
                  >
                    {/* Top section */}
                    <div className="flex justify-between">
                      <div
                        className={`${adCreatives[currentPreview].accentBg} px-3 py-1 rounded-full`}
                      >
                        <span
                          className={`text-xs font-medium ${adCreatives[currentPreview].accent}`}
                        >
                          {adCreatives[currentPreview].highlight}
                        </span>
                      </div>
                      <div className="bg-white/30 backdrop-blur-sm rounded-full h-8 w-8 flex items-center justify-center">
                        <CursorMagicSelection01Icon
                          size={14}
                          className="text-white"
                        />
                      </div>
                    </div>

                    {/* Middle content */}
                    <div className="flex flex-col items-center text-center">
                      <div className="absolute top-1/3 right-4 w-2 h-2 rounded-full bg-white/80 animate-ping-slow"></div>
                      <div className="absolute bottom-1/3 left-4 w-1.5 h-1.5 rounded-full bg-white/80 animate-ping-slow" style={{ animationDelay: "1s" }}></div>

                      <h2 className="text-white text-2xl sm:text-3xl font-bold mb-2 tracking-tight">
                        {adCreatives[currentPreview].headline}
                      </h2>
                      <p className="text-white/90 text-sm sm:text-base">
                        {adCreatives[currentPreview].subheadline}
                      </p>
                    </div>

                    {/* Bottom actions */}
                    <div className="flex flex-col items-center gap-2">
                      <button className="bg-white px-6 py-2 rounded-full text-sm hover:bg-opacity-95 transition-colors">
                        <span className={`${adCreatives[currentPreview].accent} font-medium`}>
                          {adCreatives[currentPreview].cta}
                        </span>
                      </button>

                      <div className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors cursor-pointer text-xs mt-2">
                        <Download01Icon size={12} />
                        <span>Save Ad</span>
                      </div>
                    </div>

                    {/* Simple decorative lines */}
                    <div className="absolute top-1/3 left-0 w-16 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    <div className="absolute bottom-1/3 right-0 w-16 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  </div>
                </AspectRatio>
              </div>
            </div>
          </div>

          {/* Preview selector */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-full">
              {[...Array(previewCount)].map((_, i) => (
                <button
                  key={i}
                  className={`rounded-full transition-all ${
                    i === currentPreview
                      ? `bg-white shadow-sm h-2 w-8`
                      : "bg-gray-300 w-2 h-2 hover:bg-gray-400"
                  }`}
                  onClick={() => setCurrentPreview(i)}
                  aria-label={`Go to preview ${i + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdPreview;
