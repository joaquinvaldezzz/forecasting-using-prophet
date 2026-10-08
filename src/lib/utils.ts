export { cn } from "cn";

export function formatAsCurrency(int: number) {
  const PHP = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  });

  return PHP.format(int);
}
