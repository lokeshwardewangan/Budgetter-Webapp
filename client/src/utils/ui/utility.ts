// Category colors + category list moved to @/shared/lib/expenseCategories.ts.
// This file now only holds the user-defined label palette helpers.

const knownLabelColorStyleMap: Record<
  string,
  { color: string; backgroundColor: string; borderColor: string }
> = {
  market: {
    color: '#15803D',
    backgroundColor: '#DCFCE7',
    borderColor: '#15803D80',
  },
  health: {
    color: '#DC2626',
    backgroundColor: '#FEE2E2',
    borderColor: '#DC262680',
  },
  family: {
    color: '#2563EB',
    backgroundColor: '#DBEAFE',
    borderColor: '#2563EB80',
  },
  office: {
    color: '#CA8A04',
    backgroundColor: '#FEF9C3',
    borderColor: '#CA8A0480',
  },
  trip: {
    color: '#9333EA',
    backgroundColor: '#F3E8FF',
    borderColor: '#9333EA80',
  },
};

const fallbackLabelStylePalette = [
  { color: '#DB2777', backgroundColor: '#FCE7F3', borderColor: '#DB277780' },
  { color: '#4F46E5', backgroundColor: '#E0E7FF', borderColor: '#4F46E580' },
  { color: '#4B5563', backgroundColor: '#F9FAFB', borderColor: '#4B556380' },
];

export const getLabelColorStyle = (
  labelText: string = ''
): { color: string; backgroundColor: string; borderColor: string } => {
  const key = labelText.toLowerCase();
  if (knownLabelColorStyleMap[key]) return knownLabelColorStyleMap[key];
  const hash = [...key].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = Math.abs(hash) % fallbackLabelStylePalette.length;
  return fallbackLabelStylePalette[index];
};
