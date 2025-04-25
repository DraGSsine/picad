"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Logo from "../logo";

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 pt-6">
        <nav
          className="rounded-full px-6 md:px-8 py-2 bg-white/90 backdrop-blur-md shadow-md border border-slate-200/60 dark:bg-slate-900/80 dark:border-slate-800/60"
        >
          <div className="flex items-center justify-between">
            {/* Logo with elegant hover effect */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-primary/10 dark:bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative">
                <Logo size={40} animated colorScheme="modern" />
              </div>
            </div>

            {/* Desktop Navigation with elegant styling */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#how-it-works"
                className={cn(
                  "font-medium text-sm transition-all duration-300 relative group",
                  "text-foreground hover:text-primary"
                )}
              >
                <span>How it works</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="#pricing"
                className={cn(
                  "font-medium text-sm transition-all duration-300 relative group",
                  "text-foreground hover:text-primary"
                )}
              >
                <span>Pricing</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="#testimonials"
                className={cn(
                  "font-medium text-sm transition-all duration-300 relative group",
                  "text-foreground hover:text-primary"
                )}
              >
                <span>Testimonials</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="#faq"
                className={cn(
                  "font-medium text-sm transition-all duration-300 relative group",
                  "text-foreground hover:text-primary"
                )}
              >
                <span>FAQ</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </Link>
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/signin"
                  className={cn(
                    "rounded-full px-6 py-2 transition-all duration-300 border border-slate-200 dark:border-slate-800",
                    "hover:bg-slate-100 dark:hover:bg-slate-800/70 text-foreground shadow-sm hover:shadow"
                  )}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-primary flex justify-between items-center py-2 hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 px-4 border border-primary/10"
                >
                  <span>Get Started</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Mobile menu button with clean styling */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-full border border-slate-200 dark:border-slate-800 shadow-sm",
                  "bg-white dark:bg-slate-900 text-foreground"
                )}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </Button>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation with modern styling */}
        {isMenuOpen && (
          <div className="md:hidden absolute mt-2 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/30 dark:border-slate-800/30 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary/50"></div>
            <div className="py-6 px-6">
              <div className="flex flex-col space-y-4">
                <Link
                  href="#how-it-works"
                  className="text-foreground py-2 px-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 font-medium text-sm flex items-center justify-between group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>How it works</span>
                  <ChevronRight className="w-4 h-4 text-primary/70 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#pricing"
                  className="text-foreground py-2 px-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 font-medium text-sm flex items-center justify-between group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Pricing</span>
                  <ChevronRight className="w-4 h-4 text-primary/70 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#testimonials"
                  className="text-foreground py-2 px-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 font-medium text-sm flex items-center justify-between group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Testimonials</span>
                  <ChevronRight className="w-4 h-4 text-primary/70 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#faq"
                  className="text-foreground py-2 px-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 font-medium text-sm flex items-center justify-between group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>FAQ</span>
                  <ChevronRight className="w-4 h-4 text-primary/70 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="grid gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="w-full text-foreground hover:bg-slate-100 dark:hover:bg-slate-800/70 border-slate-200 dark:border-slate-800 rounded-xl py-6 font-medium"
                  >
                    Sign In
                  </Button>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-6 shadow-md font-semibold">
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationBar;
