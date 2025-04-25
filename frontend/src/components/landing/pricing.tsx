"use client";

import React from "react";
import { CheckIcon, SparklesIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      description: "Perfect for individuals creating occasional marketing content with AI.",
      price: 9.99,
      period: "month",
      features: [
        "150 AI image generations per month",
        "Access to 100+ ad templates",
        "Complete AI customization tools",
        "All image sizes (1:1, 2:3, 3:2)",
        "Export as PNG, JPG, WEBP",
        "Image history & checkpoint restore",
        "Standard customer support",
      ],
      color: "primary",
      popular: false,
    },
    {
      name: "Growth",
      description: "Ideal for regular content creators needing more generations and faster support.",
      price: 19.99,
      period: "month",
      features: [
        "400 AI image generations per month",
        "Access to 100+ ad templates",
        "Complete AI customization tools",
        "All image sizes (1:1, 2:3, 3:2)",
        "Export as PNG, JPG, WEBP",
        "Image history & checkpoint restore",
        "Priority customer support",
      ],
      color: "secondary",
      popular: true,
    },
    {
      name: "Annual",
      description: "Same as monthly Growth plan but with two months free! Best value for your business.",
      price: 199.99,
      period: "year",
      saveInfo: "Save over $39.99 - get two months free!",
      features: [
        "400 AI image generations per month",
        "Access to 100+ ad templates",
        "Complete AI customization tools", 
        "All image sizes (1:1, 2:3, 3:2)",
        "Export as PNG, JPG, WEBP",
        "Image history & checkpoint restore",
        "Priority customer support",
        "✓ Two months free vs. monthly billing",
      ],
      color: "accent",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-24 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        {/* Section header with styling matching hero */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center px-5 py-2 bg-white/80 text-foreground font-semibold text-sm rounded-full mb-6 animate-fade-in shadow-sm border border-secondary/30">
            <SparklesIcon className="mr-2 h-4 w-4 text-primary" />
            <span>Simple Pricing</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground animate-fade-in tracking-tight">
            Choose Your <span className="relative">
              <span className="relative z-10 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Perfect Plan
              </span>
              <span className="absolute bottom-1 left-0 w-full h-5 bg-gradient-to-r from-accent/60 to-accent/30 -z-0 rounded-sm transform -rotate-1"></span>
            </span>
          </h2>
          <p className="text-lg md:text-xl text-foreground/90 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            Select the plan that best suits your needs. All plans include a 14-day money-back guarantee.
          </p>
        </div>
        
        {/* Pricing cards with all plans showing at once */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border ${
                plan.popular 
                  ? "border-primary/30 ring-2 ring-primary/30 ring-offset-4 ring-offset-background/80" 
                  : "border-secondary/30 hover:border-primary/30"
              } transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl animate-fade-in flex flex-col h-full`}
              style={{ animationDelay: `${0.2 + (index * 0.1)}s` }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <Badge
                  className="absolute -top-3 right-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-white border-none shadow-md px-4 py-1"
                >
                  Most Popular
                </Badge>
              )}
              
              {/* Plan details */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2 text-foreground">{plan.name}</h3>
                <p className="text-foreground/70 mb-6 h-12">{plan.description}</p>
                
                {/* Pricing with styling matching hero */}
                <div className="mb-6">
                  <div className="flex items-end">
                    <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                    <span className="text-foreground/70 ml-2 mb-1">/{plan.period}</span>
                  </div>
                  {plan.saveInfo && (
                    <p className="text-sm text-primary mt-1">{plan.saveInfo}</p>
                  )}
                </div>
                
                {/* Features list with styling matching hero */}
                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <div className="mr-3 mt-1">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                          <CheckIcon className="w-3 h-3 text-primary" />
                        </div>
                      </div>
                      <span className="text-foreground/90">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* CTA button pushed to bottom with flex-grow */}
              <div className="mt-auto pt-4">
                <Button
                  className="w-full bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary/80 font-semibold px-8 py-6 rounded-full shadow-md hover:shadow-lg transition-all"
                >
                  Get Started
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Money-back guarantee with styling matching hero */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm text-foreground/90 text-sm rounded-full shadow-sm border border-secondary/30">
            <CheckIcon className="mr-2 h-4 w-4 text-primary" />
            <span>14-day money-back guarantee. No questions asked.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
