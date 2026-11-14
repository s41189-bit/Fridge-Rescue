// Fridge Rescue 測試食譜資料
// 此檔案僅供組員 A 開發與功能測試
// 未來由組員 C 的正式食譜取代

const recipes = [
    {
        recipeId: "REC_001",
        name: "番茄炒蛋",
        requiredIngredients: ["ING_001", "ING_021"],
        cookingTime: 10,
        difficulty: "簡單",
        dietTags: ["蛋奶素", "無肉", "無乳製品"],
        steps: [
            "將番茄洗淨並切塊。",
            "將雞蛋打入碗中攪拌均勻。",
            "熱鍋加油，將雞蛋炒至凝固後盛起。",
            "炒熟番茄，再加入雞蛋拌炒。",
            "確認食材熟透後即可盛盤。"
        ],
        image: ""
    },
    {
        recipeId: "REC_002",
        name: "起司歐姆蛋",
        requiredIngredients: ["ING_021", "ING_023"],
        cookingTime: 15,
        difficulty: "簡單",
        dietTags: ["蛋奶素", "無肉"],
        steps: [
            "將雞蛋打散。",
            "熱鍋加油，倒入蛋液。",
            "加入起司。",
            "將蛋對折並加熱至熟透。",
            "起司融化後即可盛盤。"
        ],
        image: ""
    },
    {
        recipeId: "REC_003",
        name: "番茄起司烘蛋",
        requiredIngredients: [
            "ING_001",
            "ING_021",
            "ING_023"
        ],
        cookingTime: 25,
        difficulty: "中等",
        dietTags: ["蛋奶素", "無肉"],
        steps: [
            "將番茄切塊。",
            "將雞蛋打散並加入番茄。",
            "倒入適合烘烤的容器。",
            "在表面放上起司。",
            "放入預熱至180°C的烤箱，烘烤至蛋液完全凝固。"
        ],
        image: ""
    },
    {
        recipeId: "REC_004",
        name: "牛奶蒸蛋",
        requiredIngredients: ["ING_021", "ING_022"],
        cookingTime: 20,
        difficulty: "簡單",
        dietTags: ["蛋奶素", "無肉"],
        steps: [
            "將雞蛋打散。",
            "加入適量牛奶並攪拌均勻。",
            "將蛋液倒入耐熱容器。",
            "以電鍋或蒸鍋加熱。",
            "確認蛋液完全凝固後即可食用。"
        ],
        image: ""
    },
    {
        recipeId: "REC_005",
        name: "法式吐司",
        requiredIngredients: [
            "ING_021",
            "ING_022",
            "ING_030"
        ],
        cookingTime: 15,
        difficulty: "簡單",
        dietTags: ["蛋奶素", "無肉"],
        steps: [
            "將雞蛋與牛奶混合。",
            "將吐司浸入蛋奶液。",
            "熱鍋並加入少量植物油。",
            "將吐司兩面煎至金黃色並熟透。",
            "盛盤後即可享用。"
        ],
        image: ""
    }
];
