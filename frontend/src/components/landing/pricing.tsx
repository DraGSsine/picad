"use client";

import React, { useState } from "react";
import { CheckIcon, SparklesIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  
  const plans = [
    {
      name: "Starter",
      description: "Perfect for individuals and small businesses just getting started.",
      price: isAnnual ? 29 : 39,
      features: [
        "Up to 50 ad generations per month",
        "Access to 30+ templates",
        "Basic editing tools",
        "Standard support",
        "Export in JPG & PNG formats",
        "720p maximum resolution"
      ],
      color: "primary",
      popular: false,
    },
    {
      name: "Professional",
      description: "Ideal for growing businesses and serious marketers.",
      price: isAnnual ? 79 : 99,
      features: [
        "Up to 200 ad generations per month",
        "Access to all 100+ templates",
        "Advanced AI brush tool",
        "Priority support",
        "Export in all formats",
        "4K maximum resolution",
        "Remove Picad branding"
      ],
      color: "secondary",
      popular: true,
    },
    {
      name: "Enterprise",
      description: "Tailored for large teams and companies with advanced needs.",
      price: "Custom",
      features: [
        "Unlimited ad generations",
        "Custom templates & branding",
        "Advanced team permissions",
        "Dedicated account manager",
        "API access for integrations",
        "Custom export options",
        "SSO authentication",
        "Custom contracts & SLA"
      ],
      color: "accent",
      popular: false,
      isEnterprise: true
    }
  ];

  return (
    <section id="pricing" className="py-24 md:py-32 relative overflow-hidden">
      {/* Soft background with improved gradient elements similar to hero */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-white to-accent/20 z-0"></div>
      
      {/* Enhanced decorative elements with same color palette as hero */}
      <div className="absolute top-[5%] right-[5%] w-[45rem] h-[45rem] bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-3xl opacity-70 -z-10"></div>
      <div className="absolute bottom-[10%] left-[5%] w-[35rem] h-[35rem] bg-gradient-to-tl from-accent/20 to-secondary/20 rounded-full blur-3xl opacity-60 -z-10"></div>

      {/* Soft accent lines matching hero */}
      <div className="absolute top-[15%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-secondary/40 to-transparent"></div>
      <div className="absolute bottom-[15%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-secondary/40 to-transparent"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section header with styling matching hero */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-secondary/50 to-accent/50 text-foreground font-semibold text-sm rounded-full mb-6 animate-fade-in shadow-sm border border-secondary/30">
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
            Select the plan that best suits your needs. All plans include a 7-day free trial.
          </p>
          
          {/* Billing toggle with styling matching hero */}
          <div className="flex items-center justify-center mt-10">
            <div className="flex items-center bg-white/90 backdrop-blur-sm p-1 rounded-full border border-secondary/30 shadow-sm">
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isAnnual 
                    ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-sm" 
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                Annual (Save 20%)
              </button>
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  !isAnnual 
                    ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-sm" 
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
        </div>
        
        {/* Pricing cards with styling matching hero */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border ${
                plan.popular 
                  ? "border-primary/30 ring-2 ring-primary/30 ring-offset-4 ring-offset-background/80" 
                  : "border-secondary/30 hover:border-primary/30"
              } transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl animate-fade-in`}
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
              <h3 className="text-2xl font-bold mb-2 text-foreground">{plan.name}</h3>
              <p className="text-foreground/70 mb-6 h-12">{plan.description}</p>
              
              {/* Pricing with styling matching hero */}
              <div className="mb-6">
                <div className="flex items-end">
                  {typeof plan.price === "number" ? (
                    <>
                      <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                      <span className="text-foreground/70 ml-2 mb-1">/month</span>
                    </>
                  ) : (
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  )}
                </div>
                {isAnnual && typeof plan.price === "number" && (
                  <p className="text-sm text-primary mt-1">Billed annually (${plan.price * 12}/year)</p>
                )}
              </div>
              
              {/* Features list with styling matching hero */}
              <ul className="mb-8 space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <div className="mr-3 mt-1">
                      <div className={`w-5 h-5 rounded-full bg-${plan.color}/10 flex items-center justify-center`}>
                        <CheckIcon className={`w-3 h-3 text-${plan.color}`} />
                      </div>
                    </div>
                    <span className="text-foreground/90">{feature}</span>
                  </li>
                ))}
              </ul>
              
              {/* CTA button with styling matching hero */}
              <Button
                className={`w-full bg-gradient-to-r from-${plan.color} to-${plan.color}/90 text-${plan.color === "primary" ? "primary-foreground" : plan.color === "secondary" ? "secondary-foreground" : "accent-foreground"} hover:from-${plan.color}/90 hover:to-${plan.color}/80 font-semibold px-8 py-6 rounded-full shadow-md hover:shadow-lg transition-all`}
              >
                {plan.isEnterprise ? "Contact Sales" : "Start Free Trial"}
              </Button>
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
