import React from "react";
import Image from "next/image";
import { SparklesIcon } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      step: 1,
      title: "Upload Your Product Image",
      description: "Simply upload your product photo. Our AI analyzes your product to understand its key features and prepare it for ad creation.",
      icon: "/images/upload-icon.svg",
      image: "/images/upload-product.webp",
      accentColor: "bg-primary/10", 
      delay: 0.2,
    },
    {
      step: 2,
      title: "Choose a Template & Settings",
      description: "Select from 100+ professional ad templates, then choose your preferred size ratio (1:1, 2:3, 3:2) and quality level.",
      icon: "/images/text-icon.svg",
      image: "/images/add-text.webp", 
      accentColor: "bg-secondary/20",
      delay: 0.4,
    },
    {
      step: 3,
      title: "Enter Description & Generate",
      description: "Describe how you want your ad to look, and our AI will instantly generate a professional ad combining your product, template, and vision.",
      icon: "/images/magic-icon.svg",
      image: "/images/ai-brush.webp",
      accentColor: "bg-accent/20",
      delay: 0.6,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        {/* Section header with styling matching hero */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center px-5 py-2 bg-white/80 text-foreground font-semibold text-sm rounded-full mb-6 animate-fade-in shadow-sm border border-secondary/30">
            <SparklesIcon className="mr-2 h-4 w-4 text-primary" />
            <span>Simple Workflow</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground animate-fade-in tracking-tight">
            Create Amazing Ads in <span className="relative">
              <span className="relative z-10 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                3 Simple Steps
              </span>
              <span className="absolute bottom-1 left-0 w-full h-5 bg-gradient-to-r from-accent/60 to-accent/30 -z-0 rounded-sm transform -rotate-1"></span>
            </span>
          </h2>
          <p className="text-lg md:text-xl text-foreground/90 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            Our AI-powered platform transforms your product images into stunning, professional ads in seconds—no design skills required.
          </p>
        </div>
        
        <div className="space-y-24 md:space-y-28">
          {steps.map((step, index) => (
            <div
              key={step.step}
              className={`grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Text content with styling matching hero */}
              <div className={`${index % 2 === 1 ? "md:order-2" : ""} animate-fade-in`} style={{ animationDelay: `${step.delay}s` }}>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-primary/80 to-primary/60 shadow-lg">
                    <Image 
                      src={step.icon} 
                      alt={`Step ${step.step} icon`} 
                      width={32} 
                      height={32}
                      className="w-8 h-8 text-white" 
                    />
                  </div>
                  <div className="text-4xl font-bold text-primary opacity-80">0{step.step}</div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">{step.title}</h3>
                <p className="text-lg text-foreground/90 mb-6 leading-relaxed">{step.description}</p>
                
                {/* Bullet points with hero-matching styling */}
                <ul className="space-y-3">
                  {index === 0 && (
                    <>
                      <li className="flex items-center text-foreground">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-secondary/60 to-accent/40 flex items-center justify-center shadow-sm mr-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-primary/80"></div>
                        </div>
                        <span className="text-foreground/90">Upload up to 4 product images</span>
                      </li>
                      <li className="flex items-center text-foreground">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-secondary/60 to-accent/40 flex items-center justify-center shadow-sm mr-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-primary/80"></div>
                        </div>
                        <span className="text-foreground/90">Supports PNG, JPG & WEBP formats</span>
                      </li>
                    </>
                  )}
                  
                  {index === 1 && (
                    <>
                      <li className="flex items-center text-foreground">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-secondary/60 to-accent/40 flex items-center justify-center shadow-sm mr-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-primary/80"></div>
                        </div>
                        <span className="text-foreground/90">100+ professional ad templates</span>
                      </li>
                      <li className="flex items-center text-foreground">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-secondary/60 to-accent/40 flex items-center justify-center shadow-sm mr-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-primary/80"></div>
                        </div>
                        <span className="text-foreground/90">Customize image size and quality</span>
                      </li>
                    </>
                  )}
                  
                  {index === 2 && (
                    <>
                      <li className="flex items-center text-foreground">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-secondary/60 to-accent/40 flex items-center justify-center shadow-sm mr-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-primary/80"></div>
                        </div>
                        <span className="text-foreground/90">AI interprets your text description</span>
                      </li>
                      <li className="flex items-center text-foreground">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-secondary/60 to-accent/40 flex items-center justify-center shadow-sm mr-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-primary/80"></div>
                        </div>
                        <span className="text-foreground/90">Save to history for easy editing</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              
              {/* Image/Screen Mockup with styling matching hero */}
              <div className={`${index % 2 === 1 ? "md:order-1" : ""} relative animate-fade-in`} style={{ animationDelay: `${step.delay + 0.2}s` }}>
                <div className="relative rounded-xl overflow-hidden shadow-lg border border-secondary/30 bg-white/80 backdrop-blur-sm p-2">
                  {/* Image container with clean styling matching hero */}
                  <div className="aspect-video w-full relative rounded-lg overflow-hidden">
                    {/* This would be replaced with actual images */}
                    <div className="w-full h-full bg-white/50 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center p-6">
                        <div className={`mx-auto mb-4 w-16 h-16 rounded-full ${step.accentColor} flex items-center justify-center`}>
                          <Image 
                            src={step.icon}
                            alt={step.title}
                            width={32}
                            height={32}
                            className="w-8 h-8 text-primary"
                          />
                        </div>
                        <h4 className="text-xl font-bold mb-2 text-primary">Step {step.step}: {step.title}</h4>
                        <p className="text-foreground/70 text-sm">
                          Example preview of {step.title.toLowerCase()} process
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements matching hero */}
                <div className="absolute -z-10 -bottom-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br from-accent/30 via-secondary/20 to-primary/10"></div>
                <div className="absolute -z-10 -top-4 -left-4 w-16 h-16 rounded-full bg-gradient-to-tl from-accent/20 via-secondary/15 to-primary/10"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
