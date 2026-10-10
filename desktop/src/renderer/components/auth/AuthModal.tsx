'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/lib/authStore';
import { Bot, Mail, Lock, User, Target, ArrowRight, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [primaryTarget, setPrimaryTarget] = useState('SSC_CGL');
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { login, register, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);
    clearError();

    if (!email || !password) {
      setLocalError('Please fill in both email and password.');
      return;
    }

    if (isRegister) {
      if (!name) {
        setLocalError('Please enter your display name.');
        return;
      }
      if (password.length < 4) {
        setLocalError('Password should be at least 4 characters long.');
        return;
      }

      const res = await register(name, email, password, primaryTarget);
      if (res.success) {
        setSuccessMessage(res.message);
        if (onSuccess) onSuccess();
      } else {
        setLocalError(res.message);
      }
    } else {
      const res = await login(email, password);
      if (res.success) {
        setSuccessMessage(res.message);
        if (onSuccess) onSuccess();
      } else {
        setLocalError(res.message);
      }
    }
  };

  const handleGoogleSignIn = () => {
    setLocalError('Google Sign-In is configured. Connecting to OAuth provider...');
    setTimeout(() => {
      setLocalError('Google Authentication requires custom Client ID in production env.');
    }, 1500);
  };

  const activeError = localError || error;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-gradient-to-b from-gray-900 to-gray-950 border border-purple-500/30 rounded-3xl p-8 shadow-2xl shadow-purple-500/10 relative overflow-hidden">
        {/* Glow effect behind logo */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Brand & Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 shadow-lg shadow-purple-500/30 mb-3">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-300 via-cyan-200 to-white bg-clip-text text-transparent">
            {isRegister ? 'Welcome to AI Companion' : 'Welcome Back!'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {isRegister 
              ? 'Create your account to start setting goals & tracking habits' 
              : 'Sign in to sync your goals, tasks, and companion AI progress'}
          </p>
        </div>

        {/* Error or Success Alert */}
        {activeError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2 text-rose-300 text-xs animate-in slide-in-from-top-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{activeError}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2 text-emerald-300 text-xs animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Your Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g. Simrit Garg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-900/90 border border-gray-700/70 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-900/90 border border-gray-700/70 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-900/90 border border-gray-700/70 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Primary Preparation / Goal</label>
              <div className="relative">
                <Target className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                <select
                  value={primaryTarget}
                  onChange={(e) => setPrimaryTarget(e.target.value)}
                  className="w-full bg-gray-900/90 border border-gray-700/70 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="SSC_CGL">SSC CGL / Government Exam Prep</option>
                  <option value="IT_CAREER">IT & Software Engineering Growth</option>
                  <option value="UPSC_GATE">Competitive Exams (UPSC, GATE, CAT)</option>
                  <option value="SKILL_BUILDING">Personal Productivity & Skill Building</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5 flex items-center justify-center">
          <div className="border-t border-gray-800 w-full" />
          <span className="bg-gray-950 px-3 text-[11px] text-gray-500 font-medium uppercase tracking-wider">or</span>
        </div>

        {/* Google Authentication Button */}
        <button
          onClick={handleGoogleSignIn}
          type="button"
          className="w-full py-2.5 px-4 rounded-xl bg-gray-800/80 hover:bg-gray-800 border border-gray-700/70 text-gray-200 font-medium text-xs flex items-center justify-center gap-3 transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Toggle between Login and Register */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-400">
            {isRegister ? 'Already have an account?' : 'New user?'}
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setLocalError(null);
                setSuccessMessage(null);
                clearError();
              }}
              className="ml-1.5 text-purple-400 font-semibold hover:text-purple-300 underline underline-offset-2 transition-colors"
            >
              {isRegister ? 'Sign In' : 'Create Account'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
