import { GoogleGenerativeAI } from '@google/generative-ai';

function model() {
  if (!process.env.GEMINI_API_KEY) return null;
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
}

export async function generateAI(prompt) {
  const m = model();
  if (!m) return 'Gemini API key is missing. Add GEMINI_API_KEY in backend/.env.';
  const result = await m.generateContent(prompt);
  return result.response.text();
}

export async function summarizeText(text) {
  return generateAI(`Summarize this document into a clean professional knowledge note with key ideas, action points and tags:\n\n${text.slice(0, 14000)}`);
}
