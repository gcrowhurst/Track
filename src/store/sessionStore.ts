import { create } from 'zustand';
import type { Session, Participant, Question } from '../types';

interface SessionState {
  // Session info
  currentSession: Session | null;
  sessionCode: string;
  hostId: string | null;
  isHost: boolean;

  // Participants
  participants: Participant[];
  currentParticipant: Participant | null;

  // Race state
  raceStatus: 'waiting' | 'countdown' | 'active' | 'paused' | 'finished';
  countdownSeconds: number;
  currentLap: number;
  totalLaps: number;

  // Questions
  currentQuestion: Question | null;
  questionHistory: Array<{
    questionId: string;
    answerIndex: number;
    isCorrect: boolean;
    timeTaken: number;
  }>;

  // Actions
  setSession: (session: Session) => void;
  setSessionCode: (code: string) => void;
  setIsHost: (isHost: boolean) => void;
  setParticipants: (participants: Participant[]) => void;
  addParticipant: (participant: Participant) => void;
  updateParticipant: (participantId: string, updates: Partial<Participant>) => void;
  setCurrentParticipant: (participant: Participant) => void;
  setRaceStatus: (status: SessionState['raceStatus']) => void;
  setCountdown: (seconds: number) => void;
  setCurrentQuestion: (question: Question | null) => void;
  recordQuestionAnswer: (
    questionId: string,
    answerIndex: number,
    isCorrect: boolean,
    timeTaken: number
  ) => void;
  setLapInfo: (currentLap: number, totalLaps: number) => void;
  reset: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  // Initial state
  currentSession: null,
  sessionCode: '',
  hostId: null,
  isHost: false,
  participants: [],
  currentParticipant: null,
  raceStatus: 'waiting',
  countdownSeconds: 0,
  currentLap: 0,
  totalLaps: 3,
  currentQuestion: null,
  questionHistory: [],

  // Actions
  setSession: (session) => set({ currentSession: session }),
  setSessionCode: (code) => set({ sessionCode: code }),
  setIsHost: (isHost) => set({ isHost }),
  setParticipants: (participants) => set({ participants }),
  addParticipant: (participant) =>
    set((state) => ({
      participants: [...state.participants, participant],
    })),
  updateParticipant: (participantId, updates) =>
    set((state) => ({
      participants: state.participants.map((p) =>
        p.id === participantId ? { ...p, ...updates } : p
      ),
      currentParticipant:
        state.currentParticipant?.id === participantId
          ? { ...state.currentParticipant, ...updates }
          : state.currentParticipant,
    })),
  setCurrentParticipant: (participant) => set({ currentParticipant: participant }),
  setRaceStatus: (status) => set({ raceStatus: status }),
  setCountdown: (seconds) => set({ countdownSeconds: seconds }),
  setCurrentQuestion: (question) => set({ currentQuestion: question }),
  recordQuestionAnswer: (questionId, answerIndex, isCorrect, timeTaken) =>
    set((state) => ({
      questionHistory: [
        ...state.questionHistory,
        { questionId, answerIndex, isCorrect, timeTaken },
      ],
    })),
  setLapInfo: (currentLap, totalLaps) =>
    set({ currentLap, totalLaps }),
  reset: () =>
    set({
      currentSession: null,
      sessionCode: '',
      hostId: null,
      isHost: false,
      participants: [],
      currentParticipant: null,
      raceStatus: 'waiting',
      countdownSeconds: 0,
      currentLap: 0,
      totalLaps: 3,
      currentQuestion: null,
      questionHistory: [],
    }),
}));
