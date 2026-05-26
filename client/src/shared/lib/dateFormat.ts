// Reusable date formatters. All output is rendered in IST (Asia/Kolkata)
// regardless of the user's browser timezone — backend stores everything as
// UTC, and we want consistent display for all users in India.

import { formatDistanceToNow, isValid, parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

const IST = 'Asia/Kolkata';
type DateInput = string | number | Date | null | undefined;

const toDate = (input: DateInput): Date | null => {
  if (input == null || input === '') return null;
  const d =
    input instanceof Date
      ? input
      : typeof input === 'string'
        ? parseISO(input)
        : new Date(input);
  return isValid(d) ? d : null;
};

// "25 Feb 2025"
export const formatDateIST = (input: DateInput): string => {
  const d = toDate(input);
  return d ? formatInTimeZone(d, IST, 'dd MMM yyyy') : '';
};

// "09:30 PM"
export const formatTimeIST = (input: DateInput): string => {
  const d = toDate(input);
  return d ? formatInTimeZone(d, IST, 'hh:mm a') : '';
};

// "25 Feb 2025, 09:30 PM"
export const formatDateTimeIST = (input: DateInput): string => {
  const d = toDate(input);
  return d ? formatInTimeZone(d, IST, 'dd MMM yyyy, hh:mm a') : '';
};

// "2 hours ago", "yesterday", etc. Timezone-agnostic by nature.
export const formatRelative = (input: DateInput): string => {
  const d = toDate(input);
  return d ? formatDistanceToNow(d, { addSuffix: true }) : '';
};

// "25-02-2025" — for legacy callers that need dd-mm-yyyy.
export const formatDateDDMMYYYY = (input: DateInput): string => {
  const d = toDate(input);
  return d ? formatInTimeZone(d, IST, 'dd-MM-yyyy') : '';
};

// Alias kept for clarity when used in column headers labeled "Time".
export { formatTimeIST as formatTime };
