import { TOUR_IDS } from './tourIds';

// Subset of TourGuideStep we actually use. Avoids dragging the library's
// runtime class into the data layer; the provider hands these to setOptions().
export type TourStep = {
  title?: string;
  content: string;
  target?: string;
  order?: number;
};

const sel = (id: string) => `#${id}`;

const welcome: TourStep = {
  title: '🎉 Welcome to Budgetter',
  content:
    'Your personal finance manager that makes budgeting simple and smart. Let me show you around.',
};

const headerAndSidebarSteps: TourStep[] = [
  {
    title: 'Sidebar Navigation',
    content: 'Access all your tools and pages from here.',
    target: sel(TOUR_IDS.sidebar),
  },
  {
    title: 'Theme',
    content: 'Switch between light and dark mode.',
    target: sel(TOUR_IDS.themeToggle),
  },
  {
    title: 'Fullscreen',
    content: 'Maximise the workspace when you need focus.',
    target: sel(TOUR_IDS.fullscreen),
  },
  {
    title: 'Profile',
    content: 'Manage your account, avatar, and preferences.',
    target: sel(TOUR_IDS.profile),
  },
  {
    title: 'Logout',
    content: "Securely end your session when you're done.",
    target: sel(TOUR_IDS.logout),
  },
];

const dashboardSteps: TourStep[] = [
  {
    title: 'Report Filters',
    content: 'Filter your monthly summary by month or year.',
    target: sel(TOUR_IDS.filterReport),
  },
  {
    title: 'Budget Summary',
    content:
      'Income, expenses, lent money, and remaining balance — all at a glance.',
    target: sel(TOUR_IDS.summarizeBudget),
  },
  {
    title: 'Expense Categories',
    content: 'Visualise where your money goes by category.',
    target: sel(TOUR_IDS.donutChartCategory),
  },
  {
    title: 'Time-based Analysis',
    content: 'Track your spending trends across days and weeks.',
    target: sel(TOUR_IDS.intervalTimeExpense),
  },
  {
    title: 'Category Breakdown',
    content: 'Drill into the transactions behind each category.',
    target: sel(TOUR_IDS.individualExpensesByCategory),
  },
];

const currentBalanceStep: TourStep = {
  title: 'Current Balance',
  content: 'Your available pocket money in real-time.',
  target: sel(TOUR_IDS.currentPocketMoney),
};

const todayAndExportSteps: TourStep[] = [
  {
    title: "Today's Expenses",
    content: 'Review what you spent today.',
    target: sel(TOUR_IDS.todayExpenses),
  },
  {
    title: 'Export',
    content: 'Download your expense report as a PDF.',
    target: sel(TOUR_IDS.exportExpenses),
  },
];

const addExpensesSteps: TourStep[] = [
  {
    title: 'New Expense',
    content: 'Fill in date, name, category, price, and an optional label.',
    target: sel(TOUR_IDS.inputsAddExpense),
  },
];

const showExpensesSteps: TourStep[] = [
  {
    title: 'Smart Filter',
    content: 'Find any expense by date, category, or amount.',
    target: sel(TOUR_IDS.filterExpenses),
  },
];

const reportsSteps: TourStep[] = [
  {
    title: 'Comprehensive Reports',
    content: 'See your full spending history with filtering.',
    target: sel(TOUR_IDS.filterAllExpenses),
  },
  {
    title: 'Transaction Table',
    content: 'Every expense in one organised table.',
    target: sel(TOUR_IDS.allExpensesTable),
  },
];

const addPocketMoneySteps: TourStep[] = [
  {
    title: 'Add Pocket Money',
    content: 'Record any new income or top-up here.',
    target: sel(TOUR_IDS.inputsAddPocketMoney),
  },
  {
    title: 'History',
    content: 'Every credit recorded over time.',
    target: sel(TOUR_IDS.pocketMoneyDetailsTable),
  },
];

const lentMoneySteps: TourStep[] = [
  {
    title: 'Record Lent Money',
    content: "Track money you've lent to friends or family.",
    target: sel(TOUR_IDS.inputsLentMoney),
  },
  {
    title: 'Lending History',
    content: 'Mark items as received once paid back.',
    target: sel(TOUR_IDS.lentRecordsDetailsTable),
  },
];

const profileSteps: TourStep[] = [
  {
    title: 'Profile Picture',
    content: 'Make the account yours with an avatar.',
    target: sel(TOUR_IDS.profilePicture),
  },
  {
    title: 'Change Avatar',
    content: 'Pick from a set of fun avatars.',
    target: sel(TOUR_IDS.changeAvatar),
  },
  {
    title: 'Membership',
    content: 'See your member status and last login.',
    target: sel(TOUR_IDS.membershipDetails),
  },
  {
    title: 'Personal Details',
    content: 'Update your name, email, and basics.',
    target: sel(TOUR_IDS.updateBasicDetails),
  },
  {
    title: 'Advanced',
    content: 'Account-level options, including secure deletion.',
    target: sel(TOUR_IDS.accountAdvanceOptions),
  },
];

const tourStepsByRoute: Record<string, TourStep[]> = {
  '/user/dashboard': [welcome, ...headerAndSidebarSteps, ...dashboardSteps],
  '/user/add-expenses': [
    currentBalanceStep,
    ...addExpensesSteps,
    ...todayAndExportSteps,
  ],
  '/user/show-expenses': [
    currentBalanceStep,
    ...showExpensesSteps,
    ...todayAndExportSteps,
  ],
  '/user/reports': reportsSteps,
  '/user/add-money': [currentBalanceStep, ...addPocketMoneySteps],
  '/user/add-lent-money': [currentBalanceStep, ...lentMoneySteps],
  '/user/profile': profileSteps,
};

export function getStepsForRoute(pathname: string): TourStep[] {
  return tourStepsByRoute[pathname] ?? [];
}
