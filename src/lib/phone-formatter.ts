export const formatCanadianPhone = (value: string) => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, "");

  // Remove leading 1 if user types country code
  const cleaned = digits.startsWith("1") ? digits.slice(1) : digits;

  const parts = [];

  if (cleaned.length > 0) {
    parts.push(cleaned.slice(0, 3));
  }
  if (cleaned.length >= 4) {
    parts.push(cleaned.slice(3, 6));
  }
  if (cleaned.length >= 7) {
    parts.push(cleaned.slice(6, 10));
  }

  return parts.join("-");
};
