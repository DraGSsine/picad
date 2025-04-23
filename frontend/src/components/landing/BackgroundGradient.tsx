import React from 'react';

const BackgroundGradient = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Elegant base background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/90"></div>
      
      {/* Refined primary gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5"></div>
      
      {/* Sophisticated accent color highlights */}
      <div className="absolute top-0 left-0 w-full h-2/3 bg-gradient-to-br from-primary/10 via-transparent to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-2/3 h-full bg-gradient-to-tl from-secondary/10 via-accent/5 to-transparent"></div>
      
      {/* Elegant edge lighting */}
      <div className="absolute top-0 w-full h-[5px] bg-gradient-to-b from-white/5 to-transparent"></div>
      <div className="absolute bottom-0 w-full h-[5px] bg-gradient-to-t from-white/5 to-transparent"></div>
      <div className="absolute left-0 h-full w-[5px] bg-gradient-to-r from-white/5 to-transparent"></div>
      <div className="absolute right-0 h-full w-[5px] bg-gradient-to-l from-white/5 to-transparent"></div>
      
      {/* Subtle depth enhancement */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/10"></div>
      
      {/* Fine texture overlay for visual richness */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay"></div>
    </div>
  );
};

export default BackgroundGradient;