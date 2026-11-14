# Fridge Rescue 團隊整合規格

## 一、團隊分工

組員 A：
- 網站基本架構
- 食譜匹配與推薦
- 排序及條件篩選
- 智慧補貨
- 採買清單
- 最終網站程式整合

組員 B：
- 正式冰箱管理模組
- 食材保存期限提醒
- 冰箱 localStorage
- 正式 CSS 與 RWD

組員 C：
- 正式食譜資料
- 料理步驟與分類
- 料理圖片及授權
- 食譜與採買情境測試

## 二、食材主檔

食材資料統一使用 ingredients.js，
依據組員 B 提供的 ingredient_master.xlsx 建立。

資料範例：

    {
        ingredient_id: "ING_001",
        ingredient_name: "番茄",
        category: "蔬菜",
        suggested_days: 7
    }

所有食材配對均以 ingredient_id 為準，
不得自行修改既有食材 ID。

## 三、冰箱庫存資料格式

A 版暫定介面如下：

    {
        id: "FRIDGE_001",
        ingredient_id: "ING_001",
        ingredient_name: "番茄",
        category: "蔬菜",
        expiryDate: "2026-11-14"
    }

欄位說明：

- id：每筆庫存紀錄的唯一 ID。
- ingredient_id：對應食材主檔 ID。
- ingredient_name：食材名稱。
- category：食材分類。
- expiryDate：到期日，格式為 YYYY-MM-DD。

未設定到期日使用空字串。

同一食材可以有多筆庫存紀錄，
但食譜配對時只計算一次。

若 B 的資料格式不同，
應先轉換資料，再傳入 A 的推薦模組。

## 四、食譜資料格式

正式食譜使用 recipes.js。

資料範例：

    {
        recipeId: "REC_001",
        name: "番茄炒蛋",
        requiredIngredients: [
            "ING_001",
            "ING_021"
        ],
        cookingTime: 10,
        difficulty: "簡單",
        dietTags: ["蛋奶素", "無肉"],
        steps: [
            "將番茄洗淨並切塊。",
            "將雞蛋打散。",
            "將食材炒熟。"
        ],
        image: "images/recipe-01.jpg"
    }

資料規則：

- recipeId 不得重複。
- requiredIngredients 使用食材 ID。
- cookingTime 必須使用數字，單位為分鐘。
- difficulty 暫定為簡單、中等、困難。
- dietTags 使用陣列及統一標籤。
- steps 使用字串陣列。
- image 使用相對路徑，沒有圖片時可留空。

目前五道料理僅供測試。
C 組員完成正式食譜後可替換 recipes.js。

正式食譜份量欄位與顯示方式，
由團隊整合時確認。

## 五、採買清單格式

    {
        ingredient_id: "ING_022",
        purchased: false
    }

ingredient_id：食材 ID。
purchased：是否已購買。

採買清單與冰箱庫存獨立管理。
勾選已購買不會自動增加冰箱庫存。

## 六、localStorage 規格

A 版目前使用：

- fridgeRescue_A_mock_v1
- fridgeRescue_A_shopping_v1

第一項為模擬冰箱專用。
第二項為採買清單專用。

B 的正式冰箱模組應使用獨立的儲存名稱，
避免覆蓋 A 的資料。

## 七、JavaScript 主要函式

| 函式 | 用途 |
|---|---|
| ingredientById() | 查詢食材主檔 |
| expiryStatus() | 判斷保存期限 |
| adaptFridgeItems() | 轉換冰箱資料 |
| availableInventory() | 取得可用食材 |
| matchRecipe() | 計算單道食譜匹配度 |
| calculateRecommendations() | 計算所有食譜推薦 |
| compareRecipes() | 推薦排序 |
| filterRecipes() | 條件篩選 |
| calculateRestock() | 智慧補貨統計 |
| mergeShopping() | 採買清單去重 |
| addToShopping() | 加入缺少食材 |
| copyShopping() | 複製採買清單 |
| renderRecipes() | 更新推薦畫面 |
| renderRestock() | 更新補貨畫面 |
| renderShopping() | 更新採買清單 |
| refresh() | 重新計算並更新畫面 |

## 八、HTML 主要元件 ID

| ID | 用途 |
|---|---|
| inventoryCount | 庫存食材數 |
| expiringCount | 即期食材數 |
| availableRecipeCount | 零採買料理數 |
| appMessage | 系統提示 |
| mockFridgePanel | 模擬冰箱 |
| timeFilter | 時間篩選 |
| difficultyFilter | 難度篩選 |
| dietFilter | 飲食偏好篩選 |
| zeroShopping | 零採買模式 |
| resetFiltersBtn | 重設篩選 |
| recipeCount | 符合條件料理數 |
| recipeList | 食譜推薦列表 |
| restockList | 智慧補貨列表 |
| shoppingList | 採買清單 |
| shoppingCount | 採買項目數 |
| purchasedCount | 已購買項目數 |
| copyShoppingBtn | 複製清單 |
| clearShoppingBtn | 清空清單 |
| copyFallback | 手動複製備援區 |
| shoppingCopyText | 採買清單文字 |
| recipeModal | 食譜詳情視窗 |
| recipeModalTitle | 食譜詳情標題 |
| recipeModalBody | 食譜詳情內容 |
| modalAddShoppingBtn | 詳情加入採買按鈕 |

修改 HTML 元件 ID 時，
必須同步確認 myScript.js 中的對應程式。

## 九、與組員 B 整合

A 版已提供庫存資料接入介面：

    FridgeRescue.setInventory(fridgeItems);

當 B 的冰箱庫存載入、新增、刪除或更新日期時，
可將轉換後的完整庫存陣列傳入上述函式。

注意：

- 必須在 A 的 JavaScript 初始化後呼叫。
- 此函式會更新推薦結果並隱藏模擬冰箱。
- A 不會直接修改 B 的正式冰箱 localStorage。
- 初次整合應先保留模擬冰箱的 HTML。
- 若要完全移除模擬冰箱 HTML，
  必須同步移除或修改 init() 中相關初始化、
  事件監聽及模擬冰箱程式，避免程式錯誤。

## 十、與組員 C 整合

1. 確認食譜資料欄位。
2. 確認所有必要食材 ID。
3. 將正式資料替換 recipes.js。
4. 將料理圖片放入 images/。
5. 確認圖片相對路徑。
6. 確認食譜份量、分類及授權資訊。
7. 重新執行配對、補貨及採買測試。

核心配對演算法原則上不需要重新撰寫。

## 十一、待團隊共同確認

- B 的正式庫存資料結構
- C 的正式食譜資料結構
- 飲食偏好與難度標籤
- 食譜份量資訊
- 正式 HTML 元件 ID
- CSS 與 Bootstrap 樣式整合
- 圖片與授權紀錄
- S3 部署安排

## 十二、整合注意事項

- 不重複宣告相同的 JavaScript 變數。
- 不使用重複的 HTML ID。
- 不使用相同的 localStorage key 儲存不同資料。
- 不任意修改食材 ID。
- 保持 JavaScript 載入順序。
- 正式整合後重新進行全站測試。
- 確認手機版及 Amazon S3 網站正常運作。

目前僅完成 A 版核心功能，
不代表三人團隊最終網站已完成。
