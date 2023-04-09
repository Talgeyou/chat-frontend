export function exhaustiveCheck(variable: never): any {
  throw new Error(`Unhandled variable`);
}
