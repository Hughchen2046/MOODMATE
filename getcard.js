document.addEventListener("DOMContentLoaded", function () {

    //---- time
    const updateTime = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2,'0');
        const minutes = String(now.getMinutes()).padStart(2,'0');
        document.getElementById('time').textContent = `${hours}:${minutes}`;
    };
    updateTime();
    setInterval(updateTime, 1000);

    // ---- chat 模組初始化
    if (document.querySelector(".getcard")) {
        initGetCardSection();
    }

    function initGetCardSection() {
        const btnGetCard = document.querySelector(".btn-getcard");
        const getcardResult = document.querySelector(".getcard-result");

        btnGetCard.addEventListener("click", () => {
            getcardResult.classList.add("status");
        });
    }
});