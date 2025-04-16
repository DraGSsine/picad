"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  textClass?: string;
  size?: number;
  variant?: "default" | "minimal";
  animated?: boolean;
  colorScheme?: "default" | "gradient" | "modern";
}

const Logo = ({
  size = 32,
  textClass,
  variant = "default",
  animated = true,
  colorScheme = "modern"
}: LogoProps) => {
  // Color scheme classes
  const colorClasses = {
    default: {
      first: "text-foreground",
      second: "text-primary"
    },
    gradient: {
      first: "bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80",
      second: "bg-clip-text text-transparent bg-gradient-to-r from-secondary to-secondary/80"
    },
    modern: {
      first: "text-foreground dark:text-foreground/90",
      second: "text-primary dark:text-primary/90"
    }
  };

  const selectedColors = colorClasses[colorScheme];

  return (
    <Link 
      href="/" 
      className={`flex items-center gap-3 group ${animated ? 'hover:scale-105' : 'hover:opacity-90'} transition-all duration-300`}
    >
      <div className="relative overflow-hidden rounded-md">
        <Image
          width={size}
          height={size}
          src="/logo.png"
          alt="Website logo"
          className={`object-contain ${animated ? 'group-hover:brightness-110' : ''} transition-all duration-300`}
          priority
        />
      </div>
      
      {variant === "default" && (
        <div
          className={cn(
            "text-xl font-extrabold relative flex items-center",
            textClass
          )}
        >
          <span className={selectedColors.first}>Pic</span>
          <span className={`${selectedColors.second} relative inline-block`}>
            Ad
            {animated && (
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${colorScheme === 'gradient' ? 'bg-gradient-to-r from-secondary to-secondary/80' : 'bg-primary dark:bg-primary/90'} group-hover:w-full transition-all duration-300`}></span>
            )}
          </span>
        </div>
      )}
    </Link>
  );
};

export default Logo;