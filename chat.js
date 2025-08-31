document.addEventListener("DOMContentLoaded", function () {

    // time
    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        document.getElementById('time').textContent = `${hours}:${minutes}`;
    }

    updateTime();
    setInterval(updateTime, 1000);

    // countdown
    let time = 4 * 60 + 59; // 4:59 轉成秒數

    function updateCountdown() {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;

        // 格式化補零
        let display =
        String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");

        document.getElementById("countdown").textContent = display;

        if (time > 0) {
            time--;
        } else {
            clearInterval(timer);
        }
    }

    // 先顯示一次
    updateCountdown();
    // 每秒更新
    let timer = setInterval(updateCountdown, 1000);
    
});