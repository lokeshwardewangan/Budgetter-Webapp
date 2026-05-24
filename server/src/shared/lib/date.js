// UTC midnight to avoid TZ drift on day boundaries.
export const startOfToday = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
};

export const startOfTomorrow = () => {
  const t = startOfToday();
  t.setUTCDate(t.getUTCDate() + 1);
  return t;
};

// Returns [gte, lt) for the given month/year (1-12, 4-digit year).
export const monthRange = (month, year) => {
  const m = Number(month);
  const y = Number(year);
  return {
    gte: new Date(Date.UTC(y, m - 1, 1)),
    lt: new Date(Date.UTC(y, m, 1)),
  };
};

// Returns [gte, lt) for the calendar day of the given Date (UTC).
export const dayRange = (d) => {
  const gte = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const lt = new Date(gte);
  lt.setUTCDate(lt.getUTCDate() + 1);
  return { gte, lt };
};

// Legacy: dd-mm-yyyy string for any client/UI still expecting it.
export const getTodayDate = () => {
  const now = new Date();
  const date = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear());
  return `${date}-${month}-${year}`;
};
