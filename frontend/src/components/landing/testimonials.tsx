import React from 'react';
import Image from 'next/image';
import { SparklesIcon } from "lucide-react";

// Testimonials data with Unsplash images
const testimonialsData = [
  {
    id: 1,
    text: "Picad has completely transformed how I create ads for my online store. What used to take hours now takes minutes, and the results are stunning every time.",
    name: "Emily Johnson",
    title: "Product Designer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    rating: 5,
  },
  {
    id: 2,
    text: "I was hesitant to try Picad at first, but I'm so glad I did. The AI brush tool alone has saved me countless hours of frustration with Photoshop.",
    name: "Olivia Carter",
    title: "Sales Manager",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    rating: 5,
  },
  {
    id: 3,
    text: "As a small business owner with zero design skills, Picad has been a game-changer. My ads now look professionally designed and perform significantly better.",
    name: "Wyatt Turner",
    title: "Boutique Owner",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    rating: 5,
  },
];

// Enhanced Star component for rating display
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex text-primary mb-4">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className={`h-5 w-5 ${i < rating ? 'text-primary' : 'text-gray-300'}`}
        aria-hidden="true"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const Testimonials: React.FC = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-12 lg:gap-16">
          {/* Left Column: Text Content */}
          <div className="w-full lg:w-1/3 space-y-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="inline-flex items-center px-5 py-2 bg-white/80 text-foreground font-semibold text-sm rounded-full mb-6 shadow-sm border border-secondary/30">
              <SparklesIcon className="mr-2 h-4 w-4 text-primary" />
              <span>Client Experiences</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight tracking-tight">
              What Our Users <span className="relative">
                <span className="relative z-10 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Say About Us</span>
                <span className="absolute bottom-1 left-0 w-full h-5 bg-gradient-to-r from-accent/60 to-accent/30 -z-0 rounded-sm transform -rotate-1"></span>
              </span>
            </h2>
            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed">
              Discover how our platform has transformed the way businesses create high-converting advertisements.
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent/80 rounded-full my-4"></div>
          </div>

          {/* Right Column: Testimonial Cards */}
          <div className="w-full flex justify-end items-center gap-8">
            {/* Card 1 */}
            <div className="max-w-[400px] w-full bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg space-y-4 border border-secondary/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative animate-fade-in h-auto" style={{ animationDelay: "0.2s" }}>
              {/* Decorative quote mark */}
              <div className="absolute -top-3 -left-3 bg-gradient-to-r from-primary via-primary/90 to-primary text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223z" clipRule="evenodd" />
                </svg>
              </div>
              <StarRating rating={testimonialsData[0].rating} />
              <p className="text-foreground/90 font-medium italic mb-6">&ldquo;{testimonialsData[0].text}&rdquo;</p>
              <div className="flex items-center pt-4 border-t border-secondary/30">
                <div className="h-12 w-12 rounded-full overflow-hidden relative mr-4 ring-2 ring-secondary/30">
                  <Image 
                    src={testimonialsData[0].avatar} 
                    alt={testimonialsData[0].name} 
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonialsData[0].name}</p>
                  <p className="text-sm text-primary">{testimonialsData[0].title}</p>
                </div>
              </div>
            </div>

            {/* Stacked Cards */}
            <div className="space-y-8">
              {/* Card 2 */}
              <div className="max-w-[400px] w-full bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg space-y-4 border border-secondary/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative animate-fade-in" style={{ animationDelay: "0.3s" }}>
                {/* Decorative quote mark */}
                <div className="absolute -top-3 -left-3 bg-gradient-to-r from-primary via-primary/90 to-primary text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223z" clipRule="evenodd" />
                  </svg>
                </div>
                <StarRating rating={testimonialsData[1].rating} />
                <p className="text-foreground/90 font-medium italic mb-6">&ldquo;{testimonialsData[1].text}&rdquo;</p>
                <div className="flex items-center pt-4 border-t border-secondary/30">
                  <div className="h-12 w-12 rounded-full overflow-hidden relative mr-4 ring-2 ring-secondary/30">
                    <Image 
                      src={testimonialsData[1].avatar} 
                      alt={testimonialsData[1].name} 
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonialsData[1].name}</p>
                    <p className="text-sm text-primary">{testimonialsData[1].title}</p>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="max-w-[400px] w-full bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg space-y-4 border border-secondary/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative animate-fade-in" style={{ animationDelay: "0.4s" }}>
                {/* Decorative quote mark */}
                <div className="absolute -top-3 -left-3 bg-gradient-to-r from-primary via-primary/90 to-primary text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223z" clipRule="evenodd" />
                  </svg>
                </div>
                <StarRating rating={testimonialsData[2].rating} />
                <p className="text-foreground/90 font-medium italic mb-6">&ldquo;{testimonialsData[2].text}&rdquo;</p>
                <div className="flex items-center pt-4 border-t border-secondary/30">
                  <div className="h-12 w-12 rounded-full overflow-hidden relative mr-4 ring-2 ring-secondary/30">
                    <Image 
                      src={testimonialsData[2].avatar} 
                      alt={testimonialsData[2].name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonialsData[2].name}</p>
                    <p className="text-sm text-primary">{testimonialsData[2].title}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
