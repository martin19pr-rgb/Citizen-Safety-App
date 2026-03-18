'use server';
/**
 * @fileOverview This file defines a Genkit flow for recognizing voice commands
 * and determining the user's emergency service intent.
 *
 * - voiceCommandIntent - A function that processes a voice command transcript to determine intent and generate feedback.
 * - VoiceCommandIntentInput - The input type for the voiceCommandIntent function.
 * - VoiceCommandIntentOutput - The return type for the voiceCommandIntent function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VoiceCommandIntentInputSchema = z.object({
  transcript: z
    .string()
    .describe('The transcribed voice command from the user.'),
});
export type VoiceCommandIntentInput = z.infer<
  typeof VoiceCommandIntentInputSchema
>;

const VoiceCommandIntentOutputSchema = z.object({
  intent: z
    .enum(['police', 'ambulance', 'fire', 'security', 'medical', 'help', 'camera', 'journey', 'none'])
    .describe(
      'The recognized intent based on the voice command.'
    ),
  feedbackMessage: z
    .string()
    .describe('A voice feedback message to be spoken back to the user.'),
  serviceDispatched: z
    .boolean()
    .describe('True if an emergency service or key action was dispatched/triggered, false otherwise.'),
});
export type VoiceCommandIntentOutput = z.infer<
  typeof VoiceCommandIntentOutputSchema
>;

export async function voiceCommandIntent(
  input: VoiceCommandIntentInput
): Promise<VoiceCommandIntentOutput> {
  return voiceCommandIntentFlow(input);
}

const voiceCommandIntentPrompt = ai.definePrompt({
  name: 'voiceCommandIntentPrompt',
  input: { schema: VoiceCommandIntentInputSchema },
  output: { schema: VoiceCommandIntentOutputSchema },
  prompt: `You are an AI assistant designed to interpret emergency voice commands for a safety app.

The user will provide a voice command transcript. Your task is to:
1. Identify the primary emergency service intent (police, ambulance, fire, security, medical, camera, journey or general help).
2. Generate a concise and reassuring voice feedback message.
3. Set 'serviceDispatched' to true if an emergency service or specific protection feature is clearly requested.

Recognized command patterns:
- "Send Police" -> police
- "Send Ambulance" -> ambulance
- "Send Fire" -> fire
- "Send Security" -> security
- "Send Medical" -> medical
- "Help Me" -> help
- "Open Camera" -> camera
- "Journey with me" -> journey

Feedback Examples:
- "Police dispatched • Family notified • Help is coming"
- "Ambulance en route • Medical team alerted • Help is coming"
- "Activating journey protection • GPS lock engaged"
- "Opening live camera feed • Recording initialized"

Transcript: {{{transcript}}}

Return the structured JSON output.`,
});

const voiceCommandIntentFlow = ai.defineFlow(
  {
    name: 'voiceCommandIntentFlow',
    inputSchema: VoiceCommandIntentInputSchema,
    outputSchema: VoiceCommandIntentOutputSchema,
  },
  async (input) => {
    const { output } = await voiceCommandIntentPrompt(input);
    return output!;
  }
);
