"use client";
import React, { useRef, useState, useEffect } from "react";
import { Canvas, FabricImage, IText, PencilBrush } from "fabric";
import { useDashboard } from "@/contexts/DashboardContext";
import VerticalToolbar from "@/components/dashboard/VerticalToolbar";
import { Loading03Icon, Image01Icon } from "hugeicons-react"; // Import icons for loading and no image states

const ImageCanvas: React.FC = () => {
  const { 
    currentImage, 
    isPending, 
    editMode, 
    handleToolClick,
    currentAspectRatio,
    setCurrentAspectRatio,
    setCanvasRef
  } = useDashboard();
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null); // Store Fabric canvas reference
  const containerRef = useRef<HTMLDivElement>(null);
  const [originalImage, setOriginalImage] = useState<FabricImage | null>(null);

  // Toolbar states
  const [drawingColor, setDrawingColor] = useState<string>("#000000");
  const [lineWidth, setLineWidth] = useState<number>(3);
  const [textColor, setTextColor] = useState<string>("#000000");
  const [textSize, setTextSize] = useState<number>(24);

  // Pass canvas ref to context
  useEffect(() => {
    setCanvasRef(canvasRef);
  }, [setCanvasRef]);

  // Calculate dimensions based on viewport units with respect to aspect ratio
  const getCanvasDimensions = () => {
    if (!containerRef.current) return { width: 400, height: 400 }; // Default to 1:1 if container not available

    // Parse the aspect ratio (e.g., "9:16" or "1:1")
    const [widthRatio, heightRatio] = currentAspectRatio.split(":").map(Number);
    const aspectRatioValue = widthRatio / heightRatio;

    // Get container dimensions
    const containerWidth = containerRef.current.clientWidth - 100; // Leave space for toolbar
    const containerHeight = containerRef.current.clientHeight - 40; // Subtract padding

    let width, height;

    // For 1:1 aspect ratio (square)
    if (aspectRatioValue === 1) {
      // Use the smaller dimension to ensure it fits
      const size = Math.min(containerWidth, containerHeight);
      width = size;
      height = size;
    } 
    // For landscape aspect ratios (e.g., 16:9)
    else if (aspectRatioValue > 1) {
      width = Math.min(containerWidth, containerHeight * aspectRatioValue);
      height = width / aspectRatioValue;
      
      // If height exceeds container, scale down
      if (height > containerHeight) {
        height = containerHeight;
        width = height * aspectRatioValue;
      }
    } 
    // For portrait aspect ratios (e.g., 9:16)
    else {
      height = Math.min(containerHeight, containerWidth / aspectRatioValue);
      width = height * aspectRatioValue;
      
      // If width exceeds container, scale down
      if (width > containerWidth) {
        width = containerWidth;
        height = width / aspectRatioValue;
      }
    }

    // Return integers to avoid sub-pixel rendering issues
    return {
      width: Math.floor(width),
      height: Math.floor(height)
    };
  };

  // Helper function to load an image to the canvas
  const loadImageToCanvas = async (imageUrl: string) => {
    if (!fabricCanvasRef.current) return;
    
    try {
      // Create an HTML image element
      const imgElement = new window.Image();
      imgElement.crossOrigin = 'anonymous';

      // Create a promise to wait for the image to load
      const imageLoadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
        imgElement.onload = () => resolve(imgElement);
        imgElement.onerror = (e) => reject(new Error('Image load error'));
        imgElement.src = imageUrl;
      });

      // Wait for the image to load
      const loadedImg = await imageLoadPromise;

      // Create a fabric image object
      const fabricImage = new FabricImage(loadedImg);

      // Scale image to fit canvas while maintaining aspect ratio
      const scale = Math.min(
        fabricCanvasRef.current!.width! / fabricImage.width!,
        fabricCanvasRef.current!.height! / fabricImage.height!
      ) * 0.95; // Apply a slight margin

      fabricImage.scaleX = scale;
      fabricImage.scaleY = scale;

      // Center the image
      fabricImage.set({
        left: (fabricCanvasRef.current!.width! - fabricImage.width! * scale) / 2,
        top: (fabricCanvasRef.current!.height! - fabricImage.height! * scale) / 2,
        originX: 'left',
        originY: 'top',
        selectable: false,
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        hoverCursor: 'default'
      });

      fabricCanvasRef.current.add(fabricImage);
      setOriginalImage(fabricImage);
      fabricCanvasRef.current.renderAll();
    } catch (error) {
      console.error("Error loading image to canvas:", error);
    }
  };

  // Initialize canvas only once on mount
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Cleanup function to properly dispose of canvas
    const cleanupCanvas = () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }

      // Additional cleanup for fabric's internal references
      if (canvasRef.current && (canvasRef.current as any).__fabric__) {
        try {
          (canvasRef.current as any).__fabric__.dispose();
          (canvasRef.current as any).__fabric__ = undefined;
        } catch (err) {
          console.error("Error during canvas cleanup:", err);
        }
      }
    };

    // Initialize canvas
    const initializeCanvas = () => {
      // First clean up any existing canvas
      cleanupCanvas();

      const { width, height } = getCanvasDimensions();

      // Use setTimeout to ensure DOM is fully updated
      setTimeout(() => {
        try {
          if (!canvasRef.current) return;

          // Create new canvas
          const newCanvas = new Canvas(canvasRef.current, {
            backgroundColor: "#ffffff",
            preserveObjectStacking: true,
            width,
            height,
            selection: true // Make sure selection is enabled
          });

          // Initialize the free drawing brush
          newCanvas.freeDrawingBrush = new PencilBrush(newCanvas);
          newCanvas.freeDrawingBrush.color = drawingColor;
          newCanvas.freeDrawingBrush.width = lineWidth;

          fabricCanvasRef.current = newCanvas;
          
          // If an image was already loaded, load it into the newly created canvas
          if (currentImage) {
            loadImageToCanvas(currentImage);
          }
        } catch (error) {
          console.error("Error initializing canvas:", error);
        }
      }, 50); // Slightly longer timeout to ensure cleanup is complete
    };

    // Initialize canvas on mount
    initializeCanvas();

    // Return cleanup function
    return () => {
      cleanupCanvas();
    };
  }, []); // Empty dependency array to run only once on mount

  // Handle resize separately
  useEffect(() => {
    if (!containerRef.current || !fabricCanvasRef.current) return;

    const handleResize = () => {
      const { width, height } = getCanvasDimensions();
      fabricCanvasRef.current?.setDimensions({ width, height });
      
      // Re-position the original image if it exists
      if (originalImage) {
        const scale = Math.min(
          fabricCanvasRef.current!.width! / originalImage.width!,
          fabricCanvasRef.current!.height! / originalImage.height!
        ) * 0.95;
        
        originalImage.scaleX = scale;
        originalImage.scaleY = scale;
        
        // Center the image
        originalImage.set({
          left: (fabricCanvasRef.current!.width! - originalImage.width! * scale) / 2,
          top: (fabricCanvasRef.current!.height! - originalImage.height! * scale) / 2,
        });
      }
      
      fabricCanvasRef.current?.renderAll();
    };

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [fabricCanvasRef.current, originalImage]); // Depend on fabric canvas ref and original image

  // Handle aspect ratio changes
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    // When aspect ratio changes, resize the canvas immediately
    const { width, height } = getCanvasDimensions();
    fabricCanvasRef.current.setDimensions({ width, height });
    
    // If we have an image, resize it to fit the new dimensions
    if (originalImage) {
      const scale = Math.min(
        fabricCanvasRef.current.width! / originalImage.width!,
        fabricCanvasRef.current.height! / originalImage.height!
      );
      
      originalImage.scaleX = scale;
      originalImage.scaleY = scale;
      
      // Center the image
      originalImage.set({
        left: (fabricCanvasRef.current.width! - originalImage.width! * scale) / 2,
        top: (fabricCanvasRef.current.height! - originalImage.height! * scale) / 2,
      });
    }
    
    fabricCanvasRef.current.renderAll();
    
    console.log(`Canvas resized to match aspect ratio: ${currentAspectRatio}`, { 
      width, 
      height, 
      canvasWidth: fabricCanvasRef.current.width, 
      canvasHeight: fabricCanvasRef.current.height 
    });
    
  }, [currentAspectRatio, originalImage]);

  // Load image when currentImage changes
  useEffect(() => {
    if (!canvasRef.current && !currentImage) return;

    // If canvas doesn't exist yet but we have an image, we'll initialize it via the initialization useEffect
    if (!fabricCanvasRef.current && currentImage) {
      // The initialization flow will handle this case
      return;
    }

    if (fabricCanvasRef.current && currentImage) {
      // Clear existing canvas content and load the new image
      fabricCanvasRef.current.clear();
      loadImageToCanvas(currentImage);
    }
  }, [currentImage]);

  // Handle editMode changes
  useEffect(() => {
    if (!fabricCanvasRef.current) return;

    // Disable all ongoing editing operations
    fabricCanvasRef.current.isDrawingMode = false;
    fabricCanvasRef.current.selection = true;

    // Enable specific mode
    if (editMode === "draw") {
      fabricCanvasRef.current.isDrawingMode = true;

      // Make sure the brush is initialized before setting properties
      if (fabricCanvasRef.current.freeDrawingBrush) {
        fabricCanvasRef.current.freeDrawingBrush.color = drawingColor;
        fabricCanvasRef.current.freeDrawingBrush.width = lineWidth;
      }
    }

    fabricCanvasRef.current.renderAll();
  }, [editMode, drawingColor, lineWidth]);

  // Update drawing brush when options change
  useEffect(() => {
    if (!fabricCanvasRef.current || !fabricCanvasRef.current.freeDrawingBrush) return;

    fabricCanvasRef.current.freeDrawingBrush.color = drawingColor;
    fabricCanvasRef.current.freeDrawingBrush.width = lineWidth;
  }, [drawingColor, lineWidth]);

  // Handle tool clicks
  const handleDrawClick = () => {
    handleToolClick(editMode === "draw" ? "none" : "draw");
  };

  const handleTextClick = () => {
    handleToolClick(editMode === "text" ? "none" : "text");
    if (editMode !== "text" && fabricCanvasRef.current) {
      addText();
    }
  };

  const handleResetClick = () => {
    if (!fabricCanvasRef.current || !originalImage) return;

    fabricCanvasRef.current.clear();

    // Clone the original image
    const imgElement = originalImage.getElement();
    const clonedImg = new FabricImage(imgElement);

    // Copy properties from original image
    clonedImg.set({
      left: originalImage.left,
      top: originalImage.top,
      originX: 'left',
      originY: 'top',
      scaleX: originalImage.scaleX,
      scaleY: originalImage.scaleY,
      selectable: false,
      lockMovementX: true,
      lockMovementY: true,
      lockRotation: true,
      lockScalingX: true,
      lockScalingY: true,
      hoverCursor: 'default'
    });

    fabricCanvasRef.current.add(clonedImg);
    fabricCanvasRef.current.renderAll();
  };

  // Add text to canvas
  const addText = () => {
    if (!fabricCanvasRef.current) return;

    const text = new IText("Edit this text", {
      fill: textColor,
      fontSize: textSize,
      fontFamily: "Arial",
      left: fabricCanvasRef.current.width! / 2,
      top: fabricCanvasRef.current.height! / 2,
      originX: "center",
      originY: "center",
    });

    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
    fabricCanvasRef.current.renderAll();
  };

  return (
    <div className="bg-white relative rounded-3xl shadow-lg p-4 w-full h-full flex flex-col items-center justify-center" ref={containerRef}>
      {isPending ? (
        // Loading state
        <div className="flex flex-col items-center justify-center h-full">
          <Loading03Icon className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Loading your canvas...</p>
        </div>
      ) : !currentImage ? (
        // Empty state - no images selected
        <div className="flex flex-col items-center justify-center h-full text-center">
          <Image01Icon className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Your Result Will Appear Here</h3>
            <p className="text-gray-500 max-w-md">
            Your final image will appear here. You can then download it or apply edits using the tools.
            </p>
        </div>
      ) : (
        // Canvas with editing tools
        <div className="flex items-center justify-center">
          <canvas
            id="fabric-canvas"
            ref={canvasRef}
          />
          <VerticalToolbar
            onDrawClick={handleDrawClick}
            onTextClick={handleTextClick}
            onResetClick={handleResetClick}
            activeMode={editMode}
            canEdit={!!currentImage}
            drawingColor={drawingColor}
            setDrawingColor={setDrawingColor}
            lineWidth={lineWidth}
            setLineWidth={setLineWidth}
            textColor={textColor}
            setTextColor={setTextColor}
            textSize={textSize}
            setTextSize={setTextSize}
          />
        </div>
      )}
    </div>
  );
};

export default ImageCanvas;