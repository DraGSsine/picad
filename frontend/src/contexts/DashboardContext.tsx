"use client";
import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { HistoryItem } from "@/types/history";
import { toast } from "@/hooks/use-toast";

// Split context into smaller, more focused contexts
interface ImageContextType {
  currentImage: string | null;
  setCurrentImage: (image: string | null) => void;
  currentImageSize: string;
  setCurrentImageSize: (imageSize: string) => void;
  getCanvasImage: () => string | null;
  getEditMaskImage: () => string | null; // New function to get only the edit mask
  originalImage: string | null; // Store the original image separately
  setOriginalImage: (image: string | null) => void;
}

interface CanvasContextType {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null> | null;
  setCanvasRef: (ref: React.MutableRefObject<HTMLCanvasElement | null>) => void;
  editMode: "none" | "draw" | "text";
  setEditMode: (mode: "none" | "draw" | "text") => void;
  handleToolClick: (mode: "none" | "draw" | "text") => void;
}

interface PromptContextType {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  isEditing: boolean;
  isPending: boolean;
  generateImage: () => void;
}

interface HistoryContextType {
  history: HistoryItem[];
  setHistory: (history: HistoryItem[]) => void;
}

// Combined context for backward compatibility
interface DashboardContextType extends ImageContextType, CanvasContextType, PromptContextType, HistoryContextType {}

// Create each context
const ImageContext = createContext<ImageContextType | undefined>(undefined);
const CanvasContext = createContext<CanvasContextType | undefined>(undefined);
const PromptContext = createContext<PromptContextType | undefined>(undefined);
const HistoryContext = createContext<HistoryContextType | undefined>(undefined);
const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// Custom hooks for each context
export const useImageContext = () => {
  const context = useContext(ImageContext);
  if (!context) throw new Error("useImageContext must be used within ImageProvider");
  return context;
};

export const useCanvasContext = () => {
  const context = useContext(CanvasContext);
  if (!context) throw new Error("useCanvasContext must be used within CanvasProvider");
  return context;
};

export const usePromptContext = () => {
  const context = useContext(PromptContext);
  if (!context) throw new Error("usePromptContext must be used within PromptProvider");
  return context;
};

export const useHistoryContext = () => {
  const context = useContext(HistoryContext);
  if (!context) throw new Error("useHistoryContext must be used within HistoryProvider");
  return context;
};

// For backward compatibility
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useDashboard must be used within a DashboardProvider");
  return context;
};

// Local storage helpers
const saveHistoryToLocalStorage = (history: HistoryItem[]) => {
  try {
    localStorage.setItem('generationHistory', JSON.stringify(history));
    window.dispatchEvent(new Event('historyUpdated'));
  } catch (error) {
    console.error("Failed to save history to localStorage:", error);
  }
};

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Image state
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentImageSize, setCurrentImageSize] = useState<string>("1024x1024");
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  
  // Canvas state
  const [canvasRef, setCanvasRef] = useState<React.MutableRefObject<HTMLCanvasElement | null> | null>(null);
  const [editMode, setEditMode] = useState<"none" | "draw" | "text">("none");
  
  // Prompt state
  const [prompt, setPrompt] = useState("Integrate my product into this template");
  
  // History state with lazy initial state
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    // Lazy load from localStorage only on initial mount
    if (typeof window !== 'undefined') {
      try {
        const storedHistory = localStorage.getItem('generationHistory');
        if (storedHistory) return JSON.parse(storedHistory);
      } catch (error) {
        console.error("Failed to load history from localStorage:", error);
      }
    }
    return [];
  });
  
  // Loading states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Memoized functions to prevent unnecessary re-renders
  const getCanvasImage = useCallback((): string | null => {
    if (!canvasRef?.current) return currentImage;
    
    try {
      return canvasRef.current.toDataURL('image/png');
    } catch (error) {
      console.error("Error getting canvas image:", error);
      return currentImage;
    }
  }, [canvasRef, currentImage]);

  const getEditMaskImage = useCallback((): string | null => {
    if (!canvasRef?.current) return null;

    try {
      // Logic to extract only the edit mask from the canvas
      return canvasRef.current.toDataURL('image/png');
    } catch (error) {
      console.error("Error getting edit mask image:", error);
      return null;
    }
  }, [canvasRef]);

  // API mutations with useCallback to prevent unnecessary recreation
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const adCreatorData = JSON.parse(
        localStorage.getItem("adCreatorData") || "{}"
      );
      const response = await api.post("/ai/generate", {
        prompt,
        adCreatorData,
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.imageData) {
        const imageUrl = `data:image/png;base64,${data.imageData}`;
        
        // Update state
        setCurrentImage(imageUrl);
        
        if (data.imageSize) {
          setCurrentImageSize(data.imageSize);
        }

        // Update history
        const newHistoryItem = {
          id: Date.now().toString(),
          imageUrl: imageUrl,
          prompt,
          timestamp: new Date(),
          imageSize: data.imageSize || currentImageSize,
        };
        
        setHistory(prev => {
          const newHistory = [...prev, newHistoryItem];
          saveHistoryToLocalStorage(newHistory);
          return newHistory;
        });
      }

      setPrompt("");
      setIsGenerating(false);
    },
    onError: (error) => {
      console.error("Error generating image:", error);
      toast({
        variant: "destructive",
        description: "Failed to generate image. Please try again.",
      });
      setIsGenerating(false);
    },
  });

  const { mutate: editMutate } = useMutation({
    mutationFn: async () => {
      const adCreatorData = JSON.parse(
        localStorage.getItem("adCreatorData") || "{}"
      );
      
      // Get the original image and the canvas with edits
      const originalImg = originalImage || currentImage;
      const editMaskImg = getEditMaskImage();
      
      if (!originalImg || !editMaskImg) {
        throw new Error("Missing image data for editing");
      }
      
      // Send both the original image and the edit mask to the API
      const response = await api.post("/ai/edit", {
        prompt,
        adCreatorData,
        currentImage: originalImg,
        canvasEditData: editMaskImg,
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.imageData) {
        const imageUrl = `data:image/png;base64,${data.imageData}`;
        
        // Update both the current and original image with the result
        setCurrentImage(imageUrl);
        setOriginalImage(imageUrl);
        
        if (data.imageSize) {
          setCurrentImageSize(data.imageSize);
        }

        const newHistoryItem = {
          id: Date.now().toString(),
          imageUrl: imageUrl,
          prompt,
          timestamp: new Date(),
          imageSize: data.imageSize || currentImageSize,
        };
        
        setHistory(prev => {
          const newHistory = [...prev, newHistoryItem];
          saveHistoryToLocalStorage(newHistory);
          return newHistory;
        });
      }

      setPrompt("");
      setIsEditing(false);
      setEditMode("none");
    },
    onError: (error) => {
      console.error("Error editing image:", error);
      toast({
        variant: "destructive",
        description: "Failed to edit image. Please try again.",
      });
      setIsEditing(false);
    },
  });

  // Callbacks for actions to prevent unnecessary re-renders
  const generateImage = useCallback(() => {
    if (prompt?.trim()) {
      if (currentImage) {
        setIsEditing(true);
        editMutate();
      } else {
        setIsGenerating(true);
        mutate();
      }
    }
  }, [prompt, currentImage, editMutate, mutate]);

  const handleToolClick = useCallback((mode: "none" | "draw" | "text") => {
    setEditMode(mode);
  }, []);

  // Memoize context values to prevent unnecessary re-renders
  const imageContextValue = useMemo(() => ({
    currentImage,
    setCurrentImage,
    currentImageSize,
    setCurrentImageSize,
    getCanvasImage,
    getEditMaskImage,
    originalImage,
    setOriginalImage
  }), [currentImage, currentImageSize, getCanvasImage, getEditMaskImage, originalImage]);

  const canvasContextValue = useMemo(() => ({
    canvasRef,
    setCanvasRef,
    editMode,
    setEditMode,
    handleToolClick
  }), [canvasRef, editMode, handleToolClick]);

  const promptContextValue = useMemo(() => ({
    prompt,
    setPrompt,
    isGenerating,
    isEditing,
    isPending,
    generateImage
  }), [prompt, isGenerating, isEditing, isPending, generateImage]);

  const historyContextValue = useMemo(() => ({
    history,
    setHistory
  }), [history]);

  // Combined context for backward compatibility
  const dashboardContextValue = useMemo(() => ({
    ...imageContextValue,
    ...canvasContextValue,
    ...promptContextValue,
    ...historyContextValue
  }), [imageContextValue, canvasContextValue, promptContextValue, historyContextValue]);

  return (
    <ImageContext.Provider value={imageContextValue}>
      <CanvasContext.Provider value={canvasContextValue}>
        <PromptContext.Provider value={promptContextValue}>
          <HistoryContext.Provider value={historyContextValue}>
            <DashboardContext.Provider value={dashboardContextValue}>
              {children}
            </DashboardContext.Provider>
          </HistoryContext.Provider>
        </PromptContext.Provider>
      </CanvasContext.Provider>
    </ImageContext.Provider>
  );
};
