// One source of truth for per-category visualisation colours. The donut
// chart uses the gradient pairs; the legend swatch uses the CSS gradient
// string. Both kept aligned to the order in `expensesCategories`.

export const categoryColorList = [
  { category: 'Groceries',           hex: 0xff6347, gradient: 'linear-gradient(to right, #FF6347, #FF4500)', stops: [0xff6347, 0xff4500] },
  { category: 'Housing & Utilities', hex: 0xffa500, gradient: 'linear-gradient(to right, #FFA500, #FF8C00)', stops: [0xffa500, 0xff8c00] },
  { category: 'Medical',             hex: 0x4682b4, gradient: 'linear-gradient(to right, #4682B4, #5F9EA0)', stops: [0x4682b4, 0x5f9ea0] },
  { category: 'Food',                hex: 0x6a5acd, gradient: 'linear-gradient(to right, #6A5ACD, #483D8B)', stops: [0x6a5acd, 0x483d8b] },
  { category: 'Personal',            hex: 0x32cd32, gradient: 'linear-gradient(to right, #32CD32, #228B22)', stops: [0x32cd32, 0x228b22] },
  { category: 'Educational',         hex: 0xffd700, gradient: 'linear-gradient(to right, #FFD700, #FFC200)', stops: [0xffd700, 0xffc200] },
  { category: 'Transportation',      hex: 0xff1493, gradient: 'linear-gradient(to right, #FF1493, #C71585)', stops: [0xff1493, 0xc71585] },
  { category: 'Miscellaneous',       hex: 0x8a2be2, gradient: 'linear-gradient(to right, #8A2BE2, #6A0DAD)', stops: [0x8a2be2, 0x6a0dad] },
] as const;

// Lookup helper for the donut chart gradient adapter.
export const categoryGradientStops: Record<string, readonly number[]> = Object.fromEntries(
  categoryColorList.map((c) => [c.category, c.stops]),
);
