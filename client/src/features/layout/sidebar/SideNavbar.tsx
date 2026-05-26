import { Link, useLocation } from 'react-router-dom';
import { Loader2, LogOut } from 'lucide-react';
import LogoImage from '../../../../public/assets/logo/logo.png';
import { useLogout } from '@/features/auth/hooks';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import type { userSidenavbarListType } from '@/data/UserSideNavbarList';

type Props = {
  userSidenavbarList: userSidenavbarListType[];
};

// Match the previous chunkier sizing: h-11, text-base, size-5 icons, gap-3.
// `group-data-[collapsible=icon]:!size-11` keeps the icon-only state large
// enough to fill the 4.25rem column instead of shadcn's default 2rem.
const itemSizing =
  'h-11 px-3 py-2.5 gap-3 text-base font-medium [&>svg]:!size-5 group-data-[collapsible=icon]:!size-11 group-data-[collapsible=icon]:!p-2.5';

const itemActiveAndHover =
  'data-[active=true]:bg-gradient-to-r data-[active=true]:from-[#065f46]/80 data-[active=true]:via-[#047857]/80 data-[active=true]:to-[#059669]/80 data-[active=true]:text-white data-[active=true]:font-semibold hover:bg-[#059669]/30 dark:hover:bg-slate-700';

const itemClasses = `${itemSizing} ${itemActiveAndHover}`;

export default function SideNavbar({ userSidenavbarList }: Props) {
  const location = useLocation();
  const { setOpenMobile, isMobile } = useSidebar();
  const { mutateAsync: logout, isPending } = useLogout();

  return (
    <Sidebar collapsible="icon" className="font-karla">
      <SidebarHeader className="py-5">
        <Link
          to="/"
          onClick={() => isMobile && setOpenMobile(false)}
          className="flex items-center gap-2 pl-2.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:pl-0"
        >
          <img className="h-8 shrink-0" src={LogoImage} alt="logo" />
          <h1 className="overflow-hidden whitespace-nowrap bg-gradient-to-r from-[#2e7dff] to-[#00b87c] bg-clip-text text-2xl font-bold text-transparent transition-all duration-200 ease-linear group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0 dark:text-gray-200">
            Budgetter
          </h1>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="px-3">
          <SidebarMenu className="gap-2 sm:gap-3">
            {userSidenavbarList.map(({ route, name, icon: Icon }) => {
              const isActive = location.pathname === `/${route}`;
              return (
                <SidebarMenuItem key={route}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={name}
                    className={itemClasses}
                  >
                    <Link
                      to={`/${route}`}
                      onClick={() => isMobile && setOpenMobile(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="capitalize">{name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={isPending ? 'Signing out…' : 'Logout'}
              className={`${itemSizing} bg-gradient-to-r from-[#065f46]/80 via-[#047857]/80 to-[#059669]/80 text-white hover:bg-gradient-to-tr hover:text-white`}
              onClick={() => logout()}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <LogOut className="h-5 w-5" />
              )}
              <span>{isPending ? 'Signing out…' : 'Logout'}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
