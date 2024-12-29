import readline from "readline"

export async function getStartAndEndIndices(): Promise<{
  start: number
  end: number
}> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const askQuestion = (query: string): Promise<string> =>
    new Promise((resolve) => rl.question(query, resolve))

  const startInput = await askQuestion("Gib den Startwert (Index) ein: ")
  const endInput = await askQuestion("Gib den Endwert (Index) ein: ")

  rl.close()

  const startIndex = parseInt(startInput, 10)
  const endIndex = parseInt(endInput, 10)

  if (isNaN(startIndex) || isNaN(endIndex)) {
    throw new Error("Ungültige Eingaben. Beide Werte müssen Zahlen sein.")
  }

  if (startIndex > endIndex) {
    throw new Error("Startwert muss kleiner oder gleich dem Endwert sein.")
  }

  return { start: startIndex, end: endIndex }
}
