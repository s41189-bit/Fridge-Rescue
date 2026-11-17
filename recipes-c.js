// Fridge Rescue｜食譜資料（組員 C 維護）
// 版本：v0.3 共 30 道（草案，待小組確認；步驟文字由 AI 協助撰寫，需小組確認後才可標示為原創）
// 規則：required_ingredients 必須與 ingredient_master.xlsx 的 ingredient_name 完全一致。
//       鹽、油、醬油、胡椒、糖等調味料不列入必要食材（待 A/B 確認），只寫在步驟中。
// 時間定義（待團隊確認）：time_minutes 暫定為「備料＋烹調（含蒸、燉）」，不含選擇性等待（如冷藏入味）；等待時間寫在步驟中並標示【選擇性等待】。
// 食安溫度依據見 食安依據.md；步驟中的溫度為『有食物溫度計時』的參考值。
// 注意：本檔刻意維持「純 JSON 格式」（鍵名加雙引號、無結尾逗號），方便 scripts/recipes_tool.py 解析。
const recipes = [
  {
    "id": "recipe-01",
    "name": "番茄炒蛋",
    "time_minutes": 10,
    "difficulty": "簡單",
    "diet": [
      "蛋奶素"
    ],
    "required_ingredients": [
      "番茄",
      "雞蛋"
    ],
    "portions": "1–2 人份（雞蛋 2 顆、番茄 1 顆）",
    "steps": [
      "番茄洗淨切塊，雞蛋打入碗中，加少許鹽打散。",
      "熱鍋倒少許油，倒入蛋液，炒至半熟後先盛起。",
      "同一鍋放入番茄，炒至出汁變軟。",
      "倒回炒蛋拌炒均勻，依口味調味後即可起鍋。"
    ],
    "image": "images/recipe-01.jpg"
  },
  {
    "id": "recipe-02",
    "name": "起司歐姆蛋",
    "time_minutes": 8,
    "difficulty": "簡單",
    "diet": [
      "蛋奶素"
    ],
    "required_ingredients": [
      "雞蛋",
      "起司"
    ],
    "portions": "1 人份（雞蛋 2 顆、起司 1 片）",
    "steps": [
      "雞蛋打散，加少許鹽與胡椒調味。",
      "平底鍋抹薄油，轉小火倒入蛋液。",
      "蛋液快凝固時，在中間鋪上起司。",
      "用鍋鏟將蛋皮對折成半月形，煎至起司融化即可。"
    ],
    "image": "images/recipe-02.jpg"
  },
  {
    "id": "recipe-03",
    "name": "番茄起司烘蛋",
    "time_minutes": 15,
    "difficulty": "簡單",
    "diet": [
      "蛋奶素"
    ],
    "required_ingredients": [
      "雞蛋",
      "番茄",
      "起司"
    ],
    "portions": "2 人份（雞蛋 3 顆、番茄 1 顆、起司 2 片）",
    "steps": [
      "番茄切小丁，起司撕成小片或切碎。",
      "雞蛋打散，加入番茄丁、起司與少許鹽拌勻。",
      "平底鍋抹油，轉小火倒入蛋液，蓋上鍋蓋煎 5–6 分鐘。",
      "表面大致凝固後翻面，再煎約 2 分鐘，切塊享用。"
    ],
    "image": "images/recipe-03.jpg"
  },
  {
    "id": "recipe-04",
    "name": "蔥花蛋炒飯",
    "time_minutes": 10,
    "difficulty": "簡單",
    "diet": [
      "蛋奶素"
    ],
    "required_ingredients": [
      "白飯",
      "雞蛋",
      "青蔥"
    ],
    "portions": "1 人份（白飯 1 碗、雞蛋 2 顆、青蔥 1 根）",
    "steps": [
      "青蔥切成蔥花，雞蛋打散，白飯用筷子撥鬆。",
      "熱鍋下油，倒入蛋液，半熟時加入白飯一起翻炒。",
      "炒到飯粒分明、有鍋氣後，加鹽與少許醬油調味。",
      "起鍋前撒上蔥花拌勻即可。"
    ],
    "image": "images/recipe-04.jpg"
  },
  {
    "id": "recipe-05",
    "name": "洋蔥炒蛋",
    "time_minutes": 10,
    "difficulty": "簡單",
    "diet": [
      "蛋奶素"
    ],
    "required_ingredients": [
      "洋蔥",
      "雞蛋"
    ],
    "portions": "1–2 人份（洋蔥半顆、雞蛋 2 顆）",
    "steps": [
      "洋蔥去皮切絲，雞蛋打散加少許鹽。",
      "熱鍋下油，洋蔥絲炒至透明微焦、散出甜味。",
      "將洋蔥推到鍋邊，倒入蛋液炒至半熟。",
      "全部拌炒均勻，調味後盛盤。"
    ],
    "image": "images/recipe-05.jpg"
  },
  {
    "id": "recipe-06",
    "name": "起司吐司",
    "time_minutes": 5,
    "difficulty": "簡單",
    "diet": [
      "蛋奶素"
    ],
    "required_ingredients": [
      "吐司",
      "起司"
    ],
    "portions": "1 人份（吐司 2 片、起司 1–2 片）",
    "steps": [
      "吐司平放，在其中一片鋪上起司。",
      "蓋上另一片吐司，放入平底鍋以小火乾煎。",
      "兩面各煎約 1–2 分鐘，至金黃酥脆、起司融化。",
      "對切後趁熱享用。"
    ],
    "image": "images/recipe-06.jpg"
  },
  {
    "id": "recipe-07",
    "name": "法式吐司",
    "time_minutes": 10,
    "difficulty": "簡單",
    "diet": [
      "蛋奶素"
    ],
    "required_ingredients": [
      "吐司",
      "雞蛋",
      "牛奶"
    ],
    "portions": "1 人份（吐司 2 片、雞蛋 1 顆、牛奶 80 毫升）",
    "steps": [
      "雞蛋與牛奶攪拌均勻成蛋奶液。",
      "吐司兩面浸入蛋奶液，讓其吸飽。",
      "平底鍋抹薄油，小火煎至兩面金黃。",
      "切塊盛盤，可依喜好淋上蜂蜜或糖粉。"
    ],
    "image": "images/recipe-07.jpg"
  },
  {
    "id": "recipe-08",
    "name": "蒜香高麗菜",
    "time_minutes": 8,
    "difficulty": "簡單",
    "diet": [
      "全素"
    ],
    "required_ingredients": [
      "高麗菜",
      "蒜頭"
    ],
    "portions": "2 人份（高麗菜 1/4 顆、蒜頭 3 瓣）",
    "steps": [
      "高麗菜洗淨手撕成片，蒜頭拍扁切末。",
      "熱鍋下油，爆香蒜末至微黃。",
      "放入高麗菜大火快炒，淋少許水燜 1 分鐘。",
      "加鹽調味，炒至菜葉變軟即可。"
    ],
    "image": "images/recipe-08.jpg"
  },
  {
    "id": "recipe-09",
    "name": "蒜炒青江菜",
    "time_minutes": 6,
    "difficulty": "簡單",
    "diet": [
      "全素"
    ],
    "required_ingredients": [
      "青江菜",
      "蒜頭"
    ],
    "portions": "2 人份（青江菜 200 克、蒜頭 3 瓣）",
    "steps": [
      "青江菜洗淨切段，蒜頭切末。",
      "熱鍋下油，爆香蒜末。",
      "先下菜梗炒 30 秒，再下菜葉。",
      "加鹽調味，快炒至菜葉剛軟即可起鍋。"
    ],
    "image": "images/recipe-09.jpg"
  },
  {
    "id": "recipe-10",
    "name": "蒜香花椰菜炒玉米筍",
    "time_minutes": 12,
    "difficulty": "簡單",
    "diet": [
      "全素"
    ],
    "required_ingredients": [
      "花椰菜",
      "玉米筍",
      "蒜頭"
    ],
    "portions": "2 人份（花椰菜半顆、玉米筍 8 根、蒜頭 3 瓣）",
    "steps": [
      "花椰菜切小朵，玉米筍斜切段，蒜頭切末。",
      "花椰菜放入滾水汆燙 1 分鐘後撈起。",
      "熱鍋爆香蒜末，放入玉米筍炒 1 分鐘。",
      "加入花椰菜與少許水，加鹽拌炒至熟即可。"
    ],
    "image": "images/recipe-10.jpg"
  },
  {
    "id": "recipe-11",
    "name": "涼拌小黃瓜",
    "time_minutes": 5,
    "difficulty": "簡單",
    "diet": [
      "全素"
    ],
    "required_ingredients": [
      "小黃瓜",
      "蒜頭"
    ],
    "portions": "2 人份（小黃瓜 2 條、蒜頭 2 瓣）",
    "steps": [
      "小黃瓜洗淨，用刀背拍裂後切成小塊。",
      "蒜頭切末，與小黃瓜一起放入碗中。",
      "加入少許鹽、醬油與香油拌勻，即可食用（備料加拌製約 5 分鐘，即上方標示的料理時間）。",
      "【選擇性等待】想更入味，可再冷藏約 10 分鐘；這段是等待時間，不計入料理時間。"
    ],
    "image": "images/recipe-11.jpg"
  },
  {
    "id": "recipe-12",
    "name": "鴻喜菇炒青江菜",
    "time_minutes": 10,
    "difficulty": "簡單",
    "diet": [
      "全素"
    ],
    "required_ingredients": [
      "鴻喜菇",
      "青江菜",
      "蒜頭"
    ],
    "portions": "2 人份（鴻喜菇 1 包、青江菜 200 克、蒜頭 2 瓣）",
    "steps": [
      "鴻喜菇切除底部後剝散，青江菜切段，蒜頭切末。",
      "熱鍋下油，爆香蒜末，放入鴻喜菇炒到出水變軟。",
      "加入青江菜快炒 1–2 分鐘。",
      "加鹽調味，炒至菜葉剛軟即可。"
    ],
    "image": "images/recipe-12.jpg"
  },
  {
    "id": "recipe-13",
    "name": "馬鈴薯蔥蛋煎餅",
    "time_minutes": 15,
    "difficulty": "簡單",
    "diet": [
      "蛋奶素"
    ],
    "required_ingredients": [
      "馬鈴薯",
      "雞蛋",
      "青蔥"
    ],
    "portions": "2 人份（馬鈴薯 1 顆、雞蛋 1 顆、青蔥 1 根）",
    "steps": [
      "馬鈴薯去皮刨絲，泡水後瀝乾，青蔥切蔥花。",
      "馬鈴薯絲、雞蛋、蔥花與少許鹽拌勻。",
      "平底鍋抹油，將麵糊壓成薄餅狀，小火煎 3–4 分鐘。",
      "翻面再煎至兩面金黃酥脆即可。"
    ],
    "image": "images/recipe-13.jpg"
  },
  {
    "id": "recipe-14",
    "name": "馬鈴薯燉胡蘿蔔",
    "time_minutes": 25,
    "difficulty": "中等",
    "diet": [
      "全素"
    ],
    "required_ingredients": [
      "馬鈴薯",
      "胡蘿蔔",
      "洋蔥"
    ],
    "portions": "2–3 人份（馬鈴薯 2 顆、胡蘿蔔 1 根、洋蔥半顆）",
    "steps": [
      "馬鈴薯、胡蘿蔔滾刀切塊，洋蔥切丁。",
      "熱鍋下油，炒洋蔥至軟，加入馬鈴薯與胡蘿蔔略炒。",
      "加水至半淹過食材，加少許醬油與鹽，蓋鍋蓋燉煮。",
      "小火煮約 15–20 分鐘，至馬鈴薯鬆軟入味即可。"
    ],
    "image": "images/recipe-14.jpg"
  },
  {
    "id": "recipe-15",
    "name": "番茄豆腐湯",
    "time_minutes": 15,
    "difficulty": "簡單",
    "diet": [
      "全素"
    ],
    "required_ingredients": [
      "番茄",
      "嫩豆腐",
      "青蔥"
    ],
    "portions": "2 人份（番茄 1 顆、嫩豆腐 1 盒、青蔥 1 根）",
    "steps": [
      "番茄切塊，嫩豆腐切小塊，青蔥切蔥花。",
      "鍋中加少許油，炒番茄至出汁，加入約 500 毫升水煮滾。",
      "輕輕放入豆腐，小火煮 3–5 分鐘。",
      "加鹽調味，起鍋前撒上蔥花。"
    ],
    "image": "images/recipe-15.jpg"
  },
  {
    "id": "recipe-16",
    "name": "小黃瓜優格沙拉",
    "time_minutes": 5,
    "difficulty": "簡單",
    "diet": [
      "蛋奶素"
    ],
    "required_ingredients": [
      "小黃瓜",
      "無糖優格"
    ],
    "portions": "1–2 人份（小黃瓜 1 條、無糖優格 100 克）",
    "steps": [
      "小黃瓜洗淨切薄片，撒少許鹽靜置 3 分鐘，擠掉多餘水分。",
      "與無糖優格拌勻。",
      "依喜好加入黑胡椒調味。",
      "冷藏後享用，口感更清爽。"
    ],
    "image": "images/recipe-16.jpg"
  },
  {
    "id": "recipe-17",
    "name": "家常麻婆豆腐",
    "time_minutes": 20,
    "difficulty": "中等",
    "diet": [
      "葷食"
    ],
    "required_ingredients": [
      "板豆腐",
      "豬絞肉",
      "蒜頭",
      "青蔥"
    ],
    "portions": "2–3 人份（板豆腐 1 盒、豬絞肉 100 克、蒜頭 2 瓣、青蔥 1 根）",
    "steps": [
      "板豆腐切丁，蒜頭切末，青蔥切蔥花。",
      "熱鍋下油，炒豬絞肉至變色，加入蒜末爆香。",
      "加入醬油、少許糖與半碗水煮滾，放入豆腐小火煮 5 分鐘。",
      "以少許太白粉水勾薄芡，撒上蔥花即可。"
    ],
    "image": "images/recipe-17.jpg"
  },
  {
    "id": "recipe-18",
    "name": "嫩豆腐蒸蛋",
    "time_minutes": 15,
    "difficulty": "簡單",
    "diet": [
      "蛋奶素"
    ],
    "required_ingredients": [
      "嫩豆腐",
      "雞蛋",
      "青蔥"
    ],
    "portions": "2 人份（嫩豆腐 1 盒、雞蛋 2 顆、青蔥 1 根）",
    "steps": [
      "嫩豆腐壓成泥，與雞蛋、少許鹽及適量水拌勻。",
      "倒入耐熱的陶瓷或玻璃碗中。蓋上耐熱盤子即可；不建議用保鮮膜，若要使用，須確認包裝標示耐熱，並避免 PVC／PVDC 材質直接接觸食物。",
      "放入電鍋或蒸鍋，中小火蒸約 10–12 分鐘；蒸鍋需讓蒸氣有出口，勿完全密封。",
      "取出前確認中心已凝固、不再有流動的蛋液；有食物溫度計時，中心溫度需達 71°C（160°F）以上。",
      "撒上蔥花，淋少許醬油即可。"
    ],
    "image": "images/recipe-18.jpg"
  },
  {
    "id": "recipe-19",
    "name": "蒜香雞胸肉炒花椰菜",
    "time_minutes": 20,
    "difficulty": "簡單",
    "diet": [
      "葷食"
    ],
    "required_ingredients": [
      "雞胸肉",
      "花椰菜",
      "蒜頭"
    ],
    "portions": "2 人份（雞胸肉 1 片、花椰菜半顆、蒜頭 3 瓣）",
    "steps": [
      "雞胸肉切片，加少許鹽、醬油與太白粉抓醃 10 分鐘。",
      "花椰菜切小朵，汆燙 1 分鐘，蒜頭切末。",
      "熱鍋爆香蒜末，下雞胸肉炒至變白。",
      "加入花椰菜拌炒，調味後炒熟即可。"
    ],
    "image": "images/recipe-19.jpg"
  },
  {
    "id": "recipe-20",
    "name": "蔥爆豬肉片",
    "time_minutes": 12,
    "difficulty": "簡單",
    "diet": [
      "葷食"
    ],
    "required_ingredients": [
      "豬肉片",
      "青蔥",
      "洋蔥"
    ],
    "portions": "2 人份（豬肉片 150 克、青蔥 2 根、洋蔥半顆）",
    "steps": [
      "洋蔥切絲，青蔥切段，豬肉片用少許醬油抓醃。",
      "熱鍋下油，先炒洋蔥絲至軟。",
      "加入豬肉片炒至完全變色、不再有粉紅色，並切開最厚的一片確認中心已熟；有食物溫度計時，中心溫度需達 63°C（145°F）以上。",
      "加入蔥段，加醬油與少許糖拌炒均勻即可。"
    ],
    "image": "images/recipe-20.jpg"
  },
  {
    "id": "recipe-21",
    "name": "高麗菜炒培根",
    "time_minutes": 10,
    "difficulty": "簡單",
    "diet": [
      "葷食"
    ],
    "required_ingredients": [
      "培根",
      "高麗菜"
    ],
    "portions": "2 人份（培根 3 片、高麗菜 1/4 顆）",
    "steps": [
      "培根切小片，高麗菜手撕成片。",
      "冷鍋放入培根，小火煎出油脂至微焦。",
      "加入高麗菜大火快炒至變軟。",
      "培根已有鹹味，先試味道再決定是否加鹽，最後撒黑胡椒。"
    ],
    "image": "images/recipe-21.jpg"
  },
  {
    "id": "recipe-22",
    "name": "洋蔥炒牛肉片",
    "time_minutes": 12,
    "difficulty": "簡單",
    "diet": [
      "葷食"
    ],
    "required_ingredients": [
      "牛肉片",
      "洋蔥",
      "蒜頭"
    ],
    "portions": "2 人份（牛肉片 150 克、洋蔥半顆、蒜頭 2 瓣）",
    "steps": [
      "洋蔥切絲，蒜頭切末，牛肉片加少許醬油抓醃。",
      "熱鍋下油，爆香蒜末，加入洋蔥炒軟。",
      "放入牛肉片大火快炒至完全變色、不再有生肉的粉紅色；牛肉片薄，不必久炒，但須切開最厚的一片確認中心已熟。有食物溫度計時，中心溫度需達 63°C（145°F）以上。",
      "加黑胡椒與少許鹽調味即可。"
    ],
    "image": "images/recipe-22.jpg"
  },
  {
    "id": "recipe-23",
    "name": "蝦仁炒蛋",
    "time_minutes": 10,
    "difficulty": "簡單",
    "diet": [
      "葷食"
    ],
    "required_ingredients": [
      "蝦仁",
      "雞蛋",
      "青蔥"
    ],
    "portions": "2 人份（蝦仁 10 隻、雞蛋 3 顆、青蔥 1 根）",
    "steps": [
      "蝦仁洗淨瀝乾，加少許鹽與胡椒抓勻，青蔥切蔥花。",
      "雞蛋打散加入蔥花。",
      "熱鍋下油，蝦仁炒至變紅、肉質呈不透明的乳白色後盛起；有食物溫度計時，蝦仁中心溫度需達 63°C（145°F）以上。",
      "同鍋倒入蛋液，半熟時倒回蝦仁，繼續拌炒到蛋完全凝固、不再有流動的蛋液，調味即可。"
    ],
    "image": "images/recipe-23.jpg"
  },
  {
    "id": "recipe-24",
    "name": "香煎蒜蔥鮭魚",
    "time_minutes": 15,
    "difficulty": "簡單",
    "diet": [
      "葷食"
    ],
    "required_ingredients": [
      "鮭魚",
      "蒜頭",
      "青蔥"
    ],
    "portions": "1–2 人份（鮭魚 1 片、蒜頭 2 瓣、青蔥 1 根）",
    "steps": [
      "鮭魚用廚房紙巾擦乾，兩面撒少許鹽。",
      "平底鍋熱油，魚皮朝下，中火煎 3–4 分鐘。",
      "翻面再煎 2–3 分鐘，加入蒜末爆香。",
      "確認魚肉呈不透明、用叉子能輕易撥開；有食物溫度計時，最厚處中心溫度需達 63°C（145°F）以上。",
      "盛盤後撒上蔥花，淋少許醬油即可。"
    ],
    "image": "images/recipe-24.jpg"
  },
  {
    "id": "recipe-25",
    "name": "奶油培根義大利麵",
    "time_minutes": 20,
    "difficulty": "中等",
    "diet": [
      "葷食"
    ],
    "required_ingredients": [
      "義大利麵",
      "培根",
      "牛奶",
      "起司"
    ],
    "portions": "1–2 人份（義大利麵 100 克、培根 3 片、牛奶 150 毫升、起司 2 片）",
    "steps": [
      "義大利麵依包裝說明煮熟，撈起瀝乾；培根切小片。",
      "鍋中煎培根至出油，倒入牛奶小火煮滾。",
      "放入起司，攪拌至融化成醬。",
      "加入義大利麵拌勻，以鹽與黑胡椒調味。"
    ],
    "image": "images/recipe-25.jpg"
  },
  {
    "id": "recipe-26",
    "name": "燉雞腿肉馬鈴薯胡蘿蔔",
    "time_minutes": 35,
    "difficulty": "中等",
    "diet": [
      "葷食"
    ],
    "required_ingredients": [
      "雞腿肉",
      "馬鈴薯",
      "胡蘿蔔"
    ],
    "portions": "2–3 人份（雞腿肉 2 塊、馬鈴薯 2 顆、胡蘿蔔 1 根）",
    "steps": [
      "雞腿肉切塊，汆燙去血水；馬鈴薯、胡蘿蔔滾刀切塊。",
      "鍋中放入雞肉與蔬菜，加水至幾乎淹過食材。",
      "加醬油與少許糖，煮滾後轉小火燉 20–25 分鐘。",
      "至雞肉熟透、馬鈴薯鬆軟即可，記得確認雞肉熟透。"
    ],
    "image": "images/recipe-26.jpg"
  },
  {
    "id": "recipe-27",
    "name": "肉末蒸豆腐",
    "time_minutes": 15,
    "difficulty": "簡單",
    "diet": [
      "葷食"
    ],
    "required_ingredients": [
      "豬絞肉",
      "嫩豆腐",
      "青蔥"
    ],
    "portions": "2 人份（豬絞肉 100 克、嫩豆腐 1 盒、青蔥 1 根）",
    "steps": [
      "豬絞肉加醬油與少許胡椒拌勻，青蔥切蔥花。",
      "嫩豆腐放入盤中，鋪上肉末。",
      "放入電鍋或蒸鍋蒸約 10–12 分鐘，確認肉熟透。",
      "取出撒上蔥花即可。"
    ],
    "image": "images/recipe-27.jpg"
  },
  {
    "id": "recipe-28",
    "name": "蛋花烏龍湯麵",
    "time_minutes": 10,
    "difficulty": "簡單",
    "diet": [
      "蛋奶素"
    ],
    "required_ingredients": [
      "烏龍麵",
      "雞蛋",
      "青蔥"
    ],
    "portions": "1 人份（烏龍麵 1 份、雞蛋 1 顆、青蔥 1 根）",
    "steps": [
      "鍋中加水煮滾，放入烏龍麵煮至鬆開。",
      "加少許醬油與鹽調味。",
      "雞蛋打散，繞圈倒入湯中，靜置片刻再輕輕攪開成蛋花。",
      "盛碗，撒上蔥花。"
    ],
    "image": "images/recipe-28.jpg"
  },
  {
    "id": "recipe-29",
    "name": "高麗菜豬肉炒烏龍麵",
    "time_minutes": 15,
    "difficulty": "簡單",
    "diet": [
      "葷食"
    ],
    "required_ingredients": [
      "烏龍麵",
      "豬肉片",
      "高麗菜"
    ],
    "portions": "1–2 人份（烏龍麵 1 份、豬肉片 100 克、高麗菜 1/6 顆）",
    "steps": [
      "高麗菜切絲，豬肉片用少許醬油抓醃，烏龍麵用熱水沖散。",
      "熱鍋下油，炒豬肉片至完全變色、不再有粉紅色，並切開最厚的一片確認中心已熟；有食物溫度計時，中心溫度需達 63°C（145°F）以上。",
      "加入高麗菜炒軟，放入烏龍麵。",
      "加醬油與少許糖拌炒均勻即可。"
    ],
    "image": "images/recipe-29.jpg"
  },
  {
    "id": "recipe-30",
    "name": "番茄肉醬義大利麵",
    "time_minutes": 25,
    "difficulty": "中等",
    "diet": [
      "葷食"
    ],
    "required_ingredients": [
      "義大利麵",
      "豬絞肉",
      "番茄",
      "洋蔥"
    ],
    "portions": "2 人份（義大利麵 150 克、豬絞肉 120 克、番茄 2 顆、洋蔥半顆）",
    "steps": [
      "義大利麵依包裝說明煮熟；洋蔥切丁，番茄切小塊。",
      "熱鍋炒洋蔥至軟，加入豬絞肉炒至變色。",
      "加入番茄與少許水，小火煮 10 分鐘至濃稠，加鹽與黑胡椒調味。",
      "拌入煮好的義大利麵即可。"
    ],
    "image": "images/recipe-30.jpg"
  }
];

// 讓 Node／測試環境也能引用；瀏覽器中此段會被略過。
if (typeof module !== "undefined") { module.exports = recipes; }
