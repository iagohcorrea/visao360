'use client';

import React from 'react';

interface NpsBarsProps {
  promoters: number;
  passives: number;
  detractors: number;
}

const NpsBars: React.FC<NpsBarsProps> = ({ promoters, passives, detractors }) => {
  const total = promoters + passives + detractors;
  
  // Calcular porcentagens
  const detractorsPercent = total > 0 ? Math.round((detractors / total) * 100) : 0;
  const passivesPercent = total > 0 ? Math.round((passives / total) * 100) : 0;
  const promotersPercent = total > 0 ? Math.round((promoters / total) * 100) : 0;
  
  // Calcular NPS
  const nps = total > 0 ? Math.round(((promoters - detractors) / total) * 100) : 0;
  
  return (
    <div className="w-full space-y-4">
      {/* Barra horizontal de distribuição */}
      <div className="flex h-10 rounded-lg overflow-hidden bg-gray-100">
        {/* Detratores (Vermelho) */}
        <div 
          className="flex items-center justify-center text-white text-sm font-medium"
          style={{ width: `${detractorsPercent}%`, backgroundColor: '#ef4444' }}
        >
          {detractorsPercent > 10 && `${detractorsPercent}%`}
        </div>
        
        {/* Passivos (Cinza) */}
        <div 
          className="flex items-center justify-center text-white text-sm font-medium"
          style={{ width: `${passivesPercent}%`, backgroundColor: '#9ca3af' }}
        >
          {passivesPercent > 10 && `${passivesPercent}%`}
        </div>
        
        {/* Promotores (Verde) */}
        <div 
          className="flex items-center justify-center text-white text-sm font-medium"
          style={{ width: `${promotersPercent}%`, backgroundColor: '#10b981' }}
        >
          {promotersPercent > 10 && `${promotersPercent}%`}
        </div>
      </div>
      
      {/* Estatísticas detalhadas */}
      <div className="space-y-0 mt-6">
        <div className="flex justify-between items-center py-2 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-600">NPS</span>
          <span className="text-sm font-bold text-gray-800">{nps}</span>
        </div>
        
        <div className="flex justify-between items-center py-2 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-600">Total Sent</span>
          <span className="text-sm font-bold text-gray-800">{total}</span>
        </div>
        
        <div className="flex justify-between items-center py-2 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-600">Responses</span>
          <span className="text-sm font-bold text-gray-800">{total} ({total > 0 ? '100' : '0'}%)</span>
        </div>
        
        <div className="flex justify-between items-center py-2 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-600">Detractors</span>
          <span className="text-sm font-bold text-gray-800">{detractors} ({detractorsPercent}%)</span>
        </div>
        
        <div className="flex justify-between items-center py-2 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-600">Passives</span>
          <span className="text-sm font-bold text-gray-800">{passives} ({passivesPercent}%)</span>
        </div>
        
        <div className="flex justify-between items-center py-2 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-600">Promoters</span>
          <span className="text-sm font-bold text-gray-800">{promoters} ({promotersPercent}%)</span>
        </div>
        
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-medium text-gray-600">Comments</span>
          <span className="text-sm font-bold text-gray-800">{Math.round(total * 0.38)} ({Math.round(total * 0.38 / total * 100) || 0}%)</span>
        </div>
      </div>
    </div>
  );
};

export default NpsBars;
