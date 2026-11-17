
"use strict";

// Fridge Rescue V2.0
// 推薦、篩選、補貨、採買清單、抽籤、數量與手動扣庫存
// 保留原本 localStorage Key 與 FridgeRescue 對外介面

(function () {
    const FRIDGE_KEY = "fridgeRescue_A_mock_v1";
    const SHOP_KEY = "fridgeRescue_A_shopping_v1";
    const $ = id => document.getElementById(id);

    let storageError = false;
    let fridgeItems = readStorage(FRIDGE_KEY);
    let shoppingList = readStorage(SHOP_KEY);
    let results = [];
    let currentRecipeId = "";
    let cookingRecipeId = "";
    let mockMode = true;

    // ==========================================
    // 1. 共用工具
    // ==========================================

    function ingredientById(id) {
        return ingredients.find(item => item.ingredient_id === id);
    }

    function ingredientName(id) {
        const item = ingredientById(id);
        return item ? item.ingredient_name : id;
    }

    function names(ids) {
        return ids.map(ingredientName).join("、") || "無";
    }

    function escapeHTML(value) {
        return String(value == null ? "" : value)
            .replace(/[&<>"']/g, char => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[char]));
    }

    function readStorage(key) {
        try {
            const data = JSON.parse(localStorage.getItem(key));
            return Array.isArray(data) ? data : [];
        } catch (error) {
            storageError = true;
            return [];
        }
    }

    function saveStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            storageError = true;
            return false;
        }
    }

    function message(text, type = "success") {
        if (storageError) {
            text += "（本機儲存曾發生錯誤，請確認瀏覽器設定。）";
            type = "warning";
        }

        $("appMessage").innerHTML =
            `<div class="alert alert-${type}">${escapeHTML(text)}</div>`;
    }

    function cookingMessage(text, type = "warning") {
        $("cookingInventoryMessage").innerHTML = text
            ? `<div class="alert alert-${type} py-2">${escapeHTML(text)}</div>`
            : "";
    }

    // ==========================================
    // 2. 日期與保存期限
    // ==========================================

    function localDate(date) {
        return date.getFullYear() + "-" +
            String(date.getMonth() + 1).padStart(2, "0") + "-" +
            String(date.getDate()).padStart(2, "0");
    }

    function dayNumber(value) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return NaN;
        }

        const parts = value.split("-").map(Number);
        const date = new Date(0);

        date.setUTCFullYear(
            parts[0],
            parts[1] - 1,
            parts[2]
        );

        if (
            date.getUTCFullYear() !== parts[0] ||
            date.getUTCMonth() + 1 !== parts[1] ||
            date.getUTCDate() !== parts[2]
        ) {
            return NaN;
        }

        return date.getTime() / 86400000;
    }

    function expiryStatus(
        expiryDate,
        today = localDate(new Date())
    ) {
        if (!expiryDate) {
            return {
                days: null,
                color: "secondary",
                text: "未設定期限",
                usable: true,
                urgent: false
            };
        }

        const days =
            dayNumber(expiryDate) - dayNumber(today);

        if (!Number.isFinite(days)) {
            return {
                days: null,
                color: "danger",
                text: "日期無效",
                usable: false,
                urgent: false
            };
        }

        if (days < 0) {
            return {
                days,
                color: "danger",
                text: `已逾期 ${-days} 天`,
                usable: false,
                urgent: false
            };
        }

        if (days <= 3) {
            return {
                days,
                color: "warning",
                text: days === 0
                    ? "今天到期"
                    : `剩餘 ${days} 天`,
                usable: true,
                urgent: true
            };
        }

        return {
            days,
            color: "success",
            text: `剩餘 ${days} 天`,
            usable: true,
            urgent: false
        };
    }

    // ==========================================
    // 3. 數量與單位
    // ==========================================

    function validQuantity(value) {
        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return null;
        }

        if (
            typeof value !== "number" &&
            typeof value !== "string"
        ) {
            return null;
        }

        const number = Number(value);

        return Number.isFinite(number) && number > 0
            ? number
            : null;
    }

    function ingredientUnit(id) {
        const item = ingredientById(id);

        return item && typeof item.unit === "string"
            ? item.unit
            : "";
    }

    function displayQuantity(item) {
        const quantity = validQuantity(item.quantity);

        if (quantity === null) {
            return "數量未設定";
        }

        const unit =
            item.unit || ingredientUnit(item.ingredient_id);

        return String(quantity) +
            (unit ? " " + unit : "");
    }

    function updateUnitPreview() {
        $("ingredientUnit").value =
            ingredientUnit($("ingredientSelect").value);
    }

    function adaptFridgeItems(items) {
        if (!Array.isArray(items)) {
            return [];
        }

        return items
            .filter(item =>
                item && ingredientById(item.ingredient_id)
            )
            .map((item, index) => {
                const master =
                    ingredientById(item.ingredient_id);

                return {
                    id: String(
                        item.id == null
                            ? "row_" + index
                            : item.id
                    ),
                    ingredient_id: master.ingredient_id,
                    ingredient_name: master.ingredient_name,
                    category: master.category,
                    expiryDate: item.expiryDate || "",
                    quantity: validQuantity(item.quantity),
                    unit: master.unit || ""
                };
            });
    }

    function availableInventory(items, today) {
        const available = {};

        for (const item of items) {
            const status =
                expiryStatus(item.expiryDate, today);

            if (!status.usable) {
                continue;
            }

            const id = item.ingredient_id;

            if (
                !available[id] ||
                (
                    status.urgent &&
                    (
                        !available[id].urgent ||
                        status.days < available[id].days
                    )
                )
            ) {
                available[id] = status;
            }
        }

        return available;
    }

    // ==========================================
    // 4. 食譜配對
    // ==========================================

    function matchRecipe(recipe, available) {
        const required = Array.from(new Set(
            Array.isArray(recipe.requiredIngredients)
                ? recipe.requiredIngredients
                : []
        ));

        const ownedIngredients = [];
        const missingIngredients = [];
        const urgentIngredients = [];

        let earliestDays = Infinity;

        for (const id of required) {
            if (
                Object.prototype.hasOwnProperty.call(
                    available,
                    id
                )
            ) {
                ownedIngredients.push(id);

                if (available[id].urgent) {
                    urgentIngredients.push(id);

                    earliestDays = Math.min(
                        earliestDays,
                        available[id].days
                    );
                }
            } else {
                missingIngredients.push(id);
            }
        }

        const valid = required.length > 0;

        const canCook =
            valid && missingIngredients.length === 0;

        const ratio = valid
            ? ownedIngredients.length / required.length
            : 0;

        const matchPercent = canCook
            ? 100
            : Math.min(99, Math.round(ratio * 100));

        return {
            recipe,
            valid,
            canCook,
            ratio,
            matchPercent,
            ownedIngredients,
            missingIngredients,
            urgentIngredients,
            earliestDays
        };
    }

    function calculateRecommendations(
        items,
        recipeData,
        today = localDate(new Date())
    ) {
        const available = availableInventory(
            adaptFridgeItems(items),
            today
        );

        return recipeData.map(recipe =>
            matchRecipe(recipe, available)
        );
    }

    // ==========================================
    // 5. 排序與篩選
    // ==========================================

    function compareRecipes(a, b) {
        if (a.canCook !== b.canCook) {
            return a.canCook ? -1 : 1;
        }

        if (a.earliestDays !== b.earliestDays) {
            return a.earliestDays < b.earliestDays
                ? -1
                : 1;
        }

        if (
            a.urgentIngredients.length !==
            b.urgentIngredients.length
        ) {
            return b.urgentIngredients.length -
                a.urgentIngredients.length;
        }

        if (a.ratio !== b.ratio) {
            return b.ratio - a.ratio;
        }

        if (
            a.recipe.cookingTime !==
            b.recipe.cookingTime
        ) {
            return a.recipe.cookingTime -
                b.recipe.cookingTime;
        }

        return String(a.recipe.recipeId).localeCompare(
            String(b.recipe.recipeId)
        );
    }

    function filterRecipes(data, filters) {
        return data.filter(r => {
            if (filters.zero && !r.canCook) {
                return false;
            }

            if (
                filters.time !== "all" &&
                r.recipe.cookingTime > Number(filters.time)
            ) {
                return false;
            }

            if (
                filters.difficulty !== "all" &&
                r.recipe.difficulty !== filters.difficulty
            ) {
                return false;
            }

            if (
                filters.diet !== "all" &&
                !r.recipe.dietTags.includes(filters.diet)
            ) {
                return false;
            }

            return true;
        }).sort(compareRecipes);
    }

    // ==========================================
    // 6. 智慧補貨
    // ==========================================

    function calculateRestock(data) {
        const groups = {};

        for (const r of data) {
            if (
                !r.valid ||
                r.missingIngredients.length !== 1
            ) {
                continue;
            }

            const id = r.missingIngredients[0];

            if (!groups[id]) {
                groups[id] = {
                    ingredient_id: id,
                    recipeNames: [],
                    recipeIds: []
                };
            }

            if (
                !groups[id].recipeIds.includes(
                    r.recipe.recipeId
                )
            ) {
                groups[id].recipeIds.push(
                    r.recipe.recipeId
                );

                groups[id].recipeNames.push(
                    r.recipe.name
                );
            }
        }

        return Object.values(groups).sort((a, b) =>
            b.recipeIds.length - a.recipeIds.length ||
            a.ingredient_id.localeCompare(b.ingredient_id)
        );
    }

    // ==========================================
    // 7. 冰箱畫面
    // ==========================================

    function renderFridge() {
        if (!mockMode) {
            return;
        }

        $("mockFridgeList").innerHTML =
            fridgeItems.map((item, index) => {
                const status =
                    expiryStatus(item.expiryDate);

                return `
                    <div class="fridge-item">

                        <div class="d-flex flex-wrap align-items-center gap-2">
                            <strong>
                                ${escapeHTML(item.ingredient_name)}
                            </strong>

                            <span class="badge bg-${status.color}
                                ${status.color === "warning"
                                    ? "text-dark"
                                    : ""}">
                                ${escapeHTML(status.text)}
                            </span>
                        </div>

                        <div class="small text-muted mt-1">
                            數量：
                            <strong>
                                ${escapeHTML(displayQuantity(item))}
                            </strong>
                        </div>

                        <div class="d-flex gap-2 mt-2">

                            <input
                                type="date"
                                class="form-control form-control-sm"
                                aria-label="${escapeHTML(item.ingredient_name)}到期日"
                                data-date="${index}"
                                value="${escapeHTML(item.expiryDate)}">

                            <button
                                type="button"
                                class="btn btn-outline-danger btn-sm"
                                data-remove="${index}">
                                刪除
                            </button>
                        </div>
                    </div>
                `;
            }).join("") ||
            '<p class="text-muted">目前沒有食材。</p>';
    }

    function currentFilteredRecipes() {
        return filterRecipes(results, {
            time: $("timeFilter").value,
            difficulty: $("difficultyFilter").value,
            diet: $("dietFilter").value,
            zero: $("zeroShopping").checked
        });
    }

    // ==========================================
    // 8. 料理抽籤
    // ==========================================

    function drawRandomRecipe() {
        const candidates = currentFilteredRecipes();
        const notice = $("randomRecipeMessage");

        if (candidates.length === 0) {
            if (notice) {
                notice.textContent =
                    "目前沒有符合條件的料理，請試著放寬篩選條件。";
            }

            return;
        }

        if (notice) {
            notice.textContent = "";
        }

        const index = Math.floor(
            Math.random() * candidates.length
        );

        showRecipe(
            candidates[index].recipe.recipeId
        );
    }

    // ==========================================
    // 9. 食譜列表
    // ==========================================

    function renderRecipes() {
        const filtered = currentFilteredRecipes();

        if ($("randomRecipeMessage")) {
            $("randomRecipeMessage").textContent = "";
        }

        $("recipeCount").textContent =
            filtered.length;

        $("recipeList").innerHTML =
            filtered.map(r => {
                const recipe = r.recipe;

                return `
                    <div class="col-md-6">

                        <article class="card recipe-card">

                            <div class="card-body">

                                ${recipe.image ? `
                                    <img
                                        class="recipe-image mb-3"
                                        src="${escapeHTML(recipe.image)}"
                                        alt="${escapeHTML(recipe.name)}">
                                ` : ""}

                                <h3>
                                    ${escapeHTML(recipe.name)}
                                </h3>

                                <p class="text-muted">
                                    ${recipe.cookingTime} 分鐘｜
                                    ${escapeHTML(recipe.difficulty)}
                                </p>

                                <p>
                                    <strong>
                                        匹配度：${r.matchPercent}%
                                    </strong>

                                    ${r.canCook
                                        ? '<span class="badge bg-success">零採買</span>'
                                        : ""}
                                </p>

                                <div
                                    class="progress mb-3"
                                    role="progressbar"
                                    aria-label="食材匹配度"
                                    aria-valuenow="${r.matchPercent}"
                                    aria-valuemin="0"
                                    aria-valuemax="100">

                                    <div
                                        class="progress-bar bg-success"
                                        style="width:${r.matchPercent}%">
                                    </div>
                                </div>

                                <p class="owned-ingredients">
                                    已具備：
                                    ${escapeHTML(names(r.ownedIngredients))}
                                </p>

                                <p class="missing-ingredients">
                                    缺少：
                                    ${escapeHTML(names(r.missingIngredients))}
                                </p>

                                ${r.urgentIngredients.length ? `
                                    <p class="text-warning-emphasis">
                                        即期食材：
                                        ${escapeHTML(names(r.urgentIngredients))}
                                    </p>
                                ` : ""}

                                ${!r.valid
                                    ? '<p class="text-danger">必要食材尚未設定</p>'
                                    : ""}

                                <div class="d-flex gap-2 flex-wrap">

                                    <button
                                        type="button"
                                        class="btn btn-outline-success btn-sm"
                                        data-detail="${escapeHTML(recipe.recipeId)}">
                                        食譜詳情
                                    </button>

                                    <button
                                        type="button"
                                        class="btn btn-success btn-sm"
                                        data-add="${escapeHTML(recipe.recipeId)}"
                                        ${!r.valid || r.canCook
                                            ? "disabled"
                                            : ""}>
                                        加入採買清單
                                    </button>
                                </div>
                            </div>
                        </article>
                    </div>
                `;
            }).join("") || `
                <div class="col-12">
                    <div class="alert alert-info">
                        沒有符合條件的料理，請放寬篩選條件。
                    </div>
                </div>
            `;
    }

    // ==========================================
    // 10. 智慧補貨畫面
    // ==========================================

    function renderRestock() {
        $("restockList").innerHTML =
            calculateRestock(results).map(group => `
                <div class="restock-item">

                    <strong>
                        補買
                        ${escapeHTML(ingredientName(group.ingredient_id))}，
                        可額外解鎖
                        ${group.recipeIds.length}
                        道料理。
                    </strong>

                    <p class="mb-0 mt-2">
                        ${escapeHTML(group.recipeNames.join("、"))}
                    </p>
                </div>
            `).join("") ||
            '<p class="text-muted">目前沒有只需補買一項即可解鎖的料理。</p>';
    }

    // ==========================================
    // 11. 更新畫面
    // ==========================================

    function refresh() {
        results = calculateRecommendations(
            fridgeItems,
            recipes
        );

        $("inventoryCount").textContent =
            new Set(
                fridgeItems.map(item =>
                    item.ingredient_id
                )
            ).size;

        $("expiringCount").textContent =
            Object.values(
                availableInventory(fridgeItems)
            ).filter(status => status.urgent).length;

        $("availableRecipeCount").textContent =
            results.filter(r => r.canCook).length;

        renderFridge();
        renderRecipes();
        renderRestock();
    }

    function updateMockInventory(items) {
        const next = adaptFridgeItems(items);

        if (!saveStorage(FRIDGE_KEY, next)) {
            fridgeItems = next;
            refresh();

            message(
                "目前已更新庫存畫面，但未能儲存。",
                "warning"
            );

            return;
        }

        fridgeItems = next;
        refresh();
    }

    // ==========================================
    // 12. 食譜詳情
    // ==========================================

    function showRecipe(id) {
        const result = results.find(item =>
            item.recipe.recipeId === id
        );

        if (!result) {
            return;
        }

        currentRecipeId = id;
        const recipe = result.recipe;

        $("recipeModalTitle").textContent =
            recipe.name;

        $("recipeModalBody").innerHTML = `

            <p>
                ${recipe.cookingTime} 分鐘｜
                ${escapeHTML(recipe.difficulty)}｜
                匹配度 ${result.matchPercent}%
            </p>

            ${recipe.image ? `
                <img
                    class="img-fluid mb-3"
                    src="${escapeHTML(recipe.image)}"
                    alt="${escapeHTML(recipe.name)}">
            ` : ""}

            ${recipe.portions ? `
                <p>
                    <strong>建議份量：</strong>
                    ${escapeHTML(recipe.portions)}
                </p>
            ` : ""}

            <p>
                必要食材：
                ${escapeHTML(names(recipe.requiredIngredients || []))}
            </p>

            <p>
                已具備：
                ${escapeHTML(names(result.ownedIngredients))}
            </p>

            <p>
                缺少：
                ${escapeHTML(names(result.missingIngredients))}
            </p>

            ${!result.valid ? `
                <p class="text-danger">
                    必要食材尚未設定，無法判定是否可料理。
                </p>
            ` : ""}

            <h3 class="h5">
                料理步驟
            </h3>

            <ol>
                ${(recipe.steps || []).map(step =>
                    `<li>${escapeHTML(step)}</li>`
                ).join("")}
            </ol>

            <small class="text-muted">
                食譜份量僅供參考；匹配度依食材種類計算，
                不代表庫存數量足夠。
                請自行確認食材狀態、常備調味料及料理安全。
            </small>
        `;

        $("modalAddShoppingBtn").disabled =
            !result.valid || result.canCook;

        // 種類齊全才開放完成料理。
        // 是否有可扣除的數量，於下一個視窗核對。
        $("completeRecipeBtn").disabled =
            !mockMode || !result.canCook;

        $("completeRecipeBtn").title =
            !mockMode
                ? "外部庫存無法直接在此寫回"
                : !result.canCook
                    ? "需要先具備所有必要食材"
                    : "手動選擇批次與使用數量";

        if (window.bootstrap && bootstrap.Modal) {
            bootstrap.Modal.getOrCreateInstance(
                $("recipeModal")
            ).show();

        } else {
            alert(
                recipe.name +
                "\n匹配度：" +
                result.matchPercent + "%" +
                (recipe.portions
                    ? "\n建議份量：" + recipe.portions
                    : "") +
                "\n必要食材：" +
                names(recipe.requiredIngredients || []) +
                "\n已具備：" +
                names(result.ownedIngredients) +
                "\n缺少：" +
                names(result.missingIngredients) +
                "\n" +
                (recipe.steps || []).join("\n") +
                "\n（更新庫存功能需要 Bootstrap 視窗元件）"
            );
        }
    }

    // ==========================================
    // 13. 完成料理：建立扣庫存表單
    // ==========================================

    function openCookingInventory() {
        if (
            !mockMode ||
            !window.bootstrap ||
            !bootstrap.Modal
        ) {
            return;
        }

        const result = results.find(item =>
            item.recipe.recipeId === currentRecipeId
        );

        if (!result || !result.canCook) {
            return;
        }

        cookingRecipeId = currentRecipeId;

        $("cookingRecipeName").textContent =
            "料理：" + result.recipe.name;

        cookingMessage("");

        const required = Array.from(new Set(
            result.recipe.requiredIngredients || []
        ));

        const blocks = [];
        let usableCount = 0;

        for (const id of required) {
            // 找出這道料理所需食材的所有庫存批次
            const batches = fridgeItems
                .map((item, index) => ({
                    item,
                    index
                }))
                .filter(row =>
                    row.item.ingredient_id === id
                );

            const rows = batches.map(({ item, index }) => {
                const status =
                    expiryStatus(item.expiryDate);

                const quantity =
                    validQuantity(item.quantity);

                // 未過期且已設定有效數量才可以扣除
                const usable =
                    status.usable && quantity !== null;

                if (usable) {
                    usableCount++;
                }

                let explanation = "";

                if (!status.usable) {
                    explanation =
                        "（已過期或日期無效，不可扣除）";
                } else if (quantity === null) {
                    explanation =
                        "（數量未設定，不可扣除）";
                }

                return `
                    <div class="row g-2 align-items-center border-bottom py-2">

                        <div class="col-sm-8">

                            <div class="small">
                                ${escapeHTML(item.ingredient_name)}
                                ｜批次 ${index + 1}
                            </div>

                            <div class="small text-muted">
                                庫存：
                                ${escapeHTML(displayQuantity(item))}
                                ｜
                                ${escapeHTML(status.text)}
                                ${escapeHTML(explanation)}
                            </div>
                        </div>

                        <div class="col-sm-4">

                            <label
                                class="visually-hidden"
                                for="cookingUse${index}">
                                使用數量：
                                ${escapeHTML(item.ingredient_name)}
                                批次 ${index + 1}
                            </label>

                            <input
                                type="number"
                                id="cookingUse${index}"
                                class="form-control form-control-sm"
                                data-use-index="${index}"
                                min="0"
                                step="any"
                                value="0"
                                ${usable
                                    ? `max="${quantity}"`
                                    : "disabled"}
                                aria-label="${escapeHTML(item.ingredient_name)}批次 ${index + 1}使用數量">
                        </div>
                    </div>
                `;
            }).join("");

            blocks.push(`
                <section class="mb-3">

                    <h4 class="h6 fw-bold">
                        ${escapeHTML(ingredientName(id))}
                    </h4>

                    ${rows ||
                        '<p class="text-danger small">沒有可使用的庫存批次。</p>'}
                </section>
            `);
        }

        $("cookingInventoryList").innerHTML =
            blocks.join("");

        $("confirmCookingBtn").disabled =
            usableCount === 0;

        if (usableCount === 0) {
            cookingMessage(
                "目前沒有已設定數量且未過期的庫存批次可供扣除。"
            );
        }

        // 避免 Bootstrap 同時開啟兩個視窗。
        // 先關閉食譜詳情，再開啟庫存更新視窗。
        const detail = $("recipeModal");

        detail.addEventListener(
            "hidden.bs.modal",
            function openOnce() {
                detail.removeEventListener(
                    "hidden.bs.modal",
                    openOnce
                );

                bootstrap.Modal.getOrCreateInstance(
                    $("cookingInventoryModal")
                ).show();
            }
        );

        bootstrap.Modal.getOrCreateInstance(
            detail
        ).hide();
    }

    // ==========================================
    // 14. 完成料理：驗證並正式扣除庫存
    // ==========================================

    function submitCookingInventory(event) {
        event.preventDefault();

        if (!mockMode || !cookingRecipeId) {
            return;
        }

        const result = results.find(item =>
            item.recipe.recipeId === cookingRecipeId
        );

        if (!result || !result.canCook) {
            cookingMessage(
                "目前庫存狀態已變更，請重新開啟食譜。",
                "danger"
            );

            return;
        }

        const inputs = Array.from(
            $("cookingInventoryList")
                .querySelectorAll("[data-use-index]")
        );

        const deductions = [];

        for (const input of inputs) {

            // 無效批次的欄位不可操作，也不會扣除
            if (input.disabled) {
                continue;
            }

            const index =
                Number(input.dataset.useIndex);

            const row =
                fridgeItems[index];

            const raw =
                input.value.trim();

            const amount =
                Number(raw);

            if (
                !row ||
                raw === "" ||
                !Number.isFinite(amount) ||
                amount < 0
            ) {
                cookingMessage(
                    "請輸入有效且不小於 0 的使用數量。",
                    "danger"
                );

                return;
            }

            if (
                !result.recipe.requiredIngredients.includes(
                    row.ingredient_id
                ) ||
                !expiryStatus(row.expiryDate).usable ||
                validQuantity(row.quantity) === null
            ) {
                cookingMessage(
                    "有庫存批次已不可使用，請重新開啟料理視窗。",
                    "danger"
                );

                return;
            }

            if (amount > row.quantity) {
                cookingMessage(
                    `${ingredientName(row.ingredient_id)}的扣除數量不能超過庫存。`,
                    "danger"
                );

                return;
            }

            // 使用量 0 表示不使用這個批次
            if (amount > 0) {
                deductions.push({
                    index,
                    amount
                });
            }
        }

        if (deductions.length === 0) {
            cookingMessage(
                "請至少選擇一個批次，輸入大於 0 的實際使用數量。"
            );

            return;
        }

        const confirmed = confirm(
            "確認扣除所選批次的實際使用數量？此操作會更新冰箱庫存。"
        );

        if (!confirmed) {
            return;
        }

        // 先複製資料，不直接改動目前冰箱陣列
        const next = fridgeItems.map(item => ({
            ...item
        }));

        for (const { index, amount } of deductions) {
            const remaining = Math.round(
                (
                    next[index].quantity - amount
                ) * 1e8
            ) / 1e8;

            next[index].quantity =
                remaining <= 0
                    ? 0
                    : remaining;
        }

        // 數量已用完的批次移除；
        // 舊資料 quantity=null 則繼續保留。
        const updated = next.filter(item =>
            item.quantity === null ||
            item.quantity > 0
        );

        // 儲存成功後才正式更新目前記憶體中的庫存
        if (!saveStorage(FRIDGE_KEY, updated)) {
            cookingMessage(
                "儲存失敗，庫存未變更。請檢查瀏覽器本機儲存設定。",
                "danger"
            );

            return;
        }

        fridgeItems = updated;
        cookingRecipeId = "";

        // 重新計算匹配度、即期數量、補貨與料理列表
        refresh();

        bootstrap.Modal.getOrCreateInstance(
            $("cookingInventoryModal")
        ).hide();

        message(
            `料理已確認，已更新 ${deductions.length} 個庫存批次。`
        );
    }

    // ==========================================
    // 15. 採買清單
    // ==========================================

    function mergeShopping(list, missing) {
        const next = list.slice();

        for (const id of missing) {
            if (!next.some(item =>
                item.ingredient_id === id
            )) {
                next.push({
                    ingredient_id: id,
                    purchased: false
                });
            }
        }

        return next;
    }

    function renderShopping() {
        $("shoppingCount").textContent =
            shoppingList.length;

        $("purchasedCount").textContent =
            shoppingList.filter(item =>
                item.purchased
            ).length;

        $("shoppingList").innerHTML =
            shoppingList.map((item, index) => `
                <div class="shopping-item">

                    <label class="${item.purchased
                        ? "purchased"
                        : ""}">

                        <input
                            type="checkbox"
                            class="form-check-input me-2"
                            data-check="${index}"
                            ${item.purchased
                                ? "checked"
                                : ""}>

                        ${escapeHTML(
                            ingredientName(item.ingredient_id)
                        )}
                    </label>

                    <button
                        type="button"
                        class="btn btn-outline-danger btn-sm"
                        data-delete="${index}">
                        刪除
                    </button>
                </div>
            `).join("") ||
            '<p class="text-muted">採買清單目前是空的。</p>';

        $("copyShoppingBtn").disabled =
            shoppingList.length === 0;

        $("clearShoppingBtn").disabled =
            shoppingList.length === 0;

        $("copyFallback").hidden = true;
    }

    function updateShopping() {
        const saved = saveStorage(
            SHOP_KEY,
            shoppingList
        );

        renderShopping();

        if (!saved) {
            message(
                "採買清單已更新，但未能儲存。",
                "warning"
            );
        }

        return saved;
    }

    function addToShopping(id) {
        const result = results.find(item =>
            item.recipe.recipeId === id
        );

        if (
            !result ||
            !result.valid ||
            result.canCook
        ) {
            return;
        }

        const before = shoppingList.length;

        shoppingList = mergeShopping(
            shoppingList,
            result.missingIngredients
        );

        if (updateShopping()) {
            message(
                `已新增 ${shoppingList.length - before} 項食材至採買清單（自動排除重複項目）。`
            );
        }
    }

    function copyShopping() {
        if (!shoppingList.length) {
            return;
        }

        const text =
            "Fridge Rescue 採買清單\n" +
            shoppingList.map(item =>
                (item.purchased
                    ? "[已購買] "
                    : "[未購買] ") +
                ingredientName(item.ingredient_id)
            ).join("\n");

        function fallback() {
            $("copyFallback").hidden = false;
            $("shoppingCopyText").value = text;
            $("shoppingCopyText").focus();
            $("shoppingCopyText").select();
        }

        if (
            navigator.clipboard &&
            navigator.clipboard.writeText
        ) {
            navigator.clipboard.writeText(text).then(
                () => message("已複製採買清單。"),
                fallback
            );
        } else {
            fallback();
        }
    }

    // ==========================================
    // 16. 初始化與互動事件
    // ==========================================

    function init() {
        fridgeItems =
            adaptFridgeItems(fridgeItems);

        shoppingList = shoppingList.filter(item =>
            item && ingredientById(item.ingredient_id)
        );

        const select = $("ingredientSelect");

        // 食材下拉選單
        for (const item of ingredients) {
            const option =
                document.createElement("option");

            option.value =
                item.ingredient_id;

            option.textContent =
                item.ingredient_name;

            select.appendChild(option);
        }

        select.addEventListener(
            "change",
            updateUnitPreview
        );

        updateUnitPreview();

        // 新增食材
        $("mockFridgeForm").addEventListener(
            "submit",
            event => {
                event.preventDefault();

                if (
                    !mockMode ||
                    !ingredientById(select.value)
                ) {
                    return;
                }

                const quantity = validQuantity(
                    $("ingredientQuantity").value.trim()
                );

                if (quantity === null) {
                    message(
                        "請輸入大於 0 的有效食材數量。",
                        "warning"
                    );

                    return;
                }

                const id =
                    "mock_" +
                    Date.now() +
                    "_" +
                    Math.random().toString(36).slice(2);

                updateMockInventory(
                    fridgeItems.concat([{
                        id,
                        ingredient_id: select.value,
                        quantity,
                        unit: ingredientUnit(select.value),
                        expiryDate: $("expiryDate").value
                    }])
                );

                event.target.reset();
                updateUnitPreview();
            }
        );

        // 刪除冰箱食材
        $("mockFridgeList").addEventListener(
            "click",
            event => {
                if (
                    !mockMode ||
                    event.target.dataset.remove === undefined
                ) {
                    return;
                }

                const index =
                    Number(event.target.dataset.remove);

                if (
                    !Number.isInteger(index) ||
                    index < 0 ||
                    index >= fridgeItems.length
                ) {
                    return;
                }

                const next = fridgeItems.slice();

                next.splice(index, 1);

                updateMockInventory(next);
            }
        );

        // 修改到期日
        $("mockFridgeList").addEventListener(
            "change",
            event => {
                if (
                    !mockMode ||
                    event.target.dataset.date === undefined
                ) {
                    return;
                }

                const index =
                    Number(event.target.dataset.date);

                if (
                    !Number.isInteger(index) ||
                    index < 0 ||
                    index >= fridgeItems.length
                ) {
                    return;
                }

                const next = fridgeItems.map(item => ({
                    ...item
                }));

                next[index].expiryDate =
                    event.target.value;

                updateMockInventory(next);
            }
        );

        // 載入示範資料
        $("loadDemoBtn").addEventListener(
            "click",
            () => {
                if (!mockMode) {
                    return;
                }

                if (
                    fridgeItems.length &&
                    !confirm(
                        "載入示範資料會取代目前冰箱庫存，確定嗎？"
                    )
                ) {
                    return;
                }

                updateMockInventory([
                    {
                        id: "demo1",
                        ingredient_id: "ING_001",
                        quantity: 1,
                        expiryDate: localDate(new Date())
                    },
                    {
                        id: "demo2",
                        ingredient_id: "ING_021",
                        quantity: 6,
                        expiryDate: ""
                    },
                    {
                        id: "demo3",
                        ingredient_id: "ING_030",
                        quantity: 2,
                        expiryDate: ""
                    }
                ]);
            }
        );

        // 清空冰箱
        $("clearFridgeBtn").addEventListener(
            "click",
            () => {
                if (
                    mockMode &&
                    confirm(
                        "確定要清空冰箱中的所有食材嗎？"
                    )
                ) {
                    updateMockInventory([]);
                }
            }
        );

        // 料理篩選
        for (const id of [
            "timeFilter",
            "difficultyFilter",
            "dietFilter",
            "zeroShopping"
        ]) {
            $(id).addEventListener(
                "change",
                renderRecipes
            );
        }

        // 重設篩選
        $("resetFiltersBtn").addEventListener(
            "click",
            () => {
                for (const id of [
                    "timeFilter",
                    "difficultyFilter",
                    "dietFilter"
                ]) {
                    $(id).value = "all";
                }

                $("zeroShopping").checked = false;
                renderRecipes();
            }
        );

        // 料理抽籤
        if ($("randomRecipeBtn")) {
            $("randomRecipeBtn").addEventListener(
                "click",
                drawRandomRecipe
            );
        }

        // 食譜詳情及採買
        $("recipeList").addEventListener(
            "click",
            event => {
                if (event.target.dataset.detail) {
                    showRecipe(
                        event.target.dataset.detail
                    );
                }

                if (event.target.dataset.add) {
                    addToShopping(
                        event.target.dataset.add
                    );
                }
            }
        );

        $("modalAddShoppingBtn").addEventListener(
            "click",
            () => addToShopping(currentRecipeId)
        );

        // V2.0：進入完成料理視窗
        $("completeRecipeBtn").addEventListener(
            "click",
            openCookingInventory
        );

        // V2.0：確認扣除庫存
        $("cookingInventoryForm").addEventListener(
            "submit",
            submitCookingInventory
        );

        // 取消或關閉時，清除尚未送出的資料
        $("cookingInventoryModal").addEventListener(
            "hidden.bs.modal",
            () => {
                cookingRecipeId = "";

                $("cookingInventoryForm").reset();

                cookingMessage("");
            }
        );

        // 採買清單：勾選已購買
        $("shoppingList").addEventListener(
            "change",
            event => {
                if (
                    event.target.dataset.check === undefined
                ) {
                    return;
                }

                shoppingList[
                    Number(event.target.dataset.check)
                ].purchased = event.target.checked;

                updateShopping();
            }
        );

        // 採買清單：刪除項目
        $("shoppingList").addEventListener(
            "click",
            event => {
                if (
                    event.target.dataset.delete === undefined
                ) {
                    return;
                }

                shoppingList.splice(
                    Number(event.target.dataset.delete),
                    1
                );

                updateShopping();
            }
        );

        // 採買清單：清空
        $("clearShoppingBtn").addEventListener(
            "click",
            () => {
                if (confirm("清空採買清單？")) {
                    shoppingList = [];
                    updateShopping();
                }
            }
        );

        $("copyShoppingBtn").addEventListener(
            "click",
            copyShopping
        );

        refresh();
        renderShopping();

        if (storageError) {
            message(
                "本機儲存讀取失敗，網站仍可操作。",
                "warning"
            );
        }
    }

    // ==========================================
    // 17. 保留原本的對外整合介面
    // ==========================================

    window.FridgeRescue = {
        setInventory: function (items) {
            mockMode = false;

            fridgeItems =
                adaptFridgeItems(items);

            $("mockFridgePanel").hidden = true;

            refresh();
        },

        refresh,
        calculateRecommendations,
        calculateRestock,
        expiryStatus,
        filterRecipes,
        mergeShopping
    };

    init();

})();
