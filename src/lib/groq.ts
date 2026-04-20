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
