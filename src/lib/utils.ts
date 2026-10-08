export { cn } from "cn";

const phpCurrencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

/**
 * Formats a given number as a currency string in Philippine Peso (PHP).
 *
 * @param int The number to format as currency.
 * @returns A string representing the formatted currency.
 */
export function formatAsCurrency(int: number): string {
  return phpCurrencyFormatter.format(int);
}
