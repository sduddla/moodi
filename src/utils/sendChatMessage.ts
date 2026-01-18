export default async function sendChatMessage(
  message: string,
  previousMessages: Array<{ role: 'user' | 'assistant'; text: string }>
): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, previousMessages }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  const data = await response.json();
  return data.response;
}
