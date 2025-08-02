export const formatToCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined) {
    return "$0.00";
  }
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};
