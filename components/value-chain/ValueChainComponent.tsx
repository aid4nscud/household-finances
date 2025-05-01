'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ValueHierarchy } from './ValueHierarchy'
import { ValueEditor } from './ValueEditor'
import { ValueSpendingInsights } from './ValueSpendingInsights'
import { createClient } from '@/utils/supabase/client'
import { toast } from '@/components/ui/use-toast'
import { ValueCategory } from '@/types'
import { Skeleton } from '@/components/ui/skeleton'
import { Save, Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const DEFAULT_VALUE_HIERARCHY = [
  {
    id: '1',
    level: 1,
    name: 'Security & Peace of Mind',
    description: 'Having stability and freedom from worry about basic needs',
    examples: ['Emergency savings', 'Insurance', 'Health coverage', 'Stable housing'],
    customized: false,
    active: true
  },
  {
    id: '2',
    level: 2,
    name: 'Family & Relationships',
    description: 'Supporting and nurturing important relationships',
    examples: ['Quality time', 'Education', 'Family activities', 'Gifts and support'],
    customized: false,
    active: true
  },
  {
    id: '3',
    level: 3,
    name: 'Health & Wellbeing',
    description: 'Taking care of physical and mental wellbeing',
    examples: ['Healthcare', 'Fitness', 'Nutrition', 'Self-care'],
    customized: false,
    active: true
  },
  {
    id: '4',
    level: 4,
    name: 'Growth & Freedom',
    description: 'Pursuing personal development and experiences',
    examples: ['Travel', 'Learning', 'Hobbies', 'New experiences'],
    customized: false,
    active: true
  },
  {
    id: '5',
    level: 5,
    name: 'Legacy & Impact',
    description: 'Contributing to something larger than yourself',
    examples: ['Charitable giving', 'Community support', 'Mentoring', 'Creating lasting change'],
    customized: false,
    active: true
  }
]

export interface ValueChainItem {
  id: string
  level: number
  name: string
  description: string
  examples: string[]
  customized: boolean
  active: boolean
}

export interface ValueChainComponentProps {
  userId: string
  statement: any
  existingValueChain: any
}

export function ValueChainComponent({ userId, statement, existingValueChain }: ValueChainComponentProps) {
  const router = useRouter()
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState('explore')
  const [valueHierarchy, setValueHierarchy] = useState<ValueChainItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [spendingCategories, setSpendingCategories] = useState<ValueCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    // Initialize with existing data or defaults
    setIsLoading(true)
    
    if (existingValueChain && existingValueChain.chain_data) {
      setValueHierarchy(existingValueChain.chain_data.hierarchy || DEFAULT_VALUE_HIERARCHY)
    } else {
      setValueHierarchy(DEFAULT_VALUE_HIERARCHY)
    }

    // Set spending categories from statement if available
    if (statement && statement.statement_data && statement.statement_data.valueChainOpportunities) {
      setSpendingCategories(statement.statement_data.valueChainOpportunities)
    }
    
    // Simulate loading for smoother UI
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [existingValueChain, statement])

  const saveValueChain = async () => {
    setIsSubmitting(true)
    try {
      const chainData = {
        hierarchy: valueHierarchy
      }

      if (existingValueChain) {
        // Update existing value chain
        await supabase
          .from('value_chains')
          .update({ 
            chain_data: chainData,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingValueChain.id)

        toast({
          title: "Value Chain Updated",
          description: "Your values have been updated successfully.",
          variant: "success"
        })
      } else {
        // Create new value chain
        await supabase
          .from('value_chains')
          .insert({ 
            user_id: userId,
            chain_data: chainData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        toast({
          title: "Value Chain Created",
          description: "Your values have been saved successfully.",
          variant: "success"
        })
      }

      // Show success animation
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
      
      router.refresh()
    } catch (error) {
      console.error('Error saving value chain:', error)
      toast({
        title: "Error",
        description: "There was a problem saving your value chain. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <ValueChainSkeleton />
  }

  return (
    <div className="animate-fadeIn py-8 space-y-8">
      {/* Page header */}
      <section aria-labelledby="value-chain-heading">
        <div className="flex items-center gap-3 mb-3">
          <h1 
            id="value-chain-heading" 
            className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent"
          >
            Your Value Chain
          </h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className="inline-flex items-center justify-center rounded-full p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  aria-label="Learn more about the Value Chain"
                >
                  <Info className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                <p>Your Value Chain is a personalized hierarchy of what money means to you, helping you align your spending with your priorities.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-muted-foreground text-base sm:text-lg max-w-3xl mt-3">
          Define what money truly means to you and align your spending with your core values.
        </p>
      </section>

      <Card className="bg-card shadow-md border-muted/30 mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-green-700 dark:text-green-400">Why Values Matter</CardTitle>
          <CardDescription>
            Inspired by Maslow's hierarchy of needs, the Value Chain helps uncover the deeper "why" behind your money decisions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-3">
            Traditional financial planning starts with arbitrary goals like "save $1M" or "retire at 65." The Value Chain reframes planning around what truly matters to you:
          </p>
          <ul className="list-disc list-inside text-sm space-y-1 ml-2 text-muted-foreground mb-3">
            <li>Peace of mind and security</li>
            <li>Strengthening important relationships</li>
            <li>Supporting your health and wellbeing</li>
            <li>Personal growth and freedom</li>
            <li>Creating a legacy and meaningful impact</li>
          </ul>
          <p className="text-sm font-medium">
            When your finances align with your values, decisions become clearer, anxiety drops, and fulfillment increases.
          </p>
        </CardContent>
      </Card>

      <Tabs 
        defaultValue="explore" 
        className="space-y-6" 
        onValueChange={setActiveTab} 
        value={activeTab}
      >
        <TabsList className="grid grid-cols-3 w-full sm:w-[400px]">
          <TabsTrigger 
            value="explore" 
            id="explore-tab"
            className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900 dark:data-[state=active]:bg-green-900/20 dark:data-[state=active]:text-green-300"
          >
            Explore
          </TabsTrigger>
          <TabsTrigger 
            value="customize" 
            id="customize-tab"
            className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900 dark:data-[state=active]:bg-green-900/20 dark:data-[state=active]:text-green-300"
          >
            Customize
          </TabsTrigger>
          <TabsTrigger 
            value="insights" 
            id="insights-tab"
            className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900 dark:data-[state=active]:bg-green-900/20 dark:data-[state=active]:text-green-300"
          >
            Insights
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="explore" className="space-y-6 animate-fadeIn transition-all duration-300">
          <ValueHierarchy valueHierarchy={valueHierarchy} />
        </TabsContent>
        
        <TabsContent value="customize" className="space-y-6 animate-fadeIn transition-all duration-300">
          <ValueEditor 
            valueHierarchy={valueHierarchy} 
            setValueHierarchy={setValueHierarchy} 
          />
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-6 animate-fadeIn transition-all duration-300">
          <ValueSpendingInsights 
            valueHierarchy={valueHierarchy}
            spendingCategories={spendingCategories} 
          />
        </TabsContent>
      </Tabs>

      {activeTab === 'customize' && (
        <div className="flex justify-end mt-8">
          <Button 
            onClick={saveValueChain} 
            disabled={isSubmitting}
            className={`bg-green-600 hover:bg-green-700 text-white transition-all duration-300 ${
              saveSuccess ? 'bg-green-500 scale-105' : ''
            }`}
          >
            <Save className={`mr-2 h-4 w-4 ${isSubmitting ? 'animate-spin' : ''}`} />
            {isSubmitting ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Your Value Chain'}
          </Button>
        </div>
      )}

      {/* Keyboard navigation instructions for screen readers */}
      <div className="sr-only">
        <h2>Keyboard Navigation</h2>
        <p>Use the tab key to navigate between sections. Use arrow keys to move through values in the customize section.</p>
      </div>
    </div>
  )
}

// Add the ValueChainSkeleton component
function ValueChainSkeleton() {
  return (
    <div className="py-8 space-y-8">
      <div className="flex items-center gap-3 mb-3">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full max-w-3xl" />
      
      <Skeleton className="h-40 w-full mb-6" />
      
      <div className="space-y-4">
        <Skeleton className="h-10 w-[400px]" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    </div>
  );
} 