"use client";
import React, { useState } from 'react';
import { Cancel01Icon, PaintBoardIcon } from 'hugeicons-react';
import Image from 'next/image';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

// Import Template interface 
interface Template {
  id: number;
  name: string;
  category: string;
  imageUrl: string;
}

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  templates: Template[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  setActiveTemplate: (template: Template) => void;
  loading?: boolean; // New prop
}

const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  categories,
  templates,
  selectedCategory,
  setSelectedCategory,
  setActiveTemplate,
  loading = false, // Default to false
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredTemplates = templates.filter(template => 
    (selectedCategory === 'all' || template.category === selectedCategory) &&
    (searchQuery === '' || template.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all">
      <div className="bg-background/95 rounded-3xl w-full max-w-[90vw] md:max-w-[85vw] h-[90vh] flex flex-col shadow-xl overflow-hidden animate-in fade-in zoom-in-95 relative gradient-border">
        {/* Decorative background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[30%] -right-[10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[120px] animate-float-slow"></div>
          <div className="absolute -bottom-[25%] -left-[10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[100px] animate-float-reverse"></div>
        </div>
        
        {/* Modal header */}
        <div className="relative z-10 p-5 md:p-6 border-b border-border/30 flex items-center justify-between bg-gradient-to-r from-primary/5 to-background">
          <div className="flex-1 max-w-md relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <Input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-10 py-2 border border-primary/20 rounded-full focus:ring-primary/30 focus:border-primary/30 bg-card/80 focus:bg-card/95 transition-all duration-300 placeholder-muted-foreground/70"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-primary transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          
          <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mx-4 hidden md:block">
            Template Gallery
          </h2>
          
          <button 
            onClick={onClose}
            className="p-2 hover:bg-primary/10 rounded-full transition-colors group"
          >
            <Cancel01Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors group-hover:rotate-90 transform duration-300" />
          </button>
        </div>
        
        {/* Modal content */}
        <div className="relative z-10 flex-1 flex flex-col md:flex-row gap-5 md:gap-6 p-5 md:p-6 overflow-hidden">
          {/* Categories sidebar */}
          <div className="w-full md:w-64 flex flex-col bg-card/50 backdrop-blur-sm rounded-2xl shadow-sm border border-primary/10 p-4">
            {/* Categories header */}
            <h3 className="text-sm font-medium text-foreground mb-4 pl-2 flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mr-2 shadow-inner">
                <PaintBoardIcon className="h-4 w-4 text-primary" />
              </div>
              Categories
            </h3>
            
            {/* Categories list with scrollable container */}
            <div className="space-y-1.5 overflow-y-auto max-h-full md:max-h-none custom-scrollbar pr-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-primary font-medium shadow-sm'
                      : 'text-foreground/80 hover:bg-primary/5 hover:text-primary'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                  {selectedCategory === category && (
                    <div className="h-1 w-10 bg-gradient-to-r from-primary to-secondary rounded-full mt-1.5 opacity-80"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Templates grid with updated masonry layout */}
          <div className="flex-1 bg-card/50 backdrop-blur-sm rounded-2xl shadow-sm border border-primary/10 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border/20 flex justify-between items-center">
              <h3 className="text-sm font-medium text-foreground">
                <span className="text-primary">{filteredTemplates.length}</span> templates found
              </h3>
              {loading && (
                <div className="flex items-center gap-2 text-xs text-primary">
                  <div className="h-3 w-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </div>
              )}
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center p-8 flex-1">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="h-16 w-16 border-4 border-primary/30 rounded-full animate-pulse"></div>
                    <div className="h-16 w-16 border-4 border-t-primary border-r-primary border-b-transparent border-l-transparent rounded-full animate-spin absolute inset-0"></div>
                  </div>
                  <p className="text-sm text-foreground/70">Loading templates...</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                {filteredTemplates.length === 0 ? (
                  <div className="flex items-center justify-center h-full p-8 text-center">
                    <div className="max-w-sm space-y-4">
                      <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shadow-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary/40" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-foreground">No templates found</h3>
                      <p className="text-sm text-muted-foreground">Try adjusting your search or category selection to find more templates.</p>
                      {searchQuery && (
                        <Button 
                          onClick={() => setSearchQuery('')}
                          variant="outline"
                          className="border-primary/20 text-primary hover:bg-primary/5"
                        >
                          Clear Search
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {filteredTemplates.map((template) => (
                      <div 
                        key={template.id}
                        className="group aspect-[9/16] rounded-xl overflow-hidden cursor-pointer border border-primary/10 hover:ring-2 hover:ring-primary/40 hover:border-transparent shadow-sm hover:shadow-md hover:shadow-primary/10 transition-all duration-300 transform hover:scale-[1.02] bg-card/30"
                        onClick={() => {
                          setActiveTemplate(template);
                          onClose();
                        }}
                      >
                        <div className="relative h-full">
                          {/* Subtle gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"></div>
                          
                          <Image
                            src={template.imageUrl}
                            alt={template.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          
                          {/* Template info overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 z-20">
                            <Badge className="self-start mb-1.5 bg-card/90 text-foreground border-none shadow-sm text-xs">
                              {template.category}
                            </Badge>
                            <p className="text-xs text-white font-medium truncate">
                              {template.name}
                            </p>
                            <div className="h-1 w-8 bg-gradient-to-r from-primary to-secondary rounded-full mt-2 opacity-80"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateModal;
