// 純函式測試：groupItems、planZones（由 tests/run.js 載入）
const stub = function (date) {
    const colors = { "": "secondary", OK: "success", SOON: "warning", OLD: "danger" };
    return { color: colors[date] };
};

const item = function (id, category, expiryDate) {
    return {
        ingredient_id: id,
        ingredient_name: "食材" + id,
        category: category,
        expiryDate: expiryDate === undefined ? "" : expiryDate
    };
};

const dairyItems = function (n) {
    const out = [];
    for (let i = 1; i <= n; i++) out.push(item("D" + String(i).padStart(2, "0"), "蛋奶豆製品"));
    return out;
};

const vegItems = function (n) {
    const out = [];
    for (let i = 1; i <= n; i++) out.push(item("V" + String(i).padStart(2, "0"), "蔬菜"));
    return out;
};

const zoneOf = function (plan, key) {
    return plan.find(function (z) { return z.key === key; });
};

test("same ingredient twice merges with count 2", function () {
    const groups = FridgeVisual.groupItems([
        item("ING_001", "蔬菜", "OK"), item("ING_001", "蔬菜", "OK")
    ], stub);
    assertEqual(groups.length, 1, "groups.length");
    assertEqual(groups[0].count, 2, "count");
});

test("worst state wins: expired over ok", function () {
    const groups = FridgeVisual.groupItems([
        item("ING_001", "蔬菜", "OK"), item("ING_001", "蔬菜", "OLD")
    ], stub);
    assertEqual(groups[0].state, "expired");
});

test("worst state wins: soon over ok", function () {
    const groups = FridgeVisual.groupItems([
        item("ING_001", "蔬菜", "OK"), item("ING_001", "蔬菜", "SOON")
    ], stub);
    assertEqual(groups[0].state, "soon");
});

test("no expiry date stays ok", function () {
    const groups = FridgeVisual.groupItems([item("ING_001", "蔬菜", "")], stub);
    assertEqual(groups[0].state, "ok");
});

test("unknown category is skipped without throwing", function () {
    const groups = FridgeVisual.groupItems([
        item("X_1", "飲料"), item("ING_021", "蛋奶豆製品")
    ], stub);
    const plan = FridgeVisual.planZones(groups);
    assertEqual(zoneOf(plan, "dairy").shown.length, 1, "dairy shown");
    const total = plan.reduce(function (n, z) { return n + z.shown.length; }, 0);
    assertEqual(total, 1, "only the known-category group is placed");
});

test("exactly capacity shows no overflow", function () {
    const plan = FridgeVisual.planZones(FridgeVisual.groupItems(dairyItems(5), stub));
    assertEqual(zoneOf(plan, "dairy").shown.length, 5, "shown");
    assertEqual(zoneOf(plan, "dairy").overflow, 0, "overflow");
});

test("capacity plus one shows +2", function () {
    const plan = FridgeVisual.planZones(FridgeVisual.groupItems(dairyItems(6), stub));
    assertEqual(zoneOf(plan, "dairy").shown.length, 4, "shown");
    assertEqual(zoneOf(plan, "dairy").overflow, 2, "overflow");
});

test("veg capacity is 10", function () {
    const plan = FridgeVisual.planZones(FridgeVisual.groupItems(vegItems(11), stub));
    assertEqual(zoneOf(plan, "veg").shown.length, 9, "shown");
    assertEqual(zoneOf(plan, "veg").overflow, 2, "overflow");
});

test("empty input yields four empty zones in order", function () {
    const plan = FridgeVisual.planZones([]);
    assertEqual(plan.map(function (z) { return z.key; }), ["dairy", "meat", "staple", "veg"], "keys");
    assertEqual(plan.every(function (z) { return z.shown.length === 0 && z.overflow === 0; }), true, "all empty");
});
