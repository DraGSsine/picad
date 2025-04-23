import React from "react";
import { Button } from "../ui/button";
import { SparklesIcon } from "lucide-react";
import Link from "next/link";

const CTA = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="relative max-w-5xl mx-auto">
          {/* Main CTA card with styling matching hero */}
          <div className="relative bg-white/90 backdrop-blur-lg rounded-[2rem] p-12 md:p-16 shadow-xl border border-secondary/30 overflow-hidden">
            {/* Decorative corner accents matching design patterns from other components */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-secondary/20 to-primary/10 rounded-br-[6rem] -z-0"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-accent/20 to-secondary/10 rounded-tl-[6rem] -z-0"></div>
            
            {/* Section header with styling matching hero and other components */}
            <div className="text-center mb-10 max-w-3xl mx-auto relative z-10">
              <div className="inline-flex items-center px-5 py-2 bg-white/80 text-foreground font-semibold text-sm rounded-full mb-6 animate-fade-in shadow-sm border border-secondary/30">
                <SparklesIcon className="mr-2 h-4 w-4 text-primary" />
                <span>Transform Your Advertising</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground animate-fade-in tracking-tight">
                Ready to Create <span className="relative">
                  <span className="relative z-10 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    Stunning Ads?
                  </span>
                  <span className="absolute bottom-1 left-0 w-full h-5 bg-gradient-to-r from-accent/60 to-accent/30 -z-0 rounded-sm transform -rotate-1"></span>
                </span>
              </h2>
              
              <p className="text-lg md:text-xl text-foreground/90 max-w-2xl mx-auto leading-relaxed animate-fade-in">
                Transform your product photos into high-converting advertisements in minutes with our AI-powered platform.
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mt-10">
              {/* Primary CTA button with styling matching hero */}
              <Link href="/auth/signup" className="w-full md:w-auto">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground hover:from-primary/90 hover:to-primary/80 font-semibold px-10 py-7 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border border-primary/10 w-full"
                >
                  <SparklesIcon className="mr-2 h-5 w-5" />
                  Start Creating Now
                </Button>
              </Link>
            </div>
            
            {/* Free trial note matching hero styling */}
            <div className="mt-8 text-center text-foreground/90">
              <p className="text-sm">No credit card required. Start with a 7-day free trial.</p>
              
              {/* Feature highlights with styling matching hero and how it works section */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <SparklesIcon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">AI-Powered Creation</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
                      <path d="M12 2v4"></path><path d="M12 18v4"></path><path d="M4.93 4.93l2.83 2.83"></path>
                      <path d="M16.24 16.24l2.83 2.83"></path><path d="M2 12h4"></path><path d="M18 12h4"></path>
                      <path d="M4.93 19.07l2.83-2.83"></path><path d="M16.24 7.76l2.83-2.83"></path>
                    </svg>
                  </div>
                  <span className="text-sm font-medium">In Minutes, Not Hours</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                      <path d="M20 7h-9"></path><path d="M14 17H5"></path><circle cx="17" cy="17" r="3"></circle>
                      <circle cx="7" cy="7" r="3"></circle>
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Simple & Intuitive</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
