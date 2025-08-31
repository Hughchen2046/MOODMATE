document.addEventListener("DOMContentLoaded", function () {

    // time
    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        document.getElementById('time').textContent = `${hours}:${minutes}`;
    }

    updateTime();
    setInterval(updateTime, 1000);

    // countdown
    let time = 4 * 60 + 59; // 4:59 轉成秒數

    function updateCountdown() {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;

        let display =
        String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");

        document.getElementById("countdown").textContent = display;

        if (time > 0) {
            time--;
        } else {
            clearInterval(timer);
        }
    }

    updateCountdown();
    let timer = setInterval(updateCountdown, 1000);

    // recording
    const btnRecording = document.querySelector(".btn-recording");
    const chatPrompt = document.querySelector(".chat-prompt");
    const btnSoundWave = document.querySelector(".btn-sound-wave");
    const typeWriterEl = document.getElementById("typeWriter");

    // 打字機函數
    function typeWriter(text, speed = 100, callback) {
        let i = 0;
        typeWriterEl.innerHTML = "";
        
        function step() {
    if (i < text.length) {
      const char = text.charAt(i);
      // 遇到換行符號 \n 就轉成 <br>
      if (char === "\n") {
        typeWriterEl.innerHTML += "<br>";
      } else {
        typeWriterEl.innerHTML += char;
      }
      i++;
      setTimeout(step, speed);
    } else if (callback) {
      callback();
    }
  }
        step();
    }

    // 頁面一進入先打字
    setTimeout(() => {
        typeWriter("跟我說說你今天的心情吧？", 100);
    }, 500);

    // 點錄音按鈕
    btnRecording.addEventListener("click", () => {
        btnRecording.classList.add("remove-status");
        chatPrompt.classList.add("remove-status");
        btnSoundWave.classList.add("status");
    });

    // 點聲波按鈕
    btnSoundWave.addEventListener("click", () => {
        btnSoundWave.classList.remove("status");
        btnRecording.classList.remove("remove-status");
        btnRecording.classList.add("disable");

        // 思考中
        typeWriter("思考中...", 100, () => {
            // 思考完 3 秒後打字新訊息
            setTimeout(() => {
                typeWriter("第一次接手新的工作任務，\n會緊張是很自然的反應！", 50, () => {
                    btnRecording.classList.remove("disable");
                });
            }, 3000);
        });
    });

});