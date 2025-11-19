import { create } from 'zustand';
import { Entry, Metric } from '../types';
import { db, dbHelpers } from '../db/schema';

interface EntryState {
  entries: Entry[];
  currentEntry: Entry | null;
  metrics: Metric[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadEntries: (userId: string) => Promise<void>;
  createEntry: (entry: Omit<Entry, 'id'>) => Promise<string>;
  updateEntry: (id: string, changes: Partial<Entry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  setCurrentEntry: (entry: Entry | null) => void;
  loadMetricsForDateRange: (startDate: Date, endDate: Date) => Promise<void>;
}

export const useEntryStore = create<EntryState>((set, get) => ({
  entries: [],
  currentEntry: null,
  metrics: [],
  isLoading: false,
  error: null,

  loadEntries: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const entries = await dbHelpers.getEntries(userId, 50);
      set({ entries, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load entries',
        isLoading: false 
      });
    }
  },

  createEntry: async (entry) => {
    set({ isLoading: true, error: null });
    try {
      const id = await dbHelpers.createEntry(entry);
      const newEntry = await dbHelpers.getEntryById(id);
      
      if (newEntry) {
        set((state) => ({ 
          entries: [newEntry, ...state.entries],
          isLoading: false 
        }));
      }
      
      return id;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create entry',
        isLoading: false 
      });
      throw error;
    }
  },

  updateEntry: async (id, changes) => {
    set({ isLoading: true, error: null });
    try {
      await dbHelpers.updateEntry(id, changes);
      const updatedEntry = await dbHelpers.getEntryById(id);
      
      if (updatedEntry) {
        set((state) => ({
          entries: state.entries.map(e => e.id === id ? updatedEntry : e),
          currentEntry: state.currentEntry?.id === id ? updatedEntry : state.currentEntry,
          isLoading: false
        }));
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update entry',
        isLoading: false 
      });
    }
  },

  deleteEntry: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await dbHelpers.deleteEntry(id);
      set((state) => ({
        entries: state.entries.filter(e => e.id !== id),
        currentEntry: state.currentEntry?.id === id ? null : state.currentEntry,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete entry',
        isLoading: false 
      });
    }
  },

  setCurrentEntry: (entry) => set({ currentEntry: entry }),

  loadMetricsForDateRange: async (startDate, endDate) => {
    set({ isLoading: true, error: null });
    try {
      const metrics = await dbHelpers.getMetricsForDateRange(startDate, endDate);
      set({ metrics, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load metrics',
        isLoading: false 
      });
    }
  }
}));

