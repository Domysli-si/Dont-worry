import React, { useState } from 'react';
import { QuestionnaireData, ActivityType } from '../../types';
import { MoodSelector } from '../editor/MoodSelector';

interface QuestionnaireFormProps {
  onSubmit: (data: QuestionnaireData) => void;
  onCancel: () => void;
}

const activityOptions: { type: ActivityType; label: string; emoji: string }[] = [
  { type: 'work', label: 'Práce', emoji: '💼' },
  { type: 'sport', label: 'Sport', emoji: '🏃' },
  { type: 'social', label: 'Socializace', emoji: '👥' },
  { type: 'hobby', label: 'Koníčky', emoji: '🎨' },
  { type: 'rest', label: 'Odpočinek', emoji: '😴' }
];

export const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<QuestionnaireData>({
    mood: 5,
    sleepHours: 7,
    sleepQuality: 3,
    stressLevel: 5,
    activities: [],
    note: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const toggleActivity = (activity: ActivityType) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter(a => a !== activity)
        : [...prev.activities, activity]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mood */}
      <div>
        <MoodSelector
          value={formData.mood}
          onChange={(value) => setFormData(prev => ({ ...prev, mood: value }))}
        />
      </div>

      {/* Sleep */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            Kolik hodin jsi spal/a?
          </label>
          <input
            type="number"
            min="0"
            max="24"
            step="0.5"
            value={formData.sleepHours}
            onChange={(e) => setFormData(prev => ({ ...prev, sleepHours: Number(e.target.value) }))}
            className="w-full px-4 py-2 bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-fire)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            Kvalita spánku (1-5)
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, sleepQuality: rating }))}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  formData.sleepQuality === rating
                    ? 'bg-gradient-to-r from-[var(--accent-warm)] to-[var(--accent-fire)] text-white shadow-lg'
                    : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stress */}
      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
          Úroveň stresu (1-10)
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={formData.stressLevel}
          onChange={(e) => setFormData(prev => ({ ...prev, stressLevel: Number(e.target.value) }))}
          className="w-full h-2 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer 
                     [&::-webkit-slider-thumb]:appearance-none 
                     [&::-webkit-slider-thumb]:w-6 
                     [&::-webkit-slider-thumb]:h-6 
                     [&::-webkit-slider-thumb]:rounded-full 
                     [&::-webkit-slider-thumb]:bg-gradient-to-r 
                     [&::-webkit-slider-thumb]:from-[var(--accent-warm)] 
                     [&::-webkit-slider-thumb]:to-[var(--accent-fire)]
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-webkit-slider-thumb]:shadow-lg"
        />
        <div className="flex justify-between mt-2 text-xs text-[var(--text-muted)]">
          <span>Žádný stres</span>
          <span className="font-medium text-[var(--text-primary)]">{formData.stressLevel}/10</span>
          <span>Extrémní stres</span>
        </div>
      </div>

      {/* Activities */}
      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
          Čím ses dnes zabýval/a?
        </label>
        <div className="grid grid-cols-2 gap-3">
          {activityOptions.map(({ type, label, emoji }) => (
            <button
              key={type}
              type="button"
              onClick={() => toggleActivity(type)}
              className={`p-4 rounded-lg transition-all ${
                formData.activities.includes(type)
                  ? 'bg-gradient-to-r from-[var(--accent-warm)] to-[var(--accent-fire)] text-white shadow-lg scale-105'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
              }`}
            >
              <span className="text-2xl block mb-1">{emoji}</span>
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Note */}
      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
          Poznámka (volitelné)
        </label>
        <textarea
          value={formData.note}
          onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
          placeholder="Něco, co bys chtěl/a zaznamenat..."
          rows={4}
          className="w-full px-4 py-2 bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-fire)] resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
        >
          Zrušit
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-gradient-to-r from-[var(--accent-warm)] to-[var(--accent-fire)] text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all"
        >
          Uložit
        </button>
      </div>
    </form>
  );
};
