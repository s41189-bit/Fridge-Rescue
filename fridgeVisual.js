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

    root.FridgeVisual = { ZONES, groupItems, planZones };
}());
