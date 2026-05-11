import { type ChangeEvent } from 'react';
import { Camera, Loader2, Calendar, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import { useUpdateAvatar } from '../hooks';

type Props = {
  name: string;
  avatarUrl: string;
  memberSince?: string;
  lastLogin?: string | Date;
};

const formatDate = (d?: string | Date) =>
  d ? new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

export default function AvatarSection({ name, avatarUrl, memberSince, lastLogin }: Props) {
  const { mutateAsync: upload, isPending } = useUpdateAvatar();

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    const formData = new FormData();
    formData.append('avatar', file);
    await toast.promise(upload(formData), {
      loading: 'Uploading avatar...',
      success: 'Avatar updated!',
      error: 'Avatar upload failed.',
    });
  };

  return (
    <div
      id="your_profile_picture_section"
      className="basic_user_profile_details flex flex-col items-center space-y-4 shadow-sm"
    >
      <Avatar className="h-24 w-24 shadow-sm sm:h-32 sm:w-32">
        <AvatarImage src={avatarUrl} alt="Profile" />
        <AvatarFallback>{name?.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>

      <Button
        variant="outline"
        size="sm"
        disabled={isPending}
        id="change_your_avatar_section"
        className="relative w-40 overflow-hidden bg-transparent"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please Wait
          </>
        ) : (
          <>
            <Camera className="mr-2 h-4 w-4 cursor-pointer" />
            <span className="cursor-pointer">Change Image</span>
          </>
        )}
        <Input
          type="file"
          className="absolute inset-0 cursor-pointer opacity-0"
          onChange={onChange}
          accept="image/*"
        />
      </Button>

      <div className="information_details_user flex w-fit flex-col items-start justify-center space-y-1 rounded-lg">
        {memberSince && (
          <InfoRow icon={<Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />} label="Member Since" value={formatDate(memberSince)} tint="blue" />
        )}
        {lastLogin && (
          <InfoRow icon={<Clock className="h-4 w-4 text-green-600 dark:text-green-400" />} label="Last Active" value={formatDate(lastLogin)} tint="green" />
        )}
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  tint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tint: 'blue' | 'green';
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-white shadow-sm dark:bg-bg_primary_dark">
      <div className="flex items-center gap-2">
        <div className={`rounded-full p-2 ${tint === 'blue' ? 'bg-blue-100/50 dark:bg-blue-900/20' : 'bg-green-100/50 dark:bg-green-900/20'}`}>
          {icon}
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      </div>
      <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{value}</span>
    </div>
  );
}
