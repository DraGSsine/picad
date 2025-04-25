import React, { ReactNode } from "react";

// Simple imports instead of dynamic imports
import NavBar from "@/components/dashboard/NavBar";
import DashboardProvider from "@/components/contexts/DashboardProvider";
import Sidebar from "@/components/dashboard/sidebar";
import RightSidebar from "@/components/dashboard/rightSidebar";
import PricingDialog from "@/components/dashboard/pricing-dialog";


const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Simplified background - removing heavy animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -right-[10%] w-[80%] h-[80%] rounded-full bg-primary/5 blur-[100px]"></div>
        <div className="absolute -bottom-[30%] -left-[10%] w-[60%] h-[60%] rounded-full bg-secondary/5 blur-[120px]"></div>
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
