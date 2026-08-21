export function compareCellSets(answer: string[], target: string[]) {
  const answerSet = new Set(answer);
  const targetSet = new Set(target);
  return answer.length === target.length && answer.every((cell) => targetSet.has(cell)) && target.every((cell) => answerSet.has(cell));
}
