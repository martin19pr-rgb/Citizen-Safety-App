'use server';
/**
 * @fileOverview This flow generates a supportive and constructive debriefing message as a voice note after an incident.
 *
 * - postIncidentDebrief - A function that handles the post-incident debriefing process.
 * - PostIncidentDebriefInput - The input type for the postIncidentDebrief function.
 * - PostIncidentDebriefOutput - The return type for the postIncidentDebrief function (audio data URI).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import wav from 'wav';

const PostIncidentDebriefInputSchema = z.object({
  incidentType: z.string().describe('The type of incident that occurred (e.g., sudden braking, collision, threat detected).'),
  sensorReadingsSummary: z.string().describe('A summarized description of relevant sensor data or events that led to the incident (e.g., "You braked suddenly at 2.1g.").'),
  userFeedback: z.string().optional().describe('Optional user feedback or questions about the incident.'),
});
export type PostIncidentDebriefInput = z.infer<typeof PostIncidentDebriefInputSchema>;

const PostIncidentDebriefOutputSchema = z.object({
  audioDataUri: z.string().describe('The generated debriefing message as a WAV audio data URI.'),
});
export type PostIncidentDebriefOutput = z.infer<typeof PostIncidentDebriefOutputSchema>;

const debriefingPrompt = ai.definePrompt({
  name: 'postIncidentDebriefPrompt',
  input: { schema: PostIncidentDebriefInputSchema },
  output: { schema: z.string().describe('The supportive and constructive debriefing message.') },
  prompt: `You are a supportive and intelligent safety assistant. Your goal is to provide a constructive debriefing message after an incident, helping the user understand what happened and how to improve their safety.

Incident Type: {{{incidentType}}}
Sensor Readings Summary: {{{sensorReadingsSummary}}}
{{#if userFeedback}}User Feedback: {{{userFeedback}}}{{/if}}

Based on the information above, generate a supportive and constructive debriefing message. Focus on:
1. Acknowledging the incident and ensuring the user feels supported.
2. Briefly explaining what occurred based on the sensor data.
3. Offering a clear, actionable piece of advice or insight for future safety.
4. Maintaining a calm and reassuring tone.

Your message should be concise, ideally 2-3 sentences.`,
});

const postIncidentDebriefFlow = ai.defineFlow(
  {
    name: 'postIncidentDebriefFlow',
    inputSchema: PostIncidentDebriefInputSchema,
    outputSchema: PostIncidentDebriefOutputSchema,
  },
  async (input) => {
    // Generate the text debriefing message
    const { output: textDebrief } = await debriefingPrompt(input);

    if (!textDebrief) {
      throw new Error('Failed to generate text debriefing message.');
    }

    // Convert the text to audio
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' }, // Choose a voice that sounds supportive and reassuring
          },
        },
      },
      prompt: textDebrief,
    });

    if (!media || !media.url) {
      throw new Error('No audio media returned from TTS model.');
    }

    // Extract base64 encoded PCM data
    const audioBase64 = media.url.substring(media.url.indexOf(',') + 1);
    const audioBuffer = Buffer.from(audioBase64, 'base64');

    // Convert PCM to WAV format
    const wavBase64 = await toWav(audioBuffer);

    return {
      audioDataUri: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);

export async function postIncidentDebrief(input: PostIncidentDebriefInput): Promise<PostIncidentDebriefOutput> {
  return postIncidentDebriefFlow(input);
}

// Utility function to convert PCM audio buffer to WAV format
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
