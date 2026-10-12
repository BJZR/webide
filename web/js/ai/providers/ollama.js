export async function ollama({ url, model }, messages) {
  const response = await fetch(`${url}/api/chat`, {
    method: 'POST',
    body: JSON.stringify({ model, messages, stream: false }),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  return (await response.json()).message.content;
}
