"use client";

import React from 'react';
import { Navigation } from '@/components/navigation';
import { GlassCard } from '@/components/glass-card';
import { MapPin, Clock, User, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AlertsPage() {
  const db = useFirestore();
  const incidentsQuery = query(
    collection(db, 'incidents'),
    orderBy('createdAt', 'desc'),
    limit(15)
  );
  const { data: realIncidents, loading } = useCollection(incidentsQuery);

  const MOCK_ALERTS = [
    {
      id: 'mock-1',
      type: 'Vehicle Hijack Prevention',
      distance: '1.2km',
      time: 'Just now',
      description: 'AI Command detected suspicious activity near Polokwane North. Rapid response unit dispatched.',
      image: PlaceHolderImages[0].imageUrl,
      severity: 'CRITICAL',
      status: 'ACTIVE'
    }
  ];

  const allAlerts = realIncidents.length > 0 
    ? realIncidents.map((inc, i) => ({
        id: inc.id,
        type: inc.type ? `${inc.type.toUpperCase()} ALERT` : 'EMERGENCY DISPATCH',
        distance: 'Local Context',
        time: inc.createdAt ? new Date(inc.createdAt.seconds * 1000).toLocaleTimeString() : 'Processing...',
        description: `Source: ${inc.metadata?.source || 'Guardian'}. Threat: ${inc.ai?.threatLevel ? (inc.ai.threatLevel * 100).toFixed(0) + '%' : 'High'}. Status: ${inc.status || 'Active'}`,
        image: inc.media?.videoUrl || PlaceHolderImages[i % PlaceHolderImages.length].imageUrl,
        severity: inc.priority || 'MEDIUM',
        status: inc.status,
        citizen: inc.citizen?.name || 'Protected Citizen'
      }))
    : MOCK_ALERTS;

  return (
    <main className="min-h-screen pb-32 pt-12 px-6 max-w-4xl mx-auto flex flex-col gap-8">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Intelligence Dashboard</h1>
        <p className="text-primary text-xs font-bold tracking-widest uppercase mt-1">Single Source of Truth • Real-time Safety Feed</p>
      </header>

      <div className="flex gap-2">
        <GlassCard className="py-2 px-4 rounded-full border-primary/20 bg-primary/10 text-primary text-[10px] font-bold uppercase flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Live Command Stream
        </GlassCard>
      </div>

      <div className="flex flex-col gap-6">
        {loading && realIncidents.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Syncing with Command Desk...</p>
          </div>
        )}
        
        {allAlerts.map((alert: any) => (
          <GlassCard key={alert.id} className="p-0 overflow-hidden group border-white/5 bg-white/5">
            <div className="relative aspect-video">
              <Image 
                src={alert.image} 
                alt={alert.type} 
                fill 
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                className="object-cover opacity-60 group-hover:opacity-80 transition-all duration-500 group-hover:scale-105"
                data-ai-hint="security footage"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold border backdrop-blur-md",
                  ['CRITICAL', 'HIGH', 'high'].includes(alert.severity) ? "bg-destructive/20 border-destructive/40 text-destructive-foreground" : 
                  "bg-primary/20 border-primary/40 text-primary"
                )}>
                  {alert.severity} PRIORITY
                </span>
                <span className="bg-black/60 border border-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase">
                  {alert.status}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-headline font-bold text-white flex items-center gap-3">
                  {alert.type}
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
              <div className="flex items-center gap-2 mb-6 p-3 rounded-lg bg-white/5 border border-white/5">
                <User className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold uppercase text-white/60">Protected: {alert.citizen}</span>
              </div>
              <div className="flex gap-4">
                <button className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest transition-colors border border-white/10">
                  Track Units
                </button>
                <button className="flex-1 py-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest transition-colors border border-primary/20">
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