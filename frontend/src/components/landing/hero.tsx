"use client";

import { ArrowRight01Icon, SparklesIcon, CrownIcon } from "hugeicons-react";
import { Button } from "../ui/button";
import AdPreview from "./adPreview";
import FloatingShapes from "./FloatingShapes";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="relative h-[1050px] overflow-hidden bg-gradient-to-b from-background via-white to-muted/30 flex flex-col justify-center">
      {/* Soft background with improved gradient elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-white to-accent/20 z-0"></div>

      {/* Enhanced decorative elements with new color palette */}
      <div className="absolute top-[5%] right-[5%] w-[45rem] h-[45rem] bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-3xl opacity-70 -z-10"></div>
      <div className="absolute bottom-[10%] left-[5%] w-[35rem] h-[35rem] bg-gradient-to-tl from-accent/20 to-secondary/20 rounded-full blur-3xl opacity-60 -z-10"></div>

      {/* Soft accent lines */}
      <div className="absolute top-[15%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-secondary/40 to-transparent"></div>
      <div className="absolute bottom-[15%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-secondary/40 to-transparent"></div>

      <FloatingShapes />

      <div className="relative container mx-auto px-6 py-20 flex flex-col lg:flex-row items-center justify-between z-10">
        <div className="w-full lg:w-[60%] text-center lg:text-left z-10">
          {/* Elegant subtitle with refined styling */}
          <div
            className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-secondary/50 to-accent/50 text-foreground font-semibold text-sm rounded-full mb-6 animate-fade-in shadow-sm border border-secondary/30"
            style={{ animationDelay: "0.05s" }}
          >
            <CrownIcon className="mr-2 h-4 w-4 text-primary" />
            <span>Elegant Ad Creation</span>
          </div>

          {/* Elegant headline with enhanced styling */}
          <h1
            className="mb-8 text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-foreground animate-fade-in tracking-tight"
            style={{ animationDelay: "0.1s" }}
          >
            Craft Refined Ads In{" "}
            <span className="relative">
              <span className="relative z-10 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Moments
              </span>
              <span className="absolute bottom-1 left-0 w-full h-5 bg-gradient-to-r from-accent/60 to-accent/30 -z-0 rounded-sm transform -rotate-1"></span>
            </span>
          </h1>

          {/* Enhanced paragraph with improved typography */}
          <p
            className="text-lg md:text-xl lg:w-[90%] xl:w-[75%] text-foreground/90 mb-10 animate-fade-in leading-relaxed"
            style={{ animationDelay: "0.2s" }}
          >
            Experience Picad's elegant AI technology to transform ordinary
            product photos into stunning advertising masterpieces. Effortlessly
            add refined text, remove imperfections, or generate creative elements
            with our sophisticated brush tool.
          </p>

          {/* Feature highlights with improved styling */}
          <div
            className="mb-12 lg:w-[85%] animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 text-left">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-secondary/60 to-accent/40 flex items-center justify-center shadow-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-primary/80"></div>
                </div>
                <span className="text-foreground/90 font-medium">
                  Elegant designs, no skills needed
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-secondary/60 to-accent/40 flex items-center justify-center shadow-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-primary/80"></div>
                </div>
                <span className="text-foreground/90 font-medium">
                  Ready in moments
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-secondary/60 to-accent/40 flex items-center justify-center shadow-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-primary/80"></div>
                </div>
                <span className="text-foreground/90 font-medium">
                  100+ refined templates
                </span>
              </div>
            </div>
          </div>

          <div
            className="mt-8 flex flex-wrap justify-center lg:justify-start gap-5 animate-fade-in"
            style={{ animationDelay: "0.5s" }}
          >
            {/* Primary button with enhanced gradients */}
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground hover:from-primary/90 hover:to-primary/80 font-semibold px-10 py-7 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border border-primary/10"
            >
              <SparklesIcon className="mr-2 h-5 w-5" />
              Begin Your Creation
            </Button>

            {/* Outline button with refined styling */}
            <Button
              size="lg"
              variant="outline"
              className="bg-white/70 border-secondary/70 text-foreground hover:bg-white hover:border-secondary font-medium px-10 py-7 rounded-full backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300"
            >
              Browse Templates
            </Button>
          </div>
        </div>

        {/* Enhanced preview with elegant styling */}
        <div className="w-full lg:w-[40%] mt-14 lg:mt-0 relative">
          {/* Soft halo effect with refined gradients */}
          <div className="absolute -top-10 -left-10 w-full h-full bg-gradient-to-br from-accent/30 via-secondary/20 to-primary/10 rounded-2xl blur-xl -z-10 transform rotate-3"></div>
          <div className="absolute -bottom-5 -right-5 w-full h-full bg-gradient-to-tl from-accent/20 via-secondary/15 to-primary/10 rounded-2xl blur-xl -z-10 transform -rotate-2"></div>

          {/* Border accent and improved container */}
          <AdPreview />
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce z-10">
        {/* "See how it works" link with improved styling */}
        <Link
          href="#how-it-works"
          className="group flex items-center text-foreground hover:text-primary gap-2 bg-gradient-to-r from-white/90 to-muted/80 backdrop-blur-md px-6 py-3 rounded-full text-sm font-medium border border-secondary/40 hover:border-primary/30 shadow-md hover:shadow-lg transform transition-all duration-300"
        >
          <span>Discover the experience</span>
          <ArrowRight01Icon
            size={18}
            className="group-hover:translate-x-1 transition-transform text-primary"
          />
        </Link>
      </div>

      {/* Enhanced bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-muted/50 to-transparent z-0"></div>
    </div>
  );
};

export default Hero;
