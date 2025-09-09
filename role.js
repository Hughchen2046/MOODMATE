// header time
document.addEventListener("DOMContentLoaded", () => {
  // top 時間
  function updateTime() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const el = document.getElementById("time");
    if (el) el.textContent = `${hh}:${mm}`;
  }
  updateTime();
  setInterval(updateTime, 1000);
});

// 初始化角色分數
export function initScores() {
  const initData = { A: 0, B: 0, C: 0, D: 0 };
  sessionStorage.setItem("scores", JSON.stringify(initData));
}

// 取得目前分數
export function getScores() {
  return JSON.parse(sessionStorage.getItem("scores")) || { A: 0, B: 0, C: 0, D: 0 };
}

// 更新分數 (根據答案加分)
export function updateScores(questionIndex, selectedOptions) {
  const questionScores = [
    // 第一題
    {
      1: { A: 1, B: 1, C: 1, D: 0 },
      2: { A: 1, B: 1, C: 0, D: 0 },
      3: { A: 1, B: 1, C: 0, D: 1 },
      4: { A: 0, B: 0, C: 0, D: 1 }
    },
    // 第二題
    {
      1: { A: 1, B: 1, C: 1, D: 1 },
      2: { A: 1, B: 1, C: 1, D: 1 },
      3: { A: 1, B: 1, C: 1, D: 1 },

      4: { A: 1, B: 0, C: 0, D: 1 },
      5: { A: 1, B: 0, C: 0, D: 1 },

      6: { A: 1, B: 1, C: 1, D: 1 },
      7: { A: 1, B: 1, C: 0, D: 0 },
      8: { A: 0, B: 1, C: 1, D: 0 },

      9: { A: 1, B: 1, C: 1, D: 1 },
      10: { A: 1, B: 0, C: 1, D: 1 },
      11: { A: 1, B: 0, C: 1, D: 0 },
      12: { A: 1, B: 0, C: 1, D: 1 },

      13: { A: 1, B: 1, C: 0, D: 0 },
      14: { A: 1, B: 0, C: 1, D: 1 },

      15: { A: 1, B: 0, C: 1, D: 1 },
      16: { A: 1, B: 0, C: 1, D: 1 },
      17: { A: 1, B: 1, C: 1, D: 1 },

      18: { A: 1, B: 0, C: 1, D: 0 },
      19: { A: 1, B: 0, C: 1, D: 0 }
    },
    // 第三題
    {
      1: { A: 1, B: 1, C: 0, D: 0 },
      2: { A: 1, B: 0, C: 1, D: 1 },
      3: { A: 1, B: 0, C: 1, D: 1 },
      4: { A: 1, B: 0, C: 1, D: 1 },
      5: { A: 0, B: 1, C: 0, D: 0 },
      6: { A: 0, B: 0, C: 1, D: 0 },
      7: { A: 1, B: 0, C: 0, D: 1 }
    }
  ];

  let scores = getScores();

  selectedOptions.forEach(option => {
    const optionScores = questionScores[questionIndex][option];
    for (let role in optionScores) {
      scores[role] += optionScores[role];
    }
  });

  sessionStorage.setItem("scores", JSON.stringify(scores));
}

// 最終決定角色 (回傳 { role, systemRecommend })
export function getFinalRole(lastAnswers) {
  let scores = getScores();

  // 全部沒選 → 預設 A (Bubu)，標記為系統推薦
  if (Object.values(scores).every(v => v === 0)) {
    return { role: "A", systemRecommend: true };
  }

  // 找最高分
  let maxScore = Math.max(...Object.values(scores));
  let topRoles = Object.keys(scores).filter(r => scores[r] === maxScore);

  if (topRoles.length === 1) {
    return { role: topRoles[0], systemRecommend: false };
  }

  // 平手 → 看第三題答案
  if (lastAnswers && lastAnswers.length > 0) {
    for (let option of lastAnswers) {
      const optionScores = {
        1: { A: 1, B: 1, C: 0, D: 0 },
        2: { A: 0, B: 0, C: 1, D: 1 },
        3: { A: 0, B: 1, C: 1, D: 1 },
        4: { A: 1, B: 0, C: 1, D: 1 },
        5: { A: 0, B: 1, C: 0, D: 0 },
        6: { A: 0, B: 0, C: 1, D: 1 },
        7: { A: 0, B: 0, C: 0, D: 1 }
      }[option];

      for (let role in optionScores) {
        if (optionScores[role] > 0 && topRoles.includes(role)) {
          return { role, systemRecommend: false };
        }
      }
    }
  }

  // 還是平手 → 隨機
  return { role: topRoles[Math.floor(Math.random() * topRoles.length)], systemRecommend: false };
}


// // 初始化角色分數
// export function initScores() {
//   const initData = { A: 0, B: 0, C: 0, D: 0 };
//   sessionStorage.setItem("scores", JSON.stringify(initData));
// }

// // 取得目前分數
// export function getScores() {
//   return JSON.parse(sessionStorage.getItem("scores")) || { A: 0, B: 0, C: 0, D: 0 };
// }

// // 更新分數 (根據答案加分)
// export function updateScores(questionIndex, selectedOptions) {
//   const questionScores = [
//     // 第一題
//     {
//       1: { A: 1, B: 1, C: 1, D: 0 },
//       2: { A: 1, B: 1, C: 0, D: 0 },
//       3: { A: 1, B: 1, C: 0, D: 1 },
//       4: { A: 0, B: 0, C: 0, D: 1 }
//     },
//     // 第二題
//     {
//       1: { A: 1, B: 1, C: 1, D: 1 },
//       2: { A: 1, B: 1, C: 1, D: 1 },
//       3: { A: 1, B: 1, C: 1, D: 1 },

//       4: { A: 1, B: 0, C: 0, D: 1 },
//       5: { A: 1, B: 0, C: 0, D: 1 },

//       6: { A: 1, B: 1, C: 1, D: 1 },
//       7: { A: 1, B: 1, C: 0, D: 0 },
//       8: { A: 0, B: 1, C: 1, D: 0 },

//       9: { A: 1, B: 1, C: 1, D: 1 },
//       10: { A: 1, B: 0, C: 1, D: 1 },
//       11: { A: 1, B: 0, C: 1, D: 0 },
//       12: { A: 1, B: 0, C: 1, D: 1 },

//       13: { A: 1, B: 1, C: 0, D: 0 },
//       14: { A: 1, B: 0, C: 1, D: 1 },

//       15: { A: 1, B: 0, C: 1, D: 1 },
//       16: { A: 1, B: 0, C: 1, D: 1 },
//       17: { A: 1, B: 1, C: 1, D: 1 },

//       18: { A: 1, B: 0, C: 1, D: 0 },
//       19: { A: 1, B: 0, C: 1, D: 0 }
//     },
//     // 第三題
//     {
//       1: { A: 1, B: 1, C: 0, D: 0 },
//       2: { A: 1, B: 0, C: 1, D: 1 },
//       3: { A: 1, B: 0, C: 1, D: 1 },
//       4: { A: 1, B: 0, C: 1, D: 1 },
//       5: { A: 0, B: 1, C: 0, D: 0 },
//       6: { A: 0, B: 0, C: 1, D: 0 },
//       7: { A: 1, B: 0, C: 0, D: 1 }
//     }
//   ];

//   let scores = getScores();

//   selectedOptions.forEach(option => {
//     const optionScores = questionScores[questionIndex][option];
//     for (let role in optionScores) {
//       scores[role] += optionScores[role];
//     }
//   });

//   sessionStorage.setItem("scores", JSON.stringify(scores));
// }

// // 最終決定角色
// export function getFinalRole(lastAnswers) {
//   let scores = getScores();

//   // 全部沒選 → 預設 A (Bubu)
//   if (Object.values(scores).every(v => v === 0)) {
//     return "A";
//   }

//   // 找最高分
//   let maxScore = Math.max(...Object.values(scores));
//   let topRoles = Object.keys(scores).filter(r => scores[r] === maxScore);

//   if (topRoles.length === 1) return topRoles[0];

//   // 平手 → 看第三題答案 (lastAnswers)
//   if (lastAnswers && lastAnswers.length > 0) {
//     for (let option of lastAnswers) {
//       const optionScores = [
//         {}, // step0 (沒用)
//         {}, // step1 (沒用)
//         {}, // step2 (沒用)
//         {
//           1: { A: 1, B: 1, C: 0, D: 0 },
//           2: { A: 0, B: 0, C: 1, D: 1 },
//           3: { A: 0, B: 1, C: 1, D: 1 },
//           4: { A: 1, B: 0, C: 1, D: 1 },
//           5: { A: 0, B: 1, C: 0, D: 0 },
//           6: { A: 0, B: 0, C: 1, D: 1 },
//           7: { A: 0, B: 0, C: 0, D: 1 }
//         }
//       ][3][option]; // 第三題

//       for (let role in optionScores) {
//         if (optionScores[role] > 0 && topRoles.includes(role)) {
//           return role;
//         }
//       }
//     }
//   }

//   // 還是平手 → 隨機
//   return topRoles[Math.floor(Math.random() * topRoles.length)];
// }
