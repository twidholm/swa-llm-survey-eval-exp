function cohensKappa(matrix: number[][]): number {
  // Gesamtanzahl der Beobachtungen
  const total = matrix.flat().reduce((sum, val) => sum + val, 0)

  // Proportional beobachtete Übereinstimmung (P_o)
  const observedAgreement = matrix.reduce((sum, row, i) => sum + row[i], 0)
  const P_o = observedAgreement / total

  // Randverteilungen berechnen
  const rowTotals = matrix.map((row) => row.reduce((sum, val) => sum + val, 0))
  const colTotals = matrix[0].map((_, j) =>
    matrix.reduce((sum, row) => sum + row[j], 0)
  )

  // Proportional erwartete Übereinstimmung (P_e)
  const P_e = rowTotals.reduce(
    (sum, rowTotal, i) => sum + (rowTotal * colTotals[i]) / (total * total),
    0
  )

  // Cohen's Kappa berechnen
  const kappa = (P_o - P_e) / (1 - P_e)

  return kappa
}
