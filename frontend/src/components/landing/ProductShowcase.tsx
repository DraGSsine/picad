import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

const productShowcases = [
  {
    beforeImage: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80",
    afterImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    title: "Modern Product Display",
    description: "Transform basic product photos into eye-catching advertisements"
  },
  {
    beforeImage: "https://images.unsplash.com/photo-1503602642458-232111445657?w=800&auto=format&fit=crop&q=80",
    afterImage: "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&auto=format&fit=crop&q=80",
    title: "Elegant Text Integration",
    description: "Seamlessly blend text with your product imagery"
  },
  {
    beforeImage: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80",
    afterImage: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=80",
    title: "Enhanced Visual Appeal",
    description: "Elevate product presentation with sophisticated visual effects"
  },
  {
    beforeImage: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&auto=format&fit=crop&q=80",
    afterImage: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&auto=format&fit=crop&q=80",
    title: "Brand Consistency",
    description: "Maintain perfect brand identity across all your advertisements"
  }
];

export const ProductShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isComparing, setIsComparing] = useState(false);
  const [comparePosition, setComparePosition] = useState(50);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoPlaying) {
      timer = setInterval(() => {
        setActiveIndex((current) => (current === productShowcases.length - 1 ? 0 : current + 1));
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const handleNext = () => {
    setIsAutoPlaying(false);
    setActiveIndex((current) => (current === productShowcases.length - 1 ? 0 : current + 1));
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setActiveIndex((current) => (current === 0 ? productShowcases.length - 1 : current - 1));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((isComparing && isDraggingRef.current) && showcaseRef.current) {
      const rect = showcaseRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      setComparePosition(Math.max(0, Math.min(100, x)));
    }
  };
  
  const handleMouseDown = () => {
    if (isComparing) {
      isDraggingRef.current = true;
    }
  };
  
  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };
  
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isComparing && showcaseRef.current) {
      const rect = showcaseRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      const x = ((touch.clientX - rect.left) / rect.width) * 100;
      setComparePosition(Math.max(0, Math.min(100, x)));
    }
  };

  useEffect(() => {
    const handleMouseUpGlobal = () => {
      isDraggingRef.current = false;
    };
    
    document.addEventListener('mouseup', handleMouseUpGlobal);
    return () => {
      document.removeEventListener('mouseup', handleMouseUpGlobal);
    };
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4">
      {/* Decorative Elements */}
      <div className="absolute -top-20 right-0 w-72 h-72 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl opacity-60" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-gradient-to-tr from-pink-500/20 to-purple-500/20 rounded-full blur-3xl opacity-60" />

      <div 
        ref={showcaseRef}
        className="relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        style={{ aspectRatio: "2/3" }}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full h-full"
          >
            {!isComparing ? (
              <div className="grid grid-cols-2 h-full">
                <div className="relative overflow-hidden border-r border-white/20">
                  <motion.img
                    src={productShowcases[activeIndex].beforeImage}
                    alt="Before"
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.7 }}
                  />
                </div>
                <div className="relative overflow-hidden">
                  <motion.img
                    src={productShowcases[activeIndex].afterImage}
                    alt="After"
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.7 }}
                  />
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full">
                <img
                  src={productShowcases[activeIndex].afterImage}
                  alt="After"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  className="absolute inset-y-0 left-0 overflow-hidden"
                  style={{ width: `${comparePosition}%` }}
                >
                  <img
                    src={productShowcases[activeIndex].beforeImage}
                    alt="Before"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                
                {/* Divider */}
                <div
                  className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                  style={{ left: `${comparePosition}%` }}
                >
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center cursor-ew-resize"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      isDraggingRef.current = true;
                    }}
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
              </div>
            )}
            
            {/* Showcase Title and Description */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-6 py-6 text-white">
              <h3 className="text-xl md:text-2xl font-bold">{productShowcases[activeIndex].title}</h3>
              <p className="text-sm md:text-base text-white/80 mt-1">{productShowcases[activeIndex].description}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none">
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white hover:bg-black/50 pointer-events-auto transform transition-transform hover:scale-110"
            onClick={handlePrev}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white hover:bg-black/50 pointer-events-auto transform transition-transform hover:scale-110"
            onClick={handleNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="outline"
          className={cn(
            "bg-black/40 backdrop-blur-sm border-white/20 text-white hover:bg-black/60 transition-all",
            isComparing && "bg-white/20 border-white/40"
          )}
          onClick={() => setIsComparing(!isComparing)}
        >
          <ZoomIn className="mr-2 h-4 w-4" />
          {isComparing ? "Exit Comparison" : "Compare Images"}
        </Button>

        <div className="flex gap-2">
          {productShowcases.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveIndex(index);
                setIsAutoPlaying(false);
              }}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                index === activeIndex
                  ? "bg-white w-6"
                  : "bg-white/40 hover:bg-white/60"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          className={cn(
            "bg-black/40 backdrop-blur-sm border-white/20 text-white hover:bg-black/60 transition-all",
            isAutoPlaying && "bg-white/20 border-white/40"
          )}
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {isAutoPlaying ? "Pause" : "Auto-Play"}
        </Button>
      </div>
    </div>
  );
};
