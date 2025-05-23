import React from 'react';
import { Briefcase, TrendingUp, TrendingDown, CircleDollarSign, Wallet } from 'lucide-react';

export interface SummaryItemProps {
  title: string;
  value: string;
  subtitle: string;
  type: 'income' | 'expense' | 'savings' | 'c2e' | string;
}

const SummaryItem: React.FC<SummaryItemProps> = ({ 
  title, 
  value, 
  subtitle,
  type
}) => {
  // Use consistent theme colors
  let bgColor = 'bg-white dark:bg-gray-800';
  let iconBg = 'bg-[#00C805]/5';
  let textColor = 'text-gray-900 dark:text-white';
  let accentColor = 'border-gray-100 dark:border-gray-700 hover:border-[#00C805]/30 dark:hover:border-[#00C805]/30';
  let Icon = CircleDollarSign;

  if (type === 'income') {
    Icon = TrendingUp;
    textColor = 'text-[#00C805]';
    accentColor = 'border-[#00C805]/20 hover:border-[#00C805]/40 dark:border-[#00C805]/20 dark:hover:border-[#00C805]/40';
  } else if (type === 'expense') {
    Icon = TrendingDown;
    iconBg = 'bg-red-500/5';
    textColor = 'text-red-500';
    accentColor = 'border-red-200 hover:border-red-300 dark:border-red-800/20 dark:hover:border-red-800/30';
  } else if (type === 'savings') {
    Icon = Wallet;
    iconBg = 'bg-[#00C805]/5';
    textColor = 'text-[#00C805]';
    accentColor = 'border-[#00C805]/20 hover:border-[#00C805]/40 dark:border-[#00C805]/20 dark:hover:border-[#00C805]/40';
  } else if (type === 'c2e') {
    Icon = Briefcase;
    iconBg = 'bg-[#00C805]/5';
    textColor = 'text-[#00C805]';
    accentColor = 'border-[#00C805]/20 hover:border-[#00C805]/40 dark:border-[#00C805]/20 dark:hover:border-[#00C805]/40';
  }

  return (
    <div className={`${bgColor} p-6 rounded-2xl border transition-all duration-200 ${accentColor}`}>
      <div className="flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <p className="text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 uppercase">{title}</p>
          <div className={`${iconBg} p-2 rounded-xl`}>
            <Icon className={`h-5 w-5 ${textColor}`} />
          </div>
        </div>
        <p className={`text-2xl font-medium ${type === 'income' || type === 'savings' || type === 'c2e' ? 'text-[#00C805]' : type === 'expense' ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
          {value}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>
      </div>
    </div>
  );
};

export default React.memo(SummaryItem); 