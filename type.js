(() => {
  const el = document.getElementById('type-writer');
  if (!el) return;

  // ==== 可調參數 ====
  const SPEED = 160;           // 每個字出現的間隔 (ms)
  const START_DELAY = 200;    // 開始前延遲 (ms)
  const FADE_MS = 250;        // 淡入時間 (ms)
  const PUNCT_PAUSE = {       // 碰到標點的額外停頓
    '，': 120, '。': 220, '、': 100, '！': 220, '？': 220, ',': 120, '.': 220, '!': 220, '?': 220
  };


  const raw = el.innerHTML.replace(/<br\s*\/?>/gi, '\n');
  el.innerHTML = ''; 
  el.style.willChange = 'contents';

  // 建立一次性的樣式（淡入動畫）
  const styleId = 'tw-style';
  if (!document.getElementById(styleId)) {
    const s = document.createElement('style');
    s.id = styleId;
    s.textContent = `
      #type-writer .tw-char{opacity:0; transition:opacity ${FADE_MS}ms ease;}
      #type-writer .tw-char.show{opacity:1;}
    `;
    document.head.appendChild(s);
  }

  const chars = [...raw]; 
  let i = 0;

  function typeOne() {
    if (i >= chars.length) return;

    const ch = chars[i++];

    if (ch === '\n') {
      el.insertAdjacentHTML('beforeend', '<br>');
      setTimeout(typeOne, SPEED); // 換行後照常前進
      return;
    }

    const span = document.createElement('span');
    span.className = 'tw-char';
    span.textContent = ch;
    el.appendChild(span);

    // 兩層 rAF 確保 transition 生效
    requestAnimationFrame(() => requestAnimationFrame(() => span.classList.add('show')));

    const pause = PUNCT_PAUSE[ch] ?? 0;
    setTimeout(typeOne, SPEED);
  }

  setTimeout(typeOne, START_DELAY);
})();
