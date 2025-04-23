"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCallback, useState } from "react";

const GoogleAuthButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const handleGoogleAuth = useCallback(() => {
    setIsLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("API URL is not defined");
      return;
    }
    window.location.href = `${apiUrl}/auth/google`;
  }, []);
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full h-11 rounded-xl bg-white/80 border-secondary/30 text-foreground hover:bg-white hover:border-secondary font-medium transition-all duration-300 shadow-sm hover:shadow-md group relative overflow-hidden"
      onClick={handleGoogleAuth}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <div className="flex items-center justify-center w-full">
          {/* Enhanced Google Icon with gradient hover effect */}
          <div className="relative group-hover:scale-110 transition-transform duration-300 mr-3">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20"
                width="20"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                ></path>
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                ></path>
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
              </svg>
            </div>
          </div>
          <span>Continue with Google</span>
        </div>
      )}
      
      {/* Fancy hover effect */}
      <div className="absolute inset-0 w-full transform scale-0 group-hover:scale-100 transition-transform duration-300 rounded-xl bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5"></div>
    </Button>
  );
};

export default GoogleAuthButton;
