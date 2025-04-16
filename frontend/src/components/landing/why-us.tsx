"use client"
import React, { useState } from 'react'
import { Lightbulb, Shield, Zap, BarChart4, Clock, TrendingUp, CheckCircle, Star, ArrowRight, Sparkles, CrownIcon } from 'lucide-react'
import { Button } from '../ui/button'

const WhyUs = () => {
  const [activeCard, setActiveCard] = useState(0);

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Soft background with improved gradient elements similar to hero */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-white to-accent/20 z-0"></div>
      
      {/* Enhanced decorative elements with same color palette as hero */}
      <div className="absolute top-[5%] right-[5%] w-[45rem] h-[45rem] bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-3xl opacity-70 -z-10"></div>
      <div className="absolute bottom-[10%] left-[5%] w-[35rem] h-[35rem] bg-gradient-to-tl from-accent/20 to-secondary/20 rounded-full blur-3xl opacity-60 -z-10"></div>

      {/* Soft accent lines matching hero */}
      <div className="absolute top-[15%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-secondary/40 to-transparent"></div>
      <div className="absolute bottom-[15%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-secondary/40 to-transparent"></div>

      <div className="container px-4 mx-auto relative z-10">
        {/* Section header matching hero component styling */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-secondary/50 to-accent/50 text-foreground font-semibold text-sm rounded-full mb-6 animate-fade-in shadow-sm border border-secondary/30">
            <Sparkles className="mr-2 h-4 w-4 text-primary" />
            <span>Why People Choose Us</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground animate-fade-in tracking-tight">
            Elevate Your <span className="relative">
              <span className="relative z-10 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Experience
              </span>
              <span className="absolute bottom-1 left-0 w-full h-5 bg-gradient-to-r from-accent/60 to-accent/30 -z-0 rounded-sm transform -rotate-1"></span>
            </span>
          </h2>
          
          <div className="flex items-center justify-center gap-1 mb-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="relative">
                <Star className="w-5 h-5 fill-secondary stroke-secondary drop-shadow-md" />
                <div className="absolute inset-0 animate-ping-slow opacity-30">
                  <Star className="w-5 h-5 fill-secondary stroke-secondary" />
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-lg md:text-xl text-foreground/90 max-w-3xl mx-auto leading-relaxed animate-fade-in">
            Experience unparalleled innovation with our award-winning platform 
            designed to transform every aspect of your business.
          </p>
        </div>

        {/* 3D-style card grid with hover effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {/* Card 1 */}
          <div 
            className={`group relative bg-gradient-to-br from-card to-card/80 backdrop-blur-md rounded-[2rem] p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-primary/10 hover:border-primary/30 overflow-hidden transform hover:-translate-y-2 ${activeCard === 0 ? 'ring-2 ring-primary/30 ring-offset-4 ring-offset-background/80' : ''}`}
            onMouseEnter={() => setActiveCard(0)}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -mr-20 -mt-20 group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-500"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary/5 rounded-full -ml-20 -mb-20 group-hover:scale-110 transition-all duration-500"></div>
            
            <div className="relative">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-8 bg-gradient-to-br from-primary/20 to-primary/5 group-hover:from-primary group-hover:to-primary/80 transition-all duration-500 shadow-lg group-hover:shadow-primary/20">
                <Lightbulb className="w-7 h-7 text-primary group-hover:text-white transition-all duration-500" />
              </div>
              
              <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-all duration-300 flex items-center gap-2">
                Innovative Solutions
                <span className="h-px w-0 bg-primary group-hover:w-12 transition-all duration-500"></span>
              </h3>
              
              <p className="text-foreground/90 text-lg leading-relaxed">
                Our cutting-edge technology and forward-thinking approach ensure you stay ahead of the competition.
              </p>
              
              <div className="mt-8 space-y-3 relative">
                <div className="absolute -left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent"></div>
                <div className="flex items-center gap-3 transition-transform duration-300 hover:translate-x-1">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-secondary/60 to-accent/40 flex items-center justify-center shadow-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-primary/80"></div>
                  </div>
                  <span className="text-foreground/90">AI-powered automation</span>
                </div>
                <div className="flex items-center gap-3 transition-transform duration-300 hover:translate-x-1">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-secondary/60 to-accent/40 flex items-center justify-center shadow-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-primary/80"></div>
                  </div>
                  <span className="text-foreground/90">Proprietary algorithms</span>
                </div>
              </div>
              
              <div className="mt-10 pt-6 border-t border-primary/10">
                <button className="flex items-center justify-between w-full text-primary font-medium">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div 
            className={`group relative bg-gradient-to-br from-card to-card/80 backdrop-blur-md rounded-[2rem] p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-secondary/10 hover:border-secondary/30 overflow-hidden transform hover:-translate-y-2 ${activeCard === 1 ? 'ring-2 ring-secondary/30 ring-offset-4 ring-offset-background/80' : ''}`}
            onMouseEnter={() => setActiveCard(1)}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/5 rounded-full -mr-20 -mt-20 group-hover:bg-secondary/10 group-hover:scale-110 transition-all duration-500"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/5 rounded-full -ml-20 -mb-20 group-hover:scale-110 transition-all duration-500"></div>
            
            <div className="relative">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-8 bg-gradient-to-br from-secondary/20 to-secondary/5 group-hover:from-secondary group-hover:to-secondary/80 transition-all duration-500 shadow-lg group-hover:shadow-secondary/20">
                <Shield className="w-7 h-7 text-secondary-foreground group-hover:text-secondary-foreground transition-all duration-500" />
              </div>
              
              <h3 className="text-2xl font-bold mb-4 group-hover:text-secondary-foreground transition-all duration-300 flex items-center gap-2">
                Unmatched Security
                <span className="h-px w-0 bg-secondary group-hover:w-12 transition-all duration-500"></span>
              </h3>
              
              <p className="text-foreground/90 text-lg leading-relaxed">
                Your data's security is our priority with enterprise-grade protection and compliance measures.
              </p>
              
              <div className="mt-8 space-y-3 relative">
                <div className="absolute -left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-secondary/30 to-transparent"></div>
                <div className="flex items-center gap-3 transition-transform duration-300 hover:translate-x-1">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-secondary/60 to-accent/40 flex items-center justify-center shadow-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-primary/80"></div>
                  </div>
                  <span className="text-foreground/90">End-to-end encryption</span>
                </div>
                <div className="flex items-center gap-3 transition-transform duration-300 hover:translate-x-1">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-secondary/60 to-accent/40 flex items-center justify-center shadow-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-primary/80"></div>
                  </div>
                  <span className="text-foreground/90">Regular security audits</span>
                </div>
              </div>
              
              <div className="mt-10 pt-6 border-t border-secondary/10">
                <button className="flex items-center justify-between w-full text-secondary-foreground font-medium">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div 
            className={`group relative bg-gradient-to-br from-card to-card/80 backdrop-blur-md rounded-[2rem] p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-primary/10 hover:border-primary/30 overflow-hidden transform hover:-translate-y-2 ${activeCard === 2 ? 'ring-2 ring-primary/30 ring-offset-4 ring-offset-background/80' : ''}`}
            onMouseEnter={() => setActiveCard(2)}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -mr-20 -mt-20 group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-500"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary/5 rounded-full -ml-20 -mb-20 group-hover:scale-110 transition-all duration-500"></div>
            
            <div className="relative">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-8 bg-gradient-to-br from-primary/20 to-primary/5 group-hover:from-primary group-hover:to-primary/80 transition-all duration-500 shadow-lg group-hover:shadow-primary/20">
                <Zap className="w-7 h-7 text-primary group-hover:text-white transition-all duration-500" />
              </div>
              
              <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-all duration-300 flex items-center gap-2">
                Lightning Fast
                <span className="h-px w-0 bg-primary group-hover:w-12 transition-all duration-500"></span>
              </h3>
              
              <p className="text-foreground/90 text-lg leading-relaxed">
                Experience blazing-fast performance with our optimized architecture and responsive design.
              </p>
              
              <div className="mt-8 space-y-3 relative">
                <div className="absolute -left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent"></div>
                <div className="flex items-center gap-3 transition-transform duration-300 hover:translate-x-1">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-secondary/60 to-accent/40 flex items-center justify-center shadow-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-primary/80"></div>
                  </div>
                  <span className="text-foreground/90">99.9% uptime guarantee</span>
                </div>
                <div className="flex items-center gap-3 transition-transform duration-300 hover:translate-x-1">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-secondary/60 to-accent/40 flex items-center justify-center shadow-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-primary/80"></div>
                  </div>
                  <span className="text-foreground/90">Global CDN network</span>
                </div>
              </div>
              
              <div className="mt-10 pt-6 border-t border-primary/10">
                <button className="flex items-center justify-between w-full text-primary font-medium">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div 
            className={`group relative bg-gradient-to-br from-card to-card/80 backdrop-blur-md rounded-[2rem] p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-secondary/10 hover:border-secondary/30 overflow-hidden transform hover:-translate-y-2 ${activeCard === 3 ? 'ring-2 ring-secondary/30 ring-offset-4 ring-offset-background/80' : ''}`}
            onMouseEnter={() => setActiveCard(3)}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/5 rounded-full -mr-20 -mt-20 group-hover:bg-secondary/10 group-hover:scale-110 transition-all duration-500"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/5 rounded-full -ml-20 -mb-20 group-hover:scale-110 transition-all duration-500"></div>
            
            <div className="relative">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-8 bg-gradient-to-br from-secondary/20 to-secondary/5 group-hover:from-secondary group-hover:to-secondary/80 transition-all duration-500 shadow-lg group-hover:shadow-secondary/20">
                <BarChart4 className="w-7 h-7 text-secondary-foreground group-hover:text-secondary-foreground transition-all duration-500" />
              </div>
              
              <h3 className="text-2xl font-bold mb-4 group-hover:text-secondary-foreground transition-all duration-300 flex items-center gap-2">
                Data-Driven Insights
                <span className="h-px w-0 bg-secondary group-hover:w-12 transition-all duration-500"></span>
              </h3>
              
              <p className="text-foreground/90 text-lg leading-relaxed">
                Make informed decisions with comprehensive analytics and actionable business intelligence.
              </p>
              
              <div className="mt-8 space-y-3 relative">
                <div className="absolute -left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-secondary/30 to-transparent"></div>
                <div className="flex items-center gap-3 transition-transform duration-300 hover:translate-x-1">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-secondary/60 to-accent/40 flex items-center justify-center shadow-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-primary/80"></div>
                  </div>
                  <span className="text-foreground/90">Real-time dashboards</span>
                </div>
                <div className="flex items-center gap-3 transition-transform duration-300 hover:translate-x-1">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-secondary/60 to-accent/40 flex items-center justify-center shadow-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-primary/80"></div>
                  </div>
                  <span className="text-foreground/90">Custom reporting tools</span>
                </div>
              </div>
              
              <div className="mt-10 pt-6 border-t border-secondary/10">
                <button className="flex items-center justify-between w-full text-secondary-foreground font-medium">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 5 */}
          <div 
            className={`group relative bg-gradient-to-br from-card to-card/80 backdrop-blur-md rounded-[2rem] p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-primary/10 hover:border-primary/30 overflow-hidden transform hover:-translate-y-2 ${activeCard === 4 ? 'ring-2 ring-primary/30 ring-offset-4 ring-offset-background/80' : ''}`}
            onMouseEnter={() => setActiveCard(4)}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -mr-20 -mt-20 group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-500"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary/5 rounded-full -ml-20 -mb-20 group-hover:scale-110 transition-all duration-500"></div>
            
            <div className="relative">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-8 bg-gradient-to-br from-primary/20 to-primary/5 group-hover:from-primary group-hover:to-primary/80 transition-all duration-500 shadow-lg group-hover:shadow-primary/20">
                <Clock className="w-7 h-7 text-primary group-hover:text-white transition-all duration-500" />
              </div>
              
              <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-all duration-300 flex items-center gap-2">
                24/7 Support
                <span className="h-px w-0 bg-primary group-hover:w-12 transition-all duration-500"></span>
              </h3>
              
              <p className="text-foreground/90 text-lg leading-relaxed">
                Count on our dedicated team for round-the-clock support whenever you need assistance.
              </p>
              
              <div className="mt-8 space-y-3 relative">
                <div className="absolute -left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent"></div>
                <div className="flex items-center gap-3 transition-transform duration-300 hover:translate-x-1">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-secondary/60 to-accent/40 flex items-center justify-center shadow-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-primary/80"></div>
                  </div>
                  <span className="text-foreground/90">Live chat support</span>
                </div>
                <div className="flex items-center gap-3 transition-transform duration-300 hover:translate-x-1">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-secondary/60 to-accent/40 flex items-center justify-center shadow-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-primary/80"></div>
                  </div>
                  <span className="text-foreground/90">Dedicated account manager</span>
                </div>
              </div>
              
              <div className="mt-10 pt-6 border-t border-primary/10">
                <button className="flex items-center justify-between w-full text-primary font-medium">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 6 */}
          <div 
            className={`group relative bg-gradient-to-br from-card to-card/80 backdrop-blur-md rounded-[2rem] p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-secondary/10 hover:border-secondary/30 overflow-hidden transform hover:-translate-y-2 ${activeCard === 5 ? 'ring-2 ring-secondary/30 ring-offset-4 ring-offset-background/80' : ''}`}
            onMouseEnter={() => setActiveCard(5)}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/5 rounded-full -mr-20 -mt-20 group-hover:bg-secondary/10 group-hover:scale-110 transition-all duration-500"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/5 rounded-full -ml-20 -mb-20 group-hover:scale-110 transition-all duration-500"></div>
            
            <div className="relative">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-8 bg-gradient-to-br from-secondary/20 to-secondary/5 group-hover:from-secondary group-hover:to-secondary/80 transition-all duration-500 shadow-lg group-hover:shadow-secondary/20">
                <TrendingUp className="w-7 h-7 text-secondary-foreground group-hover:text-secondary-foreground transition-all duration-500" />
              </div>
              
              <h3 className="text-2xl font-bold mb-4 group-hover:text-secondary-foreground transition-all duration-300 flex items-center gap-2">
                Scalable Growth
                <span className="h-px w-0 bg-secondary group-hover:w-12 transition-all duration-500"></span>
              </h3>
              
              <p className="text-foreground/90 text-lg leading-relaxed">
                Our platform grows with your business, ensuring seamless scaling without performance compromises.
              </p>
              
              <div className="mt-8 space-y-3 relative">
                <div className="absolute -left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-secondary/30 to-transparent"></div>
                <div className="flex items-center gap-3 transition-transform duration-300 hover:translate-x-1">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-secondary/60 to-accent/40 flex items-center justify-center shadow-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-primary/80"></div>
                  </div>
                  <span className="text-foreground/90">Flexible architecture</span>
                </div>
                <div className="flex items-center gap-3 transition-transform duration-300 hover:translate-x-1">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-secondary/60 to-accent/40 flex items-center justify-center shadow-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-primary/80"></div>
                  </div>
                  <span className="text-foreground/90">Easy resource expansion</span>
                </div>
              </div>
              
              <div className="mt-10 pt-6 border-t border-secondary/10">
                <button className="flex items-center justify-between w-full text-secondary-foreground font-medium">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA section matching hero styling */}
        <div className="mt-20 text-center relative px-4 py-16">
          {/* Fancy background for CTA matching hero */}
          <div className="absolute inset-0 rounded-[2rem] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background to-secondary/10"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px] opacity-30"></div>
            <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-primary/10 to-transparent"></div>
            <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-secondary/10 to-transparent"></div>
          </div>

          <div className="relative">
            <div className="max-w-md mx-auto">
              <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Ready to Transform Your Business?</h3>
              
              <div className="relative mt-8">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground hover:from-primary/90 hover:to-primary/80 font-semibold px-10 py-7 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border border-primary/10"
                >
                  <span className="flex items-center justify-center gap-2">
                    Get Started Today
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </div>
              
              <p className="mt-8 text-base text-foreground/90">
                Join <span className="font-semibold text-foreground">10,000+</span> satisfied customers who have transformed their business
              </p>
              
              <div className="flex justify-center items-center mt-6 space-x-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-background overflow-hidden shadow-sm">
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20"></div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-secondary stroke-secondary" />
                    ))}
                  </div>
                  <span className="ml-2 font-medium">4.9/5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </section>
  )
}

export default WhyUs