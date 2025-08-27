'use client';

import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface GaugeProps {
  value: number;
  min?: number;
  max?: number;
}

const Gauge: React.FC<GaugeProps> = ({ value, min = -100, max = 100 }) => {
  const normalizedValue = Math.max(min, Math.min(max, value));
  const range = max - min;
  const dataValue = ((normalizedValue - min) / range) * 100;

  const data = [
    { name: 'Gauge', value: dataValue, fill: '#8884d8' },
  ];

  const startAngle = 225; // Começa em -45 graus (ângulo polar)
  const endAngle = -45; // Termina em 225 graus (ângulo polar)

  const ticks = [-100, -50, 0, 50, 100];

  // Determina a cor com base no valor do NPS
  const getColor = (npsValue: number) => {
    if (npsValue >= 50) return '#4CAF50'; // Promotores (verde)
    if (npsValue >= 0) return '#FFC107'; // Passivos (amarelo)
    return '#F44336'; // Detratores (vermelho)
  };

  return (
    <div className="w-full h-48 flex flex-col items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="70%" // Ajusta a posição vertical para centralizar melhor
          innerRadius="60%"
          outerRadius="100%"
          barSize={20}
          data={data}
          startAngle={startAngle}
          endAngle={endAngle}
        >
          <PolarAngleAxis
            type="number"
            domain={[min, max]} // Use o domínio real do NPS
            angleAxisId={0}
            tick={false} // Não renderiza os ticks padrão do PolarAngleAxis
            // tickFormatter={(tick) => `${tick}`}
            // tickCount={ticks.length}
            // ticks={ticks.map(t => ( (t - min) / range) * 270 - 45 )}

          />
          <RadialBar minAngle={15} clockWise dataKey="value" cornerRadius={10} fill={getColor(value)} />
          
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute bottom-0 text-center">
        <p className="text-4xl font-bold text-gray-800">{value}</p>
        <p className="text-lg text-gray-600">NPS</p>
      </div>
    </div>
  );
};

export default Gauge;
