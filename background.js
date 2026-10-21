const MODEL = "gemini-2.5-flash"; 
const API = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
const PROMPT = `Below is a YouTube video transcript with [mm:ss] timestamps.
I don't have time to watch it. Give me the full context:
Transcript:
`;

async function summarize(transcript) {
  const { apiKey } = await chrome.storage.local.get("apiKey");
  if (!apiKey) throw new Error("No API key saved yet.");

  const res = await fetch(`${API}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: PROMPT + transcript }] }],
    }),
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return json.candidates[0].content.parts[0].text;
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type !== "SUMMARIZE") return;
  summarize(msg.transcript)
    .then((summary) => sendResponse({ summary }))
    .catch((err) => sendResponse({ error: err.message }));
  return true; /
