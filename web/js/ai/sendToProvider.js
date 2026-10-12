import { openaiCompatible } from './providers/openaiCompatible.js';
import { ollama } from './providers/ollama.js';
import { anthropic } from './providers/anthropic.js';
import { gemini } from './providers/gemini.js';

const PROVIDERS = { ollama, anthropic, gemini, llamacpp: openaiCompatible, openai: openaiCompatible, custom: openaiCompatible };

export function sendToProvider(settings, messages) {
  return PROVIDERS[settings.provider](settings, messages);
}
