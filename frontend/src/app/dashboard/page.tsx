"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
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
    setCanvasRef
  } = useDashboard();

  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [originalImage, setOriginalImage] = useState<FabricImage | null>(null);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 400, height: 400 });

  const [drawingColor, setDrawingColor] = useState<string>("#000000");
  const [lineWidth, setLineWidth] = useState<number>(3);
  const [textColor, setTextColor] = useState<string>("#000000");
  const [textSize, setTextSize] = useState<number>(24);

  useEffect(() => {
    if (fabricCanvasRef.current) {
      setCanvasRef(canvasElRef);
    }
  }, [setCanvasRef, fabricCanvasRef.current]);

  const calculateCanvasDimensions = useCallback(() => {
    if (!containerRef.current) return { width: 400, height: 400 };

    const [widthRatio, heightRatio] = currentAspectRatio.split(":").map(Number);
    const aspectRatioValue = widthRatio / heightRatio;

    const containerWidth = containerRef.current.clientWidth - 100;
    const containerHeight = containerRef.current.clientHeight - 40;

    let width, height;

    if (containerWidth <= 0 || containerHeight <= 0) {
      return { width: 400, height: 400 };
    }

    if (containerWidth / containerHeight > aspectRatioValue) {
      height = containerHeight;
      width = height * aspectRatioValue;
    } else {
      width = containerWidth;
      height = width / aspectRatioValue;
    }

    return {
      width: Math.floor(width),
      height: Math.floor(height)
    };
  }, [currentAspectRatio]);

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
    setOriginalImage(null);

    try {
      const imgElement = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(new Error('Image load error'));
        img.src = imageUrl;
      });

      const fabricImage = new FabricImage(imgElement);
      scaleAndCenterImage(fabricImage, canvas);

      canvas.add(fabricImage);
      setOriginalImage(fabricImage);
      canvas.renderAll();
    } catch (error) {
      console.error("Error loading image to canvas:", error);
    }
  }, [scaleAndCenterImage]);

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

    fabricCanvasRef.current = canvas;

    const resizeObserver = new ResizeObserver(entries => {
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
    };
  }, [calculateCanvasDimensions]);

  useEffect(() => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.setDimensions({
        width: canvasDimensions.width,
        height: canvasDimensions.height
      });
      if (originalImage) {
        scaleAndCenterImage(originalImage, fabricCanvasRef.current);
      }
      fabricCanvasRef.current.renderAll();
    }
  }, [canvasDimensions, originalImage, scaleAndCenterImage]);

  useEffect(() => {
    if (currentImage && fabricCanvasRef.current) {
      loadImageToCanvas(currentImage, fabricCanvasRef.current);
    } else if (!currentImage && fabricCanvasRef.current) {
      fabricCanvasRef.current.clear();
      setOriginalImage(null);
      fabricCanvasRef.current.backgroundColor = "#ffffff";
      fabricCanvasRef.current.renderAll();
    }
  }, [currentImage, loadImageToCanvas]);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.isDrawingMode = false;
    canvas.selection = true;
    canvas.defaultCursor = 'default';
    canvas.hoverCursor = 'move';

    if (editMode === "draw") {
      canvas.isDrawingMode = true;
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = drawingColor;
        canvas.freeDrawingBrush.width = lineWidth;
      }
    } else if (editMode === "text") {
      canvas.defaultCursor = 'text';
      canvas.hoverCursor = 'text';
    } else {
      canvas.isDrawingMode = false;
    }

    canvas.renderAll();
  }, [editMode, drawingColor, lineWidth]);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (canvas?.isDrawingMode && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = drawingColor;
      canvas.freeDrawingBrush.width = lineWidth;
    }
  }, [drawingColor, lineWidth]);

  const handleDrawClick = () => {
    handleToolClick(editMode === "draw" ? "none" : "draw");
  };

  const handleTextClick = () => {
    const nextMode = editMode === "text" ? "none" : "text";
    handleToolClick(nextMode);
    if (nextMode === "text" && fabricCanvasRef.current) {
      addText();
    }
  };

  const handleResetClick = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !originalImage) return;

    canvas.getObjects().forEach(obj => {
      if (obj !== originalImage) {
        canvas.remove(obj);
      }
    });

    scaleAndCenterImage(originalImage, canvas);
    originalImage.set({
      selectable: false,
      lockMovementX: true,
      lockMovementY: true,
      lockRotation: true,
      lockScalingX: true,
      lockScalingY: true,
      hoverCursor: 'default'
    });

    handleToolClick("none");
    canvas.renderAll();
  };

  const addText = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !canvas.width || !canvas.height) return;

    const text = new IText("Edit this text", {
      fill: textColor,
      fontSize: textSize,
      fontFamily: "Arial",
      left: canvas.width / 2,
      top: canvas.height / 2,
      originX: "center",
      originY: "center",
      editable: true,
      hasControls: true,
      hasBorders: true,
      lockUniScaling: false,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    text.enterEditing();
    text.selectAll();
    canvas.renderAll();
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
        </div>
      )}
    </div>
  );
};

export default ImageCanvas;