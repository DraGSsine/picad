"use client";

import { ArrowRight01Icon, CrownIcon, ArrowRight02Icon } from "hugeicons-react";
import FloatingShapes from "./FloatingShapes";
import Link from "next/link";
import { ProductShowcase } from "./ProductShowcase";

const Hero = () => {
  return (
    <div className="relative min-h-[650px] md:h-[850px] lg:h-[950px] overflow-hidden flex flex-col justify-center py-20 md:py-24">
      {/* Add enhanced floating shapes only to hero section */}
      <FloatingShapes />

      <div className="relative container mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 z-10">
        <div className="w-full lg:w-1/2 text-center lg:text-left z-10">
          {/* Elegant subtitle with refined styling */}
          <div
            className="inline-flex items-center px-4 sm:px-5 py-2 bg-white/50 text-foreground font-semibold text-sm rounded-full mb-4 sm:mb-6 animate-fade-in shadow-sm border border-secondary/30"
            style={{ animationDelay: "0.05s" }}
          >
            <CrownIcon className="mr-2 h-4 w-4 text-primary" />
            <span>Photo Magic</span>
          </div>

          {/* Catchy headline with enhanced styling */}
          <h1
            className="mb-6 sm:mb-8 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-foreground animate-fade-in tracking-tight"
            style={{ animationDelay: "0.1s" }}
          >
            Stunning Ads <br />
            <span className="relative">
              <span className="relative z-10 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Made Simple
              </span>
            </span>
          </h1>

          {/* More natural, conversational paragraph */}
          <p
            className="text-base sm:text-lg md:text-xl lg:w-[90%] text-foreground/90 mb-8 animate-fade-in leading-relaxed"
            style={{ animationDelay: "0.2s" }}
          >
            Your products deserve to shine. With Picad, transform everyday photos into eye-catching ads that sell. No design skills? No problem. Just upload, customize, and watch your products come to life in beautiful advertisements your customers won&apos;t resist.
          </p>

          {/* Simplified feature highlights */}
          <div className="mb-6 sm:mb-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4">
              {["No design skills needed", "Ready in seconds", "Beautiful templates"].map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-foreground/80">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cleaner button layout */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in justify-center lg:justify-start" style={{ animationDelay: "0.4s" }}>
            <Link
              href="#how-it-works"
              className="bg-white/50 text-foreground px-6 sm:px-8 py-3 rounded-full font-medium border border-secondary/30 hover:bg-white transition-all w-full sm:w-auto text-center"
            >
              Learn More
            </Link>
            <Link
              href="/auth/signin"
              className="bg-primary items-center flex justify-center sm:justify-between text-primary-foreground px-6 sm:px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all w-full sm:w-auto"
            >
              Get Started
              <ArrowRight02Icon className="ml-2 h-5 sm:h-6 w-5 sm:w-6" />
            </Link>
          </div>
        </div>

        {/* Enhanced preview with elegant styling */}
        <div className="w-full lg:w-1/2 mt-10 md:mt-14 lg:mt-0 flex justify-center relative">
          {/* Soft halo effect with refined gradients */}
          <div className="absolute -top-10 -left-10 w-full h-full bg-gradient-to-br from-accent/30 via-secondary/20 to-primary/10 rounded-2xl blur-xl -z-10 transform rotate-3"></div>
          <div className="absolute -bottom-5 -right-5 w-full h-full bg-gradient-to-tl from-accent/20 via-secondary/15 to-primary/10 rounded-2xl blur-xl -z-10 transform -rotate-2"></div>

          <ProductShowcase />
        </div>
      </div>

      <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 flex justify-center animate-bounce z-10">
        {/* "See how it works " link with improved styling */}
        <Link
          href="#how-it-works"
          className="group flex items-center text-foreground hover:text-primary gap-2 bg-gradient-to-r from-white/90 to-muted/80 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium border border-secondary/40 hover:border-primary/30 shadow-md hover:shadow-lg transform transition-all duration-300"
        >
          <span>Discover the experience</span>
          <ArrowRight01Icon
            size={16}
            className="group-hover:translate-x-1 transition-transform text-primary"
          />
        </Link>
      </div>
    </div>
  );
};

export default Hero;
