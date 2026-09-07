/**
 * Integer-cents money helpers.
 *
 * All order arithmetic must run in integer cents. Doing it in floats and only
 * converting at the end (the previous approach) accumulates drift once tax
 * multipliers are involved.
 */

/** Converts a Prisma Decimal / number / string dollar amount to integer cents. */
export const toCents = (amount: { toString(): string } | number): number => {
  const asString = typeof amount === "number" ? amount.toString() : amount.toString();
  const parsed = Number(asString);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Cannot convert to cents: ${asString}`);
  }
  return Math.round(parsed * 100);
};

/** Converts integer cents back to a 2-decimal string suitable for Prisma Decimal. */
export const centsToDecimalString = (cents: number): string => {
  if (!Number.isInteger(cents)) {
    throw new Error(`Expected integer cents, got ${cents}`);
  }
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  return `${sign}${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, "0")}`;
};

/** Formats integer cents for display in Canadian dollars. */
export const formatCents = (cents: number): string =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(cents / 100);

/**
 * Multiplies cents by a rate expressed in micros (rate * 1_000_000), rounding
 * half-up. Keeping the rate as an integer avoids binary-float representation
 * error for awkward rates such as Quebec's 9.975%.
 */
export const applyRateMicros = (cents: number, rateMicros: number): number =>
  Math.round((cents * rateMicros) / 1_000_000);
