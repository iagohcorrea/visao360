'use client';

import React from 'react';
import GaugeChart from 'react-gauge-chart';

interface GaugeProps {
  value: number;
  min?: number;
  max?: number;
}

const Gauge: React.FC<GaugeProps> = ({ value, min = -100, max = 100 }) => {
  // Converter valor NPS (-100 a +100) para porcentagem (0 a 1)
  const percentage = (value - min) / (max - min);
  
  return (
    <div className="w-full h-64 flex flex-col items-center justify-center relative">
      <div className="w-80 h-48">
        <GaugeChart
          id="nps-gauge"
          nrOfLevels={3}
          percent={percentage}
          colors={['#ef4444', '#fbbf24', '#10b981']}
          arcWidth={0.15}
          arcPadding={0.01}
          cornerRadius={3}
          textColor="#374151"
          needleColor="#374151"
          needleBaseColor="#374151"
          hideText={true}
          animate={false}
          formatTextValue={() => ''}
        />
      </div>
      
      {/* Valor e label customizados abaixo do ponteiro */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-600 font-medium">NPS</p>
      </div>
      

    </div>
  );
};

export default Gauge;
