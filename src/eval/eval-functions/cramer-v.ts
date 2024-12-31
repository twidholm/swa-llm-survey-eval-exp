import { sum, transpose } from "mathjs"

export function calculateCramersV(model: number[], human: number[]): number {
  if (model.length !== human.length) {
    return 0
  }
  const total = sum(model) + sum(human)
  const matrix = [model, human]

  const rowSums = matrix.map((row) => sum(row))
  const colSums = transpose(matrix).map((col) => sum(col as number[]))

  let chiSquare = 0
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const expected = (rowSums[i] * colSums[j]) / total
      chiSquare += expected
        ? Math.pow(matrix[i][j] - expected, 2) / expected
        : 0
    }
  }

  const minDim = Math.min(matrix.length - 1, matrix[0].length - 1)
  return Math.sqrt(chiSquare / (total * minDim))
}
