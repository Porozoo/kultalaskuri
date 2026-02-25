/**
 * Muotoilee numeron suomalaiseen valuuttamuotoon (esim. 1 234,56)
 */
export const formatEur = (num: number): string =>
  num.toLocaleString('fi-FI', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });