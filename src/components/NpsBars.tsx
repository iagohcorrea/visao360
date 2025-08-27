'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface NpsBarsProps {
  promoters: number;
  passives: number;
  detractors: number;
}

const NpsBars: React.FC<NpsBarsProps> = ({ promoters, passives, detractors }) => {
  const data = [
    { name: 'Promotores', count: promoters, fill: '#4CAF50' },
    { name: 'Passivos', count: passives, fill: '#FFC107' },
    { name: 'Detratores', count: detractors, fill: '#F44336' },
  ];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" label={{ position: 'top' }} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default NpsBars;
