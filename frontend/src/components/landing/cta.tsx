import React from "react";
import { Button } from "../ui/button";
import { SparklesIcon } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Soft background with improved gradient elements similar to hero */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-white to-accent/20 z-0"></div>
      
      {/* Enhanced decorative elements with same color palette as hero */}
      <div className="absolute top-[5%] right-[5%] w-[45rem] h-[45rem] bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-3xl opacity-70 -z-10"></div>
      <div className="absolute bottom-[10%] left-[5%] w-[35rem] h-[35rem] bg-gradient-to-tl from-accent/20 to-secondary/20 rounded-full blur-3xl opacity-60 -z-10"></div>

      {/* Soft accent lines matching hero */}
      <div className="absolute top-[15%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-secondary/40 to-transparent"></div>
      <div className="absolute bottom-[15%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-secondary/40 to-transparent"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="relative max-w-5xl mx-auto">
          {/* Enhanced decorative elements for the card matching hero */}
          <div className="absolute -top-10 -left-10 w-full h-full bg-gradient-to-br from-accent/30 via-secondary/20 to-primary/10 rounded-2xl blur-xl -z-10 transform rotate-3"></div>
          <div className="absolute -bottom-5 -right-5 w-full h-full bg-gradient-to-tl from-accent/20 via-secondary/15 to-primary/10 rounded-2xl blur-xl -z-10 transform -rotate-2"></div>
          
          {/* Main CTA card with styling matching hero */}
          <div className="relative bg-white/90 backdrop-blur-lg rounded-[2rem] p-12 md:p-16 shadow-xl border border-secondary/30 overflow-hidden">
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-secondary/20 to-primary/10 rounded-br-[6rem] -z-0"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-accent/20 to-secondary/10 rounded-tl-[6rem] -z-0"></div>
            
            {/* Section header with styling matching hero */}
            <div className="text-center mb-10 max-w-3xl mx-auto relative z-10">
              <div className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-secondary/50 to-accent/50 text-foreground font-semibold text-sm rounded-full mb-6 animate-fade-in shadow-sm border border-secondary/30">
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
                Join thousands of businesses that are transforming their product photos into high-converting advertisements in minutes.
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mt-10">
              {/* Primary CTA button with styling matching hero */}
              <Button 
                size="lg"
                className="bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground hover:from-primary/90 hover:to-primary/80 font-semibold px-10 py-7 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border border-primary/10 w-full md:w-auto"
              >
                <SparklesIcon className="mr-2 h-5 w-5" />
                Start Creating Now
              </Button>
              
              {/* Secondary button with styling matching hero */}
              <Button
                size="lg"
                variant="outline"
                className="bg-white/70 border-secondary/70 text-foreground hover:bg-white hover:border-secondary font-medium px-10 py-7 rounded-full backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 w-full md:w-auto"
              >
                View Demo
              </Button>
            </div>
            
            {/* Free trial note matching hero styling */}
            <div className="mt-8 text-center text-foreground/90">
              <p className="text-sm">No credit card required. Start with a 7-day free trial.</p>
              <div className="flex items-center justify-center mt-4 space-x-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20"></div>
                    </div>
                  ))}
                </div>
                <span className="text-sm font-medium">
                  Join 10,000+ users
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </section>
  );
};

export default CTA;
