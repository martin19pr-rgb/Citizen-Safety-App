
"use client";

import React, { useEffect, useState, useRef } from 'react';
import { voiceCommandIntent } from '@/ai/flows/voice-command-intent-flow';
import { postIncidentDebrief } from '@/ai/flows/post-incident-debrief-flow';
import { useToast } from '@/hooks/use-toast';

interface VoiceGuardianProps {
  onStatusChange?: (listening: boolean) => void;
  onDispatch?: (type: string) => void;
}

export const VoiceGuardian = ({ onStatusChange, onDispatch }: VoiceGuardianProps) => {
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);
  const isStartedRef = useRef(false);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
    }

    const startRecognition = () => {
      if (recognitionRef.current && !isStartedRef.current) {
        try {
          recognitionRef.current.start();
          isStartedRef.current = true;
        } catch (e) {
          console.warn('Recognition already started or failed to start:', e);
        }
      }
    };

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      onStatusChange?.(true);
    };

    recognitionRef.current.onresult = async (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
      console.log('Voice Command Received:', transcript);

      try {
        const result = await voiceCommandIntent({ transcript });
        
        if (result.serviceDispatched && result.intent !== 'none') {
          onDispatch?.(result.intent);
          
          // Play audio feedback
          try {
            const audioResponse = await postIncidentDebrief({
              incidentType: result.intent,
              sensorReadingsSummary: "Voice activation triggered emergency protocol.",
              userFeedback: transcript
            });

            const audio = new Audio(audioResponse.audioDataUri);
            audio.play().catch(e => console.error("Audio playback failed", e));
          } catch (debriefError) {
            console.error('Debrief flow error (likely quota):', debriefError);
          }

          toast({
            title: result.feedbackMessage.split('•')[0].trim(),
            description: result.feedbackMessage,
          });
        }
      } catch (error) {
        console.error('Genkit Voice Flow Error:', error);
      }
    };

    recognitionRef.current.onend = () => {
      isStartedRef.current = false;
      setIsListening(false);
      onStatusChange?.(false);
      // Automatically restart to keep "Always On" capability after a short delay
      setTimeout(startRecognition, 100);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      if (event.error === 'not-allowed') {
        isStartedRef.current = false;
      }
    };

    startRecognition();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
        isStartedRef.current = false;
      }
    };
  }, [onStatusChange, onDispatch, toast]);

  return null; // Invisible brain component
};
