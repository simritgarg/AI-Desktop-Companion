'use client';

import React, { useEffect, useState } from 'react';
import { Avatar } from '@/components/companion/Avatar';
import { SpeechBubble } from '@/components/companion/SpeechBubble';
import { AnimationController } from '@/components/companion/AnimationController';
import { useCompanionStore } from '@/lib/store';

export default function CompanionOverlayPage() {
  const [mounted, setMounted] = useState(false);

  const characterState = useCompanionStore((s) => s.characterState);
  const interactionStage = useCompanionStore((s) => s.interactionStage);
  const companionMessage = useCompanionStore((s) => s.companionMessage);
  const actionButtons = useCompanionStore((s) => s.actionButtons);
  const avatarConfig = useCompanionStore((s) => s.avatarConfig);

  const setCharacterState = useCompanionStore((s) => s.setCharacterState);
  const setInteractionStage = useCompanionStore((s) => s.setInteractionStage);
  const startWalkOut = useCompanionStore((s) => s.startWalkOut);
  const startWalkIn = useCompanionStore((s) => s.startWalkIn);

  useEffect(() => {
    setMounted(true);
    startWalkIn("Time to drink water! 💧", "DRINKING", ["YES, I DRANK", "SNOOZE"]);

    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      (window as any).electronAPI.onTriggerReminder((reminder: any) => {
        startWalkIn(
          reminder?.title ? `Hey! ${reminder.title} 💧` : "Time to drink water! 💧",
          (reminder?.animationType as any) || "DRINKING",
          ["YES, I DRANK", "SNOOZE"]
        );
      });
    }
  }, []);

  const handleWalkInComplete = () => {
    setInteractionStage('WAITING_FOR_USER');
    if (characterState === 'WALKING_IN') {
      setCharacterState('DRINKING');
    }
  };

  const handleWalkOutComplete = () => {
    setInteractionStage('HIDDEN');
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      (window as any).electronAPI.closeWindow();
    }
  };

  const handleActionSelect = (action: string) => {
    if (action.includes('Done') || action.includes('YES') || action.includes('DRANK')) {
      setCharacterState('CELEBRATING');
      setTimeout(() => {
        startWalkOut();
      }, 1200);
    } else if (action.includes('SNOOZE') || action.includes('Remind')) {
      startWalkOut();
    } else if (action.includes('Skip')) {
      startWalkOut();
    } else {
      startWalkOut();
    }
  };

  const handleClose = () => {
    startWalkOut();
  };

  if (!mounted || interactionStage === 'HIDDEN') {
    return <main className="w-full h-screen bg-transparent select-none overflow-hidden" />;
  }

  return (
    <main className="w-full h-screen bg-transparent flex items-end justify-end p-4 select-none overflow-hidden relative">
      <AnimationController
        stage={interactionStage}
        onWalkInComplete={handleWalkInComplete}
        onWalkOutComplete={handleWalkOutComplete}
      >
        {({ isFacingRight }) => (
          <div className="flex flex-col items-center">
            {interactionStage !== 'WALKING_IN' && interactionStage !== 'WALKING_OUT' && (
              <SpeechBubble
                message={companionMessage}
                buttons={actionButtons}
                onActionSelect={handleActionSelect}
                onClose={handleClose}
              />
            )}

            <Avatar
              state={characterState}
              config={avatarConfig}
              isFacingRight={isFacingRight}
              onClick={() => setCharacterState('GREETING')}
            />
          </div>
        )}
      </AnimationController>
    </main>
  );
}
