export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type Provider = 'openrouter' | 'openai' | 'none';

const getProvider = (): Provider => {
  const hasOpenRouter = Boolean(import.meta.env.VITE_OPENROUTER_API_KEY);
  const hasOpenAI = Boolean(import.meta.env.VITE_OPENAI_API_KEY);
  if (hasOpenRouter) return 'openrouter';
  if (hasOpenAI) return 'openai';
  return 'none';
};

export const getAiProvider = getProvider;

export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  const provider = getProvider();
  if (provider === 'none') {
    // Local fallback response if no keys configured
    return "Hi! I'm your CloudVR tour guide. Configure an AI key in .env to enable smart replies.";
  }

  if (provider === 'openrouter') {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY as string;
    const model = (import.meta.env.VITE_OPENROUTER_MODEL as string) || 'openai/gpt-4o-mini';
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': (import.meta.env.VITE_SITE_URL as string) || 'http://localhost',
        'X-Title': 'CloudVR Tours',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
      }),
    });
    if (!res.ok) throw new Error(`OpenRouter error: ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? 'Sorry, I could not generate a response.';
  }

  // OpenAI
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string;
  const model = (import.meta.env.VITE_OPENAI_MODEL as string) || 'gpt-4o-mini';
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI error: ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? 'Sorry, I could not generate a response.';
}


