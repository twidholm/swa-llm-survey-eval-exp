export function proportionAgreement(matrix: number[][]): number {
  // Gesamtanzahl der Beobachtungen
  const total = matrix.flat().reduce((sum, val) => sum + val, 0)

  // Übereinstimmungen entlang der Hauptdiagonale berechnen
  const agreements = matrix.reduce((sum, row, i) => sum + row[i], 0)

  // Proportion of Agreement berechnen
  const PA = agreements / total

  return PA
}
