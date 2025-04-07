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
    <div className="absolute right-5 top-1/2 -translate-y-1/2">
      <div className="bg-white rounded-2xl py-3 px-2 flex flex-col items-center gap-3 shadow-sm border border-gray-100">
        <div className="flex flex-col gap-2 items-center">
          {/* Pencil Tool */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`h-9 w-9 text-gray-600 rounded-lg ${
                  activeMode === "draw"
                    ? "bg-purple-100 text-purple-700"
                    : "hover:bg-purple-50 hover:text-purple-700"
                }`}
                title="Draw"
                onClick={onDrawClick}
                disabled={!canEdit}
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="left" className="w-64">
              <div className="space-y-4">
                <h4 className="font-medium">Drawing Options</h4>
                <div className="space-y-2">
                  <label className="text-sm">Color</label>
                  <input 
                    type="color" 
                    value={drawingColor} 
                    onChange={(e) => setDrawingColor(e.target.value)} 
                    className="w-full h-8" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Line Width: {lineWidth}px</label>
                  <Slider 
                    value={[lineWidth]} 
                    onValueChange={(value) => setLineWidth(value[0])} 
                    min={1} 
                    max={20} 
                    step={1}
                  />
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
                className={`h-9 w-9 text-gray-600 rounded-lg ${
                  activeMode === "text"
                    ? "bg-purple-100 text-purple-700"
                    : "hover:bg-purple-50 hover:text-purple-700"
                }`}
                title="Add Text"
                onClick={onTextClick}
                disabled={!canEdit}
              >
                <TextIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="left" className="w-64">
              <div className="space-y-4">
                <h4 className="font-medium">Text Options</h4>
                <div className="space-y-2">
                  <label className="text-sm">Color</label>
                  <input 
                    type="color" 
                    value={textColor} 
                    onChange={(e) => setTextColor(e.target.value)} 
                    className="w-full h-8" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Font Size: {textSize}px</label>
                  <Slider 
                    value={[textSize]} 
                    onValueChange={(value) => setTextSize(value[0])} 
                    min={10} 
                    max={72} 
                    step={1}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>

        </div>

        {/* Simple divider */}
        <div className="w-4 h-[1px] bg-gray-200"></div>

        {/* Clear Tool - Reset to original image */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-gray-600 hover:bg-red-50 hover:text-red-500 rounded-lg"
          title="Reset Image"
          disabled={!canEdit}
          onClick={onResetClick}
        >
          <Delete02Icon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default VerticalToolbar;
