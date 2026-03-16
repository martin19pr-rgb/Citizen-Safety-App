'use server';
/**
 * @fileOverview A Genkit flow for calculating a real-time personal risk score and providing safety advice.
 *
 * - getPredictiveSafetyAdvice - A function that handles the predictive safety advice generation process.
 * - PredictiveSafetyAdviceInput - The input type for the getPredictiveSafetyAdvice function.
 * - PredictiveSafetyAdviceOutput - The return type for the getPredictiveSafetyAdvice function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PredictiveSafetyAdviceInputSchema = z.object({
  latitude: z.number().describe('The current latitude of the user.'),
  longitude: z.number().describe('The current longitude of the user.'),
  timeOfDay: z.string().describe('The current time of day, e.g., "14:30", "morning", "night".'),
  crimeHistory: z.string().describe('A summary of recent crime history in the vicinity, e.g., "high incidence of vehicle theft within 2km", "low crime rate in this area".'),
  trafficConditions: z.string().describe('Current traffic conditions, e.g., "heavy congestion", "free flowing traffic", "road closures due to an accident".'),
  recentIncidents: z.string().describe('A summary of any recent safety incidents in the immediate area, e.g., "a minor accident 500m north", "no recent incidents reported".'),
});
export type PredictiveSafetyAdviceInput = z.infer<typeof PredictiveSafetyAdviceInputSchema>;

const PredictiveSafetyAdviceOutputSchema = z.object({
  riskScorePercentage: z.number().min(0).max(100).describe('The calculated personal risk score as a percentage (0-100). For example, 12 for 12%.'),
  threatLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).describe('Categorical threat level based on the risk score.'),
  advice: z.string().describe('Contextual and proactive safety advice based on the risk factors.'),
});
export type PredictiveSafetyAdviceOutput = z.infer<typeof PredictiveSafetyAdviceOutputSchema>;

export async function getPredictiveSafetyAdvice(input: PredictiveSafetyAdviceInput): Promise<PredictiveSafetyAdviceOutput> {
  return predictiveSafetyAdviceFlow(input);
}

const predictiveSafetyAdvicePrompt = ai.definePrompt({
  name: 'predictiveSafetyAdvicePrompt',
  input: { schema: PredictiveSafetyAdviceInputSchema },
  output: { schema: PredictiveSafetyAdviceOutputSchema },
  prompt: `You are an expert safety analyst for the "Provincial Intelligent Safety" application.
Your task is to analyze real-time personal safety factors and provide a concise risk score and actionable safety advice.

Calculate a "riskScorePercentage" between 0 and 100 based on the provided data. A higher number indicates higher risk.
Assign a "threatLevel" of 'LOW', 'MEDIUM', 'HIGH', or 'CRITICAL' based on the riskScorePercentage.
Provide proactive, contextual safety "advice" to the user, guiding them on preventative measures.

Use the following information:

Current Location (Lat, Lng): ({{{latitude}}}, {{{longitude}}})
Time of Day: {{{timeOfDay}}}
Crime History: {{{crimeHistory}}}
Traffic Conditions: {{{trafficConditions}}}
Recent Incidents: {{{recentIncidents}}}

Example Output:
{
  "riskScorePercentage": 12,
  "threatLevel": "LOW",
  "advice": "Slow down – high vehicle hijacking zone ahead."
}

Now, generate the JSON output based on the provided inputs.`,
});

const predictiveSafetyAdviceFlow = ai.defineFlow(
  {
    name: 'predictiveSafetyAdviceFlow',
    inputSchema: PredictiveSafetyAdviceInputSchema,
    outputSchema: PredictiveSafetyAdviceOutputSchema,
  },
  async (input) => {
    const { output } = await predictiveSafetyAdvicePrompt(input);
    return output!;
  }
);
