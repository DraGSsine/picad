"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { Canvas, FabricImage, IText, PencilBrush } from "fabric";
import { useDashboard, useImageContext } from "@/contexts/DashboardContext";
import VerticalToolbar from "@/components/dashboard/VerticalToolbar";
import { Loading03Icon, Image01Icon } from "hugeicons-react";

const ImageCanvas: React.FC = () => {
  const {
    currentImage,
    originalImage,
    setOriginalImage,
    isPending,
    editMode,
    handleToolClick,
    currentImageSize,
    setCanvasRef
  } = useDashboard();
  
  // Get the image context once at the component level
  const imageContext = useImageContext();

  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadedOriginalImage, setLoadedOriginalImage] = useState<FabricImage | null>(null);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 400, height: 400 });
  const editLayerRef = useRef<Canvas | null>(null);
  const editCanvasElRef = useRef<HTMLCanvasElement | null>(null);

  const [drawingColor, setDrawingColor] = useState<string>("#FF0000"); // More visible red color for edits
  const [lineWidth, setLineWidth] = useState<number>(5); // Thicker lines for better visibility
  const [textColor, setTextColor] = useState<string>("#FF0000");
  const [textSize, setTextSize] = useState<number>(24);
  
  // Hook to provide the canvas reference to the context
  useEffect(() => {
    if (fabricCanvasRef.current) {
      setCanvasRef(canvasElRef);
    }
  }, [setCanvasRef, fabricCanvasRef.current]);

  // Create the edit layer canvas
  useEffect(() => {
    if (!containerRef.current) return;
    
    const editCanvasEl = document.createElement('canvas');
    editCanvasEl.style.position = 'absolute';
    editCanvasEl.style.top = '0';
    editCanvasEl.style.left = '0';
    editCanvasEl.style.pointerEvents = 'none';
    editCanvasEl.width = canvasDimensions.width;
    editCanvasEl.height = canvasDimensions.height;
    editCanvasEl.style.width = `${canvasDimensions.width}px`;
    editCanvasEl.style.height = `${canvasDimensions.height}px`;
    editCanvasElRef.current = editCanvasEl;
    
    return () => {
      if (editCanvasElRef.current?.parentNode) {
        editCanvasElRef.current.parentNode.removeChild(editCanvasElRef.current);
      }
    };
  }, [canvasDimensions]);

  const calculateCanvasDimensions = useCallback(() => {
    if (!containerRef.current) return { width: 400, height: 400 };

    // Parse the image size format (e.g., "1024x1024" -> {width: 1024, height: 1024})
    const [width, height] = currentImageSize.split('x').map(Number);
    const dimensionRatio = width / height;

    const containerWidth = containerRef.current.clientWidth - 100;
    const containerHeight = containerRef.current.clientHeight - 40;

    let canvasWidth, canvasHeight;

    if (containerWidth <= 0 || containerHeight <= 0) {
      return { width: 400, height: 400 };
    }

    if (containerWidth / containerHeight > dimensionRatio) {
      canvasHeight = containerHeight;
      canvasWidth = canvasHeight * dimensionRatio;
    } else {
      canvasWidth = containerWidth;
      canvasHeight = canvasWidth / dimensionRatio;
    }

    return {
      width: Math.floor(canvasWidth),
      height: Math.floor(canvasHeight)
    };
  }, [currentImageSize]);

  const scaleAndCenterImage = useCallback((image: FabricImage, canvas: Canvas) => {
    if (!image || !canvas || !canvas.width || !canvas.height || !image.width || !image.height) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imageWidth = image.width;
    const imageHeight = image.height;

    const scale = Math.min(
      canvasWidth / imageWidth,
      canvasHeight / imageHeight
    );

    image.scaleX = scale;
    image.scaleY = scale;

    image.set({
      left: (canvasWidth - imageWidth * scale) / 2,
      top: (canvasHeight - imageHeight * scale) / 2,
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
  }, []);

  const loadImageToCanvas = useCallback(async (imageUrl: string, canvas: Canvas) => {
    if (!canvas) return;
    canvas.clear();
    setLoadedOriginalImage(null);

    // Store the original image URL for reference when making edits
    if (!originalImage) {
      setOriginalImage(imageUrl);
    }

    try {
      const imgElement = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Image load error'));
        img.src = imageUrl;
      });

      const fabricImage = new FabricImage(imgElement);
      scaleAndCenterImage(fabricImage, canvas);

      canvas.add(fabricImage);
      setLoadedOriginalImage(fabricImage);
      canvas.renderAll();
    } catch (error) {
      console.error("Error loading image to canvas:", error);
    }
  }, [scaleAndCenterImage, originalImage, setOriginalImage]);

  // Initialize the main canvas
  useEffect(() => {
    if (!canvasElRef.current || !containerRef.current) return;

    const initialDimensions = calculateCanvasDimensions();
    setCanvasDimensions(initialDimensions);

    const canvas = new Canvas(canvasElRef.current, {
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
      width: initialDimensions.width,
      height: initialDimensions.height,
      selection: true,
    });

    canvas.freeDrawingBrush = new PencilBrush(canvas);
    canvas.freeDrawingBrush.color = drawingColor;
    canvas.freeDrawingBrush.width = lineWidth;
    
    // Store fabric canvas in ref
    fabricCanvasRef.current = canvas;
    
    // Initialize edit layer
    if (editCanvasElRef.current && containerRef.current) {
      containerRef.current.appendChild(editCanvasElRef.current);
      const editLayer = new Canvas(editCanvasElRef.current, {
        width: initialDimensions.width,
        height: initialDimensions.height,
        isDrawingMode: true,
        backgroundColor: 'transparent'
      });
      
      editLayer.freeDrawingBrush = new PencilBrush(editLayer);
      editLayer.freeDrawingBrush.color = drawingColor;
      editLayer.freeDrawingBrush.width = lineWidth;
      
      editLayerRef.current = editLayer;
    }

    const resizeObserver = new ResizeObserver(() => {
      const newDimensions = calculateCanvasDimensions();
      setCanvasDimensions(newDimensions);
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
      if (editLayerRef.current) {
        editLayerRef.current.dispose();
        editLayerRef.current = null;
      }
    };
  }, [calculateCanvasDimensions, drawingColor, lineWidth]);

  // Update dimensions when they change
  useEffect(() => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.setDimensions({
        width: canvasDimensions.width,
        height: canvasDimensions.height
      });
      
      if (loadedOriginalImage) {
        scaleAndCenterImage(loadedOriginalImage, fabricCanvasRef.current);
      }
      
      fabricCanvasRef.current.renderAll();
    }
    
    if (editLayerRef.current && editCanvasElRef.current) {
      editLayerRef.current.setDimensions({
        width: canvasDimensions.width,
        height: canvasDimensions.height
      });
      
      editCanvasElRef.current.style.width = `${canvasDimensions.width}px`;
      editCanvasElRef.current.style.height = `${canvasDimensions.height}px`;
      
      editLayerRef.current.renderAll();
    }
  }, [canvasDimensions, loadedOriginalImage, scaleAndCenterImage]);

  // Load image when currentImage changes
  useEffect(() => {
    if (currentImage && fabricCanvasRef.current) {
      loadImageToCanvas(currentImage, fabricCanvasRef.current);
      
      // Clear the edit layer when loading a new image
      if (editLayerRef.current) {
        editLayerRef.current.clear();
        editLayerRef.current.backgroundColor = 'transparent';
        editLayerRef.current.renderAll();
      }
    } else if (!currentImage && fabricCanvasRef.current) {
      fabricCanvasRef.current.clear();
      setLoadedOriginalImage(null);
      fabricCanvasRef.current.backgroundColor = "#ffffff";
      fabricCanvasRef.current.renderAll();
      
      // Also clear the edit layer
      if (editLayerRef.current) {
        editLayerRef.current.clear();
        editLayerRef.current.backgroundColor = 'transparent';
        editLayerRef.current.renderAll();
      }
    }
  }, [currentImage, loadImageToCanvas]);

  // Update edit mode settings
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    const editLayer = editLayerRef.current;
    
    if (!canvas || !editLayer) return;

    // Main canvas settings
    canvas.isDrawingMode = false;
    canvas.selection = true;
    canvas.defaultCursor = 'default';
    canvas.hoverCursor = 'move';
    
    // Edit layer settings
    editLayer.isDrawingMode = editMode === "draw";
    
    if (editMode === "draw") {
      if (editLayer.freeDrawingBrush) {
        editLayer.freeDrawingBrush.color = drawingColor;
        editLayer.freeDrawingBrush.width = lineWidth;
      }
      
      editLayer.defaultCursor = 'crosshair';
      editCanvasElRef.current!.style.pointerEvents = 'auto';
      canvas.selection = false;
    } else if (editMode === "text") {
      canvas.defaultCursor = 'text';
      canvas.hoverCursor = 'text';
      editCanvasElRef.current!.style.pointerEvents = 'none';
    } else {
      editCanvasElRef.current!.style.pointerEvents = 'none';
    }

    canvas.renderAll();
    editLayer.renderAll();
  }, [editMode, drawingColor, lineWidth]);

  // Update drawing settings when they change
  useEffect(() => {
    const editLayer = editLayerRef.current;
    if (editLayer?.isDrawingMode && editLayer.freeDrawingBrush) {
      editLayer.freeDrawingBrush.color = drawingColor;
      editLayer.freeDrawingBrush.width = lineWidth;
    }
  }, [drawingColor, lineWidth]);

  // Add methods to get the edit mask for the API
  useEffect(() => {
    // Add a method to the context to get just the edit mask
    const originalGetEditMaskImage = imageContext.getEditMaskImage;
    
    if (typeof originalGetEditMaskImage === 'function') {
      // Override with our implementation that returns just the edit layer
      (imageContext).getEditMaskImage = () => {
        if (!editLayerRef.current || !editCanvasElRef.current) return null;
        
        try {
          return editCanvasElRef.current.toDataURL('image/png');
        } catch (error) {
          console.error("Error getting edit mask:", error);
          return null;
        }
      };
    }
    
    // Restore original function on unmount
    return () => {
      if (typeof originalGetEditMaskImage === 'function') {
        (imageContext).getEditMaskImage = originalGetEditMaskImage;
      }
    };
  }, [imageContext]);

  const handleDrawClick = () => {
    handleToolClick(editMode === "draw" ? "none" : "draw");
  };

  const handleTextClick = () => {
    const nextMode = editMode === "text" ? "none" : "text";
    handleToolClick(nextMode);
    if (nextMode === "text" && fabricCanvasRef.current && editLayerRef.current) {
      addText();
    }
  };

  const handleResetClick = () => {
    // Clear only the edit layer, preserving the original image
    if (editLayerRef.current) {
      editLayerRef.current.clear();
      editLayerRef.current.backgroundColor = 'transparent';
      editLayerRef.current.renderAll();
    }
    
    handleToolClick("none");
  };

  const addText = () => {
    const editLayer = editLayerRef.current;
    if (!editLayer || !editLayer.width || !editLayer.height) return;

    const text = new IText("Edit this text", {
      fill: textColor,
      fontSize: textSize,
      fontFamily: "Arial",
      left: editLayer.width / 2,
      top: editLayer.height / 2,
      originX: "center",
      originY: "center",
      editable: true,
      hasControls: true,
      hasBorders: true,
      lockUniScaling: false,
    });

    editLayer.add(text);
    editLayer.setActiveObject(text);
    text.enterEditing();
    text.selectAll();
    editLayer.renderAll();
  };

  return (
    <div className="bg-white relative rounded-3xl shadow-lg p-4 w-full h-full flex flex-col items-center justify-center overflow-hidden" ref={containerRef}>
      {isPending ? (
        <div className="flex flex-col items-center justify-center h-full">
          <Loading03Icon className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Loading your canvas...</p>
        </div>
      ) : !currentImage && !fabricCanvasRef.current ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <Image01Icon className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Your Result Will Appear Here</h3>
          <p className="text-gray-500 max-w-md">
            Generate an image or upload one. Your result will appear here for editing or download.
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <canvas
            id="fabric-canvas"
            ref={canvasElRef}
            style={{ width: canvasDimensions.width, height: canvasDimensions.height }}
            className="border border-primary/10 rounded-2xl"
          />
          {currentImage && fabricCanvasRef.current && (
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
          )}
          {!currentImage && fabricCanvasRef.current && !isPending && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <Image01Icon className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Canvas Ready</h3>
              <p className="text-gray-500 max-w-md">
                Generate or upload an image to start editing.
              </p>
            </div>
          )}
          
          {editMode !== "none" && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/75 text-white px-4 py-2 rounded-full text-sm font-medium">
              {editMode === "draw" ? "Draw on the areas you want to edit, then describe the changes" : 
               editMode === "text" ? "Add and edit text elements" : ""}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageCanvas;