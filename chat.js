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
    if (document.querySelector(".chat")) {
        initChatSection();
    }

    function initChatSection() {

        // ---- BgMusic
        class BgMusic {
            constructor(options) {
                this.options = options;
                this.audio = document.createElement('audio');
                this.audio.src = options.src;
                this.audio.loop = true;
                this.audio.id = 'createBgAudio';
                document.body.appendChild(this.audio);

                // UI 元素
                this.btn = document.querySelector('.bgMusic');
                this.btnSound = document.querySelector('.btn-sound');
                this.openIcon = this.btnSound.querySelector('.icon-sound.open');
                this.closeIcon = this.btnSound.querySelector('.icon-sound.close');

                // 初始化（預設關閉）
                this.init();
                // 綁定事件
                this.bindEvents();
            }

            init() {
                // 預設設置為關閉狀態
                this.setUIState(false);
                this.options.off && this.options.off();
            }

            setUIState(isPlaying) {
                if (isPlaying) {
                    this.openIcon.classList.add('active');
                    this.closeIcon.classList.remove('active');
                    this.btn.classList.remove('off');
                } else {
                    this.openIcon.classList.remove('active');
                    this.closeIcon.classList.add('active');
                    this.btn.classList.add('off');
                }
            }

            toggleSound() {
                const isOff = this.btn.classList.toggle('off');
                if (isOff) {
                    this.audio.pause();
                    this.openIcon.classList.remove('active');
                    this.closeIcon.classList.add('active');
                    this.options.off && this.options.off();
                } else {
                    this.audio.play().catch(() => {
                        // 如果播放失敗，恢復為關閉狀態
                        this.btn.classList.add('off');
                        this.openIcon.classList.remove('active');
                        this.closeIcon.classList.add('active');
                    });
                    this.openIcon.classList.add('active');
                    this.closeIcon.classList.remove('active');
                    this.options.on && this.options.on();
                }
            }

            // 新增：強制停止音樂的方法
            stopMusic() {
                this.audio.pause();
                this.setUIState(false);
                this.options.off && this.options.off();
            }

            handleVisibility() {
                if (document.visibilityState === 'visible') {
                    if (!this.btn.classList.contains('off')) {
                        this.audio.play().catch(() => {
                            // 播放失敗時不做任何處理，保持當前狀態
                        });
                    }
                } else {
                    if (!this.btn.classList.contains('off')) {
                        this.audio.pause();
                    }
                }
            }

            bindEvents() {
                // 點擊聲音按鈕
                this.btnSound.addEventListener('click', () => this.toggleSound());
                // 分頁切換
                document.addEventListener('visibilitychange', () => this.handleVisibility());
            }
        }

        // 初始化並保存實例
        const bgMusic = new BgMusic({
            src: '/MOODMATE/media/relax-music.mp3',
            on: () => {
                document.querySelector('.bgMusic').classList.remove('off');
            },
            off: () => {
                document.querySelector('.bgMusic').classList.add('off');
            }
        });

        //---- countdown
        let time = 4 * 60 + 59; // 4:59 轉成秒數
        let timer = null;
        const countdownEl = document.getElementById("countdown");
        const countdownText = document.querySelector(".countdown");
        const popupTimeUp = document.getElementById("timeUp");

        const updateCountdown = () => {
            let minutes = Math.floor(time / 60);
            let seconds = time % 60;
            countdownEl.textContent = `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;

            // 小於 30 秒變紅
            if (time <= 30) countdownText.classList.add("text-error");
            if(time > 0) {
                time--;
            } else {
                clearInterval(timer);

                // popup
                setTimeout(() => {
                    popupTimeUp.classList.add("status");
                }, 500);
            }
        }

        const startCountdown = () => {
            time = 4 * 60 + 59;
            clearInterval(timer);

            // 重置顏色
            countdownText.classList.remove("text-error");
            
            // 立刻更新一次，然後開始倒數
            updateCountdown();
            timer = setInterval(updateCountdown, 1000);
        }
        startCountdown();

        //---- 提早結束
        const btnFinish = document.querySelector(".btn-finish");
        btnFinish.addEventListener('click', () => {
            clearInterval(timer); 
            bgMusic.stopMusic();

            // popup
            setTimeout(() => {
                popupTimeUp.classList.add("status");
            }, 500);
        })

        //---- typeWriter
        const typeWriterEl = document.getElementById("typeWriter");
        let typeWriterToken = 0; // 用來中斷多次打字
        function typeWriter(text, speed = 100, callback) {
            typeWriterToken++;
            const token = typeWriterToken;
            let i = 0;
            typeWriterEl.innerHTML = "";
            
            function step(){
                if(token !== typeWriterToken) return; // 中斷上一個打字
                if(i < text.length){
                    typeWriterEl.innerHTML += text.charAt(i)==="\n" ? "<br>" : text.charAt(i);
                    i++;
                    setTimeout(step,speed);
                }else if(callback){
                    callback();
                }
            }
            step();
        }

        //---- 初始提示文字模組
        const chatDialog = document.querySelector(".chat-dialog");
        const initChatPrompt = () => {
            typeWriterEl.innerHTML = "";
            chatDialog.classList.remove("dialog-lg");
            setTimeout(()=>typeWriter("跟我說說你今天的心情吧？",100),500);
        }
        initChatPrompt();

        //---- 傳送訊息流程模組
        const chatLoading = document.querySelector(".chat-loading");
        const btnRecording = document.querySelector(".btn-recording");
        const chatPrompt = document.querySelector(".chat-prompt");
        
        function handleMessageFlow(areaSelector, messageText, options = {}) {
            const area = document.querySelector(areaSelector);
            if(!area) return;

            const messageEl = area.querySelector(".chat-message");
            if(!messageEl) return;

            // 顯示 loading & message
            if(chatLoading) chatLoading.classList.remove("d-none");
            messageEl.classList.add("status");
            typeWriterEl.textContent = "思考中...";

            // 思考完 2 秒後打字新訊息
            setTimeout(() => {
                if(chatLoading) chatLoading.classList.add("d-none");
                messageEl.classList.remove("status");

                // 執行打字前額外動作
                if (typeof options.onBeforeTyping === "function") {
                    options.onBeforeTyping();
                }

                typeWriter(messageText, options.speed||50, () => {
                    // for recordingArea
                    if(typeof options.onComplete === "function") options.onComplete();
                });
            }, options.delay||2000);
        }

        //---- recordingArea
        const btnSoundWave = document.querySelector(".btn-sound-wave");
        const recordingArea = document.querySelector(".recordingArea");
        const closeRecording = document.querySelector(".btn-recording-close");

        // 點錄音按鈕
        btnRecording.addEventListener("click", () => {
            btnRecording.classList.add("remove-status");
            chatPrompt.classList.add("remove-status");
            btnSoundWave.classList.add("status");
            closeRecording.classList.remove("disable");
            btnKeyboard.classList.add("disable");

            // 如果 chatDialog 已經送出過文字訊息，重新顯示初始提示
            if (chatDialog.classList.contains("dialog-lg")) {
                initChatPrompt();
            }
        });

        // 點關閉錄音
        closeRecording.addEventListener("click", () => {
            closeRecording.classList.add("disable");
            btnSoundWave.classList.remove("status");
            btnRecording.classList.remove("remove-status");
            chatPrompt.classList.remove("remove-status");
            btnKeyboard.classList.remove("disable");

            // 如果 chatDialog 已經送出過文字訊息，重新顯示初始提示
            if (chatDialog.classList.contains("dialog-lg")) {
                initChatPrompt();
            }
        });

        // 點聲波按鈕
        btnSoundWave.addEventListener("click", () => {
            closeRecording.classList.add("disable");
            btnSoundWave.classList.remove("status"); 
            btnRecording.classList.remove("remove-status"); 
            btnRecording.classList.add("disable");

            handleMessageFlow(".recordingArea",
                "第一次接手新的工作任務，\n會緊張是很自然的反應！",
                { 
                    onComplete: ()=>{
                        btnRecording.classList.remove("disable");
                        chatPrompt.classList.remove("remove-status");
                        btnKeyboard.classList.remove("disable");
                    }
                }
            );
        });


        //---- typingArea
        const btnKeyboard = document.querySelector(".btn-keyboard");
        const btnMicphine = document.querySelector(".btn-micphine");
        const typingArea = document.querySelector(".typingArea");
        const chatSend = document.querySelector(".btn-send");
        const chatInput = document.getElementById("chatInput");

        // 點擊鍵盤
        btnKeyboard.addEventListener("click", () => {
            recordingArea.classList.add("down");
            typingArea.classList.add("up");

            if (chatDialog.classList.contains("dialog-lg")) {
                initChatPrompt();
            }
        });

        // 點擊錄音
        btnMicphine.addEventListener("click", () => {
            recordingArea.classList.remove("down");
            typingArea.classList.remove("up");
        });

        // 點擊送出
        chatSend.addEventListener("click", ()=>{
            const text = chatInput.value.trim();
            if(!text) return;

            handleMessageFlow(
                ".typingArea",
                "第一次接手新的工作任務，會緊張是很自然的反應。從你的描述中可以感受到，你其實有做準備，也有前輩的協助，但當真的要獨立完成時，仍會擔心表現不夠好、怕自己犯錯。這樣的焦慮，不代表你不夠好，而是你對自己的表現有期待，也在乎這份工作。",
                {
                    onBeforeTyping: () => {
                        // 在打字前加上 dialog-lg
                        chatDialog.classList.add("dialog-lg");
                    }
                }
            );
            chatInput.value = "";
        });
    }

    // ---- chat-diary 模組初始化
    if (document.querySelector(".chat-diary")) {
        initChatDiarySection();
    }

    function initChatDiarySection() {
        //---- 回首頁
        const btnHomeIntro = document.querySelectorAll(".btn-login-intro");
        const popuploginIntro = document.getElementById("loginIntro");
        const btnGoHome = document.querySelector(".btn-go-home");

        btnHomeIntro.forEach(btn => {
            btn.addEventListener('click', () => {
                setTimeout(() => {
                    popuploginIntro.classList.add("status");
                }, 500);
            });
        });

        btnGoHome.addEventListener('click', () => {
            setTimeout(() => {
                popuploginIntro.classList.remove("status");
                window.location.href = "Homepage.html?chat-finish";
            }, 500);
        });

        //---- 登入 & 註冊
        const btnGoLogin = document.querySelector(".btn-go-login");
        const btnGoLogin2 = document.getElementById("btn-go-login");
        const btnGoRegister = document.getElementById("btn-go-register");
        const loginArea = document.querySelector(".login");
        const registerArea = document.querySelector(".register");
        const btnClose = document.querySelectorAll(".btn-close");
        const popuplogin = document.getElementById("login");

        // 前往註冊
        btnGoLogin.addEventListener('click', () => {
            setTimeout(() => {
                popuplogin.classList.add("status");
                popuploginIntro.classList.remove("status");
            }, 500);
        });

        // 關閉登入
        btnClose.forEach(btn => {
            btn.addEventListener('click', () => {
                setTimeout(() => {
                    popuploginIntro.classList.add("status");
                    popuplogin.classList.remove("status");
                }, 500);
            });
        });

        // 切換註冊
        btnGoRegister.addEventListener("click", () => {
            loginArea.classList.add("down");
            registerArea.classList.add("up");
        });

        // 切換登入
        btnGoLogin2.addEventListener("click", () => {
            loginArea.classList.remove("down");
            registerArea.classList.remove("up");
        });

        //---- 登入成功
        const btnLogin = document.querySelector(".btn-login");
        const popupLoading = document.getElementById("loading");

        btnLogin.addEventListener('click', () => {
            setTimeout(function () {
                popuplogin.classList.remove("status");
                popupLoading.classList.add("status");
            }, 100);

            setTimeout(function () {
                popupLoading.classList.remove("status");
                window.location.href = "Homepage.html?chat-finish";
            }, 2000);
        });

        //---- 註冊成功
        const btnRegister = document.querySelector(".btn-register");
        const registerForm = document.getElementById("registerForm");

        btnRegister.addEventListener('click', () => {
            setTimeout(() => {
                registerForm.classList.add('success');

                setTimeout(() => {
                    popuplogin.classList.remove('status');
                    popupLoading.classList.add('status');

                    setTimeout(() => {
                        popupLoading.classList.remove('status');
                        window.location.href = "Homepage.html?chat-finish";
                    }, 2000);

                }, 800);

            });
        });
    }
});