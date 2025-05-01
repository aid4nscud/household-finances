'use client'

import React, { useState } from 'react'
import { ValueChainItem } from './ValueChainComponent'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { BarChart3, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { ValueCategory } from '@/types'

interface ValueSpendingInsightsProps {
  valueHierarchy: ValueChainItem[]
  spendingCategories: ValueCategory[]
}

export function ValueSpendingInsights({ valueHierarchy, spendingCategories }: ValueSpendingInsightsProps) {
  const [selectedValue, setSelectedValue] = useState<string | null>(null)
  
  // Only use active values
  const activeValues = valueHierarchy.filter(v => v.active)
  
  // Calculate total spending across all categories
  const totalSpending = spendingCategories.reduce((acc, category) => acc + category.spending, 0)
  
  // Map spending categories to value hierarchy items
  const valueSpendingMap = valueHierarchy.map(value => {
    const matchingCategories = spendingCategories.filter(
      category => category.valueAlignment === value.id
    )
    
    const spendingForValue = matchingCategories.reduce(
      (sum, category) => sum + (category.monthlyAmount || category.spending || 0), 0
    )
    
    const percentage = totalSpending > 0 
      ? (spendingForValue / totalSpending) * 100 
      : 0
    
    return {
      ...value,
      spending: spendingForValue,
      percentage: percentage,
      categories: matchingCategories
    }
  })
  
  // Sort by level for display
  const sortedSpending = [...valueSpendingMap].sort((a, b) => a.level - b.level)

  // Determine if spending aligns with values (higher level = higher priority)
  // Ideally, spending on lower levels should be higher than on higher levels
  const hasAlignmentIssues = sortedSpending.some((value, i, arr) => {
    if (i === 0) return false
    return value.percentage > arr[i-1].percentage
  })
  
  // Identify potential alignment issues
  const topValues = valueHierarchy.slice(0, 3).map(v => v.id)
  const bottomValues = valueHierarchy.slice(3).map(v => v.id)
  
  const topValuesSpending = valueSpendingMap
    .filter(v => topValues.includes(v.id))
    .reduce((sum, v) => sum + v.spending, 0)
  
  const bottomValuesSpending = valueSpendingMap
    .filter(v => bottomValues.includes(v.id))
    .reduce((sum, v) => sum + v.spending, 0)
  
  const hasAlignmentIssue = totalSpending > 0 && 
    (bottomValuesSpending > topValuesSpending)

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        {/* Spending Overview */}
        <Card className="shadow-sm border-green-100 dark:border-green-900/30">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
              <CardTitle className="text-lg text-green-800 dark:text-green-300">Spending Overview</CardTitle>
            </div>
            <CardDescription>
              How your spending aligns with your values
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {valueSpendingMap.map((value, index) => (
                <div 
                  key={value.id}
                  className="py-2"
                  onClick={() => setSelectedValue(value.id === selectedValue ? null : value.id)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <span className={`w-3 h-3 rounded-full mr-2 ${
                        index < 3 ? 'bg-green-600 dark:bg-green-400' : 'bg-blue-400 dark:bg-blue-500'
                      }`}></span>
                      <span className="font-medium">{value.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {value.percentage.toFixed(1)}%
                    </span>
                  </div>
                  
                  <Progress 
                    value={value.percentage} 
                    className={index < 3 
                      ? 'bg-green-100 dark:bg-green-950' 
                      : 'bg-blue-100 dark:bg-blue-950'
                    }
                    aria-label={`${value.name} spending: ${value.percentage.toFixed(1)}%`}
                  />
                  
                  {value.id === selectedValue && (
                    <div className="mt-2 pl-5 text-sm text-muted-foreground animate-fadeIn">
                      {value.categories.length > 0 ? (
                        <ul className="list-disc space-y-1 pl-4">
                          {value.categories.map(category => (
                            <li key={category.id || category.name}>
                              {category.name}: ${category.monthlyAmount ? category.monthlyAmount.toFixed(2) : category.spending.toFixed(2)}/month
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="italic">No spending categories aligned with this value</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Value Alignment */}
        <div className="space-y-4">
          {hasAlignmentIssue ? (
            <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertTitle className="text-amber-800 dark:text-amber-400">
                Alignment Opportunity
              </AlertTitle>
              <AlertDescription className="text-amber-700 dark:text-amber-300">
                You're spending more on your lower-priority values than your top values. 
                Consider reallocating to better match your priorities.
              </AlertDescription>
            </Alert>
          ) : totalSpending > 0 ? (
            <Alert className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle className="text-green-800 dark:text-green-400">
                Good Alignment
              </AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-300">
                Your spending generally aligns with your value priorities. 
                Keep reviewing to maintain this balance.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertTitle className="text-blue-800 dark:text-blue-400">
                Add Your Spending
              </AlertTitle>
              <AlertDescription className="text-blue-700 dark:text-blue-300">
                Complete your financial statement to see how your spending aligns with your values.
              </AlertDescription>
            </Alert>
          )}

          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <h3 className="font-medium text-base mb-3">Working with Your Insights</h3>
              
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium">Click on Values</h4>
                  <p className="text-muted-foreground">
                    Select any value to see exactly which spending categories are aligned with it.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">Top Values (Green)</h4>
                  <p className="text-muted-foreground">
                    Ideally, your top 3 values should have the highest spending allocation.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">Lower Values (Blue)</h4>
                  <p className="text-muted-foreground">
                    These values are still important but may receive less financial attention.
                  </p>
                </div>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="underline underline-offset-4 text-green-600 dark:text-green-400 cursor-help">
                      Learn more about value alignment
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>
                        Perfect alignment isn't always possible or necessary. The goal is to be conscious
                        of how your spending relates to what matters most to you.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Accessibility descriptions */}
      <div className="sr-only">
        <h2>Value-Spending Alignment</h2>
        <p>
          This visualization shows how your monthly spending is distributed across your value hierarchy.
          Ideally, your spending should be highest for your top 3 values, represented in green.
          Lower priority values are shown in blue.
          You can click on any value to see which specific spending categories are aligned with it.
        </p>
      </div>
    </div>
  )
}

function getLevelColorClass(level: number): string {
  switch(level) {
    case 1: return 'bg-green-500'
    case 2: return 'bg-blue-500'
    case 3: return 'bg-violet-500'
    case 4: return 'bg-orange-500'
    case 5: return 'bg-rose-500'
    default: return 'bg-gray-500'
  }
} 