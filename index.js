import { TypeSafeClient, choice } from '@typesafe-ai/sdk';
import 'dotenv/config';

// 禁用 SSL 證書驗證（僅限開發環境）
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// 定義「先有雞還是先有蛋」的問題
const CHICKEN_EGG_QUESTIONS = {
  origin: choice(
    '先有雞還是先有蛋？從科學和哲學角度判斷',
    {
      '先有蛋': '蛋這種生殖方式在演化上早於鳥類出現',
      '先有雞': '雞作為物種在蛋之前存在',
      '無法判斷': '這是一個循環問題或無法確定',
    }
  ),
};

async function answerChickenEggQuestion() {
  try {
    // 檢查 API Key 是否已設定
    if (!process.env.TYPESAFE_API_KEY) {
      console.error('❌ 錯誤：未設定 TYPESAFE_API_KEY 環境變數');
      console.error('請檢查 .env 檔案是否正確設定');
      return;
    }

    console.log('🔑 API Key 已載入（隱藏）');
    console.log(`📍 API Key 長度：${process.env.TYPESAFE_API_KEY.length} 字元\n`);

    // 建立 TypeSafe 客戶端
    const client = new TypeSafeClient();
    // const client = new TypeSafeClient({
    //   apiKey: process.env.TYPESAFE_API_KEY,
    // });

    // 發送請求到 Jev 模型
    const response = await client.systemOne({
      state: '', // 這個問題不需要額外上下文
      questions: CHICKEN_EGG_QUESTIONS,
      model: 'jev-latest', // TypeSafe 的旗艦模型
    });

    // 取得答案
    const answer = response.answers.origin;

    console.log('='.repeat(50));
    console.log('🥚 先有雞還是先有蛋？🐔');
    console.log('='.repeat(50));
    console.log(`\n答案：${answer.choice}`);
    console.log(`置信度：${(answer.confidence * 100).toFixed(1)}%`);
    console.log('\n機率分佈:');

    for (const [option, probability] of Object.entries(answer.probabilities)) {
      const bar = '█'.repeat(Math.round(probability * 20));
      console.log(`  ${option}: ${(probability * 100).toFixed(1)}% ${bar}`);
    }

    // 根據置信度提供建議
    if (answer.confidence < 0.5) {
      console.log('\n⚠️  模型的置信度較低，這可能是一個有爭議的問題');
    } else if (answer.confidence < 0.8) {
      console.log('\n✅ 模型有中等置信度');
    } else {
      console.log('\n✅✅ 模型有高度置信度');
    }

    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ 發生錯誤:', error.message);
    if (error.response) {
      console.error('錯誤詳情:', error.response.data);
    }
  }
}

// 執行問題
answerChickenEggQuestion();
