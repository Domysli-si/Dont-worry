import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendData } from '../../types';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';

interface MoodChartProps {
  data: TrendData[];
}

export const MoodChart: React.FC<MoodChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-[var(--bg-secondary)] rounded-lg">
        <p className="text-[var(--text-muted)]">Zatím žádná data k zobrazení</p>
      </div>
    );
  }

  const chartData = data.map(item => ({
    ...item,
    formattedDate: format(new Date(item.date), 'd. MMM', { locale: cs })
  }));

  return (
    <div className="bg-[var(--bg-secondary)] p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
        Vývoj nálady
      </h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-tertiary)" />
          <XAxis 
            dataKey="formattedDate" 
            stroke="var(--text-muted)"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            domain={[0, 10]}
            stroke="var(--text-muted)"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--bg-tertiary)',
              borderRadius: '8px',
              color: 'var(--text-primary)'
            }}
            labelStyle={{ color: 'var(--text-secondary)' }}
          />
          <Line 
            type="monotone" 
            dataKey="moodScore" 
            stroke="var(--accent-fire)"
            strokeWidth={3}
            dot={{ fill: 'var(--accent-warm)', r: 5 }}
            activeDot={{ r: 7 }}
            name="Nálada"
          />
          {data.some(item => item.stressLevel !== undefined) && (
            <Line 
              type="monotone" 
              dataKey="stressLevel" 
              stroke="var(--warning)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: 'var(--warning)', r: 4 }}
              name="Stres"
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-[var(--bg-tertiary)] p-4 rounded-lg text-center">
          <p className="text-sm text-[var(--text-muted)] mb-1">Průměr</p>
          <p className="text-2xl font-bold text-[var(--accent-fire)]">
            {(data.reduce((sum, item) => sum + item.moodScore, 0) / data.length).toFixed(1)}
          </p>
        </div>
        
        <div className="bg-[var(--bg-tertiary)] p-4 rounded-lg text-center">
          <p className="text-sm text-[var(--text-muted)] mb-1">Nejlepší</p>
          <p className="text-2xl font-bold text-[var(--success)]">
            {Math.max(...data.map(item => item.moodScore))}
          </p>
        </div>
        
        <div className="bg-[var(--bg-tertiary)] p-4 rounded-lg text-center">
          <p className="text-sm text-[var(--text-muted)] mb-1">Nejhorší</p>
          <p className="text-2xl font-bold text-[var(--error)]">
            {Math.min(...data.map(item => item.moodScore))}
          </p>
        </div>
      </div>
    </div>
  );
};
