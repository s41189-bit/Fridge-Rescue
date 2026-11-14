# Fridge Rescue
智慧冰箱剩食推薦與保鮮管家

## 一、專案介紹

本網站以「先看冰箱，再決定料理」為核心概念，
透過現有食材進行料理推薦、智慧補貨及採買決策，
降低下廚的決策成本並減少食物浪費。

目前版本為組員 A 的 P0 核心功能開發測試版，
尚未整合組員 B 與 C 的正式成果。

## 二、目前已完成功能

- 智慧食譜推薦
- 食材匹配度計算
- 過期食材排除
- 即期食材優先排序
- 料理時間篩選
- 料理難度篩選
- 飲食偏好篩選
- 零採買模式
- 智慧補貨推薦
- 一鍵採買清單
- 採買清單去重、勾選、刪除與複製
- localStorage 本機資料儲存
- 模擬冰箱測試功能
- 食譜詳情視窗

## 三、使用技術

- HTML5
- CSS3
- JavaScript
- Bootstrap 5.3.3
- localStorage

本網站為純前端靜態網站，
不需要後端伺服器、會員系統或外部資料庫。

## 四、檔案說明

| 檔案 | 用途 |
|---|---|
| index.html | 網站主要架構 |
| mystyle.css | 暫時測試版樣式 |
| myScript.js | 核心功能與互動邏輯 |
| ingredients.js | 食材主檔 |
| recipes.js | 五道測試食譜 |
| images/ | 未來存放正式料理圖片 |
| README.md | 專案操作說明 |
| INTEGRATION.md | 團隊整合規格 |

## 五、操作方式

1. 開啟 index.html。
2. 點擊「載入測試資料」。
3. 查看食譜推薦及匹配度。
4. 嘗試修改食材到期日。
5. 切換料理篩選與零採買模式。
6. 查看智慧補貨推薦。
7. 將缺少食材加入採買清單。
8. 測試勾選、刪除及複製清單。
9. 重新整理網頁，確認資料保留。

Bootstrap 使用 CDN，需要網路連線。
本機資料保存與複製功能可能受瀏覽器設定影響。

## 六、課堂技術應用對照表

| 技術 | 實際應用 | 程式檔案 | 技術來源 |
|---|---|---|---|
| HTML Form | 食材輸入表單 | index.html | 課堂教材 |
| Select / Option | 食材與料理篩選 | index.html | 課堂教材 |
| Checkbox | 零採買與採買清單 | index.html、myScript.js | 課堂教材 |
| Input Date | 食材到期日 | index.html、myScript.js | 課堂教材 |
| CSS Selector | 元件樣式 | mystyle.css | 課堂教材 |
| Box Model | 卡片間距與邊框 | mystyle.css | 課堂教材 |
| Flexbox | 採買清單與元件排版 | mystyle.css | 課堂教材 |
| Media Query | 手機版基本樣式 | mystyle.css | 課堂教材 |
| JavaScript Array | 食材與食譜資料 | ingredients.js、recipes.js | 課堂教材 |
| JavaScript Object | 庫存與食譜資料結構 | myScript.js | 課堂教材 |
| Function | 核心功能模組 | myScript.js | 課堂教材 |
| for / if | 食材配對與補貨計算 | myScript.js | 課堂教材 |
| Date | 保存期限判斷 | expiryStatus() | 課堂教材 |
| DOM | 動態更新網頁 | renderRecipes() 等 | 課堂教材 |
| Bootstrap Navbar | 網站導覽 | index.html | 課堂教材 |
| Bootstrap Card | 食譜推薦卡片 | myScript.js | 課堂教材 |
| Bootstrap Badge | 食材狀態及零採買 | myScript.js | 課堂教材 |
| Bootstrap Modal | 食譜詳情 | index.html、myScript.js | 課堂教材 |
| Bootstrap Alert | 系統提示 | index.html、myScript.js | 課堂教材 |
| localStorage | 本機資料保存 | myScript.js | 專案延伸 |
| JSON | 資料轉換及保存 | myScript.js | 專案延伸 |
| Set | 食材去重 | myScript.js | 專案延伸 |
| Clipboard API | 複製採買清單 | copyShopping() | 專案延伸 |

## 七、功能驗收紀錄

以下為 A 版開發者的瀏覽器操作驗收紀錄。

| 測試項目 | 預期結果 | 實際結果 | 狀態 |
|---|---|---|---|
| 網頁載入 | 正常顯示 | 正常 | 通過 |
| 食材匹配 | 番茄炒蛋 100% | 一致 | 通過 |
| 今天到期 | 黃燈 | 一致 | 通過 |
| 過期食材 | 紅燈且排除配對 | 一致 | 通過 |
| 即期優先 | 優先推薦相關料理 | 一致 | 通過 |
| 零採買模式 | 只顯示全齊料理 | 一致 | 通過 |
| 時間篩選 | 顯示符合時間的料理 | 一致 | 通過 |
| 智慧補貨 | 起司解鎖兩道料理 | 一致 | 通過 |
| 食譜詳情 | 顯示料理步驟 | 一致 | 通過 |
| 採買去重 | 牛奶只出現一次 | 一致 | 通過 |
| 採買勾選 | 可切換購買狀態 | 正常 | 通過 |
| 採買複製 | 可複製文字 | 正常 | 通過 |
| 採買刪除 | 可刪除項目 | 正常 | 通過 |
| 採買清單保存 | 重新整理仍保留 | 正常 | 通過 |

難度與飲食偏好的個別瀏覽器測試、
完整邊界測試、跨裝置及手機版測試，
仍待後續驗收。

## 八、後續待完成項目

- 整合 B 的正式冰箱管理模組
- 整合 B 的正式 CSS 與 RWD
- 替換 C 的正式食譜及料理圖片
- 確認團隊統一資料格式
- 全站功能驗收
- Amazon S3 部署

P1 料理抽籤機、料理後庫存更新及 P2 功能，
不包含在本次 A 版 P0 開發範圍。

## 九、注意事項

食譜匹配僅判斷必要食材是否存在，
不計算重量與份量。

保存期限提醒僅反映使用者輸入的日期，
不代表食品安全鑑定。

目前五道食譜僅供開發測試，
未來由組員 C 的正式原創食譜取代。
