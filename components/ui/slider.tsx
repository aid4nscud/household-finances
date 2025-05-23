import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={`
      relative flex w-full touch-none select-none items-center
      ${className}
    `}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
      <SliderPrimitive.Range className="absolute h-full bg-[#00C805] dark:bg-[#00C805]" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className="
        block h-4 w-4 rounded-full border border-[#00C805] bg-white 
        transition-colors focus-visible:outline-none 
        focus-visible:ring-1 focus-visible:ring-[#00C805]
        disabled:pointer-events-none disabled:opacity-50
        hover:bg-[#00C805]/10 hover:scale-110
        shadow-sm
      "
    />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider } 