import React from 'react';

interface MoodSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const moodEmojis = [
  { value: 1, emoji: '😢', label: 'Velmi špatná' },
  { value: 2, emoji: '😟', label: 'Špatná' },
  { value: 3, emoji: '😕', label: 'Ne moc dobrá' },
  { value: 4, emoji: '😐', label: 'Neutrální' },
  { value: 5, emoji: '🙂', label: 'V pohodě' },
  { value: 6, emoji: '😊', label: 'Dobrá' },
  { value: 7, emoji: '😄', label: 'Velmi dobrá' },
  { value: 8, emoji: '😁', label: 'Skvělá' },
  { value: 9, emoji: '🤩', label: 'Úžasná' },
  { value: 10, emoji: '🥳', label: 'Nejlepší' }
];

export const MoodSelector: React.FC<MoodSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[var(--text-primary)]">
          Jak se dnes cítíš?
        </label>
        <span className="text-2xl">{moodEmojis[value - 1]?.emoji}</span>
      </div>
      
      {/* Slider */}
      <div className="relative">
        <input
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer 
                     [&::-webkit-slider-thumb]:appearance-none 
                     [&::-webkit-slider-thumb]:w-6 
                     [&::-webkit-slider-thumb]:h-6 
                     [&::-webkit-slider-thumb]:rounded-full 
                     [&::-webkit-slider-thumb]:bg-gradient-to-r 
                     [&::-webkit-slider-thumb]:from-[var(--accent-warm)] 
                     [&::-webkit-slider-thumb]:to-[var(--accent-fire)]
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-webkit-slider-thumb]:shadow-lg
                     [&::-webkit-slider-thumb]:transition-transform
                     [&::-webkit-slider-thumb]:hover:scale-110"
        />
        
        {/* Labels */}
        <div className="flex justify-between mt-2 text-xs text-[var(--text-muted)]">
          <span>😢 Nejhorší</span>
          <span>🥳 Nejlepší</span>
        </div>
      </div>
      
      {/* Current mood label */}
      <div className="text-center p-3 bg-[var(--bg-tertiary)] rounded-lg">
        <p className="text-sm text-[var(--text-secondary)]">
          {moodEmojis[value - 1]?.label}
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          {value}/10
        </p>
      </div>
    </div>
  );
};
