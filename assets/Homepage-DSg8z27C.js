import"./main-BcDeyH35.js";function g(){const e=new Date,t=String(e.getHours()).padStart(2,"0"),o=String(e.getMinutes()).padStart(2,"0");document.getElementById("time").textContent=`${t}:${o}`}g();setInterval(g,1e3);document.querySelectorAll(".mood-img").forEach(e=>{e.style.cursor="pointer",e.addEventListener("click",()=>{const t={id:e.dataset.mood,label:e.dataset.label,src:e.getAttribute("src"),time:Date.now()};sessionStorage.setItem("selectedMood",JSON.stringify(t)),location.href="record.html"})});function h(e){return e.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}(function(){const t=document.getElementById("journal-list"),o=document.getElementById("default-list");if(!t)return;const d=sessionStorage.getItem("latestRecord");if(!d)return;const s=JSON.parse(d),n=document.querySelector(`[data-mood="${s.moodId}"]`)||document.querySelector(`[value="${s.moodId}"]`),a=(n==null?void 0:n.dataset.srcB)||(n==null?void 0:n.getAttribute("src"))||"";o&&(o.style.display="none"),t.innerHTML=`
    <div class="mood-block mt-4">
      <div class="line-block">
        <div class="accordion accordion-flush Moodindextext-accordion" id="Moodindextext">
                      <div class="accordion-item">
              <div class="accordion-header d-flex justify-content-between align-items-center accordion-moodbg">
          ${a?`<img src="${a}" alt="${s.moodLabel}" class="mood-img-sm me-3">`:""}
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
        ${s.note?`<p class="fs-t4 text-color-new-3 journal-note h-47 overflow-x-hidden overflow-y-scroll">${h(s.note)}</p>`:""}
                          </div>
                </div>
              </div>
            </div>
        </div>
      </div>
      </div>
    </div>
  `;const r=new Date,l=r.getDate(),b=r.toLocaleDateString("zh-TW",{weekday:"short"}),u=document.getElementById("date-todayheadingshort");u&&(u.textContent=`${l} ${b}`),function(){if(!sessionStorage.getItem("memoryAdded"))return;const i=document.querySelector(".talk-bubble");if(!i){sessionStorage.removeItem("memoryAdded");return}const m=i.style.display;i.style.display="none";const c=document.createElement("div");c.className="added-banner fs-t3 fw-bold text-color-new-1 text-center mb-10",c.textContent="已新增回憶！",i.parentElement.insertBefore(c,i);const w=1800,p=1e3;c.style.transition=`opacity ${p}ms ease, transform ${p}ms ease`,setTimeout(()=>{const y=()=>{c.remove(),i.style.display=m||""},v=setTimeout(y,p+60);c.addEventListener("transitionend",()=>{clearTimeout(v),y()},{once:!0}),c.classList.add("fade-out")},w),sessionStorage.removeItem("memoryAdded")}()})();document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("typeWriter");if(!e)return;const t=150,o=200;function d(){const n=e.innerHTML.replace(/<br\s*\/?>/gi,`
`);e.innerHTML="";let a=0;function r(){const l=n[a++];e.innerHTML+=l===`
`?"<br>":l,a<n.length&&setTimeout(r,t)}setTimeout(r,o)}const s=document.querySelector(".added-banner");s?s.addEventListener("transitionend",()=>{d()},{once:!0}):d()});const x=new URLSearchParams(window.location.search);if(x.has("chat-finish")){const e=document.querySelector(".talk-bubble");e&&(e.innerHTML=`
        <p class="fs-t2 fw-bold text-color-new-4" id="typeWriter">剛剛跟你聊聊很開心<br>期待明天能再見到你～</p>
        <i class="bi bi-caret-down-fill triangle-mark"></i>
      `)}(()=>{const e=document.querySelector(".talk-bubble");if(!e)return;const t=`
    <p class="fs-t2 fw-bold " id="typeWriter">嗨!Lora!<br>今天過得怎麼樣?</p>
    <i class="bi bi-caret-down-fill triangle-mark"></i>
  `;let o=!1;const s=setTimeout(n,1e4);function n(){o||(o=!0,e.innerHTML=`
      <p class="fs-t2 fw-bold text-color-new-4 mb-3" id="typeWriter">我準備了很多心情小卡要給你<br>你要抽一張試試嗎？</p>
      <div class="mini-btn-row d-flex gap-3 justify-content-center">
        <button type="button" class="btn-mini-second" id="btn-skip">先不抽</button>
        <button type="button" class="btn-mini-pri" id="btn-draw">抽小卡</button>
      </div>
      <i class="bi bi-caret-down-fill triangle-mark"></i>
    `,e.querySelector("#btn-skip").addEventListener("click",()=>{e.innerHTML=t,a()}),e.querySelector("#btn-draw").addEventListener("click",()=>{location.href="getcard.html"}))}document.addEventListener("mini-card:shown",()=>{clearTimeout(s),o=!0});function a(){const r=document.getElementById("typeWriter");if(!r)return;const l=150,b=200,u=r.innerHTML.replace(/<br\s*\/?>/gi,`
`);r.innerHTML="";let f=0;function i(){const m=u[f++];r.innerHTML+=m===`
`?"<br>":m,f<u.length&&setTimeout(i,l)}setTimeout(i,b)}})();
