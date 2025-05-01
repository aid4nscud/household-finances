'use client'

import { useState } from 'react'
import { ValueChainItem } from './ValueChainComponent'
import { Card, CardContent } from '@/components/ui/card'
import { Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip"

interface ValueHierarchyProps {
  valueHierarchy: ValueChainItem[]
}

export function ValueHierarchy({ valueHierarchy }: ValueHierarchyProps) {
  // Sort hierarchy by level (lower levels appear at bottom of pyramid)
  const sortedHierarchy = [...valueHierarchy]
    .filter(item => item.active)
    .sort((a, b) => b.level - a.level)
  
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h2 className="text-xl font-semibold text-green-700 dark:text-green-400">Your Value Hierarchy</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="inline-flex items-center justify-center rounded-full p-1 text-muted-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary" aria-label="Learn more about value hierarchy">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Your values are arranged in a hierarchy, with foundational values at the bottom and aspirational values at the top. Each level builds upon the one below it.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          This pyramid represents what matters most to you in your financial life.
          Higher levels build on the foundation of lower levels.
        </p>
      </div>

      {/* Accessible pyramid visualization */}
      <div 
        className="flex flex-col items-center justify-center space-y-4 max-w-3xl mx-auto"
        role="figure" 
        aria-label="Value hierarchy pyramid"
      >
        {sortedHierarchy.map((value, index) => {
          // Calculate width percentage - top level is smallest, bottom level is widest
          const baseWidth = 100
          const widthDecrement = 15
          const width = baseWidth - (widthDecrement * index)
          
          // Get colors based on level
          const colors = getLevelColors(value.level)
          const isHovered = hoveredItem === value.id
          
          return (
            <div 
              key={value.id}
              className={`${colors.bg} shadow-md rounded-lg p-4 text-center transition-all duration-300 ${
                isHovered ? 'transform scale-105 shadow-lg -translate-y-1' : ''
              }`}
              style={{ 
                width: `${width}%`,
                background: isHovered 
                  ? `linear-gradient(to right, ${colors.gradientFrom}, ${colors.gradientTo})` 
                  : undefined 
              }}
              onMouseEnter={() => setHoveredItem(value.id)}
              onMouseLeave={() => setHoveredItem(null)}
              onFocus={() => setHoveredItem(value.id)}
              onBlur={() => setHoveredItem(null)}
              tabIndex={0}
              role="button"
              aria-label={`Value level ${value.level}: ${value.name}`}
            >
              <h3 className={`font-bold ${colors.text}`}>{value.name}</h3>
              <p className="text-sm mt-1">{value.description}</p>
            </div>
          )
        })}
      </div>

      {/* Value details cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        {sortedHierarchy.map(value => {
          const colors = getLevelColors(value.level)
          return (
            <Card 
              key={value.id} 
              className="overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <CardContent className="p-6">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className={`rounded-full h-2 w-12 ${colors.accent} mb-1`} 
                      aria-hidden="true" 
                    />
                    <span className="text-xs text-muted-foreground">(Level {value.level})</span>
                  </div>
                  <h3 className="text-lg font-semibold">{value.name}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Examples in your life:</h4>
                    <ul 
                      className="text-sm grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1"
                      aria-label={`Examples of ${value.name} in your life`}
                    >
                      {value.examples.map((example, i) => (
                        <li key={i} className="flex items-center">
                          <span 
                            className={`inline-block h-1.5 w-1.5 rounded-full ${colors.accent} mr-2 flex-shrink-0`}
                            aria-hidden="true"
                          ></span>
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Hidden explanation for screen readers */}
      <div className="sr-only">
        <h3>How to use the Value Hierarchy</h3>
        <p>
          Your value hierarchy shows what matters most to you with your finances. 
          The pyramid is organized with your foundational values at the bottom and higher-level values at the top.
          Each level is color-coded for clarity. You can explore details about each value in the cards below.
        </p>
      </div>
    </div>
  )
}

function getLevelColors(level: number) {
  switch(level) {
    case 1:
      return {
        bg: 'bg-green-50 dark:bg-green-900/20',
        text: 'text-green-800 dark:text-green-300',
        accent: 'bg-green-500',
        gradientFrom: 'rgba(220, 252, 231, 0.95)',
        gradientTo: 'rgba(134, 239, 172, 0.95)'
      }
    case 2:
      return {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        text: 'text-blue-800 dark:text-blue-300',
        accent: 'bg-blue-500',
        gradientFrom: 'rgba(219, 234, 254, 0.95)',
        gradientTo: 'rgba(147, 197, 253, 0.95)'
      }
    case 3:
      return {
        bg: 'bg-violet-50 dark:bg-violet-900/20',
        text: 'text-violet-800 dark:text-violet-300',
        accent: 'bg-violet-500',
        gradientFrom: 'rgba(237, 233, 254, 0.95)',
        gradientTo: 'rgba(196, 181, 253, 0.95)'
      }
    case 4:
      return {
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        text: 'text-orange-800 dark:text-orange-300',
        accent: 'bg-orange-500',
        gradientFrom: 'rgba(255, 237, 213, 0.95)',
        gradientTo: 'rgba(253, 186, 116, 0.95)'
      }
    case 5:
      return {
        bg: 'bg-rose-50 dark:bg-rose-900/20',
        text: 'text-rose-800 dark:text-rose-300',
        accent: 'bg-rose-500',
        gradientFrom: 'rgba(255, 228, 230, 0.95)',
        gradientTo: 'rgba(253, 164, 175, 0.95)'
      }
    default:
      return {
        bg: 'bg-gray-50 dark:bg-gray-900/20',
        text: 'text-gray-800 dark:text-gray-300',
        accent: 'bg-gray-500',
        gradientFrom: 'rgba(249, 250, 251, 0.95)',
        gradientTo: 'rgba(209, 213, 219, 0.95)'
      }
  }
} 