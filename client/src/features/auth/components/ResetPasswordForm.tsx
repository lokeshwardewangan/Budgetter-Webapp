import { Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { PasswordInput } from '@/shared/components/form/PasswordInput';
import { SubmitButton } from '@/shared/components/form/SubmitButton';
import { resetPasswordSchema, type ResetPasswordInput } from '../schemas';
import { useResetPassword } from '../hooks';

export default function ResetPasswordForm() {
  const location = useLocation();
  const { mutateAsync: resetPassword, isPending } = useResetPassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onTouched',
    defaultValues: { password: '', confirm_password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    // URL is /reset-password/:userId — pull it from the path.
    const userId = location.pathname.split('/')[2];
    await toast.promise(
      resetPassword({ userId, newPassword: values.password }),
      {
        loading: 'Resetting password...',
        success: 'Password changed successfully!',
        error: 'Something went wrong.',
      }
    );
    reset();
  });

  return (
    <div className="w-full max-w-full rounded-lg bg-white p-8 shadow-lg">
      <h1 className="mb-2 text-center text-2xl font-bold tracking-tighter text-gray-800">
        Reset Your Password
      </h1>
      <p className="mb-6 text-center text-gray-600">
        Enter a new password and confirm it to reset your password.
      </p>

      <form onSubmit={onSubmit} noValidate>
        <PasswordInput
          {...register('password')}
          placeholder="Enter New Password"
          autoComplete="new-password"
          error={errors.password?.message}
        />
        <PasswordInput
          {...register('confirm_password')}
          placeholder="Confirm New Password"
          autoComplete="new-password"
          error={errors.confirm_password?.message}
        />

        <SubmitButton isLoading={isPending}>Reset Password</SubmitButton>

        <div className="my-2 text-center font-bold text-slate-500">Or</div>
        <div className="flex flex-col justify-center gap-4">
          <Link
            to="/login"
            className="w-full rounded-md bg-gray-200 px-4 py-2 text-center font-semibold text-gray-800 shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}
