import { create } from 'zustand';
import type { Profile, Session, Participant, Question, Track } from '../types';

// Auth Store
interface AuthState {
  user: Profile | null;
  isAuthenticated: boolean;
  setUser: (user: Profile | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

// Session Store
interface SessionState {
  currentSession: Session | null;
  currentParticipant: Participant | null;
  participants: Participant[];
  setCurrentSession: (session: Session) => void;
  setCurrentParticipant: (participant: Participant) => void;
  setParticipants: (participants: Participant[]) => void;
  updateParticipant: (participant: Participant) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  currentSession: null,
  currentParticipant: null,
  participants: [],
  setCurrentSession: (session) => set({ currentSession: session }),
  setCurrentParticipant: (participant) => set({ currentParticipant: participant }),
  setParticipants: (participants) => set({ participants }),
  updateParticipant: (participant) =>
    set((state) => ({
      participants: state.participants.map((p) =>
        p.id === participant.id ? participant : p
      ),
      currentParticipant:
        state.currentParticipant?.id === participant.id
          ? participant
          : state.currentParticipant,
    })),
  clearSession: () =>
    set({ currentSession: null, currentParticipant: null, participants: [] }),
}));

// Racing Store
interface RacingState {
  isRacing: boolean;
  currentLap: number;
  checkpointsPassed: number;
  correctAnswers: number;
  totalQuestions: number;
  currentTimeMs: number;
  powerUps: string[];
  vehicleX: number;
  vehicleY: number;
  vehicleRotation: number;
  velocity: number;
  startRace: () => void;
  endRace: () => void;
  updatePosition: (x: number, y: number, rotation: number, velocity: number) => void;
  updateLap: () => void;
  updateCheckpoint: () => void;
  recordAnswer: (isCorrect: boolean) => void;
  addPowerUp: (type: string) => void;
  usePowerUp: (type: string) => void;
  updateTime: (ms: number) => void;
  reset: () => void;
}

export const useRacingStore = create<RacingState>((set) => ({
  isRacing: false,
  currentLap: 1,
  checkpointsPassed: 0,
  correctAnswers: 0,
  totalQuestions: 0,
  currentTimeMs: 0,
  powerUps: [],
  vehicleX: 0,
  vehicleY: 0,
  vehicleRotation: 0,
  velocity: 0,
  startRace: () => set({ isRacing: true, currentLap: 1, currentTimeMs: 0 }),
  endRace: () => set({ isRacing: false }),
  updatePosition: (x, y, rotation, velocity) =>
    set({ vehicleX: x, vehicleY: y, vehicleRotation: rotation, velocity }),
  updateLap: () =>
    set((state) => ({ currentLap: state.currentLap + 1, checkpointsPassed: 0 })),
  updateCheckpoint: () =>
    set((state) => ({ checkpointsPassed: state.checkpointsPassed + 1 })),
  recordAnswer: (isCorrect) =>
    set((state) => ({
      totalQuestions: state.totalQuestions + 1,
      correctAnswers: isCorrect ? state.correctAnswers + 1 : state.correctAnswers,
    })),
  addPowerUp: (type) =>
    set((state) => ({ powerUps: [...state.powerUps, type] })),
  usePowerUp: (type) =>
    set((state) => ({ powerUps: state.powerUps.filter((p) => p !== type) })),
  updateTime: (ms) => set({ currentTimeMs: ms }),
  reset: () =>
    set({
      isRacing: false,
      currentLap: 1,
      checkpointsPassed: 0,
      correctAnswers: 0,
      totalQuestions: 0,
      currentTimeMs: 0,
      powerUps: [],
      vehicleX: 0,
      vehicleY: 0,
      vehicleRotation: 0,
      velocity: 0,
    }),
}));

// Data Store
interface DataState {
  questions: Question[];
  tracks: Track[];
  setQuestions: (questions: Question[]) => void;
  setTracks: (tracks: Track[]) => void;
  addQuestion: (question: Question) => void;
  addTrack: (track: Track) => void;
  removeQuestion: (id: string) => void;
  removeTrack: (id: string) => void;
}

export const useDataStore = create<DataState>((set) => ({
  questions: [],
  tracks: [],
  setQuestions: (questions) => set({ questions }),
  setTracks: (tracks) => set({ tracks }),
  addQuestion: (question) =>
    set((state) => ({ questions: [...state.questions, question] })),
  addTrack: (track) =>
    set((state) => ({ tracks: [...state.tracks, track] })),
  removeQuestion: (id) =>
    set((state) => ({
      questions: state.questions.filter((q) => q.id !== id),
    })),
  removeTrack: (id) =>
    set((state) => ({
      tracks: state.tracks.filter((t) => t.id !== id),
    })),
}));

// UI Store
interface UIState {
  isLoading: boolean;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  setLoading: (loading: boolean) => void;
  setNotification: (
    notification: { message: string; type: 'success' | 'error' | 'info' } | null
  ) => void;
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  notification: null,
  setLoading: (loading) => set({ isLoading: loading }),
  setNotification: (notification) => set({ notification }),
  showNotification: (message, type) => {
    set({ notification: { message, type } });
    setTimeout(() => set({ notification: null }), 3000);
  },
}));
