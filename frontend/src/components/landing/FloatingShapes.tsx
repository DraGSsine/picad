import React from 'react';

const FloatingShapes: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Fancy Gradient Blob 1 - Top Left */}
      <div className="absolute -top-20 -left-20 w-[400px] h-[400px] opacity-30 animate-float-slow">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-primary via-primary/60 to-accent/70 blur-[40px]"></div>
      </div>
      
      {/* Fancy Gradient Blob 2 - Top Right */}
      <div className="absolute -top-40 right-20 w-[500px] h-[500px] opacity-20 animate-float-medium">
        <div className="w-full h-full rounded-full bg-gradient-to-bl from-secondary/80 via-accent/50 to-primary/40 blur-[50px]"></div>
      </div>
      
      {/* Animated Circle - Middle Left */}
      <div className="absolute top-1/3 -left-20 opacity-40 animate-float-fast">
        <div className="w-[200px] h-[200px] rounded-full border-4 border-primary/40 backdrop-blur-sm"></div>
      </div>
      
      {/* Animated Circle - Middle Right */}
      <div className="absolute top-1/4 right-10 opacity-30 animate-pulse-slow">
        <div className="w-[150px] h-[150px] rounded-full border-2 border-secondary/30 backdrop-blur-sm"></div>
      </div>
      
      {/* Fancy Particles - Scattered */}
      <div className="absolute top-1/2 left-1/4 w-2 h-2 rounded-full bg-primary/80 animate-ping-slow"></div>
      <div className="absolute top-1/3 left-2/3 w-3 h-3 rounded-full bg-accent/70 animate-ping-slow" style={{animationDelay: "1s"}}></div>
      <div className="absolute top-3/4 left-1/3 w-2 h-2 rounded-full bg-secondary/80 animate-ping-slow" style={{animationDelay: "1.5s"}}></div>
      <div className="absolute top-1/5 right-1/3 w-1 h-1 rounded-full bg-primary/90 animate-ping-slow" style={{animationDelay: "0.7s"}}></div>
      
      {/* Abstract Shape 1 - Bottom Left */}
      <div className="absolute bottom-10 left-10 opacity-20 animate-float">
        <div className="relative">
          <div className="absolute w-[300px] h-[300px] rounded-[30%_70%_70%_30%/30%_30%_70%_70%] bg-gradient-to-r from-accent/60 to-secondary/60 blur-xl"></div>
        </div>
      </div>
      
      {/* Abstract Shape 2 - Bottom Right */}
      <div className="absolute bottom-0 right-0 opacity-30 animate-float-medium">
        <div className="relative">
          <div className="absolute w-[400px] h-[400px] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-gradient-to-l from-primary/50 to-secondary/50 blur-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default FloatingShapes;
