import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { useEntryStore } from '../store/entryStore';
import { PlusCircle, BookOpen, BarChart3 } from 'lucide-react';
import { Button } from '../components/shared/Button';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { entries, loadEntries, isLoading } = useEntryStore();

  useEffect(() => {
    if (user) {
      loadEntries(user.id);
    }
  }, [user, loadEntries]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
            Dont Worry
          </h1>
          <p className="text-[var(--text-secondary)] mb-8">
            Tvůj osobní deník pro sledování nálady a wellbeing
          </p>
          <Button onClick={() => {
            // Mock login for MVP
            const mockUser = {
              id: crypto.randomUUID(),
              email: 'user@example.com',
              username: 'Demo User',
              createdAt: new Date(),
              preferences: {
                entryMode: 'ask_every_time' as const,
                theme: 'fireplace' as const,
                language: 'cs' as const,
                notificationsEnabled: true
              }
            };
            useUserStore.getState().setUser(mockUser);
          }}>
            Začít používat
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            Ahoj, {user.username}! 👋
          </h1>
          <p className="text-[var(--text-secondary)]">
            {format(new Date(), "EEEE, d. MMMM yyyy", { locale: cs })}
          </p>
        </header>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => navigate('/new-entry')}
            className="p-6 bg-gradient-to-br from-[var(--accent-warm)] to-[var(--accent-fire)] rounded-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            <PlusCircle className="w-8 h-8 text-white mb-3" />
            <h3 className="text-lg font-semibold text-white mb-1">Nový záznam</h3>
            <p className="text-sm text-white/80">Zaznamenej svou náladu</p>
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="p-6 bg-[var(--bg-secondary)] rounded-xl hover:bg-[var(--bg-tertiary)] transition-all border border-[var(--bg-tertiary)]"
          >
            <BarChart3 className="w-8 h-8 text-[var(--accent-fire)] mb-3" />
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">Dashboard</h3>
            <p className="text-sm text-[var(--text-secondary)]">Prohlédni si statistiky</p>
          </button>

          <div className="p-6 bg-[var(--bg-secondary)] rounded-xl border border-[var(--bg-tertiary)]">
            <BookOpen className="w-8 h-8 text-[var(--accent-fire)] mb-3" />
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
              {entries.length} záznamů
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">Celkem vytvořeno</p>
          </div>
        </div>

        {/* Recent Entries */}
        <div className="bg-[var(--bg-secondary)] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            Poslední záznamy
          </h2>

          {isLoading ? (
            <div className="text-center py-8 text-[var(--text-muted)]">
              Načítání...
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[var(--text-muted)] mb-4">
                Zatím nemáš žádné záznamy
              </p>
              <Button onClick={() => navigate('/new-entry')}>
                Vytvořit první záznam
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.slice(0, 5).map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--bg-primary)] transition-colors cursor-pointer"
                  onClick={() => navigate(`/entry/${entry.id}`)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[var(--text-muted)]">
                      {format(entry.createdAt, "d. MMM yyyy, HH:mm", { locale: cs })}
                    </span>
                    <span className="px-2 py-1 bg-[var(--bg-secondary)] rounded text-xs text-[var(--text-secondary)]">
                      {entry.type === 'editor' ? '✍️ Editor' : '📋 Formulář'}
                    </span>
                  </div>
                  {entry.type === 'editor' && (
                    <p className="text-[var(--text-primary)] line-clamp-2">
                      {(entry.content as any).text?.replace(/<[^>]*>/g, '').slice(0, 100)}...
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
