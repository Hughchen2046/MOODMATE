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
  const fadeMs = 1500;
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

    banner.classList.add('fade-out'); // 請確保 .added-banner.fade-out 會把 opacity 降到 0
  }, stayMs);

  // 只顯示一次，顯示完就移除旗標
  sessionStorage.removeItem('memoryAdded');
})();
        })();

// 打字機效果
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('typeWriter');
  if (!el) return;

  const speed = 100;   // 每字間隔
  const delay = 3000;  // 開始前延遲（3 秒）

  // 把原本內容抓出來，保留換行
  const src = el.innerHTML.replace(/<br\s*\/?>/gi, '\n');
  el.innerHTML = ''; // 清空，準備打字

  let i = 0;
  function tick() {
    const ch = src[i++];
    el.innerHTML += (ch === '\n') ? '<br>' : ch;
    if (i < src.length) setTimeout(tick, speed);
  }

  setTimeout(tick, delay);
});