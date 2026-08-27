'use client';

import React from 'react';
import { CharacterState } from '@/lib/store';

interface CharacterCanvasProps {
  state: CharacterState;
  onClick?: () => void;
}

export const CharacterCanvas: React.FC<CharacterCanvasProps> = ({ state, onClick }) => {
  // Render high-quality SVG vector avatar with dynamic pose variations & state-based animations
  const renderAvatarPose = () => {
    switch (state) {
      case 'DRINKING':
        return (
          <g>
            {/* Water bottle in hand sipping pose */}
            <circle cx="60" cy="35" r="22" fill="#FBCFE8" /> {/* Head */}
            <path d="M 45 28 Q 60 12 75 28" fill="#4C1D95" /> {/* Hair */}
            <circle cx="53" cy="36" r="2.5" fill="#1E1B4B" /> {/* Eyes closed sipping */}
            <circle cx="67" cy="36" r="2.5" fill="#1E1B4B" />
            <path d="M 57 44 Q 60 48 63 44" stroke="#BE185D" strokeWidth="2" fill="none" />
            {/* Torso & Water Bottle */}
            <rect x="44" y="56" width="32" height="42" rx="8" fill="#8B5CF6" />
            <rect x="66" y="42" width="10" height="24" rx="2" fill="#06B6D4" opacity="0.9" /> {/* Bottle */}
            <rect x="68" y="38" width="6" height="4" rx="1" fill="#38BDF8" /> {/* Bottle Cap */}
            <path d="M 68 58 L 71 45" stroke="#FBCFE8" strokeWidth="4" strokeLinecap="round" /> {/* Arm */}
          </g>
        );

      case 'STUDYING':
      case 'TYPING':
        return (
          <g>
            {/* Laptop desk study pose */}
            <circle cx="60" cy="32" r="22" fill="#FBCFE8" />
            <path d="M 45 25 Q 60 10 75 25" fill="#4C1D95" />
            <circle cx="53" cy="34" r="2.5" fill="#1E1B4B" />
            <circle cx="67" cy="34" r="2.5" fill="#1E1B4B" />
            {/* Laptop & Desk */}
            <rect x="35" y="78" width="50" height="8" rx="2" fill="#475569" /> {/* Desk */}
            <path d="M 42 78 L 46 60 L 74 60 L 78 78 Z" fill="#94A3B8" /> {/* Laptop Screen */}
            <rect x="49" y="63" width="22" height="13" fill="#38BDF8" opacity="0.8" /> {/* Screen glow */}
            <rect x="44" y="54" width="32" height="26" rx="6" fill="#8B5CF6" />
          </g>
        );

      case 'CELEBRATING':
        return (
          <g className="animate-bounce-slow">
            {/* Both arms raised celebrating */}
            <circle cx="60" cy="30" r="22" fill="#FBCFE8" />
            <path d="M 45 22 Q 60 8 75 22" fill="#4C1D95" />
            {/* Happy eyes */}
            <path d="M 50 32 Q 54 26 58 32" stroke="#1E1B4B" strokeWidth="2.5" fill="none" />
            <path d="M 62 32 Q 66 26 70 32" stroke="#1E1B4B" strokeWidth="2.5" fill="none" />
            <ellipse cx="60" cy="40" rx="4" ry="3" fill="#BE185D" /> {/* Open happy mouth */}
            <rect x="44" y="52" width="32" height="42" rx="8" fill="#EC4899" />
            {/* Raised arms */}
            <path d="M 44 56 L 25 35" stroke="#FBCFE8" strokeWidth="5" strokeLinecap="round" />
            <path d="M 76 56 L 95 35" stroke="#FBCFE8" strokeWidth="5" strokeLinecap="round" />
            {/* Confetti stars */}
            <circle cx="20" cy="20" r="3" fill="#F59E0B" className="animate-ping" />
            <circle cx="100" cy="25" r="3" fill="#10B981" className="animate-ping" />
          </g>
        );

      case 'DISAPPOINTED':
        return (
          <g>
            {/* Crossed arms stern look */}
            <circle cx="60" cy="36" r="22" fill="#FBCFE8" />
            <path d="M 45 28 Q 60 14 75 28" fill="#4C1D95" />
            {/* Stern eyebrows & eyes */}
            <path d="M 49 31 L 57 34" stroke="#1E1B4B" strokeWidth="2" />
            <path d="M 71 31 L 63 34" stroke="#1E1B4B" strokeWidth="2" />
            <circle cx="53" cy="37" r="2" fill="#1E1B4B" />
            <circle cx="67" cy="37" r="2" fill="#1E1B4B" />
            <line x1="54" y1="44" x2="66" y2="44" stroke="#BE185D" strokeWidth="2" /> {/* Flat mouth */}
            <rect x="44" y="58" width="32" height="40" rx="8" fill="#6366F1" />
            {/* Crossed arms */}
            <path d="M 44 64 Q 60 74 76 64" stroke="#FBCFE8" strokeWidth="6" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'SLEEPING':
        return (
          <g>
            {/* Zzz sleeping pose */}
            <circle cx="60" cy="38" r="22" fill="#FBCFE8" />
            <path d="M 45 30 Q 60 16 75 30" fill="#4C1D95" />
            {/* Closed sleeping eyes */}
            <path d="M 49 39 Q 53 43 57 39" stroke="#1E1B4B" strokeWidth="2" fill="none" />
            <path d="M 63 39 Q 67 43 71 39" stroke="#1E1B4B" strokeWidth="2" fill="none" />
            <circle cx="60" cy="46" r="2" fill="#BE185D" />
            <rect x="44" y="60" width="32" height="38" rx="8" fill="#3B82F6" />
            {/* Floating Zzz */}
            <text x="85" y="30" fill="#93C5FD" fontSize="14" fontWeight="bold" className="animate-pulse">Z</text>
            <text x="96" y="20" fill="#60A5FA" fontSize="11" fontWeight="bold" className="animate-pulse">z</text>
            <text x="104" y="12" fill="#3B82F6" fontSize="9" fontWeight="bold" className="animate-pulse">z</text>
          </g>
        );

      case 'IDLE':
      case 'GREETING':
      case 'TALKING':
      default:
        return (
          <g className={state === 'GREETING' ? 'animate-bounce-slow' : 'animate-float'}>
            {/* Default friendly waving/talking pose */}
            <circle cx="60" cy="34" r="22" fill="#FBCFE8" />
            <path d="M 45 26 Q 60 12 75 26" fill="#4C1D95" />
            {/* Sparkling bright eyes */}
            <circle cx="53" cy="35" r="3" fill="#1E1B4B" />
            <circle cx="67" cy="35" r="3" fill="#1E1B4B" />
            <circle cx="54" cy="34" r="1" fill="#FFFFFF" />
            <circle cx="68" cy="34" r="1" fill="#FFFFFF" />
            {/* Smile */}
            <path d="M 54 42 Q 60 48 66 42" stroke="#BE185D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Blush */}
            <circle cx="47" cy="40" r="3.5" fill="#F472B6" opacity="0.6" />
            <circle cx="73" cy="40" r="3.5" fill="#F472B6" opacity="0.6" />
            <rect x="44" y="56" width="32" height="42" rx="8" fill="#8B5CF6" />
            {/* Waving hand */}
            <path d="M 76 60 Q 88 45 92 32" stroke="#FBCFE8" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <circle cx="92" cy="32" r="3.5" fill="#FBCFE8" />
          </g>
        );
    }
  };

  return (
    <div 
      onClick={onClick} 
      className="relative w-36 h-36 cursor-pointer select-none transition-transform duration-300 hover:scale-105"
    >
      <svg viewBox="0 0 120 120" className="w-full h-full filter drop-shadow-xl">
        {renderAvatarPose()}
      </svg>
    </div>
  );
};
