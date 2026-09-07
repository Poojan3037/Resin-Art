import { applyRateMicros } from "@/lib/money";

/**
 * Canadian sales tax engine.
 *
 * Rates are expressed in micros (percent/100 * 1_000_000) so that Quebec's
 * 9.975% QST is exact integer data rather than a binary float.
 *
 * IMPORTANT — verify against CRA / provincial sources before enabling:
 *   https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-which-rate.html
 * Rates change. Nova Scotia's HST dropped 15% -> 14% on 2025-04-01.
 * Last reviewed: 2026-08.
 */

export const CANADIAN_PROVINCES = [
  "AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT",
] as const;

export type ProvinceCode = (typeof CANADIAN_PROVINCES)[number];

export type TaxComponentType = "GST" | "HST" | "PST" | "RST" | "QST";

type ProvinceRatesType = {
  /** Components applied to the pre-tax subtotal. */
  components: Array<{ type: TaxComponentType; rateMicros: number }>;
};

const GST = { type: "GST" as const, rateMicros: 50_000 }; // 5%

export const PROVINCE_TAX_RATES: Record<ProvinceCode, ProvinceRatesType> = {
  // GST only
  AB: { components: [GST] },
  NT: { components: [GST] },
  NU: { components: [GST] },
  YT: { components: [GST] },

  // GST + provincial retail tax.
  // Note: since 2013 QST is calculated on the PRE-GST amount, so these
  // components are all applied to the subtotal and never compounded.
  BC: { components: [GST, { type: "PST", rateMicros: 70_000 }] },   // 5 + 7
  MB: { components: [GST, { type: "RST", rateMicros: 70_000 }] },   // 5 + 7
  SK: { components: [GST, { type: "PST", rateMicros: 60_000 }] },   // 5 + 6
  QC: { components: [GST, { type: "QST", rateMicros: 99_750 }] },   // 5 + 9.975

  // HST (single harmonized rate)
  ON: { components: [{ type: "HST", rateMicros: 130_000 }] }, // 13%
  NB: { components: [{ type: "HST", rateMicros: 150_000 }] }, // 15%
  NL: { components: [{ type: "HST", rateMicros: 150_000 }] }, // 15%
  PE: { components: [{ type: "HST", rateMicros: 150_000 }] }, // 15%
  NS: { components: [{ type: "HST", rateMicros: 140_000 }] }, // 14% since 2025-04-01
};

export type TaxLineType = {
  type: TaxComponentType;
  rateMicros: number;
  amountCents: number;
};

export type TaxResultType = {
  province: ProvinceCode | null;
  totalTaxCents: number;
  /** Frozen snapshot of the rates used, persisted with the order for audit. */
  lines: TaxLineType[];
  enabled: boolean;
};

/**
 * True only when the business is GST/HST registered. Defaults to false: under
 * the CRA $30k small-supplier threshold a business must NOT collect tax, so
 * collecting before registering is itself non-compliant.
 */
export const isTaxEnabled = (): boolean => process.env.TAX_ENABLED === "true";

export const isProvinceCode = (value: string): value is ProvinceCode =>
  (CANADIAN_PROVINCES as readonly string[]).includes(value);

/**
 * Calculates tax on a pre-tax subtotal for a given province.
 *
 * Each component is rounded half-up independently and then summed; the total
 * is never re-rounded. `taxableCents` should exclude shipping unless the
 * business has confirmed shipping is taxable in its situation.
 */
export const calculateCanadianTax = ({
  taxableCents,
  province,
}: {
  taxableCents: number;
  province: string | null | undefined;
}): TaxResultType => {
  if (!isTaxEnabled()) {
    return { province: null, totalTaxCents: 0, lines: [], enabled: false };
  }

  if (!province || !isProvinceCode(province)) {
    throw new Error(`Cannot calculate tax for unknown province: ${province}`);
  }

  if (!Number.isInteger(taxableCents) || taxableCents < 0) {
    throw new Error(`Invalid taxable amount: ${taxableCents}`);
  }

  const lines = PROVINCE_TAX_RATES[province].components.map((component) => ({
    type: component.type,
    rateMicros: component.rateMicros,
    amountCents: applyRateMicros(taxableCents, component.rateMicros),
  }));

  return {
    province,
    totalTaxCents: lines.reduce((sum, line) => sum + line.amountCents, 0),
    lines,
    enabled: true,
  };
};
