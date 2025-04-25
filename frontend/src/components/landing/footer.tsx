"use client";

import React from "react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const mainLinks = [
    { name: "How it works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <footer className="bg-white/90 backdrop-blur-sm border-t border-secondary/30 relative py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Brand */}
          <div className="mb-6 md:mb-0">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-extrabold text-foreground">Picad</span>
              <div className="ml-1 w-2 h-2 rounded-full bg-gradient-to-r from-primary to-primary/80"></div>
            </Link>
          </div>
          
          {/* Main links */}
          <div className="flex flex-wrap justify-center gap-6 mb-6 md:mb-0">
            {mainLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href} 
                className="text-foreground/80 hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="border-t border-secondary/20 mt-6 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-foreground/70 mb-4 md:mb-0">
            &copy; {currentYear} Picad. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-foreground/70">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
