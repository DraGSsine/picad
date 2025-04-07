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
import { api } from '@/lib/axios';

// Simple storage structure
interface adCreatorData {
  uploadedImages: string[]; // Array of base64 strings
  selectedTemplateUrl: string[]; // Array of template URLs
  settings: {
    creativityLevel: number;
    detailLevel: number;
    targetPlatform: string;
    aspectRatio: string;
  };
}


const LOCAL_STORAGE_KEY = "adCreatorData";

const Sidebar = () => {
  // UI state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Data state - simplified
  const [uploadedImages, setUploadedImages] = useState<string[]>([]); // Just the base64 strings
  const [selectedTemplateUrl, setSelectedTemplateUrl] = useState<string[]>([]); // Initialize as empty array
  const [activeTemplate, setActiveTemplate] = useState<any>(null); // Template object from API
  const [templates, setTemplates] = useState<any[]>([]); 
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  
  // Settings state
  const [creativityLevel, setCreativityLevel] = useState(50);
  const [detailLevel, setDetailLevel] = useState(50);
  const [targetPlatform, setTargetPlatform] = useState("Instagram");
  const [aspectRatio, setAspectRatio] = useState("9:16");
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
        targetPlatform,
        aspectRatio,
      }
    };
    
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appData));
    } catch (error) {
      console.error("Error saving app data to localStorage:", error);
    }
  }, [
    isMounted, uploadedImages, selectedTemplateUrl, 
    creativityLevel, detailLevel, 
    targetPlatform, aspectRatio
  ]);

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
          setTargetPlatform(settings.targetPlatform || "Instagram");
          setAspectRatio(settings.aspectRatio || "9:16");
        }
      } catch (error) {
        console.error("Error loading app data from localStorage:", error);
      }
    }
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    saveAppData();
  }, [
    uploadedImages, selectedTemplateUrl, creativityLevel, 
    detailLevel, targetPlatform, 
    aspectRatio, saveAppData
  ]);

  // When a template is selected, store its URL in the array
  const handleTemplateSelection = (template: any) => {
    setActiveTemplate(template);
    // Set the first element of the array to the selected template URL
    setSelectedTemplateUrl([template.imageUrl]);
  };

  // When we have a selectedTemplateUrl but no activeTemplate, 
  // find matching template (after template load)
  useEffect(() => {
    if (selectedTemplateUrl.length > 0 && !activeTemplate && templates.length > 0) {
      const matchingTemplate = templates.find(t => t.imageUrl === selectedTemplateUrl[0]);
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
        console.error('Error fetching templates:', error);
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
    setTargetPlatform("Instagram");
    setAspectRatio("9:16");
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
      newFiles.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const base64 = e.target?.result as string;
            resolve(base64);
          };
          reader.readAsDataURL(file);
        });
      })
    ).then(newBases64 => {
      setUploadedImages(prev => [...prev, ...newBases64]);
    });
    
    // Clear the input
    event.target.value = '';
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
      const customTemplate = {
        id: Date.now(),
        name: file.name.split(".")[0] || "Custom Template",
        category: "custom",
        imageUrl: base64,
      };
      
      setActiveTemplate(customTemplate);
    };
    
    reader.readAsDataURL(file);
    event.target.value = '';
  };
  
  // Remove an image by index
  const removeUploadedImage = (indexToRemove: number) => {
    setUploadedImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };
  
  // Clear all product images
  const clearUploadedImages = () => {
    setUploadedImages([]);
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

  const filteredTemplates = templates.filter(
    (template) =>
      (selectedCategory === "all" || template.category === selectedCategory) &&
      (searchQuery === "" ||
        template.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderSidebarExpandedContent = () => (
    <div className="flex-1 overflow-y-auto custom-scrollbar rounded-3xl">
      <div className="p-5 space-y-8">
        {/* Upload Section - With Image Preview Grid */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-1 bg-gradient-to-b from-purple-300 to-purple-600 rounded-full"></div>
            <h3 className="text-sm font-semibold text-gray-800 flex items-center">
              <ImageUploadIcon className="h-6 w-6 mr-2 text-purple-500" />
              Product Images ({uploadedImages.length}/4)
            </h3>
          </div>
          
          {/* New integrated upload area with embedded thumbnails */}
          <div className="relative group cursor-pointer">
            <Card 
              className="border-2 border-dashed border-purple-200 text-center hover:border-purple-300 transition-colors duration-300"
              onClick={() => uploadedImages.length < 4 && document.getElementById('productImageUpload')?.click()}
            >
              <div className="p-6 flex flex-col items-center relative">
                {/* Thumbnail previews for uploaded images */}
                {uploadedImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4 justify-center">
                    {uploadedImages.map((base64, index) => (
                      <div 
                        key={index} 
                        className="relative w-16 h-16 rounded-md overflow-hidden border border-purple-200 shadow-sm"
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
                            removeUploadedImage(index);
                          }}
                          className="absolute top-0 right-0 bg-white/80 hover:bg-red-50 w-5 h-5 flex items-center justify-center rounded-bl-md"
                        >
                          <Delete02Icon className="h-3 w-3 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className={`flex flex-col items-center ${uploadedImages.length >= 4 ? 'opacity-50' : ''}`}>
                  <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300">
                    <Upload01Icon className="h-5 w-5 text-purple-500" />
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 font-medium">
                    {uploadedImages.length === 0 
                      ? "Drop your product images here" 
                      : uploadedImages.length >= 4
                        ? "Maximum images reached"
                        : "Add more product images"}
                  </p>
                  
                  {uploadedImages.length < 4 && (
                    <label className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium inline-block cursor-pointer">
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
                  
                  <p className="text-xs text-gray-400 font-medium mt-3">
                    Supports PNG, JPG or WEBP (max 5MB each)
                  </p>
                </div>
              </div>
            </Card>
            
            {/* Subtle hover effect */}
            <div className={`absolute inset-0 bg-purple-100/0 ${uploadedImages.length < 4 ? 'group-hover:bg-purple-50/30' : ''} rounded-lg transition-colors duration-300 pointer-events-none`}></div>
          </div>
        </section>

        {/* Template Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-1 bg-gradient-to-b from-purple-300 to-purple-600 rounded-full"></div>
            <h3 className="text-sm font-semibold text-gray-800 flex items-center">
              <CustomizeIcon className="h-6 w-6 mr-2 text-purple-500" />
              Template Selection
            </h3>
          </div>
          
          {/* Template Grid with Modern Cards */}
          <div className="grid grid-cols-2 gap-3">
            {/* Active template or upload button */}
            {selectedTemplateUrl.length > 0 ? (
              <div className="aspect-[9/16] rounded-xl overflow-hidden relative group shadow-md hover:shadow-lg transition-shadow duration-300 hover:ring-2 hover:ring-purple-300 hover:ring-offset-1">
                <Image
                  src={selectedTemplateUrl[0]} // Always use the first URL in the array
                  alt={activeTemplate?.name || "Selected template"}
                  fill
                  sizes="(max-width: 768px) 100vw, 200px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div
                    className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 cursor-pointer shadow-sm hover:bg-white hover:shadow-md transition-all hover:scale-110"
                    onClick={() => {
                      setSelectedTemplateUrl([]);
                      setActiveTemplate(null);
                    }}
                  >
                    <Cancel01Icon className="h-3.5 w-3.5 text-red-500" />
                  </div>
                  {activeTemplate && (
                    <div className="absolute bottom-3 left-3 right-3">
                      <Badge
                        variant="outline"
                        className="bg-white/90 text-gray-800 mb-1.5 border-transparent font-normal"
                      >
                        {activeTemplate.category}
                      </Badge>
                      <p className="text-xs text-white font-medium truncate bg-black/30 rounded-md px-2 py-1">
                        {activeTemplate.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div
                className="aspect-[9/16] bg-gradient-to-br from-white to-purple-100/50 rounded-xl flex flex-col items-center justify-center cursor-pointer border border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all duration-300 hover:bg-gradient-to-br hover:from-purple-50 hover:to-purple-200/30"
                onClick={() => document.getElementById("templateUpload")?.click()}
              >
                <div className="p-4 bg-gradient-to-r from-purple-50 to-white rounded-full shadow-sm mb-3 hover:scale-110 transition-transform duration-300 border border-purple-200 group-hover:shadow-md">
                  <PlusSignIcon className="h-7 w-7 text-purple-500" />
                </div>
                <p className="text-sm text-purple-600 font-medium">
                  Custom Template
                </p>
                <p className="text-xs text-gray-400 mt-1 max-w-[80%] text-center">
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
                className="aspect-[9/16] rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-300 group hover:ring-2 hover:ring-purple-300 hover:ring-offset-1"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="absolute bottom-3 left-3 right-3">
                      <Badge
                        variant="outline"
                        className="bg-white/90 text-gray-800 mb-1.5 border-transparent font-normal"
                      >
                        {template.category}
                      </Badge>
                      <p className="text-xs text-white font-medium truncate bg-black/30 rounded-md px-2 py-1">
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
            className="w-full py-5 text-sm text-white flex items-center justify-center gap-2 
              bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl border-none
              hover:shadow-lg hover:shadow-purple-200/50 transition-all font-medium group h-auto"
          >
            Browse template gallery
            <ArrowRight01Icon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </section>

        {/* Settings Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-1 bg-gradient-to-b from-purple-300 to-purple-600 rounded-full"></div>
            <h3 className="text-sm font-semibold text-gray-800 flex items-center">
              <SlidersVerticalIcon className="h-6 w-6 mr-2 text-purple-500" />
              Settings
            </h3>
          </div>
          <Card className="hover-lift border-purple-100 overflow-hidden">
            <div className="space-y-6 p-6 bg-gradient-to-br from-white to-purple-50/30">
              {/* Target Platform */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-3 w-3 rounded-full bg-gradient-to-br from-sky-400 to-cyan-500"></div>
                  <label className="text-xs font-medium text-gray-700">
                    Target Platform
                  </label>
                </div>
                <div className="grid grid-cols-4 gap-2 pl-6">
                  {["Instagram", "Facebook", "TikTok", "General"].map((platform) => (
                    <Button
                      key={platform}
                      variant="outline"
                      size="sm"
                      className="py-1 h-auto text-xs border-purple-100 hover:bg-sky-50 hover:text-cyan-600 hover:border-cyan-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-100 data-[state=active]:to-cyan-100 data-[state=active]:text-cyan-600 data-[state=active]:border-cyan-200"
                      data-state={platform === targetPlatform ? "active" : "inactive"}
                      onClick={() => setTargetPlatform(platform)}
                    >
                      {platform}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio Selector */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-3 w-3 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500"></div>
                  <label className="text-xs font-medium text-gray-700">
                    Aspect Ratio
                  </label>
                </div>
                <div className="grid grid-cols-4 gap-2 pl-6">
                  {["1:1", "4:5", "9:16", "16:9"].map((ratio) => (
                    <Button
                      key={ratio}
                      variant="outline"
                      size="sm"
                      className="py-1 h-auto text-xs border-purple-100 hover:bg-indigo-50 hover:text-blue-600 hover:border-blue-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-100 data-[state=active]:to-blue-100 data-[state=active]:text-blue-600 data-[state=active]:border-blue-200"
                      data-state={ratio === aspectRatio ? "active" : "inactive"}
                      onClick={() => setAspectRatio(ratio)}
                    >
                      {ratio}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Text Density */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-3 w-3 rounded-full bg-gradient-to-br from-pink-400 to-rose-500"></div>
                  <label className="text-xs font-medium text-gray-700">
                    Detail Level
                  </label>
                  <div className="ml-auto bg-gradient-to-r from-pink-100 to-rose-100 rounded-full py-0.5 px-3">
                    <span className="text-xs font-medium w-6 items-center justify-center flex text-rose-600">
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
                    className="[&>.relative>.absolute]:bg-gradient-to-r [&>.relative>.absolute]:from-pink-400 [&>.relative>.absolute]:to-rose-500 [&>.relative]:bg-gradient-to-r [&>.relative]:from-pink-100 [&>.relative]:to-rose-100"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>Simple</span>
                    <span>Complex</span>
                  </div>
                </div>
              </div>

              {/* Creativity Level */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-3 w-3 rounded-full bg-gradient-to-br from-purple-400 to-fuchsia-500"></div>
                  <label className="text-xs font-medium text-gray-700">
                    Creativity Level
                  </label>
                  <div className="ml-auto bg-gradient-to-r from-purple-100 to-fuchsia-100 rounded-full py-0.5 px-3">
                    <span className="text-xs font-medium w-6 items-center justify-center flex text-purple-600">
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
                    className="[&>.relative>.absolute]:bg-gradient-to-r [&>.relative>.absolute]:from-purple-400 [&>.relative>.absolute]:to-fuchsia-500 [&>.relative]:bg-gradient-to-r [&>.relative]:from-purple-100 [&>.relative]:to-purple-200"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
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
            className="w-full py-5 h-auto text-gray-600 border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 rounded-xl"
          >
            <RefreshIcon className="h-5 w-5" />
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
              className="p-2.5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full shadow-md hover:shadow-lg hover:shadow-purple-300/30 text-white hover:scale-110 transition-all border-purple-400"
            >
              <ArrowRight01Icon className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-gray-800 text-white border-none">
            <p>Expand sidebar</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="p-2.5 hover:bg-purple-100 rounded-full shadow-sm hover:shadow-md text-gray-500 hover:text-purple-600 transition-all duration-300 hover:scale-105"
            >
              <ImageUploadIcon className="h-10 w-10" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-gray-800 text-white border-none">
            <p>Upload product image</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="p-2.5 hover:bg-purple-100 rounded-full shadow-sm hover:shadow-md text-gray-500 hover:text-purple-600 transition-all duration-300 hover:scale-105"
            >
              <CustomizeIcon className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-gray-800 text-white border-none">
            <p>Template gallery</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="p-2.5 hover:bg-purple-100 rounded-full shadow-sm hover:shadow-md text-gray-500 hover:text-purple-600 transition-all duration-300 hover:scale-105"
            >
              <SlidersVerticalIcon className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-gray-800 text-white border-none">
            <p>AI settings</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );

  return (
    <>
      <aside
        className={` bg-white rounded-3xl overflow-hidden flex flex-col transition-all duration-300 h-full ${
          isSidebarCollapsed ? "w-16" : "w-96 lg:w-[28rem]"
        } flex-shrink-0 shadow-sm backdrop-blur-sm custom-scrollbar z-10`}
      >
        {/* Mobile toggle */}
        <div className="lg:hidden flex justify-end p-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 hover:bg-purple-50 rounded-full transition-all"
          >
            {isSidebarCollapsed ? (
              <ArrowRight01Icon className="h-5 w-5 text-purple-500 group-hover:scale-110 transition-transform" />
            ) : (
              <Cancel01Icon className="h-5 w-5 text-purple-500 group-hover:rotate-90 transition-transform" />
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
