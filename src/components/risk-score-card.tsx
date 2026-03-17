
"use client";

import React, { useEffect, useState } from 'react';
import { GlassCard } from './glass-card';
import { TrendingDown, ShieldCheck, AlertTriangle, RefreshCw } from 'lucide-react';
import { getPredictiveSafetyAdvice, type PredictiveSafetyAdviceOutput } from '@/ai/flows/predictive-safety-advice-flow';
import { cn } from '@/lib/utils';

export const RiskScoreCard = () => {
  const [data, setData] = useState<PredictiveSafetyAdviceOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRisk = async () => {
    setLoading(true);
    setError(null);
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
    } catch (e: any) {
      console.error('Risk Score Load Error:', e);
      if (e.message?.includes('429') || e.message?.includes('quota')) {
        setError('AI Analysis busy. Retrying soon...');
      } else {
        setError('Unable to fetch live risk analysis.');
      }
      // Fallback data if needed
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRisk();
  }, []);

  if (loading) return (
    <GlassCard className="animate-pulse flex flex-col gap-4">
      <div className="h-4 bg-white/10 rounded w-1/3" />
      <div className="h-12 bg-white/10 rounded" />
    </GlassCard>
  );

  if (error && !data) return (
    <GlassCard className="flex flex-col gap-3 border-yellow-500/20 bg-yellow-500/5">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Risk Analysis Pending</span>
        <button onClick={loadRisk} className="p-1 hover:bg-white/10 rounded-full transition-colors">
          <RefreshCw className="w-3 h-3 text-muted-foreground" />
        </button>
      </div>
      <div className="flex items-center gap-2 text-yellow-500">
        <AlertTriangle className="w-4 h-4" />
        <p className="text-xs font-medium">{error}</p>
      </div>
      <p className="text-[10px] text-muted-foreground italic">System maintaining standard safety protocols.</p>
    </GlassCard>
  );

  return (
    <GlassCard className="flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Personal Risk Analysis</span>
        <TrendingDown className="w-4 h-4 text-primary" />
      </div>
      
      <div className="flex items-end gap-2">
        <span className="text-4xl font-headline text-white font-bold">
          {data?.riskScorePercentage || 0}%
        </span>
        <span className={cn(
          "text-[10px] font-bold px-2 py-0.5 rounded-full border mb-1",
          data?.threatLevel === 'LOW' ? "text-primary border-primary/30 bg-primary/10" : 
          data?.threatLevel === 'MEDIUM' ? "text-accent border-accent/30 bg-accent/10" :
          "text-destructive border-destructive/30 bg-destructive/10"
        )}>
          {data?.threatLevel || 'LOW'} THREAT
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
