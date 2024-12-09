import inquirer from "inquirer"

export async function performQuestionQuery(
  questionText,
  options
): Promise<string> {
  const response = await inquirer.prompt([
    {
      type: "list", // Multiple-Choice (List)
      name: "answer",
      message: questionText,
      choices: options,
    },
  ])

  return response.answer // Gibt die ausgewählte Option zurück
}
