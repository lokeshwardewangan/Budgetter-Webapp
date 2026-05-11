// Central factory for every TanStack Query key in the app.
// Co-locating keys here prevents the "scattered string literal" problem and
// gives us cheap, type-safe invalidation patterns:
//
//   queryClient.invalidateQueries({ queryKey: qk.expenses.all });   // all expense queries
//   queryClient.invalidateQueries({ queryKey: qk.expenses.today() }); // just today
//
// Use array prefixes to enable bulk invalidation by domain.

// `page` deliberately omitted — paged queries use useInfiniteQuery and the
// key represents the whole filter set, not a single page within it.
export type ExpenseFilters = {
  limit?: number;
  month?: string;
  year?: string;
  search?: string;
  category?: string;
};

export const qk = {
  me: ['me'] as const,
  meVerified: ['me', 'verified'] as const,

  pocketMoney: {
    all: ['pocket-money'] as const,
  },

  lentMoney: {
    all: ['lent-money'] as const,
  },

  expenses: {
    all: ['expenses'] as const,
    today: () => ['expenses', 'today'] as const,
    list: () => ['expenses', 'list'] as const,
    byDate: (date: string) => ['expenses', 'byDate', date] as const,
    paged: (filters: ExpenseFilters) => ['expenses', 'paged', filters] as const,
  },

  sessions: {
    all: ['sessions'] as const,
  },

  reports: {
    monthly: (month: string, year: string) =>
      ['reports', 'monthly', month, year] as const,
  },

  admin: {
    users: ['admin', 'users'] as const,
  },
} as const;
