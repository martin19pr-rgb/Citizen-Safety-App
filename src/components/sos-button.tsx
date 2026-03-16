
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export const SOSButton = () => {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'dispatched' | 'cancelled'>('idle');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<number>(0);
  const { toast } = useToast();

  const HOLD_DURATION = 5000;

  useEffect(() => {
    if (isHolding && status === 'idle') {
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
        setProgress(newProgress);
        progressRef.current = newProgress;

        if (newProgress === 100) {
          handleDispatch();
        }
      }, 50);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressRef.current < 100 && progressRef.current > 0) {
        handleCancel();
      }
      setProgress(0);
      progressRef.current = 0;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHolding]);

  const handleDispatch = () => {
    setIsHolding(false);
    setStatus('dispatched');
    if (timerRef.current) clearInterval(timerRef.current);
    
    toast({
      title: "HELP DISPATCHED",
      description: "Responders are en route to your location. Stay calm.",
    });

    setTimeout(() => {
      setStatus('idle');
    }, 10000);
  };

  const handleCancel = () => {
    setStatus('cancelled');
    setTimeout(() => setStatus('idle'), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Progress Ring */}
        <svg className="absolute w-full h-full -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="110"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            className="text-white/5"
          />
          <motion.circle
            cx="128"
            cy="128"
            r="110"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray="691"
            strokeDashoffset={691 - (691 * progress) / 100}
            strokeLinecap="round"
            className={cn(
              "transition-colors duration-300",
              progress < 100 ? "text-accent" : "text-primary"
            )}
          />
        </svg>

        {/* The Button */}
        <motion.button
          onMouseDown={() => setIsHolding(true)}
          onMouseUp={() => setIsHolding(false)}
          onMouseLeave={() => setIsHolding(false)}
          onTouchStart={() => setIsHolding(true)}
          onTouchEnd={() => setIsHolding(false)}
          animate={status === 'idle' ? { scale: isHolding ? 0.95 : 1 } : {}}
          className={cn(
            "relative w-52 h-52 rounded-full glass-card flex flex-col items-center justify-center gap-2 transition-all duration-500",
            status === 'idle' && !isHolding && "breathing-glow border-primary/40",
            isHolding && "ring-4 ring-accent glow-accent",
            status === 'dispatched' && "ring-4 ring-primary glow-green",
            status === 'cancelled' && "ring-4 ring-destructive"
          )}
        >
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center"
              >
                <ShieldAlert className={cn("w-16 h-16 mb-2 transition-colors", isHolding ? "text-accent" : "text-primary")} />
                <span className="font-headline text-3xl font-bold tracking-tighter">SOS</span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                  {isHolding ? "HOLDING..." : "PRESS & HOLD"}
                </span>
              </motion.div>
            )}

            {status === 'dispatched' && (
              <motion.div
                key="dispatched"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center text-primary"
              >
                <CheckCircle2 className="w-20 h-20 mb-2" />
                <span className="font-headline text-xl font-bold">HELP EN ROUTE</span>
              </motion.div>
            )}

            {status === 'cancelled' && (
              <motion.div
                key="cancelled"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center text-destructive"
              >
                <XCircle className="w-20 h-20 mb-2" />
                <span className="font-headline text-xl font-bold">CANCELLED</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <div className="text-center">
        <p className="text-primary font-medium tracking-wide flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
          Guardian Active • You Are Protected
        </p>
        <p className="text-muted-foreground text-sm mt-1">
          {isHolding ? `Releasing in ${Math.ceil((HOLD_DURATION - (progress * HOLD_DURATION / 100)) / 1000)}s` : "Limpopo Provincial Command Centre connected"}
        </p>
      </div>
    </div>
  );
};
