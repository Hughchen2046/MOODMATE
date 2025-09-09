document.addEventListener('DOMContentLoaded', () => {
  // top 時間
  function updateTime() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2,'0');
    const mm = String(now.getMinutes()).padStart(2,'0');
    const el = document.getElementById('time');
    if (el) el.textContent = `${hh}:${mm}`;
  }
  updateTime(); setInterval(updateTime, 1000);

  // A) 還原 Homepage 傳來的 mood
  const imgEl = document.getElementById('picked-img');
  const labEl = document.getElementById('picked-label');
  const raw = sessionStorage.getItem('selectedMood');
  if (raw) {
    try {
      const pick = JSON.parse(raw);
      const r = document.querySelector(`.mood-radio[value="${pick.id}"]`);
      if (r) r.checked = true;
      if (imgEl && pick.src) imgEl.src = pick.src;
      if (labEl) labEl.textContent = pick.label || '';
    } catch {}
  }

  // B) record 頁改選 → 同步
  document.querySelectorAll('.mood-radio').forEach(radio => {
    radio.addEventListener('change', () => {
      const pick = {
        id: radio.value,
        label: radio.dataset.label,
        src: radio.dataset.srcB,
        time: Date.now()
      };
      sessionStorage.setItem('selectedMood', JSON.stringify(pick));
      if (imgEl) imgEl.src = pick.src;
      if (labEl) labEl.textContent = pick.label;
    });
  });

  // 勾選情感
  const KEY = 'selectedEmotions';
  try {
    const saved = JSON.parse(sessionStorage.getItem(KEY) || '{"ids":[]}');
    saved.ids.forEach(id => {
      const cb = document.querySelector(`.emo-check[value="${id}"]`);
      if (cb) cb.checked = true;
    });
  } catch {}
  document.querySelectorAll('.emo-check').forEach(cb => {
    cb.addEventListener('change', () => {
      const ids = Array.from(document.querySelectorAll('.emo-check:checked')).map(x => x.value);
      sessionStorage.setItem(KEY, JSON.stringify({ ids }));
    });
  });

  // textarea 計數（守門員）
  const textarea = document.querySelector('.mood-Note-text');
  const count = document.getElementById('count');
  if (textarea && count) {
    count.textContent = `${textarea.value.length}/500`;
    textarea.addEventListener('input', () => {
      count.textContent = `${textarea.value.length}/500`;
    });
  }

  // 上傳數量限制（守門員）
  const fileInput = document.getElementById('mood-addimages');
  if (fileInput) {
    fileInput.addEventListener('change', function () {
      if (this.files.length > 3) {
        alert('最多只能選擇 3 張照片');
        this.value = '';
      }
    });
  }

  // 送出（守門員）
  const submitBtn = document.querySelector('.submit-btn');
  if (submitBtn) {
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
  }
});

      const today = new Date();
      const month = today.getMonth() + 1; // getMonth() 回傳 0-11
      const day = today.getDate();
      const weekday = today.toLocaleDateString('zh-TW', { weekday: 'long' });
      const weekdayshort = today.toLocaleDateString('zh-TW', { weekday: 'short' }); 
      const dateStr = `${month}月${day}日 ${weekday}`;
      const dateStr1 = `${day} ${weekdayshort}`;

      document.getElementById("date-todayheading").textContent = dateStr;
      document.getElementById("date-todayheadingshort").textContent = dateStr1;   