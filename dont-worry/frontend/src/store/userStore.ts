import { create } from 'zustand';
import { User, UserPreferences } from '../types';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (user) => set({ 
    user, 
    isAuthenticated: true,
    error: null 
  }),

  updatePreferences: (preferences) => set((state) => {
    if (!state.user) return state;
    
    return {
      user: {
        ...state.user,
        preferences: {
          ...state.user.preferences,
          ...preferences
        }
      }
    };
  }),

  logout: () => set({ 
    user: null, 
    isAuthenticated: false,
    error: null 
  }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error })
}));

// Mock login for MVP (without backend)
export const mockLogin = (email: string, username: string): User => {
  return {
    id: crypto.randomUUID(),
    email,
    username,
    createdAt: new Date(),
    preferences: {
      entryMode: 'ask_every_time',
      theme: 'fireplace',
      language: 'cs',
      notificationsEnabled: true
    }
  };
};
