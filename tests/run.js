// 執行方式：osascript -l JavaScript tests/run.js
// 專案沒有 Node，改用 macOS 內建的 JavaScript 引擎跑純函式測試。
ObjC.import("Foundation");

const root = $.NSFileManager.defaultManager.currentDirectoryPath.js;
const read = function (path) {
    const text = $.NSString.stringWithContentsOfFileEncodingError(
        root + "/" + path, $.NSUTF8StringEncoding, null);
    if (text.isNil()) throw new Error("讀不到檔案：" + path);
    return ObjC.unwrap(text);
};

const tests = [];
globalThis.test = function (name, fn) { tests.push({ name: name, fn: fn }); };
globalThis.assertEqual = function (actual, expected, label) {
    const a = JSON.stringify(actual), e = JSON.stringify(expected);
    if (a !== e) throw new Error((label || "assertEqual") + "\n    期望 " + e + "\n    實際 " + a);
};

const lines = [];
let passed = 0, failed = 0;

try {
    (0, eval)(read("fridgeVisual.js"));
} catch (error) {
    lines.push("載入 fridgeVisual.js 失敗：" + error.message);
}

(0, eval)(read("tests/fridgeVisual.test.js"));

for (const t of tests) {
    try {
        t.fn();
        passed++;
        lines.push("  ok   " + t.name);
    } catch (error) {
        failed++;
        lines.push("  FAIL " + t.name + "\n    " + error.message);
    }
}

lines.push(passed + " passed, " + failed + " failed");
lines.join("\n");
