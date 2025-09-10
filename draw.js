(() => {
  // ===== 可調參數 =====
  const INK = "#6b4b3f";
  const TIP_BASE_SIZE = 16;
  const SPACING = TIP_BASE_SIZE * 0.2;

  // ===== 取得畫布 / context =====
  const canvas = document.getElementById("pad");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // 視網膜適配
  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect(); // CSS px
    canvas.width  = Math.round(rect.width  * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // 後續座標都用 CSS px
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // ===== 筆尖（毛邊圓）產生器 =====
  function makeTip(size = TIP_BASE_SIZE, color = INK) {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const t = c.getContext("2d");
    const cx = size / 2, cy = size / 2;
    const R  = size * 0.45, N = 64, J = 0.01;

    t.fillStyle = color;
    t.beginPath();
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      const r = R * (1 + (Math.random() * 2 - 1) * J);
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      i === 0 ? t.moveTo(x, y) : t.lineTo(x, y);
    }
    t.closePath();
    t.fill();
    return c;
  }
  const tipCanvas = makeTip(TIP_BASE_SIZE, INK);

  // ===== 狀態 =====
  let drawing = false;
  let started = false;     // 是否曾在畫布上開始畫
  let redirected = false;  // 避免重複跳轉
  let last = { x: 0, y: 0 };
  let acc = 0;
  let lastPressure = 1;

  // ===== 工具函式 =====
  function getPos(e) {
    const r = canvas.getBoundingClientRect();
    // 允許丟進來的是 PointerEvent、MouseEvent 或 Touch 物件
    const src = e?.touches?.[0] || e?.changedTouches?.[0] || e;
    const cx = src.clientX;
    const cy = src.clientY;
    return { x: cx - r.left, y: cy - r.top }; // CSS px
  }
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const lerp = (a, b, t) => a + (b - a) * t;

  function stamp(x, y, baseSize) {
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
    while (acc >= SPACING) {
      const t = (acc - SPACING) / d;
      const px = lerp(cur.x, last.x, t);
      const py = lerp(cur.y, last.y, t);
      stamp(px, py, TIP_BASE_SIZE);
      acc -= SPACING;
    }
    last = cur;
  }

  // ===== 事件處理（統一入口）=====
  function onDown(e) {
    e.preventDefault?.();
    started = true;
    drawing = true;
    lastPressure = e.pressure || 1;

    // 讓 pointerup 一定能回來
    if ('pointerId' in e && canvas.setPointerCapture) {
      try { canvas.setPointerCapture(e.pointerId); } catch {}
    }

    const p = getPos(e);
    last = p;
    acc = SPACING; // 立即蓋第一下
    stamp(p.x, p.y, TIP_BASE_SIZE);
  }

  function onMove(e) {
    if (!drawing) return;
    e.preventDefault?.();
    lastPressure = e.pressure || 1;
    const p = getPos(e);
    drawTo(p.x, p.y);
  }

  function maybeRedirect() {
    if (started && !redirected) {
      redirected = true;
      requestAnimationFrame(() => { window.location.href = "role.html"; });
    }
  }

  function onUp(e) {
    drawing = false;
    maybeRedirect();
    if (e && 'pointerId' in e && canvas.releasePointerCapture) {
      try { canvas.releasePointerCapture(e.pointerId); } catch {}
    }
  }

  // ===== 主要：Pointer Events（同時支援滑鼠/手指/手寫筆）=====
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  window.addEventListener("pointercancel", onUp);

  // ===== 後備：不支援 Pointer Events 的舊瀏覽器 =====
  if (!("PointerEvent" in window)) {
    // mouse
    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    // touch
    canvas.addEventListener("touchstart", onDown, { passive: false });
    canvas.addEventListener("touchmove", onMove,   { passive: false });
    canvas.addEventListener("touchend", onUp,      { passive: false });
    canvas.addEventListener("touchcancel", onUp,   { passive: false });
  }

  // 清空（可選）
  document.getElementById("clear")?.addEventListener("click", () => {
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
  });
})();
