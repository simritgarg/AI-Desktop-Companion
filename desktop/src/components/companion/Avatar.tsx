'use client';

import React from 'react';
import { CharacterState, AvatarConfig } from '@/lib/store';

interface AvatarProps {
  state: CharacterState;
  config?: AvatarConfig;
  onClick?: () => void;
  isFacingRight?: boolean;
}

const defaultConfig: AvatarConfig = {
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
};

export const Avatar: React.FC<AvatarProps> = ({ state, config, onClick, isFacingRight = false }) => {
  const safeConfig = { ...defaultConfig, ...(config || {}) };
  const {
    hairStyle,
    hairColor,
    skinTone,
    eyeStyle,
    glasses,
    topColor,
    accessories,
  } = safeConfig;

  const renderHair = () => {
    switch (hairStyle) {
      case 'SHORT_BOB':
        return <path d="M 44 32 Q 60 10 76 32 L 76 44 L 44 44 Z" fill={hairColor} />;
      case 'PONYTAIL':
        return (
          <g>
            <path d="M 45 26 Q 60 12 75 26" fill={hairColor} />
            <path d="M 75 26 Q 88 35 84 50" stroke={hairColor} strokeWidth="8" strokeLinecap="round" fill="none" />
          </g>
        );
      case 'BUN':
        return (
          <g>
            <circle cx="60" cy="10" r="10" fill={hairColor} />
            <path d="M 45 26 Q 60 14 75 26" fill={hairColor} />
          </g>
        );
      case 'LONG_WAVY':
      default:
        return (
          <g>
            <path d="M 42 26 Q 60 10 78 26 L 80 62 Q 78 70 74 65 L 75 35 Q 60 18 45 35 L 46 65 Q 42 70 40 62 Z" fill={hairColor} />
          </g>
        );
    }
  };

  const renderGlasses = () => {
    if (glasses === 'READING' || glasses === 'STYLISH') {
      return (
        <g>
          <circle cx="53" cy="35" r="5" stroke="#374151" strokeWidth="1.5" fill="none" />
          <circle cx="67" cy="35" r="5" stroke="#374151" strokeWidth="1.5" fill="none" />
          <line x1="58" y1="35" x2="62" y2="35" stroke="#374151" strokeWidth="1.5" />
        </g>
      );
    }
    return null;
  };

  const renderAccessories = () => {
    if (accessories === 'HEADPHONES') {
      return (
        <g>
          <path d="M 37 34 Q 60 15 83 34" stroke="#EF4444" strokeWidth="4" fill="none" />
          <rect x="34" y="28" width="6" height="14" rx="2" fill="#EF4444" />
          <rect x="80" y="28" width="6" height="14" rx="2" fill="#EF4444" />
        </g>
      );
    } else if (accessories === 'BOW') {
      return (
        <g transform="translate(60, 14)">
          <polygon points="-8,-4 0,0 -8,4" fill="#F43F5E" />
          <polygon points="8,-4 0,0 8,4" fill="#F43F5E" />
          <circle cx="0" cy="0" r="2.5" fill="#BE185D" />
        </g>
      );
    }
    return null;
  };

  const renderPoseBody = () => {
    switch (state) {
      case 'WALKING_IN':
      case 'WALKING_OUT':
        return (
          <g className="animate-pulse">
            <circle cx="60" cy="34" r="22" fill={skinTone} />
            {renderHair()}
            <circle cx="53" cy="35" r="3" fill="#1E1B4B" />
            <circle cx="67" cy="35" r="3" fill="#1E1B4B" />
            <path d="M 55 42 Q 60 46 65 42" stroke="#BE185D" strokeWidth="2" fill="none" />
            {renderGlasses()}
            {renderAccessories()}
            <rect x="44" y="56" width="32" height="42" rx="8" fill={topColor} />
            <path d="M 48 98 L 42 114" stroke={skinTone} strokeWidth="5" strokeLinecap="round" />
            <path d="M 72 98 L 78 114" stroke={skinTone} strokeWidth="5" strokeLinecap="round" />
          </g>
        );

      case 'DRINKING':
        return (
          <g>
            <circle cx="60" cy="35" r="22" fill={skinTone} />
            {renderHair()}
            <circle cx="53" cy="36" r="2.5" fill="#1E1B4B" />
            <circle cx="67" cy="36" r="2.5" fill="#1E1B4B" />
            <path d="M 57 44 Q 60 48 63 44" stroke="#BE185D" strokeWidth="2" fill="none" />
            {renderGlasses()}
            {renderAccessories()}
            <rect x="44" y="56" width="32" height="42" rx="8" fill={topColor} />
            <rect x="66" y="42" width="10" height="24" rx="2" fill="#06B6D4" opacity="0.9" />
            <rect x="68" y="38" width="6" height="4" rx="1" fill="#38BDF8" />
            <path d="M 68 58 L 71 45" stroke={skinTone} strokeWidth="4" strokeLinecap="round" />
          </g>
        );

      case 'STUDYING':
      case 'TYPING':
        return (
          <g>
            <circle cx="60" cy="32" r="22" fill={skinTone} />
            {renderHair()}
            <circle cx="53" cy="34" r="2.5" fill="#1E1B4B" />
            <circle cx="67" cy="34" r="2.5" fill="#1E1B4B" />
            {renderGlasses()}
            {renderAccessories()}
            <rect x="35" y="78" width="50" height="8" rx="2" fill="#475569" />
            <path d="M 42 78 L 46 60 L 74 60 L 78 78 Z" fill="#94A3B8" />
            <rect x="49" y="63" width="22" height="13" fill="#38BDF8" opacity="0.8" />
            <rect x="44" y="54" width="32" height="26" rx="6" fill={topColor} />
          </g>
        );

      case 'CELEBRATING':
        return (
          <g className="animate-bounce-slow">
            <circle cx="60" cy="30" r="22" fill={skinTone} />
            {renderHair()}
            <path d="M 50 32 Q 54 26 58 32" stroke="#1E1B4B" strokeWidth="2.5" fill="none" />
            <path d="M 62 32 Q 66 26 70 32" stroke="#1E1B4B" strokeWidth="2.5" fill="none" />
            <ellipse cx="60" cy="40" rx="4" ry="3" fill="#BE185D" />
            {renderGlasses()}
            {renderAccessories()}
            <rect x="44" y="52" width="32" height="42" rx="8" fill="#EC4899" />
            <path d="M 44 56 L 25 35" stroke={skinTone} strokeWidth="5" strokeLinecap="round" />
            <path d="M 76 56 L 95 35" stroke={skinTone} strokeWidth="5" strokeLinecap="round" />
            <circle cx="20" cy="20" r="3" fill="#F59E0B" className="animate-ping" />
            <circle cx="100" cy="25" r="3" fill="#10B981" className="animate-ping" />
          </g>
        );

      case 'DISAPPOINTED':
        return (
          <g>
            <circle cx="60" cy="36" r="22" fill={skinTone} />
            {renderHair()}
            <path d="M 49 31 L 57 34" stroke="#1E1B4B" strokeWidth="2" />
            <path d="M 71 31 L 63 34" stroke="#1E1B4B" strokeWidth="2" />
            <circle cx="53" cy="37" r="2" fill="#1E1B4B" />
            <circle cx="67" cy="37" r="2" fill="#1E1B4B" />
            <line x1="54" y1="44" x2="66" y2="44" stroke="#BE185D" strokeWidth="2" />
            {renderGlasses()}
            {renderAccessories()}
            <rect x="44" y="58" width="32" height="40" rx="8" fill="#6366F1" />
            <path d="M 44 64 Q 60 74 76 64" stroke={skinTone} strokeWidth="6" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'SLEEPING':
        return (
          <g>
            <circle cx="60" cy="38" r="22" fill={skinTone} />
            {renderHair()}
            <path d="M 49 39 Q 53 43 57 39" stroke="#1E1B4B" strokeWidth="2" fill="none" />
            <path d="M 63 39 Q 67 43 71 39" stroke="#1E1B4B" strokeWidth="2" fill="none" />
            <circle cx="60" cy="46" r="2" fill="#BE185D" />
            {renderGlasses()}
            {renderAccessories()}
            <rect x="44" y="60" width="32" height="38" rx="8" fill="#3B82F6" />
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
            <circle cx="60" cy="34" r="22" fill={skinTone} />
            {renderHair()}
            <circle cx="53" cy="35" r="3" fill="#1E1B4B" />
            <circle cx="67" cy="35" r="3" fill="#1E1B4B" />
            {eyeStyle === 'SPARKLING' && (
              <>
                <circle cx="54" cy="34" r="1" fill="#FFFFFF" />
                <circle cx="68" cy="34" r="1" fill="#FFFFFF" />
              </>
            )}
            <path d="M 54 42 Q 60 48 66 42" stroke="#BE185D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <circle cx="47" cy="40" r="3.5" fill="#F472B6" opacity="0.6" />
            <circle cx="73" cy="40" r="3.5" fill="#F472B6" opacity="0.6" />
            {renderGlasses()}
            {renderAccessories()}
            <rect x="44" y="56" width="32" height="42" rx="8" fill={topColor} />
            <path d="M 76 60 Q 88 45 92 32" stroke={skinTone} strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <circle cx="92" cy="32" r="3.5" fill={skinTone} />
          </g>
        );
    }
  };

  return (
    <div 
      onClick={onClick} 
      className={`relative w-32 h-32 cursor-pointer select-none transition-transform duration-300 hover:scale-105 ${
        isFacingRight ? 'scale-x-[-1]' : ''
      }`}
    >
      <svg viewBox="0 0 120 120" className="w-full h-full filter drop-shadow-xl">
        {renderPoseBody()}
      </svg>
    </div>
  );
};
