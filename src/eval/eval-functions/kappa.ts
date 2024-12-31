export function calculateCohensKappa(model: number[], human: number[]): number {
  const total = model.reduce((a, b) => a + b, 0)
  const observed =
    model.reduce((sum, val, i) => sum + Math.min(val, human[i]), 0) / total

  const modelProp = model.map((v) => v / total)
  const humanProp = human.map((v) => v / total)
  const expected = modelProp.reduce((sum, p, i) => sum + p * humanProp[i], 0)

  const result = (observed - expected) / (1 - expected)

  if (result === null || Number.isNaN(result)) {
    return 0
  }
  return result
}
