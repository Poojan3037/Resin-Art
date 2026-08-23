import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  CANADIAN_PROVINCES,
  PROVINCE_TAX_RATES,
  calculateCanadianTax,
  type ProvinceCode,
} from "../canada";
import { applyRateMicros, centsToDecimalString, toCents } from "../../money";

const enableTax = () => vi.stubEnv("TAX_ENABLED", "true");

beforeEach(() => {
  vi.unstubAllEnvs();
});

describe("tax gate", () => {
  it("collects nothing when TAX_ENABLED is unset", () => {
    const result = calculateCanadianTax({ taxableCents: 10_000, province: "ON" });
    expect(result.enabled).toBe(false);
    expect(result.totalTaxCents).toBe(0);
    expect(result.lines).toEqual([]);
  });

  it("collects nothing when TAX_ENABLED is explicitly false", () => {
    vi.stubEnv("TAX_ENABLED", "false");
    expect(calculateCanadianTax({ taxableCents: 10_000, province: "ON" }).totalTaxCents).toBe(0);
  });
});

describe("provincial rates on $100.00", () => {
  // Expected total tax in cents on a $100.00 subtotal.
  const expected: Record<ProvinceCode, number> = {
    AB: 500,    // GST 5
    NT: 500,
    NU: 500,
    YT: 500,
    BC: 1200,   // 5 + 7
    MB: 1200,   // 5 + 7
    SK: 1100,   // 5 + 6
    QC: 1498,   // GST 500 + QST 998 (997.5 rounded half-up)
    ON: 1300,
    NB: 1500,
    NL: 1500,
    PE: 1500,
    NS: 1400,   // reduced from 15% on 2025-04-01
  };

  it.each(CANADIAN_PROVINCES)("%s", (province) => {
    enableTax();
    const result = calculateCanadianTax({ taxableCents: 10_000, province });
    expect(result.totalTaxCents).toBe(expected[province]);
    expect(result.province).toBe(province);
  });
});

describe("Quebec QST", () => {
  it("is computed on the pre-GST amount, never compounded", () => {
    enableTax();
    const result = calculateCanadianTax({ taxableCents: 10_000, province: "QC" });
    const gst = result.lines.find((line) => line.type === "GST")!;
    const qst = result.lines.find((line) => line.type === "QST")!;

    expect(gst.amountCents).toBe(500);
    // 9.975% of the SUBTOTAL (997.5 -> 998), not of subtotal + GST (1047.4).
    expect(qst.amountCents).toBe(998);
    expect(qst.amountCents).not.toBe(applyRateMicros(10_500, 99_750));
  });
});

describe("rounding", () => {
  it("rounds each component half-up independently", () => {
    enableTax();
    // 5% of 1 cent = 0.05 -> 0; 9.975% of 1 cent = 0.09975 -> 0
    expect(calculateCanadianTax({ taxableCents: 1, province: "QC" }).totalTaxCents).toBe(0);
    // 13% of 50 cents = 6.5 -> 7 (half-up)
    expect(calculateCanadianTax({ taxableCents: 50, province: "ON" }).totalTaxCents).toBe(7);
  });

  it("sums components without re-rounding the total", () => {
    enableTax();
    const result = calculateCanadianTax({ taxableCents: 3_333, province: "BC" });
    const sum = result.lines.reduce((acc, line) => acc + line.amountCents, 0);
    expect(result.totalTaxCents).toBe(sum);
  });

  it("returns integer cents for every province across many amounts", () => {
    enableTax();
    for (const province of CANADIAN_PROVINCES) {
      for (const cents of [1, 7, 99, 100, 1_234, 99_999, 1_000_000]) {
        const { totalTaxCents } = calculateCanadianTax({ taxableCents: cents, province });
        expect(Number.isInteger(totalTaxCents)).toBe(true);
        expect(totalTaxCents).toBeGreaterThanOrEqual(0);
      }
    }
  });
});

describe("input validation", () => {
  it("refuses an unknown province when tax is enabled", () => {
    enableTax();
    expect(() => calculateCanadianTax({ taxableCents: 100, province: "XX" })).toThrow();
    expect(() => calculateCanadianTax({ taxableCents: 100, province: null })).toThrow();
  });

  it("refuses non-integer or negative amounts", () => {
    enableTax();
    expect(() => calculateCanadianTax({ taxableCents: 10.5, province: "ON" })).toThrow();
    expect(() => calculateCanadianTax({ taxableCents: -1, province: "ON" })).toThrow();
  });

  it("covers every province in the rate table", () => {
    expect(Object.keys(PROVINCE_TAX_RATES).sort()).toEqual([...CANADIAN_PROVINCES].sort());
  });
});

describe("money helpers", () => {
  it("converts dollars to cents without float drift", () => {
    expect(toCents("19.99")).toBe(1999);
    expect(toCents("0.10")).toBe(10);
    expect(toCents(145)).toBe(14_500);
    // 0.1 + 0.2 style drift must not appear
    expect(toCents("1.15")).toBe(115);
  });

  it("round-trips cents to a Decimal string", () => {
    expect(centsToDecimalString(1999)).toBe("19.99");
    expect(centsToDecimalString(5)).toBe("0.05");
    expect(centsToDecimalString(0)).toBe("0.00");
    expect(centsToDecimalString(100)).toBe("1.00");
  });

  it("rejects non-integer cents", () => {
    expect(() => centsToDecimalString(10.5)).toThrow();
  });
});

describe("order total invariant", () => {
  it("subtotal + shipping + tax equals the charged amount", () => {
    enableTax();
    for (const province of CANADIAN_PROVINCES) {
      const subtotal = 12_345;
      const shipping = 0;
      const tax = calculateCanadianTax({ taxableCents: subtotal, province });
      const total = subtotal + shipping + tax.totalTaxCents;
      expect(total).toBe(subtotal + shipping + tax.lines.reduce((a, l) => a + l.amountCents, 0));
      expect(Number.isInteger(total)).toBe(true);
    }
  });
});
