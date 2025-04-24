"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/contexts/DashboardContext";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock01Icon, Copy01Icon, Delete01Icon, Download01Icon, Message01Icon, Share01Icon, SparklesIcon, WorkHistoryIcon } from "hugeicons-react";

const RightSidebar: React.FC = () => {
  const {
    prompt,
    setPrompt,
    isGenerating,
    isEditing,
    generateImage,
    history,
    setHistory,
    setCurrentImage,
    currentImage,
    setCurrentImageSize
  } = useDashboard();

  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg' | 'webp'>('png');

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

  // Function to handle image selection
  const handleSelectImage = (imageUrl: string) => {
    // Find the history item that matches this URL to get its image size
    const historyItem:any = history.find(item => item.imageUrl === imageUrl);
    
    // Set the current image
    setCurrentImage(imageUrl);
    
    // Update the image size if available in history
    if (historyItem?.imageSize) {
      console.log(`Updating image size to ${historyItem.imageSize} from history item`);
      setCurrentImageSize(historyItem.imageSize);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateImage();
    }
  };

  // Function to export current image
  const exportImage = () => {
    if (!currentImage) return;

    try {
      // Create a visual indicator that download is starting
      const downloadStartBadge = document.createElement('div');
      downloadStartBadge.className = 'fixed bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in';
      downloadStartBadge.innerHTML = '<svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Preparing download...';
      document.body.appendChild(downloadStartBadge);

      const link = document.createElement('a');
      link.href = currentImage;
      link.download = `picad-export-${Date.now()}.${exportFormat}`;
      
      document.body.appendChild(link);
      link.click();
      
      // Success notification
      setTimeout(() => {
        document.body.removeChild(downloadStartBadge);
        const downloadDoneBadge = document.createElement('div');
        downloadDoneBadge.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in';
        downloadDoneBadge.innerHTML = '<svg class="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Download complete!';
        document.body.appendChild(downloadDoneBadge);
        
        setTimeout(() => {
          document.body.removeChild(downloadDoneBadge);
        }, 3000);
      }, 800);
      
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download failed: ', err);
      const errorBadge = document.createElement('div');
      errorBadge.className = 'fixed bottom-4 right-4 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50';
      errorBadge.innerHTML = '<svg class="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg> Download failed. Please try again.';
      document.body.appendChild(errorBadge);
      
      setTimeout(() => {
        document.body.removeChild(errorBadge);
      }, 3000);
    }
  };

  // Function to copy image to clipboard
  const copyImageToClipboard = async () => {
    if (!currentImage) return;

    try {
      // Create visual indicator that copy is in progress
      const copyStartBadge = document.createElement('div');
      copyStartBadge.className = 'fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in';
      copyStartBadge.innerHTML = '<svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Copying...';
      document.body.appendChild(copyStartBadge);

      const response = await fetch(currentImage);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);

      // Show success notification
      setTimeout(() => {
        document.body.removeChild(copyStartBadge);
        const copyDoneBadge = document.createElement('div');
        copyDoneBadge.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in';
        copyDoneBadge.innerHTML = '<svg class="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Copied to clipboard!';
        document.body.appendChild(copyDoneBadge);
        
        setTimeout(() => {
          document.body.removeChild(copyDoneBadge);
        }, 3000);
      }, 500);
    } catch (err) {
      console.error('Failed to copy image: ', err);
      // Fallback notification for browsers without clipboard API
      const errorBadge = document.createElement('div');
      errorBadge.className = 'fixed bottom-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50';
      errorBadge.innerHTML = '<svg class="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg> Your browser doesn\'t support copying. Please right-click to copy.';
      document.body.appendChild(errorBadge);
      
      setTimeout(() => {
        document.body.removeChild(errorBadge);
      }, 4000);
    }
  };

  // Function to share image
  const shareImage = async () => {
    if (!currentImage || !navigator.share) return;

    try {
      const response = await fetch(currentImage);
      const blob = await response.blob();
      const file = new File([blob], 'picad-image.png', { type: 'image/png' });

      await navigator.share({
        title: 'My PicAd Creation',
        text: 'Check out this ad I created with PicAd!',
        files: [file]
      });
    } catch (err) {
      console.error('Error sharing: ', err);
    }
  };

  // Calculate if there's a currently selected image
  const hasCurrentImage = !!currentImage;

  return (
    <aside className="bg-card/60 backdrop-blur-md rounded-3xl flex flex-col h-full w-full md:w-[350px] lg:w-[400px] flex-shrink-0 shadow-lg overflow-hidden z-10 border-[1.5px] border-primary/20">
      <div className="flex-1 px-4 sm:px-6 py-6 custom-scrollbar ">
        <div className="space-y-6 sm:space-y-8">
          {/* Prompt Section */}
          <section className="space-y-5">
            <div className="flex items-center gap-2">
              <div className="h-6 w-1 bg-primary rounded-full shadow-[0_0_6px_rgba(var(--primary),0.3)]"></div>
              <h3 className="text-sm font-semibold text-foreground flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 shadow-inner">
                  <Message01Icon className="h-4 w-4 text-primary" />
                </div>
                Prompt
              </h3>
            </div>
            
            <div className="space-y-4 border border-primary/10 shadow-md p-5 rounded-3xl bg-background/60">
              <div className="relative group">
                <textarea
                  placeholder="Describe your ad in detail..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full text-sm rounded-xl py-3 px-4 min-h-[120px] bg-card/80 
                    shadow-inner border border-primary/10 focus:ring-2 focus:ring-primary/30 
                    focus:border-primary/20 outline-none resize-none transition-all duration-300
                    focus:bg-card group-hover:border-primary/20"
                  disabled={isGenerating}
                />
                
                {/* Subtle shadow overlay for the bottom of the textarea */}
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-card/80 to-transparent pointer-events-none rounded-b-xl"></div>
              </div>
              
              <Button
                onClick={generateImage}
                disabled={!prompt.trim() || isGenerating || isEditing}
                className={`w-full rounded-xl bg-primary text-primary-foreground 
                  hover:shadow-md hover:bg-primary/90 transition-all duration-300 py-3 h-auto
                  relative overflow-hidden group ${isGenerating || isEditing ? 'opacity-90' : ''}`}
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
                      className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-500" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8-379-2.83-2.828z" />
                    </svg>
                    Apply Changes
                  </>
                ) : (
                  <>
                    <SparklesIcon className="mr-2 h-4 w-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 ease-out" />
                    Generate Image
                  </>
                )}
              </Button>
            </div>
          </section>

          {/* Export Section - Modern with no preview, fixed width */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 w-1 bg-secondary rounded-full shadow-[0_0_6px_rgba(var(--secondary),0.3)]"></div>
                <h3 className="text-sm font-semibold text-foreground flex items-center">
                  <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center mr-2 shadow-inner">
                    <Download01Icon className="h-4 w-4 text-secondary" />
                  </div>
                  Export
                </h3>
              </div>
              
              <Badge 
                variant={hasCurrentImage ? "outline" : "secondary"} 
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full whitespace-nowrap",
                  hasCurrentImage 
                    ? "bg-green-50 text-green-600 border-green-200" 
                    : "bg-muted text-muted-foreground"
                )}
              >
                {hasCurrentImage ? "Ready" : "No image"}
              </Badge>
            </div>
            
            <div className="bg-card/80 backdrop-blur-sm rounded-3xl border border-primary/10 shadow-md p-5">
              <div className="space-y-4">
                {/* Format Selection - More compact */}
                <div className="flex items-center">
                  <span className="text-xs font-medium text-foreground mr-3 min-w-[50px]">Format:</span>
                  <div className="flex gap-2 flex-1">
                    {(['png', 'jpeg', 'webp'] as const).map((format) => (
                      <button
                        key={format}
                        onClick={() => setExportFormat(format)}
                        disabled={!hasCurrentImage}
                        className={cn(
                          "flex-1 h-8 rounded-full text-xs font-medium transition-all duration-300",
                          exportFormat === format && hasCurrentImage
                            ? "bg-primary text-primary-foreground shadow-md" 
                            : hasCurrentImage
                              ? "bg-muted text-foreground hover:bg-muted/80"
                              : "bg-muted/50 text-muted-foreground cursor-not-allowed"
                        )}
                      >
                        <span className="uppercase">{format}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Action Buttons - More compact */}
                <div className="flex gap-2">
                  <Button
                    onClick={exportImage}
                    disabled={!hasCurrentImage}
                    className={cn(
                      "flex-1 h-10 rounded-xl group",
                      hasCurrentImage
                        ? "bg-primary text-primary-foreground hover:shadow-md hover:bg-primary/90"
                        : "bg-muted/50 text-muted-foreground cursor-not-allowed"
                    )}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Download01Icon className={`h-4 w-4 ${hasCurrentImage ? "group-hover:-translate-y-1 group-hover:scale-110 transition-transform duration-300" : ""}`} />
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
                            "h-10 w-10 p-0 rounded-xl flex-shrink-0 group",
                            hasCurrentImage
                              ? "border-primary/20 hover:bg-primary/10 hover:border-primary/30 hover:text-primary hover:shadow-md transition-all duration-300"
                              : "border-muted/50 text-muted-foreground cursor-not-allowed"
                          )}
                        >
                          <Copy01Icon className={`h-4 w-4 ${hasCurrentImage ? "group-hover:scale-110 transition-transform duration-300" : ""}`} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-foreground/90 text-primary-foreground border-none">
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
                              "h-10 w-10 p-0 rounded-xl flex-shrink-0 group",
                              hasCurrentImage
                                ? "border-primary/20 hover:bg-primary/10 hover:border-primary/30 hover:text-primary hover:shadow-md transition-all duration-300"
                                : "border-muted/50 text-muted-foreground cursor-not-allowed"
                            )}
                          >
                            <Share01Icon className={`h-4 w-4 ${hasCurrentImage ? "group-hover:scale-110 transition-transform duration-300" : ""}`} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="bg-foreground/90 text-primary-foreground border-none">
                          <p>Share image</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* History Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 w-1 bg-primary rounded-full shadow-[0_0_6px_rgba(var(--primary),0.3)]"></div>
                <h3 className="text-sm font-semibold text-foreground flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 shadow-inner">
                    <WorkHistoryIcon className="h-4 w-4 text-primary" />
                  </div>
                  History
                </h3>
              </div>
              
              {history.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full"
                >
                  <Delete01Icon className="h-3.5 w-3.5 mr-1" />
                  Clear
                </Button>
              )}
            </div>
            
            {history.length === 0 ? (
              <div className="border border-primary/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-3 shadow-md bg-background/60">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-2 shadow-inner">
                  <Clock01Icon className="h-8 w-8 text-primary/40" />
                </div>
                <p className="text-sm text-foreground/80 font-medium">No generation history yet</p>
                <p className="text-xs text-muted-foreground">Your generated images will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((item) => (
                  <div 
                    key={item.id} 
                    className={cn(
                      "rounded-2xl overflow-hidden cursor-pointer transition-all group hover:shadow-md flex",
                      "border hover:shadow-primary/10 relative",
                      currentImage === item.imageUrl 
                        ? "ring-2 ring-primary/40 shadow-sm border-transparent" 
                        : "border-primary/10 hover:border-primary/20"
                    )}
                    onClick={() => handleSelectImage(item.imageUrl || '')}
                  >
                    {/* Image on the left */}
                    {item.imageUrl && (
                      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden">
                        <img 
                          src={item.imageUrl} 
                          alt={item.prompt} 
                          className={`h-full w-full object-cover transition-transform duration-500 ${currentImage !== item.imageUrl ? 'group-hover:scale-110' : ''}`}
                        />
                        {currentImage === item.imageUrl && (
                          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                            <div className="h-6 w-6 rounded-full bg-card flex items-center justify-center shadow-lg">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Content on the right */}
                    <div className="p-3 bg-card flex-1 min-w-0 flex flex-col justify-between">
                      <div className="mb-1">
                        <p className="text-xs text-foreground/80 line-clamp-2 mb-1">{item.prompt}</p>
                        <div className="flex items-center justify-between mt-auto pt-1">
                          <Badge 
                            variant="outline" 
                            className="text-[10px] h-5 font-normal rounded-full flex items-center bg-background/80 border-primary/10"
                          >
                            <Clock01Icon className="h-3 w-3 mr-1 text-primary/70" />
                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Badge>
                          
                          <div className="flex space-x-1">
                            {currentImage === item.imageUrl && (
                              <Badge variant="secondary" className="text-[10px] h-5 font-normal rounded-full bg-secondary/10 border-none text-secondary">
                                Active
                              </Badge>
                            )}
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectImage(item.imageUrl || '');
                              }}
                              className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors shadow-sm group-hover:shadow-md"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
