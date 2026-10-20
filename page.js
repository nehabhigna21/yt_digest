

function formatTranscript(data) {
  return data.events
    .filter(e => e.segs)
    .map(e => {
      const text = e.segs.map(s => s.utf8).join("").replace(/\n/g, " ");
      const sec = Math.floor(e.tStartMs / 1000);
      const mm = String(Math.floor(sec / 60)).padStart(2, "0");
      const ss = String(sec % 60).padStart(2, "0");
      return `[${mm}:${ss}] ${text}`;
    })
    .join("\n");
}
function findCaptionUrl() {
  return performance
    .getEntriesByType("resource")
    .map(e => e.name)
    .filter(n => n.includes("timedtext"))
    .pop();
}
async function getTranscript() {
  const url = findCaptionUrl();
  if (!url) return null;               
  const res = await fetch(url + "&fmt=json3");
  return formatTranscript(JSON.parse(await res.text()));
}
window.addEventListener("message", async (event) => {
  if (event.data?.type !== "YT_DIGEST_REQUEST") return;
  const transcript = await getTranscript();
  window.postMessage({ type: "YT_DIGEST_RESPONSE", transcript }, "*");
});
