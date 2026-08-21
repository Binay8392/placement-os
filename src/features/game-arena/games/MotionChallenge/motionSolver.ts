export type MotionMove = 'up' | 'down' | 'left' | 'right';

const moves: Array<{ move: MotionMove; delta: [number, number] }> = [
  { move: 'up', delta: [-1, 0] },
  { move: 'right', delta: [0, 1] },
  { move: 'down', delta: [1, 0] },
  { move: 'left', delta: [0, -1] },
];

export function indexToPoint(index: number, gridSize: number) {
  return { row: Math.floor(index / gridSize), col: index % gridSize };
}

export function pointToIndex(row: number, col: number, gridSize: number) {
  return row * gridSize + col;
}

export function findShortestPath({
  gridSize,
  start,
  target,
  obstacles,
}: {
  gridSize: number;
  start: number;
  target: number;
  obstacles: number[];
}) {
  const blocked = new Set(obstacles);
  const queue: Array<{ index: number; path: MotionMove[] }> = [{ index: start, path: [] }];
  const visited = new Set([start]);

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) break;
    if (current.index === target) return current.path;
    const point = indexToPoint(current.index, gridSize);

    for (const candidate of moves) {
      const row = point.row + candidate.delta[0];
      const col = point.col + candidate.delta[1];
      if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) continue;
      const next = pointToIndex(row, col, gridSize);
      if (blocked.has(next) || visited.has(next)) continue;
      visited.add(next);
      queue.push({ index: next, path: [...current.path, candidate.move] });
    }
  }

  return null;
}
