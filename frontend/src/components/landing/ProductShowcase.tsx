import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const productShowcases = [
  {
    beforeImage: "/showcase/product-1-before.webp",
    afterImage: "/showcase/prodcut-1-after.png",
  },
  {
    beforeImage: "/showcase/product-2-before.jpeg",
    afterImage: "/showcase/product-2-after.webp",
  },
  {
    beforeImage: "/showcase/prodcut-3-before.jpg",
    afterImage: "/showcase/prodcut-3-after.png",
  },
  {
    beforeImage: "/showcase/prodcut-4-before.png",
    afterImage: "/showcase/prodcut-4-after.png",
  },
];

export const ProductShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoPlaying) {
      timer = setInterval(() => {
        setActiveIndex((current) =>
          current === productShowcases.length - 1 ? 0 : current + 1
        );
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const handleNext = () => {
    setIsAutoPlaying(false);
    setActiveIndex((current) =>
      current === productShowcases.length - 1 ? 0 : current + 1
    );
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setActiveIndex((current) =>
      current === 0 ? productShowcases.length - 1 : current - 1
    );
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (showcaseRef.current && e) {
    }
  };

  const handleMouseDown = () => {
    isDraggingRef.current = true;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (showcaseRef.current && e) {
    }
  };

  useEffect(() => {
    const handleMouseUpGlobal = () => {
      isDraggingRef.current = false;
    };

    document.addEventListener("mouseup", handleMouseUpGlobal);
    return () => {
      document.removeEventListener("mouseup", handleMouseUpGlobal);
    };
  }, []);

  return (
    <div className="relative w-full mx-auto">
      {/* Enhanced decorative elements with vibrant gradients */}
      <div className="absolute -top-20 right-0 w-72 h-72 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl opacity-60" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-gradient-to-tr from-pink-500/20 to-purple-500/20 rounded-full blur-3xl opacity-60" />

      <div
        ref={showcaseRef}
        className="relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-white/10 w-full h-[56vh]"
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
            transition={{ duration: 0.3 }}
            className="relative w-full h-full"
          >
            <div className="grid grid-cols-2 h-full">
              <div className="relative overflow-hidden border-r border-white/20">
                {/* Enhanced Before Label */}
                <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 text-sm font-semibold rounded-md backdrop-blur-sm z-10 shadow-lg">
                  Original
                </div>
                <div className="w-full h-full relative">
                  <Image
                    src={productShowcases[activeIndex].beforeImage}
                    alt="Before"
                    priority
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="relative overflow-hidden">
                {/* Enhanced After Label */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-primary to-primary/80 text-white px-3 py-1 text-sm font-semibold rounded-md backdrop-blur-sm z-10 shadow-lg">
                  Enhanced
                </div>
                <div className="w-full h-full relative">
                  <Image
                    fill
                    src={productShowcases[activeIndex].afterImage}
                    alt="After"
                    priority
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Enhanced Navigation Controls */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none">
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white hover:bg-black/90 pointer-events-auto transform transition-transform hover:scale-110 shadow-lg"
            onClick={handlePrev}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white hover:bg-black/90 pointer-events-auto transform transition-transform hover:scale-110 shadow-lg"
            onClick={handleNext}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Improved indicator dots */}
      <div className="mt-4 flex items-center justify-center">
        <div className="flex gap-2">
          {productShowcases.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveIndex(index);
                setIsAutoPlaying(false);
              }}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300 shadow-md",
                index === activeIndex
                  ? "bg-primary w-5"
                  : "bg-white/70 hover:bg-white"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
