import { TypeSafeClient, choice } from '@typesafe-ai/sdk';
import 'dotenv/config';

const STATE = `
「先有雞還是先有蛋？」這個問題長期爭論不休，關鍵在於「雞蛋」這個詞到底怎麼定義：

定義 A：雞蛋＝雞生的蛋（蛋的親代必須是雞這個物種）
定義 B：雞蛋＝孵出雞的蛋（蛋裡孵出來的個體是雞，不論生下這顆蛋的親代是不是雞）

演化生物學指出：雞這個物種是從非雞的祖先物種經過基因突變演化而來，而這個突變
發生在受精卵（蛋內的胚胎）階段，不是發生在已孵化的個體身上。因此第一隻「雞」
是由一對非雞的親代所生下的蛋孵化出來的。
`.trim();

async function main() {
  const client = new TypeSafeClient();

  const response = await client.systemOne({
    state: STATE,
    model: 'jev-latest',
    questions: {
      which_definition_answers_it: choice(
        '要終結「先有雞還是先有蛋」這個問題，哪一種「雞蛋」定義能給出明確、無矛盾的答案？',
        {
          '雞蛋＝雞生的蛋': '若採此定義，蛋的親代必須是雞，因此必須先有雞才能生出雞蛋——答案會是「先有雞」，但這個定義本身其實預設了雞不是從蛋演化來的，忽略了物種演化的連續性',
          '雞蛋＝孵出雞的蛋': '若採此定義，只要孵化出來的是雞就算雞蛋，不論親代是不是雞——因為基因突變發生在蛋內，這顆蛋在孵化前就已經是「雞蛋」了，而牠孵化出的雞個體還不存在——答案會是「先有蛋」，且與演化事實一致',
        }
      ),
    },
  });

  const answer = response.answers.which_definition_answers_it;

  console.log('='.repeat(60));
  console.log('🥚🐔 用更精確的定義重新問一次');
  console.log('='.repeat(60));
  console.log(`\n哪個定義更站得住腳：${answer.choice}`);
  console.log(`置信度：${(answer.confidence * 100).toFixed(1)}%\n`);
  console.log('機率分佈:');
  for (const [option, probability] of Object.entries(answer.probabilities)) {
    const bar = '█'.repeat(Math.round(probability * 20));
    console.log(`  ${option}: ${(probability * 100).toFixed(1)}% ${bar}`);
  }
  console.log('='.repeat(60));
}

main().catch((error) => {
  console.error('❌ 發生錯誤:', error.message);
  if (error.response) console.error('錯誤詳情:', error.response.data);
});
