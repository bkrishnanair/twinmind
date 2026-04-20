export async function transcribe(blob: Blob, apiKey: string): Promise<string> {
  const form = new FormData();
  form.append("file", blob, "chunk.webm");
  form.append("model", "whisper-large-v3");
  form.append("response_format", "json");

  const r = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });

  if (!r.ok) {
    const errorText = await r.text();
    throw new Error(`Groq backend error: ${r.status} ${r.statusText} - ${errorText}`);
  }

  const { text } = await r.json();
  return text;
}

export async function generateSuggestions(
  transcript: string,
  apiKey: string,
  systemPrompt: string,
): Promise<{ suggestions: { type: string; preview: string; }[] }> {
  const defaultPrompt = `You are a real-time AI assistant for a user in a conversation or meeting. 
Analyze the provided transcript and generate exactly 3 highly relevant suggestions.
Suggestion types can be: "answer", "fact-check", "question", "talking-point", or "clarification".
Return a JSON object with this exact structure:
{
  "suggestions": [
     { "type": "fact-check", "preview": "Fact check text here..." },
     { "type": "talking-point", "preview": "Suggested talking point here..." }
  ]
}
Keep previews concise (under 20 words each).`;

  const finalPrompt = systemPrompt.trim() !== '' ? systemPrompt : defaultPrompt;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { 
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: finalPrompt },
        { role: "user", content: `Here is the recent transcript:\n\n${transcript}` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq Suggestions error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  try {
    const parsed = JSON.parse(data.choices[0].message.content);
    if (!parsed.suggestions || !Array.isArray(parsed.suggestions)) {
      throw new Error("Invalid format");
    }
    return parsed;
  } catch (e) {
    throw new Error("Failed to parse JSON response from Groq.");
  }
}

export async function generateChatResponse(
  transcript: string,
  chatHistory: { role: string; content: string }[],
  userMessage: string,
  apiKey: string,
  systemPrompt: string
): Promise<string> {
  const defaultPrompt = `You are a helpful AI assistant accompanying the user. 
You will be provided with recent audio transcripts from the user's current context/meeting, and a chat history. 
Answer the user's latest query accurately using the transcript context if relevant. Keep it concise but helpful.`;

  const finalPrompt = systemPrompt.trim() !== '' ? systemPrompt : defaultPrompt;

  const messages = [
    { role: "system", content: finalPrompt },
    { role: "system", content: `Recent Transcript Context:\n\n${transcript || "(No transcript yet)"}` },
    ...chatHistory.map(m => ({ role: m.role, content: m.content })),
    { role: "user", content: userMessage }
  ];

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { 
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: messages,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq Chat error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
