import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface C2EToggleProps {
  fieldId: string;
  isC2E: boolean;
  percentage: number;
  onChange: (isC2E: boolean, percentage?: number) => void;
}

const C2EToggle: React.FC<C2EToggleProps> = ({
  fieldId,
  isC2E,
  percentage,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleToggleChange = (checked: boolean) => {
    onChange(checked, percentage);
  };
  
  const handlePercentageChange = (value: number[]) => {
    onChange(isC2E, value[0]);
  };
  
  return (
    <div className="flex items-center space-x-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={`
              px-3 py-1 rounded-full text-xs font-medium
              transition-all duration-200
              ${isC2E 
                ? 'bg-[#00C805] text-white hover:bg-[#00C805]/90' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'}
            `}
          >
            {isC2E ? `${percentage}% C2E` : 'C2E'}
          </button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-80 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg"
          align="end"
        >
          <div className="space-y-4">
      <div className="flex items-center justify-between">
              <label 
                htmlFor={`${fieldId}-c2e-toggle`}
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Cost to Earn
              </label>
          <Switch
                id={`${fieldId}-c2e-toggle`}
            checked={isC2E}
            onCheckedChange={handleToggleChange}
                className={`
                  ${isC2E ? 'bg-[#00C805]' : 'bg-gray-200 dark:bg-gray-700'}
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  focus:outline-none focus:ring-2 focus:ring-[#00C805] focus:ring-offset-2
                  dark:focus:ring-offset-gray-900
                `}
              />
        </div>
        {isC2E && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Percentage allocated
                  </span>
                  <span className="text-sm font-medium text-[#00C805]">
                    {percentage}%
          </span>
      </div>
          <Slider
                  value={[percentage]}
                  min={0}
            max={100}
            step={5}
                  onValueChange={handlePercentageChange}
                  className="[&_[role=slider]]:bg-[#00C805] [&_[role=slider]]:border-[#00C805] [&_[role=slider]]:shadow-md"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Adjust the percentage of this expense that contributes to earning your income.
                </p>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default React.memo(C2EToggle); 