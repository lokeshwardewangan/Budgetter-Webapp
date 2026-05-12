import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { FormField } from '@/shared/components/form/FormField';
import { SubmitButton } from '@/shared/components/form/SubmitButton';
import { forgotPasswordSchema, type ForgotPasswordInput } from '../schemas';
import { useForgotPassword } from '../hooks';

export default function ForgotPasswordForm() {
  const { mutateAsync: sendResetLink, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onTouched',
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    await toast.promise(sendResetLink(values), {
      loading: 'Sending reset link...',
      success: 'Reset link sent. Please check your email.',
      error: 'Email does not exist.',
    });
    reset();
  });

  return (
    <div className="w-full max-w-full rounded-lg bg-white p-8 shadow-lg">
      <h1 className="mb-2 text-center text-2xl font-bold tracking-tighter text-gray-800">
        Forgot Password
      </h1>
      <p className="mb-6 text-center text-gray-600">
        Enter your email address and we'll send you a link to reset your
        password.
      </p>

      <form onSubmit={onSubmit} noValidate>
        <FormField
          {...register('email')}
          type="email"
          placeholder="Email address"
          autoComplete="email"
          error={errors.email?.message}
        />

        <SubmitButton isLoading={isPending}>Send Reset Link</SubmitButton>

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
