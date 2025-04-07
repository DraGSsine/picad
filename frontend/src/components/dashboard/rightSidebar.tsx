"use client";
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HistoryItem } from "@/types/history";
import { 
  ArrowDownToLine, 
  Clock, 
  History, 
  Trash2,
  Send
} from "lucide-react";

interface RightSidebarProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isPending: boolean;
  onSubmit: () => void;
  history: HistoryItem[];
  setHistory: (history: HistoryItem[]) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  prompt,
  setPrompt,
  isPending,
  onSubmit,
  history,
  setHistory
}) => {
  // Load history from localStorage on component mount
  useEffect(() => {
    const loadHistory = () => {
      try {
        const storedHistory = localStorage.getItem('generationHistory');
        if (storedHistory) {
          const parsedHistory = JSON.parse(storedHistory);
          setHistory(parsedHistory);
        }
      } catch (error) {
        console.error("Failed to load history from localStorage:", error);
      }
    };
    
    loadHistory();
    
    // Set up event listener for history updates
    window.addEventListener('historyUpdated', loadHistory);
    return () => window.removeEventListener('historyUpdated', loadHistory);
  }, [setHistory]);
  
  // Function to clear history from localStorage
  const clearHistory = () => {
    try {
      localStorage.removeItem('generationHistory');
      setHistory([]);
      window.dispatchEvent(new Event('historyUpdated'));
    } catch (error) {
      console.error("Failed to clear history:", error);
    }
  };
  
  // Function to handle image selection - dispatches custom event
  const handleSelectImage = (imageUrl: string) => {
    const event = new CustomEvent('imageSelected', { detail: { imageUrl } });
    window.dispatchEvent(event);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="w-80 rounded-3xl bg-white flex flex-col h-full">
      {/* Prompt Input Section */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your prompt..."
            className="pr-10"
            disabled={isPending}
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={onSubmit}
            disabled={isPending || !prompt?.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* History Section */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-purple-500" />
          <h2 className="font-medium text-gray-800">Generation History</h2>
        </div>
        {history?.length > 0 && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 rounded-full hover:bg-gray-100"
            title="Clear history"
            onClick={clearHistory}
          >
            <Trash2 className="h-4 w-4 text-gray-500" />
          </Button>
        )}
      </div>
      
      <ScrollArea className="flex-1">
        {history?.length > 0 ? (
          <div className="p-4 space-y-4">
            {history.map((item) => (
              <HistoryCard 
                key={item.id} 
                item={item} 
                onClick={() => handleSelectImage(item.imageUrl || '')}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </ScrollArea>
    </div>
  );
};

// Card component for history items
const HistoryCard = ({ 
  item, 
  onClick
}: { 
  item: HistoryItem; 
  onClick: () => void;
}) => {
  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-md hover:border-purple-200 transition-all group"
      onClick={onClick}
    >
      <div className="aspect-[9/16] relative bg-gray-50">
        <img
          src={item.imageUrl || ''}
          alt={item.prompt}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 bg-black/40 hover:bg-black/60 rounded-full"
            title="Download image"
            onClick={(e) => {
              e.stopPropagation();
              const link = document.createElement('a');
              link.href = item.imageUrl || '';
              link.download = `generated-image-${item.id}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <ArrowDownToLine className="h-3.5 w-3.5 text-white" />
          </Button>
        </div>
      </div>
      <div className="p-3 border-t border-gray-100 bg-white">
        <div className="flex items-center justify-between mb-1">
          <div className="inline-flex items-center gap-1 bg-purple-50 px-2 py-0.5 rounded-full text-xs text-purple-600 font-medium">
            <Clock className="h-3 w-3" />
            {new Date(item.timestamp).toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          {item.step && (
            <span className="text-xs text-gray-500">Step {item.step}</span>
          )}
        </div>
        {item.prompt && (
          <p className="text-xs text-gray-700 line-clamp-2 mt-1">{item.prompt}</p>
        )}
      </div>
    </Card>
  );
};

// Empty state component
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full px-4 text-center">
    <div className="bg-purple-50 p-4 rounded-full mb-3">
      <History className="h-6 w-6 text-purple-300" />
    </div>
    <p className="text-sm font-medium text-gray-600">No history yet</p>
    <p className="text-xs text-gray-400 mt-1">Generated images will appear here</p>
  </div>
);

export default RightSidebar;
