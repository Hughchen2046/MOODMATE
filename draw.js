(() => {
  // ===== 可調參數 =====
  const INK = "#6b4b3f";                  // 筆色
  const TIP_BASE_SIZE = 28;               // 筆尖基準尺寸(px，CSS像素)
  const SPACING = TIP_BASE_SIZE * 0.2;   // 連續蓋章間距

  // ===== 取得畫布 / context =====
  const canvas = document.getElementById("pad");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // 視網膜適配：用 setTransform 避免重複 scale 疊加
  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect(); // CSS px
    canvas.width  = Math.round(rect.width  * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);      // 之後座標都用 CSS px
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // ===== 筆尖（毛邊圓）產生器 =====
  function makeTip(size = TIP_BASE_SIZE, color = INK) {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const t = c.getContext("2d");

    // 基底圓
    t.fillStyle = color;
    t.beginPath();
    t.arc(size / 2, size / 2, size * 0.45, 0, Math.PI * 2);
    t.fill();

    // 邊緣噪點 → 讓邊緣像毛筆/麥克筆
    t.globalCompositeOperation = "destination-out";
    t.fillStyle = "rgba(0,0,0,.35)";
    for (let i = 0; i < 220; i++) {
      const r = (Math.random() * 0.25 + 0.75) * size * 0.45;
      const a = Math.random() * Math.PI * 2;
      const x = size / 2 + Math.cos(a) * r;
      const y = size / 2 + Math.sin(a) * r;
      const d = Math.random() * 2 + 1;
      t.beginPath();
      t.arc(x, y, d, 0, Math.PI * 2);
      t.fill();
    }
    t.globalCompositeOperation = "source-over";
    return c;
  }

  const tipCanvas = makeTip(TIP_BASE_SIZE, INK);

  // ===== 繪製（蓋章式） =====
  let drawing = false;
  let last = { x: 0, y: 0 };
  let acc = 0;                 // 累積距離，達到 SPACING 才蓋一次
  let lastPressure = 1;

  function getPos(e) {
    const r = canvas.getBoundingClientRect();
    const cx = e.clientX ?? (e.touches && e.touches[0].clientX);
    const cy = e.clientY ?? (e.touches && e.touches[0].clientY);
    return { x: cx - r.left, y: cy - r.top }; // CSS px
  }
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const lerp = (a, b, t) => a + (b - a) * t;

  function stamp(x, y, baseSize) {
    // 旋轉/大小/位置 抖動，讓筆觸更自然
    const scale = (0.9 + Math.random() * 0.2) * lastPressure;
    const rot = (Math.random() * 24 - 12) * (Math.PI / 180);
    const jx = Math.random() * 2 - 1;
    const jy = Math.random() * 2 - 1;

    const w = baseSize * scale;
    const h = baseSize * scale;

    ctx.save();
    ctx.translate(x + jx, y + jy);
    ctx.rotate(rot);
    ctx.drawImage(tipCanvas, -w / 2, -h / 2, w, h);
    ctx.restore();
  }

  function drawTo(x, y) {
    const cur = { x, y };
    let d = dist(cur, last);
    acc += d;

    // 等距蓋章：每跨過一個 spacing 就補一顆
    while (acc >= SPACING) {
      const t = (acc - SPACING) / d; // 回推應蓋章的位置
      const px = lerp(cur.x, last.x, t);
      const py = lerp(cur.y, last.y, t);
      stamp(px, py, TIP_BASE_SIZE);
      acc -= SPACING;
    }
    last = cur;
  }

  // ===== 事件 =====
  function onDown(e) {
    e.preventDefault();
    const p = getPos(e);
    last = p;
    lastPressure = e.pressure || 1;
    drawing = true;
    acc = SPACING;             // 立即蓋第一下
    stamp(p.x, p.y, TIP_BASE_SIZE);
  }
  function onMove(e) {
    if (!drawing) return;
    e.preventDefault();
    lastPressure = e.pressure || 1;
    const p = getPos(e);
    drawTo(p.x, p.y);
  }
  function onUp() { drawing = false; }

  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);

  // 阻止手機觸控時畫面滾動
  canvas.addEventListener("touchstart", e => e.preventDefault(), { passive: false });
  canvas.addEventListener("touchmove",  e => e.preventDefault(), { passive: false });

  // 清空
  document.getElementById("clear")?.addEventListener("click", () => {
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height); // 因為已 setTransform，所以用 CSS px
  });

  // === 自動跳轉 ===
  setTimeout(() => {
    window.location.href = "role.html";
  }, 10000);
})();
