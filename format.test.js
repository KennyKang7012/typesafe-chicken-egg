import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatProbabilityBar, formatConfidenceMessage, parseChoiceOptions } from './format.js';

test('formatProbabilityBar draws a bar proportional to the probability', () => {
  assert.equal(formatProbabilityBar(0), '');
  assert.equal(formatProbabilityBar(0.5), '█'.repeat(10));
  assert.equal(formatProbabilityBar(1), '█'.repeat(20));
});

test('formatProbabilityBar respects a custom width', () => {
  assert.equal(formatProbabilityBar(1, 5), '█'.repeat(5));
});

test('formatConfidenceMessage reports low confidence below 0.5', () => {
  assert.match(formatConfidenceMessage(0.2), /較低/);
});

test('formatConfidenceMessage reports medium confidence between 0.5 and 0.8', () => {
  assert.match(formatConfidenceMessage(0.6), /中等/);
});

test('formatConfidenceMessage reports high confidence at or above 0.8', () => {
  assert.match(formatConfidenceMessage(0.9), /高度/);
});

test('parseChoiceOptions splits a pipe-separated string into criteria', () => {
  assert.deepEqual(parseChoiceOptions('先有雞|先有蛋|無法判斷'), {
    先有雞: null,
    先有蛋: null,
    無法判斷: null,
  });
});

test('parseChoiceOptions trims whitespace and drops empty entries', () => {
  assert.deepEqual(parseChoiceOptions(' A | B ||C '), {
    A: null,
    B: null,
    C: null,
  });
});
