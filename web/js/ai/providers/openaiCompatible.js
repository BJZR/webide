export async function openaiCompatible({ url, model, key }, messages) {
  const response = await fetch(`${url}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(key && { Authorization: `Bearer ${key}` }) },
    body: JSON.stringify({ model, messages }),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  return (await response.json()).choices[0].message.content;
}
