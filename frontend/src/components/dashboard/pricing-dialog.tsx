"use client";
import React, { useState } from "react";
import { CheckIcon, SparklesIcon, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useUserInfo } from "@/lib/queries";
import { api } from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const SubscriptionDialog = () => {
  const [planName, setPlanName] = useState<string>("Starter");
  const { data } = useUserInfo();

  const { mutate, isPending } = useMutation({
    mutationFn: async (plan: string) => {
      const response = await api.post("/payments/create-checkout-session", {
        plan,
      });
      return response.data;
    },
    onSuccess: (data: { url: string }) => {
      window.location.href = data.url;
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: "destructive",
        description:
          "An error occurred while processing your request. Please try again later.",
      });
    },
  });
  
  if (data?.plan !== "none") return null;

  const handlePlanSelection = (selectedPlan: string) => {
    setPlanName(selectedPlan);
    mutate(selectedPlan);
  };

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
      <div className="bg-background/95 rounded-3xl border border-primary/20 p-8 max-w-7xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[40%] -right-[10%] w-[80%] h-[80%] rounded-full bg-primary/5 blur-[100px] animate-float-slow"></div>
          <div className="absolute -bottom-[30%] -left-[10%] w-[60%] h-[60%] rounded-full bg-secondary/5 blur-[120px] animate-float-reverse"></div>
        </div>

        {/* Section header with styling matching hero */}
        <div className="text-center mb-16 max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center px-5 py-2 bg-white/80 text-foreground font-semibold text-sm rounded-full mb-6 shadow-sm border border-secondary/30">
            <SparklesIcon className="mr-2 h-4 w-4 text-primary" />
            <span>Choose Your Subscription</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground tracking-tight">
            Select Your <span className="relative">
              <span className="relative z-10 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Perfect Plan
              </span>
              <span className="absolute bottom-1 left-0 w-full h-5 bg-gradient-to-r from-accent/60 to-accent/30 -z-0 rounded-sm transform -rotate-1"></span>
            </span>
          </h2>
          <p className="text-lg md:text-xl text-foreground/90 max-w-2xl mx-auto leading-relaxed">
            All plans include a 14-day money-back guarantee, no questions asked.
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mt-6"></div>
        </div>
        
        {/* Pricing cards with all plans showing at once */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border ${
                plan.popular 
                  ? "border-primary/30 ring-2 ring-primary/30 ring-offset-4 ring-offset-background/80" 
                  : "border-secondary/30 hover:border-primary/30"
              } transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl flex flex-col h-full`}
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
                  onClick={() => handlePlanSelection(plan.name)}
                  disabled={isPending && planName === plan.name}
                  className="w-full bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary/80 font-semibold px-8 py-6 rounded-full shadow-md hover:shadow-lg transition-all"
                >
                  {isPending && planName === plan.name ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    "Get Started"
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Money-back guarantee with styling matching hero */}
        <div className="mt-16 text-center relative z-10">
          <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm text-foreground/90 text-sm rounded-full shadow-sm border border-secondary/30">
            <CheckIcon className="mr-2 h-4 w-4 text-primary" />
            <span>14-day money-back guarantee. No questions asked.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDialog;