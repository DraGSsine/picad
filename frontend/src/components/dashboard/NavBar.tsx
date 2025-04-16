'use client';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { api } from '@/lib/axios';
import { useUserInfo } from '@/lib/queries';
import Logo from '../logo';
import { ArrowLeft01Icon, Bug01Icon, CreditCardIcon, Infinity01Icon, SparklesIcon } from 'hugeicons-react';

const NavBar = () => {
  const { data, isLoading } = useUserInfo();

  const monthlyCredits = data?.monthlyCredits ?? 0;
  const creditsUsed = data?.creditsUsed ?? 0;
  const remainingCredits = monthlyCredits - creditsUsed;
  const isUnlimited = (data?.plan === "Pro" || data?.plan === "Growth") ? true : false;

  const handleSignout = async () => {
    try {
      await api.post('/auth/signout');
      // window.location.href = '/auth/signin';
    } catch (error) {
      console.error('Failed to sign out', error);
    }
  };

  const handleReportBug = () => {
    try {
      console.log('Bug report button clicked');
      const subject = encodeURIComponent('Bug Report');
      const body = encodeURIComponent('Please describe the bug you encountered:\n\n');
      const mailtoLink = `mailto:ouchen606@gmail.com?subject=${subject}&body=${body}`;
      console.log('Opening mailto link:', mailtoLink);
      
      // Try opening in current window
      window.location.href = mailtoLink;
      
      // Alternative approach - try opening in a new window as backup
      setTimeout(() => {
        window.open(mailtoLink, '_blank');
      }, 300);
    } catch (error) {
      console.error('Error opening mail client:', error);
      alert('Could not open email client. Please send an email manually to ouchen606@gmail.com');
    }
  };

  return (
    <nav className="bg-card/80 backdrop-blur-md rounded-full w-full shadow-md h-[8vh] flex items-center">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center">
            <Logo size={40} textClass="text-lg lg:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary/90 to-secondary/90" />
          </div>

          {/* Credits Display */}
          <div className="flex items-center space-x-6">
            {!isLoading && data && (
              <div className="flex items-center space-x-2 bg-background/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-border/20 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] transition-all duration-300 hover:bg-background/60">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shadow-inner">
                  <CreditCardIcon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    {isUnlimited ? (
                      <div className="flex items-center gap-1">
                        <Infinity01Icon className="w-4 h-4 text-primary animate-pulse" />
                        <span className="text-xs font-bold text-primary">Unlimited</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs text-primary">{remainingCredits}</span>
                        <span className="text-xs text-foreground/70">credits</span>
                        <span className="text-xs text-foreground/70 hidden md:block">remaining</span>
                      </div>
                    )}
                  </div>
                  {!isUnlimited && (
                    <div className="w-full bg-muted/50 h-1.5 rounded-full mt-1 overflow-hidden shadow-inner">
                      <div 
                        className="bg-primary h-1.5 rounded-full transition-all duration-500 ease-out"
                        style={{ 
                          width: `${(creditsUsed / monthlyCredits) * 100}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none group">
                <Avatar className="h-10 w-10 ring-2 ring-border/30 transition duration-200 group-hover:ring-primary/30 shadow-md">
                  {data?.avatar && (
                    <AvatarImage 
                      src={data.avatar} 
                      alt={data.displayName || 'User'} 
                      className="object-cover"
                    />
                  )}
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-foreground text-sm">
                    {data?.displayName ? data.displayName.substring(0, 2).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-1 shadow-lg border border-border/30 backdrop-blur-lg bg-card/90 rounded-xl mt-1">
                {data?.displayName && (
                  <div className="px-4 py-2 border-b border-border/30 mb-1">
                    <p className="text-sm font-medium text-foreground">{data.displayName}</p>
                    <p className="text-xs text-muted-foreground">{data.email}</p>
                  </div>
                )}
                <DropdownMenuItem 
                  onClick={handleReportBug}
                  className="flex items-center space-x-2 cursor-pointer rounded-full m-1 hover:bg-primary-50 transition-colors"
                >
                  <Bug01Icon className="w-4 h-4" />
                  <span>Report Bug</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 bg-border/30" />
                <DropdownMenuItem 
                  onClick={handleSignout}
                  className="flex items-center space-x-2 cursor-pointer text-destructive m-1 rounded-full hover:bg-primary-50 transition-colors"
                >
                  <ArrowLeft01Icon className="w-4 h-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;