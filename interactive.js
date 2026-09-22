import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { TypeSafeClient, choice } from '@typesafe-ai/sdk';
import 'dotenv/config';
import { formatProbabilityBar, formatConfidenceMessage, parseChoiceOptions } from './format.js';

async function askQuestion(client, rl) {
  const questionText = await rl.question('\n問題（直接 Enter 或輸入 exit 結束）：');
  if (!questionText.trim() || questionText.trim().toLowerCase() === 'exit') {
    return false;
  }

  const optionsText = await rl.question('選項（用 | 分隔，至少 2 個，例如：是|否|不確定）：');
  const criteria = parseChoiceOptions(optionsText);

  if (Object.keys(criteria).length < 2) {
    console.log('⚠️  至少需要 2 個選項，請重新輸入。');
    return true;
  }

  const response = await client.systemOne({
    state: '',
    questions: { answer: choice(questionText, criteria) },
    model: 'jev-latest',
  });

  const answer = response.answers.answer;

  console.log(`\n答案：${answer.choice}`);
  console.log(`置信度：${(answer.confidence * 100).toFixed(1)}%`);
  console.log('機率分佈:');
  for (const [option, probability] of Object.entries(answer.probabilities)) {
    console.log(`  ${option}: ${(probability * 100).toFixed(1)}% ${formatProbabilityBar(probability)}`);
  }
  console.log(formatConfidenceMessage(answer.confidence));

  return true;
}

async function main() {
  if (!process.env.TYPESAFE_API_KEY) {
    console.error('❌ 錯誤：未設定 TYPESAFE_API_KEY 環境變數');
    console.error('請檢查 .env 檔案是否正確設定');
    return;
  }

  const client = new TypeSafeClient();
  const rl = createInterface({ input: stdin, output: stdout });

  console.log('='.repeat(50));
  console.log('🤖 TypeSafe 互動式問答');
  console.log('='.repeat(50));

  try {
    let keepGoing = true;
    while (keepGoing) {
      keepGoing = await askQuestion(client, rl);
    }
  } catch (error) {
    console.error('❌ 發生錯誤:', error.message);
  } finally {
    rl.close();
  }

  console.log('\n再見！');
}

main();
