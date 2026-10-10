'use client';

import React from 'react';
import { Trophy, Award, Zap, Flame, Target, Star, CheckCircle, X } from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';

interface BadgesModalProps {
  onClose: () => void;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({ onClose }) => {
  const { user } = useAuthStore();
  const streak = user?.streakDays || 0;
  const level = user?.level || 1;

  const badges = [
    {
      id: 'streak_1',
      title: 'Day 1 Pioneer',
      description: 'Signed up & started your companion journey!',
      icon: Star,
      unlocked: true,
      color: 'from-amber-500 to-yellow-500',
    },
    {
      id: 'streak_7',
      title: '7-Day Streak Legend',
      description: 'Maintained active study streak for 7 consecutive days.',
      icon: Flame,
      unlocked: streak >= 7,
      color: 'from-orange-500 to-amber-600',
    },
    {
      id: 'goal_crusher',
      title: 'Goal Crusher',
      description: 'Completed 100% of your active monthly goals.',
      icon: Target,
      unlocked: level >= 2,
      color: 'from-purple-600 to-indigo-600',
    },
    {
      id: 'monthly_master',
      title: 'Monthly Master',
      description: 'Achieved full month productivity roadmap without skipping.',
      icon: Award,
      unlocked: level >= 3,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'deep_work',
      title: '30-Day Focus Master',
      description: 'Completed over 50 hours of deep work focus sessions.',
      icon: Zap,
      unlocked: level >= 4,
      color: 'from-cyan-500 to-blue-600',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-gray-900 border border-purple-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-100">Achievement Badges</h2>
              <p className="text-xs text-gray-400">Monthly goals & streak rewards</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-800 text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badges Grid */}
        <div className="py-4 space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                  badge.unlocked
                    ? 'bg-gray-800/80 border-purple-500/40 shadow-md shadow-purple-900/10'
                    : 'bg-gray-900/40 border-gray-800 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${
                      badge.unlocked ? badge.color : 'from-gray-700 to-gray-800'
                    } flex items-center justify-center text-white shadow-md shrink-0`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-100 flex items-center gap-2">
                      {badge.title}
                      {badge.unlocked && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Unlocked
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">{badge.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
