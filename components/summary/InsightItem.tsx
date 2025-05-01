import React from 'react';
import { LightbulbIcon } from 'lucide-react';

export interface InsightItemProps {
  content: string;
}

const InsightItem: React.FC<InsightItemProps> = ({ content }) => {
  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-4 flex items-start gap-3">
      <div className="bg-amber-100 dark:bg-amber-800/30 text-amber-700 dark:text-amber-400 p-1.5 rounded-md flex-shrink-0">
        <LightbulbIcon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm text-amber-800 dark:text-amber-300">{content}</p>
      </div>
    </div>
  );
};

export default React.memo(InsightItem); 