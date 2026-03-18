"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Mic, Loader2, Waves, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser, useDoc } from '@/firebase';
import { collection, addDoc, serverTimestamp, doc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { voiceCommandIntent } from '@/ai/flows/voice-command-intent-flow';
import { voiceAssistant } from '@/ai/flows/voice-assistant-flow';
import { useRouter } from 'next/navigation';

export const SOSButton = () => {
  const router = useRouter();
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'speaking' | 'dispatched' | 'cancelled'>('idle');
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<number>(0);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const { toast } = useToast();
  const db = useFirestore();
  const { user } = useUser();
  const { data: profile } = useDoc(user ? doc(db, 'users', user.uid) : null);

  const HOLD_DURATION = 2000;

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleConversation(transcript);
      };

      recognitionRef.current.onend = () => {
        if (status === 'listening') setStatus('idle');
      };

      recognitionRef.current.onerror = () => {
        setStatus('idle');
      };
    }
  }, [status]);

  useEffect(() => {
    if (isHolding && status === 'idle') {
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
        setProgress(newProgress);
        progressRef.current = newProgress;

        if (newProgress === 100) {
          handleDispatch('manual_sos', 0.99, ['panic_button']);
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
  }, [isHolding, status]);

  const playAlertSound = (type: 'dispatch' | 'cancel') => {
    try {
      const audio = new Audio(type === 'dispatch' ? 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3' : 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
      audio.volume = 0.4;
      audio.play().catch(() => {});
    } catch (e) {}
  };

  const handleConversation = async (transcript: string) => {
    setStatus('processing');
    setAiMessage(null);

    try {
      const intentResult = await voiceCommandIntent({ transcript });
      
      if (intentResult.serviceDispatched) {
        if (intentResult.intent === 'camera' || intentResult.intent === 'journey') {
           setAiMessage(intentResult.feedbackMessage);
           setTimeout(() => router.push('/journey'), 2000);
           setStatus('idle');
           return;
        }

        handleDispatch(intentResult.intent, 0.9, [intentResult.intent]);
        setAiMessage(intentResult.feedbackMessage);
        return;
      }

      const assistantResult = await voiceAssistant({
        transcript,
        userName: profile?.name || 'Citizen',
        location: 'Polokwane Central',
        medicalNotes: profile ? `Blood: ${profile.bloodType}, Allergies: ${profile.allergies}` : undefined
      });

      setAiMessage(assistantResult.text);
      
      if (assistantResult.audioDataUri) {
        if (!audioRef.current) audioRef.current = new Audio();
        audioRef.current.src = assistantResult.audioDataUri;
        audioRef.current.onplay = () => setStatus('speaking');
        audioRef.current.onended = () => setStatus('idle');
        audioRef.current.play().catch(e => setStatus('idle'));
      } else {
        setStatus('idle');
      }

    } catch (error) {
      setStatus('idle');
      toast({ variant: 'destructive', title: "Signal Weak", description: "Could not reach Provincial Command." });
    }
  };

  const handleDispatch = (type: string, threatLevel: number, objects: string[]) => {
    setIsHolding(false);
    setStatus('dispatched');
    playAlertSound('dispatch');
    if (timerRef.current) clearInterval(timerRef.current);
    
    if (db) {
      const incidentData = {
        createdAt: serverTimestamp(),
        status: "ACTIVE",
        priority: threatLevel > 0.85 ? "HIGH" : "MEDIUM",
        type: type,
        location: { lat: -23.9045, lng: 29.4688 },
        citizen: {
          uid: user?.uid || 'anonymous',
          name: profile?.name || 'Unknown Citizen'
        },
        media: {
          videoUrl: "", 
          audioUrl: ""
        },
        ai: {
          threatLevel: threatLevel,
          objects: objects,
          confidence: 0.95
        },
        assigned: {
          officerId: null
        },
        visibility: {
          police: true,
          premier: true
        },
        metadata: {
          source: 'mobile_app',
          createdFrom: type === 'manual_sos' ? 'sos' : 'voice_command'
        }
      };
      
      const incidentsRef = collection(db, 'incidents');
      addDoc(incidentsRef, incidentData).catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: incidentsRef.path,
          operation: 'create',
          requestResourceData: incidentData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
    }

    toast({
      title: `${type.toUpperCase().replace('_', ' ')} DISPATCHED`,
      description: "Command Center notified • Family alerted • Help is coming",
    });

    setTimeout(() => {
      setStatus('idle');
      setAiMessage(null);
    }, 8000);
  };

  const handleCancel = () => {
    setStatus('cancelled');
    playAlertSound('cancel');
    setTimeout(() => setStatus('idle'), 1500);
  };

  const toggleVoiceMode = () => {
    if (status === 'speaking') {
      audioRef.current?.pause();
      setStatus('idle');
      return;
    }

    if (status === 'listening') {
      recognitionRef.current?.stop();
    } else {
      setStatus('listening');
      recognitionRef.current?.start();
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Lighter grayish glassmorphic container pulse */}
        <div className={cn(
          "absolute inset-0 rounded-full transition-all duration-1000 bg-white/5 border border-white/10 backdrop-blur-xl",
          status === 'listening' ? "bg-accent/10 border-accent/20 animate-pulse-glow shadow-[0_0_80px_rgba(173,232,66,0.2)]" : "shadow-[0_0_60px_rgba(255,255,255,0.05)]"
        )} />

        <svg className="absolute w-full h-full -rotate-90 pointer-events-none">
          <circle
            cx="160"
            cy="160"
            r="142"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            className="text-white/5"
          />
          <motion.circle
            cx="160"
            cy="160"
            r="142"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray="892"
            strokeDashoffset={892 - (892 * progress) / 100}
            strokeLinecap="round"
            className={cn(
              "transition-colors duration-300",
              progress < 100 ? "text-destructive" : "text-primary"
            )}
          />
        </svg>

        <motion.button
          onMouseDown={() => setIsHolding(true)}
          onMouseUp={() => setIsHolding(false)}
          onMouseLeave={() => setIsHolding(false)}
          onTouchStart={() => setIsHolding(true)}
          onTouchEnd={() => setIsHolding(false)}
          onClick={(e) => {
            if (progressRef.current < 10 && (status === 'idle' || status === 'speaking')) {
              toggleVoiceMode();
            }
          }}
          animate={status === 'idle' ? { scale: isHolding ? 0.92 : 1 } : { scale: 1 }}
          className={cn(
            "relative w-64 h-64 rounded-full flex flex-col items-center justify-center gap-3 transition-all duration-500",
            "bg-white/10 border-2 border-white/20 backdrop-blur-3xl shadow-2xl",
            status === 'idle' && !isHolding && "text-white/80 hover:bg-white/15",
            isHolding && "bg-destructive/40 border-destructive text-white ring-4 ring-destructive/30",
            status === 'listening' && "bg-accent/20 border-accent text-accent ring-4 ring-accent/30 scale-110",
            status === 'processing' && "animate-pulse border-accent/50",
            status === 'speaking' && "bg-primary/20 border-primary text-primary ring-4 ring-primary/30",
            status === 'dispatched' && "bg-primary/40 border-primary text-primary ring-8 ring-primary/20",
            status === 'cancelled' && "ring-4 ring-destructive/40"
          )}
        >
          <AnimatePresence mode="wait">
            {(status === 'idle' || isHolding) && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                <span className="font-headline text-5xl font-bold tracking-tighter text-white drop-shadow-md">SOS</span>
                <div className="mt-4 p-3 rounded-full bg-white/5 border border-white/10 text-white/60">
                  <Mic className="w-8 h-8" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/40 mt-4">
                  {isHolding ? "HOLDING..." : "TAP FOR AI • HOLD"}
                </span>
              </motion.div>
            )}

            {status === 'listening' && (
              <motion.div key="listening" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
                <Mic className="w-16 h-16 mb-2 text-accent animate-pulse" />
                <span className="font-headline text-xl font-bold uppercase tracking-widest text-accent">Listening</span>
              </motion.div>
            )}

            {status === 'processing' && (
              <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                <Loader2 className="w-16 h-16 mb-2 text-accent animate-spin" />
                <span className="font-headline text-xl font-bold uppercase tracking-widest text-accent">Analyzing</span>
              </motion.div>
            )}

            {status === 'speaking' && (
              <motion.div key="speaking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                <Waves className="w-24 h-24 mb-2 text-primary animate-pulse" />
                <Volume2 className="w-6 h-6 text-primary absolute bottom-12" />
              </motion.div>
            )}

            {status === 'dispatched' && (
              <motion.div key="dispatched" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-primary text-center px-4">
                <CheckCircle2 className="w-24 h-24 mb-2" />
                <span className="font-headline text-2xl font-bold uppercase tracking-tighter">SECURED</span>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Help Dispatched</span>
              </motion.div>
            )}

            {status === 'cancelled' && (
              <motion.div key="cancelled" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-destructive">
                <XCircle className="w-24 h-24 mb-2" />
                <span className="font-headline text-2xl font-bold uppercase tracking-tighter">CANCELLED</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <div className="text-center w-full px-6 min-h-[60px] flex flex-col items-center justify-center">
        {aiMessage ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="glass-card py-3 px-6 border-accent/20 max-w-sm bg-white/5"
          >
            <p className="text-sm font-medium text-white/90 leading-relaxed italic">
              "{aiMessage}"
            </p>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-primary/60 font-bold tracking-widest text-[10px] uppercase flex items-center justify-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Provincial Safety Intelligence Active
            </p>
            <div className="flex gap-2 justify-center opacity-40">
               <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded border border-white/10">Police</span>
               <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded border border-white/10">Ambulance</span>
               <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded border border-white/10">Camera</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
