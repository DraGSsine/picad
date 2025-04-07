import React, { useRef, useState, useEffect } from "react";
import { Canvas, Image, IText, PencilBrush } from "fabric";
import VerticalToolbar from "./VerticalToolbar";

interface ImageCanvasProps {
  currentImage: string | null;
  isPending: boolean;
  editMode: "none" | "draw" | "text";
  onToolClick: (mode: "none" | "draw" | "text") => void;
}

const ImageCanvas: React.FC<ImageCanvasProps> = ({
  currentImage,
  isPending,
  editMode,
  onToolClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [originalImage, setOriginalImage] = useState<Image | null>(null);
  const [aspectRatio, setAspectRatio] = useState("9:16");

  // Toolbar states
  const [drawingColor, setDrawingColor] = useState<string>("#000000");
  const [lineWidth, setLineWidth] = useState<number>(3);
  const [textColor, setTextColor] = useState<string>("#000000");
  const [textSize, setTextSize] = useState<number>(24);

  // Get aspect ratio from localStorage
  useEffect(() => {
    const adCreatorData = JSON.parse(localStorage.getItem("adCreatorData") || "{}");
    if (adCreatorData.settings?.aspectRatio) {
      setAspectRatio(adCreatorData.settings.aspectRatio);
    }
  }, []);

  // Initialize canvas with proper aspect ratio
  useEffect(() => {
    if (!canvasRef.current) return;

    const [widthRatio, heightRatio] = aspectRatio.split(":").map(Number);
    const aspectRatioValue = heightRatio / widthRatio;

    // Calculate canvas dimensions based on container size
    const container = canvasRef.current.parentElement;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    let canvasWidth, canvasHeight;
    if (containerWidth * aspectRatioValue <= containerHeight) {
      // Calculate sizes based on viewport width
      const vwPercentage = 90; // Use 90% of viewport width by default
      canvasWidth = (window.innerWidth * vwPercentage) / 100;
      canvasHeight = canvasWidth * aspectRatioValue;
    } else {
      // Calculate sizes based on viewport height
      const vhPercentage = 70; // Use 70% of viewport height by default
      canvasHeight = (window.innerHeight * vhPercentage) / 100;
      canvasWidth = canvasHeight / aspectRatioValue;
    }

    const canvas = new Canvas(canvasRef.current, {
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
      width: canvasWidth,
      height: canvasHeight,
    });

    // Initialize the free drawing brush
    canvas.freeDrawingBrush = new PencilBrush(canvas);
    canvas.freeDrawingBrush.color = drawingColor;
    canvas.freeDrawingBrush.width = lineWidth;

    setCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [aspectRatio]);

  // Load image and resize canvas to match image dimensions
  useEffect(() => {
    if (!canvas || !currentImage) return;

    const loadImage = async () => {
      try {
        canvas.clear();

        const fabricImage = await Image.fromURL(currentImage);
        
        // Scale image to fit canvas while maintaining aspect ratio
        const scale = Math.min(
          canvas.width! / fabricImage.width!,
          canvas.height! / fabricImage.height!
        );

        fabricImage.scaleX = scale;
        fabricImage.scaleY = scale;

        // Center the image
        fabricImage.set({
          left: (canvas.width! - fabricImage.width! * scale) / 2,
          top: (canvas.height! - fabricImage.height! * scale) / 2,
          originX: "left",
          originY: "top",
        });

        canvas.add(fabricImage);
        setOriginalImage(fabricImage);
        canvas.renderAll();
      } catch (error) {
        console.error("Error loading image:", error);
      }
    };

    loadImage();
  }, [currentImage, canvas]);

  // Handle editMode changes
  useEffect(() => {
    if (!canvas) return;

    // Disable all ongoing editing operations
    canvas.isDrawingMode = false;
    canvas.selection = true;

    // Enable specific mode
    if (editMode === "draw") {
      canvas.isDrawingMode = true;

      // Make sure the brush is initialized before setting properties
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = drawingColor;
        canvas.freeDrawingBrush.width = lineWidth;
      }
    }

    canvas.renderAll();
  }, [editMode, canvas, drawingColor, lineWidth]);

  // Update drawing brush when options change
  useEffect(() => {
    if (!canvas || !canvas.freeDrawingBrush) return;

    canvas.freeDrawingBrush.color = drawingColor;
    canvas.freeDrawingBrush.width = lineWidth;
  }, [canvas, drawingColor, lineWidth]);

  // Handle tool clicks
  const handleDrawClick = () => {
    onToolClick(editMode === "draw" ? "none" : "draw");
  };

  const handleTextClick = () => {
    onToolClick(editMode === "text" ? "none" : "text");
    if (editMode !== "text" && canvas) {
      addText();
    }
  };

  const handleResetClick = () => {
    if (!canvas || !originalImage) return;

    canvas.clear();

    // Clone the original image
    const clonedImg = new Image(originalImage.getElement());
    clonedImg.set({
      left: 0,
      top: 0,
      originX: "left",
      originY: "top",
      scaleX: 1,
      scaleY: 1,
    });

    canvas.add(clonedImg);
    canvas.renderAll();
  };

  // Add text to canvas
  const addText = () => {
    if (!canvas) return;

    const text = new IText("Edit this text", {
      fill: textColor,
      fontSize: textSize,
      fontFamily: "Arial",
      left: canvas.width! / 2,
      top: canvas.height! / 2,
      originX: "center",
      originY: "center",
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  return (
      <div className="bg-white relative rounded-3xl shadow-lg p-4 w-full h-full flex items-center justify-center">
        <div style={{ aspectRatio }}>
          {/* <canvas 
            id="fabric-canvas" 
            ref={canvasRef} 
            className="rounded-xl" 
          /> */}
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
      </div>
  );
};

export default ImageCanvas;
