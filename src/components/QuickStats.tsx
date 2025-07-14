import React from 'react';
import { TrendingUp, Download, Star, Users, FileText, Calendar, Award, Target } from 'lucide-react';

interface QuickStatsProps {
  totalExams: number;
  totalDownloads: number;
  totalFavorites: number;
  popularExams: number;
  recentUploads: number;
}

const QuickStats: React.FC<QuickStatsProps> = ({
  totalExams,
  totalDownloads,
  totalFavorites,
  popularExams,
  recentUploads
}) => {
  const stats = [
    {
      id: 'exams',
      label: 'Examens disponibles',
      value: totalExams,
      icon: FileText,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      id: 'downloads',
      label: 'Téléchargements',
      value: totalDownloads.toLocaleString(),
      icon: Download,
      color: 'green',
      gradient: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
    {
      id: 'favorites',
      label: 'Favoris cumulés',
      value: totalFavorites,
      icon: Star,
      color: 'yellow',
      gradient: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-200'
    },
    {
      id: 'popular',
      label: 'Examens populaires',
      value: popularExams,
      icon: TrendingUp,
      color: 'red',
      gradient: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      borderColor: 'border-red-200'
    },
    {
      id: 'recent',
      label: 'Nouveaux cette semaine',
      value: recentUploads,
      icon: Calendar,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    },
    {
      id: 'users',
      label: 'Utilisateurs actifs',
      value: '1.2k+',
      icon: Users,
      color: 'indigo',
      gradient: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      borderColor: 'border-indigo-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div key={stat.id} className="group relative">
          {/* Effet de brillance au survol */}
          <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
          
          {/* Carte principale */}
          <div className={`relative ${stat.bgColor} backdrop-blur-sm rounded-2xl p-4 border ${stat.borderColor} hover:border-opacity-50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 ${stat.bgColor} rounded-xl border ${stat.borderColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
              </div>
              <Target className={`h-4 w-4 ${stat.textColor} opacity-50`} />
            </div>
            
            <div className="space-y-1">
              <div className={`text-xl font-bold ${stat.textColor}`}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
            
            {/* Barre de progression animée */}
            <div className={`mt-3 h-1 ${stat.bgColor} rounded-full overflow-hidden border ${stat.borderColor}`}>
              <div 
                className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-1000 ease-out`}
                style={{
                  width: '100%',
                  animation: `slideIn 1.5s ease-out ${index * 0.1}s both`
                }}
              ></div>
            </div>
          </div>
        </div>
      ))}
      
      <style jsx>{`
        @keyframes slideIn {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default QuickStats;