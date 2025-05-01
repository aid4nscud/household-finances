import React from 'react';

export interface SummaryItemProps {
  title: string;
  value: string;
  subtitle: string;
  type: 'income' | 'expense' | 'savings' | string;
}

const SummaryItem: React.FC<SummaryItemProps> = ({ 
  title, 
  value, 
  subtitle,
  type
}) => {
  let bgColor = 'bg-slate-50 dark:bg-slate-900';
  let iconBg = 'bg-slate-100 dark:bg-slate-800';
  let textColor = 'text-slate-800 dark:text-slate-200';

  if (type === 'income') {
    bgColor = 'bg-green-50 dark:bg-green-900/20';
    iconBg = 'bg-green-100 dark:bg-green-800/30';
    textColor = 'text-green-700 dark:text-green-400';
  } else if (type === 'expense') {
    bgColor = 'bg-red-50 dark:bg-red-900/20';
    iconBg = 'bg-red-100 dark:bg-red-800/30';
    textColor = 'text-red-700 dark:text-red-400';
  } else if (type === 'savings') {
    bgColor = 'bg-blue-50 dark:bg-blue-900/20';
    iconBg = 'bg-blue-100 dark:bg-blue-800/30';
    textColor = 'text-blue-700 dark:text-blue-400';
  }

  return (
    <div className={`${bgColor} p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800`}>
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          <div className={`${iconBg} w-8 h-8 rounded-full flex items-center justify-center`}>
            <span className={`text-xs font-bold ${textColor}`}>
              {type === 'income' ? '↑' : type === 'expense' ? '↓' : type === 'savings' ? '→' : '•'}
            </span>
          </div>
        </div>
        <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
      </div>
    </div>
  );
};

export default React.memo(SummaryItem); 