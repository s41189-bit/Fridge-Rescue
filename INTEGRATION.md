
# Fridge Rescue｜團隊整合與技術規格

**版本：V2.0｜A、B、C 整合測試版**  
**最後更新：2026/11/17**

---

## 一、文件目的

本文件記錄 Fridge Rescue V2.0 的團隊分工、檔案架構、資料格式、JavaScript 載入順序、HTML 元件 ID、localStorage 規格，以及功能整合與測試注意事項。

本文件主要提供組員 A、B、C 進行後續維護、測試及部署時使用。

V2.0 已整合三位組員的主要成果：

- B 的新版 HTML/CSS 介面
- B 的 30 種食材主檔與建議單位
- C 的 30 道食譜資料
- A 的推薦、篩選、智慧補貨及採買功能
- A 的數量管理與完成料理後手動更新庫存功能

目前已完成主要功能開發及部分瀏覽器測試。

尚待完成完整團隊驗收、正式圖片確認及 Amazon S3 部署驗證。

---

## 二、團隊分工與目前整合狀態

### 組員 A

主要負責：

- 網站前端功能整合
- 食譜匹配與推薦
- 推薦排序
- 料理條件篩選
- 智慧補貨
- 採買清單
- 料理抽籤機
- 冰箱數量管理
- 完成料理後手動扣除庫存
- 整合後功能測試及問題修正

主要檔案：

- `myScript.js`
- `recipe-adapter.js`
- `index.html`（整合版本）

### 組員 B

主要負責：

- 網站 UI 與視覺設計
- HTML/CSS 與 RWD
- 食材主檔
- 建議保存天數及日常單位
- GitHub Pages / AWS S3 部署相關工作

主要成果：

- 新版 HTML/CSS
- `ingredient_master.xlsx`
- 30 種食材資料

目前已將 B 的新版網頁架構與 CSS 整合至專案。

### 組員 C

主要負責：

- 30 道料理資料
- 料理時間及難度
- 飲食分類
- 必要食材
- 食譜建議份量
- 料理步驟
- 食譜測試案例
- 圖片與內容確認

主要檔案：

- `recipes-c.js`

C 的食譜目前為 v0.3 候選資料。

料理步驟文字曾由 AI 協助撰寫，仍需小組確認內容、正確性及原創性聲明。

正式料理圖片尚未接入目前網站。

---

## 三、專案檔案結構

```text
Fridge-Rescue-A/
│
├── index.html
├── mystyle.css
├── myScript.js
├── ingredients.js
├── recipes-c.js
├── recipe-adapter.js
├── README.md
├── INTEGRATION.md
│
└── images/
```

### 檔案說明

| 檔案 | 用途 | 主要來源 |
|---|---|---|
| index.html | 網站主要架構、表單、Modal | B 的新版版面與 A 的功能整合 |
| mystyle.css | 網站樣式與 RWD | B |
| myScript.js | 推薦、庫存、採買與互動邏輯 | A |
| ingredients.js | 30 種食材及建議單位 | B 的食材主檔 |
| recipes-c.js | 30 道正式候選食譜 | C |
| recipe-adapter.js | C 食譜資料轉換 | A |
| README.md | 專案介紹、使用方式與驗收紀錄 | 團隊 |
| INTEGRATION.md | 技術規格與整合注意事項 | 團隊 |
| images/ | 圖片素材資料夾 | 待確認 |

### 舊版檔案

V1.1 原本使用 `recipes.js` 存放五道測試食譜。

V2.0 已改為：

- `recipes-c.js`
- `recipe-adapter.js`

正式網頁不再載入舊版 `recipes.js`。

如果專案中仍保留舊檔案，應避免同時在 HTML 中載入兩份食譜資料。

---

## 四、JavaScript 載入順序

目前 `index.html` 應依照以下順序載入：

```html
<!-- Bootstrap 5 -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

<!-- B 的食材主檔 -->
<script src="ingredients.js"></script>

<!-- C 的 30 道食譜 -->
<script src="recipes-c.js"></script>

<!-- 食譜資料轉換 -->
<script src="recipe-adapter.js"></script>

<!-- A 的主要功能 -->
<script src="myScript.js"></script>
```

### 載入順序說明

1. `ingredients.js` 提供食材主檔。
2. `recipes-c.js` 建立原始食譜陣列。
3. `recipe-adapter.js` 將食譜轉換成 A 的內部格式。
4. `myScript.js` 使用轉換後的資料執行推薦及互動功能。

不得任意調整上述順序。

尤其不得同時載入原本的 `recipes.js` 與 `recipes-c.js`，避免重複宣告 `recipes`。

---

## 五、食材主檔規格

食材資料使用 `ingredients.js`。

資料來源為組員 B 提供的 `ingredient_master.xlsx`。

### 資料範例

```javascript
{
    ingredient_id: "ING_021",
    ingredient_name: "雞蛋",
    unit: "顆",
    category: "蛋奶豆製品",
    suggested_days: 14
}
```

### 欄位說明

| 欄位 | 型態 | 用途 |
|---|---|---|
| ingredient_id | string | 食材唯一 ID |
| ingredient_name | string | 食材名稱 |
| unit | string | 推薦日常量詞 |
| category | string | 食材分類 |
| suggested_days | number | 建議保存天數 |

### 整合規則

- 食材統一使用 `ING_001` 至 `ING_030`。
- 不任意修改既有食材 ID。
- 食譜配對以 `ingredient_id` 為準。
- C 的中文食材名稱須透過主檔轉成 ID。
- 食材單位以 B 的主檔設定為準。

例如：

- 雞蛋：顆
- 番茄：顆
- 起司：片
- 白飯：碗
- 牛奶：瓶/罐

注意：建議日常量詞並非標準重量。

例如「1 盒豬肉片」不一定等於 100 克。

---

## 六、冰箱庫存資料格式

V2.0 已新增數量與單位欄位。

### 正式內部格式

```javascript
{
    id: "batch_001",
    ingredient_id: "ING_021",
    ingredient_name: "雞蛋",
    category: "蛋奶豆製品",
    expiryDate: "2026-11-23",
    quantity: 6,
    unit: "顆"
}
```

### 欄位說明

| 欄位 | 型態 | 說明 |
|---|---|---|
| id | string | 每筆庫存的唯一識別值 |
| ingredient_id | string | 對應食材主檔 ID |
| ingredient_name | string | 食材名稱 |
| category | string | 食材分類 |
| expiryDate | string | 到期日，YYYY-MM-DD 或空字串 |
| quantity | number/null | 食材數量 |
| unit | string | 食材建議單位 |

### 數量規則

新增食材時：

- 必須輸入有效數字。
- 數量必須大於 0。
- 不接受 NaN、Infinity、負數或 0。
- 單位由食材主檔提供。

舊庫存：

- 沒有數量欄位時，使用 `null`。
- 顯示「數量未設定」。
- 不自動假設數量為 1。

### 多批次規則

相同食材可以建立多筆庫存。

例如：

```javascript
[
    {
        id: "batch_001",
        ingredient_id: "ING_021",
        quantity: 6,
        unit: "顆",
        expiryDate: "2026-11-23"
    },
    {
        id: "batch_002",
        ingredient_id: "ING_021",
        quantity: 4,
        unit: "顆",
        expiryDate: "2026-11-28"
    }
]
```

每筆庫存獨立保存數量及到期日。

食譜配對時，同一種食材只計算一次。

完成料理時，使用者可以選擇實際使用的批次。

---

## 七、保存期限規則

V2.0 沿用原本的保存期限判斷。

| 狀態 | 剩餘天數 | usable | urgent |
|---|---|---|---|
| 綠燈 | 4 天以上 | true | false |
| 黃燈 | 0–3 天 | true | true |
| 紅燈 | 小於 0 天 | false | false |
| 灰色 | 未設定日期 | true | false |
| 日期無效 | 無法解析日期 | false | false |

核心函式：

```javascript
expiryStatus(expiryDate, today)
```

日期比較採用日曆日期，不直接以當地時間的毫秒差計算天數。

### 配對注意事項

- 過期庫存不參與配對。
- 日期無效的庫存不參與配對。
- 今天到期的庫存仍可參與配對。
- 未設定到期日的庫存可參與配對。
- 相同食材有多筆庫存時，存在可用批次即可視為具備該食材種類。

保存期限判斷僅反映使用者輸入的日期，不代表食品安全判定。

---

## 八、C 的正式食譜資料格式

C 的 30 道食譜保留在：

`recipes-c.js`

### C 的原始格式

```javascript
{
    id: "recipe-01",
    name: "番茄炒蛋",
    time_minutes: 10,
    difficulty: "簡單",
    diet: ["蛋奶素"],
    required_ingredients: [
        "番茄",
        "雞蛋"
    ],
    portions: "1–2 人份（雞蛋 2 顆、番茄 1 顆）",
    steps: [
        "番茄洗淨切塊，雞蛋打入碗中，加少許鹽打散。",
        "熱鍋倒少許油，倒入蛋液，炒至半熟後先盛起。",
        "同一鍋放入番茄，炒至出汁變軟。",
        "倒回炒蛋拌炒均勻，依口味調味後即可起鍋。"
    ],
    image: "images/recipe-01.jpg"
}
```

### 欄位說明

| 欄位 | 用途 |
|---|---|
| id | 食譜唯一 ID |
| name | 料理名稱 |
| time_minutes | 料理時間（分鐘） |
| difficulty | 難度 |
| diet | 飲食標籤陣列 |
| required_ingredients | 必要食材中文名稱陣列 |
| portions | 料理建議份量 |
| steps | 料理步驟 |
| image | 圖片相對路徑 |

目前食譜 ID 範圍：

`recipe-01` 至 `recipe-30`

### 飲食分類

統一使用：

- 葷食
- 蛋奶素
- 全素

難度統一使用：

- 簡單
- 中等
- 困難

### 必要食材規則

C 的 `required_ingredients` 必須與 B 食材主檔的 `ingredient_name` 一致。

例如：

`"雞蛋"` 可以對應 `ING_021`。

不可自行推測不在主檔中的食材名稱。

常備調味料不列入必要食材配對，相關內容保留在料理步驟中。

---

## 九、食譜資料轉換規格

V2.0 新增：

`recipe-adapter.js`

負責將 C 的食譜格式轉換成 A 的內部格式。

### 欄位轉換

| C 原始欄位 | A 內部欄位 |
|---|---|
| id | recipeId |
| name | name |
| time_minutes | cookingTime |
| difficulty | difficulty |
| diet | dietTags |
| required_ingredients | requiredIngredients |
| portions | portions |
| steps | steps |
| image | image（目前暫不顯示） |

### 轉換後範例

```javascript
{
    recipeId: "recipe-01",
    name: "番茄炒蛋",
    cookingTime: 10,
    difficulty: "簡單",
    dietTags: ["蛋奶素"],
    requiredIngredients: [
        "ING_001",
        "ING_021"
    ],
    portions: "1–2 人份（雞蛋 2 顆、番茄 1 顆）",
    steps: [
        "番茄洗淨切塊，雞蛋打入碗中，加少許鹽打散。"
    ],
    image: ""
}
```

上例的 steps 僅示意格式，實際資料保留 C 的完整料理步驟。

### 轉換驗證

目前資料轉換程式包含：

- 食譜總數必須為 30。
- 食譜 ID 不可重複。
- 必要食材不可為空。
- 必要食材須能對應食材主檔。
- 同一道食譜的必要食材 ID 不可重複。
- 料理時間必須為有效正數。
- 難度必須符合指定分類。
- 飲食標籤必須符合指定分類。

轉換失敗時會產生 JavaScript 錯誤，不應將不完整資料視為正式整合成功。

### 圖片規則

C 的原始食譜包含圖片路徑，但目前未正式接入對應圖片。

因此 adapter 暫時將轉換後的 `image` 設為空字串，避免顯示不存在的圖片。

未來正式接入圖片時，應確認：

1. 圖片檔案存在。
2. 相對路徑正確。
3. 檔名大小寫一致。
4. 圖片具有使用或發布授權。
5. GitHub Pages 和 AWS S3 均能正確載入。

---

## 十、食譜配對與排序規格

### 10.1 配對公式

匹配度使用食材種類計算：

```text
匹配度 =
已具備必要食材種類數
÷
全部必要食材種類數
× 100%
```

結果四捨五入為整數。

例如：

番茄起司烘蛋需要：

- 雞蛋
- 番茄
- 起司

冰箱具有雞蛋、番茄：

匹配度約為 67%。

### 10.2 零採買

當所有必要食材種類均已具備時：

```javascript
canCook = true;
```

此時匹配度為 100%。

注意：`canCook` 代表必要食材種類齊全，不代表實際數量足夠。

### 10.3 排序

目前排序優先考量：

1. 是否可零採買
2. 即期食材的急迫程度
3. 即期食材種類數
4. 食材匹配比例
5. 料理時間
6. 食譜 ID

### 10.4 條件篩選

時間：

- all
- 10
- 20
- 30

難度：

- all
- 簡單
- 中等
- 困難

飲食：

- all
- 葷食
- 蛋奶素
- 全素

零採買：

- true
- false

篩選條件可組合使用。

---

## 十一、智慧補貨規格

智慧補貨使用所有食譜的配對結果。

條件：

```javascript
missingIngredients.length === 1
```

符合條件的料理會依缺少的食材 ID 分組。

例如：

```text
缺少起司：
- 起司歐姆蛋
- 番茄起司烘蛋
```

則補貨建議可以顯示：

「補買起司，可額外解鎖 2 道料理。」

### 注意事項

- 智慧補貨依完整食譜資料計算。
- 不受目前畫面篩選條件限制。
- 同一食材統一分組。
- 同一道食譜不重複計數。
- 已具備全部必要食材的料理不列入補貨建議。
- 不直接比較實際庫存數量與食譜份量。

主要函式：

```javascript
calculateRestock(data)
```

---

## 十二、採買清單資料格式

目前採買清單格式：

```javascript
{
    ingredient_id: "ING_023",
    purchased: false
}
```

### 欄位說明

| 欄位 | 用途 |
|---|---|
| ingredient_id | 食材 ID |
| purchased | 是否標記已購買 |

### 採買規則

- 依食材 ID 去重。
- 相同食材不重複加入。
- 可標記已購買。
- 可刪除單筆。
- 可清空清單。
- 可複製文字。
- 可使用手動複製備援。
- 清單狀態保存於 localStorage。

採買清單與冰箱庫存分開管理。

標記已購買不會直接新增冰箱庫存。

---

## 十三、完成料理與庫存扣除規格

V2.0 新增完成料理後的手動庫存扣除功能。

### 13.1 使用流程

1. 使用者開啟食譜詳情。
2. 必要食材種類齊全時，可點擊完成料理按鈕。
3. 系統列出該食譜必要食材的庫存批次。
4. 使用者輸入各批次實際使用數量。
5. 系統驗證數量。
6. 使用者再次確認。
7. 儲存更新後庫存。
8. 重新計算推薦結果。

### 13.2 可扣除條件

某筆庫存批次必須：

- 屬於目前料理的必要食材。
- 未過期。
- 日期有效，或未設定到期日。
- 已設定有效數量。
- 使用數量不得超過庫存數量。

### 13.3 扣除規則

使用數量：

- 0：不使用該批次。
- 大於 0：扣除指定數量。
- 大於庫存：拒絕操作。
- 負數、空值、非數字：拒絕操作。

目前系統至少要求一個有效批次有正數扣除量，才允許提交。

**注意：目前沒有強制每一種必要食材都必須扣除正數。**

這是刻意保留的手動操作設計，避免程式擅自認定每一種食材的實際使用量。

### 13.4 扣除結果

例如：

原始庫存：

```javascript
{
    ingredient_id: "ING_021",
    quantity: 6,
    unit: "顆"
}
```

使用者扣除 2 顆：

```javascript
{
    ingredient_id: "ING_021",
    quantity: 4,
    unit: "顆"
}
```

若扣除後剩餘數量為 0，該批次會從庫存陣列移除。

### 13.5 操作保護

- 按取消不更新庫存。
- 關閉視窗不更新庫存。
- 超量扣除受到阻止。
- 不可用批次不可扣除。
- 數量未知的舊庫存不可扣除。
- 使用者確認前不執行正式扣除。
- 若 localStorage 寫入失敗，不提交扣除結果。
- 扣除後重新計算推薦與補貨結果。

### 13.6 重要限制

目前程式不解析 C 食譜 `portions` 內的文字來自動扣除數量。

例如：

```text
雞蛋 2 顆、番茄 1 顆
```

只顯示為建議份量。

實際扣除多少，仍由使用者輸入。

這樣可以避免料理份量文字與庫存記錄單位不同時產生錯誤。

---

## 十四、localStorage 規格

V2.0 保留原本的 localStorage Key：

| Key | 用途 |
|---|---|
| fridgeRescue_A_mock_v1 | 網站內建冰箱庫存 |
| fridgeRescue_A_shopping_v1 | 採買清單 |

### 相容性規則

- 不因 V2.0 升級而改變 Key。
- 讀取舊庫存時保留原有食材及日期資訊。
- 舊資料缺少 quantity 時使用 null。
- 新增食材時使用正式數量與單位格式。
- 採買清單格式不變。

### 注意事項

localStorage 的資料與網站來源有關。

本機開啟、GitHub Pages、AWS S3 的瀏覽器儲存空間不會自動互相同步。

清除網站資料可能造成庫存與採買紀錄遺失。

GitHub Repository 不會包含個別使用者的 localStorage 紀錄。

---

## 十五、JavaScript 主要函式

以下列出目前 `myScript.js` 的主要功能。

| 函式 | 用途 |
|---|---|
| ingredientById() | 查詢食材主檔 |
| ingredientName() | 取得食材名稱 |
| expiryStatus() | 判斷保存期限 |
| validQuantity() | 驗證食材數量 |
| ingredientUnit() | 取得食材單位 |
| displayQuantity() | 顯示數量及單位 |
| updateUnitPreview() | 更新表單單位 |
| adaptFridgeItems() | 轉換冰箱資料 |
| availableInventory() | 取得可用食材 |
| matchRecipe() | 單道食譜配對 |
| calculateRecommendations() | 計算推薦結果 |
| compareRecipes() | 排序 |
| filterRecipes() | 篩選 |
| calculateRestock() | 智慧補貨 |
| renderFridge() | 顯示冰箱 |
| renderRecipes() | 顯示食譜 |
| renderRestock() | 顯示補貨結果 |
| refresh() | 更新推薦與畫面 |
| drawRandomRecipe() | 料理抽籤 |
| showRecipe() | 顯示食譜詳情 |
| openCookingInventory() | 開啟扣庫存視窗 |
| submitCookingInventory() | 驗證並更新庫存 |
| mergeShopping() | 採買清單去重 |
| addToShopping() | 加入採買清單 |
| renderShopping() | 顯示採買清單 |
| copyShopping() | 複製採買清單 |
| init() | 初始化網站事件 |

注意：上述多數函式定義於立即執行函式內，並非全部可直接由其他 JavaScript 檔案呼叫。

對外使用時，應優先透過 `window.FridgeRescue` 提供的介面。

---

## 十六、HTML 主要元件 ID

### 16.1 網站統計

| ID | 用途 |
|---|---|
| inventoryCount | 庫存食材種類數 |
| expiringCount | 即期食材種類數 |
| availableRecipeCount | 零採買料理數 |
| appMessage | 全站系統提示 |

### 16.2 冰箱管理

| ID | 用途 |
|---|---|
| mockFridgePanel | 內建冰箱區塊 |
| mockFridgeForm | 新增食材表單 |
| ingredientSelect | 食材選單 |
| ingredientQuantity | 食材數量 |
| ingredientUnit | 自動顯示單位 |
| expiryDate | 到期日 |
| mockFridgeList | 庫存清單 |
| loadDemoBtn | 載入示範 |
| clearFridgeBtn | 清空冰箱 |

### 16.3 推薦與篩選

| ID | 用途 |
|---|---|
| timeFilter | 料理時間 |
| difficultyFilter | 難度 |
| dietFilter | 飲食偏好 |
| zeroShopping | 零採買模式 |
| resetFiltersBtn | 重設篩選 |
| recipeCount | 符合條件的料理數 |
| recipeList | 食譜列表 |
| restockList | 智慧補貨 |
| randomRecipeBtn | 料理抽籤 |
| randomRecipeMessage | 抽籤提示 |

### 16.4 採買清單

| ID | 用途 |
|---|---|
| shoppingList | 採買清單 |
| shoppingCount | 清單項目數 |
| purchasedCount | 已購買項目數 |
| copyShoppingBtn | 複製採買清單 |
| clearShoppingBtn | 清空採買清單 |
| copyFallback | 手動複製備援 |
| shoppingCopyText | 備援文字 |

### 16.5 食譜詳情

| ID | 用途 |
|---|---|
| recipeModal | 食譜詳情視窗 |
| recipeModalTitle | 食譜名稱 |
| recipeModalBody | 食譜內容 |
| modalAddShoppingBtn | 加入採買清單 |
| completeRecipeBtn | 完成料理入口 |

### 16.6 完成料理與更新庫存

| ID | 用途 |
|---|---|
| cookingInventoryModal | 庫存更新視窗 |
| cookingInventoryModalTitle | 更新庫存標題 |
| cookingRecipeName | 目前料理名稱 |
| cookingInventoryMessage | 扣除提示 |
| cookingInventoryForm | 庫存更新表單 |
| cookingInventoryList | 庫存批次列表 |
| cancelCookingBtn | 取消 |
| confirmCookingBtn | 確認更新庫存 |

### 修改注意事項

`myScript.js` 依賴上述 HTML ID 查找 DOM 元件。

如果重新命名或移除 HTML ID，必須同步檢查 JavaScript 程式。

不可在同一頁面使用重複 ID。

---

## 十七、對外整合介面

目前保留以下全域介面：

```javascript
window.FridgeRescue
```

主要可使用方法：

```javascript
FridgeRescue.setInventory(items);

FridgeRescue.refresh();

FridgeRescue.calculateRecommendations(
    items,
    recipeData,
    today
);

FridgeRescue.calculateRestock(data);

FridgeRescue.expiryStatus(expiryDate);

FridgeRescue.filterRecipes(data, filters);

FridgeRescue.mergeShopping(list, missing);
```

### setInventory() 使用方式

外部冰箱模組可以呼叫：

```javascript
FridgeRescue.setInventory(fridgeItems);
```

呼叫後會：

1. 轉換傳入的庫存資料。
2. 替換目前推薦系統使用的庫存陣列。
3. 隱藏內建冰箱管理區塊。
4. 重新計算推薦結果。

### 重要限制

目前 `setInventory()` 是單向接入介面。

它不會自動將資料寫回外部冰箱模組的 localStorage。

進入外部庫存模式後，完成料理按鈕不會直接操作外部庫存。

如果未來需要讓外部模組支援扣庫存，必須額外設計回寫介面及資料一致性規則。

不能直接假設目前的手動扣庫存功能會同步更新 B 的獨立資料來源。

---

## 十八、GitHub 與團隊整合規則

### 18.1 開發版本

目前以 GitHub 作為版本管理與測試平台。

建議：

- 保留已確認可運作的備份。
- 先在開發分支修改程式。
- 修改後執行必要的功能測試。
- 確認無誤再合併至 main。
- 不直接覆蓋其他組員未確認的修改。

### 18.2 本次主要整合檔案

V2.0 主要涉及：

- index.html
- mystyle.css
- myScript.js
- ingredients.js
- recipes-c.js
- recipe-adapter.js
- README.md
- INTEGRATION.md

### 18.3 修改資料格式時

若修改食材：

- 確認 ingredient_id 未被意外更動。
- 確認 C 的必要食材能正確轉換。
- 重新測試配對及補貨。

若修改食譜：

- 確認原始格式符合 C 的規格。
- 確認 adapter 能成功轉換。
- 檢查 30 道食譜是否正常顯示。
- 驗證飲食分類及建議份量。

若修改冰箱：

- 保留舊資料相容性。
- 不隨意更改 localStorage Key。
- 驗證數量、日期及多批次。
- 驗證完成料理後的扣除結果。

若修改 HTML：

- 確認 JavaScript 所需 ID。
- 確認 Bootstrap Modal 正常。
- 確認手機版 RWD。
- 確認不會破壞既有操作。

---

## 十九、測試及驗收規格

### 19.1 已完成的開發階段測試

依 2026/11/17 的開發過程：

- 30 道食譜載入正常。
- 番茄炒蛋匹配度 100%。
- 起司歐姆蛋匹配度 50%。
- 番茄起司烘蛋匹配度 67%。
- 飲食分類篩選正常。
- 食譜份量顯示正常。
- 數量與單位顯示正常。
- 重新整理後數量保留。
- 完成料理手動扣庫存正常。
- 使用完畢的庫存批次移除正常。
- 扣除後重新計算推薦正常。
- 取消扣除不修改庫存。
- 超量扣除受到阻止。

上述屬於人工操作驗收紀錄。

### 19.2 B 建議測試項目

- 手機版及不同螢幕大小。
- 食材選單與 30 種單位。
- 不同食材的數量輸入。
- 同一食材多批次。
- 日期修改及保存期限提醒。
- 舊資料無數量的顯示方式。
- GitHub Pages / AWS S3 網頁顯示。

### 19.3 C 建議測試項目

- 30 道食譜逐一檢查。
- 必要食材名稱。
- 料理時間及難度。
- 飲食分類。
- 建議份量。
- 料理步驟。
- 料理抽籤。
- 智慧補貨及食譜配對。

### 19.4 共同驗收項目

- 採買清單去重。
- 勾選、刪除、清空及複製。
- 不同料理的推薦結果。
- 多批次部分扣除。
- 多批次全部用完。
- 已過期批次不可扣除。
- 數量未知批次不可扣除。
- 取消及超量扣除。
- 重新整理後資料仍存在。
- 本機與線上網站操作一致性。

### 19.5 尚待完整驗證

- 跨瀏覽器測試。
- 手機版完整驗收。
- 所有日期邊界情境。
- localStorage 寫入失敗。
- Clipboard API 備援。
- 多批次扣除各種組合。
- GitHub Pages 正式網址確認。
- Amazon S3 正式部署。

---

## 二十、Amazon S3 部署注意事項

本網站為純前端靜態網站，可部署於 Amazon S3。

### 必要部署檔案

- index.html
- mystyle.css
- myScript.js
- ingredients.js
- recipes-c.js
- recipe-adapter.js

若正式使用圖片，也需要一併部署：

- images/ 中對應的正式圖片

README.md 與 INTEGRATION.md 屬於文件，可保留於 GitHub Repository，並非網站執行的必要檔案。

### 部署後確認

1. 網站首頁正常顯示。
2. CSS 正確載入。
3. JavaScript 無檔案載入錯誤。
4. 30 道食譜正常顯示。
5. 食譜篩選與匹配度正常。
6. 冰箱數量及單位正常。
7. 採買清單正常。
8. 完成料理及扣庫存正常。
9. 手機版可正常操作。
10. 圖片及授權資訊已確認。

### 注意事項

- JavaScript 相對路徑必須正確。
- S3 上的檔名大小寫需要一致。
- 若使用 Bootstrap CDN，網站需要能連線至 CDN。
- S3 網站與 GitHub Pages 的 localStorage 不會同步。
- 應依課程要求設定適當的網站存取方式及部署環境。

---

## 二十一、目前整合限制與後續工作

### 已完成主要開發

- B HTML/CSS 整合
- 30 種食材與單位
- C 的 30 道食譜
- 食譜資料格式轉換
- 匹配度及篩選
- 智慧補貨
- 採買清單
- 料理抽籤
- 數量管理
- 完成料理手動扣庫存

### 尚待處理

- 全部功能的團隊驗收。
- 多批次與舊資料相容性的完整測試。
- 30 道食譜內容及原創性確認。
- 正式圖片與使用授權確認。
- GitHub Pages 線上版本驗收。
- Amazon S3 正式部署驗收。

### 不納入 V2.0 的功能

- 會員系統
- 後端資料庫
- 跨裝置同步
- 自動辨識冰箱食材
- AI 即時生成食譜
- 食材重量自動換算
- 自動根據食譜扣除全部食材
- P2 宿舍料理模式等延伸功能

---

## 二十二、整合注意事項總結

1. 不任意修改食材 ID。
2. C 的正式食譜保留在 recipes-c.js。
3. 食譜透過 recipe-adapter.js 轉換。
4. 不同 JavaScript 檔案不可重複宣告相同的全域名稱。
5. 保持 HTML 的 JavaScript 載入順序。
6. 不任意修改 JavaScript 使用的 HTML 元件 ID。
7. 保留原有 localStorage Key。
8. 舊資料沒有數量時，不自行假設數量。
9. 食材匹配度只計算種類，不代表數量足夠。
10. 完成料理必須由使用者確認實際使用數量。
11. 不直接扣除外部冰箱模組的資料。
12. 修改後重新進行相關功能測試。
13. 正式發布前確認圖片及食譜內容。
14. 依課程要求完成 Amazon S3 部署。

**目前 V2.0 為三人主要成果已整合的測試版本。**

主要功能已具備，但仍需完成團隊驗收及正式部署後，才能視為最終交付版本。
