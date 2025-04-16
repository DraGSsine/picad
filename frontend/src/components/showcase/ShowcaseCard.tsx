import React from 'react'
import Image from 'next/image'
import { ArrowRight01Icon } from 'hugeicons-react'

interface StyleTag {
  name: string
  color: 'blue' | 'green' | 'purple' | 'red' | 'orange'
}

interface ShowcaseItem {
  id: number
  before: string
  after: string
  title: string
  description: string
  styles: StyleTag[]
  gradient: string
}

interface ShowcaseCardProps {
  item: ShowcaseItem
}

const ShowcaseCard = ({ item }: ShowcaseCardProps) => {
  const colorVariants = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    purple: 'bg-purple-100 text-primary',
    red: 'bg-red-100 text-red-700',
    orange: 'bg-orange-100 text-orange-700',
  }

  return (
    <div className="relative overflow-hidden rounded-xl shadow-md bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-xl group">
      <div className="p-5">
        <div className="flex flex-col space-y-4">
          {/* Before and After Images */}
          <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="w-24 h-24 sm:w-32 sm:h-32 relative bg-white dark:bg-gray-800 rounded-md overflow-hidden flex items-center justify-center">
              <Image 
                src={`/showcase/${item.before}`} 
                alt={`Before: ${item.title}`}
                width={100}
                height={100}
                className="object-contain p-2"
              />
              <span className="absolute bottom-0 left-0 right-0 text-xs text-center bg-black/60 text-white py-1">
                Before
              </span>
            </div>
            
            <ArrowRight01Icon className="w-8 h-8 text-blue-500" />
            
            <div className="w-24 h-24 sm:w-32 sm:h-32 relative bg-white dark:bg-gray-800 rounded-md overflow-hidden flex items-center justify-center">
              <Image 
                src={`/showcase/${item.after}`} 
                alt={`After: ${item.title}`}
                width={100}
                height={100}
                className="object-contain p-2"
              />
              <span className="absolute bottom-0 left-0 right-0 text-xs text-center bg-black/60 text-white py-1">
                After
              </span>
            </div>
          </div>
          
          {/* Title and Description */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.title}</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
          </div>
          
          {/* Style Tags */}
          <div className="flex flex-wrap gap-2">
            {item.styles.map((style, index) => (
              <span 
                key={index} 
                className={`text-xs px-2 py-1 rounded-full ${colorVariants[style.color]} inline-flex items-center`}
              >
                {style.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Card Highlight Effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-100/0 via-blue-100/0 to-blue-100/0 dark:from-blue-900/0 dark:via-blue-900/0 dark:to-blue-900/0 group-hover:from-blue-100/50 group-hover:via-blue-100/25 group-hover:to-blue-100/0 dark:group-hover:from-blue-900/20 dark:group-hover:via-blue-900/10 dark:group-hover:to-blue-900/0 transition-all duration-500"></div>
      
      {/* View Details Corner Indicator */}
      <div className="absolute right-0 bottom-0 w-12 h-12 bg-blue-600 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 rounded-tl-xl">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </div>
    </div>
  )
}

export default ShowcaseCard