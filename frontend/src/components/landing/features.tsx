"use client";

import React from "react";
import { 
  Sparkles, 
  LayoutTemplate, 
  PenTool, 
  Wand2, 
  Download, 
  Clock3 
} from "lucide-react";

const Features = () => {
  const features = [
    {
      title: "AI-Powered Generation",
      description: "Transform your product photos into professional ad visuals instantly with our advanced AI technology.",
      icon: <Sparkles className="w-7 h-7 text-primary" />,
      delay: 0.2,
      gradient: "from-primary/80 to-indigo-600/80",
      shadowColor: "shadow-primary/20"
    },
    {
      title: "Diverse Ad Templates",
      description: "Choose from 100+ professionally designed templates optimized for different platforms and campaigns.",
      icon: <LayoutTemplate className="w-7 h-7 text-blue-600" />,
      delay: 0.3,
      gradient: "from-blue-600/80 to-cyan-600/80",
      shadowColor: "shadow-blue-500/20"
    },
    {
      title: "Intelligent Text Placement",
      description: "Add headlines and descriptions with AI that intelligently integrates text with your visuals.",
      icon: <PenTool className="w-7 h-7 text-cyan-600" />,
      delay: 0.4,
      gradient: "from-cyan-600/80 to-teal-600/80",
      shadowColor: "shadow-cyan-500/20"
    },
    {
      title: "Magic Brush Tool",
      description: "Remove objects or generate new elements with our intuitive brush tool powered by AI.",
      icon: <Wand2 className="w-7 h-7 text-indigo-600" />,
      delay: 0.5,
      gradient: "from-indigo-600/80 to-primary/80",
      shadowColor: "shadow-indigo-500/20"
    },
    {
      title: "High-Resolution Exports",
      description: "Export your ad creations in high resolution, ready for immediate use in your campaigns.",
      icon: <Download className="w-7 h-7 text-teal-600" />,
      delay: 0.6,
      gradient: "from-teal-600/80 to-emerald-600/80",
      shadowColor: "shadow-teal-500/20"
    },
    {
      title: "Time-Saving Workflow",
      description: "Create professional ads in seconds instead of hours, freeing up your time for strategy.",
      icon: <Clock3 className="w-7 h-7 text-emerald-600" />,
      delay: 0.7,
      gradient: "from-emerald-600/80 to-green-600/80",
      shadowColor: "shadow-emerald-500/20"
    }
  ];

  return (
    <section id="features" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white z-0"></div>
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white to-transparent z-0"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-[20%] left-[10%] w-[25rem] h-[25rem] bg-purple-100/20 rounded-full blur-3xl opacity-60 -z-10"></div>
      <div className="absolute bottom-[15%] right-[5%] w-[30rem] h-[30rem] bg-blue-100/20 rounded-full blur-3xl opacity-70 -z-10"></div>
      
      {/* Decorative grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[size:70px_70px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_20%,transparent_120%)] opacity-20"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Enhanced section header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 bg-purple-100 text-primary font-semibold text-sm rounded-full mb-4">
            Powerful Features
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">
            Create Ads That <span className="text-primary">Convert</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Picad brings together cutting-edge AI and thoughtful design to help you create stunning ad creatives that capture attention and drive results.
          </p>
          <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-blue-500 mx-auto rounded-full mt-8"></div>
        </div>

        {/* Enhanced feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="feature-card group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 transition-all duration-500 hover:scale-[1.03] overflow-hidden shadow-lg hover:shadow-xl border border-gray-100 hover:border-gray-200"
              style={{ 
                animationDelay: `${feature.delay}s`, 
                animationFillMode: "forwards",
                transitionDelay: `calc(${index} * 50ms)`
              }}
            >
              {/* Feature icon with gradient background */}
              <div className={`w-16 h-16 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br ${feature.gradient} shadow-lg ${feature.shadowColor} p-3 text-white`}>
                {feature.icon}
              </div>
              
              {/* Feature title with hover effect */}
              <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary transition-colors duration-300">
                {feature.title}
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                {feature.description}
              </p>
              
              {/* Background decorative elements */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-gradient-to-br from-purple-100/50 to-blue-100/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-150"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
