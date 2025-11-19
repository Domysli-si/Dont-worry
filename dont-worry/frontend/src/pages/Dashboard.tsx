import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { useEntryStore } from '../store/entryStore';
import { MoodChart } from '../components/dashboard/MoodChart';
import { Button } from '../components/shared/Button';
import { ArrowLeft, TrendingUp, Calendar, Activity } from 'lucide-react';
import { TrendData } from '../types';
import { subDays, format } from 'date-fns';
import { dbHelpers } from '../db/schema';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { entries } = useEntryStore();
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Get last 30 days of data
        const endDate = new Date();
        const startDate = subDays(endDate, 30);
        
        const metrics = await dbHelpers.getMetricsForDateRange(startDate, endDate);
        const entriesInRange = entries.filter(e => 
          e.createdAt >= startDate && e.createdAt <= endDate
        );

        // Group by date
        const dataByDate = new Map<string, TrendData>();
        
        entriesInRange.forEach(entry => {
          const dateStr = format(entry.createdAt, 'yyyy-MM-dd');
          const entryMetrics = metrics.filter(m => m.entryId === entry.id);
          
          if (entryMetrics.length > 0) {
            const avgMood = entryMetrics.reduce((sum, m) => sum + m.moodScore, 0) / entryMetrics.length;
            const avgSleep = entryMetrics
              .filter(m => m.sleepHours !== undefined)
              .reduce((sum, m) => sum + (m.sleepHours || 0), 0) / entryMetrics.length || undefined;
            const avgStress = entryMetrics
              .filter(m => m.stressLevel !== undefined)
              .reduce((sum, m) => sum + (m.stressLevel || 0), 0) / entryMetrics.length || undefined;

            dataByDate.set(dateStr, {
              date: dateStr,
              moodScore: avgMood,
              sleepHours: avgSleep,
              stressLevel: avgStress
            });
          }
        });

        setTrendData(Array.from(dataByDate.values()).sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        ));
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user, entries]);

  if (!user) {
    navigate('/');
    return null;
  }

  const avgMood = trendData.length > 0
    ? trendData.reduce((sum, d) => sum + d.moodScore, 0) / trendData.length
    : 0;

  const daysTracked = trendData.length;
  const currentStreak = calculateStreak(trendData);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Zpět
          </button>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Dashboard</h1>
        </header>

        {isLoading ? (
          <div className="text-center py-12 text-[var(--text-muted)]">
            Načítání dat...
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[var(--bg-secondary)] p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-6 h-6 text-[var(--accent-fire)]" />
                  <h3 className="text-sm text-[var(--text-muted)]">Průměrná nálada</h3>
                </div>
                <p className="text-3xl font-bold text-[var(--text-primary)]">
                  {avgMood.toFixed(1)}/10
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Za posledních 30 dní
                </p>
              </div>

              <div className="bg-[var(--bg-secondary)] p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-6 h-6 text-[var(--accent-fire)]" />
                  <h3 className="text-sm text-[var(--text-muted)]">Dní sledováno</h3>
                </div>
                <p className="text-3xl font-bold text-[var(--text-primary)]">
                  {daysTracked}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Z posledních 30 dní
                </p>
              </div>

              <div className="bg-[var(--bg-secondary)] p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-6 h-6 text-[var(--accent-fire)]" />
                  <h3 className="text-sm text-[var(--text-muted)]">Aktuální série</h3>
                </div>
                <p className="text-3xl font-bold text-[var(--text-primary)]">
                  {currentStreak}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  {currentStreak === 1 ? 'den' : currentStreak < 5 ? 'dny' : 'dní'} v řadě
                </p>
              </div>
            </div>

            {/* Mood Chart */}
            <MoodChart data={trendData} />

            {/* Insights */}
            {trendData.length >= 7 && (
              <div className="bg-[var(--bg-secondary)] p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                  💡 Postřehy
                </h3>
                <div className="space-y-3">
                  {avgMood >= 7 && (
                    <div className="p-4 bg-[var(--success)]/10 border border-[var(--success)]/20 rounded-lg">
                      <p className="text-[var(--text-primary)]">
                        🎉 Skvělá práce! Tvoje průměrná nálada je výborná.
                      </p>
                    </div>
                  )}
                  {currentStreak >= 7 && (
                    <div className="p-4 bg-[var(--accent-fire)]/10 border border-[var(--accent-fire)]/20 rounded-lg">
                      <p className="text-[var(--text-primary)]">
                        🔥 Máš {currentStreak} dní v řadě! Pokračuj v pravidelném sledování.
                      </p>
                    </div>
                  )}
                  {avgMood < 5 && (
                    <div className="p-4 bg-[var(--warning)]/10 border border-[var(--warning)]/20 rounded-lg">
                      <p className="text-[var(--text-primary)]">
                        💙 Tvoje nálada mohla být lepší. Zkus se zaměřit na aktivity, které tě baví.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to calculate current streak
function calculateStreak(data: TrendData[]): number {
  if (data.length === 0) return 0;
  
  const sortedData = [...data].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  let streak = 0;
  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  
  // Check if we have data for today or yesterday
  if (sortedData[0].date !== today && sortedData[0].date !== yesterday) {
    return 0;
  }
  
  let currentDate = new Date(sortedData[0].date);
  
  for (const item of sortedData) {
    const itemDate = format(new Date(item.date), 'yyyy-MM-dd');
    const expectedDate = format(currentDate, 'yyyy-MM-dd');
    
    if (itemDate === expectedDate) {
      streak++;
      currentDate = subDays(currentDate, 1);
    } else {
      break;
    }
  }
  
  return streak;
}
