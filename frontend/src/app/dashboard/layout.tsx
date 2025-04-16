import React, { ReactNode } from "react";
import PricingDialog from "@/components/dashboard/pricing-dialog";
import Sidebar from "@/components/dashboard/sidebar";
import NavBar from "@/components/dashboard/NavBar";
import { DashboardProvider } from "@/contexts/DashboardContext";
import RightSidebar from "@/components/dashboard/rightSidebar";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background/95 to-background">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -right-[10%] w-[80%] h-[80%] rounded-full bg-primary/5 blur-[100px] animate-float-slow"></div>
        <div className="absolute -bottom-[30%] -left-[10%] w-[60%] h-[60%] rounded-full bg-secondary/5 blur-[120px] animate-float-reverse"></div>
        <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[80px] animate-glow-slow"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-5 pt-5">
        <NavBar />

        <main className="flex h-[89vh] gap-4 py-6 overflow-hidden">
          <DashboardProvider>
            <Sidebar />
            {children}
            <RightSidebar />
          </DashboardProvider>
        </main>

        <PricingDialog />
      </div>
    </div>
  );
};

export default Layout;
