export const calculateMacros = (tdee, goal, weight) => {
  // Protein range: 1.2g to 2g per kilogram (user can choose within range)
  const proteinMin = Math.round(weight * 1.2)
  const proteinMax = Math.round(weight * 2.0)
  const proteinTarget = Math.round(weight * 1.6) // Default middle point

  // Carbs and fats are calculated from remaining calories after protein
  const proteinCalories = proteinTarget * 4
  const remainingCalories = tdee - proteinCalories

  // Carbs get 50% of remaining, Fats get 50% of remaining
  const carbs = Math.round((remainingCalories * 0.5) / 4)
  const fats = Math.round((remainingCalories * 0.5) / 9)

  return {
    protein: {
      min: proteinMin,
      max: proteinMax,
      target: proteinTarget,
    },
    carbs,
    fats,
  }
}
