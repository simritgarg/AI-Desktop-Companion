import { create } from 'zustand';
import { Task, Goal, Reminder, AICoachResponse } from './api';

export type CharacterState = 
  | 'IDLE' 
  | 'WALKING_IN' 
  | 'WALKING_OUT' 
  | 'GREETING' 
  | 'TALKING' 
  | 'DRINKING' 
  | 'STUDYING' 
  | 'TYPING' 
  | 'STRETCHING' 
  | 'CELEBRATING' 
  | 'THINKING' 
  | 'DISAPPOINTED' 
  | 'SLEEPING' 
  | 'MOTIVATIONAL';

interface CompanionStore {
  characterState: CharacterState;
  companionMessage: string;
  actionButtons: string[];
  accountabilityMode: 'FRIENDLY' | 'BALANCED' | 'STRICT' | 'NO_EXCUSES';
  personality: 'BEST_FRIEND' | 'COACH' | 'STUDY_BUDDY' | 'STRICT_MENTOR';
  companionName: string;
  activeFocusSession: boolean;
  focusMinutesRemaining: number;
  
  setCharacterState: (state: CharacterState) => void;
  setCompanionMessage: (msg: string, buttons?: string[]) => void;
  setAccountabilityMode: (mode: 'FRIENDLY' | 'BALANCED' | 'STRICT' | 'NO_EXCUSES') => void;
  setPersonality: (personality: 'BEST_FRIEND' | 'COACH' | 'STUDY_BUDDY' | 'STRICT_MENTOR') => void;
  setCompanionResponse: (res: AICoachResponse) => void;
}

export const useCompanionStore = create<CompanionStore>((set) => ({
  characterState: 'IDLE',
  companionMessage: "Hey! Ready to make today productive?",
  actionButtons: ["What should I do now?", "Drink Water", "Start Focus"],
  accountabilityMode: 'BALANCED',
  personality: 'BEST_FRIEND',
  companionName: 'Aria',
  activeFocusSession: false,
  focusMinutesRemaining: 25,

  setCharacterState: (state) => set({ characterState: state }),
  setCompanionMessage: (msg, buttons = []) => set({ companionMessage: msg, actionButtons: buttons }),
  setAccountabilityMode: (mode) => set({ accountabilityMode: mode }),
  setPersonality: (personality) => set({ personality }),
  setCompanionResponse: (res) => set({
    companionMessage: res.message,
    characterState: (res.animationState as CharacterState) || 'TALKING',
    actionButtons: res.actionButtons || []
  })
}));
