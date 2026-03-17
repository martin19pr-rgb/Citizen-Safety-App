
"use client";

import React from 'react';
import { Navigation } from '@/components/navigation';
import { GlassCard } from '@/components/glass-card';
import { AlertTriangle, MapPin, Clock, Play, User, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';

export default function AlertsPage() {
  const db = useFirestore();
  const incidentsQuery = query(
    collection(db, 'incidents'),
    orderBy('createdAt', 'desc'),
    limit(10)
  );
  const { data: realIncidents, loading } = useCollection(incidentsQuery);

  const MOCK_ALERTS = [
    {
      id: 'mock-1',
      type: 'Vehicle Accident',
      distance: '1.2km',
      time: '4m ago',
      description: 'Two-car collision near N1 Polokwane North bypass. Lanes restricted.',
      image: 'https://picsum.photos/seed/acc1/400/250',
      severity: 'MEDIUM',
      status: 'ACTIVE'
    }
  ];

  const allAlerts = realIncidents.length > 0 
    ? realIncidents.map(inc => ({
        id: inc.id,
        type: inc.ai?.threatLevel === 'HIGH' ? 'Critical Emergency' : 'Safety Dispatch',
        distance: 'Localised',
        time: inc.createdAt ? new Date(inc.createdAt.seconds * 1000).toLocaleTimeString() : 'Just now',
        description: `Dispatch triggered for ${inc.citizen?.name || 'Citizen'}. Threat level: ${inc.ai?.threatLevel || 'Unknown'}. Status: ${inc.status}`,
        image: inc.media?.videoUrl || 'https://picsum.photos/seed/incident-ai/400/250',
        severity: inc.priority || 'MEDIUM',
        status: inc.status,
        citizen: inc.citizen?.name
      }))
    : MOCK_ALERTS;

  return (
    <main className="min-h-screen pb-32 pt-12 px-6 max-w-3xl mx-auto flex flex-col gap-8">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Provincial Intelligence Feed</h1>
        <p className="text-primary text-xs font-bold tracking-widest uppercase mt-1">Real-time Single Source of Truth</p>
      </header>

      <div className="flex gap-2">
        <GlassCard className="py-2 px-4 rounded-full border-primary/20 bg-primary/10 text-primary text-[10px] font-bold uppercase flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Live Incidents
        </GlassCard>
        <GlassCard className="py-2 px-4 rounded-full border-white/10 text-white/60 text-[10px] font-bold uppercase">Archive</GlassCard>
      </div>

      <div className="flex flex-col gap-6">
        {loading && realIncidents.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Connecting to Dispatch Desk...</p>
          </div>
        )}
        
        {allAlerts.map((alert: any) => (
          <GlassCard key={alert.id} className="p-0 overflow-hidden group">
            <div className="relative aspect-video">
              <Image 
                src={alert.image} 
                alt={alert.type} 
                fill 
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                className="object-cover opacity-60 group-hover:opacity-80 transition-all duration-500 group-hover:scale-105"
                data-ai-hint="security footage"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 rounded-full glass-card flex items-center justify-center text-primary glow-green">
                  <Play className="w-8 h-8 fill-primary" />
                </div>
              </div>
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold border backdrop-blur-md",
                  alert.severity === 'CRITICAL' || alert.severity === 'HIGH' ? "bg-destructive/20 border-destructive/40 text-destructive-foreground" : 
                  alert.severity === 'MEDIUM' ? "bg-accent/20 border-accent/40 text-accent-foreground" : "bg-primary/20 border-primary/40 text-primary"
                )}>
                  {alert.severity} PRIORITY
                </span>
                <span className="bg-white/10 border border-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white">
                  {alert.status}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-headline font-bold text-white flex items-center gap-3">
                  {alert.type}
                  {alert.status === 'ENROUTE' && (
                    <ShieldCheck className="w-5 h-5 text-primary animate-pulse" />
                  )}
                </h3>
                <div className="flex flex-col items-end">
                   <div className="flex items-center gap-1 text-primary">
                    <MapPin className="w-3 h-3" />
                    <span className="text-[10px] font-bold">{alert.distance}</span>
                   </div>
                   <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span className="text-[10px] font-bold">{alert.time}</span>
                   </div>
                </div>
              </div>
              <p className="text-sm text-white/70 leading-relaxed mb-6">
                {alert.description}
              </p>
              {alert.citizen && (
                <div className="flex items-center gap-2 mb-6 p-2 rounded-lg bg-white/5 border border-white/5">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-bold uppercase text-white/60">Protected: {alert.citizen}</span>
                </div>
              )}
              <div className="flex gap-4">
                <button className="flex-1 py-3 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold uppercase tracking-widest transition-colors border border-white/10">
                  Track Response
                </button>
                <button className="flex-1 py-3 rounded-full bg-primary/20 hover:bg-primary/30 text-primary text-xs font-bold uppercase tracking-widest transition-colors border border-primary/20">
                  Secure Data
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <Navigation />
    </main>
  );
}

const Loader2 = ({ className }: { className?: string }) => (
  <svg
    className={cn("animate-spin", className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);
