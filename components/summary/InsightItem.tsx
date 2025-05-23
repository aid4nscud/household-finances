import React from 'react';
import { LightbulbIcon, AlertTriangle, CheckCircle, TrendingUp, Info } from 'lucide-react';

export interface InsightItemProps {
  content: string;
}

const InsightItem: React.FC<InsightItemProps> = ({ content }) => {
  // Determine insight type based on content keywords
  const getInsightType = (text: string): {
    type: 'alert' | 'warning' | 'positive' | 'information';
    icon: React.ReactNode;
    colors: {
      bg: string;
      border: string;
      text: string;
      iconBg: string;
    };
  } => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('deficit') || lowerText.includes('below') || lowerText.includes('above recommended')) {
      return {
        type: 'alert',
        icon: <AlertTriangle className="h-5 w-5" aria-hidden="true" />,
        colors: {
          bg: 'bg-red-50 dark:bg-red-500/5',
          border: 'border-red-100 dark:border-red-500/10 hover:border-red-200 dark:hover:border-red-500/20',
          text: 'text-red-600 dark:text-red-400',
          iconBg: 'bg-red-100/50 dark:bg-red-500/10'
        }
      };
    }
    
    if (lowerText.includes('consider') || lowerText.includes('could') || lowerText.includes('may')) {
      return {
        type: 'warning',
        icon: <Info className="h-5 w-5" aria-hidden="true" />,
        colors: {
          bg: 'bg-yellow-50 dark:bg-yellow-500/5',
          border: 'border-yellow-100 dark:border-yellow-500/10 hover:border-yellow-200 dark:hover:border-yellow-500/20',
          text: 'text-yellow-600 dark:text-yellow-400',
          iconBg: 'bg-yellow-100/50 dark:bg-yellow-500/10'
        }
      };
    }
    
    if (lowerText.includes('healthy') || lowerText.includes('exceeds') || lowerText.includes('effectively')) {
      return {
        type: 'positive',
        icon: <CheckCircle className="h-5 w-5" aria-hidden="true" />,
        colors: {
          bg: 'bg-[#00C805]/5',
          border: 'border-[#00C805]/20 hover:border-[#00C805]/40',
          text: 'text-[#00C805]',
          iconBg: 'bg-[#00C805]/10'
        }
      };
    }
    
    return {
      type: 'information',
      icon: <TrendingUp className="h-5 w-5" />,
      colors: {
        bg: 'bg-blue-50 dark:bg-blue-500/5',
        border: 'border-blue-100 dark:border-blue-500/10 hover:border-blue-200 dark:hover:border-blue-500/20',
        text: 'text-blue-600 dark:text-blue-400',
        iconBg: 'bg-blue-100/50 dark:bg-blue-500/10'
      }
    };
  };

  const insightStyle = getInsightType(content);

  return (
    <div className={`${insightStyle.colors.bg} border ${insightStyle.colors.border} transition-all duration-200 rounded-2xl p-6 flex items-start gap-4`}>
      <div className={`${insightStyle.colors.iconBg} ${insightStyle.colors.text} p-2 rounded-xl flex-shrink-0`}>
        {insightStyle.icon}
      </div>
      <div>
        <p className="text-sm text-gray-900 dark:text-white leading-relaxed">{content}</p>
      </div>
    </div>
  );
};

export default React.memo(InsightItem); 