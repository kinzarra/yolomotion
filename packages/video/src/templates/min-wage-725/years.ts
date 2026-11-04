// The data of the reel. $7.25 an hour (federal minimum since July 24, 2009)
// re-priced into July-2009 dollars with BLS CPI-U (CUUR0000SA0, all urban
// consumers, not seasonally adjusted): July of each year, the anniversary of
// the raise; 2026 is the latest month published (September). Every amount on
// screen comes from these two numbers and is paid out as real cash: whole $1
// notes plus the fewest coins.

export const BASE_CPI = 215.351; // July 2009
export const WAGE_CENTS = 725;

export type Coin = "quarter" | "dime" | "nickel" | "penny";

export type Year = {
  year: number;
  label?: string; // shown under the year instead of the yearly change
  cpi: number;
  event?: { clip: string; title: string; sub: string };
};

export const YEARS: readonly Year[] = [
  { year: 2009, cpi: 215.351 },
  { year: 2010, cpi: 218.011 },
  { year: 2011, cpi: 225.922, event: { clip: "window", title: "FIRST $1 GONE", sub: "2 YEARS IN" } },
  { year: 2012, cpi: 229.104 },
  { year: 2013, cpi: 233.596 },
  { year: 2014, cpi: 238.25 },
  { year: 2015, cpi: 238.654 },
  { year: 2016, cpi: 240.628 },
  { year: 2017, cpi: 244.786 },
  { year: 2018, cpi: 252.006 },
  { year: 2019, cpi: 256.571 },
  { year: 2020, cpi: 259.101 },
  // BLS: CPI-U December 2021 vs December 2020, +7.0%
  { year: 2021, cpi: 273.003, event: { clip: "cart", title: "PRICES +7% IN A YEAR", sub: "DEC 2021 · BLS" } },
  // AAA: national average first hit $5.00 a gallon on June 11, 2022
  { year: 2022, cpi: 296.276, event: { clip: "gas", title: "GAS HITS $5 A GALLON", sub: "JUNE 2022 · AAA" } },
  { year: 2023, cpi: 305.691 },
  { year: 2024, cpi: 314.54, event: { clip: "counter", title: "UNDER $5 AN HOUR", sub: "IN 2009 DOLLARS" } },
  { year: 2025, cpi: 323.048 },
  { year: 2026, cpi: 336.94, label: "SEPT 2026" },
];

/** $7.25 in July-2009 cents at a given CPI. */
export const realCents = (cpi: number) => Math.round((WAGE_CENTS * BASE_CPI) / cpi);

const DENOMS: readonly [Coin, number][] = [
  ["quarter", 25],
  ["dime", 10],
  ["nickel", 5],
  ["penny", 1],
];

/** Whole $1 notes plus the fewest coins, biggest first. */
export const cash = (cents: number) => {
  const bills = Math.floor(cents / 100);
  let rest = cents - bills * 100;
  const coins: Coin[] = [];
  for (const [kind, v] of DENOMS) {
    while (rest >= v) {
      coins.push(kind);
      rest -= v;
    }
  }
  return { bills, coins };
};

export const CENTS = YEARS.map((y) => realCents(y.cpi));
export const FINAL_CENTS = CENTS[CENTS.length - 1]; // 463 → $4.63
export const FINAL_DROP = Math.round((1 - FINAL_CENTS / WAGE_CENTS) * 100); // 36 → −36%

/** Change of real value against the year before, in % (one decimal). */
export const yearlyChange = (i: number) =>
  i === 0 ? 0 : Math.round(((YEARS[i - 1].cpi / YEARS[i].cpi) - 1) * 1000) / 10;

export const usd = (cents: number) => `$${(cents / 100).toFixed(2)}`;
