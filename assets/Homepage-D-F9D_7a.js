import"./main-BIQ0r64h.js";function y(){const e=new Date,t=String(e.getHours()).padStart(2,"0"),d=String(e.getMinutes()).padStart(2,"0");document.getElementById("time").textContent=`${t}:${d}`}y();setInterval(y,1e3);document.querySelectorAll(".mood-img").forEach(e=>{e.style.cursor="pointer",e.addEventListener("click",()=>{const t={id:e.dataset.mood,label:e.dataset.label,src:e.getAttribute("src"),time:Date.now()};sessionStorage.setItem("selectedMood",JSON.stringify(t)),location.href="record.html"})});function x(e){return e.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}(function(){const t=document.getElementById("journal-list"),d=document.getElementById("default-list");if(!t)return;const c=sessionStorage.getItem("latestRecord");if(!c)return;const n=JSON.parse(c),o=document.querySelector(`[data-mood="${n.moodId}"]`)||document.querySelector(`[value="${n.moodId}"]`),r=(o==null?void 0:o.dataset.srcB)||(o==null?void 0:o.getAttribute("src"))||"";d&&(d.style.display="none"),t.innerHTML=`
    <div class="mood-block mt-4">
      <div class="line-block">
        <div class="accordion accordion-flush Moodindextext-accordion" id="Moodindextext">
                      <div class="accordion-item">
              <div class="accordion-header d-flex justify-content-between align-items-center accordion-moodbg">
          ${r?`<img src="${r}" alt="${n.moodLabel}" class="mood-img-sm me-3">`:""}
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
        ${n.note?`<p class="fs-t4 text-color-new-3 journal-note h-47 overflow-x-hidden overflow-y-scroll">${x(n.note)}</p>`:""}
                          </div>
                </div>
              </div>
            </div>
        </div>
      </div>
      </div>
    </div>
  `;const l=new Date,f=l.getDate(),p=l.toLocaleDateString("zh-TW",{weekday:"short"}),m=document.getElementById("date-todayheadingshort");m&&(m.textContent=`${f} ${p}`),(function(){if(!sessionStorage.getItem("memoryAdded"))return;const a=document.querySelector(".talk-bubble");if(!a){sessionStorage.removeItem("memoryAdded");return}const b=a.style.display;a.style.display="none";const s=document.createElement("div");s.className="added-banner fs-t3 fw-bold text-color-new-1 text-center mb-10",s.textContent="已新增回憶！",a.parentElement.insertBefore(s,a);const g=1800,i=1500;s.style.transition=`opacity ${i}ms ease, transform ${i}ms ease`,setTimeout(()=>{const u=()=>{s.remove(),a.style.display=b||""},v=setTimeout(u,i+60);s.addEventListener("transitionend",()=>{clearTimeout(v),u()},{once:!0}),s.classList.add("fade-out")},g),sessionStorage.removeItem("memoryAdded")})()})();document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("typeWriter");if(!e)return;const t=100,d=3e3,c=e.innerHTML.replace(/<br\s*\/?>/gi,`
`);e.innerHTML="";let n=0;function o(){const r=c[n++];e.innerHTML+=r===`
`?"<br>":r,n<c.length&&setTimeout(o,t)}setTimeout(o,d)});
