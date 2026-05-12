import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { FormField } from '@/shared/components/form/FormField';
import { PasswordInput } from '@/shared/components/form/PasswordInput';
import { SubmitButton } from '@/shared/components/form/SubmitButton';
import { loginSchema, type LoginInput } from '../schemas';
import { useLogin } from '../hooks';
import GoogleAuthButton from './GoogleAuthButton';

export default function LoginForm() {
  const { mutateAsync: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { emailOrUsername: '', password: '' },
  });

  const onSubmit = handleSubmit((values) => {
    // The server's loginSchema runs `.email()` on the email field as soon
    // as it's populated. Sending the same string in both keys would mean
    // username logins fail with "Invalid email format". Route the input
    // to whichever field actually matches.
    const looksLikeEmail = values.emailOrUsername.includes('@');
    const credentials = looksLikeEmail
      ? { email: values.emailOrUsername, password: values.password }
      : { username: values.emailOrUsername, password: values.password };
    return toast.promise(login(credentials), {
      loading: 'Logging in...',
      success: 'Successfully logged in!',
      error: 'Invalid credentials, please try again.',
    });
  });

  return (
    <div className="w-full max-w-full rounded-lg bg-white p-8 shadow-lg">
      <h1 className="mb-2 text-center text-2xl font-bold tracking-tighter text-gray-800">
        Log In
      </h1>
      <p className="mb-6 text-center text-gray-600">
        New to Budgetter?{' '}
        <Link to="/signup" className="text-blue-500 hover:underline">
          Sign up today.
        </Link>
      </p>

      <form onSubmit={onSubmit} noValidate>
        <FormField
          {...register('emailOrUsername')}
          placeholder="Username or Email"
          autoComplete="username"
          icon={<i className="ri-mail-line" />}
          error={errors.emailOrUsername?.message}
        />

        <PasswordInput
          {...register('password')}
          placeholder="Password"
          autoComplete="current-password"
          icon={<i className="ri-lock-line" />}
          error={errors.password?.message}
        />

        <div className="mb-6 flex items-center justify-between">
          <label className="flex items-center text-sm text-gray-600">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 select-none">Keep me logged in</span>
          </label>
          <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">
            Forgot password?
          </Link>
        </div>

        <SubmitButton isLoading={isPending}>Login</SubmitButton>

        <div className="my-2 text-center font-bold text-slate-500">Or</div>

        <div className="flex items-center justify-center gap-4">
          <GoogleAuthButton />
        </div>
      </form>
    </div>
  );
}
