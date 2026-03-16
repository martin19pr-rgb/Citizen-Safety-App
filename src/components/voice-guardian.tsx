
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

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      onStatusChange?.(true);
    };

    recognitionRef.current.onresult = async (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
      console.log('Voice Command:', transcript);

      try {
        const result = await voiceCommandIntent({ transcript });
        
        if (result.serviceDispatched && result.intent !== 'none') {
          onDispatch?.(result.intent);
          
          // Play audio feedback
          const audioResponse = await postIncidentDebrief({
            incidentType: result.intent,
            sensorReadingsSummary: "Voice activation triggered emergency protocol.",
            userFeedback: transcript
          });

          const audio = new Audio(audioResponse.audioDataUri);
          audio.play();

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
      // Automatically restart to keep "Always On" capability
      if (recognitionRef.current) recognitionRef.current.start();
    };

    recognitionRef.current.start();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, []);

  return null; // Invisible brain component
};
