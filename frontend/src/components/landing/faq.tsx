"use client";

import React, { useState } from "react";
import { ChevronDown, SparklesIcon } from "lucide-react";
import { Button } from "../ui/button";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  
  const faqData = [
    {
      question: "How does the ad generation process work?",
      answer: "Our AI-powered platform works in three simple steps: First, you upload your product image. Next, you choose from our 100+ professional ad templates and customize your settings (image size, quality). Finally, you enter a description of the ad you want to create, and our AI combines everything to instantly generate a professional ad featuring your product."
    },
    {
      question: "What types of product images work best?",
      answer: "We accept product images in PNG, JPG, and WEBP formats (up to 5MB each). For best results, use clear, well-lit photos with minimal background distractions. You can upload up to 4 product images to give our AI a better understanding of your product from different angles."
    },
    {
      question: "How do I use the templates?",
      answer: "After uploading your product image, you can browse our template gallery with 100+ professional designs sorted by category. Simply select the template that best fits your needs, or upload your own custom template. The AI will incorporate your product into the selected template style while following your description."
    },
    {
      question: "What should I write in my description?",
      answer: "Your description helps our AI understand how you want your final ad to look. Be specific about the style, mood, colors, and any particular elements you want to include or emphasize. For example, instead of writing 'Show my product,' try 'Create a modern, minimalist ad with my product on a light blue background with emphasis on its ergonomic design.'"
    },
    {
      question: "What image sizes and formats are supported?",
      answer: "You can generate images in three aspect ratios: square (1:1), portrait (2:3), and landscape (3:2). We support multiple quality levels (Low, Medium, High) depending on your subscription plan. Generated images can be exported in PNG, JPG, or WEBP formats for use across different platforms and marketing channels."
    },
    {
      question: "What is the checkpoint restore feature?",
      answer: "Checkpoint restore is our image history system that saves all your generated ads. This allows you to revisit previous generations, track your creative process, and continue editing from any point in your history. You can view your entire creation history in the sidebar, making it easy to pick up where you left off or try new variations based on previous designs."
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
            Find answers to common questions about our AI ad creation platform, features, and subscription plans.
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
            Don&apos;t see your question? We&apos;re here to help!
          </p>
          <Button 
            asChild
            className="bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground hover:from-primary/90 hover:to-primary/80 font-semibold px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border border-primary/10"
          >
            <a href="mailto:ouchen606@gmail.com?subject=Support Request - PicAd">Contact Support</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;