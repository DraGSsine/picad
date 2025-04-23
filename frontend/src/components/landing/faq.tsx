"use client";

import React, { useState } from "react";
import { ChevronDown, SparklesIcon } from "lucide-react";
import { Button } from "../ui/button";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  
  const faqData = [
    {
      question: "What kind of images work best with Picad?",
      answer: "Picad works best with high-quality product photos on clean backgrounds, but our AI is designed to enhance almost any product image. For optimal results, we recommend images that are at least 1000px by 1000px, with good lighting and minimal background distractions."
    },
    {
      question: "How long does it take to create an ad?",
      answer: "Most ads are generated within seconds! Our AI technology works instantly to transform your product photos into professional advertisements. The entire process from upload to finished ad typically takes less than a minute, though you can spend additional time refining your creation if you wish."
    },
    {
      question: "Can I customize the generated ads?",
      answer: "Absolutely! You have complete control over customization. After the AI generates your initial ad designs, you can modify text content, adjust colors, change fonts, reposition elements, and even use our AI brush to remove or add objects. Each template also offers various style options to match your brand identity."
    },
    {
      question: "Do you offer templates for different platforms?",
      answer: "Yes, we provide optimized templates for all major social media and advertising platforms including Instagram, Facebook, Google Ads, LinkedIn, Pinterest, and more. Each template is sized correctly for its intended platform and designed to maximize engagement and conversion rates."
    },
    {
      question: "How much does Picad cost?",
      answer: "Picad offers various subscription tiers to meet different needs and budgets. Our Starter plan begins at $29/month, while our Professional and Enterprise plans offer additional features and higher usage limits. We also offer a 7-day free trial so you can explore all of our features before committing."
    },
    {
      question: "Is there a limit to how many ads I can create?",
      answer: "Each subscription tier comes with different usage limits. Our Starter plan includes up to 50 ad generations per month, Professional increases this to 200, and Enterprise offers custom limits based on your needs. You'll receive notifications as you approach your limit, and can always upgrade your plan if needed."
    },
  ];
  
  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        {/* Section header with styling matching other components */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center px-5 py-2 bg-white/80 text-foreground font-semibold text-sm rounded-full mb-6 animate-fade-in shadow-sm border border-secondary/30">
            <SparklesIcon className="mr-2 h-4 w-4 text-primary" />
            <span>Questions & Answers</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground animate-fade-in tracking-tight">
            Frequently Asked <span className="relative">
              <span className="relative z-10 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Questions
              </span>
              <span className="absolute bottom-1 left-0 w-full h-5 bg-gradient-to-r from-accent/60 to-accent/30 -z-0 rounded-sm transform -rotate-1"></span>
            </span>
          </h2>
          <p className="text-lg md:text-xl text-foreground/90 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            Find answers to the most common questions about our platform, features, and subscription plans.
          </p>
        </div>
        
        {/* FAQ accordions with styling matching other components */}
        <div className="max-w-3xl mx-auto">
          {faqData.map((faq, index) => (
            <div 
              key={index} 
              className={`mb-5 overflow-hidden rounded-2xl border ${activeIndex === index ? "border-primary/30 shadow-lg" : "border-secondary/20"} transition-all duration-300 bg-white/90 backdrop-blur-sm animate-fade-in`}
              style={{ animationDelay: `${0.1 + (index * 0.05)}s` }}
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <span className="text-lg font-semibold text-foreground">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-primary transition-transform duration-300 ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  activeIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-6 pt-0 text-foreground/80 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Additional support section with gradient button matching the same style */}
        <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <p className="text-foreground/90 mb-6">
            Don&lsquo;t see your question? We&lsquo;re here to help!
          </p>
          <Button
            className="bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground hover:from-primary/90 hover:to-primary/80 font-semibold px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border border-primary/10"
          >
            Contact Support
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;