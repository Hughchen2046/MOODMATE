document.addEventListener("DOMContentLoaded", () => {
  // top 時間
  function updateTime() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const el = document.getElementById("time");
    if (el) el.textContent = `${hh}:${mm}`;
  }
  updateTime();
  setInterval(updateTime, 1000);
});
