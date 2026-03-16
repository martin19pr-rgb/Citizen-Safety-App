
"use client";

import React from 'react';
import Image from 'next/image';
import { GlassCard } from './glass-card';
import { Camera, Video, ScanEye } from 'lucide-react';

export const DualCameraPreview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      <GlassCard className="relative overflow-hidden aspect-video p-0 group">
        <Image 
          src="https://picsum.photos/seed/dashcam/800/450" 
          alt="Rear Camera" 
          fill 
          className="object-cover opacity-70 group-hover:opacity-90 transition-opacity"
          data-ai-hint="road view"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-primary/20 backdrop-blur-md px-3 py-1 rounded-full border border-primary/30">
          <Video className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-bold text-primary tracking-widest">ROAD CAM • LIVE</span>
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div>
            <p className="text-[10px] text-white/50 uppercase tracking-tighter">AI Threat Detection</p>
            <p className="text-sm font-headline text-white font-medium">Scanning road hazards...</p>
          </div>
          <div className="flex items-center gap-1 text-primary">
            <ScanEye className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] font-bold">YOLOv8 ACTIVE</span>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="relative overflow-hidden aspect-video p-0 group">
        <Image 
          src="https://picsum.photos/seed/cabincam/800/450" 
          alt="Front Camera" 
          fill 
          className="object-cover opacity-70 group-hover:opacity-90 transition-opacity"
          data-ai-hint="car interior"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-accent/20 backdrop-blur-md px-3 py-1 rounded-full border border-accent/30">
          <Camera className="w-4 h-4 text-accent" />
          <span className="text-[10px] font-bold text-accent tracking-widest">CABIN CAM • LIVE</span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-[10px] text-white/50 uppercase tracking-tighter">Internal Status</p>
          <p className="text-sm font-headline text-white font-medium">Occupant Safety Confirmed</p>
        </div>
      </GlassCard>
    </div>
  );
};
