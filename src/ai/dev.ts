import { config } from 'dotenv';
config();

import '@/ai/flows/voice-command-intent-flow.ts';
import '@/ai/flows/post-incident-debrief-flow.ts';
import '@/ai/flows/predictive-safety-advice-flow.ts';