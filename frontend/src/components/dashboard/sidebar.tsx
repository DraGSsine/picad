"use client";
import React, { useState, useEffect, useCallback } from "react";
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

// Simple storage structure
interface adCreatorData {
  uploadedImages: string[]; // Array of base64 strings
  selectedTemplateUrl: string[]; // Array of template URLs
  settings: {
    creativityLevel: number;
    detailLevel: number;
    imageSize: string;
  };
}

// Template interface matching the one in templateModal.tsx
interface Template {
  id: number;
  name: string;
  category: string;
  imageUrl: string;
}

const LOCAL_STORAGE_KEY = "adCreatorData";

const Sidebar = () => {
  // UI state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Data state - simplified
  const [uploadedImages, setUploadedImages] = useState<string[]>([]); // Just the base64 strings
  const [selectedTemplateUrl, setSelectedTemplateUrl] = useState<string[]>([]); // Initialize as empty array
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null); // Template object from API
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  // Settings state
  const [creativityLevel, setCreativityLevel] = useState(50);
  const [detailLevel, setDetailLevel] = useState(50);
  const [imageSize, setImageSize] = useState("1024x1024"); // Default to square image
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Save simplified data to localStorage
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

          // Restore simple data
          setUploadedImages(parsedData.uploadedImages || []);
          setSelectedTemplateUrl(parsedData.selectedTemplateUrl);

          // Restore settings
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

  // Save data whenever it changes
  useEffect(() => {
    saveAppData();
  }, [uploadedImages, selectedTemplateUrl, creativityLevel, detailLevel, imageSize, saveAppData]);

  // When a template is selected, store its URL in the array
  const handleTemplateSelection = (template: Template) => {
    setActiveTemplate(template);
    // Set the first element of the array to the selected template URL
    setSelectedTemplateUrl([template.imageUrl]);
  };

  // When we have a selectedTemplateUrl but no activeTemplate,
  // find matching template (after template load)
  useEffect(() => {
    if (selectedTemplateUrl.length > 0 && !activeTemplate && templates.length > 0) {
      const matchingTemplate = templates.find((t) => t.imageUrl === selectedTemplateUrl[0]);
      if (matchingTemplate) {
        setActiveTemplate(matchingTemplate);
      }
    }
  }, [selectedTemplateUrl, activeTemplate, templates]);

  // Handle responsive behavior
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

  // Fetch templates from the API - optimized to avoid duplicate fetches
  useEffect(() => {
    const fetchTemplates = async () => {
      if (!isMounted) return;

      setLoadingTemplates(true);
      try {
        const response = await api.get(`/users/templates?categorie=${selectedCategory}`);
        if (response.data) {
          setTemplates(response.data);
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
      } finally {
        setLoadingTemplates(false);
      }
    };

    fetchTemplates();
  }, [selectedCategory, isMounted]);

  // Reset settings to defaults
  const resetSettings = () => {
    setCreativityLevel(50);
    setDetailLevel(50);
    setImageSize("1024x1024");
  };

  // Handle product image upload - storing just the base64
  const handleProductImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const newFiles = Array.from(event.target.files);

    // Limit to max 4 images total
    if (uploadedImages.length + newFiles.length > 4) {
      alert("You can upload a maximum of 4 images");
      return;
    }

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
    });

    // Clear the input
    event.target.value = "";
  };

  // Handle custom template upload - store just the base64
  const handleCustomTemplateUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const base64 = e.target?.result as string;

      // Store in array
      setSelectedTemplateUrl([base64]);

      // Also create a temp object for UI display
      const customTemplate: Template = {
        id: Date.now(),
        name: file.name.split(".")[0] || "Custom Template",
        category: "custom",
        imageUrl: base64,
      };

      setActiveTemplate(customTemplate);
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  // Remove an image by index
  const removeUploadedImage = (indexToRemove: number) => {
    setUploadedImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const categories = [
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
  ];

  const displayedTemplates = templates.slice(0, 3);

  const renderSidebarExpandedContent = () => (
    <div className="flex-1 custom-scrollbar rounded-3xl bg-background/80">
      <div className="p-5 space-y-8">
        {/* Upload Section - With Image Preview Grid */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-1 bg-primary rounded-full shadow-[0_0_6px_rgba(var(--primary),0.3)]"></div>
            <h3 className="text-sm font-semibold text-foreground flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 shadow-inner">
                <ImageUploadIcon className="h-5 w-5 text-primary" />
              </div>
              Product Images ({uploadedImages.length}/4)
            </h3>
          </div>

          {/* New integrated upload area with embedded thumbnails */}
          <div className="relative group cursor-pointer">
            <Card
              className="border-[1.5px] border-dashed rounded-3xl border-primary/20 overflow-hidden hover:border-primary/60 transition-colors duration-300 bg-background/60 backdrop-blur-sm shadow-md"
              onClick={() =>
                uploadedImages.length < 4 &&
                document.getElementById("productImageUpload")?.click()
              }
            >
              <div className="p-6 flex flex-col items-center relative">
                {/* Thumbnail previews for uploaded images */}
                {uploadedImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4 justify-center">
                    {uploadedImages.map((base64, index) => (
                      <div
                        key={index}
                        className="relative w-16 h-16 rounded-md overflow-hidden border border-primary/30 shadow-md group/thumb"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Image
                          src={base64}
                          alt={`Uploaded image ${index + 1}`}
                          fill
                          sizes="64px"
                          className="object-cover transition-transform duration-500 group-hover/thumb:scale-110"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeUploadedImage(index);
                          }}
                          className="absolute top-0 right-0 bg-white/90 hover:bg-destructive/20 w-5 h-5 flex items-center justify-center rounded-bl-md transition-colors duration-300"
                        >
                          <Delete02Icon className="h-3 w-3 text-destructive" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div
                  className={`flex flex-col items-center ${
                    uploadedImages.length >= 4 ? "opacity-50" : ""
                  }`}
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300">
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
                    <label className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-full transition-all duration-300 font-medium inline-block cursor-pointer hover:shadow-md hover:shadow-primary/20 hover:translate-y-[-2px]">
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

            {/* Subtle hover effect */}
            <div
              className={`absolute inset-0 bg-primary/0 ${
                uploadedImages.length < 4 ? "group-hover:bg-primary/5" : ""
              } rounded-3xl transition-colors duration-300 pointer-events-none`}
            ></div>
          </div>
        </section>

        {/* Template Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-1 bg-secondary rounded-full shadow-[0_0_6px_rgba(var(--secondary),0.3)]"></div>
            <h3 className="text-sm font-semibold text-foreground flex items-center">
              <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center mr-2 shadow-inner">
                <CustomizeIcon className="h-5 w-5 text-secondary" />
              </div>
              Template Selection
            </h3>
          </div>

          {/* Template Grid with Modern Cards */}
          <div className="grid grid-cols-2 gap-3">
            {/* Active template or upload button */}
            {selectedTemplateUrl.length > 0 ? (
              <div className="aspect-[9/16] rounded-xl overflow-hidden relative group shadow-md hover:shadow-lg transition-shadow duration-300 hover:ring-2 hover:ring-primary/40 hover:ring-offset-1">
                <Image
                  src={selectedTemplateUrl[0]} // Always use the first URL in the array
                  alt={activeTemplate?.name || "Selected template"}
                  fill
                  sizes="(max-width: 768px) 100vw, 200px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div
                    className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 cursor-pointer shadow-sm hover:bg-white hover:shadow-md transition-all hover:scale-110"
                    onClick={() => {
                      setSelectedTemplateUrl([]);
                      setActiveTemplate(null);
                    }}
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
                      <p className="text-xs text-white font-medium truncate bg-black/40 backdrop-blur-sm rounded-md px-2 py-1 shadow-inner">
                        {activeTemplate.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div
                className="aspect-[9/16] bg-background rounded-xl flex flex-col items-center justify-center cursor-pointer border border-primary/20 hover:border-primary/40 hover:shadow-lg transition-all duration-300 shadow-sm"
                onClick={() =>
                  document.getElementById("templateUpload")?.click()
                }
              >
                <div className="p-4 bg-primary/10 rounded-full shadow-sm mb-3 hover:scale-110 transition-transform duration-300 border border-primary/20">
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
              <div
                key={template.id}
                className="aspect-[9/16] rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-300 group hover:ring-2 hover:ring-primary/40 hover:ring-offset-1"
                onClick={() => handleTemplateSelection(template)}
              >
                <div className="relative h-full">
                  <Image
                    src={template.imageUrl}
                    alt={template.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 200px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="absolute bottom-3 left-3 right-3">
                      <Badge
                        variant="outline"
                        className="bg-white/90 text-foreground mb-1.5 border-transparent font-normal shadow-sm"
                      >
                        {template.category}
                      </Badge>
                      <p className="text-xs text-white font-medium truncate bg-black/40 backdrop-blur-sm rounded-md px-2 py-1 shadow-inner">
                        {template.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={() => setShowTemplateModal(true)}
            variant="outline"
            className="w-full py-3 text-sm bg-primary text-primary-foreground rounded-full border-none
              hover:shadow-md hover:bg-primary/90 transition-all font-medium group h-auto hover:translate-y-[-1px]"
          >
            Browse template gallery
            <ArrowRight01Icon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </section>

        {/* Settings Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-1 bg-primary rounded-full shadow-[0_0_6px_rgba(var(--primary),0.3)]"></div>
            <h3 className="text-sm font-semibold text-foreground flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 shadow-inner">
                <SlidersVerticalIcon className="h-5 w-5 text-primary" />
              </div>
              Settings
            </h3>
          </div>
          <Card className="border-[1.5px] border-primary/20 shadow-md rounded-3xl overflow-hidden bg-card/40 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
            <div className="space-y-6 p-6 bg-background/60">
              {/* Image Size Selector */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-3 w-3 rounded-full bg-secondary"></div>
                  <label className="text-xs font-medium text-foreground">
                    Image Size
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-2 pl-6">
                  {["1024x1024", "1536x1024", "1024x1536"].map((size) => (
                    <Button
                      key={size}
                      variant="outline"
                      size="sm"
                      className="py-1 h-auto text-xs border-primary/30 hover:bg-primary/10 hover:text-primary hover:border-primary/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary"
                      data-state={size === imageSize ? "active" : "inactive"}
                      onClick={() => setImageSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Detail Level */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-3 w-3 rounded-full bg-primary"></div>
                  <label className="text-xs font-medium text-foreground">
                    Detail Level
                  </label>
                  <div className="ml-auto bg-primary/10 rounded-full py-0.5 px-3 shadow-inner">
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
                  <div className="ml-auto bg-secondary/10 rounded-full py-0.5 px-3 shadow-inner">
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
            className="w-full py-3 h-auto text-muted-foreground border-border hover:bg-muted/50 transition-all flex items-center justify-center gap-2 rounded-full group"
          >
            <RefreshIcon className="h-3 w-3 group-hover:rotate-180 transition-transform duration-500" />
            Reset Settings
          </Button>
        </section>
      </div>
    </div>
  );

  const renderCollapsedSidebar = () => (
    <div className="flex flex-col items-center py-6 space-y-8 animate-fade-in">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsSidebarCollapsed(false)}
              size="icon"
              variant="outline"
              className="p-2.5 bg-primary rounded-full shadow-md hover:shadow-lg hover:bg-primary/90 text-primary-foreground hover:scale-110 transition-all border-primary/40"
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
              className="p-2.5 hover:bg-primary/10 rounded-full shadow-sm hover:shadow-md text-foreground/70 hover:text-primary transition-all duration-300 hover:scale-105"
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
              className="p-2.5 hover:bg-secondary/10 rounded-full shadow-sm hover:shadow-md text-foreground/70 hover:text-secondary transition-all duration-300 hover:scale-105"
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
              className="p-2.5 hover:bg-primary/10 rounded-full shadow-sm hover:shadow-md text-foreground/70 hover:text-primary transition-all duration-300 hover:scale-105"
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
  );

  return (
    <>
      <aside
        className={`bg-card/60 backdrop-blur-md rounded-3xl overflow-hidden flex flex-col transition-all duration-300 h-full ${
          isSidebarCollapsed ? "w-16" : "w-[400px]"
        } flex-shrink-0 shadow-lg z-10 border-[1.5px]`}
      >
        {/* Mobile toggle */}
        <div className="lg:hidden flex justify-end p-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 hover:bg-primary/10 rounded-full transition-all"
          >
            {isSidebarCollapsed ? (
              <ArrowRight01Icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
            ) : (
              <Cancel01Icon className="h-5 w-5 text-primary group-hover:rotate-90 transition-transform" />
            )}
          </Button>
        </div>

        {/* Render appropriate sidebar based on state */}
        {isSidebarCollapsed
          ? renderCollapsedSidebar()
          : renderSidebarExpandedContent()}
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
            setActiveTemplate={(template) => {
              setActiveTemplate(template);
              setSelectedTemplateUrl([template.imageUrl]); // Set as array with single element
              setShowTemplateModal(false);
            }}
            loading={loadingTemplates}
          />,
          document.body
        )}
    </>
  );
};

export default Sidebar;
