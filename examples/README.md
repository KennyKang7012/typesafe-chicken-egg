# 範例：練習 TypeSafe 的 Noul / Score / Choice primitives

每支腳本都可以獨立執行：`node examples/<檔名>.js`（需要專案根目錄的 `.env` 中設有
`TYPESAFE_API_KEY`）。

| 檔案 | Primitive | 學習重點 |
| --- | --- | --- |
| [`noul-and-score-deep-dive.js`](./noul-and-score-deep-dive.js) | Noul、Score | 在同一個 `state` 下平行送出多個獨立判斷：用 Noul 判斷「蛋是否早於雞」與「這是否為真悖論」，用 Score 判斷這個問題偏科學還是偏語意，示範「Ask independent questions over the same state together」的組合方式 |
| [`choice-precise-definitions.js`](./choice-precise-definitions.js) | Choice | 示範用更精確的 criteria 描述重新定義問題本身——選項不是「先有雞/先有蛋」，而是兩種「雞蛋」的定義方式，讓模型判斷哪個定義能給出無矛盾的答案 |

想練習單一 primitive 時，可以參考 [`../index.js`](../index.js)（純 Choice）作為最小範例的起點，再對照這裡的進階組合寫法。
