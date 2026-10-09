'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { BarChart3, Sparkles, CheckCircle2, AlertTriangle, TrendingUp, Award } from 'lucide-react';
import { useCompanionStore } from '@/lib/store';
import { fetchDailyAnalysis } from '@/lib/api';

export default function AnalyticsPage() {
  const { appTheme } = useCompanionStore();
  const isCoffee = appTheme === 'COFFEE';

  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        const res = await fetchDailyAnalysis();
        setAnalysis(res);
      } catch {
        setAnalysis({
          summary: "Strong performance with 4 focus sessions completed and high goal alignment.",
          whatWentWell: "Completed primary Spring Boot architecture module during peak morning energy.",
          whatWentWrong: "Minor context switching between 3:00 PM and 4:15 PM.",
          patternNoticed: "Your focus duration drops when working without planned 5-minute breaks.",
          oneThingToChangeTomorrow: "Protect afternoon work blocks by closing non-essential tabs.",
          uncomfortableTruth: "Multitasking gives the illusion of productivity while reducing deep work output.",
          productivityScore: 85
        });
      }
    };
    loadAnalysis();
  }, []);

  return (
    <div className="flex min-h-screen bg-linen/30">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="p-8 max-w-5xl w-full mx-auto space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-espresso flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-cocoa" />
              Daily Report & Behavioral Analytics
            </h2>
            <p className="text-xs text-camel mt-1">
              AI-generated feedback on focus sessions, time allocation, and productivity patterns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`p-5 rounded-2xl border flex items-center justify-between ${
              isCoffee ? 'bg-white border-border' : 'bg-white border-cocoa/15'
            }`}>
              <div>
                <span className="text-xs font-semibold text-camel">Productivity Score</span>
                <h3 className="text-3xl font-extrabold text-espresso mt-1">{analysis?.productivityScore || 85}%</h3>
              </div>
              <Award className="w-10 h-10 text-cocoa" />
            </div>

            <div className={`p-5 rounded-2xl border flex items-center justify-between ${
              isCoffee ? 'bg-white border-border' : 'bg-white border-blue-200'
            }`}>
              <div>
                <span className="text-xs font-semibold text-camel">Focus Minutes</span>
                <h3 className="text-3xl font-extrabold text-espresso mt-1">175m</h3>
              </div>
              <TrendingUp className="w-10 h-10 text-blue-600" />
            </div>

            <div className={`p-5 rounded-2xl border flex items-center justify-between ${
              isCoffee ? 'bg-white border-border' : 'bg-white border-emerald-200'
            }`}>
              <div>
                <span className="text-xs font-semibold text-camel">Tasks Finished</span>
                <h3 className="text-3xl font-extrabold text-espresso mt-1">4 / 5</h3>
              </div>
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>

            <div className={`p-5 rounded-2xl border flex items-center justify-between ${
              isCoffee ? 'bg-white border-border' : 'bg-white border-cocoa/20'
            }`}>
              <div>
                <span className="text-xs font-semibold text-camel">Distractions</span>
                <h3 className="text-3xl font-extrabold text-espresso mt-1">2</h3>
              </div>
              <AlertTriangle className="w-10 h-10 text-cocoa" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-2xl border space-y-3 ${
              isCoffee ? 'bg-white border-border' : 'bg-white border-border'
            }`}>
              <h3 className="text-sm font-bold text-emerald-600 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> What Went Well
              </h3>
              <p className="text-xs text-cocoa leading-relaxed">{analysis?.whatWentWell}</p>
            </div>

            <div className={`p-6 rounded-2xl border space-y-3 ${
              isCoffee ? 'bg-white border-border' : 'bg-white border-border'
            }`}>
              <h3 className="text-sm font-bold text-cocoa flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Improvement Opportunity
              </h3>
              <p className="text-xs text-cocoa leading-relaxed">{analysis?.whatWentWrong}</p>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border space-y-2 ${
            isCoffee ? 'bg-linen border-khaki' : 'bg-gradient-to-r from-rose-950/40 via-card to-card border-rose-200'
          }`}>
            <h3 className="text-sm font-bold text-rose-600 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-600" /> One Uncomfortable Truth
            </h3>
            <p className="text-xs text-espresso font-medium leading-relaxed">
              "{analysis?.uncomfortableTruth}"
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

