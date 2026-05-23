export async function askOpenRouter({ question, context, config }) {
  if (!config.openRouterApiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured.");
  }

  const url = `${config.openRouterBaseUrl}/chat/completions`;
  const payload = {
    model: config.openRouterModel,
    messages: [
      {
        role: "system",
        content:
          "You are a helpful Grade 7 tutor. Answer clearly, use simple language, and keep it concise.",
      },
      {
        role: "user",
        content: `Context:\n${context}\n\nQuestion: ${question}`,
      },
    ],
    temperature: 0.4,
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${config.openRouterApiKey}`,
  };

  if (config.openRouterAppName) {
    headers["X-Title"] = config.openRouterAppName;
  }
  if (config.openRouterAppUrl) {
    headers["HTTP-Referer"] = config.openRouterAppUrl;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenRouter error ${response.status}: ${detail}`);
  }

  const data = await response.json();
  const answer = data?.choices?.[0]?.message?.content?.trim();
  if (!answer) {
    throw new Error("OpenRouter returned an empty response.");
  }

  return answer;
}
