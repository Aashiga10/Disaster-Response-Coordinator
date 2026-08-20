import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
    label: string;
  };
  variant?: 'danger' | 'warning' | 'primary' | 'success' | 'default';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = 'default',
  onClick
}) => {
  const isDanger = variant === 'danger';

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl shadow-sm border transition-all duration-150 flex flex-col justify-between ${
        isDanger
          ? 'bg-red-50 border-red-100 hover:border-red-200'
          : 'bg-white border-slate-200 hover:border-slate-300'
      } ${onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''}`}
    >
      <div>
        <div className="flex items-center justify-between mb-1">
          <span
            className={`text-xs font-semibold ${
              isDanger ? 'text-red-700 font-bold' : 'text-slate-500'
            }`}
          >
            {title}
          </span>
          <div
            className={`p-1.5 rounded-lg ${
              isDanger ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
            }`}
          >
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="my-1">
          <span
            className={`text-2xl font-bold font-mono tracking-tight ${
              isDanger ? 'text-red-600' : 'text-slate-900'
            }`}
          >
            {value}
          </span>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between gap-1 text-[10px]">
        {trend ? (
          <span
            className={`font-semibold flex items-center gap-0.5 ${
              isDanger
                ? 'text-red-700 uppercase'
                : trend.direction === 'up'
                ? 'text-red-600'
                : trend.direction === 'down'
                ? 'text-green-600'
                : 'text-blue-600'
            }`}
          >
            {trend.direction === 'up' && '↑ '}
            {trend.direction === 'down' && '↓ '}
            {trend.value}
          </span>
        ) : (
          <span className={isDanger ? 'text-red-600 font-semibold' : 'text-slate-400'}>
            {description}
          </span>
        )}

        <span className="text-slate-400 truncate max-w-[90px]">{trend?.label || description}</span>
      </div>
    </div>
  );
};
