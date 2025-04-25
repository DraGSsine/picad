"use client";
import React, { useEffect, useState, useCallback, useMemo, memo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useImageContext, usePromptContext, useHistoryContext } from "@/contexts/DashboardContext";
import { HistoryItem } from "@/types/history";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock01Icon, Copy01Icon, Delete01Icon, Download01Icon, Message01Icon, Share01Icon, SparklesIcon } from "hugeicons-react";

// Memoized HistoryItem component to prevent re-renders
const HistoryItemComponent = memo(({ 
  item, 
  isActive, 
  onSelect 
}: { 
  item: HistoryItem; 
  isActive: boolean;
  onSelect: (url: string) => void;
}) => (
  <div
    className={cn(
      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-gray-50",
      isActive ? "bg-gray-50 ring-1 ring-primary/20" : ""
    )}
    onClick={() => onSelect(item.imageUrl || '')}
  >
    {/* Image thumbnail */}
    {item.imageUrl && (
      <div className="relative h-14 w-14 flex-shrink-0 rounded-md overflow-hidden border border-gray-200">
        <img 
          src={item.imageUrl} 
          alt={item.prompt} 
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {isActive && (
          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
      </div>
    )}
    <div className="flex-1 min-w-0">
      <p className="text-xs text-foreground/80 line-clamp-1 font-medium">{item.prompt}</p>
      <div className="flex items-center gap-2 mt-1.5">
        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock01Icon className="h-2.5 w-2.5 text-muted-foreground" />
          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
    {isActive && (
      <div className="h-2 w-2 rounded-full bg-primary ml-1"></div>
    )}
  </div>
));
HistoryItemComponent.displayName = 'HistoryItemComponent';

// Main component
const RightSidebar: React.FC = () => {
  // Split context into smaller pieces for better performance
  const { prompt, setPrompt, isGenerating, isEditing, generateImage } = usePromptContext();
  const { currentImage, setCurrentImage, setCurrentImageSize } = useImageContext();
  const { history, setHistory } = useHistoryContext();
  
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg' | 'webp'>('png');

  // Load history from localStorage using lazy loading pattern
  useEffect(() => {
    // Avoid work during initial render
    const timeoutId = setTimeout(() => {
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
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [setHistory]);

  // Clear history handler - memoized
  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem('generationHistory');
      setHistory([]);
      window.dispatchEvent(new Event('historyUpdated'));
    } catch (error) {
      console.error("Failed to clear history:", error);
    }
  }, [setHistory]);

  // Image selection handler - memoized
  const handleSelectImage = useCallback((imageUrl: string) => {
    const historyItem = history.find(item => item.imageUrl === imageUrl);
    
    setCurrentImage(imageUrl);
    
    if (historyItem?.imageSize) {
      setCurrentImageSize(historyItem.imageSize);
    }
  }, [history, setCurrentImage, setCurrentImageSize]);

  // Keyboard handler - memoized
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateImage();
    }
  }, [generateImage]);

  // Export image handler - memoized
  const exportImage = useCallback(() => {
    if (!currentImage) return;

    try {
      const link = document.createElement('a');
      link.href = currentImage;
      link.download = `export-${Date.now()}.${exportFormat}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download failed: ', err);
    }
  }, [currentImage, exportFormat]);

  // Copy to clipboard handler - memoized
  const copyImageToClipboard = useCallback(async () => {
    if (!currentImage) return;

    try {
      const response = await fetch(currentImage);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
    } catch (err) {
      console.error('Failed to copy image: ', err);
    }
  }, [currentImage]);

  // Share handler - memoized
  const shareImage = useCallback(async () => {
    if (!currentImage || !navigator.share) return;

    try {
      const response = await fetch(currentImage);
      const blob = await response.blob();
      const file = new File([blob], 'shared-image.png', { type: 'image/png' });

      await navigator.share({
        title: 'My Creation',
        text: 'Check out this image I created!',
        files: [file]
      });
    } catch (err) {
      console.error('Error sharing: ', err);
    }
  }, [currentImage]);

  // Memoized format options
  const formatOptions = useMemo(() => ['png', 'jpeg', 'webp'] as const, []);

  // Memoized computed values
  const hasCurrentImage = !!currentImage;

  return (
    <aside className="backdrop-blur-md bg-white rounded-3xl flex flex-col h-full w-full md:w-[350px] lg:w-[380px] flex-shrink-0 shadow-lg overflow-hidden z-10 border-[1.5px] border-gray-200/70 custom-scrollbar">
      <div className="flex-1 p-5 space-y-8">
        {/* Prompt Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-1 bg-primary rounded-full"></div>
            <h3 className="text-sm font-semibold text-gray-800 flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                <Message01Icon className="h-5 w-5 text-primary" />
              </div>
              Prompt
            </h3>
          </div>
          
          <div className="space-y-3">
            <textarea
              placeholder="Describe your ad in detail..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full text-sm rounded-lg py-3 px-4 min-h-[100px] bg-gray-50 
                border border-gray-200 focus:ring-1 focus:ring-primary/30 
                focus:border-primary/20 outline-none resize-none"
              disabled={isGenerating}
            />
            <Button
              onClick={generateImage}
              disabled={!prompt.trim() || isGenerating || isEditing}
              className={`w-full rounded-full bg-primary text-primary-foreground 
                hover:bg-primary/90 transition-all py-2.5 h-auto ${isGenerating || isEditing ? 'opacity-90' : ''}`}
            >
              {isGenerating ? (
                <>
                  <SparklesIcon className="mr-2 h-4 w-4 animate-pulse" />
                  Generating...
                </>
              ) : isEditing ? (
                <>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 mr-2 animate-pulse" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8-379-2.83-2.828z" />
                  </svg>
                  Editing...
                </>
              ) : currentImage ? (
                <>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 mr-2" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8-379-2.83-2.828z" />
                  </svg>
                  Apply Changes
                </>
              ) : (
                <>
                  <SparklesIcon className="mr-2 h-4 w-4" />
                  Generate Image
                </>
              )}
            </Button>
          </div>
        </section>

        {/* Export Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-1 bg-secondary rounded-full"></div>
            <h3 className="text-sm font-semibold text-gray-800 flex items-center">
              <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center mr-2">
                <Download01Icon className="h-5 w-5 text-secondary" />
              </div>
              Export
              {hasCurrentImage && (
                <Badge 
                  variant="outline" 
                  className="ml-3 bg-primary/10 text-primary border-primary/20 text-xs rounded-full"
                >
                  Ready
                </Badge>
              )}
            </h3>
          </div>
          
          <Card className="border-[1.5px] border-primary/20 shadow-md rounded-3xl overflow-hidden bg-card/40 hover:border-primary/30 transition-colors">
            <div className="space-y-3 bg-white/60 p-4">
              <div className="flex items-center">
                <span className="text-xs font-medium text-gray-700 mr-3">Format:</span>
                <div className="flex gap-1.5 flex-1">
                  {formatOptions.map((format) => (
                    <button
                      key={format}
                      onClick={() => setExportFormat(format)}
                      disabled={!hasCurrentImage}
                      className={cn(
                        "flex-1 h-7 rounded-md text-xs font-medium transition-colors",
                        exportFormat === format && hasCurrentImage
                          ? "bg-primary text-primary-foreground" 
                          : hasCurrentImage
                            ? "bg-white text-gray-700 hover:bg-primary/10 border border-gray-200"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      )}
                    >
                      <span className="uppercase">{format}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={exportImage}
                  disabled={!hasCurrentImage}
                  className={cn(
                    "flex-1 h-9 rounded-full text-sm",
                    hasCurrentImage
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  )}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Download01Icon className="h-3.5 w-3.5" />
                    <span>Download</span>
                  </div>
                </Button>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={copyImageToClipboard}
                        disabled={!hasCurrentImage}
                        variant="outline"
                        className={cn(
                          "h-9 w-9 p-0 rounded-full",
                          hasCurrentImage
                            ? "border-gray-200 hover:bg-primary/10 hover:border-primary/30 text-gray-700"
                            : "border-gray-100 text-gray-400 cursor-not-allowed"
                        )}
                      >
                        <Copy01Icon className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-gray-800 text-white border-none">
                      <p>Copy to clipboard</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={shareImage}
                          disabled={!hasCurrentImage}
                          variant="outline"
                          className={cn(
                            "h-9 w-9 p-0 rounded-full",
                            hasCurrentImage
                              ? "border-gray-200 hover:bg-primary/10 hover:border-primary/30 text-gray-700"
                              : "border-gray-100 text-gray-400 cursor-not-allowed"
                          )}
                        >
                          <Share01Icon className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-gray-800 text-white border-none">
                        <p>Share image</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          </Card>
        </section>

        {/* History Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="h-6 w-1 bg-primary rounded-full"></div>
              <h3 className="text-sm font-semibold text-gray-800 flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                  <Clock01Icon className="h-5 w-5 text-primary" />
                </div>
                History
              </h3>
            </div>
            
            {history.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearHistory}
                className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 rounded-md"
              >
                <Delete01Icon className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
          
          <Card className="border-[1.5px] border-primary/20 shadow-md rounded-3xl overflow-hidden bg-card/40 hover:border-primary/30 transition-colors">
            <div className="p-3 min-h-[100px] bg-white/60">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center space-y-2 py-5">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Clock01Icon className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">No history yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {history.map((item) => (
                    <HistoryItemComponent
                      key={item.id}
                      item={item}
                      isActive={currentImage === item.imageUrl}
                      onSelect={handleSelectImage}
                    />
                  ))}
                </div>
              )}
            </div>
          </Card>
        </section>
      </div>
    </aside>
  );
};

export default memo(RightSidebar);
