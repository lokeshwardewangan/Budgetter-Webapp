import ProfileForm from '@/features/profile/components/ProfileForm';
import AvatarSection from '@/features/profile/components/AvatarSection';
import AdvancedOptions from '@/features/profile/components/AdvancedOptions';
import { useMe } from '@/features/user/hooks';

export default function ProfilePage() {
  const { data: user } = useMe();

  return (
    <div className="profile_page_ page_height_without_header flex h-full w-full flex-col items-start justify-start gap-4">
      <div className="heading_dashboard_page flex w-full items-start justify-start">
        <h3 className="text-left text-lg font-semibold">
          <span className="font-bold text-text_heading_light dark:text-text_primary_dark">
            Welcome! {user?.name ?? ''}
          </span>
        </h3>
      </div>
      <div className="profile_content_container col-span-12 grid h-full w-full max-w-full grid-cols-12 gap-4 rounded-md">
        <div className="col-span-12 flex h-full flex-col items-center justify-between space-y-4 rounded-lg bg-bg_primary_light p-6 shadow-sm dark:bg-bg_primary_dark lg:col-span-4 lg:p-7">
          <AvatarSection
            name={user?.name ?? ''}
            avatarUrl={user?.avatar ?? ''}
            memberSince={user?.createdAt}
            lastLogin={user?.lastLogin}
          />
          <div id="account_advance_options" className="advance_option_container">
            <AdvancedOptions />
          </div>
        </div>
        <ProfileForm />
      </div>
    </div>
  );
}
