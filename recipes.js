// Fridge Rescue 食譜資料
// 來源：組員 C 的 recipes.js v0.3（草案，待小組確認），已轉成本專案格式。
// 步驟文字由 AI 協助撰寫，需小組確認後才可標示為原創。
//
// 轉換規則：
// - requiredIngredients 使用 ingredients.js 的食材 ID。
// - 調味料（鹽、油、醬油、胡椒、糖等）不列入必要食材，只寫在步驟中。
// - dietTags 依食材推算：全素、蛋奶素、無肉、無乳製品。
// - image 暫時留空（images/ 資料夾尚無圖片）。
// - photoLink：「參考照片」連結。照片版權屬原作者，網站不放圖，只附連結讓使用者到原頁面看。
// - REC_003（番茄起司烘蛋）與 REC_028（蛋花烏龍湯麵）已刪除，編號保留不補。
// - portions 為顯示用份量，與配對用的 requiredIngredients 分開。
// - source：參考來源。type 為 "synced" 表示步驟已依該來源改寫；
//   "reference" 表示僅供參考，步驟維持小組版本。
// - cookingTime 暫定為備料＋烹調（含蒸、燉），不含選擇性等待。
// - 食安溫度依 C 的『食安依據.md』，步驟中的溫度為有食物溫度計時的參考值。

const recipes = [
    {
        recipeId: "REC_001",
        name: "番茄炒蛋",
        requiredIngredients: ["ING_001", "ING_021"],
        cookingTime: 10,
        difficulty: "簡單",
        dietTags: ["蛋奶素", "無肉", "無乳製品"],
        portions: "1–2 人份（雞蛋 2 顆、番茄 1 顆）",
        steps: [
            "番茄洗淨切塊，雞蛋打入碗中，加少許鹽打散。",
            "熱鍋倒少許油，倒入蛋液，炒至半熟後先盛起。",
            "同一鍋放入番茄，炒至出汁變軟。",
            "倒回炒蛋拌炒均勻，依口味調味後即可起鍋。"
        ],
        source: {
            title: "愛料理｜番茄炒蛋 by 愛亂煮小娟（步驟為小組版本）",
            url: "https://icook.tw/recipes/400933",
            type: "reference"
        },
        photoLink: {
            title: "Cherry & Dennis｜番茄炒蛋",
            url: "https://goldendennis.com/recipe-tomato-scrambled-eggs.html"
        },
        image: ""
    },
    {
        recipeId: "REC_002",
        name: "起司歐姆蛋",
        requiredIngredients: ["ING_021", "ING_023"],
        cookingTime: 8,
        difficulty: "簡單",
        dietTags: ["蛋奶素", "無肉"],
        portions: "1 人份（雞蛋 2 顆、起司 1 片）",
        steps: [
            "雞蛋打到顏色稍微變白，加少許鹽拌勻，不加牛奶。",
            "平底鍋預熱後抹薄油，轉中小火倒入蛋液。",
            "邊緣一凝固，就用鍋鏟把蛋液往中間推，重複到蛋液幾乎不再流動。",
            "關火放上起司，將蛋對折，用餘溫讓起司融化後盛盤。確認蛋已凝固、不再有流動的蛋液。"
        ],
        source: {
            title: "商周 Smart 自學網｜黃金歐姆蛋",
            url: "https://smart.businessweekly.com.tw/Channel/IndepArticle.aspx?id=29482",
            type: "synced"
        },
        image: ""
    },
    {
        recipeId: "REC_004",
        name: "蔥花蛋炒飯",
        requiredIngredients: ["ING_027", "ING_021", "ING_011"],
        cookingTime: 10,
        difficulty: "簡單",
        dietTags: ["蛋奶素", "無肉", "無乳製品"],
        portions: "1 人份（白飯 1 碗、雞蛋 2 顆、青蔥 1 根）",
        steps: [
            "青蔥切成蔥花，雞蛋打散，白飯用筷子撥鬆。",
            "熱鍋下油，倒入蛋液，半熟時加入白飯一起翻炒。",
            "炒到飯粒分明、有鍋氣後，加鹽與少許醬油調味。",
            "起鍋前撒上蔥花拌勻即可。"
        ],
        source: {
            title: "愛料理｜蔥油蛋炒飯 by 新手人妻日常（步驟為小組版本）",
            url: "https://icook.tw/recipes/327975",
            type: "reference"
        },
        image: ""
    },
    {
        recipeId: "REC_005",
        name: "洋蔥炒蛋",
        requiredIngredients: ["ING_002", "ING_021"],
        cookingTime: 10,
        difficulty: "簡單",
        dietTags: ["蛋奶素", "無肉", "無乳製品"],
        portions: "1–2 人份（洋蔥半顆、雞蛋 2 顆）",
        steps: [
            "洋蔥去皮切絲，雞蛋打散加少許鹽。",
            "熱鍋下油，洋蔥炒到半透明、散出甜味。",
            "洋蔥推到鍋邊倒入蛋液，稍微凝固後與洋蔥拌炒到完全凝固。",
            "加鹽和少許黑胡椒調味，起鍋。"
        ],
        source: {
            title: "vocus｜洋蔥炒蛋",
            url: "https://vocus.cc/article/685b7b37fd89780001f03e1f",
            type: "synced"
        },
        image: ""
    },
    {
        recipeId: "REC_006",
        name: "起司吐司",
        requiredIngredients: ["ING_030", "ING_023"],
        cookingTime: 5,
        difficulty: "簡單",
        dietTags: ["蛋奶素", "無肉"],
        portions: "1 人份（吐司 2 片、起司 1–2 片）",
        steps: [
            "吐司平放，在其中一片鋪上起司。",
            "蓋上另一片吐司，放入平底鍋以小火乾煎。",
            "兩面各煎約 1–2 分鐘，至金黃酥脆、起司融化。",
            "對切後趁熱享用。"
        ],
        source: {
            title: "愛料理搜尋｜起司吐司（步驟為小組版本）",
            url: "https://icook.tw/search/%E8%B5%B7%E5%8F%B8%E5%9C%9F%E5%8F%B8/",
            type: "reference"
        },
        image: ""
    },
    {
        recipeId: "REC_007",
        name: "法式吐司",
        requiredIngredients: ["ING_030", "ING_021", "ING_022"],
        cookingTime: 10,
        difficulty: "簡單",
        dietTags: ["蛋奶素", "無肉"],
        portions: "1 人份（吐司 2 片、雞蛋 1 顆、牛奶 80 毫升）",
        steps: [
            "雞蛋與牛奶攪拌均勻成蛋奶液。",
            "吐司兩面浸入蛋奶液，讓其吸飽。",
            "平底鍋抹薄油，小火煎至兩面金黃。",
            "切塊盛盤，可依喜好淋上蜂蜜或糖粉。"
        ],
        source: {
            title: "Cookpad 搜尋｜法式吐司（步驟為小組版本）",
            url: "https://cookpad.com/tw/%E6%90%9C%E5%B0%8B/%E6%B3%95%E5%BC%8F%E5%90%90%E5%8F%B8",
            type: "reference"
        },
        image: ""
    },
    {
        recipeId: "REC_008",
        name: "蒜香高麗菜",
        requiredIngredients: ["ING_003", "ING_012"],
        cookingTime: 8,
        difficulty: "簡單",
        dietTags: ["全素", "蛋奶素", "無肉", "無乳製品"],
        portions: "2 人份（高麗菜 1/4 顆、蒜頭 3 瓣）",
        steps: [
            "高麗菜洗淨手撕成片，蒜頭拍扁切末。",
            "熱鍋下油，爆香蒜末至微黃。",
            "放入高麗菜大火快炒，淋少許水燜 1 分鐘。",
            "加鹽調味，炒至菜葉變軟即可。"
        ],
        source: {
            title: "愛料理｜蒜炒高麗菜 by Amy's Kitchen（步驟為小組版本）",
            url: "https://icook.tw/recipes/442617",
            type: "reference"
        },
        image: ""
    },
    {
        recipeId: "REC_009",
        name: "蒜炒青江菜",
        requiredIngredients: ["ING_004", "ING_012"],
        cookingTime: 6,
        difficulty: "簡單",
        dietTags: ["全素", "蛋奶素", "無肉", "無乳製品"],
        portions: "2 人份（青江菜 200 克、蒜頭 3 瓣）",
        steps: [
            "青江菜洗淨切段，蒜頭切末。",
            "熱鍋下油，爆香蒜末。",
            "先下菜梗炒 30 秒，再下菜葉。",
            "加鹽調味，快炒至菜葉剛軟即可起鍋。"
        ],
        source: {
            title: "愛料理｜蒜炒青江菜 by Kalu Tsai（步驟為小組版本）",
            url: "https://icook.tw/recipes/343604",
            type: "reference"
        },
        image: ""
    },
    {
        recipeId: "REC_010",
        name: "蒜香花椰菜炒玉米筍",
        requiredIngredients: ["ING_007", "ING_009", "ING_012"],
        cookingTime: 12,
        difficulty: "簡單",
        dietTags: ["全素", "蛋奶素", "無肉", "無乳製品"],
        portions: "2 人份（花椰菜半顆、玉米筍 8 根、蒜頭 3 瓣）",
        steps: [
            "花椰菜切小朵，玉米筍斜切段，蒜頭切末。",
            "花椰菜放入滾水汆燙 1 分鐘後撈起。",
            "熱鍋爆香蒜末，放入玉米筍炒 1 分鐘。",
            "加入花椰菜與少許水，加鹽拌炒至熟即可。"
        ],
        source: {
            title: "Cookpad 搜尋｜蒜炒花椰菜玉米筍（步驟為小組版本）",
            url: "https://cookpad.com/tw/%E6%90%9C%E5%B0%8B/%E8%92%9C%E7%82%92%E8%8A%B1%E6%A4%B0%E8%8F%9C%E7%8E%89%E7%B1%B3%E7%AD%8D",
            type: "reference"
        },
        image: ""
    },
    {
        recipeId: "REC_011",
        name: "涼拌小黃瓜",
        requiredIngredients: ["ING_010", "ING_012"],
        cookingTime: 5,
        difficulty: "簡單",
        dietTags: ["全素", "蛋奶素", "無肉", "無乳製品"],
        portions: "2 人份（小黃瓜 2 條、蒜頭 2 瓣）",
        steps: [
            "小黃瓜洗淨，用刀背拍裂後切成小塊。",
            "蒜頭切末，與小黃瓜一起放入碗中。",
            "加入少許鹽、醬油與香油拌勻，即可食用（備料加拌製約 5 分鐘，即上方標示的料理時間）。",
            "【選擇性等待】想更入味，可再冷藏約 10 分鐘；這段是等待時間，不計入料理時間。"
        ],
        source: {
            title: "愛料理搜尋｜涼拌小黃瓜（步驟為小組版本）",
            url: "https://icook.tw/search/%E6%B6%BC%E6%8B%8C%E5%B0%8F%E9%BB%83%E7%93%9C/",
            type: "reference"
        },
        image: ""
    },
    {
        recipeId: "REC_012",
        name: "鴻喜菇炒青江菜",
        requiredIngredients: ["ING_008", "ING_004", "ING_012"],
        cookingTime: 10,
        difficulty: "簡單",
        dietTags: ["全素", "蛋奶素", "無肉", "無乳製品"],
        portions: "2 人份（鴻喜菇 1 包、青江菜 200 克、蒜頭 2 瓣）",
        steps: [
            "鴻喜菇切除底部後剝散，青江菜切段，蒜頭切末。",
            "熱鍋下油，爆香蒜末，放入鴻喜菇炒到出水變軟。",
            "加入青江菜快炒 1–2 分鐘。",
            "加鹽調味，炒至菜葉剛軟即可。"
        ],
        source: {
            title: "Cookidoo｜青江菜炒鴻喜菇（僅食材與時間，步驟需登入）",
            url: "https://cookidoo.international/recipes/recipe/en/r62726",
            type: "reference"
        },
        image: ""
    },
    {
        recipeId: "REC_013",
        name: "馬鈴薯蔥蛋煎餅",
        requiredIngredients: ["ING_006", "ING_021", "ING_011"],
        cookingTime: 15,
        difficulty: "簡單",
        dietTags: ["蛋奶素", "無肉", "無乳製品"],
        portions: "2 人份（馬鈴薯 1 顆、雞蛋 1 顆、青蔥 1 根）",
        steps: [
            "馬鈴薯去皮刨絲，泡水後瀝乾，青蔥切蔥花。",
            "馬鈴薯絲、雞蛋、蔥花與少許鹽拌勻。",
            "平底鍋抹油，將麵糊壓成薄餅狀，小火煎 3–4 分鐘。",
            "翻面再煎至兩面金黃酥脆即可。"
        ],
        source: {
            title: "Daydaycook｜Scallion Potato Egg Pancake（來源另加麵粉，步驟為小組版本）",
            url: "https://www.daydaycook.com/en/recipe/scallion-potato-egg-pancake",
            type: "reference"
        },
        image: ""
    },
    {
        recipeId: "REC_014",
        name: "馬鈴薯燉胡蘿蔔",
        requiredIngredients: ["ING_006", "ING_005", "ING_002"],
        cookingTime: 25,
        difficulty: "中等",
        dietTags: ["全素", "蛋奶素", "無肉", "無乳製品"],
        portions: "2–3 人份（馬鈴薯 2 顆、胡蘿蔔 1 根、洋蔥半顆）",
        steps: [
            "馬鈴薯、胡蘿蔔滾刀切塊，洋蔥切丁。",
            "熱鍋下油，炒洋蔥至軟，加入馬鈴薯與胡蘿蔔略炒。",
            "加水至半淹過食材，加少許醬油與鹽，蓋鍋蓋燉煮。",
            "小火煮約 15–20 分鐘，至馬鈴薯鬆軟入味即可。"
        ],
        source: {
            title: "Cookpad 搜尋｜燉馬鈴薯紅蘿蔔（步驟為小組版本）",
            url: "https://cookpad.com/tw/%E6%90%9C%E5%B0%8B/%E7%87%89%E9%A6%AC%E9%88%B4%E8%96%AF%E7%B4%85%E8%98%BF%E8%94%94",
            type: "reference"
        },
        image: ""
    },
    {
        recipeId: "REC_015",
        name: "番茄豆腐湯",
        requiredIngredients: ["ING_001", "ING_024", "ING_011"],
        cookingTime: 15,
        difficulty: "簡單",
        dietTags: ["全素", "蛋奶素", "無肉", "無乳製品"],
        portions: "2 人份（番茄 1 顆、嫩豆腐 1 盒、青蔥 1 根）",
        steps: [
            "番茄切塊，嫩豆腐切小塊，青蔥切蔥花。",
            "鍋中加少許油，炒番茄到出汁，加水約 500 毫升煮滾。",
            "放入豆腐，轉小火煮 3–5 分鐘。",
            "加鹽調味，起鍋前撒蔥花。"
        ],
        source: {
            title: "星島健康｜番茄豆腐湯（劉博仁醫師食譜）",
            url: "https://www.stheadline.com/health-care/3501715/",
            type: "synced"
        },
        image: ""
    },
    {
        recipeId: "REC_016",
        name: "小黃瓜優格沙拉",
        requiredIngredients: ["ING_010", "ING_026"],
        cookingTime: 5,
        difficulty: "簡單",
        dietTags: ["蛋奶素", "無肉"],
        portions: "1–2 人份（小黃瓜 1 條、無糖優格 100 克）",
        steps: [
            "小黃瓜洗淨切薄片，撒少許鹽靜置 3 分鐘，擠掉多餘水分。",
            "與無糖優格拌勻。",
            "依喜好加入黑胡椒調味。",
            "冷藏後享用，口感更清爽。"
        ],
        source: {
            title: "Cookpad 搜尋｜小黃瓜優格沙拉（步驟為小組版本）",
            url: "https://cookpad.com/tw/%E6%90%9C%E5%B0%8B/%E5%B0%8F%E9%BB%83%E7%93%9C%E5%84%AA%E6%A0%BC%E6%B2%99%E6%8B%89",
            type: "reference"
        },
        photoLink: {
            title: "愛料理｜希臘式優格小黃瓜醬（Tzatziki）by KOKO好食光",
            url: "https://icook.tw/recipes/309113"
        },
        image: ""
    },
    {
        recipeId: "REC_017",
        name: "家常麻婆豆腐",
        requiredIngredients: ["ING_025", "ING_016", "ING_012", "ING_011"],
        cookingTime: 20,
        difficulty: "中等",
        dietTags: ["無乳製品"],
        portions: "2–3 人份（板豆腐 1 盒、豬絞肉 100 克、蒜頭 2 瓣、青蔥 1 根）",
        steps: [
            "板豆腐切丁，蒜頭切末，青蔥切蔥花。",
            "煮滾鹽水，放入豆腐，水再滾就撈起，避免煮碎。",
            "中火爆香蒜末，炒豬絞肉到變色，加醬油、米酒與豆瓣醬（選用）炒香。",
            "放入豆腐輕推，加半碗水煮滾，小火煮約 3 分鐘，以太白粉水勾薄芡，撒蔥花，淋少許香油。"
        ],
        source: {
            title: "vocus｜淡口版麻婆豆腐",
            url: "https://vocus.cc/article/6481933bfd897800015e63fe",
            type: "synced"
        },
        image: ""
    },
    {
        recipeId: "REC_018",
        name: "嫩豆腐蒸蛋",
        requiredIngredients: ["ING_024", "ING_021", "ING_011"],
        cookingTime: 20,
        difficulty: "簡單",
        dietTags: ["蛋奶素", "無肉", "無乳製品"],
        portions: "2 人份（嫩豆腐 1 盒、雞蛋 2 顆、青蔥 1 根）",
        steps: [
            "雞蛋打散，加蛋液約 1.5 倍的冷水與少許鹽拌勻，用細篩過濾至少一次。",
            "嫩豆腐壓碎，拌入蛋液。",
            "倒入耐熱的陶瓷或玻璃碗中。蓋上耐熱盤子即可；不建議用保鮮膜，若要使用，須確認包裝標示耐熱，並避免 PVC／PVDC 材質直接接觸食物。",
            "水滾後放入電鍋或蒸鍋，中火蒸約 15 分鐘；蒸鍋需讓蒸氣有出口，勿完全密封。",
            "取出前確認中心已凝固、不再有流動的蛋液；有食物溫度計時，中心溫度需達 71°C（160°F）以上。",
            "撒上蔥花，淋少許醬油即可。"
        ],
        source: {
            title: "TVBS 健康｜豆腐蒸蛋",
            url: "https://health.tvbs.com.tw/nutrition/355727",
            type: "synced"
        },
        photoLink: {
            title: "愛料理｜豆腐蒸蛋 by Katie",
            url: "https://icook.tw/recipes/436733"
        },
        image: ""
    },
    {
        recipeId: "REC_019",
        name: "蒜香雞胸肉炒花椰菜",
        requiredIngredients: ["ING_013", "ING_007", "ING_012"],
        cookingTime: 20,
        difficulty: "簡單",
        dietTags: ["無乳製品"],
        portions: "2 人份（雞胸肉 1 片、花椰菜半顆、蒜頭 3 瓣）",
        steps: [
            "雞胸肉切片，加少許鹽、醬油與太白粉抓醃 10 分鐘。",
            "花椰菜切小朵，汆燙 1 分鐘，蒜頭切末。",
            "熱鍋爆香蒜末，下雞胸肉炒至變白。",
            "加入花椰菜拌炒，調味後炒熟即可。"
        ],
        source: {
            title: "愛料理搜尋｜雞胸肉炒花椰菜（步驟為小組版本）",
            url: "https://icook.tw/search/%E9%9B%9E%E8%83%B8%E8%82%89%E7%82%92%E8%8A%B1%E6%A4%B0%E8%8F%9C/",
            type: "reference"
        },
        image: ""
    },
    {
        recipeId: "REC_020",
        name: "蔥爆豬肉片",
        requiredIngredients: ["ING_015", "ING_011", "ING_002"],
        cookingTime: 12,
        difficulty: "簡單",
        dietTags: ["無乳製品"],
        portions: "2 人份（豬肉片 150 克、青蔥 2 根、洋蔥半顆）",
        steps: [
            "洋蔥切絲，青蔥切段，豬肉片用少許醬油抓醃。",
            "熱鍋下油，先炒洋蔥絲至軟。",
            "加入豬肉片炒至完全變色、不再有粉紅色，並切開最厚的一片確認中心已熟；有食物溫度計時，中心溫度需達 63°C（145°F）以上。",
            "加入蔥段，加醬油與少許糖拌炒均勻即可。"
        ],
        source: {
            title: "YouTube｜蔥爆豬肉 家常快炒（步驟為小組版本）",
            url: "https://www.youtube.com/watch?v=dcl4r6Z8erI",
            type: "reference"
        },
        image: ""
    },
    {
        recipeId: "REC_021",
        name: "高麗菜炒培根",
        requiredIngredients: ["ING_018", "ING_003"],
        cookingTime: 10,
        difficulty: "簡單",
        dietTags: ["無乳製品"],
        portions: "2 人份（培根 3 片、高麗菜 1/4 顆）",
        steps: [
            "培根切小片，高麗菜手撕成片。",
            "熱鍋不加油，放入培根煎到微上色、出油。",
            "加入高麗菜，蓋鍋燜約 2 分鐘，開蓋翻炒到變軟。",
            "培根已有鹹味，先試味道再決定是否加鹽，最後撒黑胡椒。"
        ],
        source: {
            title: "TVBS 健康｜培根高麗菜",
            url: "https://health.tvbs.com.tw/nutrition/345152",
            type: "synced"
        },
        photoLink: {
            title: "愛料理｜家常料理-培根炒高麗菜 by 艾咪的實驗廚房",
            url: "https://icook.tw/recipes/331387"
        },
        image: ""
    },
    {
        recipeId: "REC_022",
        name: "洋蔥炒牛肉片",
        requiredIngredients: ["ING_017", "ING_002", "ING_012"],
        cookingTime: 12,
        difficulty: "簡單",
        dietTags: ["無乳製品"],
        portions: "2 人份（牛肉片 150 克、洋蔥半顆、蒜頭 2 瓣）",
        steps: [
            "洋蔥切絲，蒜頭切末，牛肉片加少許醬油抓醃。",
            "熱鍋下油，爆香蒜末，加入洋蔥炒軟。",
            "放入牛肉片大火快炒至完全變色、不再有生肉的粉紅色；牛肉片薄，不必久炒，但須切開最厚的一片確認中心已熟。有食物溫度計時，中心溫度需達 63°C（145°F）以上。",
            "加黑胡椒與少許鹽調味即可。"
        ],
        source: {
            title: "Cookpad 搜尋｜洋蔥炒牛肉（步驟為小組版本）",
            url: "https://cookpad.com/tw/%E6%90%9C%E5%B0%8B/%E6%B4%8B%E8%94%A5%E7%82%92%E7%89%9B%E8%82%89",
            type: "reference"
        },
        image: ""
    },
    {
        recipeId: "REC_023",
        name: "蝦仁炒蛋",
        requiredIngredients: ["ING_020", "ING_021", "ING_011"],
        cookingTime: 10,
        difficulty: "簡單",
        dietTags: ["無乳製品"],
        portions: "2 人份（蝦仁 10 隻、雞蛋 3 顆、青蔥 1 根）",
        steps: [
            "蝦仁洗淨瀝乾，加少許鹽與胡椒抓勻，青蔥切蔥花。",
            "雞蛋打散加入蔥花。",
            "熱鍋下油，蝦仁炒至變紅、肉質呈不透明的乳白色後盛起；有食物溫度計時，蝦仁中心溫度需達 63°C（145°F）以上。",
            "同鍋倒入蛋液，半熟時倒回蝦仁，繼續拌炒到蛋完全凝固、不再有流動的蛋液，調味即可。"
        ],
        source: {
            title: "愛料理搜尋｜蝦仁炒蛋（步驟為小組版本）",
            url: "https://icook.tw/search/%E8%9D%A6%E4%BB%81%E7%82%92%E8%9B%8B/",
            type: "reference"
        },
        image: ""
    },
    {
        recipeId: "REC_024",
        name: "香煎蒜蔥鮭魚",
        requiredIngredients: ["ING_019", "ING_012", "ING_011"],
        cookingTime: 15,
        difficulty: "簡單",
        dietTags: ["無乳製品"],
        portions: "1–2 人份（鮭魚 1 片、蒜頭 2 瓣、青蔥 1 根）",
        steps: [
            "鮭魚用廚房紙巾擦乾，兩面薄撒鹽；蒜頭切片，青蔥切段。",
            "平底鍋中高火熱 1 大匙油，魚皮朝下放入，用鍋鏟輕壓，轉中火煎約 5 分鐘到皮金黃；魚排較薄時時間要縮短。",
            "翻面再煎約 1 分鐘，確認魚肉呈不透明、用叉子能輕易撥開；有食物溫度計時，最厚處中心溫度需達 63°C（145°F）以上。",
            "小鍋加 2 大匙油，中火煎蒜片到邊緣微焦。魚上鋪青蔥，淋上蒜油與少許醬油即可。"
        ],
        source: {
            title: "Omnivore's Cookbook｜Salmon with Ginger Soy Sauce",
            url: "https://omnivorescookbook.com/salmon-with-ginger-soy-sauce/",
            type: "synced"
        },
        image: ""
    },
    {
        recipeId: "REC_025",
        name: "奶油培根義大利麵",
        requiredIngredients: ["ING_028", "ING_018", "ING_022", "ING_023"],
        cookingTime: 20,
        difficulty: "中等",
        dietTags: [],
        portions: "1–2 人份（義大利麵 100 克、培根 3 片、牛奶 150 毫升、起司 2 片）",
        steps: [
            "義大利麵依包裝說明煮熟，撈起瀝乾；培根切小片。",
            "鍋中煎培根至出油，倒入牛奶小火煮滾。",
            "放入起司，攪拌至融化成醬。",
            "加入義大利麵拌勻，以鹽與黑胡椒調味。"
        ],
        source: {
            title: "Cookpad 搜尋｜奶油義大利麵（步驟為小組版本）",
            url: "https://cookpad.com/tw/%E6%90%9C%E5%B0%8B/%E5%A5%B6%E6%B2%B9%E7%BE%A9%E5%A4%A7%E5%88%A9%E9%BA%B5",
            type: "reference"
        },
        image: ""
    },
    {
        recipeId: "REC_026",
        name: "燉雞腿肉馬鈴薯胡蘿蔔",
        requiredIngredients: ["ING_014", "ING_006", "ING_005"],
        cookingTime: 35,
        difficulty: "中等",
        dietTags: ["無乳製品"],
        portions: "2–3 人份（雞腿肉 2 塊、馬鈴薯 2 顆、胡蘿蔔 1 根）",
        steps: [
            "雞腿肉切塊，汆燙去血水；馬鈴薯、胡蘿蔔滾刀切塊。",
            "鍋中放入雞肉與蔬菜，加水至幾乎淹過食材。",
            "加醬油與少許糖，煮滾後轉小火燉 20–25 分鐘。",
            "至雞肉熟透、馬鈴薯鬆軟即可，記得確認雞肉熟透。"
        ],
        source: {
            title: "Flambo｜日式馬鈴薯燉雞腿（步驟為小組版本）",
            url: "https://flambo.com.tw/blogs/recipes/%E9%A6%AC%E9%88%B4%E8%96%AF%E7%87%89%E5%B0%8F%E9%9B%9E%E8%85%BF-chicken-stew-with-potato",
            type: "reference"
        },
        photoLink: {
            title: "愛料理｜馬鈴薯紅蘿蔔燉雞肉 by Mia Li（開箱文頁面）",
            url: "https://icook.tw/products/kimlanfoods/experiences/1406"
        },
        image: ""
    },
    {
        recipeId: "REC_027",
        name: "肉末蒸豆腐",
        requiredIngredients: ["ING_016", "ING_024", "ING_011"],
        cookingTime: 15,
        difficulty: "簡單",
        dietTags: ["無乳製品"],
        portions: "2 人份（豬絞肉 100 克、嫩豆腐 1 盒、青蔥 1 根）",
        steps: [
            "豬絞肉加醬油與少許胡椒拌勻，青蔥切蔥花。",
            "嫩豆腐放入盤中，鋪上肉末。",
            "放入電鍋或蒸鍋蒸約 10–12 分鐘，確認肉熟透。",
            "取出撒上蔥花即可。"
        ],
        source: {
            title: "Cookpad 搜尋｜肉末豆腐蒸（步驟為小組版本）",
            url: "https://cookpad.com/tw/%E6%90%9C%E5%B0%8B/%E8%82%89%E6%9C%AB%E8%B1%86%E8%85%90%E8%92%B8",
            type: "reference"
        },
        image: ""
    },
    {
        recipeId: "REC_029",
        name: "高麗菜豬肉炒烏龍麵",
        requiredIngredients: ["ING_029", "ING_015", "ING_003"],
        cookingTime: 15,
        difficulty: "簡單",
        dietTags: ["無乳製品"],
        portions: "1–2 人份（烏龍麵 1 份、豬肉片 100 克、高麗菜 1/6 顆）",
        steps: [
            "高麗菜切片；豬肉片加醬油、少許糖與太白粉抓醃；烏龍麵泡開後瀝乾。",
            "中火熱鍋，豬肉炒到完全變色，切開最厚的一片確認中心已熟；有食物溫度計時，中心溫度需達 63°C（145°F）以上，先盛起。",
            "同鍋加少許油，放入高麗菜與烏龍麵，加醬油、少許糖與約 120 毫升水，蓋鍋中火燜約 3 分鐘。",
            "翻拌均勻，豬肉回鍋，轉大火炒到醬汁收乾即可。"
        ],
        source: {
            title: "懶媽媽開飯啦｜炒烏冬麵",
            url: "https://lazymomcookbook.blogspot.com/2017/07/how-to-fry-udon-noodles.html",
            type: "synced"
        },
        image: ""
    },
    {
        recipeId: "REC_030",
        name: "番茄肉醬義大利麵",
        requiredIngredients: ["ING_028", "ING_016", "ING_001", "ING_002"],
        cookingTime: 25,
        difficulty: "中等",
        dietTags: ["無乳製品"],
        portions: "2 人份（義大利麵 150 克、豬絞肉 120 克、番茄 2 顆、洋蔥半顆）",
        steps: [
            "義大利麵依包裝說明煮熟；洋蔥切丁，番茄切小塊。",
            "熱鍋炒洋蔥至軟，加入豬絞肉炒至變色。",
            "加入番茄與少許水，小火煮 10 分鐘至濃稠，加鹽與黑胡椒調味。",
            "拌入煮好的義大利麵即可。"
        ],
        source: {
            title: "Cookidoo｜番茄肉醬義大利麵（僅食材與時間，步驟需登入）",
            url: "https://cookidoo.com.au/recipes/recipe/en-AU/r795168",
            type: "reference"
        },
        image: ""
    }
];
