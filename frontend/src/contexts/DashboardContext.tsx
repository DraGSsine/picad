"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { HistoryItem } from "@/types/history";
import { toast } from "@/hooks/use-toast";

interface DashboardContextType {
  // Image state
  currentImage: string | null;
  setCurrentImage: (image: string | null) => void;
  
  // Canvas reference
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null> | null;
  setCanvasRef: (ref: React.MutableRefObject<HTMLCanvasElement | null>) => void;
  
  // Aspect ratio
  currentAspectRatio: string;
  setCurrentAspectRatio: (aspectRatio: string) => void;
  
  // Edit mode
  editMode: "none" | "draw" | "text";
  setEditMode: (mode: "none" | "draw" | "text") => void;
  
  // Prompt state
  prompt: string;
  setPrompt: (prompt: string) => void;
  
  // History state
  history: HistoryItem[];
  setHistory: (history: HistoryItem[]) => void;
  
  // Generation and edit loading states
  isGenerating: boolean;
  isEditing: boolean;
  isPending: boolean;
  generateImage: () => void;
  
  // Tools
  handleToolClick: (mode: "none" | "draw" | "text") => void;
  
  // Get canvas image with edits
  getCanvasImage: () => string | null;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [canvasRef, setCanvasRef] = useState<React.MutableRefObject<HTMLCanvasElement | null> | null>(null);
  const [currentAspectRatio, setCurrentAspectRatio] = useState<string>("3:2"); // Default to one of the supported ratios
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [editMode, setEditMode] = useState<"none" | "draw" | "text">("none");

  // Add separate loading state for each operation
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Function to get the current canvas image with all edits
  const getCanvasImage = (): string | null => {
    if (!canvasRef?.current) return currentImage;
    
    try {
      // Get the canvas data URL (includes all edits)
      return canvasRef.current.toDataURL('image/png');
    } catch (error) {
      console.error("Error getting canvas image:", error);
      return currentImage;
    }
  };

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
        try {
          // Set the current image
          setCurrentImage(imageUrl);
          
          // Update aspect ratio if provided by the API
          if (data.aspectRatio) {
            setCurrentAspectRatio(data.aspectRatio);
          }

          // Add to history with aspect ratio
          setHistory((prev) => {
            const newHistory = [
              ...prev,
              {
                id: Date.now().toString(),
                imageUrl: imageUrl,
                prompt,
                timestamp: new Date(),
                aspectRatio: data.aspectRatio || currentAspectRatio,
              },
            ];
            
            // Store in localStorage
            try {
              localStorage.setItem('generationHistory', JSON.stringify(newHistory));
              window.dispatchEvent(new Event('historyUpdated'));
            } catch (error) {
              console.error("Failed to save history to localStorage:", error);
            }
            
            return newHistory;
          });
        } catch (error) {
          console.error("Error processing image data:", error);
        }
      } else {
        console.error("No image data received from API");
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
      
      // Get the current canvas image (including all edits)
      const editedImage = getCanvasImage();
      
      if (!editedImage) {
        throw new Error("No image to edit");
      }
      
      // Extract base64 data from data URL (remove the "data:image/png;base64," prefix)
      const base64Data = editedImage.split(',')[1];
      
      const response = await api.post("/ai/edit", {
        prompt,
        adCreatorData,
        currentImage: base64Data, // Send just the base64 data
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.imageData) {
        const imageUrl = `data:image/png;base64,${data.imageData}`;
        try {
          // Set the current image
          setCurrentImage(imageUrl);
          
          // Update aspect ratio if provided by the API
          if (data.aspectRatio) {
            setCurrentAspectRatio(data.aspectRatio);
          }

          // Add to history with aspect ratio
          setHistory((prev) => {
            const newHistory = [
              ...prev,
              {
                id: Date.now().toString(),
                imageUrl: imageUrl,
                prompt,
                timestamp: new Date(),
                aspectRatio: data.aspectRatio || currentAspectRatio,
              },
            ];
            
            // Store in localStorage
            try {
              localStorage.setItem('generationHistory', JSON.stringify(newHistory));
              window.dispatchEvent(new Event('historyUpdated'));
            } catch (error) {
              console.error("Failed to save history to localStorage:", error);
            }
            
            return newHistory;
          });
        } catch (error) {
          console.error("Error processing image data:", error);
        }
      } else {
        console.error("No image data received from API");
      }

      setPrompt("");
      setIsEditing(false);
      // Reset edit mode after successful edit
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

  // Generate or edit image based on whether we have a current image
  const generateImage = () => {
    if (prompt?.trim()) {
      if (currentImage) {
        // If we have a current image, we're in edit mode - call the edit endpoint
        setIsEditing(true);
        editMutate();
      } else {
        // Otherwise, we're generating a new image - call the generate endpoint
        setIsGenerating(true);
        mutate();
      }
    }
  };

  const handleToolClick = (mode: "none" | "draw" | "text") => {
    setEditMode(mode);
  };

  const value = {
    currentImage,
    setCurrentImage,
    canvasRef,
    setCanvasRef,
    currentAspectRatio,
    setCurrentAspectRatio,
    editMode,
    setEditMode,
    prompt,
    setPrompt,
    history,
    setHistory,
    isGenerating,
    isEditing,
    isPending,
    generateImage,
    handleToolClick,
    getCanvasImage,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
