# typesafe-chicken-egg

用 [TypeSafe](https://typesafe.ai/) 的型別化 AI primitives（Choice / Noul / Score）
回答「先有雞還是先有蛋？」這個經典問題——示範如何把一個開放式的自然語言問題，變成
程式碼可以直接消費的結構化判斷（選項、機率分佈、置信度）。

## 這個專案在做什麼

TypeSafe 的 **System One** 模型（旗艦模型 `jev-latest`）不是用來生成文字，而是回傳
**型別化的答案**：給定一段 `state`（上下文文本）與一組 `questions`（每個問題定義
`instructions` 和 `criteria`），模型回傳每個問題的答案、置信度與機率分佈，讓程式碼
直接使用，而不用再自己解析自由文字。

本專案用這個問題當範例，展示三種 primitive：

| Primitive | 用途 | 對應答案格式 |
| --- | --- | --- |
| **Choice** | 從多個選項中選一個 | `choice`、`confidence`、`probabilities`（每個選項的機率） |
| **Noul** | 判斷「是否成立」的是非題 | `noul`（0~1 之間，1 代表「是」的機率） |
| **Score** | 沿著一組有序的程度描述評分 | `score`、`confidence`、`probabilities`（每個等級的機率） |

## 專案結構

```
index.js                 核心 demo：用 Choice 問「先有雞還是先有蛋」
interactive.js            互動式 CLI：連續輸入任意問題 + 選項，即時取得判斷
format.js                 共用的格式化/解析邏輯（機率長條圖、置信度文字、選項解析）
format.test.js            format.js 的單元測試（不呼叫真實 API）
examples/                 進階範例：Noul、Score，以及更精確定義的 Choice
  noul-and-score-deep-dive.js
  choice-precise-definitions.js
  README.md
docs/plan/expansion-plan.md   專案擴充規劃文件
```

## 開始使用

### 1. 安裝依賴

```bash
npm install
```

### 2. 設定 API Key

複製 `.env.example` 成 `.env`，填入你的 TypeSafe API Key（可在
[console.typesafe.ai/keys](https://console.typesafe.ai/keys) 取得）：

```bash
cp .env.example .env
```

```
TYPESAFE_API_KEY=你的 API Key
```

### 3. 執行

```bash
# 執行核心 demo：先有雞還是先有蛋？
npm start

# 互動式問答：自己輸入問題與選項
npm run interactive

# 執行測試（不需要 API Key）
npm test

# 執行進階範例
node examples/noul-and-score-deep-dive.js
node examples/choice-precise-definitions.js
```

## 範例輸出

```
==================================================
🥚 先有雞還是先有蛋？🐔
==================================================

答案：先有蛋
置信度：97.0%

機率分佈:
  先有蛋: 98.0% ████████████████████
  先有雞: 0.0%
  無法判斷: 2.0%

✅✅ 模型有高度置信度
==================================================
```

## 延伸閱讀

- [TypeSafe 文件](https://docs.typesafe.ai/)
- [JavaScript SDK](https://docs.typesafe.ai/sdk/javascript.md)
- [Primitives 說明](https://docs.typesafe.ai/primitives.md)
- [examples/README.md](examples/README.md) — 各範例對應的 primitive 與學習重點
- [docs/plan/expansion-plan.md](docs/plan/expansion-plan.md) — 專案擴充規劃

## 授權

本專案為練習用途，未特別標註授權。
