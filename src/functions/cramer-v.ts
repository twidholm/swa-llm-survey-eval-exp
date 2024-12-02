export function cramersV(observed: number[][]): number {
  const total = observed.flat().reduce((sum, val) => sum + val, 0) // Gesamtanzahl der Beobachtungen
  const rowTotals = observed.map((row) =>
    row.reduce((sum, val) => sum + val, 0)
  ) // Zeilensummen
  const colTotals = observed[0].map(
    (_, colIndex) => observed.reduce((sum, row) => sum + row[colIndex], 0) // Spaltensummen
  )

  // Erwartete Häufigkeiten berechnen
  const expected = observed.map((row, rowIndex) =>
    row.map(
      (_, colIndex) => (rowTotals[rowIndex] * colTotals[colIndex]) / total
    )
  )

  // Chi-Quadrat-Wert berechnen
  const chiSquare = observed.reduce(
    (chi, row, rowIndex) =>
      chi +
      row.reduce((sum, observedValue, colIndex) => {
        const expectedValue = expected[rowIndex][colIndex]
        return sum + Math.pow(observedValue - expectedValue, 2) / expectedValue
      }, 0),
    0
  )

  // Anzahl der Zeilen und Spalten
  const rows = observed.length
  const cols = observed[0].length

  // Cramér's V berechnen
  const minDim = Math.min(rows - 1, cols - 1)
  const cramersV = Math.sqrt(chiSquare / (total * minDim))

  return cramersV
}
