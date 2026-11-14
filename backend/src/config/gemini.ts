import { GoogleGenAI } from '@google/genai';
import { env, isConfigured } from './env.js';
import { logger } from '../utils/logger.js';

let geminiClient: GoogleGenAI | null = null;

if (isConfigured.gemini && env.GEMINI_API_KEY) {
  geminiClient = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  logger.info('Google GenAI client initialized.');
} else {
  logger.warn('Google Gemini API key not provided. Gemini client is idle.');
}

export { geminiClient };
