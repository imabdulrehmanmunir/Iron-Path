/**
 * Calculate Basal Metabolic Rate (BMR)
 * Uses Mifflin-St Jeor formula
 */
export const calculateBMR = (weight, height, age, gender) => {
  // weight in kg, height in cm, age in years
  if (gender.toLowerCase() === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161
  }
}

/**
 * Calculate Total Daily Energy Expenditure (TDEE)
 * Multiplies BMR by activity factor
 */
export const calculateTDEE = (bmr, activityLevel) => {
  const activityFactors = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryactive: 1.9,
  }

  const factor = activityFactors[activityLevel.toLowerCase()] || 1.55
  return Math.round(bmr * factor)
}
