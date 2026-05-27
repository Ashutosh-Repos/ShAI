import {
  createHttpError,
  createNetworkError,
  isFetchError,
} from '../core/errors.js';
import type { AIProvider, ChatMessage, ProviderConfig } from './base.js';
import {
  SYSTEM_PROMPT_CHAT,
  SYSTEM_PROMPT_EXPLAIN,
  SYSTEM_PROMPT_GENERATE,
} from './base.js';

interface GeminiContent {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

interface GeminiResponse {
  candidates?: Array<{
    content: { parts: Array<{ text: string }> };
  }>;
  error?: { message: string; code: number };
}

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

export class GeminiProvider implements AIProvider {
  name = 'Gemini';
  private model: string;
  private apiKey: string;

  constructor(config: ProviderConfig) {
    this.model = config.model;
    if (config.credentials.type === 'api_key') {
      this.apiKey = config.credentials.apiKey;
    } else {
      throw new Error('Gemini requires API key');
    }
  }

  private async call(
    systemPrompt: string,
    userMessage: string,
  ): Promise<string> {
    const contents: GeminiContent[] = [
      { role: 'user', parts: [{ text: userMessage }] },
    ];

    let response: Response;
    try {
      response = await fetch(
        `${GEMINI_API_BASE}/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents,
            systemInstruction: {
              parts: [{ text: systemPrompt }],
            },
            generationConfig: {
              maxOutputTokens: 1024,
            },
          }),
        },
      );
    } catch (error) {
      if (isFetchError(error)) {
        throw createNetworkError(error, 'Gemini');
      }
      throw error;
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw createHttpError({
        provider: 'Gemini',
        model: this.model,
        status: response.status,
        errorText,
      });
    }

    const data = (await response.json()) as GeminiResponse;

    if (data.error) {
      throw new Error(`Gemini API error: ${data.error.message}`);
    }

    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
      throw new Error('No response from Gemini');
    }

    return content.trim();
  }

  async generateCommand(query: string, context?: string): Promise<string> {
    const userMessage = context
      ? `Context: ${context}\n\nTask: ${query}`
      : query;
    return this.call(SYSTEM_PROMPT_GENERATE, userMessage);
  }

  async explainCommand(command: string): Promise<string> {
    return this.call(SYSTEM_PROMPT_EXPLAIN, `Explain this command: ${command}`);
  }

  async validateCredentials(): Promise<boolean> {
    try {
      // Validate API key using the models list endpoint (works for all keys)
      const response = await fetch(
        `${GEMINI_API_BASE}/models?key=${this.apiKey}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      return response.ok;
    } catch {
      return false;
    }
  }

  async streamChat(
    messages: ChatMessage[],
    onChunk: (chunk: string) => void,
    signal?: AbortSignal,
  ): Promise<void> {
    let response: Response;
    try {
      const geminiMessages: GeminiContent[] = messages.map((m) => ({
        role: m.role === 'assistant' ? ('model' as const) : ('user' as const),
        parts: [{ text: m.content }],
      }));

      response = await fetch(
        `${GEMINI_API_BASE}/models/${this.model}:streamGenerateContent?alt=sse&key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: geminiMessages,
            systemInstruction: {
              parts: [{ text: SYSTEM_PROMPT_CHAT }],
            },
            generationConfig: {
              maxOutputTokens: 4096,
            },
          }),
          signal,
        },
      );
    } catch (error) {
      if (isFetchError(error)) {
        throw createNetworkError(error, 'Gemini');
      }
      throw error;
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw createHttpError({
        provider: 'Gemini',
        model: this.model,
        status: response.status,
        errorText,
      });
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.slice(6);
          if (jsonStr === '[DONE]') continue;

          try {
            const data = JSON.parse(jsonStr) as GeminiResponse;
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              onChunk(text);
            }
          } catch {
            // Ignore parse errors
          }
        }
      }
    }
  }
}

export const GEMINI_MODELS = [
  { value: 'gemini-3.5-flash', label: 'Gemini 3.5 Flash (Recommended)' },
  {
    value: 'gemini-3.1-pro-preview',
    label: 'Gemini 3.1 Pro (Advanced Reasoning, Preview)',
  },
  {
    value: 'gemini-3.1-flash-lite',
    label: 'Gemini 3.1 Flash Lite (Fast & Light)',
  },
  { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro (Legacy, until Oct 2026)' },
  { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (Stable)' },
];
