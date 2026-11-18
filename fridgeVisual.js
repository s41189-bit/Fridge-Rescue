// Fridge Rescue：可愛冰箱視覺化
// 純函式（groupItems、planZones）負責分組與分層；render 負責把貼圖畫進冰箱。
// 瀏覽器中掛在 window.FridgeVisual；測試環境掛在 globalThis.FridgeVisual。
(function () {
    "use strict";

    const root = typeof window !== "undefined" ? window : globalThis;

    // 冰箱各層與每層上限（上限已包含「+N」那一格）
    const ZONES = [
        { key: "dairy", category: "蛋奶豆製品", capacity: 5 },
        { key: "meat", category: "肉類海鮮", capacity: 5 },
        { key: "staple", category: "主食", capacity: 5 },
        { key: "veg", category: "蔬菜", capacity: 10 }
    ];

    const SEVERITY = { ok: 0, soon: 1, expired: 2 };

    function stateOf(expiryStatus, expiryDate) {
        const color = expiryStatus(expiryDate).color;
        if (color === "danger") return "expired";
        if (color === "warning") return "soon";
        return "ok";
    }

    // 同一個 ingredient_id 合併成一組，狀態取最緊急的一筆
    function groupItems(items, expiryStatus) {
        const byId = {};

        for (const item of items) {
            const state = stateOf(expiryStatus, item.expiryDate);
            const group = byId[item.ingredient_id];

            if (!group) {
                byId[item.ingredient_id] = {
                    ingredient_id: item.ingredient_id,
                    name: item.ingredient_name,
                    category: item.category,
                    count: 1,
                    state: state
                };
            } else {
                group.count += 1;
                if (SEVERITY[state] > SEVERITY[group.state]) group.state = state;
            }
        }

        return Object.values(byId).sort(function (a, b) {
            return a.ingredient_id.localeCompare(b.ingredient_id);
        });
    }

    // 依分類放進各層；超過上限時只顯示 上限-1 張，其餘併入「+N」
    function planZones(groups) {
        return ZONES.map(function (zone) {
            const inZone = groups.filter(function (g) {
                return g.category === zone.category;
            });

            if (inZone.length <= zone.capacity) {
                return { key: zone.key, shown: inZone, overflow: 0 };
            }

            const keep = zone.capacity - 1;
            return {
                key: zone.key,
                shown: inZone.slice(0, keep),
                overflow: inZone.length - keep
            };
        });
    }

    // ---- 以下為 DOM 渲染（只在瀏覽器使用）----

    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function earliestExpiry(items, id) {
        const dates = items
            .filter(function (i) { return i.ingredient_id === id && i.expiryDate; })
            .map(function (i) { return i.expiryDate; })
            .sort();
        return dates[0] || "";
    }

    function stickerNode(group, items, imageBase, animate) {
        const item = el("span", "fv-item");
        const date = earliestExpiry(items, group.ingredient_id);
        const label = group.name +
            (group.count > 1 ? " ×" + group.count : "") +
            "｜" + (date ? "最早到期 " + date : "未設定到期日") +
            (group.state === "expired" ? "（已逾期）" :
                group.state === "soon" ? "（快到期）" : "");

        if (group.state !== "ok") item.classList.add("fv-" + group.state);
        if (animate) item.classList.add("fv-pop");
        item.title = label;

        const img = el("img", "fv-sticker");
        img.src = imageBase + group.ingredient_id + ".png";
        img.alt = label;
        img.addEventListener("error", function () {
            img.replaceWith(el("span", "fv-fallback", group.name));
        });
        item.appendChild(img);

        if (group.count > 1) item.appendChild(el("span", "fv-count", "×" + group.count));

        return item;
    }

    // 把庫存畫進冰箱。第一次呼叫不播動畫；之後只有新出現的食材會彈出。
    function render(container, items, opts) {

        const imageBase = (opts && opts.imageBase) || "images/web/";
        const groups = groupItems(items, opts.expiryStatus);
        const plan = planZones(groups);
        const previous = container.__fvSeen || null;
        const placed = plan.reduce(function (n, z) {
            return n + z.shown.length + (z.overflow ? 1 : 0);
        }, 0);

        container.classList.add("fv-root");
        container.replaceChildren();

        const fridge = el("img", "fv-fridge");
        fridge.src = imageBase + "fridge.png";
        fridge.alt = "可愛的冰箱";
        container.appendChild(fridge);

        for (const zone of plan) {
            const zoneNode = el("div", "fv-zone");
            zoneNode.dataset.zone = zone.key;

            for (const group of zone.shown) {
                const animate = previous !== null && !previous.has(group.ingredient_id);
                zoneNode.appendChild(stickerNode(group, items, imageBase, animate));
            }

            if (zone.overflow > 0) {
                const more = el("span", "fv-item fv-more", "+" + zone.overflow);
                more.title = "還有 " + zone.overflow + " 種食材，請看右側清單";
                zoneNode.appendChild(more);
            }

            container.appendChild(zoneNode);
        }

        if (placed === 0) container.appendChild(el("p", "fv-empty", "冰箱空空的"));

        container.__fvSeen = new Set(groups.map(function (g) { return g.ingredient_id; }));
    }

    root.FridgeVisual = { ZONES, groupItems, planZones, render };
}());
