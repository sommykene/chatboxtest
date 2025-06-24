export const upperCaseFirstLetter = (str: string | undefined): string =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
