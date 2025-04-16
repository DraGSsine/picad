import React from 'react';

const FloatingShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Soft pastel gradient blob */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-[#A7BEAE]/30 to-[#8E4585]/20 rounded-full blur-[120px] animate-float-slow"></div>
      
      {/* Muted sage gradient blob */}
      <div className="absolute top-[5%] right-[10%] w-64 h-64 bg-gradient-to-br from-[#A7BEAE]/30 to-[#E7E8D1]/40 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }}></div>
      
      {/* Peach blob - gives elegant feeling */}
      <div className="absolute bottom-[15%] left-[8%] w-80 h-80 bg-gradient-to-br from-[#FFDAB9]/30 to-[#FFDAB9]/20 rounded-full blur-[110px] animate-float-reverse" style={{ animationDelay: '1.5s' }}></div>
      
      {/* Soft plum blob */}
      <div className="absolute bottom-[25%] right-[3%] w-72 h-72 bg-gradient-to-br from-[#8E4585]/25 to-[#8E4585]/15 rounded-full blur-[120px] animate-float-slow" style={{ animationDelay: '3.5s' }}></div>
      
      {/* Smaller decorative elements - subtle accents */}
      <div className="absolute top-[30%] right-[25%] w-20 h-20 bg-[#FFDAB9]/15 rounded-full blur-xl animate-pulse-slow" style={{ animationDelay: '2.2s' }}></div>
      <div className="absolute top-[60%] left-[20%] w-24 h-24 bg-[#8E4585]/10 rounded-full blur-xl animate-pulse-slow" style={{ animationDelay: '3.7s' }}></div>
      
      {/* Elegant geometric shapes */}
      <div className="absolute top-[10%] left-[15%] w-16 h-16 bg-[#A7BEAE]/20 transform rotate-45 rounded-sm blur-lg animate-float-slow" style={{ animationDelay: '1.3s' }}></div>
      <div className="absolute top-[20%] left-[30%] w-12 h-12 bg-[#FFDAB9]/20 transform rotate-45 rounded-sm blur-lg animate-float-reverse" style={{ animationDelay: '2.7s' }}></div>
      <div className="absolute top-[8%] left-[45%] w-14 h-14 bg-[#A7BEAE]/20 transform rotate-45 rounded-sm blur-lg animate-float" style={{ animationDelay: '3.3s' }}></div>
      
      {/* Tiny sparkles */}
      <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-[#FFDAB9] rounded-full opacity-40 animate-glow-ping"></div>
      <div className="absolute top-3/4 left-1/2 w-1.5 h-1.5 bg-[#8E4585] rounded-full opacity-30 animate-glow-ping" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-3/4 w-2.5 h-2.5 bg-[#A7BEAE] rounded-full opacity-70 animate-glow-ping" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-2/3 left-1/3 w-1.5 h-1.5 bg-[#8E4585] rounded-full opacity-50 animate-glow" style={{ animationDelay: '2.5s' }}></div>
      <div className="absolute top-3/4 left-1/2 w-1.5 h-1.5 bg-[#A7BEAE] rounded-full opacity-50 animate-glow-slow" style={{ animationDelay: '1s' }}></div>
      
      {/* Elegant decorative borders/lines */}
      <div className="absolute top-[15%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#8E4585]/20 to-transparent"></div>
      <div className="absolute top-[85%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#A7BEAE]/20 to-transparent"></div>
      
      {/* Soft angled decorative panels */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-r from-[#A7BEAE]/10 via-[#8E4585]/10 to-[#FFDAB9]/10 transform -skew-y-6 opacity-60 blur-2xl"></div>
      <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-r from-[#FFDAB9]/10 via-[#8E4585]/10 to-[#A7BEAE]/10 transform skew-y-6 opacity-60 blur-2xl"></div>
      
      {/* Pulsing orbs */}
      <div className="absolute top-1/4 right-1/4 w-40 h-40 rounded-full radial-pulse"></div>
      <div className="absolute bottom-1/3 left-1/5 w-40 h-40 rounded-full radial-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Elegant arc element at the top */}
      <div className="absolute top-[5%] left-1/2 transform -translate-x-1/2 w-40 h-20">
        <div className="absolute left-0 w-8 h-16 bg-[#FFDAB9]/20 rounded-full blur-xl transform -rotate-12"></div>
        <div className="absolute left-[calc(50%-10px)] w-10 h-20 bg-[#A7BEAE]/20 rounded-full blur-xl"></div>
        <div className="absolute right-0 w-8 h-16 bg-[#FFDAB9]/20 rounded-full blur-xl transform rotate-12"></div>
      </div>
    </div>
  );
};

export default FloatingShapes;
