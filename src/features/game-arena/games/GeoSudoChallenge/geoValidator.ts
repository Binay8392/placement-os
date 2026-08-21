export function validateGeoSudoBoard(board: string[], solution: string[]) {
  if (board.length !== solution.length) return false;
  return board.every((value, index) => value === solution[index]);
}
