export function formatProbabilityBar(probability, width = 20) {
  return '█'.repeat(Math.round(probability * width));
}

export function formatConfidenceMessage(confidence) {
  if (confidence < 0.5) {
    return '⚠️  模型的置信度較低，這可能是一個有爭議的問題';
  }
  if (confidence < 0.8) {
    return '✅ 模型有中等置信度';
  }
  return '✅✅ 模型有高度置信度';
}

export function parseChoiceOptions(input) {
  const options = input
    .split('|')
    .map((option) => option.trim())
    .filter((option) => option.length > 0);

  const criteria = {};
  for (const option of options) {
    criteria[option] = null;
  }
  return criteria;
}
