"use client";

import { Check, Sparkles } from "lucide-react";
import { useRef, useState } from "react";

const FeaturesList = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const features = [
    {
      title: "Advanced AI Image Generation",
      description: "Transform product photos into professional ad visuals instantly",
      color: "purple"
    },
    {
      title: "Smart Text Integration",
      description: "AI positions your text perfectly within the visual composition",
      color: "blue"
    },
    {
      title: "Magic Brush Editing",
      description: "Remove or generate objects with intuitive brush strokes",
      color: "indigo"
    },
    {
      title: "Multiple Formats & Sizes",
      description: "Optimize for any platform from Instagram to Facebook and beyond",
      color: "violet"
    },
    {
      title: "Template Library",
      description: "Access 100+ professionally designed ad templates",
      color: "pink"
    },
    {
      title: "Brand Style Consistency",
      description: "AI maintains your brand colors, fonts, and style guidelines",
      color: "cyan"
    }
  ];

  return (
    <div 
      ref={containerRef}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-10 perspective-1000"
    >
      {features.map((feature, index) => (
        <div
          key={index}
          className={`group relative overflow-hidden transition-all duration-500 hover:scale-[1.03] ${
            hoveredFeature === index ? `z-10` : `z-0`
          }`}
          onMouseEnter={() => setHoveredFeature(index)}
          onMouseLeave={() => setHoveredFeature(null)}
        >
          {/* Main card with glass morphism effect */}
          <div 
            className={`relative flex items-center p-4 rounded-xl border border-${feature.color}-100 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300`}
          >
            {/* Icon container with gradient background */}
            <div className={`flex-shrink-0 mr-4 relative`}>
              <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-${feature.color}-400 to-${feature.color}-600 opacity-20 group-hover:opacity-30 blur-[1px] scale-110 transition-all duration-300`}></div>
              <div className={`relative z-10 bg-${feature.color}-50 group-hover:bg-${feature.color}-100 rounded-full p-2 transition-colors duration-300`}>
                <Check className={`w-4 h-4 text-${feature.color}-600`} />
              </div>
            </div>
            
            {/* Text content with hover animation */}
            <div className="flex-1">
              <div className="flex items-center">
                <h4 className={`font-medium text-gray-900 group-hover:text-${feature.color}-700 transition-colors duration-300`}>
                  {feature.title}
                </h4>
                {index === 0 && (
                  <div className="ml-2 flex items-center">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-0.5 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-1 group-hover:translate-y-0">
                {feature.description}
              </p>
            </div>
            
            {/* Decorative accent */}
            <div className={`absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-${feature.color}-400/40 via-${feature.color}-500/40 to-${feature.color}-600/40 transform scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-300 rounded-r-md`}></div>
          </div>
          
          {/* Background glow effect on hover */}
          <div 
            className={`absolute inset-0 -z-10 bg-gradient-to-r from-${feature.color}-200/0 via-${feature.color}-200/30 to-${feature.color}-200/0 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300`}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default FeaturesList;
