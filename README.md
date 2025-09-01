# MOODMATE使用手冊

## 更新 Layout
- 09/01 整合 header.ejs 刪除舊的 top.ejs (Rabbit)
- 08/31 新增 chat.html (Rabbit)
- 08/31 新增 role-step1.html、role-step4.html (Tetsu)
- 08/31 role-step4.html doneBtn -> index.html (Tetsu)
- 08/30 新增 bar元件、移除 role 的 footer (Tetsu)
- 08/30 新增 header-role.ejs (Tetsu)
- 08/28 新增角色核心頁面 role.html (Tetsu)

## 基本元件
- 08/31 新增 _button.scss 裡的 chat 按鈕元件 (Rabbit)
- 08/28 新增_button.scss (Hugh)
- 08/27 顏色 (Hugh)
        建立 $colors $theme-colors
        建立主色 pricolor
        建立次色 seccolor
        更新 indigo,teal,info, danger,warning, success, orange, yellow, green
        neutral 使用 gray 替代
- 08/27 建立"Noto Sans TC"字形 (Hugh)

## 更新請留下日期時間與內容
- 08/30 新增手機外框 (Rabbit)
- 08/27 修改文字、間距、圓角、陰影 [DEMO](http://localhost:5173/MOODMATE/pages/utils.html) (Rabbit)
  

## 指令列表
- `npm install` - 初次下載該範例專案後，需要使用 npm install 來安裝套件
- `npm run dev` - 執行開發模式
  - 若沒有自動開啟瀏覽器，可嘗試手動在瀏覽器上輸入
    `http://localhost:5173/<專案名稱>/pages/index.html`
- `npm run build` - 執行編譯模式（不會開啟瀏覽器）
- `npm run deploy` - 自動化部署

## 資料夾結構
  - assets # 靜態資源放置處
    - images # 圖片放置處 (已更新AAPD圖片)
    - scss # SCSS 的樣式放置處

  - layout # ejs 模板放置處
  - pages # 頁面放置處

- JavaScript 程式碼可寫在 main.js 檔案
