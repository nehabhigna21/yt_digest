function onVideoChange() {
  console.log("YT Digest: video", window.location.href);
}
onVideoChange();
window.addEventListener("yt-navigate-finish", onVideoChange);
window.addEventListener("message", (event) => {
  if (event.data?.type !== "YT_DIGEST_RESPONSE") return;
  const t = event.data.transcript;
  console.log("YT Digest transcript:", t ? t.slice(0, 300) : "none (is CC on?)");
});
document.addEventListener("keydown", (e) => {
  if (e.key === "t" && !/INPUT|TEXTAREA/.test(e.target.tagName)) {
    window.postMessage({ type: "YT_DIGEST_REQUEST" }, "*");
  }
});
