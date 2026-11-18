# 可愛冰箱視覺化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在「我的冰箱」頁顯示可愛冰箱，庫存食材以貼圖疊在冰箱裡，並有彈出動畫、到期標記、「+N」溢出提示。

**Architecture:** 新增獨立檔 `fridgeVisual.js`（純函式負責分組與分層，DOM 函式負責畫貼圖），掛在 `window.FridgeVisual`。`myScript.js` 的 `refresh()` 在每次庫存變動後呼叫它。冰箱欄位放在 `mockFridgePanel` 之外，B 正式接入後仍會顯示。

**Tech Stack:** 原生 HTML／CSS／JavaScript、Bootstrap 5（既有）。無外部新套件。專案沒有測試框架，也沒有 Node；純函式用 macOS 內建的 `osascript -l JavaScript` 跑測試。

**Spec:** `docs/superpowers/specs/2026-11-18-fridge-visual-design.md`

## Global Constraints

- 只改在 dev-b 分支。
- 不新增外部套件，沿用原生 JS，不引入 React／Vue／Node。
- 不更動 `images/` 內的原圖；網頁用縮圖放 `images/web/`，總量目標 1MB 以內（超過就把貼圖縮到 128px）。
- 圖片檔名 `ING_001.png`～`ING_030.png`、`fridge.png`，對應 `ingredients.js` 的 `ingredient_id`。
- 擺放規則與每層上限：蛋奶豆製品（最上層）5、肉類海鮮（第二層）5、主食（第三層）5、蔬菜（底部抽屜區）10。上限包含「+N」那一格：超過時，只顯示 上限−1 張貼圖，加一格「+N」。
- 同一 `ingredient_id` 多筆庫存合併成一張貼圖，右上角顯示「×數量」。
- 狀態取同一食材中最緊急的一筆：`expiryStatus().color === "danger"` → 紅色標記；`"warning"` → 黃色標記；其他不標記。
- 動畫只對「新加入」的食材播放；頁面重新整理（第一次繪製）不播放。`prefers-reduced-motion: reduce` 時關閉動畫。
- 頁面註腳加一行「冰箱與食物插圖為 AI 生成」。
- 不改食譜配對、智慧補貨、採買清單的邏輯，不破壞 `window.FridgeRescue.setInventory` 介面。

## Review Focus

1. 同一食材兩筆庫存，一筆正常、一筆已過期：貼圖要標紅色，數量顯示 ×2。（Task 2）
2. 沒有設定到期日的食材：不標記，也不報錯。（Task 2）
3. 食材的 `category` 不在四個區域內（或缺漏）：不放貼圖，也不丟例外，其他貼圖照常顯示。（Task 2）
4. 剛好等於上限（5）與超過上限一個（6）：前者不出現「+N」，後者出現 +2。（Task 2）
5. 空庫存顯示「冰箱空空的」；第一次繪製不播彈出動畫，之後新增才播。（Task 3）

---

### Task 1: 網頁用縮圖

**Files:**
- Create: `images/web/fridge.png`（600×800）、`images/web/ING_001.png`～`ING_030.png`（160×160）

**Interfaces:**
- Produces: 路徑慣例 `images/web/${ingredient_id}.png` 與 `images/web/fridge.png`，供 Task 3 載入。

- [ ] **Step 1: 產生縮圖**：用 macOS `sips -Z` 把冰箱縮到長邊 800、貼圖縮到長邊 160，輸出到 `images/web/`，原圖不動。
- [ ] **Step 2: 驗證**：`ls images/web | wc -l` 應為 31；`file images/web/fridge.png` 應顯示 600 x 800 且為 RGBA；`du -sh images/web` 應在 1MB 以內，超過就把貼圖改縮到 128 重做。
- [ ] **Step 3: Commit**：`git add images docs && git commit -m "新增冰箱與食物貼圖素材及網頁用縮圖"`

### Task 2: 分組與分層邏輯（純函式，TDD）

**Files:**
- Create: `fridgeVisual.js`（先只含純函式）、`tests/fridgeVisual.test.js`、`tests/run.js`
- Modify: 無

**Interfaces:**
- Produces（皆掛在 `window.FridgeVisual`，測試環境下為全域物件 `FridgeVisual`）：
  - `ZONES: Array<{ key: "dairy"|"meat"|"staple"|"veg", category: string, capacity: number }>`，順序為 dairy（蛋奶豆製品, 5）、meat（肉類海鮮, 5）、staple（主食, 5）、veg（蔬菜, 10）。
  - `groupItems(items: Array<{ingredient_id, ingredient_name, category, expiryDate}>, expiryStatus: (date: string) => {color: string}) => Array<{ingredient_id, name, category, count, state: "ok"|"soon"|"expired"}>`，依 `ingredient_id` 排序。
  - `planZones(groups) => Array<{key, shown: Group[], overflow: number}>`，順序同 `ZONES`；`groups.length > capacity` 時 `shown` 只取前 `capacity-1` 個、`overflow = groups.length - (capacity-1)`，否則 `overflow = 0`；`category` 不在 `ZONES` 內的 group 被略過。

- [ ] **Step 1: 寫測試 `tests/fridgeVisual.test.js`**，每個測試用 `assertEqual(actual, expected, name)`，內容：
  - `same ingredient twice merges with count 2`：兩筆 ING_001 → 一組、`count === 2`。
  - `worst state wins`：同食材一筆 `color:"success"`、一筆 `color:"danger"` → `state === "expired"`；`"warning"` 與 `"success"` → `"soon"`。
  - `no expiry date stays ok`：`expiryDate:""`（stub 回傳 `color:"secondary"`）→ `state === "ok"`。
  - `unknown category is skipped`：`category:"飲料"` 的 group 不出現在任何 `planZones` 結果，且不丟例外；同時另一個正常 group 仍在其 zone。
  - `exactly capacity shows no overflow`：dairy 5 組 → `shown.length === 5`、`overflow === 0`。
  - `capacity plus one shows +2`：dairy 6 組 → `shown.length === 4`、`overflow === 2`。
  - `veg capacity is 10`：veg 11 組 → `shown.length === 9`、`overflow === 2`。
  - `empty input`：`planZones([])` 回傳 4 個 zone，`shown` 皆空、`overflow` 皆 0。
- [ ] **Step 2: 寫 `tests/run.js`**：用 `ObjC.import("Foundation")` 讀入 `fridgeVisual.js` 與 `tests/fridgeVisual.test.js` 並以 `eval` 執行（`fridgeVisual.js` 在無 `window` 時要把 `FridgeVisual` 掛到全域），印出每個測試通過或失敗，最後一行 `X passed, Y failed`。執行：`osascript -l JavaScript tests/run.js`。
- [ ] **Step 3: 確認測試失敗**：執行上述指令，預期全部失敗（`FridgeVisual` 未定義）。
- [ ] **Step 4: 實作 `ZONES`、`groupItems`、`planZones`**，寫在 `fridgeVisual.js`。`state` 判斷用 `expiryStatus(item.expiryDate).color`：`"danger"` → expired，`"warning"` → soon，其餘 ok；同組取最嚴重者。
- [ ] **Step 5: 確認測試通過**：預期輸出 `8 passed, 0 failed`。
- [ ] **Step 6: Commit**：`git add fridgeVisual.js tests && git commit -m "新增冰箱貼圖分組與分層邏輯及測試"`

### Task 3: 畫面渲染、樣式與動畫

**Files:**
- Modify: `fridgeVisual.js`（加 DOM 函式）、`mystyle.css`（加冰箱樣式）
- Create: `tests/fridge-visual-demo.html`（手動檢視頁，載入 `ingredients.js`、`fridgeVisual.js`、`mystyle.css`，用按鈕模擬各情境）

**Interfaces:**
- Consumes: Task 2 的 `groupItems`、`planZones`、`ZONES`。
- Produces: `FridgeVisual.render(root: HTMLElement, items, opts: { expiryStatus: Function })`。呼叫一次即重畫 `root` 內容；`root` 內部自行記住已出現過的 `ingredient_id`，只對新出現者加 class `fv-pop`；第一次呼叫不加。`root` 內結構：背景冰箱圖 `<img src="images/web/fridge.png" alt="可愛的冰箱">`，每個 zone 一個絕對定位的 `div.fv-zone[data-zone=key]`，貼圖為 `img.fv-sticker`（`src="images/web/${id}.png"`、`alt` 與 `title` 為「食材名稱」加到期狀態文字）、`state` 對應 class `fv-soon` 或 `fv-expired`、`count>1` 時加 `span.fv-count`（「×N」）、溢出時加 `span.fv-more`（「+N」）。庫存為空時加 `p.fv-empty`「冰箱空空的」。

- [ ] **Step 1: 實作 `render`**，如上。食材名稱用 `textContent`／屬性設定，不用字串拼接 `innerHTML`。圖片載入失敗（`onerror`）時隱藏該貼圖並改顯示食材名稱文字，不讓畫面出現破圖圖示。
- [ ] **Step 2: 寫樣式**（`mystyle.css`）：`.fv-root` 為 `position: relative`、寬度上限 520px、置中；四個 `.fv-zone` 以百分比定位在冰箱圖層板上，起始值（以 1200×1600 原圖座標換算）：
  - dairy：x 16.7%–58.3%、y 26.6%–33.8%
  - meat：x 16.7%–58.3%、y 35.6%–45.9%
  - staple：x 16.7%–58.3%、y 47.8%–58.1%
  - veg：x 16.7%–58.3%、y 60%–75.9%
  貼圖在 zone 內用 flex 靠下排列、可略重疊；請對照畫面微調座標與大小，**只調大小不調上限**。桌面版若貼圖寬度小於 36px 無法辨認，先回報再決定。
  `.fv-soon` 加黃色圓點，`.fv-expired` 加紅色圓點並讓貼圖半透明；`.fv-count`、`.fv-more` 為圓形小徽章；`.fv-pop` 為由上往下彈進的 keyframes 動畫；`@media (prefers-reduced-motion: reduce)` 內 `.fv-pop { animation: none }`。
- [ ] **Step 3: 寫手動檢視頁 `tests/fridge-visual-demo.html`**，按鈕分別模擬：空冰箱、三個示範食材、同食材兩筆（一筆過期）、蛋奶豆製品放 6 種（出現 +2）、再新增一種（只有新貼圖彈出）。
- [ ] **Step 4: 驗證**：在瀏覽器開啟檢視頁，逐一確認上述情境：紅黃標記、×2、+2、空冰箱提示、只有新貼圖彈出、拖到手機寬度版面不跑掉。若本機有 Chrome，可用 `--headless --screenshot` 截圖留存。
- [ ] **Step 5: Commit**：`git add fridgeVisual.js mystyle.css tests && git commit -m "新增冰箱貼圖渲染、樣式與彈出動畫"`

### Task 4: 接進冰箱頁

**Files:**
- Modify: `index.html`（約 89–170 行冰箱頁版面、`<script>` 載入區、頁尾註腳）、`myScript.js`（`refresh()` 約 515–528 行、`window.FridgeRescue.setInventory` 約 909–917 行）、`README.md`（資料夾說明）

**Interfaces:**
- Consumes: `FridgeVisual.render(root, items, { expiryStatus })`（Task 3）；`myScript.js` 內既有的 `fridgeItems`、`expiryStatus`。
- Produces: `index.html` 內 `#fridgeVisual` 容器；`data-mock-only` 屬性標記只在暫用模式顯示的欄位。

- [ ] **Step 1: 改版面**：把冰箱頁的兩欄改成三欄（桌面 `col-lg-3` 表單、`col-lg-5` 冰箱 `#fridgeVisual`、`col-lg-4` 庫存清單；小螢幕依序往下排）。表單欄與清單欄加上 `data-mock-only`；冰箱欄放在 `#mockFridgePanel` 之外或不被它隱藏。在 `ingredients.js` 之後、`myScript.js` 之前載入 `fridgeVisual.js`。頁尾註腳加「冰箱與食物插圖為 AI 生成」。
- [ ] **Step 2: 改 `myScript.js`**：`refresh()` 內 `renderFridge()` 之後呼叫 `FridgeVisual.render($("fridgeVisual"), fridgeItems, { expiryStatus })`（兩種模式都要畫）；`setInventory` 內把 `$("mockFridgePanel").hidden = true` 改成隱藏所有 `[data-mock-only]` 元素，確保 B 接入後冰箱圖仍顯示。
- [ ] **Step 3: 驗證**：在瀏覽器開 `index.html`：加入食材貼圖彈出並出現在正確層、刪除與清空後貼圖消失、載入示範資料、重新整理後貼圖直接出現不重播動畫、同食材加兩次顯示 ×2、把到期日設為今天與昨天看黃紅標記、某層放滿六種看 +N；在 Console 執行 `FridgeRescue.setInventory([{id:"x",ingredient_id:"ING_001",expiryDate:""}])`，確認表單與清單隱藏、冰箱圖仍顯示番茄；食譜推薦、智慧補貨、採買清單照常。
- [ ] **Step 4: 重跑單元測試**：`osascript -l JavaScript tests/run.js`，預期 `8 passed, 0 failed`。
- [ ] **Step 5: 更新 `README.md`** 的檔案清單，加上 `fridgeVisual.js`、`images/`、`tests/`。
- [ ] **Step 6: Commit 並推送**：`git add -A && git commit -m "冰箱頁加入可愛冰箱與食物貼圖"`；推送請使用者在自己的終端機執行 `git push origin dev-b`（本環境沒有 GitHub 認證）。
