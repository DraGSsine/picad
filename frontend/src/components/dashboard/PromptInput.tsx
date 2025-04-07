import React from "react";
import { SentIcon } from "hugeicons-react";
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
      className="mb-1 flex items-center rounded-full overflow-hidden bg-white shadow-sm border border-gray-200"
    >
      <Input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter Additional Instructions..."
        className="w-full h-[56px] px-5 text-gray-700 focus:outline-none text-base bg-transparent border-0"
        disabled={isPending}
      />
      <Button
        type="submit"
        className={`h-full px-5 rounded-r-full ${
          isPending
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
        }`}
        disabled={isPending}
      >
        {isPending ? (
          <div className="flex items-center gap-2">
            <div className="inline-block h-4 w-4 border-2 border-t-white border-r-white border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <div>Generating...</div>
          </div>
        ) : (
          <div className="flex font-semibold text-lg items-center gap-2">
            <div>Generate</div>
            <SentIcon className="text-white min-w-[25px] min-h-[25px] fill-white rotate-45" />
          </div>
        )}
      </Button>
    </form>
  );
};

export default PromptInput;
