// UTC midnight of "today in IST" — the project ships only to IST users, and
// the client picks dates in IST. Without this shift, expenses added between
// 00:00 and 05:30 IST land on the previous UTC day, so /expenses/today
// silently misses them while /expenses/by-date?date=<IST-today> finds them.
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
export const startOfToday = (): Date => {
  const istNow = new Date(Date.now() + IST_OFFSET_MS);
  return new Date(Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth(), istNow.getUTCDate()));
};

export const startOfTomorrow = (): Date => {
  const t = startOfToday();
  t.setUTCDate(t.getUTCDate() + 1);
  return t;
};

// Returns [gte, lt) for the given month/year (1-12, 4-digit year).
export const monthRange = (
  month: number | string,
  year: number | string,
): { gte: Date; lt: Date } => {
  const m = Number(month);
  const y = Number(year);
  return {
    gte: new Date(Date.UTC(y, m - 1, 1)),
    lt: new Date(Date.UTC(y, m, 1)),
  };
};

// Returns [gte, lt) for the calendar day of the given Date (UTC).
export const dayRange = (d: Date): { gte: Date; lt: Date } => {
  const gte = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const lt = new Date(gte);
  lt.setUTCDate(lt.getUTCDate() + 1);
  return { gte, lt };
};

// Legacy: dd-mm-yyyy string for any client/UI still expecting it.
export const getTodayDate = (): string => {
  const now = new Date();
  const date = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear());
  return `${date}-${month}-${year}`;
};
