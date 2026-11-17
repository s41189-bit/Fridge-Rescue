
"use strict";

// Fridge Rescue V2.0
// 組員 C 食譜資料轉換程式
// 將 C 的欄位轉換成 A 的推薦系統可使用的格式。
// 不修改 C 原始的 recipes-c.js 檔案。

(function () {

    // 建立「食材名稱 → 食材 ID」對照表
    const ingredientMap = {};

    for (const item of ingredients) {
        ingredientMap[item.ingredient_name] = item.ingredient_id;
    }

    // 驗證並轉換單道食譜
    function convertRecipe(recipe) {

        const requiredIds = [];

        if (!Array.isArray(recipe.required_ingredients) ||
            recipe.required_ingredients.length === 0) {
            throw new Error("食譜必要食材資料無效：" + recipe.id);
        }

        for (const name of recipe.required_ingredients) {

            const id = ingredientMap[name];

            if (!id) {
                throw new Error(
                    "找不到對應食材：" + name +
                    "（食譜：" + recipe.id + "）"
                );
            }

            if (requiredIds.includes(id)) {
                throw new Error(
                    "食譜必要食材重複：" + name +
                    "（食譜：" + recipe.id + "）"
                );
            }

            requiredIds.push(id);
        }

        if (!Number.isFinite(recipe.time_minutes) ||
            recipe.time_minutes <= 0) {
            throw new Error("料理時間無效：" + recipe.id);
        }

        const validDiets = ["葷食", "蛋奶素", "全素"];

        if (!Array.isArray(recipe.diet) ||
            recipe.diet.length === 0 ||
            !recipe.diet.every(function (tag) {
                return validDiets.includes(tag);
            })) {
            throw new Error("飲食分類無效：" + recipe.id);
        }

        if (!["簡單", "中等", "困難"].includes(recipe.difficulty)) {
            throw new Error("料理難度無效：" + recipe.id);
        }

        return {
            recipeId: recipe.id,
            name: recipe.name,
            cookingTime: recipe.time_minutes,
            difficulty: recipe.difficulty,
            dietTags: recipe.diet.slice(),
            requiredIngredients: requiredIds,
            portions: recipe.portions || "",
            steps: recipe.steps,

            // 圖片尚未交付，暫時不顯示，
            // 避免網站出現破圖。
            image: ""
        };
    }

    // 驗證食譜總數
    if (recipes.length !== 30) {
        throw new Error(
            "正式食譜應為 30 道，目前為：" + recipes.length
        );
    }

    // 驗證食譜 ID 不重複
    const recipeIds = recipes.map(function (recipe) {
        return recipe.id;
    });

    if (new Set(recipeIds).size !== recipes.length) {
        throw new Error("食譜 ID 出現重複");
    }

    // 先全部轉換成功，才更新供 A 使用的資料
    const convertedRecipes = recipes.map(convertRecipe);

    // 保留 recipes 陣列名稱供 A 的 myScript.js 使用
    // 只替換執行時陣列內容，不改動 C 的原始檔案
    recipes.splice(0, recipes.length, ...convertedRecipes);

    console.log(
        "Fridge Rescue：已成功轉換 " +
        recipes.length + " 道正式食譜。"
    );

})();
