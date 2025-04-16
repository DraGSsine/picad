"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Lock, Mail, User, ArrowRight, SparklesIcon } from "lucide-react";
import GoogleAuthButton from "../GoogleAuthButton";
import { z } from "zod";
import { useState } from "react";
import { AxiosError } from "axios";
import { signupSchema } from "@/lib/validation";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { api } from "@/lib/axios";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [signupData, setSignupData] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignupFormData, string>>
  >({});

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: SignupFormData) => {
      const response = await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      setIsVerificationStep(true);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast({
        description: error?.response?.data.message,
        variant: "destructive",
      });
    },
  });

  const { mutate: verifyOtp, isPending: isVerificationPending } = useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      otp: string;
    }) => {
      const response = await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast({
        description: "Account created successfully",
      });
      window.location.href = "/dashboard";
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast({
        description: error?.response?.data.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      displayname: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    // Store email and password for OTP verification
    setSignupData({
      email: data.email,
      password: data.password,
    });

    try {
      const validatedData = signupSchema.parse(data);
      mutate(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof SignupFormData, string>> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof SignupFormData;
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
      }
    }
  };

  const handleVerificationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    verifyOtp({
      email: signupData.email,
      password: signupData.password,
      otp,
    });
  };

  return (
    <div className="w-full max-w-[540px] relative">
      {/* Decorative background elements matching landing page design */}
      <div className="absolute top-[5%] right-[5%] w-[45rem] h-[45rem] bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-3xl opacity-70 -z-10"></div>
      <div className="absolute bottom-[10%] left-[5%] w-[35rem] h-[35rem] bg-gradient-to-tl from-accent/20 to-secondary/20 rounded-full blur-3xl opacity-60 -z-10"></div>

      {/* Main form container with styling matching landing page */}
      <div className="relative flex justify-center flex-col bg-white/90 backdrop-blur-md rounded-[2rem] p-8 space-y-7 border border-secondary/30 shadow-xl">
        {/* Header matching landing page styling */}
        <div className="space-y-3">
          <div className="inline-flex items-center px-4 py-1.5 bg-gradient-to-r from-secondary/50 to-accent/50 text-foreground font-medium text-sm rounded-full mb-3 shadow-sm border border-secondary/30 animate-fade-in">
            <SparklesIcon className="mr-2 h-3.5 w-3.5 text-primary" />
            <span>{isVerificationStep ? "One Last Step" : "Join Us Today"}</span>
          </div>
          
          <h2 className="text-3xl font-bold text-foreground animate-fade-in tracking-tight">
            {isVerificationStep ? "Verify Your Email" : (
              <>
                Get Started <span className="relative">
                  <span className="relative z-10 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    Now
                  </span>
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-gradient-to-r from-accent/60 to-accent/30 -z-0 rounded-sm transform -rotate-1"></span>
                </span>
              </>
            )}
          </h2>
          
          <p className="text-foreground/80 leading-relaxed">
            {isVerificationStep 
              ? "Enter the verification code sent to your email to complete registration"
              : "Create your account to start creating stunning ad designs"}
          </p>
        </div>

        {!isVerificationStep ? (
          <>
            {/* Google Auth Button */}
            <GoogleAuthButton />

            {/* Divider with improved styling */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 text-foreground/60 bg-white/90">
                  or continue with email
                </span>
              </div>
            </div>

            {/* Signup Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                {/* Name Input */}
                <div>
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-foreground/90"
                  >
                    Full Name
                  </Label>
                  <div className="relative h-16 mt-1.5">
                    <div className="relative">
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        className={`h-11 rounded-xl bg-white/80 border-secondary/30 text-foreground placeholder:text-foreground/50 focus-visible:ring-primary focus-visible:ring-1 focus-visible:border-primary pl-11 ${
                          errors.displayname
                            ? "border-red-500 focus-visible:ring-red-500"
                            : ""
                        }`}
                        required
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/70" />
                    </div>
                    {errors.displayname && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1">
                        {errors.displayname}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-foreground/90"
                  >
                    Email
                  </Label>
                  <div className="relative h-16 mt-1.5">
                    <div className="relative">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        className={`h-11 rounded-xl bg-white/80 border-secondary/30 text-foreground placeholder:text-foreground/50 focus-visible:ring-primary focus-visible:ring-1 focus-visible:border-primary pl-11 ${
                          errors.email
                            ? "border-red-500 focus-visible:ring-red-500"
                            : ""
                        }`}
                      />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/70" />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-foreground/90"
                  >
                    Password
                  </Label>
                  <div className="relative h-16 mt-1.5">
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className={`h-11 rounded-xl bg-white/80 border-secondary/30 text-foreground placeholder:text-foreground/50 focus-visible:ring-primary focus-visible:ring-1 focus-visible:border-primary pl-11 ${
                          errors.password
                            ? "border-red-500 focus-visible:ring-red-500"
                            : ""
                        }`}
                      />
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/70" />
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button with styling matching landing page */}
              <Button
                type="submit"
                disabled={isPending}
                className="relative w-full h-11 rounded-full bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground hover:from-primary/90 hover:to-primary/80 font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] border border-primary/10 group"
              >
                {isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <span className="flex items-center justify-center">
                    Create account
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>
          </>
        ) : (
          /* OTP Verification Form with styling matching landing page */
          <form onSubmit={handleVerificationSubmit} className="space-y-8">
            <div className="space-y-6 flex flex-col items-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-secondary/20">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg mb-2">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(otp) => setOtp(otp)}
                className="gap-2"
              >
                <InputOTPGroup>
                  <InputOTPSlot 
                    index={0} 
                    className="rounded-lg border-secondary/30 bg-white/80 focus:border-primary focus:ring-primary h-12 w-12"
                  />
                  <InputOTPSlot 
                    index={1} 
                    className="rounded-lg border-secondary/30 bg-white/80 focus:border-primary focus:ring-primary h-12 w-12"
                  />
                  <InputOTPSlot 
                    index={2}
                    className="rounded-lg border-secondary/30 bg-white/80 focus:border-primary focus:ring-primary h-12 w-12"
                  />
                </InputOTPGroup>
                <InputOTPSeparator>—</InputOTPSeparator>
                <InputOTPGroup>
                  <InputOTPSlot 
                    index={3}
                    className="rounded-lg border-secondary/30 bg-white/80 focus:border-primary focus:ring-primary h-12 w-12"
                  />
                  <InputOTPSlot 
                    index={4}
                    className="rounded-lg border-secondary/30 bg-white/80 focus:border-primary focus:ring-primary h-12 w-12"
                  />
                  <InputOTPSlot 
                    index={5}
                    className="rounded-lg border-secondary/30 bg-white/80 focus:border-primary focus:ring-primary h-12 w-12"
                  />
                </InputOTPGroup>
              </InputOTP>
              
              <div className="text-center text-foreground/70 text-sm">
                {otp.length === 6 ? (
                  <span className="text-primary font-medium">Code complete!</span>
                ) : (
                  <>Enter the 6-digit code sent to your email</>
                )}
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={isVerificationPending || otp.length !== 6}
              className="relative w-full h-11 rounded-full bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground hover:from-primary/90 hover:to-primary/80 font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] border border-primary/10 group"
            >
              {isVerificationPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span className="flex items-center justify-center">
                  Verify & Complete
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>
        )}

        {/* Footer with styling matching landing page */}
        <p className="text-center text-foreground/70">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Sign in →
          </Link>
        </p>
      </div>
      
      {/* CSS animations matching landing page */}
      <style jsx global>{`
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s forwards;
        }
      `}</style>
    </div>
  );
}
