'use client';

import React, { useEffect, useState } from 'react';
import { InteractionStage } from '@/lib/store';

interface AnimationControllerProps {
  stage: InteractionStage;
  onWalkInComplete: () => void;
  onWalkOutComplete: () => void;
  children: (props: { offsetX: number; isFacingRight: boolean; currentStep: number }) => React.ReactNode;
}

export const AnimationController: React.FC<AnimationControllerProps> = ({
  stage,
  onWalkInComplete,
  onWalkOutComplete,
  children,
}) => {
  // Start off-screen on the right (offsetX = 320px)
  const [offsetX, setOffsetX] = useState(320);
  const [isFacingRight, setIsFacingRight] = useState(false);
  const [stepCount, setStepCount] = useState(0);

  useEffect(() => {
    if (stage === 'WALKING_IN') {
      setIsFacingRight(false); // Facing left towards screen center
      setOffsetX(320);
      setStepCount(0);

      // Walk 6 steps from right -> left
      let currentStep = 0;
      const totalSteps = 6;
      const stepDistance = 320 / totalSteps;

      const walkInterval = setInterval(() => {
        currentStep++;
        setStepCount(currentStep);
        setOffsetX(Math.max(0, 320 - currentStep * stepDistance));

        if (currentStep >= totalSteps) {
          clearInterval(walkInterval);
          setOffsetX(0);
          onWalkInComplete();
        }
      }, 350); // 350ms per step = 2.1s walking animation

      return () => clearInterval(walkInterval);
    } 
    
    if (stage === 'WALKING_OUT') {
      setIsFacingRight(true); // Turn towards right margin
      setOffsetX(0);
      setStepCount(0);

      let currentStep = 0;
      const totalSteps = 6;
      const stepDistance = 350 / totalSteps;

      const walkInterval = setInterval(() => {
        currentStep++;
        setStepCount(currentStep);
        setOffsetX(currentStep * stepDistance);

        if (currentStep >= totalSteps) {
          clearInterval(walkInterval);
          onWalkOutComplete();
        }
      }, 350);

      return () => clearInterval(walkInterval);
    }
  }, [stage, onWalkInComplete, onWalkOutComplete]);

  // Natural walking bobbing offset
  const bobY = (stage === 'WALKING_IN' || stage === 'WALKING_OUT') && stepCount % 2 === 1 ? -8 : 0;

  return (
    <div
      className="transition-transform duration-300 ease-out flex flex-col items-center justify-end"
      style={{
        transform: `translate3d(${offsetX}px, ${bobY}px, 0)`,
      }}
    >
      {children({ offsetX, isFacingRight, currentStep: stepCount })}
    </div>
  );
};
