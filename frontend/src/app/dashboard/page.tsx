"use client";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import ImageCanvas from "@/components/dashboard/ImageCanvas";
import RightSidebar from "@/components/dashboard/rightSidebar";
import { HistoryItem } from "@/types/history";
import { toast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [editMode, setEditMode] = useState<"none" | "draw" | "text">("none");

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

          // Add to history
          setHistory((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              imageUrl: imageUrl,
              prompt,
              timestamp: new Date(),
            },
          ]);
        } catch (error) {
          console.error("Error processing image data:", error);
        }
      } else {
        console.error("No image data received from API");
      }

      setPrompt("");
    },
    onError: (error) => {
      console.error("Error generating image:", error);
      toast({
        variant: "destructive",
        description: "Failed to generate image. Please try again.",
      })
    },
  });

  // Update handler to actually change the edit mode
  const handleToolClick = (mode: "none" | "draw" | "text") => {
    setEditMode(mode);
  };

  const handlePromptSubmit = () => {
    if (prompt?.trim()) {
      mutate();
    }
  };

  return (
    <div className="flex flex-grow h-full">
      <div className=" flex-grow">
        <ImageCanvas
          currentImage={currentImage}
          isPending={isPending}
          editMode={editMode}
          onToolClick={handleToolClick}
        />
      </div>
      <RightSidebar
        prompt={prompt}
        setPrompt={setPrompt}
        isPending={isPending}
        onSubmit={handlePromptSubmit}
        history={history}
        setHistory={setHistory}
      />
    </div>
  );
}
