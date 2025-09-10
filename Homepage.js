    // top的時間js
    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        document.getElementById('time').textContent = `${hours}:${minutes}`;
    }

    updateTime();
    setInterval(updateTime, 1000);

        // Homepage->record 點擊 → 存選擇 → 換頁
        document.querySelectorAll('.mood-img').forEach(img => {
          img.style.cursor = 'pointer';
          img.addEventListener('click', () => {
            const pick = {
              id: img.dataset.mood,
              label: img.dataset.label,
              src: img.getAttribute('src'),
              time: Date.now()
            };
            sessionStorage.setItem('selectedMood', JSON.stringify(pick));
            location.href = 'record.html';  // 你的下一頁路徑
          });
        });


        function escapeHtml(s) {
          return s.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
        }

        (function renderLatest() {
          const root = document.getElementById('journal-list');
          const defaultList = document.getElementById('default-list')
          if (!root) return;

          const data = sessionStorage.getItem('latestRecord');
          if (!data) return;

          const entry = JSON.parse(data);

          // 在 record.html 的 radio 裡找對應的 data-src-b
          const moodImgEl = document.querySelector(`[data-mood="${entry.moodId}"]`) ||
            document.querySelector(`[value="${entry.moodId}"]`);
          const moodSrc = moodImgEl?.dataset.srcB || moodImgEl?.getAttribute('src') || '';

          // 隱藏default.listist
          if (defaultList) defaultList.style.display = 'none';

          root.innerHTML = `
    <div class="mood-block mt-4">
      <div class="line-block">
        <div class="accordion accordion-flush Moodindextext-accordion" id="Moodindextext">
                      <div class="accordion-item">
              <div class="accordion-header d-flex justify-content-between align-items-center accordion-moodbg">
          ${moodSrc ? `<img src="${moodSrc}" alt="${entry.moodLabel}" class="mood-img-sm me-3">` : ''}
                <h6 class="fs-t3 fw-bold text-color-new-1 me-auto" id="date-todayheadingshort"></h6>
                <span class="material-symbols-outlined text-color-new-1">edit_document</span>
                <button class="accordion-button collapsed fs-t2 fw-bold text-color-new-1 ms-3" type="button"
                  data-bs-toggle="collapse" data-bs-target="#mood-indextext" aria-expanded="false" aria-controls="mood-indextext">
                </button>
              </div>
              <div id="mood-indextext" class="accordion-collapse collapse" data-bs-parent="#Moodindextext">
                <div class="accordion-body p-3">
                  <div class="Homepage-whitebackground">
                    <h4 class="fs-t4 fw-bold text-color-new-1 mb-2">日記</h4>
        ${entry.note ? `<p class="fs-t4 text-color-new-3 journal-note h-47 overflow-x-hidden overflow-y-scroll">${escapeHtml(entry.note)}</p>` : ''}
                          </div>
                </div>
              </div>
            </div>
        </div>
      </div>
      </div>
    </div>
  `;
         
          const today = new Date();
          const day = today.getDate();
          const weekdayShort = today.toLocaleDateString('zh-TW', { weekday: 'short' });
          const el = document.getElementById('date-todayheadingshort');
          if (el) el.textContent = `${day} ${weekdayShort}`;

(function checkMemoryAdded() {
  if (!sessionStorage.getItem('memoryAdded')) return;

  const talk = document.querySelector('.talk-bubble');
  if (!talk) { sessionStorage.removeItem('memoryAdded'); return; }

  // 先把 talk-bubble 暫時隱藏
  const prevDisplay = talk.style.display;
  talk.style.display = 'none';

  // 插入 Banner 在原位置
  const banner = document.createElement('div');
  banner.className = 'added-banner fs-t3 fw-bold text-color-new-1 text-center mb-10';
  banner.textContent = '已新增回憶！';
  talk.parentElement.insertBefore(banner, talk);

  // 停留秒數與淡出時間（要與 CSS transition 對齊）
  const stayMs = 1800;
  const fadeMs = 1000;
  banner.style.transition = `opacity ${fadeMs}ms ease, transform ${fadeMs}ms ease`;

  // 開始倒數 → 加上淡出 class → 動畫結束後移除 Banner、還原 talk-bubble
  setTimeout(() => {
    const cleanup = () => { banner.remove(); talk.style.display = prevDisplay || ''; };
    // 極少數瀏覽器可能吃不到 transitionend，設保險計時器
    const fallback = setTimeout(cleanup, fadeMs + 60);

    banner.addEventListener('transitionend', () => {
      clearTimeout(fallback);
      cleanup();
    }, { once: true });

    banner.classList.add('fade-out'); 
  }, stayMs);

  // 只顯示一次，顯示完就移除旗標
  sessionStorage.removeItem('memoryAdded');
})();
        })();

// 打字機效果
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('typeWriter');
  if (!el) return;

  const speed = 150;   // 每字間隔
  const delay = 200;   // Banner 完成後再延遲 0.2 秒

  function startTypewriter() {
    const src = el.innerHTML.replace(/<br\s*\/?>/gi, '\n');
    el.innerHTML = '';
    let i = 0;
    function tick() {
      const ch = src[i++];
      el.innerHTML += (ch === '\n') ? '<br>' : ch;
      if (i < src.length) setTimeout(tick, speed);
    }
    setTimeout(tick, delay);
  }

  const banner = document.querySelector('.added-banner');
  if (banner) {
    // 等淡出動畫跑完才開始打字
    banner.addEventListener('transitionend', () => {
      startTypewriter();
    }, { once: true });
  } else {
    // 沒有 Banner 就直接開始
    startTypewriter();
  }
});



// 10 秒後顯示「抽小卡」提示；可一鍵恢復或前往 getcard.html
(() => {
  const bubble = document.querySelector('.talk-bubble');
  if (!bubble) return;

  const ORIGINAL_HTML = `
    <p class="fs-t2 fw-bold " id="typeWriter">嗨!Lora!<br>今天過得怎麼樣?</p>
    <i class="bi bi-caret-down-fill triangle-mark"></i>
  `;

  let prompted = false;
  const SHOW_AFTER = 10_000; // 10 秒

  const timerId = setTimeout(showPrompt, SHOW_AFTER);

  function showPrompt() {
    if (prompted) return;
    prompted = true;
    bubble.innerHTML = `
      <p class="fs-t2 fw-bold text-color-new-4 mb-3" id="typeWriter">我準備了很多心情小卡要給你<br>你要抽一張試試嗎？</p>
      <div class="mini-btn-row d-flex gap-3 justify-content-center">
        <button type="button" class="btn-mini-second" id="btn-skip">先不抽</button>
        <button type="button" class="btn-mini-pri" id="btn-draw">抽小卡</button>
      </div>
      <i class="bi bi-caret-down-fill triangle-mark"></i>
    `;

    bubble.querySelector('#btn-skip').addEventListener('click', () => {
      bubble.innerHTML = ORIGINAL_HTML;
      runTypewriterIfPresent(); // 恢復後再跑一次打字機
    });

    bubble.querySelector('#btn-draw').addEventListener('click', () => {
      location.href = 'getcard.html';
    });
  }

  // 若別處已提前顯示抽卡（例如你有三擊觸發），就取消這個 10 秒計時
  document.addEventListener('mini-card:shown', () => {
    clearTimeout(timerId);
    prompted = true;
  });

  function runTypewriterIfPresent() {
    const el = document.getElementById('typeWriter');
    if (!el) return;
    const speed = 150, delay = 200;
    const src = el.innerHTML.replace(/<br\s*\/?>/gi, '\n');
    el.innerHTML = '';
    let i = 0;
    function tick() {
      const ch = src[i++];
      el.innerHTML += (ch === '\n') ? '<br>' : ch;
      if (i < src.length) setTimeout(tick, speed);
    }
    setTimeout(tick, delay);
  }
})();
