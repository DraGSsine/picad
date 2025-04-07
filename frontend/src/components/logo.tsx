"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  textClass?: string;
  size?: number;
  variant?: "default" | "minimal";
}

const Logo = ({
  textClass,
  variant = "default"
}: LogoProps) => {
  return (
    <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
      <Image
        width={70}
        height={70}
      src="/logo.png"
      alt="Website logo"
      />
      
      {variant === "default" && (
        <div
          className={cn(
            "text-xl font-extrabold",
            textClass
          )}
        >
          Pic<span className=" text-purple-500 ">Ad</span>
        </div>
      )}
    </Link>
  );
};

export default Logo;