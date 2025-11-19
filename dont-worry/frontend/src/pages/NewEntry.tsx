import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { useEntryStore } from '../store/entryStore';
import { dbHelpers } from '../db/schema';
import { TextEditor } from '../components/editor/TextEditor';
import { MoodSelector } from '../components/editor/MoodSelector';
import { QuestionnaireForm } from '../components/form/QuestionnaireForm';
import { Modal } from '../components/shared/Modal';
import { Button } from '../components/shared/Button';
import { ArrowLeft, FileText, ClipboardList } from 'lucide-react';
import { EntryType, QuestionnaireData } from '../types';

export const NewEntry: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { createEntry } = useEntryStore();
  
  const [entryType, setEntryType] = useState<EntryType | null>(null);
  const [showModeSelector, setShowModeSelector] = useState(true);
  
  // Editor state
  const [editorContent, setEditorContent] = useState('');
  const [mood, setMood] = useState(5);
  
  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    navigate('/');
    return null;
  }

  const handleEditorSubmit = async () => {
    if (!editorContent.trim()) {
      alert('Prosím napiš nějaký text');
      return;
    }

    setIsSubmitting(true);
    try {
      const entryId = await createEntry({
        userId: user.id,
        type: 'editor',
        content: {
          text: editorContent,
          wordCount: editorContent.split(/\s+/).length
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        synced: false
      });

      // Create metric
      await dbHelpers.createMetric({
        entryId,
        moodScore: mood
      });

      navigate('/');
    } catch (error) {
      console.error('Failed to create entry:', error);
      alert('Nepodařilo se uložit záznam');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (data: QuestionnaireData) => {
    setIsSubmitting(true);
    try {
      const entryId = await createEntry({
        userId: user.id,
        type: 'form',
        content: {
          questions: [
            { question: 'Nálada', answer: data.mood },
            { question: 'Spánek (hodiny)', answer: data.sleepHours },
            { question: 'Kvalita spánku', answer: data.sleepQuality },
            { question: 'Stres', answer: data.stressLevel },
            { question: 'Aktivity', answer: data.activities.join(', ') },
            ...(data.note ? [{ question: 'Poznámka', answer: data.note }] : [])
          ]
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        synced: false
      });

      // Create metric
      await dbHelpers.createMetric({
        entryId,
        moodScore: data.mood,
        sleepHours: data.sleepHours,
        stressLevel: data.stressLevel
      });

      // Create activities
      for (const activity of data.activities) {
        await dbHelpers.createActivity({
          entryId,
          activityType: activity,
          durationMinutes: 0
        });
      }

      navigate('/');
    } catch (error) {
      console.error('Failed to create entry:', error);
      alert('Nepodařilo se uložit záznam');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mode selector modal
  if (user.preferences.entryMode === 'ask_every_time' && showModeSelector && !entryType) {
    return (
      <Modal isOpen={true} onClose={() => navigate('/')} title="Vyber typ záznamu" size="md">
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => {
              setEntryType('editor');
              setShowModeSelector(false);
            }}
            className="p-6 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-all text-center"
          >
            <FileText className="w-12 h-12 text-[var(--accent-fire)] mx-auto mb-3" />
            <h3 className="font-semibold text-[var(--text-primary)] mb-2">Textový editor</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Volně piš své myšlenky
            </p>
          </button>

          <button
            onClick={() => {
              setEntryType('form');
              setShowModeSelector(false);
            }}
            className="p-6 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-all text-center"
          >
            <ClipboardList className="w-12 h-12 text-[var(--accent-fire)] mx-auto mb-3" />
            <h3 className="font-semibold text-[var(--text-primary)] mb-2">Formulář</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Rychlý strukturovaný záznam
            </p>
          </button>
        </div>
      </Modal>
    );
  }

  const currentType = entryType || user.preferences.entryMode;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Zpět
          </button>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            {currentType === 'editor' ? 'Nový záznam - Editor' : 'Nový záznam - Formulář'}
          </h1>
        </header>

        {/* Content */}
        <div className="bg-[var(--bg-secondary)] rounded-xl p-6">
          {currentType === 'editor' ? (
            <div className="space-y-6">
              <MoodSelector value={mood} onChange={setMood} />
              <TextEditor content={editorContent} onChange={setEditorContent} />
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => navigate('/')} className="flex-1">
                  Zrušit
                </Button>
                <Button 
                  onClick={handleEditorSubmit} 
                  isLoading={isSubmitting}
                  className="flex-1"
                >
                  Uložit záznam
                </Button>
              </div>
            </div>
          ) : (
            <QuestionnaireForm
              onSubmit={handleFormSubmit}
              onCancel={() => navigate('/')}
            />
          )}
        </div>
      </div>
    </div>
  );
};
