# TypeSafe Chicken-Egg 專案擴充規劃

> 狀態：規劃階段，尚未開始實作。

## 背景

`typesafe-chicken-egg` 是一個用 [`@typesafe-ai/sdk`](https://docs.typesafe.ai/sdk/javascript.md)
探討「先有雞還是先有蛋」問題的示範專案。目前已有：

- [`index.js`](../../index.js)：核心 demo，用 `choice()` 問「先有雞還是先有蛋」，印出
  choice / confidence / probabilities。
- [`explore.js`](../../explore.js)：用 `noul()` + `score()` + `noul()` 三個平行問題，
  深入探討「蛋是否早於雞」「這是科學問題還是語意問題」「是否構成真正的邏輯悖論」。
- [`choice-redefined.js`](../../choice-redefined.js)：用更精確的 `choice()` 重新定義
  「雞蛋」，比較「雞生的蛋」vs「孵出雞的蛋」兩種定義何者更站得住腳。
- `package.json`：只有一個 `start` script（`node index.js`），沒有測試指令，也沒有
  互動式介面。

接下來要把這個示範專案擴充成更完整、更好維護、也更適合當作學習 TypeSafe primitives
（Choice / Noul / Score）的專案骨架。本文件記錄三項擴充規劃，作為後續實作的依據與
追蹤記錄。

## 規劃項目

### 1. 互動式輸入

**目標**：讓使用者在終端機輸入任意問題文字，即時取得 TypeSafe 判斷，不必修改程式碼
重跑。

**做法**：
- 新增 `interactive.js`，用 Node 內建 `node:readline/promises` 建立輸入迴圈。
- 使用者輸入問題文字後，包成 `choice()`（可讓使用者用簡化語法定義選項，例如
  `選項A|選項B|選項C`）送給 `client.systemOne`，印出結果（choice / confidence /
  probabilities，沿用 `index.js` 現有的長條圖輸出風格）。
- 輸入空字串或 `exit` 結束迴圈，正常關閉 readline 介面。
- 在 `package.json` 新增對應 script，例如 `"interactive": "node interactive.js"`。

**牽涉檔案**：新增 `interactive.js`；修改 `package.json`（新增 script）。

**驗收方式**：`npm run interactive` 能連續問多次問題並得到合理輸出，輸入 `exit`
能正常結束、不留下懸掛的 process。

### 2. 加入測試

**目標**：在不呼叫真實 API（不消耗額度、不需網路）的前提下驗證程式邏輯正確性。

**做法**：
- 使用 Node 內建的 `node --test`（專案已是 `type: module`，不需額外安裝測試框架）。
- 將可測試的邏輯抽成獨立可匯出的 pure function，例如：
  - 機率分佈轉長條圖字串的格式化邏輯
  - confidence 高/中/低的分級文字邏輯
  - `interactive.js` 的輸入解析邏輯（例如 `選項A|選項B|選項C` 字串轉成 `choice()` 的
    criteria 物件）
- 測試中對 `TypeSafeClient.prototype.systemOne` 做輕量 mock/stub，避免真實網路呼叫，
  也避免測試依賴 `.env` 中的真實 API Key。

**牽涉檔案**：新增 `*.test.js`（例如 `format.test.js`、`interactive.test.js`）；
視需要把目前寫在 `index.js` 裡的格式化邏輯抽成獨立模組（例如 `format.js`）以便匯出測試。

**驗收方式**：新增 `npm test` script 執行 `node --test`，全部通過，且不需要真實
API Key 也能跑。

### 3. 整理 Noul/Score 練習範例

**目標**：把目前散落在根目錄的探索腳本整理成專案裡正式、可持續擴充的範例集合。

**做法**：
- 新增 `examples/` 目錄，將現有兩支腳本移入並依 primitive 類型/主題重新命名：
  - `examples/noul-and-score-deep-dive.js`（原 `explore.js`）
  - `examples/choice-precise-definitions.js`（原 `choice-redefined.js`）
- 視需要新增 1–2 個聚焦單一 primitive 的最小範例，方便單獨練習，例如：
  - 純 Noul 練習（單一是非判斷）
  - 純 Score 練習（單一程度評分）
- 新增 `examples/README.md`，列出每個範例對應的 primitive 與學習重點，方便之後回顧。

**牽涉檔案**：新增 `examples/` 目錄與其中的腳本、`examples/README.md`；移除根目錄下
原本的 `explore.js`、`choice-redefined.js`（改為移入 `examples/` 並重新命名）。

**驗收方式**：`examples/` 目錄下每支腳本都能獨立以 `node examples/<file>.js` 執行成功。

## 建議執行順序

1. **加入測試基礎設施**（第 2 項）——先把測試機制建好，之後搬動/重構範例腳本時才有
   保護網，不容易壞掉。
2. **互動式輸入**（第 1 項）——在測試基礎設施之上開發新功能，可同步補測試。
3. **整理 Noul/Score 練習範例**（第 3 項）——最後再搬動、重新命名既有腳本，並補上
   `examples/README.md`。

## 驗證方式

- 三個項目各自的驗收方式如上所述。
- 全部完成後執行 `npm test`、`npm start`、`npm run interactive`、以及
  `examples/` 下每支腳本，確認皆可正常執行。
