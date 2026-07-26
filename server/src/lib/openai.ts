import OpenAI from 'openai'

// Works with OpenAI directly, or with any OpenAI-compatible free API (e.g. Groq)
// by setting AI_BASE_URL and AI_MODEL in .env — no code changes needed.
export const openai = new OpenAI({
  apiKey: process.env.AI_API_KEY,
  baseURL: process.env.AI_BASE_URL || undefined,
})

const AI_MODEL = process.env.AI_MODEL || 'gpt-4o-mini'

export async function streamHint(
  problemDesc: string,
  currentCode: string,
  language: string,
  onChunk: (chunk: string) => void
): Promise<string> {
  const stream = await openai.chat.completions.create({
    model: AI_MODEL,
    stream: true,
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful technical interview coach. Give a short, targeted hint (2-4 sentences) that nudges the user toward the next step without giving away the full solution. Never write complete solution code.',
      },
      {
        role: 'user',
        content: `Problem:\n${problemDesc || '(no problem description provided)'}\n\nLanguage: ${language}\n\nCurrent code:\n${currentCode || '(empty)'}\n\nGive me a hint for what to try next.`,
      },
    ],
  })

  let full = ''
  for await (const part of stream) {
    const chunk = part.choices[0]?.delta?.content || ''
    if (chunk) {
      full += chunk
      onChunk(chunk)
    }
  }
  return full
}
