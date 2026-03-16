
"use client";

import React, { useEffect, useState } from 'react';
import { GlassCard } from './glass-card';
import { TrendingDown, ShieldCheck, AlertTriangle } from 'lucide-react';
import { getPredictiveSafetyAdvice, type PredictiveSafetyAdviceOutput } from '@/ai/flows/predictive-safety-advice-flow';

export const RiskScoreCard = () => {
  const [data, setData] = useState<PredictiveSafetyAdviceOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRisk() {
      try {
        const result = await getPredictiveSafetyAdvice({
          latitude: -23.9045,
          longitude: 29.4688, // Polokwane
          timeOfDay: new Date().toLocaleTimeString(),
          crimeHistory: "High incidence of vehicle theft in downtown area",
          trafficConditions: "Moderate flowing traffic",
          recentIncidents: "Minor fender bender reported 2km North"
        });
        setData(result);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadRisk();
  }, []);

  if (loading) return (
    <GlassCard className="animate-pulse flex flex-col gap-4">
      <div className="h-4 bg-white/10 rounded w-1/3" />
      <div className="h-12 bg-white/10 rounded" />
    </GlassCard>
  );

  return (
    <GlassCard className="flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Personal Risk Analysis</span>
        <TrendingDown className="w-4 h-4 text-primary" />
      </div>
      
      <div className="flex items-end gap-2">
        <span className="text-4xl font-headline font-bold text-white">
          {data?.riskScorePercentage}%
        </span>
        <span className={cn(
          "text-[10px] font-bold px-2 py-0.5 rounded-full border mb-1",
          data?.threatLevel === 'LOW' ? "text-primary border-primary/30 bg-primary/10" : "text-destructive border-destructive/30 bg-destructive/10"
        )}>
          {data?.threatLevel} THREAT
        </span>
      </div>

      <div className="flex gap-3 items-center bg-white/5 p-3 rounded-xl border border-white/10 mt-1">
        <ShieldCheck className="w-8 h-8 text-primary shrink-0" />
        <p className="text-xs text-white/80 leading-relaxed font-medium">
          {data?.advice || "System initializing. Maintain standard safety procedures."}
        </p>
      </div>
    </GlassCard>
  );
};

import { cn } from '@/lib/utils';
