
"use strict";

// Fridge Rescue V2.0｜食材主檔
// 資料來源：組員 B 提供的 ingredient_master.xlsx
//
// ingredient_id：食材唯一 ID
// ingredient_name：食材名稱
// unit：推薦日常量詞
// category：食材分類
// suggested_days：建議保存天數
//
// 注意：unit 是日常計數單位，不代表標準重量。
// 例如「盒」、「包」、「瓶/罐」的實際容量可能不同。

const ingredients = [
    // ===== 蔬菜 =====
    {
        ingredient_id: "ING_001",
        ingredient_name: "番茄",
        unit: "顆",
        category: "蔬菜",
        suggested_days: 7
    },
    {
        ingredient_id: "ING_002",
        ingredient_name: "洋蔥",
        unit: "顆",
        category: "蔬菜",
        suggested_days: 14
    },
    {
        ingredient_id: "ING_003",
        ingredient_name: "高麗菜",
        unit: "顆",
        category: "蔬菜",
        suggested_days: 10
    },
    {
        ingredient_id: "ING_004",
        ingredient_name: "青江菜",
        unit: "把",
        category: "蔬菜",
        suggested_days: 4
    },
    {
        ingredient_id: "ING_005",
        ingredient_name: "胡蘿蔔",
        unit: "根",
        category: "蔬菜",
        suggested_days: 14
    },
    {
        ingredient_id: "ING_006",
        ingredient_name: "馬鈴薯",
        unit: "顆",
        category: "蔬菜",
        suggested_days: 14
    },
    {
        ingredient_id: "ING_007",
        ingredient_name: "花椰菜",
        unit: "顆",
        category: "蔬菜",
        suggested_days: 5
    },
    {
        ingredient_id: "ING_008",
        ingredient_name: "鴻喜菇",
        unit: "包",
        category: "蔬菜",
        suggested_days: 7
    },
    {
        ingredient_id: "ING_009",
        ingredient_name: "玉米筍",
        unit: "根",
        category: "蔬菜",
        suggested_days: 5
    },
    {
        ingredient_id: "ING_010",
        ingredient_name: "小黃瓜",
        unit: "條",
        category: "蔬菜",
        suggested_days: 5
    },
    {
        ingredient_id: "ING_011",
        ingredient_name: "青蔥",
        unit: "根",
        category: "蔬菜",
        suggested_days: 5
    },
    {
        ingredient_id: "ING_012",
        ingredient_name: "蒜頭",
        unit: "瓣",
        category: "蔬菜",
        suggested_days: 21
    },

    // ===== 肉類海鮮 =====
    {
        ingredient_id: "ING_013",
        ingredient_name: "雞胸肉",
        unit: "片",
        category: "肉類海鮮",
        suggested_days: 3
    },
    {
        ingredient_id: "ING_014",
        ingredient_name: "雞腿肉",
        unit: "塊",
        category: "肉類海鮮",
        suggested_days: 3
    },
    {
        ingredient_id: "ING_015",
        ingredient_name: "豬肉片",
        unit: "盒",
        category: "肉類海鮮",
        suggested_days: 3
    },
    {
        ingredient_id: "ING_016",
        ingredient_name: "豬絞肉",
        unit: "盒",
        category: "肉類海鮮",
        suggested_days: 2
    },
    {
        ingredient_id: "ING_017",
        ingredient_name: "牛肉片",
        unit: "盒",
        category: "肉類海鮮",
        suggested_days: 3
    },
    {
        ingredient_id: "ING_018",
        ingredient_name: "培根",
        unit: "片",
        category: "肉類海鮮",
        suggested_days: 7
    },
    {
        ingredient_id: "ING_019",
        ingredient_name: "鮭魚",
        unit: "片",
        category: "肉類海鮮",
        suggested_days: 2
    },
    {
        ingredient_id: "ING_020",
        ingredient_name: "蝦仁",
        unit: "隻",
        category: "肉類海鮮",
        suggested_days: 2
    },

    // ===== 蛋奶豆製品 =====
    {
        ingredient_id: "ING_021",
        ingredient_name: "雞蛋",
        unit: "顆",
        category: "蛋奶豆製品",
        suggested_days: 14
    },
    {
        ingredient_id: "ING_022",
        ingredient_name: "牛奶",
        unit: "瓶/罐",
        category: "蛋奶豆製品",
        suggested_days: 7
    },
    {
        ingredient_id: "ING_023",
        ingredient_name: "起司",
        unit: "片",
        category: "蛋奶豆製品",
        suggested_days: 14
    },
    {
        ingredient_id: "ING_024",
        ingredient_name: "嫩豆腐",
        unit: "盒",
        category: "蛋奶豆製品",
        suggested_days: 4
    },
    {
        ingredient_id: "ING_025",
        ingredient_name: "板豆腐",
        unit: "盒",
        category: "蛋奶豆製品",
        suggested_days: 4
    },
    {
        ingredient_id: "ING_026",
        ingredient_name: "無糖優格",
        unit: "杯",
        category: "蛋奶豆製品",
        suggested_days: 10
    },

    // ===== 主食 =====
    {
        ingredient_id: "ING_027",
        ingredient_name: "白飯",
        unit: "碗",
        category: "主食",
        suggested_days: 3
    },
    {
        ingredient_id: "ING_028",
        ingredient_name: "義大利麵",
        unit: "包",
        category: "主食",
        suggested_days: 30
    },
    {
        ingredient_id: "ING_029",
        ingredient_name: "烏龍麵",
        unit: "份",
        category: "主食",
        suggested_days: 5
    },
    {
        ingredient_id: "ING_030",
        ingredient_name: "吐司",
        unit: "片",
        category: "主食",
        suggested_days: 4
    }
];
