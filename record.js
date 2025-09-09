document.addEventListener('DOMContentLoaded', () => {
  // ================= 時間 =================
  function updateTime() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const el = document.getElementById('time');
    if (el) el.textContent = `${hh}:${mm}`;
  }
  updateTime();
  setInterval(updateTime, 1000);

  // ================= 日期（頁首顯示） =================
  {
    const today = new Date();
    const month = today.getMonth() + 1; // 0-11
    const day = today.getDate();
    const weekday = today.toLocaleDateString('zh-TW', { weekday: 'long' });
    const weekdayshort = today.toLocaleDateString('zh-TW', { weekday: 'short' });
    const dateStr = `${month}月${day}日 ${weekday}`;
    const dateStr1 = `${day} ${weekdayshort}`;

    const h1 = document.getElementById("date-todayheading");
    const h2 = document.getElementById("date-todayheadingshort");
    if (h1) h1.textContent = dateStr;
    if (h2) h2.textContent = dateStr1;
  }

  // ================= A) 還原 Homepage 傳來的 mood =================
  (function restoreMoodFromSession() {
    const imgEl = document.getElementById('picked-img');
    const labEl = document.getElementById('picked-label');
    const raw = sessionStorage.getItem('selectedMood');
    if (!raw) return;

    try {
      const pick = JSON.parse(raw);
      const r = document.querySelector(`.mood-radio[value="${pick.id}"]`);
      if (r) r.checked = true;
      if (imgEl && pick.src) imgEl.src = pick.src;
      if (labEl) labEl.textContent = pick.label || '';
    } catch { /* ignore */ }
  })();

  // ================= B) record 頁改選 → 同步 =================
  document.querySelectorAll('.mood-radio').forEach(radio => {
    radio.addEventListener('change', () => {
      const pick = {
        id: radio.value,
        label: radio.dataset.label,
        src: radio.dataset.srcB,
        time: Date.now()
      };
      sessionStorage.setItem('selectedMood', JSON.stringify(pick));

      const imgEl = document.getElementById('picked-img');
      const labEl = document.getElementById('picked-label');
      if (imgEl) imgEl.src = pick.src;
      if (labEl) labEl.textContent = pick.label;
    });
  });

  // ================= 勾選情感（session 保存） =================
  (function persistEmotions() {
    const KEY = 'selectedEmotions';
    try {
      const saved = JSON.parse(sessionStorage.getItem(KEY) || '{"ids":[]}');
      saved.ids.forEach(id => {
        const cb = document.querySelector(`.emo-check[value="${id}"]`);
        if (cb) cb.checked = true;
      });
    } catch { /* ignore */ }

    document.querySelectorAll('.emo-check').forEach(cb => {
      cb.addEventListener('change', () => {
        const ids = Array.from(document.querySelectorAll('.emo-check:checked')).map(x => x.value);
        sessionStorage.setItem('selectedEmotions', JSON.stringify({ ids }));
      });
    });
  })();

  // ================= textarea 計數 =================
  (function setupTextareaCounter() {
    const textarea = document.querySelector('.mood-Note-text');
    const count = document.getElementById('count');
    if (!textarea || !count) return;

    const render = () => (count.textContent = `${textarea.value.length}/500`);
    render();
    textarea.addEventListener('input', render);
  })();

  // ================= 送出（守門員） =================
  (function setupSubmit() {
    const submitBtn = document.querySelector('.submit-btn');
    const textarea = document.querySelector('.mood-Note-text');

    if (!submitBtn) return;
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const picked = document.querySelector('.mood-radio:checked');
      if (!picked) { alert('請先選擇「今天過得怎麼樣？」'); return; }

      const note = (textarea?.value || '').trim();
      const entry = {
        id: Date.now(),
        moodId: picked.value,
        moodLabel: picked.dataset.label,
        note
      };

      sessionStorage.setItem('latestRecord', JSON.stringify(entry));
      sessionStorage.setItem('memoryAdded', '1');
      location.href = 'Homepage.html';
    });
  })();

  // ================= 圖片上傳（依選取數顯示 1~3 張；已選一律顯示 store4.png） =================
  (function imageUploader() {
    const input = document.getElementById('mood-addimages'); // <input type="file">
    const mbody  = document.getElementById('mood-body');      // accordion-body 容器
    if (!input || !mbody) return;
    function getBase() {
      if (typeof window.__BASE_URL__ === 'string') return window.__BASE_URL__;
      const segs = location.pathname.split('/').filter(Boolean);
      // user/org pages: segs[0] 可能是子頁，不該加 repo；project pages: segs[0] 是 repo
      return segs.length > 0 ? `/${segs[0]}/` : '/';
    }
    const BASE = getBase();
    const url = (p) => BASE + String(p).replace(/^\/+/, ''); // 去掉開頭的 '/'

    const STORE4   = url('assets/images/record/store4.png');
    const ADD_ICON = url('assets/images/record/add-photo.svg');
    let count = 0; // 目前顯示的張數（0~3）

    input.addEventListener('change', () => {
      const selected = Array.from(input.files || []);
      if (selected.length > 3) {
        alert('最多只能選擇 3 張照片');
        input.value = '';
        count = 0;
        render(); // 顯示空的 3 個新增卡
        return;
      }
      count = Math.min(selected.length, 3);
      render();
    });

    function render() {
      // 清空後重畫
      mbody.innerHTML = '';
      const grid = document.createElement('div');
      grid.className = 'iu-grid';
      mbody.appendChild(grid);

      // 已選的：不管實際檔案，一律顯示 store4.png
      for (let i = 0; i < count; i++) {
        const slot = document.createElement('div');
        slot.className = 'iu-slot';
        slot.innerHTML = `
          <img src="${STORE4}" alt="選取圖片">
          <button class="iu-remove" data-index="${i}" aria-label="移除">×</button>
        `;
        grid.appendChild(slot);
      }

      // 不足 3 張：補「新增照片」卡
      for (let j = count; j < 3; j++) {
        const add = document.createElement('div');
        add.className = 'iu-add';
        add.innerHTML = `
          <img src="${ADD_ICON}" alt="新增">
        `;
        add.addEventListener('click', () => input.click());
        grid.appendChild(add);
      }

      // 綁定刪除（每點一次 -1）
      mbody.querySelectorAll('.iu-remove').forEach(btn => {
        btn.addEventListener('click', () => {
          count = Math.max(0, count - 1);
          render();
        });
      });

      // 把同一個 input 接回到 mbody（隱藏），確保 add.click() 能正常打開選檔視窗
      input.classList.add('d-none');
      mbody.appendChild(input);
    }

    // 初始畫面保留你原本的樣式，不主動 render；
    // 等使用者第一次選檔或超過限制時才 render。
  })();
});
