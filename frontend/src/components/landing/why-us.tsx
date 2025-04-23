"use client"
import React from 'react'
import { Image, Brush, History, Download, Layout, Zap, SparklesIcon, CrownIcon } from 'lucide-react'
import { Button } from '../ui/button'

const WhyUs = () => {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-background via-white to-muted/30">
      {/* Soft background with improved gradient elements - matching hero */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-white to-accent/20 z-0"></div>
      
      {/* Enhanced decorative elements with same color palette as hero */}
      <div className="absolute top-[5%] right-[5%] w-[45rem] h-[45rem] bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-3xl opacity-70 -z-10"></div>
      <div className="absolute bottom-[10%] left-[5%] w-[35rem] h-[35rem] bg-gradient-to-tl from-accent/20 to-secondary/20 rounded-full blur-3xl opacity-60 -z-10"></div>

      {/* Soft accent lines matching hero */}
      <div className="absolute top-[15%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-secondary/40 to-transparent"></div>
      <div className="absolute bottom-[15%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-secondary/40 to-transparent"></div>

      <div className="container relative z-10 px-4 mx-auto">
        {/* Section header matching hero component styling */}
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <div className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-secondary/50 to-accent/50 text-foreground font-semibold text-sm rounded-full mb-6 animate-fade-in shadow-sm border border-secondary/30">
            <CrownIcon className="mr-2 h-4 w-4 text-primary" />
            <span>Why Choose Picad</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 text-foreground animate-fade-in tracking-tight">
            Transform Your <span className="relative">
              <span className="relative z-10 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Product Photos
              </span>
              <span className="absolute bottom-1 left-0 w-full h-5 bg-gradient-to-r from-accent/60 to-accent/30 -z-0 rounded-sm transform -rotate-1"></span>
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-foreground/90 max-w-3xl mx-auto leading-relaxed animate-fade-in">
            Our AI-powered platform transforms ordinary product photos into eye-catching advertising images
            that capture attention and boost conversions.
          </p>
        </div>

        {/* Innovative overlapping feature cards with 3D perspective */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-24 px-4 md:px-8 mb-24">
          {/* Feature 1 - AI Image Generation */}
          <div className="feature-card relative z-10">
            <div className="relative flex flex-col h-full transform transition-all duration-500 hover:translate-y-[-8px] hover:translate-x-[-4px]">
              {/* Card layers for 3D effect */}
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-primary/5 rounded-3xl border border-primary/10 translate-x-2 translate-y-2"></div>
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-primary/10 rounded-3xl border border-primary/10 translate-x-1 translate-y-1"></div>
              
              {/* Main card content */}
              <div className="relative flex flex-col h-full p-8 md:p-10 rounded-3xl backdrop-blur-sm bg-white/80 border border-primary/20 shadow-xl">
                <div className="flex items-start justify-between mb-8">
                  <div className="relative">
                    <div className="absolute -inset-3 bg-primary/20 rounded-full blur-xl opacity-70"></div>
                    <div className="relative w-16 h-16 flex items-center justify-center bg-gradient-to-br from-white to-white/50 rounded-2xl border border-primary/20 shadow-lg">
                      <Image className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-secondary/60 to-accent/40 text-white font-bold text-xl shadow-lg">
                    1
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
                  AI-Powered Generation
                </h3>
                
                <p className="mb-8 text-foreground/70 leading-relaxed flex-grow">
                  Simply upload your product photo and our AI transforms it into stunning ad creatives using your selected template. Our technology enhances details while maintaining brand authenticity.
                </p>
                
                <div className="flex items-center justify-between border-t border-primary/10 pt-6 mt-auto">
                  <div className="w-20 h-1.5 bg-gradient-to-r from-primary via-secondary to-accent rounded-full"></div>
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md border border-primary/10">
                    <div className="w-6 h-6 text-primary">→</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 - Interactive Canvas */}
          <div className="feature-card relative z-10">
            <div className="relative flex flex-col h-full transform transition-all duration-500 hover:translate-y-[-8px] hover:translate-x-[-4px]">
              {/* Card layers for 3D effect */}
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-secondary/5 rounded-3xl border border-secondary/10 translate-x-2 translate-y-2"></div>
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-secondary/10 rounded-3xl border border-secondary/10 translate-x-1 translate-y-1"></div>
              
              {/* Main card content */}
              <div className="relative flex flex-col h-full p-8 md:p-10 rounded-3xl backdrop-blur-sm bg-white/80 border border-secondary/20 shadow-xl">
                <div className="flex items-start justify-between mb-8">
                  <div className="relative">
                    <div className="absolute -inset-3 bg-secondary/20 rounded-full blur-xl opacity-70"></div>
                    <div className="relative w-16 h-16 flex items-center justify-center bg-gradient-to-br from-white to-white/50 rounded-2xl border border-secondary/20 shadow-lg">
                      <Brush className="w-8 h-8 text-secondary" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-accent/60 to-secondary/40 text-white font-bold text-xl shadow-lg">
                    2
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-secondary to-foreground bg-clip-text text-transparent">
                  Interactive Canvas
                </h3>
                
                <p className="mb-8 text-foreground/70 leading-relaxed flex-grow">
                  Add text, draw highlights, or select areas for the AI to enhance with our intuitive editing tools. Fine-tune colors, adjust composition, or completely transform selected elements.
                </p>
                
                <div className="flex items-center justify-between border-t border-secondary/10 pt-6 mt-auto">
                  <div className="w-20 h-1.5 bg-gradient-to-r from-secondary via-accent to-primary rounded-full"></div>
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md border border-secondary/10">
                    <div className="w-6 h-6 text-secondary">→</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3 - Version History */}
          <div className="feature-card relative z-10">
            <div className="relative flex flex-col h-full transform transition-all duration-500 hover:translate-y-[-8px] hover:translate-x-[-4px]">
              {/* Card layers for 3D effect */}
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-accent/5 rounded-3xl border border-accent/10 translate-x-2 translate-y-2"></div>
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-accent/10 rounded-3xl border border-accent/10 translate-x-1 translate-y-1"></div>
              
              {/* Main card content */}
              <div className="relative flex flex-col h-full p-8 md:p-10 rounded-3xl backdrop-blur-sm bg-white/80 border border-accent/20 shadow-xl">
                <div className="flex items-start justify-between mb-8">
                  <div className="relative">
                    <div className="absolute -inset-3 bg-accent/20 rounded-full blur-xl opacity-70"></div>
                    <div className="relative w-16 h-16 flex items-center justify-center bg-gradient-to-br from-white to-white/50 rounded-2xl border border-accent/20 shadow-lg">
                      <History className="w-8 h-8 text-accent" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary/60 to-accent/40 text-white font-bold text-xl shadow-lg">
                    3
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-accent to-foreground bg-clip-text text-transparent">
                  Version History
                </h3>
                
                <p className="mb-8 text-foreground/70 leading-relaxed flex-grow">
                  Access your complete generation history with our checkpoint system and instantly restore any previous version. Compare iterations and refine your perfect ad creative.
                </p>
                
                <div className="flex items-center justify-between border-t border-accent/10 pt-6 mt-auto">
                  <div className="w-20 h-1.5 bg-gradient-to-r from-accent via-primary to-secondary rounded-full"></div>
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md border border-accent/10">
                    <div className="w-6 h-6 text-accent">→</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 4 - Template Library */}
          <div className="feature-card relative z-10">
            <div className="relative flex flex-col h-full transform transition-all duration-500 hover:translate-y-[-8px] hover:translate-x-[-4px]">
              {/* Card layers for 3D effect */}
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-primary/5 rounded-3xl border border-primary/10 translate-x-2 translate-y-2"></div>
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-primary/10 rounded-3xl border border-primary/10 translate-x-1 translate-y-1"></div>
              
              {/* Main card content */}
              <div className="relative flex flex-col h-full p-8 md:p-10 rounded-3xl backdrop-blur-sm bg-white/80 border border-primary/20 shadow-xl">
                <div className="flex items-start justify-between mb-8">
                  <div className="relative">
                    <div className="absolute -inset-3 bg-primary/20 rounded-full blur-xl opacity-70"></div>
                    <div className="relative w-16 h-16 flex items-center justify-center bg-gradient-to-br from-white to-white/50 rounded-2xl border border-primary/20 shadow-lg">
                      <Layout className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-secondary/60 to-accent/40 text-white font-bold text-xl shadow-lg">
                    4
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
                  Template Library
                </h3>
                
                <p className="mb-8 text-foreground/70 leading-relaxed flex-grow">
                  Choose from our extensive library of 90+ professionally designed ad templates optimized for different platforms and industries. Each template is crafted for maximum visual impact.
                </p>
                
                <div className="flex items-center justify-between border-t border-primary/10 pt-6 mt-auto">
                  <div className="w-20 h-1.5 bg-gradient-to-r from-primary via-secondary to-accent rounded-full"></div>
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md border border-primary/10">
                    <div className="w-6 h-6 text-primary">→</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 5 - Smart Selection */}
          <div className="feature-card relative z-10 lg:translate-x-1/3">
            <div className="relative flex flex-col h-full transform transition-all duration-500 hover:translate-y-[-8px] hover:translate-x-[-4px]">
              {/* Card layers for 3D effect */}
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-secondary/5 rounded-3xl border border-secondary/10 translate-x-2 translate-y-2"></div>
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-secondary/10 rounded-3xl border border-secondary/10 translate-x-1 translate-y-1"></div>
              
              {/* Main card content */}
              <div className="relative flex flex-col h-full p-8 md:p-10 rounded-3xl backdrop-blur-sm bg-white/80 border border-secondary/20 shadow-xl">
                <div className="flex items-start justify-between mb-8">
                  <div className="relative">
                    <div className="absolute -inset-3 bg-secondary/20 rounded-full blur-xl opacity-70"></div>
                    <div className="relative w-16 h-16 flex items-center justify-center bg-gradient-to-br from-white to-white/50 rounded-2xl border border-secondary/20 shadow-lg">
                      <Zap className="w-8 h-8 text-secondary" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-accent/60 to-secondary/40 text-white font-bold text-xl shadow-lg">
                    5
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-secondary to-foreground bg-clip-text text-transparent">
                  Smart Selection
                </h3>
                
                <p className="mb-8 text-foreground/70 leading-relaxed flex-grow">
                  Highlight specific areas of your product and direct the AI with natural language to enhance particular features. Our intelligent algorithms understand context and intention.
                </p>
                
                <div className="flex items-center justify-between border-t border-secondary/10 pt-6 mt-auto">
                  <div className="w-20 h-1.5 bg-gradient-to-r from-secondary via-accent to-primary rounded-full"></div>
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md border border-secondary/10">
                    <div className="w-6 h-6 text-secondary">→</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 6 - Export Options */}
          <div className="feature-card relative z-10 lg:-translate-x-1/3">
            <div className="relative flex flex-col h-full transform transition-all duration-500 hover:translate-y-[-8px] hover:translate-x-[-4px]">
              {/* Card layers for 3D effect */}
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-accent/5 rounded-3xl border border-accent/10 translate-x-2 translate-y-2"></div>
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-accent/10 rounded-3xl border border-accent/10 translate-x-1 translate-y-1"></div>
              
              {/* Main card content */}
              <div className="relative flex flex-col h-full p-8 md:p-10 rounded-3xl backdrop-blur-sm bg-white/80 border border-accent/20 shadow-xl">
                <div className="flex items-start justify-between mb-8">
                  <div className="relative">
                    <div className="absolute -inset-3 bg-accent/20 rounded-full blur-xl opacity-70"></div>
                    <div className="relative w-16 h-16 flex items-center justify-center bg-gradient-to-br from-white to-white/50 rounded-2xl border border-accent/20 shadow-lg">
                      <Download className="w-8 h-8 text-accent" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary/60 to-accent/40 text-white font-bold text-xl shadow-lg">
                    6
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-accent to-foreground bg-clip-text text-transparent">
                  Flexible Exports
                </h3>
                
                <p className="mb-8 text-foreground/70 leading-relaxed flex-grow">
                  Download your finished ad creatives in multiple formats (JPG, PNG, WebP) optimized for web or print use. Each export is optimized for maximum quality and performance.
                </p>
                
                <div className="flex items-center justify-between border-t border-accent/10 pt-6 mt-auto">
                  <div className="w-20 h-1.5 bg-gradient-to-r from-accent via-primary to-secondary rounded-full"></div>
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md border border-accent/10">
                    <div className="w-6 h-6 text-accent">→</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA section matching hero styling */}
        <div className="relative mt-12 lg:mt-24 max-w-5xl mx-auto">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-3xl blur-xl opacity-80"></div>
          <div className="relative bg-white/80 border border-secondary/30 rounded-3xl px-8 py-14 md:p-14 text-center overflow-hidden shadow-xl backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-40 h-40 bg-primary/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-secondary/10 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl"></div>
            
            <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              Create Stunning Ad Images <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Today</span>
            </h3>
            
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground hover:from-primary/90 hover:to-primary/80 font-semibold px-10 py-7 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border border-primary/10"
            >
              <SparklesIcon className="mr-2 h-5 w-5" />
              Begin Your Creation
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyUs