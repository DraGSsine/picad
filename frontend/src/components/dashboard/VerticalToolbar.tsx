import React from "react";
import {
  TextIcon,
  PencilIcon,
  Delete02Icon,
} from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";

interface VerticalToolbarProps {
  onDrawClick: () => void;
  onTextClick: () => void;
  onResetClick: () => void;  
  activeMode: "none" | "draw" | "text";
  canEdit: boolean;
  drawingColor: string;
  setDrawingColor: (color: string) => void;
  lineWidth: number;
  setLineWidth: (width: number) => void;
  textColor: string;
  setTextColor: (color: string) => void;
  textSize: number;
  setTextSize: (size: number) => void;
}

const VerticalToolbar: React.FC<VerticalToolbarProps> = ({ 
  onDrawClick, 
  onTextClick, 
  onResetClick,
  activeMode, 
  canEdit,
  drawingColor,
  setDrawingColor,
  lineWidth,
  setLineWidth,
  textColor,
  setTextColor,
  textSize,
  setTextSize
}) => {
  return (
    <div className="absolute right-5 top-1/2 -translate-y-1/2 z-20">
      <div className="gradient-border bg-card/80 backdrop-blur-md rounded-2xl py-5 px-1 flex flex-col items-center gap-4 shadow-lg">
        <div className="flex flex-col gap-3 items-center">
          {/* Pencil Tool */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`h-10 w-10 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  activeMode === "draw"
                    ? "bg-gradient-to-br from-primary/20 to-secondary/20 text-primary shadow-md"
                    : canEdit ? "hover:bg-primary/10 hover:text-primary" : "opacity-50 cursor-not-allowed"
                }`}
                title="Draw"
                onClick={onDrawClick}
                disabled={!canEdit}
              >
                {activeMode === "draw" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 animate-shimmer" 
                    style={{ backgroundSize: '200% 100%' }}></div>
                )}
                <div className="relative z-10">
                  <PencilIcon className={`h-5 w-5 transition-transform duration-300 ${canEdit && activeMode !== "draw" ? "group-hover:scale-110" : ""}`} 
                    style={{ color: activeMode === "draw" ? drawingColor : undefined }} />
                </div>
                {activeMode === "draw" && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary"></span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent side="left" align="center" className="w-64 p-5 bg-card/80 backdrop-blur-md border border-primary/10 shadow-lg rounded-xl">
              <div className="space-y-5">
                <h4 className="text-sm font-medium text-foreground flex items-center">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mr-2">
                    <PencilIcon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  Drawing Options
                </h4>
                
                <div className="space-y-3">
                  <label className="text-xs font-medium text-foreground/80 flex justify-between items-center">
                    <span>Color</span>
                    <div className="h-5 w-5 rounded-full border border-primary/20 shadow-sm" 
                      style={{ backgroundColor: drawingColor }}></div>
                  </label>
                  <input 
                    type="color" 
                    value={drawingColor} 
                    onChange={(e) => setDrawingColor(e.target.value)} 
                    className="w-full h-8 rounded cursor-pointer" 
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="text-xs font-medium text-foreground/80 flex justify-between items-center">
                    <span>Line Width</span>
                    <span className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full py-0.5 px-2 text-xs font-medium">
                      {lineWidth}px
                    </span>
                  </label>
                  <Slider 
                    value={[lineWidth]} 
                    onValueChange={(value) => setLineWidth(value[0])} 
                    min={1} 
                    max={20} 
                    step={1}
                    className="[&>.relative>.absolute]:bg-gradient-to-r [&>.relative>.absolute]:from-primary [&>.relative>.absolute]:to-secondary [&>.relative]:bg-gradient-to-r [&>.relative]:from-primary/20 [&>.relative]:to-secondary/20"
                  />
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="h-[2px] w-5 bg-primary/40 rounded-full"></div>
                    <div className="h-[6px] w-5 bg-primary/60 rounded-full"></div>
                    <div className="h-[10px] w-5 bg-primary/80 rounded-full"></div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Add Text Tool */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`h-10 w-10 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  activeMode === "text"
                    ? "bg-gradient-to-br from-secondary/20 to-accent/20 text-secondary shadow-md"
                    : canEdit ? "hover:bg-secondary/10 hover:text-secondary" : "opacity-50 cursor-not-allowed"
                }`}
                title="Add Text"
                onClick={onTextClick}
                disabled={!canEdit}
              >
                {activeMode === "text" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 animate-shimmer" 
                    style={{ backgroundSize: '200% 100%' }}></div>
                )}
                <div className="relative z-10">
                  <TextIcon className={`h-5 w-5 transition-transform duration-300 ${canEdit && activeMode !== "text" ? "group-hover:scale-110" : ""}`} 
                    style={{ color: activeMode === "text" ? textColor : undefined }} />
                </div>
                {activeMode === "text" && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-secondary"></span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent side="left" align="center" className="w-64 p-5 bg-card/80 backdrop-blur-md border border-secondary/10 shadow-lg rounded-xl">
              <div className="space-y-5">
                <h4 className="text-sm font-medium text-foreground flex items-center">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-secondary/10 to-accent/10 flex items-center justify-center mr-2">
                    <TextIcon className="h-3.5 w-3.5 text-secondary" />
                  </div>
                  Text Options
                </h4>
                
                <div className="space-y-3">
                  <label className="text-xs font-medium text-foreground/80 flex justify-between items-center">
                    <span>Text Color</span>
                    <div className="h-5 w-5 rounded-full border border-secondary/20 shadow-sm" 
                      style={{ backgroundColor: textColor }}></div>
                  </label>
                  <input 
                    type="color" 
                    value={textColor} 
                    onChange={(e) => setTextColor(e.target.value)} 
                    className="w-full h-8 rounded cursor-pointer" 
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="text-xs font-medium text-foreground/80 flex justify-between items-center">
                    <span>Font Size</span>
                    <span className="bg-gradient-to-r from-secondary/20 to-accent/20 rounded-full py-0.5 px-2 text-xs font-medium">
                      {textSize}px
                    </span>
                  </label>
                  <Slider 
                    value={[textSize]} 
                    onValueChange={(value) => setTextSize(value[0])} 
                    min={10} 
                    max={72} 
                    step={1}
                    className="[&>.relative>.absolute]:bg-gradient-to-r [&>.relative>.absolute]:from-secondary [&>.relative>.absolute]:to-accent [&>.relative]:bg-gradient-to-r [&>.relative]:from-secondary/20 [&>.relative]:to-accent/20"
                  />
                  
                  <div className="flex items-center justify-between mt-2 text-secondary font-serif">
                    <span className="text-xs">Aa</span>
                    <span className="text-sm">Aa</span>
                    <span className="text-base">Aa</span>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Elegant divider with animation */}
        <div className="w-6 h-[2px] bg-gradient-to-r from-primary/30 via-secondary/40 to-accent/30 rounded-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
        </div>

        {/* Clear Tool - Reset to original image */}
        <Button
          variant="ghost"
          size="icon"
          className={`h-10 w-10 rounded-xl relative group ${
            canEdit 
              ? "hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
              : "opacity-50 cursor-not-allowed text-muted-foreground"
          }`}
          title="Reset Image"
          disabled={!canEdit}
          onClick={onResetClick}
        >
          <div className="relative z-10">
            <Delete02Icon className={`h-5 w-5 ${canEdit ? "group-hover:rotate-12 transition-transform duration-300" : ""}`} />
          </div>
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-destructive opacity-0 group-hover:opacity-100 transition-opacity"></span>
        </Button>
      </div>
    </div>
  );
};

export default VerticalToolbar;
