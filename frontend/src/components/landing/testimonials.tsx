import React from "react";
import { 
  Star, 
  ArrowLeft, 
  ArrowRight,
  SparklesIcon,
  Quote
} from "lucide-react";
import { Button } from "../ui/button";

const Testimonials = () => {
  // Sample testimonial data
  const testimonialData = [
    {
      quote: "Picad has completely transformed how we create ad creatives. What used to take hours now happens in seconds, and the quality is even better!",
      name: "Sarah Johnson",
      role: "Marketing Director, StyleHub",
      avatar: "/avatars/avatar-1.jpg",
      rating: 5,
    },
    {
      quote: "The AI brush tool is a game-changer. I was able to remove backgrounds and add elements to my product photos without any design skills.",
      name: "Michael Chen",
      role: "E-commerce Manager, TechGear",
      avatar: "/avatars/avatar-2.jpg",
      rating: 5,
    },
    {
      quote: "Our ad conversion rates increased by 37% after switching to designs created with Picad. The templates are not only beautiful but highly effective.",
      name: "Jessica Williams",
      role: "Digital Ads Specialist, FitFocus",
      avatar: "/avatars/avatar-3.jpg",
      rating: 5,
    }
  ];

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
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section header with styling matching hero */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-secondary/50 to-accent/50 text-foreground font-semibold text-sm rounded-full mb-6 animate-fade-in shadow-sm border border-secondary/30">
            <SparklesIcon className="mr-2 h-4 w-4 text-primary" />
            <span>Customer Feedback</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground animate-fade-in tracking-tight">
            What Our Clients <span className="relative">
              <span className="relative z-10 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Are Saying
              </span>
              <span className="absolute bottom-1 left-0 w-full h-5 bg-gradient-to-r from-accent/60 to-accent/30 -z-0 rounded-sm transform -rotate-1"></span>
            </span>
          </h2>
          <p className="text-lg md:text-xl text-foreground/90 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            Discover how businesses are transforming their advertising with our AI-powered platform.
          </p>
        </div>
        
        {/* Testimonials grid with styling matching hero */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialData.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-secondary/20 hover:border-primary/30 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 relative animate-fade-in"
              style={{ animationDelay: `${0.2 + (index * 0.1)}s` }}
            >
              {/* Decorative corner accent matching hero */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/10 via-secondary/10 to-primary/10 rounded-bl-[3rem] -z-0"></div>
              
              <div className="relative">
                {/* Quote icon */}
                <div className="absolute -top-2 -left-2 text-primary/20">
                  <Quote size={40} />
                </div>
                
                {/* Rating stars with hero-matching styling */}
                <div className="flex mb-4 mt-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={18} className="fill-secondary stroke-secondary" />
                  ))}
                </div>
                
                {/* Testimonial quote */}
                <p className="text-foreground/90 mb-6 relative z-10">"{testimonial.quote}"</p>
                
                {/* Customer info with hero-matching styling */}
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 flex-shrink-0">
                    {/* Avatar placeholder */}
                    <div className="w-full h-full"></div>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-foreground/70">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation controls with styling matching hero */}
        <div className="mt-12 flex justify-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            className="rounded-full w-10 h-10 bg-white/70 border-secondary/30 text-foreground hover:bg-white hover:border-primary/30 transition-all duration-300"
          >
            <ArrowLeft size={18} />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            className="rounded-full w-10 h-10 bg-white/70 border-secondary/30 text-foreground hover:bg-white hover:border-primary/30 transition-all duration-300"
          >
            <ArrowRight size={18} />
          </Button>
        </div>
        
        {/* Trust indicators with styling matching hero */}
        <div className="mt-16 text-center">
          <p className="text-foreground/90 font-medium mb-6">Trusted by leading brands worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i} 
                className="h-12 w-24 bg-gradient-to-r from-foreground/5 to-foreground/10 rounded-lg opacity-60"
              ></div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};

export default Testimonials;
