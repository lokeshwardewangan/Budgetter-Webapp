// Single source of truth for tour-target DOM ids. Components annotate their
// JSX with these constants; tourSteps.ts builds selectors from the same set.
// Rename one place, both stay in sync.
export const TOUR_IDS = {
  // Header actions
  startTourButton: 'start_tour_guide',
  fullscreen: 'fullscreens_tour_guide',
  themeToggle: 'theme_change_tour',
  profile: 'profile_section',
  menuToggle: 'menu_toggle_button_section',
  // Sidebar
  sidebar: 'sidebar_section',
  logout: 'logout_section',
  // Dashboard
  filterReport: 'filter_report_section',
  summarizeBudget: 'summarize_budget_section',
  donutChartCategory: 'donut_chart_category_expense_section',
  intervalTimeExpense: 'interval_time_expense_insight_section',
  individualExpensesByCategory:
    'individual_expenses_by_category_insight_section',
  // Common
  currentPocketMoney: 'current_pocket_money_section',
  todayExpenses: 'today_expenses_show_section',
  exportExpenses: 'export_expenses_section',
  // Add expenses
  inputsAddExpense: 'inputs_for_add_expense_section',
  addNewExpense: 'add_new_expense_section',
  // Show expenses
  filterExpenses: 'filter_expenses_section',
  // Reports
  filterAllExpenses: 'filter_your_all_expense_section',
  allExpensesTable: 'all_expense_data_in_table_section',
  // Add pocket money
  inputsAddPocketMoney: 'inputs_add_pocket_money_section',
  pocketMoneyDetailsTable: 'pocket_money_details_table_section',
  // Lent money
  inputsLentMoney: 'inputs_lent_money_section',
  lentRecordsDetailsTable: 'lent_records_details_table_section',
  // Profile
  profilePicture: 'your_profile_picture_section',
  changeAvatar: 'change_your_avatar_section',
  membershipDetails: 'your_membership_and_last_active_details_section',
  updateBasicDetails: 'update_your_basic_deatils_section',
  spinWheel: 'fun_time_spin_wheel_section',
  accountAdvanceOptions: 'account_advance_options',
} as const;
