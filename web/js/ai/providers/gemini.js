export async function gemini({ url, model, key }, messages) {
  const [system, ...rest] = messages;
  const contents = rest.map(({ role, content }) => ({
    role: role === 'assistant' ? 'model' : 'user',
    parts: [{ text: content }],
  }));
  const response = await fetch(`${url}/v1beta/models/${model}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({ systemInstruction: { parts: [{ text: system.content }] }, contents }),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  const { candidates } = await response.json();
  return candidates[0].content.parts.map((part) => part.text ?? '').join('');
}
