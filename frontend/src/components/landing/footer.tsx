"use client";

import React from "react";
import Link from "next/link";
import { Linkedin, Twitter, Instagram } from "lucide-react";
import Logo from "../logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 pt-16 pb-8">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      <div className="absolute -top-[50%] right-[10%] w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-3xl opacity-50 -z-10"></div>
      <div className="absolute bottom-0 left-[5%] w-[30rem] h-[30rem] bg-accent/5 rounded-full blur-3xl opacity-40 -z-10"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Simplified top section with logo and links */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-10">
          <div className="max-w-xs">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative">
                <Logo size={40} />
              </div>
            </div>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Transform your product photos into stunning ad visuals with Picad's elegant AI-powered platform.
            </p>
            
            <div className="mt-6 flex space-x-3">
              <Link href="https://linkedin.com" aria-label="LinkedIn">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-all border border-muted/50 text-muted-foreground hover:text-primary hover:scale-110 duration-300">
                  <Linkedin className="w-4 h-4" />
                </div>
              </Link>
              <Link href="https://twitter.com" aria-label="Twitter">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-all border border-muted/50 text-muted-foreground hover:text-primary hover:scale-110 duration-300">
                  <Twitter className="w-4 h-4" />
                </div>
              </Link>
              <Link href="https://instagram.com" aria-label="Instagram">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-all border border-muted/50 text-muted-foreground hover:text-primary hover:scale-110 duration-300">
                  <Instagram className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-12 md:gap-20">
            {/* Only two link columns for simplicity */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-2">
                {[
                  ["Features", "/#features"],
                  ["How It Works", "/#how-it-works"],
                  ["Pricing", "/#pricing"],
                  ["FAQs", "/#faq"],
                ].map(([name, href]) => (
                  <li key={name}>
                    <Link href={href} className="text-muted-foreground hover:text-primary transition-colors text-sm relative group">
                      <span>{name}</span>
                      <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2">
                {[
                  ["About", "/about"],
                  ["Contact", "/contact"],
                  ["Blog", "/blog"],
                ].map(([name, href]) => (
                  <li key={name}>
                    <Link href={href} className="text-muted-foreground hover:text-primary transition-colors text-sm relative group">
                      <span>{name}</span>
                      <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Bottom section with simplified copyright and essential links */}
        <div className="border-t border-muted/40 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">
            © {currentYear} Picad. All rights reserved.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            {[
              ["Terms", "/terms"],
              ["Privacy", "/privacy"],
            ].map(([name, href]) => (
              <Link key={name} href={href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
