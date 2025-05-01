import React from 'react';
import { ProgressBarProps } from '../../types/index';
import { Progress } from "@/components/ui/progress";

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <Progress 
      value={progress} 
      className="h-2 w-full"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
};

export default React.memo(ProgressBar); 