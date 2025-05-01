'use client'

import { useState, useRef, useEffect } from 'react'
import { ValueChainItem } from './ValueChainComponent'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from '@hello-pangea/dnd'
import { GripVertical, X, Plus, Trash2, Pencil, Check, HelpCircle } from 'lucide-react'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ValueEditorProps {
  valueHierarchy: ValueChainItem[]
  setValueHierarchy: (hierarchy: ValueChainItem[]) => void
}

export function ValueEditor({ valueHierarchy, setValueHierarchy }: ValueEditorProps) {
  const [editingValue, setEditingValue] = useState<ValueChainItem | null>(null)
  const [newExample, setNewExample] = useState('')
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [reorderSuccess, setReorderSuccess] = useState(false)
  const reorderTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (reorderTimeoutRef.current) {
        clearTimeout(reorderTimeoutRef.current)
      }
    }
  }, [])
  
  const handleDragStart = (start: any) => {
    setDraggingId(start.draggableId)
  }
  
  const handleDragEnd = (result: DropResult) => {
    setDraggingId(null)
    
    if (!result.destination) return
    
    const items = Array.from(valueHierarchy)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    
    // Update the level based on new position
    const updatedItems = items.map((item, index) => ({
      ...item,
      level: index + 1,
      customized: true
    }))
    
    setValueHierarchy(updatedItems)
    
    // Show success feedback briefly
    setReorderSuccess(true)
    if (reorderTimeoutRef.current) {
      clearTimeout(reorderTimeoutRef.current)
    }
    
    reorderTimeoutRef.current = setTimeout(() => {
      setReorderSuccess(false)
    }, 2000)
  }
  
  const toggleValueActive = (id: string) => {
    const updatedValues = valueHierarchy.map(value => 
      value.id === id ? { ...value, active: !value.active, customized: true } : value
    )
    setValueHierarchy(updatedValues)
  }
  
  const updateValue = (updatedValue: ValueChainItem) => {
    const updatedValues = valueHierarchy.map(value => 
      value.id === updatedValue.id ? { ...updatedValue, customized: true } : value
    )
    setValueHierarchy(updatedValues)
    setEditingValue(null)
  }
  
  const addExample = () => {
    if (!editingValue || !newExample.trim()) return
    
    const updatedValue = {
      ...editingValue,
      examples: [...editingValue.examples, newExample.trim()]
    }
    
    setEditingValue(updatedValue)
    setNewExample('')
  }
  
  const removeExample = (index: number) => {
    if (!editingValue) return
    
    const updatedExamples = [...editingValue.examples]
    updatedExamples.splice(index, 1)
    
    setEditingValue({
      ...editingValue,
      examples: updatedExamples
    })
  }
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h2 className="text-xl font-semibold text-green-700 dark:text-green-400">Customize Your Value Chain</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className="inline-flex items-center justify-center rounded-full p-1 text-muted-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary" 
                  aria-label="Learn more about customizing values"
                >
                  <HelpCircle className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Drag and drop values to reorder their importance in your hierarchy. Toggle values on/off to include or exclude them.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Drag and drop to reorder your values, edit them to match your personal values,
          or toggle them on/off to customize your value hierarchy.
        </p>
      </div>
      
      {reorderSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-3 rounded-md border border-green-200 dark:border-green-800/50 text-sm text-center animate-fadeIn mb-4">
          Values reordered successfully! Your hierarchy has been updated.
        </div>
      )}
      
      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Droppable droppableId="valueList">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
              aria-label="Sortable value list"
            >
              {valueHierarchy.map((value, index) => (
                <Draggable key={value.id} draggableId={value.id} index={index}>
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`${
                        value.active ? 'border-green-300 dark:border-green-800' : 'opacity-60 border-dashed'
                      } ${draggingId === value.id ? 'ring-2 ring-primary/50 shadow-lg' : ''}
                      transition-all duration-200`}
                    >
                      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                        <div className="flex items-center min-w-0">
                          <div 
                            {...provided.dragHandleProps}
                            className="mr-3 hover:text-primary cursor-grab active:cursor-grabbing flex-shrink-0"
                            aria-label={`Drag to reorder ${value.name}`}
                          >
                            <GripVertical size={20} />
                          </div>
                          <div className="min-w-0">
                            <CardTitle className="text-base flex flex-wrap items-center gap-2">
                              <span className="truncate">{value.name}</span>
                              <div className="flex-shrink-0">
                                {value.customized && <Badge variant="outline" className="text-xs font-normal">Customized</Badge>}
                              </div>
                            </CardTitle>
                            <CardDescription className="text-xs truncate">{value.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="flex items-center gap-2">
                            <Switch 
                              id={`active-toggle-${value.id}`}
                              checked={value.active}
                              onCheckedChange={() => toggleValueActive(value.id)}
                              aria-label={value.active ? `Disable ${value.name}` : `Enable ${value.name}`}
                            />
                            <Label htmlFor={`active-toggle-${value.id}`} className="text-xs">
                              {value.active ? 'Enabled' : 'Disabled'}
                            </Label>
                          </div>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => setEditingValue(value)}
                                aria-label={`Edit ${value.name}`}
                                className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
                              >
                                <Pencil size={16} />
                              </Button>
                            </DialogTrigger>
                            {editingValue && editingValue.id === value.id && (
                              <DialogContent className="sm:max-w-[500px] overflow-y-auto max-h-[90vh]">
                                <DialogHeader>
                                  <DialogTitle>Edit Value</DialogTitle>
                                  <DialogDescription>
                                    Customize this value to better align with your personal values.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="name">Value Name</Label>
                                    <Input 
                                      id="name" 
                                      value={editingValue.name} 
                                      onChange={(e) => setEditingValue({...editingValue, name: e.target.value})}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea 
                                      id="description" 
                                      value={editingValue.description} 
                                      onChange={(e) => setEditingValue({...editingValue, description: e.target.value})}
                                    />
                                  </div>
                                  <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                      <Label>Examples</Label>
                                      <div className="text-xs text-muted-foreground">
                                        How this appears in your life
                                      </div>
                                    </div>
                                    <ul className="space-y-2">
                                      {editingValue.examples.map((example, i) => (
                                        <li key={i} className="flex items-center justify-between bg-muted/50 p-2 rounded text-sm">
                                          <span className="line-clamp-2 mr-2">{example}</span>
                                          <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => removeExample(i)}
                                            className="h-6 w-6 flex-shrink-0"
                                            aria-label={`Remove example: ${example}`}
                                          >
                                            <X size={14} />
                                          </Button>
                                        </li>
                                      ))}
                                    </ul>
                                    <div className="flex gap-2">
                                      <Input 
                                        placeholder="Add a new example..." 
                                        value={newExample} 
                                        onChange={(e) => setNewExample(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addExample()}
                                        aria-label="New example of how this value appears in your life"
                                      />
                                      <Button 
                                        onClick={addExample} 
                                        size="sm" 
                                        className="shrink-0"
                                        disabled={!newExample.trim()}
                                      >
                                        <Plus size={16} className="mr-1" /> Add
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button 
                                    onClick={() => updateValue(editingValue)} 
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <Check size={16} className="mr-1" /> Save Changes
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            )}
                          </Dialog>
                        </div>
                      </CardHeader>

                      <CardContent className="p-4 pt-0">
                        <div className="mt-2 text-xs text-muted-foreground">
                          <span className="font-medium">Examples: </span>
                          {value.examples.length > 0 
                            ? value.examples.slice(0, 3).join(', ') + (value.examples.length > 3 ? '...' : '')
                            : 'No examples added'}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Accessibility descriptions */}
      <div className="sr-only">
        <h3>How to customize your value chain</h3>
        <ul>
          <li>Drag values up or down to change their position in your hierarchy</li>
          <li>Use the toggle switch to enable or disable specific values</li>
          <li>Click the edit button to customize the name, description, and examples for each value</li>
          <li>Your changes will be saved when you click the "Save Your Value Chain" button at the bottom of the page</li>
        </ul>
      </div>
    </div>
  )
} 