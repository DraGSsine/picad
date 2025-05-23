import React from 'react';
import Image from 'next/image';
import { SparklesIcon } from "lucide-react";

// Testimonials data with high-quality images
const testimonialsData = [
  {
    id: 1,
    text: "I was at my wit's end with design tools until I found Picad. It's like it reads my mind - I describe what I need and boom, usable ad in minutes. My campaign click-throughs are up 47% since switching.",
    name: "Akram Olika",
    title: "Independent Craft Retailer",
    avatar: "https://images.unsplash.com/photo-1621389099366-a82b750ba2b3?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 5,
  },
  {
    id: 2,
    text: "Look, I'm not a tech person. At all. But Picad doesn't care - it just works. I mumble something about 'forest vibes for my handmade soaps' and out pops something I'd have paid a designer $300 for. Game-changer.",
    name: "Thaddeus Wozniak",
    title: "Digital Marketer",
    avatar: "https://images.unsplash.com/photo-1696238250459-d99f9522a0e8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 5,
  },
  {
    id: 3,
    text: "Running a food truck meant I was doing everything - cooking, serving, AND marketing. My social posts looked terrible until Picad. Now people actually stop scrolling when they see my daily specials. Worth every penny.",
    name: "Xiomara Nunez",
    title: "Food Truck Owner",
    avatar: "https://images.unsplash.com/photo-1567037782848-d0fe9a51ec4c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=512&q=100",
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
    <section id='testimonials' className="py-16 md:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Left Column: Text Content */}
          <div className="w-full lg:w-1/3 space-y-6 animate-fade-in text-center lg:text-left" style={{ animationDelay: "0.1s" }}>
            <div className="inline-flex items-center px-5 py-2 bg-white/80 text-foreground font-semibold text-sm rounded-full mb-6 shadow-sm border border-secondary/30">
              <SparklesIcon className="mr-2 h-4 w-4 text-primary" />
              <span>Real Customer Stories</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight">
              From Actual <span className="relative">
                <span className="relative z-10 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">People Like You</span>
                <span className="absolute bottom-1 left-0 w-full h-5 bg-gradient-to-r from-accent/60 to-accent/30 -z-0 rounded-sm transform -rotate-1"></span>
              </span>
            </h2>
            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed">
              No marketing fluff. Just honest stories from small business owners who were skeptical at first too.
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent/80 rounded-full my-4 mx-auto lg:mx-0"></div>
          </div>

          {/* Right Column: Testimonial Cards - Completely restructured for mobile */}
          <div className="flex flex-col lg:flex-row items-center lg:w-[60%] gap-6">
            {/* Card 1 */}
            <div className="bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg space-y-4 border border-secondary/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative animate-fade-in h-full" style={{ animationDelay: "0.2s" }}>
              {/* Decorative quote mark */}
              <div className="absolute -top-3 -left-3 bg-gradient-to-r from-primary via-primary/90 to-primary text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223z" clipRule="evenodd" />
                </svg>
              </div>
              <StarRating rating={testimonialsData[0].rating} />
              <p className="text-foreground/90 font-medium italic mb-6">&ldquo;{testimonialsData[0].text}&rdquo;</p>
              <div className="flex items-center pt-4 border-t border-secondary/30">
                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full overflow-hidden relative mr-4 ring-2 ring-secondary/30">
                  <Image 
                    src={testimonialsData[0].avatar} 
                    alt={testimonialsData[0].name} 
                    fill
                    sizes="(max-width: 768px) 48px, 64px"
                    className="object-cover"
                    style={{ objectPosition: 'center' }}
                    priority
                    quality={100}
                  />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonialsData[0].name}</p>
                  <p className="text-sm text-primary">{testimonialsData[0].title}</p>
                </div>
              </div>
            </div>

            {/* Column for cards 2 and 3 stacked vertically */}
            <div className="space-y-6 flex flex-col">
              {/* Card 2 */}
              <div className="bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg space-y-4 border border-secondary/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative animate-fade-in h-full" style={{ animationDelay: "0.3s" }}>
                {/* Decorative quote mark */}
                <div className="absolute -top-3 -left-3 bg-gradient-to-r from-primary via-primary/90 to-primary text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223z" clipRule="evenodd" />
                  </svg>
                </div>
                <StarRating rating={testimonialsData[1].rating} />
                <p className="text-foreground/90 font-medium italic mb-6">&ldquo;{testimonialsData[1].text}&rdquo;</p>
                <div className="flex items-center pt-4 border-t border-secondary/30">
                  <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full overflow-hidden relative mr-4 ring-2 ring-secondary/30">
                    <Image 
                      src={testimonialsData[1].avatar} 
                      alt={testimonialsData[1].name} 
                      fill
                      sizes="(max-width: 768px) 48px, 64px"
                      className="object-cover"
                      style={{ objectPosition: 'center' }}
                      priority
                      quality={100}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonialsData[1].name}</p>
                    <p className="text-sm text-primary">{testimonialsData[1].title}</p>
                  </div>
                </div>
              </div>

              {/* Card 3 - Only visible on larger screens */}
              <div className="hidden md:block bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg space-y-4 border border-secondary/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative animate-fade-in h-full" style={{ animationDelay: "0.4s" }}>
                {/* Decorative quote mark */}
                <div className="absolute -top-3 -left-3 bg-gradient-to-r from-primary via-primary/90 to-primary text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223z" clipRule="evenodd" />
                  </svg>
                </div>
                <StarRating rating={testimonialsData[2].rating} />
                <p className="text-foreground/90 font-medium italic mb-6">&ldquo;{testimonialsData[2].text}&rdquo;</p>
                <div className="flex items-center pt-4 border-t border-secondary/30">
                  <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full overflow-hidden relative mr-4 ring-2 ring-secondary/30">
                    <Image 
                      src={testimonialsData[2].avatar} 
                      alt={testimonialsData[2].name}
                      fill
                      sizes="(max-width: 768px) 48px, 64px"
                      className="object-cover"
                      style={{ objectPosition: 'center' }}
                      priority
                      quality={100}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonialsData[2].name}</p>
                    <p className="text-sm text-primary">{testimonialsData[2].title}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Card 3 - Only visible on small screens (mobile) */}
            <div className="md:hidden bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg space-y-4 border border-secondary/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative animate-fade-in h-full" style={{ animationDelay: "0.4s" }}>
              {/* Decorative quote mark */}
              <div className="absolute -top-3 -left-3 bg-gradient-to-r from-primary via-primary/90 to-primary text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223z" clipRule="evenodd" />
                </svg>
              </div>
              <StarRating rating={testimonialsData[2].rating} />
              <p className="text-foreground/90 font-medium italic mb-6">&ldquo;{testimonialsData[2].text}&rdquo;</p>
              <div className="flex items-center pt-4 border-t border-secondary/30">
                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full overflow-hidden relative mr-4 ring-2 ring-secondary/30">
                  <Image 
                    src={testimonialsData[2].avatar} 
                    alt={testimonialsData[2].name}
                    fill
                    sizes="(max-width: 768px) 48px, 64px"
                    className="object-cover"
                    style={{ objectPosition: 'center' }}
                    priority
                    quality={100}
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
    </section>
  );
};

export default Testimonials;
