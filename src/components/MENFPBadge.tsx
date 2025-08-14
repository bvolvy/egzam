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
      bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-400
      text-amber-900 font-extrabold rounded-full shadow-xl
      border-2 border-yellow-200
      hover:shadow-2xl hover:scale-110 
      transition-all duration-500 ease-out
      relative overflow-hidden
      ring-2 ring-yellow-100/50
      ${sizeClasses[size]}
      ${className}
    `}>
      {/* Effet de brillance doré poli */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
      
      {/* Reflet métallique */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-yellow-600/20 rounded-full"></div>
      
      {/* Ombre interne pour l'effet 3D */}
      <div className="absolute inset-0 shadow-inner rounded-full"></div>
      
      {/* Contenu */}
      <div className="relative flex items-center space-x-1">
        {getIcon()}
        <span className="font-black tracking-wider drop-shadow-md text-shadow-sm">
          MENFP
        </span>
      </div>
      
      {/* Points décoratifs dorés */}
      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gradient-to-br from-yellow-200 to-amber-400 rounded-full shadow-md border border-yellow-100"></div>
      <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-gradient-to-br from-amber-300 to-yellow-500 rounded-full shadow-sm border border-amber-200"></div>
      
      {/* Éclat lumineux */}
      <div className="absolute top-0 left-1/4 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full"></div>
    </div>
  );
};

export default MENFPBadge;