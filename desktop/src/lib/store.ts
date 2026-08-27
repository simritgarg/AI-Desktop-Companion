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

export type InteractionStage = 
  | 'HIDDEN' 
  | 'WALKING_IN' 
  | 'PERFORMING_ACTION' 
  | 'WAITING_FOR_USER' 
  | 'WALKING_OUT';

export interface AvatarConfig {
  hairStyle: 'LONG_WAVY' | 'SHORT_BOB' | 'PONYTAIL' | 'BUN';
  hairColor: string;
  skinTone: string;
  eyeStyle: 'NORMAL' | 'SPARKLING' | 'CAT_EYE';
  glasses: 'NONE' | 'READING' | 'STYLISH';
  outfit: 'CASUAL' | 'STUDY' | 'COZY' | 'FORMAL';
  topColor: string;
  bottomColor: string;
  shoesColor: string;
  accessories: 'NONE' | 'HEADPHONES' | 'BOW';
}

interface CompanionStore {
  characterState: CharacterState;
  interactionStage: InteractionStage;
  companionMessage: string;
  actionButtons: string[];
  accountabilityMode: 'FRIENDLY' | 'BALANCED' | 'STRICT' | 'NO_EXCUSES';
  personality: 'BEST_FRIEND' | 'COACH' | 'STUDY_BUDDY' | 'STRICT_MENTOR';
  companionName: string;
  activeFocusSession: boolean;
  focusMinutesRemaining: number;
  avatarConfig: AvatarConfig;
  
  setCharacterState: (state: CharacterState) => void;
  setInteractionStage: (stage: InteractionStage) => void;
  setCompanionMessage: (msg: string, buttons?: string[]) => void;
  setAccountabilityMode: (mode: 'FRIENDLY' | 'BALANCED' | 'STRICT' | 'NO_EXCUSES') => void;
  setPersonality: (personality: 'BEST_FRIEND' | 'COACH' | 'STUDY_BUDDY' | 'STRICT_MENTOR') => void;
  setCompanionResponse: (res: AICoachResponse) => void;
  setAvatarConfig: (config: Partial<AvatarConfig>) => void;
  startWalkOut: () => void;
  startWalkIn: (message?: string, actionState?: CharacterState, buttons?: string[]) => void;
}

export const useCompanionStore = create<CompanionStore>((set, get) => ({
  characterState: 'IDLE',
  interactionStage: 'WAITING_FOR_USER',
  companionMessage: "Hey! Ready to make today productive?",
  actionButtons: ["YES, I DRANK", "SNOOZE"],
  accountabilityMode: 'BALANCED',
  personality: 'BEST_FRIEND',
  companionName: 'Aira',
  activeFocusSession: false,
  focusMinutesRemaining: 25,
  avatarConfig: {
    hairStyle: 'LONG_WAVY',
    hairColor: '#4C1D95',
    skinTone: '#FBCFE8',
    eyeStyle: 'SPARKLING',
    glasses: 'NONE',
    outfit: 'CASUAL',
    topColor: '#8B5CF6',
    bottomColor: '#475569',
    shoesColor: '#1E1B4B',
    accessories: 'NONE',
  },

  setCharacterState: (state) => set({ characterState: state }),
  setInteractionStage: (stage) => set({ interactionStage: stage }),
  setCompanionMessage: (msg, buttons = []) => set({ companionMessage: msg, actionButtons: buttons }),
  setAccountabilityMode: (mode) => set({ accountabilityMode: mode }),
  setPersonality: (personality) => set({ personality }),
  setCompanionResponse: (res) => set({
    companionMessage: res.message,
    characterState: (res.animationState as CharacterState) || 'TALKING',
    actionButtons: res.actionButtons || ["YES, I DRANK", "SNOOZE"]
  }),
  setAvatarConfig: (config) => set((state) => ({
    avatarConfig: { ...state.avatarConfig, ...config }
  })),

  startWalkOut: () => {
    set({ interactionStage: 'WALKING_OUT', characterState: 'WALKING_OUT' });
  },

  startWalkIn: (msg, actionState = 'GREETING', buttons) => {
    set({
      interactionStage: 'WALKING_IN',
      characterState: 'WALKING_IN',
      companionMessage: msg || get().companionMessage,
      actionButtons: buttons || get().actionButtons
    });
  }
}));
