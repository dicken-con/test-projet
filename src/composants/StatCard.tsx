import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  color: 'blue' | 'green' | 'red' | 'orange';
}

const colorStyles = {
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300',
  green: 'bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300',
  red: 'bg-red-50 text-red-600 dark:bg-red-900/40 dark:text-red-300',
  orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300',
};

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, trend, trendUp, color }) => {
  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex items-start justify-between transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-primary-200">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{value}</p>
        {trend && (
          <p className={`text-xs mt-2 font-medium ${trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </p>
        )}
      </div>
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${colorStyles[color]}`}>
        <Icon size={20} strokeWidth={2} />
      </div>
    </div>
  );
};

export default StatCard;