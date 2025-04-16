import Navbar from "@/components/landing/navbar";
import React, { ReactNode } from "react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Picad - Create High-Converting Ads in Seconds',
  description: 'Generate professional ad creatives effortlessly with Picad. Turn product photos into high-converting ads for Facebook, Instagram, Google Ads, and more. Easy, fast, and effective.',
};

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="bg-neutral-50">
        <Navbar />
        {children}
    </main>
  );
};

export default Layout;
