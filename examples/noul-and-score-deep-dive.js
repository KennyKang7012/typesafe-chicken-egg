import { TypeSafeClient, choice, noul, score } from '@typesafe-ai/sdk';
import 'dotenv/config';

const STATE = `
經典問題：「先有雞還是先有蛋？」

科學界普遍接受的演化論解釋是：現代雞（Gallus gallus domesticus）是由某個非雞的祖先物種
經過基因突變演化而來。這個突變發生在生殖細胞形成的那一刻，而不是在個體出生後。也就是說，
第一隻符合「雞」基因定義的個體，是在「蛋」這個容器裡完成基因突變、發育成形的——牠的雙親仍是
非雞物種。換言之，那顆蛋是由「非雞親代」所生下，但蛋裡孵化出來的是第一隻「雞」。

這帶出一個語意上的分歧點：
- 如果「蛋」的定義是「任何鳥類/爬蟲類的蛋」，那麼蛋（這種生殖方式）遠早於雞這個物種存在。
- 如果「蛋」的定義是「雞蛋」（即帶有雞的基因、會孵出雞的蛋），那麼第一顆「雞蛋」與第一隻「雞」
  幾乎同時出現——因為雞的基因突變是發生在蛋內的胚胎階段，所以嚴格來說「雞蛋」比「雞」這個
  孵化出來的個體早一步（在蛋殼內）存在。
`.trim();

async function main() {
  const client = new TypeSafeClient();

  const response = await client.systemOne({
    state: STATE,
    model: 'jev-latest',
    questions: {
      mutation_resolution: noul(
        '根據上述演化生物學的標準解釋，"第一顆帶有雞基因的蛋"（在蛋殼內發生基因突變）是否早於"第一隻孵化出來、可觀察到的雞個體"存在？',
        {
          true: '蛋（帶有雞基因的受精卵）先於孵化出的雞個體存在，因為突變發生在蛋內的胚胎階段',
          false: '雞個體先於帶有雞基因的蛋存在，或兩者無法區分先後',
        }
      ),
      question_nature: score(
        '這整個「先有雞還是先有蛋」的問題，本質上更偏向科學實證問題，還是語意/定義問題？',
        [
          '完全是科學實證問題，只要查證演化生物學事實即可得到明確答案，與定義無關',
          '主要是科學問題，但「蛋」與「雞」的定義方式會影響用詞而非事實本身',
          '科學事實與語意定義大約各佔一半，兩者同等重要',
          '主要取決於你如何定義「蛋」與「雞」的邊界，科學事實只是背景',
          '完全是語意學/哲學問題，科學無法給出答案，純粹是我們如何劃定類別邊界的選擇',
        ]
      ),
      true_paradox: noul(
        '拋開科學上的演化解釋，這個問題在邏輯結構上是否構成一個真正無法解決的悖論（例如類似"這句話是假的"那種自我指涉矛盾）？',
        {
          true: '是真正的邏輯悖論，邏輯上無法給出一致的答案',
          false: '不是真正的邏輯悖論，只是表面上看似循環，實際上可以用演化時間軸和明確定義解決',
        }
      ),
    },
  });

  console.log('='.repeat(60));
  console.log('🥚🐔 深入探討：先有雞還是先有蛋？');
  console.log('='.repeat(60));

  const { mutation_resolution, question_nature, true_paradox } = response.answers;

  console.log('\n【問題一】"雞蛋"（帶雞基因）是否早於孵化出的雞個體存在？');
  console.log(`  → 是（蛋先）的機率：${(mutation_resolution.noul * 100).toFixed(1)}%`);

  console.log('\n【問題二】這是科學問題還是語意問題？（0=純科學, 4=純語意）');
  console.log(`  → 位置分數：${question_nature.score.toFixed(2)} / 4`);
  for (const [level, prob] of Object.entries(question_nature.probabilities)) {
    const bar = '█'.repeat(Math.round(prob * 20));
    console.log(`     [${level}] ${(prob * 100).toFixed(1)}% ${bar}`);
  }

  console.log('\n【問題三】這是否是真正無解的邏輯悖論？');
  console.log(`  → 是真悖論的機率：${(true_paradox.noul * 100).toFixed(1)}%`);

  console.log('\n' + '='.repeat(60));
}

main().catch((error) => {
  console.error('❌ 發生錯誤:', error.message);
  if (error.response) console.error('錯誤詳情:', error.response.data);
});
