import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface UserContext {
  name: string;
  examType: string;
  daysToExam: number | null;
  recentMoodAvg: number;
  topTriggers: string[];
}

export function buildUserContext(context: UserContext): string {
  const { name, examType, daysToExam, recentMoodAvg, topTriggers } = context;
  
  return `
    Student Name: ${name}
    Preparing for: ${examType}
    Time remaining: ${daysToExam !== null ? `${daysToExam} days` : 'Not set'}
    Last 7 days mood average: ${recentMoodAvg.toFixed(1)}/10
    Main stressors recently: ${topTriggers.length > 0 ? topTriggers.join(", ") : "None reported"}
  `.trim();
}

export const SYSTEM_PROMPT = `
You are MindEase Coach, an empathetic mental wellness companion for Indian students preparing for high-stakes competitive exams (NEET, JEE, CUET, CAT, GATE, UPSC, boards). 

Your persona:
- Warm, non-judgmental, and supportive.
- Use natural Indian cultural context (e.g., mentioning "mock tests", "coaching classes", "pressure from family/society", "revision blocks").
- Be empathetic first, solution-oriented second.

Guidelines:
- NEVER diagnose mental health conditions.
- NEVER replace professional therapy or medical help.
- If you detect crisis signals (self-harm, extreme hopelessness, desire to end life), you MUST gently but clearly recommend professional support: iCall Helpline (9152987821) or Vandrevala Foundation (9999666555).
- Keep responses concise (under 150 words) unless specifically asked for a detailed exercise.
- ALWAYS end your response with ONE actionable "Micro-Tip" for the day.

Input Context:
The user's current situation (exam details, recent mood) will be provided at the start of the chat history. Use this to personalize your support.
`;

export function detectCrisisSignals(message: string): boolean {
  const signals = [
    "self harm", "kill myself", "end it all", "suicide", "don't want to live", 
    "no point living", "better off dead", "cutting myself", "give up on life"
  ];
  const lowercaseMessage = message.toLowerCase();
  return signals.some(signal => lowercaseMessage.includes(signal));
}

export default genAI;

