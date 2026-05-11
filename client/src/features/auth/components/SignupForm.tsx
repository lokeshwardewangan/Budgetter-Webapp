import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { FormField } from '@/shared/components/form/FormField';
import { PasswordInput } from '@/shared/components/form/PasswordInput';
import { SubmitButton } from '@/shared/components/form/SubmitButton';
import { signupSchema, type SignupInput } from '../schemas';
import { useSignup } from '../hooks';
import GoogleAuthButton from './GoogleAuthButton';

export default function SignupForm() {
  const { mutateAsync: signup, isPending } = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: '', name: '', email: '', password: '' },
  });

  const onSubmit = handleSubmit((values) =>
    toast.promise(signup(values), {
      loading: 'Processing, sending verification email...',
      success: 'Account created successfully!',
      error: 'Something went wrong, please try again.',
    }),
  );

  return (
    <div className="w-full max-w-full rounded-lg bg-white p-8 shadow-lg">
      <h1 className="mb-2 text-center text-2xl font-bold tracking-tighter text-gray-800">
        Sign Up
      </h1>
      <p className="mb-6 text-center text-gray-600">
        Have an account?{' '}
        <Link to="/login" className="text-blue-500 hover:underline">
          Log in.
        </Link>
      </p>

      <form onSubmit={onSubmit} noValidate>
        <FormField
          {...register('username')}
          placeholder="Username"
          autoComplete="username"
          icon={<i className="ri-user-line" />}
          error={errors.username?.message}
        />
        <FormField
          {...register('name')}
          placeholder="Your Name"
          autoComplete="name"
          icon={<i className="ri-user-line" />}
          error={errors.name?.message}
        />
        <FormField
          {...register('email')}
          type="email"
          placeholder="Email address"
          autoComplete="email"
          icon={<i className="ri-mail-line" />}
          error={errors.email?.message}
        />
        <PasswordInput
          {...register('password')}
          placeholder="Password"
          autoComplete="new-password"
          icon={<i className="ri-lock-line" />}
          error={errors.password?.message}
        />

        <SubmitButton isLoading={isPending}>Signup</SubmitButton>

        <div className="my-2 text-center font-bold text-slate-500">Or</div>

        <div className="flex items-center justify-center gap-4">
          <GoogleAuthButton />
        </div>
      </form>
    </div>
  );
}
