import { useEffect } from 'react';
import { useForm, type UseFormRegisterReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useMe } from '@/features/user/hooks';
import {
  Briefcase,
  Calendar,
  Facebook,
  IndianRupee,
  Instagram,
  Loader2,
  Lock,
  Mail,
  Save,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useDialogState } from '@/shared/hooks/useDialogState';
import { updateProfileSchema, type UpdateProfileForm } from '../schemas';
import { useUpdateProfile } from '../hooks';

export default function ProfileForm() {
  const { data: user } = useMe();
  const { mutateAsync: save, isPending } = useUpdateProfile();
  const passwordSection = useDialogState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileForm>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: '',
      dob: '',
      profession: '',
      instagramLink: '',
      facebookLink: '',
      currentPassword: '',
      newPassword: '',
    },
  });

  // Hydrate form from Redux when user data lands or changes.
  useEffect(() => {
    if (!user) return;
    reset({
      name: user.name ?? '',
      dob: user.dob ?? '',
      profession: user.profession ?? '',
      instagramLink: user.instagramLink ?? '',
      facebookLink: user.facebookLink ?? '',
      currentPassword: '',
      newPassword: '',
    });
  }, [user, reset]);

  const onSubmit = handleSubmit(async (raw) => {
    await toast.promise(save(raw), {
      loading: 'Saving...',
      success: 'Profile updated!',
      error: 'Something went wrong.',
    });
    reset({ ...raw, currentPassword: '', newPassword: '' });
  });

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      id="update_your_basic_deatils_section"
      className="col-span-12 flex h-full w-full flex-col space-y-6 rounded-lg bg-bg_primary_light p-6 shadow-sm dark:bg-bg_primary_dark lg:col-span-8 lg:p-7 lg:pb-10"
    >
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
        <ReadOnlyRow icon={<User className="h-4 w-4 text-gray-400" />} label="Username" value={user?.username ?? ''} />
        <EditableField
          id="fullName"
          label="Full Name"
          icon={<User className="h-4 w-4 text-gray-400" />}
          field={register('name')}
          error={errors.name?.message}
        />
        <ReadOnlyRow icon={<Mail className="h-4 w-4 text-gray-400" />} label="Email" value={user?.email ?? ''} />
        <EditableField
          id="profession"
          label="Profession"
          icon={<Briefcase className="h-4 w-4 text-gray-400" />}
          field={register('profession')}
          error={errors.profession?.message}
        />
        <EditableField
          id="dateOfBirth"
          label="Date of Birth"
          type="date"
          icon={<Calendar className="h-4 w-4 text-gray-400" />}
          field={register('dob')}
          error={errors.dob?.message}
        />
        <ReadOnlyRow
          icon={<IndianRupee className="h-4 w-4 text-gray-400" />}
          label="Current Pocket Money"
          value={String(user?.currentPocketMoney ?? 0)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <EditableField
          id="instagramProfile"
          label="Instagram"
          icon={<Instagram className="h-4 w-4 text-gray-400" />}
          field={register('instagramLink')}
          error={errors.instagramLink?.message}
        />
        <EditableField
          id="facebookProfile"
          label="Facebook"
          icon={<Facebook className="h-4 w-4 text-gray-400" />}
          field={register('facebookLink')}
          error={errors.facebookLink?.message}
        />
      </div>

      <Collapsible open={passwordSection.isOpen} onOpenChange={passwordSection.setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button type="button" variant="outline" className="w-full">
            <Lock className="mr-2 h-4 w-4" />
            Change Password
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              {...register('currentPassword')}
              type="password"
              placeholder="Current Password"
              autoComplete="current-password"
            />
            <Input
              {...register('newPassword')}
              type="password"
              placeholder="New Password"
              autoComplete="new-password"
            />
          </div>
          {errors.newPassword?.message && (
            <span className="text-xs text-red-500">{errors.newPassword.message}</span>
          )}
        </CollapsibleContent>
      </Collapsible>

      <div className="button-container flex w-full items-end justify-end">
        <Button type="submit" disabled={isPending} className="mt-2 w-36 bg-green-600">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

type EditableFieldProps = {
  id: string;
  label: string;
  icon: React.ReactNode;
  field: UseFormRegisterReturn;
  error?: string;
  type?: string;
};

function EditableField({ id, label, icon, field, error, type = 'text' }: EditableFieldProps) {
  return (
    <div className="w-full space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>
        <Input id={id} type={type} className="w-full pl-10" {...field} />
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

function ReadOnlyRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="w-full space-y-2">
      <Label>{label}</Label>
      <div className="flex h-9 cursor-not-allowed items-center space-x-2 rounded bg-gray-100 p-2 dark:bg-bg_secondary_dark">
        {icon}
        <span className="text-sm">{value}</span>
      </div>
    </div>
  );
}
