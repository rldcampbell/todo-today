const URL_PATTERN = /(https?:\/\/[^\s]+)/g
export const extractLinks = (text: string) => {
  return Array.from(text.matchAll(URL_PATTERN), (match) => match[0])
}
