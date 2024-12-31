export function calculateProportionAgreement(
  model: number[],
  human: number[]
): number {
  let agreements = 0
  for (let i = 0; i < model.length; i++) {
    if (Math.round(model[i]) === Math.round(human[i])) agreements++
  }
  return agreements / model.length
}
