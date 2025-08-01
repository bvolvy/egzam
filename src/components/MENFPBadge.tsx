import React from 'react';
import { Crown, Shield, Award } from 'lucide-react';

interface MENFPBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'crown' | 'shield' | 'award';
  className?: string;
}

const MENFPBadge: React.FC<MENFPBadgeProps> = ({ 
  size = 'md', 
  variant = 'crown',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const getIcon = () => {
    const iconClass = iconSizes[size];
    switch (variant) {
      case 'shield':
        return <Shield className={`${iconClass} fill-current`} />;
      case 'award':
        return <Award className={`${iconClass} fill-current`} />;
      case 'crown':
      default:
        return <Crown className={`${iconClass} fill-current`} />;
    }
  };

  return (
    <div className={`
      inline-flex items-center space-x-1.5 
      bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500
      text-red-600 font-bold rounded-full shadow-lg
      border-2 border-yellow-300
      hover:shadow-xl hover:scale-105 
      transition-all duration-300 ease-out
      relative overflow-hidden
      ${sizeClasses[size]}
      ${className}
    `}>
      {/* Effet de brillance */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
      
      {/* Contenu */}
      <div className="relative flex items-center space-x-1">
        {getIcon()}
        <span className="font-extrabold tracking-wide drop-shadow-sm">
          MENFP
        </span>
      </div>
      
      {/* Points décoratifs */}
      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full shadow-sm"></div>
      <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-red-400 rounded-full shadow-sm"></div>
    </div>
  );
};

export default MENFPBadge;