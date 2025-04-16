import React from "react";
import { SentIcon, SparklesIcon } from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isPending: boolean;
  onSubmit: () => void;
}

const PromptInput: React.FC<PromptInputProps> = ({ 
  prompt, 
  setPrompt, 
  isPending, 
  onSubmit 
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="mb-3 relative z-10"
    >
      <div className="group relative rounded-2xl overflow-hidden gradient-border shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
        {/* Animated background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Input and button container */}
        <div className="relative flex items-center bg-card/80 backdrop-blur-md">
          <Input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter Additional Instructions..."
            className="w-full h-[60px] px-6 text-foreground focus:outline-none text-base bg-transparent 
              border-none shadow-none rounded-none placeholder:text-muted-foreground/70"
            disabled={isPending}
          />
          
          <Button
            type="submit"
            className={`h-[60px] px-6 rounded-r-xl group/button relative overflow-hidden flex items-center gap-3 ${
              isPending
              ? "bg-muted/50 text-muted-foreground cursor-not-allowed"
              : "bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/20 text-white"
            }`}
            disabled={isPending}
          >
            {/* Shimmer effect on hover */}
            {!isPending && (
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-0 group-hover/button:opacity-100 transition-opacity duration-500 group-hover/button:animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
            )}
            
            {isPending ? (
              <div className="flex items-center gap-3 relative z-10">
                <div className="inline-block h-4 w-4 relative">
                  <div className="absolute inset-0 rounded-full border-2 border-t-primary-foreground border-r-primary-foreground border-b-transparent border-l-transparent animate-spin"></div>
                  <div className="absolute inset-1 rounded-full border-2 border-t-transparent border-r-transparent border-b-primary-foreground/70 border-l-primary-foreground/70 animate-spin animation-delay-150"></div>
                </div>
                <span className="font-medium">Generating...</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 font-medium relative z-10">
                <SparklesIcon className="text-white w-5 h-5 group-hover/button:animate-pulse" />
                <span className="text-sm md:text-base">Generate</span>
                <SentIcon className="text-white w-5 h-5 fill-white rotate-45 group-hover/button:translate-x-1 group-hover/button:-translate-y-1 transition-transform duration-300" />
              </div>
            )}
          </Button>
        </div>
      </div>
      
      {/* Subtle trailing effect at the bottom */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent rounded-b-full blur-sm"></div>
    </form>
  );
};

export default PromptInput;
