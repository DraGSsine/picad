import React, { ReactNode } from "react";
import PricingDialog from "@/components/dashboard/pricing-dialog";
import Sidebar from "@/components/dashboard/sidebar";
import NavBar from "@/components/dashboard/NavBar";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className=" px-5 pt-5 min-h-screen bg-gradient-to-b bg-purple-50">
      <NavBar />
      <main className="flex h-[89.6vh] overflow-auto gap-4 py-6 bg-red-500">
        <Sidebar />
        {children}
      </main>
      <PricingDialog />
    </div>
  );
};

export default Layout;
