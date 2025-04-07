"use client";
import React, { useState } from 'react';
import { Cancel01Icon, PaintBoardIcon } from 'hugeicons-react';
import Image from 'next/image';
import { Badge } from '../ui/badge';

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all">
      <div className="bg-white rounded-2xl w-full max-w-[90vw] md:max-w-[85vw] h-[90vh] flex flex-col shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Modal header */}
        <div className="p-5 md:p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-orange-50 to-white">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md px-4 py-2 border border-gray-200 rounded-lg focus:ring-orange-500 focus:border-orange-500 bg-white/80"
            />
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/80 rounded-full transition-colors"
          >
            <Cancel01Icon className="h-5 w-5 text-gray-500 hover:text-orange-500 transition-colors" />
          </button>
        </div>
        
        {/* Modal content */}
        <div className="flex-1 flex flex-col md:flex-row gap-5 md:gap-6 p-5 md:p-6 overflow-hidden">
          {/* Categories sidebar */}
          <div className="w-full md:w-64 flex flex-col">
            
            {/* Categories */}
            <h3 className="text-sm font-medium text-gray-900 mb-3 pl-2 flex items-center">
              <PaintBoardIcon className="h-4 w-4 mr-2 text-orange-500" />
              Categories
            </h3>
            <div className="space-y-1 overflow-y-auto max-h-40 md:max-h-none custom-scrollbar pr-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-orange-50 to-orange-100/60 text-orange-500 font-medium shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Pinterest-style masonry layout for templates */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="h-12 w-12 border-4 border-t-purple-500 border-purple-200 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 overflow-y-auto">
                {filteredTemplates.map((template) => (
                  <div 
                    key={template.id}
                    className="aspect-[9/16] rounded-lg overflow-hidden cursor-pointer border border-gray-100 hover:ring-2 hover:ring-purple-300 group"
                    onClick={() => {
                      setActiveTemplate(template);
                      onClose();
                    }}
                  >
                    <div className="relative h-full">
                      <Image
                        src={template.imageUrl}
                        alt={template.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                        <Badge className="self-start mb-1 bg-white text-gray-800">
                          {template.category}
                        </Badge>
                        <p className="text-xs text-white font-medium truncate">
                          {template.name}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateModal;
