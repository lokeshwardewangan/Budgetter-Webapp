import {
  HandCoins,
  CirclePlus,
  Receipt,
  ChartPie,
  LayoutDashboard,
  PiggyBank,
} from 'lucide-react';

export type userSidenavbarListType = {
  route: string;
  name: string;
  icon: React.ElementType;
};

export const userSidenavbarList: userSidenavbarListType[] = [
  {
    route: 'user/dashboard',
    name: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    route: 'user/add-expenses',
    name: 'Add Expense',
    icon: CirclePlus,
  },
  {
    route: 'user/show-expenses',
    name: 'All Expenses',
    icon: Receipt,
  },
  {
    route: 'user/reports',
    name: 'Reports',
    icon: ChartPie,
  },
  {
    route: 'user/add-money',
    name: 'Add Pocket Money',
    icon: PiggyBank,
  },
  {
    route: 'user/add-lent-money',
    name: 'Lent Money',
    icon: HandCoins,
  },
];
