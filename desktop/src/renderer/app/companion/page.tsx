'use client';

import React, { useEffect } from 'react';
import { CharacterCanvas } from '@/components/companion/CharacterCanvas';
import { SpeechBubble } from '@/components/companion/SpeechBubble';
import { useCompanionStore } from '@/lib/store';
import { fetchAIRecommendation } from '@/lib/api';

export default function CompanionOverlayPage() {
  const { characterState, companionMessage, actionButtons, setCharacterState, setCompanionResponse } = useCompanionStore();

  useEffect(() => {
    // Initial greeting load
    const loadGreeting = async () => {
      try {
        const res = await fetchAIRecommendation();
        setCompanionResponse(res);
      } catch {
        // Fallback default
      }
    };
    loadGreeting();
  }, [setCompanionResponse]);

  const handleActionSelect = (action: string) => {
    if (action.includes('Done')) {
      setCharacterState('CELEBRATING');
      setTimeout(() => setCharacterState('IDLE'), 3000);
    } else if (action.includes('Remind')) {
      setCharacterState('WALKING_OUT');
      setTimeout(() => setCharacterState('IDLE'), 2000);
    } else if (action.includes('Skip')) {
      setCharacterState('IDLE');
    }
  };

  return (
    <main className="w-full h-screen bg-transparent flex flex-col items-end justify-end p-2 select-none overflow-hidden">
      {/* Dialogue overlay speech bubble */}
      <SpeechBubble 
        message={companionMessage} 
        buttons={actionButtons} 
        onActionSelect={handleActionSelect} 
      />

      {/* Animated Female Virtual Companion */}
      <CharacterCanvas 
        state={characterState} 
        onClick={() => setCharacterState('GREETING')} 
      />
    </main>
  );
}
