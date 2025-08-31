import"./main-BzmhkIGp.js";document.querySelectorAll(".mood-img").forEach(e=>{e.style.cursor="pointer",e.addEventListener("click",()=>{const o={id:e.dataset.mood,label:e.dataset.label,src:e.getAttribute("src"),time:Date.now()};sessionStorage.setItem("selectedMood",JSON.stringify(o)),location.href="record.html"})});function g(e){return e.replace(/[&<>"']/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[o])}(function(){const o=document.getElementById("journal-list"),r=document.getElementById("default-list");if(!o)return;const a=sessionStorage.getItem("latestRecord");if(!a)return;const n=JSON.parse(a),t=document.querySelector(`[data-mood="${n.moodId}"]`)||document.querySelector(`[value="${n.moodId}"]`),c=(t==null?void 0:t.dataset.srcB)||(t==null?void 0:t.getAttribute("src"))||"";r&&(r.style.display="none"),o.innerHTML=`
    <div class="mood-block mt-4">
      <div class="line-block">
        <div class="accordion accordion-flush Moodindextext-accordion" id="Moodindextext">
                      <div class="accordion-item">
              <div class="accordion-header d-flex justify-content-between align-items-center accordion-moodbg">
          ${c?`<img src="${c}" alt="${n.moodLabel}" class="mood-img-sm me-3">`:""}
                <h6 class="fs-t3 fw-bold text-color-new-1 me-auto" id="date-todayheadingshort"></h6>
                <span class="material-symbols-outlined text-color-new-1">edit_document</span>
                <button class="accordion-button collapsed fs-t2 fw-bold text-color-new-1 ms-3" type="button"
                  data-bs-toggle="collapse" data-bs-target="#mood-indextext" aria-expanded="false" aria-controls="mood-indextext">
                </button>
              </div>
              <div id="mood-indextext" class="accordion-collapse collapse" data-bs-parent="#Moodindextext">
                <div class="accordion-body">
                  <div class="index-whitebackground">
                    <h4 class="fs-t4 fw-bold text-color-new-1 mb-2">日記</h4>
        ${n.note?`<p class="fs-t4 text-color-new-3">${g(n.note)}</p>`:""}
                          </div>
                </div>
              </div>
            </div>
        </div>
      </div>
      </div>
    </div>
  `;const l=new Date,y=l.getDate(),f=l.toLocaleDateString("zh-TW",{weekday:"short"}),m=document.getElementById("date-todayheadingshort");m&&(m.textContent=`${y} ${f}`),function(){if(!sessionStorage.getItem("memoryAdded"))return;const d=document.querySelector(".talk-bubble");if(!d){sessionStorage.removeItem("memoryAdded");return}const b=d.style.display;d.style.display="none";const s=document.createElement("div");s.className="added-banner fs-t3 fw-bold text-color-new-1 text-center mb-12",s.textContent="已新增回憶！",d.parentElement.insertBefore(s,d);const p=1800,i=1500;s.style.transition=`opacity ${i}ms ease, transform ${i}ms ease`,setTimeout(()=>{const u=()=>{s.remove(),d.style.display=b||""},v=setTimeout(u,i+60);s.addEventListener("transitionend",()=>{clearTimeout(v),u()},{once:!0}),s.classList.add("fade-out")},p),sessionStorage.removeItem("memoryAdded")}()})();document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("typeWriter");if(!e)return;const o=100,r=3e3,a=e.innerHTML.replace(/<br\s*\/?>/gi,`
`);e.innerHTML="";let n=0;function t(){const c=a[n++];e.innerHTML+=c===`
`?"<br>":c,n<a.length&&setTimeout(t,o)}setTimeout(t,r)});
