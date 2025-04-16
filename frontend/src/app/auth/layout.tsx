import React, { ReactNode } from "react";
import { Metadata } from "next";
import Logo from "@/components/logo";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-background via-white to-muted/30">
      {/* Left Panel with styling matching landing page */}
      <div className="hidden lg:flex w-1/2 p-12 relative overflow-hidden bg-gradient-to-br from-primary to-primary/80">
        {/* Grid Pattern Overlay matching landing page */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:64px_64px]" />

        {/* Decorative Gradients matching landing page */}
        <div className="absolute -left-40 -top-40 h-[800px] w-[800px] rounded-full bg-gradient-to-tr from-accent/30 to-secondary/30 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-secondary/30 to-accent/30 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-primary/10 to-primary/10 blur-2xl" />

        {/* Soft accent lines matching hero */}
        <div className="absolute top-[15%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-secondary/40 to-transparent"></div>
        <div className="absolute bottom-[15%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-secondary/40 to-transparent"></div>

        {/* Content */}
        <div className="relative flex flex-col justify-between h-full">
          <Logo size={45} textClass="text-white" />

          <div className="space-y-8 max-w-lg">
            <div className="space-y-6">
              <h1 className="text-6xl font-bold text-white leading-[1.1] tracking-tight">
                Craft Refined Ads In{" "}
                <span className="relative">
                  <span className="relative z-10 text-white">Moments</span>
                  <span className="absolute bottom-1 left-0 w-full h-5 bg-gradient-to-r from-accent/60 to-accent/30 -z-0 rounded-sm transform -rotate-1"></span>
                </span>
              </h1>
              
              <p className="text-xl text-primary-foreground/90 leading-relaxed">
                Transform ordinary product photos into stunning advertising masterpieces with our elegant AI-powered platform.
              </p>
            </div>

            {/* Feature highlights matching landing page */}
            <div className="space-y-4">
              {[
                "Elegant designs, no skills needed",
                "Ready in moments",
                "100+ refined templates",
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-secondary/60 to-accent/40 flex items-center justify-center shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <span className="text-primary-foreground/90 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="flex-1 flex items-center justify-center">{children}</div>
    </div>
  );
};

export default AuthLayout;
