// Fridge Rescue A 版 V1.1：推薦、篩選、補貨、採買清單、料理抽籤（含食材數量與小數點後一位限制）
// 正式冰箱接入方式：FridgeRescue.setInventory(轉換後的庫存陣列)
(function () {
    "use strict";

    const FRIDGE_KEY = "fridgeRescue_A_mock_v1";
    const SHOP_KEY = "fridgeRescue_A_shopping_v1";
    const $ = function (id) { return document.getElementById(id); };

    let storageError = false;
    let fridgeItems = readStorage(FRIDGE_KEY);
    let shoppingList = readStorage(SHOP_KEY);
    let results = [];
    let currentRecipeId = "";
    let mockMode = true;

    // 1. 共用工具：食材查詢、文字安全顯示、本機儲存
    function ingredientById(id) {
        return ingredients.find(function (item) {
            return item.ingredient_id === id;
        });
    }

    function ingredientName(id) {
        const item = ingredientById(id);
        return item ? item.ingredient_name : id;
    }

    function names(ids) {
        return ids.map(ingredientName).join("、") || "無";
    }

    // 參考來源：只接受 http(s) 網址；synced 為步驟已依來源改寫，reference 為僅供參考
    function sourceHTML(source) {
        if (!source || !/^https?:\/\//i.test(source.url || "")) return "";

        const label = source.type === "synced" ? "參考來源" : "參考連結";

        return `<p class="mb-2">${label}：<a href="${escapeHTML(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(source.title || source.url)}</a></p>`;
    }

    // 參考照片：只附連結，不在網站內放圖（照片版權屬原作者）
    function photoLinkHTML(photoLink) {
        if (!photoLink || !/^https?:\/\//i.test(photoLink.url || "")) return "";

        return `<p class="mb-2">參考照片：<a href="${escapeHTML(photoLink.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(photoLink.title || photoLink.url)}</a></p>`;
    }

    function escapeHTML(value) {
        return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[c];
        });
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

    // 2. 日期只比較本地日曆日期，避免時區及日光節約時間誤差
    function localDate(date) {
        return date.getFullYear() + "-" +
            String(date.getMonth() + 1).padStart(2, "0") + "-" +
            String(date.getDate()).padStart(2, "0");
    }

    function dayNumber(value) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;

        const parts = value.split("-").map(Number);
        const date = new Date(0);

        date.setUTCFullYear(parts[0], parts[1] - 1, parts[2]);

        if (
            date.getUTCFullYear() !== parts[0] ||
            date.getUTCMonth() + 1 !== parts[1] ||
            date.getUTCDate() !== parts[2]
        ) return NaN;

        return date.getTime() / 86400000;
    }

    function expiryStatus(expiryDate, today = localDate(new Date())) {

        if (!expiryDate) {
            return {
                days: null,
                color: "secondary",
                text: "未設定期限",
                usable: true,
                urgent: false
            };
        }

        const days = dayNumber(expiryDate) - dayNumber(today);

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
                text: days === 0 ? "今天到期" : `剩餘 ${days} 天`,
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

    // 數量處理工具：確保最少 0.1 且最多小數點後一位
    function normalizeQuantity(value, fallback = 1) {
        if (value === undefined || value === null || value === "") return fallback;
        const num = Number(value);
        if (!Number.isFinite(num) || num < 0.1) return fallback;
        return Math.round(num * 10) / 10;
    }

    function limitToOneDecimal(input) {
        let val = input.value;
        if (!val) return;

        if (val.includes("-")) {
            val = val.replace(/-/g, "");
        }

        if (val.includes(".")) {
            const parts = val.split(".");
            if (parts[1].length > 1) {
                val = parts[0] + "." + parts[1].slice(0, 1);
            }
        }

        if (input.value !== val) {
            input.value = val;
        }
    }

    // 暫定整合格式；B 的不同欄位請先轉換成此格式
    function adaptFridgeItems(items) {

        return items.filter(function (item) {
            return item && ingredientById(item.ingredient_id);
        }).map(function (item, i) {

            const master = ingredientById(item.ingredient_id);

            return {
                id: String(item.id == null ? "row_" + i : item.id),
                ingredient_id: master.ingredient_id,
                ingredient_name: master.ingredient_name,
                category: master.category,
                quantity: normalizeQuantity(item.quantity, 1),
                expiryDate: item.expiryDate || ""
            };
        });
    }

    function availableInventory(items, today) {

        const available = {};

        for (const item of items) {

            const status = expiryStatus(item.expiryDate, today);

            if (!status.usable) continue;

            const id = item.ingredient_id;

            // 重複庫存只計一種；有即期批次就保留最早到期日
            if (
                !available[id] ||
                (status.urgent &&
                    (!available[id].urgent || status.days < available[id].days))
            ) {
                available[id] = status;
            }
        }

        return available;
    }

    // 3. 智慧配對：資料與畫面分開
    function matchRecipe(recipe, available) {

        const required = Array.from(new Set(
            Array.isArray(recipe.requiredIngredients)
                ? recipe.requiredIngredients : []
        ));

        const ownedIngredients = [];
        const missingIngredients = [];
        const urgentIngredients = [];

        let earliestDays = Infinity;

        for (const id of required) {

            if (Object.prototype.hasOwnProperty.call(available, id)) {

                ownedIngredients.push(id);

                if (available[id].urgent) {
                    urgentIngredients.push(id);
                    earliestDays = Math.min(earliestDays, available[id].days);
                }

            } else {
                missingIngredients.push(id);
            }
        }

        const valid = required.length > 0;
        const canCook = valid && missingIngredients.length === 0;
        const ratio = valid ? ownedIngredients.length / required.length : 0;
        const matchPercent = canCook ? 100 : Math.min(99, Math.round(ratio * 100));

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

    function calculateRecommendations(items, recipeData, today = localDate(new Date())) {

        const available = availableInventory(adaptFridgeItems(items), today);

        return recipeData.map(function (recipe) {
            return matchRecipe(recipe, available);
        });
    }

    // 4. 排序與篩選
    // 全齊 > 即期（最近到期、種類數）> 匹配 > 時間 > ID
    function compareRecipes(a, b) {

        if (a.canCook !== b.canCook)
            return a.canCook ? -1 : 1;

        if (a.earliestDays !== b.earliestDays)
            return a.earliestDays < b.earliestDays ? -1 : 1;

        if (a.urgentIngredients.length !== b.urgentIngredients.length)
            return b.urgentIngredients.length - a.urgentIngredients.length;

        if (a.ratio !== b.ratio)
            return b.ratio - a.ratio;

        if (a.recipe.cookingTime !== b.recipe.cookingTime)
            return a.recipe.cookingTime - b.recipe.cookingTime;

        return String(a.recipe.recipeId).localeCompare(String(b.recipe.recipeId));
    }

    function filterRecipes(data, filters) {

        return data.filter(function (r) {

            if (filters.zero && !r.canCook) return false;

            if (filters.time !== "all" &&
                r.recipe.cookingTime > Number(filters.time)) return false;

            if (filters.difficulty !== "all" &&
                r.recipe.difficulty !== filters.difficulty) return false;

            if (filters.diet !== "all" &&
                !r.recipe.dietTags.includes(filters.diet)) return false;

            return true;

        }).sort(compareRecipes);
    }

    // 5. 智慧補貨：直接重用缺少食材，不再重做配對
    function calculateRestock(data) {

        const groups = {};

        for (const r of data) {

            if (!r.valid || r.missingIngredients.length !== 1) continue;

            const id = r.missingIngredients[0];

            if (!groups[id]) {
                groups[id] = {
                    ingredient_id: id,
                    recipeNames: [],
                    recipeIds: []
                };
            }

            if (!groups[id].recipeIds.includes(r.recipe.recipeId)) {
                groups[id].recipeIds.push(r.recipe.recipeId);
                groups[id].recipeNames.push(r.recipe.name);
            }
        }

        return Object.values(groups).sort(function (a, b) {
            return b.recipeIds.length - a.recipeIds.length ||
                a.ingredient_id.localeCompare(b.ingredient_id);
        });
    }

    // 6. 畫面渲染與暫用冰箱
    function renderFridge() {

        if (!mockMode) return;

        $("mockFridgeList").innerHTML = fridgeItems.map(function (item, i) {

            const s = expiryStatus(item.expiryDate);

            return `<div class="fridge-item">
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-1">
                    <div>
                        <strong>${escapeHTML(item.ingredient_name)}</strong>
                        <span class="text-muted small ms-1">
                             ${escapeHTML(item.quantity)} ${escapeHTML(ingredientById(item.ingredient_id)?.unit || "")}
                        </span>
                    </div>

                    <span class="badge bg-${s.color} ${s.color === "warning" ? "text-dark" : ""}">
                        ${escapeHTML(s.text)}
                    </span>
                </div>

                <div class="d-flex gap-2 mt-2 align-items-center">

                    <input type="number" class="form-control form-control-sm qty-input"
                        style="max-width: 85px;"
                        step="0.1" min="0.1"
                        aria-label="${escapeHTML(item.ingredient_name)}數量"
                        data-qty="${i}" value="${escapeHTML(item.quantity)}">

                    <input type="date" class="form-control form-control-sm"
                        aria-label="${escapeHTML(item.ingredient_name)}到期日"
                        data-date="${i}" value="${escapeHTML(item.expiryDate)}">

                    <button type="button" class="btn btn-outline-danger btn-sm flex-shrink-0"
                        data-remove="${i}">刪除</button>

                </div>
            </div>`;

        }).join("") || '<p class="text-muted">目前沒有食材。</p>';
    }

    // 冰箱貼圖：兩種模式（暫用冰箱／B 正式接入）都要畫
    function renderFridgeVisual() {

        if (!window.FridgeVisual || !$("fridgeVisual")) return;

        FridgeVisual.render($("fridgeVisual"), fridgeItems, { expiryStatus });
    }

    // V1.1 新增：取得目前符合條件的食譜
    // 推薦列表與料理抽籤共同使用此函式
    function currentFilteredRecipes() {

        return filterRecipes(results, {
            time: $("timeFilter").value,
            difficulty: $("difficultyFilter").value,
            diet: $("dietFilter").value,
            zero: $("zeroShopping").checked
        });
    }

    // V1.1 新增：料理抽籤機
    function drawRandomRecipe() {

        const candidates = currentFilteredRecipes();
        const notice = $("randomRecipeMessage");

        // 沒有任何符合條件的料理
        if (candidates.length === 0) {

            if (notice) {
                notice.textContent =
                    "目前沒有符合條件的料理，請試著放寬篩選條件。";
            }

            return;
        }

        // 產生 0 到候選數量減 1 的隨機整數
        const index = Math.floor(Math.random() * candidates.length);

        if (notice) notice.textContent = "";

        // 沿用原有的食譜詳情視窗
        showRecipe(candidates[index].recipe.recipeId);
    }

    function renderRecipes() {

        const filtered = currentFilteredRecipes();

        if ($("randomRecipeMessage")) {
            $("randomRecipeMessage").textContent = "";
        }

        $("recipeCount").textContent = filtered.length;

        $("recipeList").innerHTML = filtered.map(function (r) {

            const recipe = r.recipe;

            return `<div class="col-md-6">
                <article class="card recipe-card">
                    <div class="card-body">

                        ${recipe.image ? `<img class="recipe-image mb-3" src="${escapeHTML(recipe.image)}" alt="${escapeHTML(recipe.name)}">` : ""}

                        <h3>${escapeHTML(recipe.name)}</h3>

                        <p class="text-muted">
                            ${recipe.cookingTime} 分鐘｜${escapeHTML(recipe.difficulty)}
                        </p>

                        <p>
                            <strong>匹配度：${r.matchPercent}%</strong>
                            ${r.canCook ? '<span class="badge bg-success">零採買</span>' : ""}
                        </p>

                        <div class="progress mb-3" role="progressbar"
                            aria-label="食材匹配度"
                            aria-valuenow="${r.matchPercent}"
                            aria-valuemin="0" aria-valuemax="100">

                            <div class="progress-bar bg-success"
                                style="width:${r.matchPercent}%"></div>
                        </div>

                        <p class="owned-ingredients">
                            已具備：${escapeHTML(names(r.ownedIngredients))}
                        </p>

                        <p class="missing-ingredients">
                            缺少：${escapeHTML(names(r.missingIngredients))}
                        </p>

                        ${r.urgentIngredients.length ? `<p class="text-warning-emphasis">即期食材：${escapeHTML(names(r.urgentIngredients))}</p>` : ""}

                        ${!r.valid ? '<p class="text-danger">必要食材尚未設定</p>' : ""}

                        <div class="d-flex gap-2 flex-wrap">

                            <button type="button"
                                class="btn btn-outline-success btn-sm"
                                data-detail="${escapeHTML(recipe.recipeId)}">
                                食譜詳情
                            </button>

                            <button type="button"
                                class="btn btn-success btn-sm"
                                data-add="${escapeHTML(recipe.recipeId)}"
                                ${!r.valid || r.canCook ? "disabled" : ""}>
                                加入採買清單
                            </button>

                        </div>
                    </div>
                </article>
            </div>`;

        }).join("") || '<div class="col-12"><div class="alert alert-info">沒有符合條件的料理，請放寬篩選條件。</div></div>';
    }

    function renderRestock() {

        $("restockList").innerHTML = calculateRestock(results).map(function (g) {

            return `<div class="restock-item">

                <strong>
                    補買 ${escapeHTML(ingredientName(g.ingredient_id))}，
                    可額外解鎖 ${g.recipeIds.length} 道料理。
                </strong>

                <p class="mb-0 mt-2">
                    ${escapeHTML(g.recipeNames.join("、"))}
                </p>

            </div>`;

        }).join("") || '<p class="text-muted">目前沒有只需補買一項即可解鎖的料理。</p>';
    }

    function refresh() {

        results = calculateRecommendations(fridgeItems, recipes);

        $("inventoryCount").textContent = new Set(fridgeItems.map(function (item) {
            return item.ingredient_id;
        })).size;

        $("expiringCount").textContent = Object.values(
            availableInventory(fridgeItems)
        ).filter(function (s) {
            return s.urgent;
        }).length;

        $("availableRecipeCount").textContent = results.filter(function (r) {
            return r.canCook;
        }).length;

        renderFridge();
        renderFridgeVisual();
        renderRecipes();
        renderRestock();
    }

    function updateMockInventory(items) {

        fridgeItems = adaptFridgeItems(items);

        const saved = saveStorage(FRIDGE_KEY, fridgeItems);

        refresh();

        if (!saved) {
            message("目前已更新庫存畫面，但未能儲存。", "warning");
        }
    }

    function showRecipe(id) {

        const r = results.find(function (item) {
            return item.recipe.recipeId === id;
        });

        if (!r) return;

        currentRecipeId = id;

        const recipe = r.recipe;

        $("recipeModalTitle").textContent = recipe.name;

        $("recipeModalBody").innerHTML = `
            <p>
                ${recipe.cookingTime} 分鐘｜
                ${escapeHTML(recipe.difficulty)}｜
                匹配度 ${r.matchPercent}%
            </p>

            ${recipe.image ? `<img class="img-fluid mb-3" src="${escapeHTML(recipe.image)}" alt="${escapeHTML(recipe.name)}">` : ""}

            ${recipe.portions ? `<p>份量：${escapeHTML(recipe.portions)}</p>` : ""}
            <p>必要食材：${escapeHTML(names(recipe.requiredIngredients || []))}</p>
            <p>已具備：${escapeHTML(names(r.ownedIngredients))}</p>
            <p>缺少：${escapeHTML(names(r.missingIngredients))}</p>

            ${!r.valid ? '<p class="text-danger">必要食材尚未設定，無法判定是否可料理。</p>' : ""}

            <h3 class="h5">料理步驟</h3>

            <ol>
                ${(recipe.steps || []).map(function (step) {
                    return `<li>${escapeHTML(step)}</li>`;
                }).join("")}
            </ol>

            ${sourceHTML(recipe.source)}
            ${photoLinkHTML(recipe.photoLink)}

            <small class="text-muted d-block">
                食譜為小組整理，部分步驟參考公開來源；份量、常備調味料及食材安全請自行確認。
            </small>`;

        $("modalAddShoppingBtn").disabled = !r.valid || r.canCook;

        if (window.bootstrap && bootstrap.Modal) {

            bootstrap.Modal.getOrCreateInstance($("recipeModal")).show();

        } else {

            alert(
                recipe.name +
                "\n匹配度：" + r.matchPercent + "%" +
                "\n必要食材：" + names(recipe.requiredIngredients || []) +
                "\n已具備：" + names(r.ownedIngredients) +
                "\n缺少：" + names(r.missingIngredients) +
                (!r.valid ? "\n必要食材尚未設定，無法判定是否可料理。" : "") +
                "\n" + (recipe.steps || []).join("\n")
            );
        }
    }

    // 7. 採買清單：只依食材 ID 去重，與冰箱庫存完全分開
    function mergeShopping(list, missing) {

        const next = list.slice();

        for (const id of missing) {

            if (!next.some(function (item) {
                return item.ingredient_id === id;
            })) {

                next.push({
                    ingredient_id: id,
                    purchased: false
                });
            }
        }

        return next;
    }

    function renderShopping() {

        $("shoppingCount").textContent = shoppingList.length;

        $("purchasedCount").textContent = shoppingList.filter(function (item) {
            return item.purchased;
        }).length;

        $("shoppingList").innerHTML = shoppingList.map(function (item, i) {

            return `<div class="shopping-item">

                <label class="${item.purchased ? "purchased" : ""}">

                    <input type="checkbox"
                        class="form-check-input me-2"
                        data-check="${i}"
                        ${item.purchased ? "checked" : ""}>

                    ${escapeHTML(ingredientName(item.ingredient_id))}

                </label>

                <button type="button"
                    class="btn btn-outline-danger btn-sm"
                    data-delete="${i}">
                    刪除
                </button>

            </div>`;

        }).join("") || '<p class="text-muted">採買清單目前是空的。</p>';

        $("copyShoppingBtn").disabled = shoppingList.length === 0;
        $("clearShoppingBtn").disabled = shoppingList.length === 0;
        $("copyFallback").hidden = true;
    }

    function updateShopping() {

        const saved = saveStorage(SHOP_KEY, shoppingList);

        renderShopping();

        if (!saved) {
            message("採買清單已更新，但未能儲存。", "warning");
        }

        return saved;
    }

    
function addToShopping(id) {

    const r = results.find(function (item) {
        return item.recipe.recipeId === id;
    });

    if (!r || !r.valid || r.canCook) return;

    const before = shoppingList.length;

    shoppingList = mergeShopping(shoppingList, r.missingIngredients);

    if (!updateShopping()) return;

    const addedCount = shoppingList.length - before;

    const text = addedCount > 0
        ? `已成功加入 ${addedCount} 項食材至採買清單。`
        : "這道料理缺少的食材已經在採買清單中，沒有重複新增。";

    message(text);

    const successText = $("shoppingSuccessText");
    const successModal = $("shoppingSuccessModal");

    if (successText) {
        successText.textContent = text;
    }

    if (successModal && window.bootstrap && bootstrap.Modal) {
        // 從食譜詳情加入時，先關閉原本的視窗
        const recipeModal = $("recipeModal");

        if (recipeModal && recipeModal.classList.contains("show")) {
            recipeModal.addEventListener("hidden.bs.modal", function () {
                bootstrap.Modal.getOrCreateInstance(successModal).show();
            }, { once: true });

            bootstrap.Modal.getOrCreateInstance(recipeModal).hide();
        } else {
            bootstrap.Modal.getOrCreateInstance(successModal).show();
        }
    }
}

    function copyShopping() {

        if (!shoppingList.length) return;

        const text = "Fridge Rescue 採買清單\n" +
            shoppingList.map(function (item) {

                return (item.purchased ? "[已購買] " : "[未購買] ") +
                    ingredientName(item.ingredient_id);

            }).join("\n");

        function fallback() {

            $("copyFallback").hidden = false;
            $("shoppingCopyText").value = text;
            $("shoppingCopyText").focus();
            $("shoppingCopyText").select();
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {

            navigator.clipboard.writeText(text).then(function () {

                message("已複製採買清單。");

            }, fallback);

        } else {
            fallback();
        }
    }

    // 自動在表單與快捷彈窗補上「食材數量」輸入框（若 HTML 尚未自行加入）
    function ensureQuantityInputs() {

        const fridgeForm = $("mockFridgeForm");
        if (fridgeForm && !$("ingredientQty")) {
            const qtyBlock = `
                <div class="mb-3">
                    <label for="ingredientQty" class="form-label fw-bold">
                        食材數量
                    </label>
                    <input type="number" id="ingredientQty" class="form-control qty-input"
                        step="0.1" min="0.1" value="1" placeholder="例如：1 或 1.5" required>
                    <small class="text-muted d-block mt-1">
                        最少 0.1，最多輸入到小數點後一位。
                    </small>
                </div>`;

            const expiryField = $("expiryDate");
            const expiryGroup = expiryField ? expiryField.closest(".mb-3") : null;
            if (expiryGroup) {
                expiryGroup.insertAdjacentHTML("beforebegin", qtyBlock);
            } else {
                fridgeForm.insertAdjacentHTML("afterbegin", qtyBlock);
            }
        }

        const quickForm = $("quickAddFridgeForm");
        if (quickForm && !$("quickAddQty")) {
            const quickQtyBlock = `
                <div class="mb-2">
                    <label for="quickAddQty" class="form-label small fw-bold mb-1">
                        數量（最多小數點後一位）
                    </label>
                    <input type="number" id="quickAddQty" class="form-control form-control-sm qty-input"
                        step="0.1" min="0.1" value="1" required>
                </div>`;

            const quickExpiry = $("quickAddExpiry");
            const quickExpiryGroup = quickExpiry ? quickExpiry.closest(".mb-2") : null;
            if (quickExpiryGroup) {
                quickExpiryGroup.insertAdjacentHTML("beforebegin", quickQtyBlock);
            }
        }

        const quickModal = $("quickAddFridgeModal");
        if (quickModal) {
            quickModal.addEventListener("show.bs.modal", function () {
                if ($("quickAddQty")) {
                    $("quickAddQty").value = "1";
                }
            });
        }

        if (quickForm) {
            quickForm.addEventListener("submit", function () {
                if ($("ingredientQty") && $("quickAddQty")) {
                    $("ingredientQty").value = $("quickAddQty").value || "1";
                }
            }, true);
        }
    }

    // 8. 事件：將上述函式接上 index.html
    function init() {

        ensureQuantityInputs();

        fridgeItems = adaptFridgeItems(fridgeItems);

        shoppingList = shoppingList.filter(function (item) {
            return item && ingredientById(item.ingredient_id);
        });

        const select = $("ingredientSelect");

        for (const item of ingredients) {

            const option = document.createElement("option");

            option.value = item.ingredient_id;
            option.textContent = item.ingredient_name;

            select.appendChild(option);
        }

        // 統一限制所有 .qty-input 最多輸入到小數點後一位
        document.addEventListener("keydown", function (event) {
            if (!event.target.classList || !event.target.classList.contains("qty-input")) return;
            if (["e", "E", "+", "-"].includes(event.key)) {
                event.preventDefault();
            }
        });

        document.addEventListener("input", function (event) {
            if (!event.target.classList || !event.target.classList.contains("qty-input")) return;
            limitToOneDecimal(event.target);
        });

        // 新增冰箱食材
        $("mockFridgeForm").addEventListener("submit", function (event) {

            event.preventDefault();

            if (!mockMode || !ingredientById(select.value)) return;

            const qtyInput = $("ingredientQty");
            const quantity = qtyInput ? normalizeQuantity(qtyInput.value, NaN) : 1;

            if (!Number.isFinite(quantity) || quantity < 0.1) {
                message("請輸入有效的食材數量（最少 0.1，最多小數點後一位）。", "warning");
                if (qtyInput) qtyInput.focus();
                return;
            }

            const id = "mock_" + Date.now() + "_" +
                Math.random().toString(36).slice(2);

            updateMockInventory(fridgeItems.concat([{
                id,
                ingredient_id: select.value,
                quantity,
                expiryDate: $("expiryDate").value
            }]));

            event.target.reset();
        });

        // 刪除冰箱食材
        $("mockFridgeList").addEventListener("click", function (event) {

            if (!mockMode || event.target.dataset.remove === undefined) return;

            fridgeItems.splice(Number(event.target.dataset.remove), 1);

            updateMockInventory(fridgeItems);
        });

        // 修改食材到期日或數量
        $("mockFridgeList").addEventListener("change", function (event) {

            if (!mockMode) return;

            if (event.target.dataset.date !== undefined) {
                fridgeItems[Number(event.target.dataset.date)].expiryDate =
                    event.target.value;

                updateMockInventory(fridgeItems);
                return;
            }

            if (event.target.dataset.qty !== undefined) {
                const index = Number(event.target.dataset.qty);
                const nextQty = normalizeQuantity(event.target.value, NaN);

                if (!Number.isFinite(nextQty) || nextQty < 0.1) {
                    event.target.value = fridgeItems[index].quantity;
                    return;
                }

                fridgeItems[index].quantity = nextQty;
                updateMockInventory(fridgeItems);
            }
        });

        // 載入示範資料前，保護原有個人庫存
        $("loadDemoBtn").addEventListener("click", function () {

            if (!mockMode) return;

            if (fridgeItems.length &&
                !confirm("載入示範資料會取代目前冰箱庫存，確定嗎？")) {
                return;
            }

            updateMockInventory([
                {
                    id: "demo1",
                    ingredient_id: "ING_001",
                    quantity: 2,
                    expiryDate: localDate(new Date())
                },
                {
                    id: "demo2",
                    ingredient_id: "ING_021",
                    quantity: 1.5,
                    expiryDate: ""
                },
                {
                    id: "demo3",
                    ingredient_id: "ING_030",
                    quantity: 1,
                    expiryDate: ""
                }
            ]);
        });

        // 清空冰箱前確認
        $("clearFridgeBtn").addEventListener("click", function () {

            if (mockMode && confirm("確定要清空冰箱中的所有食材嗎？")) {
                updateMockInventory([]);
            }
        });

        // 料理條件篩選
        for (const id of ["timeFilter", "difficultyFilter", "dietFilter", "zeroShopping"]) {

            $(id).addEventListener("change", renderRecipes);
        }

        $("resetFiltersBtn").addEventListener("click", function () {

            for (const id of ["timeFilter", "difficultyFilter", "dietFilter"]) {
                $(id).value = "all";
            }

            $("zeroShopping").checked = false;

            renderRecipes();
        });

        // V1.1 新增：料理抽籤按鈕
        // 保留與舊 HTML 的相容性
        if ($("randomRecipeBtn")) {
            $("randomRecipeBtn").addEventListener("click", drawRandomRecipe);
        }

        $("recipeList").addEventListener("click", function (event) {

            if (event.target.dataset.detail) {
                showRecipe(event.target.dataset.detail);
            }

            if (event.target.dataset.add) {
                addToShopping(event.target.dataset.add);
            }
        });

        $("modalAddShoppingBtn").addEventListener("click", function () {

            addToShopping(currentRecipeId);
        });

        $("shoppingList").addEventListener("change", function (event) {

            if (event.target.dataset.check === undefined) return;

            shoppingList[Number(event.target.dataset.check)].purchased =
                event.target.checked;

            updateShopping();
        });

        $("shoppingList").addEventListener("click", function (event) {

            if (event.target.dataset.delete === undefined) return;

            shoppingList.splice(Number(event.target.dataset.delete), 1);

            updateShopping();
        });

        $("clearShoppingBtn").addEventListener("click", function () {

            if (confirm("清空採買清單？")) {

                shoppingList = [];

                updateShopping();
            }
        });

        $("copyShoppingBtn").addEventListener("click", copyShopping);

        refresh();
        renderShopping();

        if (storageError) {
            message("本機儲存讀取失敗，網站仍可操作。", "warning");
        }
    }

    // B 正式接入時呼叫此介面；不讀寫 B 的 localStorage
    window.FridgeRescue = {

        setInventory: function (items) {

            mockMode = false;
            fridgeItems = adaptFridgeItems(items);
            // 只隱藏暫用的表單與清單；冰箱貼圖仍依 B 提供的庫存顯示
            document.querySelectorAll("[data-mock-only]").forEach(function (node) {
                node.hidden = true;
            });

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

}());