import v from 'voca'

export const capitalize = (string) => {
  const words = string.split(' ')
  const capitalizeWords = words.map((word) => v.capitalize(word, true))
  return capitalizeWords.join(' ')
}

export const uppercase = (string) => {
  return v.upperCase(string)
}
