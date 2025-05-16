import React from "react";
import { 
  Image01Icon, 
  PaintBoardIcon, 
  SentIcon, 
  CloudDownloadIcon 
} from "hugeicons-react";

const HowItWorks = () => {
  const steps = [
    {
      step: 1,
      title: "Upload Your Product Photos",
      description: "Upload up to 4 images of your product. We'll use these to create the perfect ad that highlights your product's best features.",
      icon: <Image01Icon size={32} className="text-white" />,
      accentColor: "bg-primary/10", 
      iconBg: "bg-primary",
      delay: 0.2,
      features: [
        { text: "Up to 4 photos per product", icon: <Image01Icon size={18} className="text-primary" /> },
        { text: "High-resolution support", icon: <Image01Icon size={18} className="text-primary" /> }
      ]
    },
    {
      step: 2,
      title: "Choose Ad Template",
      description: "Select from our collection of 100+ professional ad templates or upload your own design that you want to replicate.",
      icon: <PaintBoardIcon size={32} className="text-white" />,
      accentColor: "bg-secondary/20",
      iconBg: "bg-secondary",
      delay: 0.4,
      features: [
        { text: "Browse 100+ premium templates", icon: <PaintBoardIcon size={18} className="text-primary" /> },
        { text: "Upload your own reference ads", icon: <PaintBoardIcon size={18} className="text-primary" /> }
      ]
    },
    {
      step: 3,
      title: "Add Details & Generate",
      description: "Enter additional information to make your ad more accurate, then click generate to see your product transformed into a stunning ad.",
      icon: <SentIcon size={32} className="text-white" />,
      accentColor: "bg-secondary-foreground/20",
      iconBg: "bg-secondary-foreground",
      delay: 0.6,
      features: [
        { text: "Fine-tune with custom instructions", icon: <SentIcon size={18} className="text-primary" /> },
        { text: "One-click generation", icon: <SentIcon size={18} className="text-primary" /> }
      ]
    },
    {
      step: 4,
      title: "Edit & Download",
      description: "Perfect your ad with text additions, selective brushing to fix details, or enhance specific areas. Every edit is saved in your history.",
      icon: <CloudDownloadIcon size={32} className="text-white" />,
      accentColor: "bg-primary/15",
      iconBg: "bg-primary",
      delay: 0.8,
      features: [
        { text: "Download in PNG, JPG, or WEBP", icon: <CloudDownloadIcon size={18} className="text-primary" /> },
        { text: "Full edit history for each image", icon: <CloudDownloadIcon size={18} className="text-primary" /> }
      ]
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 md:py-24 lg:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section header with styling matching hero */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center px-4 sm:px-5 py-2 bg-white/80 text-foreground font-semibold text-sm rounded-full mb-4 sm:mb-6 animate-fade-in shadow-sm border border-secondary/30">
            <PaintBoardIcon className="mr-2 h-4 w-4 text-primary" />
            <span>Simple Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-foreground animate-fade-in tracking-tight">
            Create Amazing Ads in <span className="relative">
              <span className="relative z-10 text-primary">
                4 Simple Steps
              </span>
              <span className="absolute bottom-1 left-0 w-full h-4 sm:h-5 bg-accent/30 -z-0 rounded-sm"></span>
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-foreground/90 max-w-2xl mx-auto leading-relaxed animate-fade-in px-2">
            Transform your product photos into professional ads with our intuitive tool. Upload, customize, and download — it&apos;s that simple.
          </p>
        </div>
        
        <div className="space-y-16 sm:space-y-20 md:space-y-24 lg:space-y-28">
          {steps.map((step, index) => (
            <div
              key={step.step}
              className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Text content with styling matching hero */}
              <div className={`${index % 2 === 1 ? "md:order-2" : ""} animate-fade-in`} style={{ animationDelay: `${step.delay}s` }}>
                <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                  <div className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl ${step.iconBg} shadow-md`}>
                    {step.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-primary opacity-80">0{step.step}</div>
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-foreground">{step.title}</h3>
                <p className="text-base sm:text-lg text-foreground/90 mb-4 sm:mb-6 leading-relaxed">{step.description}</p>
                
                {/* Bullet points with modern styling */}
                <ul className="space-y-3 sm:space-y-4">
                  {step.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-foreground">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-secondary/40 flex items-center justify-center shadow-sm mr-2 sm:mr-3">
                        {feature.icon}
                      </div>
                      <span className="text-sm sm:text-base text-foreground/90">{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Image/Screen Mockup with modern glass effect */}
              <div className={`${index % 2 === 1 ? "md:order-1" : ""} relative animate-fade-in`} style={{ animationDelay: `${step.delay + 0.2}s` }}>
                <div className="relative rounded-xl overflow-hidden shadow-lg border border-secondary/30 bg-white/80 backdrop-blur-sm p-2">
                  {/* Card with improved contrast */}
                  <div className="aspect-[4/3] sm:aspect-video w-full relative rounded-lg overflow-hidden bg-white/90 backdrop-blur-lg">
                    <div className="w-full h-full flex items-center justify-center p-4 sm:p-6">
                      {/* Modern step visualization with better contrast */}
                      <div className="text-center max-w-xs mx-auto">
                        <div className={`mx-auto mb-4 sm:mb-6 w-16 sm:w-20 h-16 sm:h-20 rounded-full ${step.iconBg} flex items-center justify-center`}>
                          {step.icon}
                        </div>
                        <h4 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-primary">Step {step.step}</h4>
                        <p className="text-sm sm:text-base text-foreground/70">
                          {step.title}
                        </p>
                        
                        {/* Progress indicator */}
                        <div className="mt-4 sm:mt-6 flex justify-center space-x-2">
                          {[1, 2, 3, 4].map((num) => (
                            <div 
                              key={num} 
                              className={`h-1.5 sm:h-2 rounded-full ${num === step.step ? 'w-6 sm:w-8 bg-primary' : 'w-2 bg-gray-200'} 
                              transition-all duration-300`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Simplified decorative elements without gradients */}
                <div className="absolute -z-10 -bottom-4 -right-4 w-28 sm:w-32 h-28 sm:h-32 rounded-full bg-accent/20 blur-xl"></div>
                <div className="absolute -z-10 -top-4 -left-4 w-20 sm:w-24 h-20 sm:h-24 rounded-full bg-primary/10 blur-xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
