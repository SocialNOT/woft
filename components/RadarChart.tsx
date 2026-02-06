
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface Props {
  data: {
    logic: number;
    clarity: number;
    efficiency: number;
    control: number;
  };
}

export const SkillRadar: React.FC<Props> = ({ data }) => {
  const chartData = [
    { subject: 'Logic', A: data.logic, fullMark: 100 },
    { subject: 'Clarity', A: data.clarity, fullMark: 100 },
    { subject: 'Efficiency', A: data.efficiency, fullMark: 100 },
    { subject: 'Control', A: data.control, fullMark: 100 },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="#475569" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <Radar
            name="Skills"
            dataKey="A"
            stroke="#818cf8"
            fill="#818cf8"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
