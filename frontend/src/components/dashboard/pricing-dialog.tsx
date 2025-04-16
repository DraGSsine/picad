"use client";
import React, { useState } from "react";
import { Flame, Zap, Diamond, Check, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useUserInfo } from "@/lib/queries";
import { api } from "@/lib/axios";
import { toast } from "@/hooks/use-toast";

interface PricingCardProps {
  price: string;
  planName: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  icon: React.ReactNode;
  onSelect: () => void;
  isLoading?: boolean;
  selectedPlan?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  price,
  planName,
  description,
  features,
  isPopular = false,
  icon,
  onSelect,
  isLoading,
  selectedPlan,
}) => {
  const isSelected = selectedPlan === planName;

  return (
    <div
      className={`relative rounded-3xl transition-all duration-500 hover:scale-105 overflow-hidden gradient-border ${
        isPopular
          ? "bg-gradient-to-br from-primary/95 to-primary/80 text-primary-foreground shadow-lg shadow-primary/20"
          : "bg-card hover:shadow-xl hover:shadow-primary/10 border-primary/10"
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium shadow-lg">
            Most Popular
          </span>
        </div>
      )}

      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute -top-[40%] -right-[10%] w-[80%] h-[80%] rounded-full bg-primary blur-[60px]"></div>
        <div className="absolute -bottom-[30%] -left-[10%] w-[60%] h-[60%] rounded-full bg-secondary blur-[80px]"></div>
      </div>

      <div className="p-8 relative z-10">
        <div className="mb-6">
          <div
            className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center transform transition-transform duration-500 hover:rotate-12 ${
              isPopular
                ? "bg-secondary text-secondary-foreground"
                : "bg-gradient-to-br from-primary/10 to-secondary/10 text-primary"
            }`}
          >
            {icon}
          </div>

          <h3
            className={`text-xl font-bold ${
              isPopular ? "text-primary-foreground" : "text-foreground"
            }`}
          >
            {planName}
          </h3>
          <p
            className={`mt-3 text-sm leading-relaxed ${
              isPopular ? "text-primary-foreground/80" : "text-muted-foreground"
            }`}
          >
            {description}
          </p>

          <div className="mt-6 flex items-baseline">
            <span
              className={`text-4xl font-bold ${
                isPopular ? "text-primary-foreground" : "text-foreground"
              }`}
            >
              ${price}
            </span>
            <span
              className={`ml-2 text-sm ${
                isPopular ? "text-primary-foreground/80" : "text-muted-foreground"
              }`}
            >
              /month
            </span>
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent my-6"></div>

        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div
                className={`mt-0.5 rounded-full p-1 ${
                  isPopular ? "bg-secondary/80" : "bg-primary/10"
                }`}
              >
                <Check
                  className={`w-3 h-3 ${
                    isPopular ? "text-secondary-foreground" : "text-primary"
                  }`}
                />
              </div>
              <span
                className={`text-sm leading-relaxed ${
                  isPopular ? "text-primary-foreground/90" : "text-foreground/80"
                }`}
              >
                {feature}
              </span>
            </li>
          ))}
        </ul>

        <button
          onClick={onSelect}
          disabled={isLoading}
          className={`w-full py-3.5 rounded-2xl font-medium transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center ${
            isPopular
              ? "bg-secondary text-secondary-foreground hover:shadow-lg hover:shadow-secondary/20"
              : "bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:shadow-lg hover:shadow-primary/20"
          } ${isLoading ? "opacity-80 cursor-not-allowed" : ""}`}
        >
          {isLoading && isSelected ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : null}
          {isLoading && isSelected ? "Processing..." : "Get Started"}
        </button>
      </div>
    </div>
  );
};

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
    onSuccess: (data: {url:string}) => {
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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
      <div className="bg-background/95 rounded-3xl border border-primary/20 p-8 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[40%] -right-[10%] w-[80%] h-[80%] rounded-full bg-primary/5 blur-[100px] animate-float-slow"></div>
          <div className="absolute -bottom-[30%] -left-[10%] w-[60%] h-[60%] rounded-full bg-secondary/5 blur-[120px] animate-float-reverse"></div>
        </div>
        
        <div className="text-center space-y-4 mb-12 relative z-10">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Your subscription has expired
          </h2>
          <p className="text-muted-foreground text-lg">
            Select a plan to continue using all features
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mt-6"></div>
        </div>

        <PricingSection
          onPlanSelect={handlePlanSelection}
          isLoading={isPending}
          selectedPlan={planName}
          showTitle={false}
        />
      </div>
    </div>
  );
};

interface PricingSectionProps {
  onPlanSelect?: (plan: string) => void;
  isLoading?: boolean;
  selectedPlan?: string;
  showTitle?: boolean;
}

const PricingSection: React.FC<PricingSectionProps> = ({
  onPlanSelect,
  isLoading,
  selectedPlan,
}) => {
  const pricingData = [
    {
      price: "3.99",
      planName: "Starter",
      description:
        "Get started for just $3.99! Perfect for occasional LinkedIn users needing message help. Up to 200 messages.",
      icon: <Flame className={`w-7 h-7`} />,
      features: [
        "200 messages per month",
        "Generate new responses",
        "Refine draft messages",
        "24/7 customer support",
      ],
      isPopular: false,
    },
    {
      price: "7.99",
      planName: "Growth",
      description:
        "Our most popular plan offering great value! Ideal for daily LinkedIn engagement. Up to 750 messages.",
      icon: <Zap className={`w-7 h-7`} />,
      features: [
        "750 messages per month",
        "Generate new responses",
        "Refine draft messages",
        "24/7 customer support",
      ],
      isPopular: true,
    },
    {
      price: "12.99",
      planName: "Pro",
      description:
        "Unlock unlimited potential! For serious LinkedIn networkers who demand the best. Truly unlimited messages.",
      icon: <Diamond className={`w-7 h-7`} />,
      features: [
        "Unlimited messages per month",
        "Generate new responses",
        "Refine draft messages",
        "24/7 customer support",
      ],
      isPopular: false,
    },
  ];

  return (
    <section className="py-8 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingData.map((plan, index) => (
            <PricingCard
              key={index}
              {...plan}
              onSelect={() => onPlanSelect?.(plan.planName)}
              isLoading={isLoading}
              selectedPlan={selectedPlan}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubscriptionDialog;