"use client";
import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  ImageUploadIcon,
  Upload01Icon,
  CustomizeIcon,
  PlusSignIcon,
  ArrowRight01Icon,
  SlidersVerticalIcon,
  RefreshIcon,
  Cancel01Icon,
  Delete02Icon,
} from "hugeicons-react";
import TemplateModal from "./templateModal";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { api } from "@/lib/axios";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

// Simple storage structure
interface adCreatorData {
  uploadedImages: string[];
  selectedTemplateUrl: string[];
  settings: {
    creativityLevel: number;
    detailLevel: number;
    imageSize: string;
  };
}

// Template interface
interface Template {
  id: number;
  name: string;
  category: string;
  imageUrl: string;
}

const LOCAL_STORAGE_KEY = "adCreatorData";

// Memoized image thumbnail component to prevent re-renders
const ImageThumbnail = memo(({ 
  base64, 
  index, 
  onRemove 
}: { 
  base64: string; 
  index: number; 
  onRemove: (index: number) => void 
}) => (
  <div
    className="relative w-16 h-16 rounded-md overflow-hidden border border-primary/30 shadow-md group/thumb"
    onClick={(e) => e.stopPropagation()}
  >
    <Image
      src={base64}
      alt={`Uploaded image ${index + 1}`}
      fill
      sizes="64px"
      className="object-cover"
    />
    <button
      onClick={(e) => {
        e.stopPropagation();
        onRemove(index);
      }}
      className="absolute top-0 right-0 bg-white/90 hover:bg-destructive/20 w-5 h-5 flex items-center justify-center rounded-bl-md transition-colors"
    >
      <Delete02Icon className="h-3 w-3 text-destructive" />
    </button>
  </div>
));
ImageThumbnail.displayName = 'ImageThumbnail';

// Placeholder thumbnail for loading state
const LoadingThumbnail = () => (
  <div
    className="relative w-16 h-16 rounded-md overflow-hidden border border-primary/30 shadow-md bg-muted/30 animate-pulse"
    onClick={(e) => e.stopPropagation()}
  >
    <div className="absolute inset-0 flex items-center justify-center">
      <RefreshIcon className="h-5 w-5 text-primary/50 animate-spin" />
    </div>
  </div>
);

// Memoized template card component
const TemplateCard = memo(({ 
  template, 
  onClick 
}: { 
  template: Template; 
  onClick: (template: Template) => void 
}) => (
  <div
    className="aspect-[9/16] rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-100 group"
    onClick={() => onClick(template)}
  >
    <div className="relative h-full">
      <Image
        src={template.imageUrl}
        alt={template.name}
        fill
        sizes="(max-width: 768px) 100vw, 200px"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-3 left-3 right-3">
          <Badge
            variant="outline"
            className="bg-white/90 text-foreground mb-1.5 border-transparent font-normal shadow-sm"
          >
            {template.category}
          </Badge>
          <p className="text-xs text-white font-medium truncate bg-black/40 rounded-md px-2 py-1 shadow-inner">
            {template.name}
          </p>
        </div>
      </div>
    </div>
  </div>
));
TemplateCard.displayName = 'TemplateCard';

// Main sidebar component
const Sidebar = () => {
  // UI state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Data state
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedTemplateUrl, setSelectedTemplateUrl] = useState<string[]>([]);
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  // Settings state
  const [creativityLevel, setCreativityLevel] = useState(0);
  const [detailLevel, setDetailLevel] = useState(50);
  const [imageSize, setImageSize] = useState("1024x1536");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Save data to localStorage - memoized to prevent unnecessary function recreation
  const saveAppData = useCallback(() => {
    if (!isMounted) return;

    const appData: adCreatorData = {
      uploadedImages,
      selectedTemplateUrl,
      settings: {
        creativityLevel,
        detailLevel,
        imageSize,
      },
    };

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appData));
    } catch (error) {
      console.error("Error saving app data to localStorage:", error);
    }
  }, [isMounted, uploadedImages, selectedTemplateUrl, creativityLevel, detailLevel, imageSize]);

  // Load data from localStorage on mount
  useEffect(() => {
    setIsMounted(true);

    if (typeof window !== "undefined") {
      try {
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedData) {
          const parsedData = JSON.parse(savedData) as adCreatorData;
          setUploadedImages(parsedData.uploadedImages || []);
          setSelectedTemplateUrl(parsedData.selectedTemplateUrl || []);
          
          const settings = parsedData.settings || {};
          setCreativityLevel(settings.creativityLevel || 50);
          setDetailLevel(settings.detailLevel || 50);
          setImageSize(settings.imageSize || "1024x1024");
        }
      } catch (error) {
        console.error("Error loading app data from localStorage:", error);
      }
    }
  }, []);

  // Save data when state changes - throttled to avoid performance issues
  useEffect(() => {
    // Debounce saving to localStorage
    const timeoutId = setTimeout(() => {
      saveAppData();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [uploadedImages, selectedTemplateUrl, creativityLevel, detailLevel, imageSize, saveAppData]);

  // Template selection handler - memoized - UPDATED to store URL and let backend handle it
  const handleTemplateSelection = useCallback(async (template: Template) => {
    try {
      // Check if the image is already base64
      const isBase64 = template.imageUrl.startsWith('data:');

      if (isBase64) {
        // Already base64, store as is
        setSelectedTemplateUrl([template.imageUrl]);
        setActiveTemplate(template);
        return;
      }

      // Store the URL directly and let the backend handle fetching the image
      setSelectedTemplateUrl([template.imageUrl]);
      setActiveTemplate(template);
    } catch (error) {
      console.error("Failed to process template image:", error);
      // Fallback to using URL directly
      setSelectedTemplateUrl([template.imageUrl]);
      setActiveTemplate(template);
    }
  }, []);

  // Match template when loaded
  useEffect(() => {
    if (selectedTemplateUrl.length > 0 && !activeTemplate && templates.length > 0) {
      const matchingTemplate = templates.find((t) => t.imageUrl === selectedTemplateUrl[0]);
      if (matchingTemplate) {
        setActiveTemplate(matchingTemplate);
      }
    }
  }, [selectedTemplateUrl, activeTemplate, templates]);

  // Handle responsive behavior - optimized to run less frequently
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setIsSidebarCollapsed(window.innerWidth < 768);
      }
    };

    handleResize();

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Fetch templates - optimized to reduce unnecessary API calls
  useEffect(() => {
    let isCancelled = false;
    
    const fetchTemplates = async () => {
      if (!isMounted) return;

      setLoadingTemplates(true);
      try {
        const response = await api.get(`/users/templates?categorie=${selectedCategory}`);
        if (!isCancelled && response.data) {
          setTemplates(response.data);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Error fetching templates:", error);
        }
      } finally {
        if (!isCancelled) {
          setLoadingTemplates(false);
        }
      }
    };

    fetchTemplates();
    
    return () => {
      isCancelled = true;
    };
  }, [selectedCategory, isMounted]);

  // Reset settings - memoized
  const resetSettings = useCallback(() => {
    setCreativityLevel(10);
    setDetailLevel(50);
    setImageSize("1024x1536");
  }, []);

  // Image upload handler - memoized
  const handleProductImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const newFiles = Array.from(event.target.files);

    // Limit to max 4 images total
    if (uploadedImages.length + newFiles.length > 4) {
      alert("You can upload a maximum of 4 images");
      return;
    }

    setUploadingImages(true);

    // Process each file to get base64
    Promise.all(
      newFiles.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const base64 = e.target?.result as string;
            resolve(base64);
          };
          reader.readAsDataURL(file);
        });
      })
    ).then((newBases64) => {
      setUploadedImages((prev) => [...prev, ...newBases64]);
      setUploadingImages(false);
    });

    // Clear the input
    event.target.value = "";
  }, [uploadedImages]);

  // Custom template upload handler - memoized
  const handleCustomTemplateUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setSelectedTemplateUrl([base64]); // Store the base64 data directly

      const customTemplate: Template = {
        id: Date.now(),
        name: file.name.split(".")[0] || "Custom Template",
        category: "custom",
        imageUrl: base64, // For display purposes
      };

      setActiveTemplate(customTemplate);
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  }, []);

  // Remove image handler - memoized
  const removeUploadedImage = useCallback((indexToRemove: number) => {
    setUploadedImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  }, []);

  // Memoized categories array
  const categories = useMemo(() => [
    "all",
    "lifestyle",
    "product",
    "fashion",
    "food",
    "tech",
    "beauty",
    "sports",
    "travel",
    "accessories",
    "shoes",
  ], []);

  // Limited displayed templates for performance
  const displayedTemplates = useMemo(() => 
    templates.slice(0, 3), 
    [templates]
  );

  // Toggle sidebar collapse handler - memoized
  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prev => !prev);
  }, []);

  // Template modal open handler - memoized
  const openTemplateModal = useCallback(() => {
    setShowTemplateModal(true);
  }, []);

  // Process template selection from modal - UPDATED for consistent base64 handling
  const handleTemplateModalSelection = useCallback(async (template: Template) => {
    try {
      // Always fetch the image and convert to base64, whether it's a URL or already base64
      const isBase64 = template.imageUrl.startsWith('data:');
      
      if (isBase64) {
        // Already base64, use as is
        setSelectedTemplateUrl([template.imageUrl]);
        setActiveTemplate(template);
        setShowTemplateModal(false);
        return;
      }
      
      // Fetch the image and convert to base64
      const response = await fetch(template.imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }
      
      const blob = await response.blob();
      
      return new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = reader.result as string;
          setSelectedTemplateUrl([base64Data]);
          setActiveTemplate(template);
          setShowTemplateModal(false);
          resolve();
        };
        reader.onerror = () => {
          console.error("Error converting image to base64");
          // Fallback to URL but with warning
          setSelectedTemplateUrl([template.imageUrl]);
          setActiveTemplate(template);
          setShowTemplateModal(false);
          resolve();
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Failed to process template image:", error);
      // Fallback to using URL directly
      setSelectedTemplateUrl([template.imageUrl]);
      setActiveTemplate(template);
      setShowTemplateModal(false);
    }
  }, []);

  // Clear template selection - memoized
  const clearTemplateSelection = useCallback(() => {
    setSelectedTemplateUrl([]);
    setActiveTemplate(null);
  }, []);

  // Memoized sidebar expanded content to prevent re-renders
  const sidebarExpandedContent = useMemo(() => (
    <div className="flex-1 custom-scrollbar rounded-3xl">
      <div className="p-5 space-y-8">
        {/* Upload Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-1 bg-primary rounded-full"></div>
            <h3 className="text-sm font-semibold text-foreground flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                <ImageUploadIcon className="h-5 w-5 text-primary" />
              </div>
              Product Images ({uploadedImages.length}/4)
            </h3>
          </div>

          {/* Upload area with thumbnails */}
          <div className="relative group cursor-pointer">
            <Card
              className="border-[1.5px] border-dashed rounded-3xl border-primary/20 overflow-hidden hover:border-primary/60 transition-colors bg-background/60 shadow-md"
              onClick={() =>
                uploadedImages.length < 4 &&
                document.getElementById("productImageUpload")?.click()
              }
            >
              <div className="p-6 flex flex-col items-center relative">
                {/* Thumbnail previews */}
                {uploadedImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4 justify-center">
                    {uploadedImages.map((base64, index) => (
                      <ImageThumbnail 
                        key={index}
                        base64={base64}
                        index={index}
                        onRemove={removeUploadedImage}
                      />
                    ))}
                    {uploadingImages && <LoadingThumbnail />}
                  </div>
                )}

                <div
                  className={`flex flex-col items-center ${
                    uploadedImages.length >= 4 ? "opacity-50" : ""
                  }`}
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Upload01Icon className="h-5 w-5 text-primary" />
                  </div>

                  <p className="text-sm text-foreground/90 mb-4 font-medium">
                    {uploadedImages.length === 0
                      ? "Drop your product images here"
                      : uploadedImages.length >= 4
                      ? "Maximum images reached"
                      : "Add more product images"}
                  </p>

                  {uploadedImages.length < 4 && (
                    <label className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-full transition-all font-medium inline-block cursor-pointer hover:shadow-md">
                      Browse Files
                      <input
                        id="productImageUpload"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleProductImageUpload}
                      />
                    </label>
                  )}

                  <p className="text-xs text-muted-foreground font-medium mt-3">
                    Supports PNG, JPG or WEBP (max 5MB each)
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Template Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-1 bg-secondary rounded-full"></div>
            <h3 className="text-sm font-semibold text-foreground flex items-center">
              <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center mr-2">
                <CustomizeIcon className="h-5 w-5 text-secondary" />
              </div>
              Template Selection
            </h3>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Active template or upload button */}
            {selectedTemplateUrl.length > 0 ? (
              <div className="aspect-[9/16] rounded-xl overflow-hidden relative group shadow-md">
                <Image
                  src={selectedTemplateUrl[0]}
                  alt={activeTemplate?.name || "Selected template"}
                  fill
                  sizes="(max-width: 768px) 100vw, 200px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div
                    className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 cursor-pointer shadow-sm hover:bg-white"
                    onClick={clearTemplateSelection}
                  >
                    <Cancel01Icon className="h-3.5 w-3.5 text-destructive" />
                  </div>
                  {activeTemplate && (
                    <div className="absolute bottom-3 left-3 right-3">
                      <Badge
                        variant="outline"
                        className="bg-white/90 text-foreground mb-1.5 border-transparent font-normal shadow-sm"
                      >
                        {activeTemplate.category}
                      </Badge>
                      <p className="text-xs text-white font-medium truncate bg-black/40 rounded-md px-2 py-1 shadow-inner">
                        {activeTemplate.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div
                className="aspect-[9/16] bg-background rounded-xl flex flex-col items-center justify-center cursor-pointer border border-primary/20 hover:border-primary/40 transition-all shadow-sm"
                onClick={() =>
                  document.getElementById("templateUpload")?.click()
                }
              >
                <div className="p-4 bg-primary/10 rounded-full shadow-sm mb-3 border border-primary/20">
                  <PlusSignIcon className="h-7 w-7 text-primary" />
                </div>
                <p className="text-sm text-primary font-medium">
                  Custom Template
                </p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[80%] text-center">
                  Upload your own template design
                </p>
                <input
                  type="file"
                  id="templateUpload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCustomTemplateUpload}
                />
              </div>
            )}

            {/* Display templates */}
            {displayedTemplates.map((template) => (
              <TemplateCard 
                key={template.id} 
                template={template}
                onClick={handleTemplateSelection}
              />
            ))}
          </div>

          <Button
            onClick={openTemplateModal}
            variant="outline"
            className="w-full py-3 text-sm bg-primary text-primary-foreground rounded-full border-none
              hover:shadow-md hover:bg-primary/90 transition-all font-medium h-auto"
          >
            Browse template gallery
            <ArrowRight01Icon className="h-4 w-4 ml-2" />
          </Button>
        </section>

        {/* Settings Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-1 bg-primary rounded-full"></div>
            <h3 className="text-sm font-semibold text-foreground flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                <SlidersVerticalIcon className="h-5 w-5 text-primary" />
              </div>
              Settings
            </h3>
          </div>
          <Card className="border-[1.5px] border-primary/20 shadow-md rounded-3xl overflow-hidden bg-card/40 hover:border-primary/30 transition-colors">
            <div className="space-y-6 p-6 bg-background/60">
              {/* Image Size Selector */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-3 w-3 rounded-full bg-secondary"></div>
                  <label className="text-xs font-medium text-foreground">
                    Image Size
                  </label>
                </div>
                <div className="pl-6">
                  <Select value={imageSize} onValueChange={setImageSize}>
                    <SelectTrigger className="w-full max-w-xs bg-background border border-primary/30 rounded-md focus:ring-1 focus:ring-primary">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          {imageSize === "1024x1024" && (
                            <>
                              <div className="w-6 h-6 bg-primary/20 border border-primary rounded-[4px] mr-2" />
                              <span>1:1 (Square)</span>
                            </>
                          )}
                          {imageSize === "1536x1024" && (
                            <>
                              <div className="w-9 h-5 bg-primary/20 border border-primary rounded-[4px] mr-2" />
                              <span>3:2 (Landscape)</span>
                            </>
                          )}
                          {imageSize === "1024x1536" && (
                            <>
                              <div className="w-5 h-9 bg-primary/20 border border-primary rounded-[4px] mr-2" />
                              <span>2:3 (Portrait)</span>
                            </>
                          )}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1024x1024">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center" style={{ width: 36, height: 36 }}>
                            <div className="w-6 h-6 bg-primary/20 border border-primary rounded-[4px]" />
                          </div>
                          <span>1:1 (Square)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="1536x1024">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center" style={{ width: 36, height: 36 }}>
                            <div className="w-9 h-5 bg-primary/20 border border-primary rounded-[4px]" />
                          </div>
                          <span>3:2 (Landscape)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="1024x1536">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center" style={{ width: 36, height: 36 }}>
                            <div className="w-5 h-9 bg-primary/20 border border-primary rounded-[4px]" />
                          </div>
                          <span>2:3 (Portrait)</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Detail Level */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-3 w-3 rounded-full bg-primary"></div>
                  <label className="text-xs font-medium text-foreground">
                    Detail Level
                  </label>
                  <div className="ml-auto bg-primary/10 rounded-full py-0.5 px-3">
                    <span className="text-xs font-medium w-6 items-center justify-center flex text-primary">
                      {detailLevel}%
                    </span>
                  </div>
                </div>
                <div className="pl-6 py-2">
                  <Slider
                    value={[detailLevel]}
                    onValueChange={(value) => setDetailLevel(value[0])}
                    min={0}
                    max={100}
                    step={1}
                    className="[&>.relative>.absolute]:bg-primary [&>.relative]:bg-primary/10"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Simple</span>
                    <span>Complex</span>
                  </div>
                </div>
              </div>

              {/* Creativity Level */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-3 w-3 rounded-full bg-secondary"></div>
                  <label className="text-xs font-medium text-foreground">
                    Creativity Level
                  </label>
                  <div className="ml-auto bg-secondary/10 rounded-full py-0.5 px-3">
                    <span className="text-xs font-medium w-6 items-center justify-center flex text-secondary">
                      {creativityLevel}%
                    </span>
                  </div>
                </div>
                <div className="pl-6 py-2">
                  <Slider
                    value={[creativityLevel]}
                    onValueChange={(value) => setCreativityLevel(value[0])}
                    min={0}
                    max={100}
                    step={1}
                    className="[&>.relative>.absolute]:bg-secondary [&>.relative]:bg-secondary/10"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Stay on Concept</span>
                    <span>Explore New Ideas</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Button
            variant="outline"
            onClick={resetSettings}
            className="w-full py-3 h-auto text-muted-foreground border-border hover:bg-muted/50 transition-all flex items-center justify-center gap-2 rounded-full"
          >
            <RefreshIcon className="h-3 w-3" />
            Reset Settings
          </Button>
        </section>
      </div>
    </div>
  ), [
    uploadedImages, removeUploadedImage, uploadingImages, selectedTemplateUrl, activeTemplate, 
    displayedTemplates, handleTemplateSelection, openTemplateModal, clearTemplateSelection,
    imageSize, detailLevel, creativityLevel, handleProductImageUpload, handleCustomTemplateUpload,
    resetSettings
  ]);

  // Memoized collapsed sidebar content
  const collapsedSidebarContent = useMemo(() => (
    <div className="flex flex-col items-center py-6 space-y-8">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsSidebarCollapsed(false)}
              size="icon"
              variant="outline"
              className="p-2.5 bg-primary rounded-full shadow-md hover:shadow-lg hover:bg-primary/90 text-primary-foreground border-primary/40"
            >
              <ArrowRight01Icon className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="bg-foreground/90 text-primary-foreground border-none shadow-lg"
          >
            <p>Expand sidebar</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="p-2.5 hover:bg-primary/10 rounded-full shadow-sm hover:shadow-md text-foreground/70 hover:text-primary"
            >
              <ImageUploadIcon className="h-10 w-10" />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="bg-foreground/90 text-primary-foreground border-none shadow-lg"
          >
            <p>Upload product image</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="p-2.5 hover:bg-secondary/10 rounded-full shadow-sm hover:shadow-md text-foreground/70 hover:text-secondary"
            >
              <CustomizeIcon className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="bg-foreground/90 text-primary-foreground border-none shadow-lg"
          >
            <p>Template gallery</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="p-2.5 hover:bg-primary/10 rounded-full shadow-sm hover:shadow-md text-foreground/70 hover:text-primary"
            >
              <SlidersVerticalIcon className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="bg-foreground/90 text-primary-foreground border-none shadow-lg"
          >
            <p>AI settings</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  ), []);

  return (
    <>
      <aside
        className={`backdrop-blur-md bg-white rounded-3xl overflow-hidden flex flex-col h-full ${
          isSidebarCollapsed ? "w-16" : "w-[400px]"
        } flex-shrink-0 shadow-lg z-10 border-[1.5px]`}
      >
        {/* Mobile toggle */}
        <div className="lg:hidden flex justify-end p-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleSidebar}
            className="p-2 hover:bg-primary/10 rounded-full"
          >
            {isSidebarCollapsed ? (
              <ArrowRight01Icon className="h-5 w-5 text-primary" />
            ) : (
              <Cancel01Icon className="h-5 w-5 text-primary" />
            )}
          </Button>
        </div>

        {/* Render appropriate sidebar content based on state */}
        {isSidebarCollapsed ? collapsedSidebarContent : sidebarExpandedContent}
      </aside>

      {/* Template modal */}
      {isMounted &&
        showTemplateModal &&
        createPortal(
          <TemplateModal
            isOpen={showTemplateModal}
            onClose={() => setShowTemplateModal(false)}
            categories={categories}
            templates={templates}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            setActiveTemplate={handleTemplateModalSelection}
            loading={loadingTemplates}
          />,
          document.body
        )}
    </>
  );
};

// Memoize the entire component to prevent unnecessary re-renders
export default memo(Sidebar);
