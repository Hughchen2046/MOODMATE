
    // top的時間js
    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        document.getElementById('time').textContent = `${hours}:${minutes}`;
    }

    updateTime();
    setInterval(updateTime, 1000);

(() => {
    const imgEl = document.getElementById('picked-img');
    const labEl = document.getElementById('picked-label');

    // A) 若 index 有存紀錄 → 預選該顆、顯示 b 圖與標籤
    const raw = sessionStorage.getItem('selectedMood');
    if (raw) {
        try {
            const pick = JSON.parse(raw);
            // 預選 radio（觸發 CSS 切 b 圖）
            const r = document.querySelector(`.mood-radio[value="${pick.id}"]`);
            if (r) r.checked = true;
            // 上方顯示
            if (imgEl && pick.src) imgEl.src = pick.src;
            if (labEl) labEl.textContent = pick.label || '';
        } catch (e) { }
    }

    // B) 在 record 頁選擇/改選 → 立即切 b 圖、更新上方、同步到 sessionStorage
    document.querySelectorAll('.mood-radio').forEach(radio => {
        radio.addEventListener('change', () => {
            const pick = {
                id: radio.value,
                label: radio.dataset.label,
                src: radio.dataset.srcB,  // 記錄 b 圖，因為要顯示「已選狀態」
                time: Date.now()
            };
            sessionStorage.setItem('selectedMood', JSON.stringify(pick));
            if (imgEl) imgEl.src = pick.src;
            if (labEl) labEl.textContent = pick.label;
        });
    });
})();


(() => {
    const KEY = "selectedEmotions";
    const saved = JSON.parse(sessionStorage.getItem(KEY) || '{"ids":[]}');

    // 還原已選
    saved.ids.forEach(id => {
        const cb = document.querySelector(`.emo-check[value="${id}"]`);
        if (cb) cb.checked = true;
    });

    // 更新
    document.querySelectorAll(".emo-check").forEach(cb => {
        cb.addEventListener("change", () => {
            const ids = Array.from(document.querySelectorAll(".emo-check:checked"))
                .map(x => x.value);
            sessionStorage.setItem(KEY, JSON.stringify({ ids }));
        });
    });
})();



const textarea = document.querySelector('textarea');
const count = document.getElementById('count');

textarea.addEventListener('input', () => {
    count.textContent = `${textarea.value.length}/500`;
});



const fileInput = document.getElementById('mood-addimages');

fileInput.addEventListener('change', function () {
    if (this.files.length > 3) {
        alert("最多只能選擇 3 張照片");
        this.value = ""; // 清空已選檔案
    }
});



(() => {
    const submitBtn = document.querySelector('.submit-btn');
    if (!submitBtn) return;

    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // 驗證：至少要選一個 mood
        const picked = document.querySelector('.mood-radio:checked');
        if (!picked) {
            alert('請先選擇「今天過得怎麼樣？」');
            return;
        }

        // 擷取：心情與日記文字
        const note = (document.querySelector('.mood-Note-text')?.value || '').trim();
        const entry = {
            id: Date.now(),
            moodId: picked.value,
            moodLabel: picked.dataset.label,
            note
        };

        // 直接覆蓋舊的
        sessionStorage.setItem('latestRecord', JSON.stringify(entry));
        sessionStorage.setItem('memoryAdded', '1');

        // 回到首頁
        location.href = 'index.html';
    });
})();
