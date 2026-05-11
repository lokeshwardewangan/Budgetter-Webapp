import { GoogleLogin } from '@react-oauth/google';
import { Spinner } from '@/components/ui/spinner';
import { useGoogleSignIn } from '../hooks';

export default function GoogleAuthButton() {
  const { mutateAsync, isPending } = useGoogleSignIn();

  if (isPending) {
    return (
      <div className="flex h-[40px] w-full items-center justify-center gap-2 rounded border border-gray-300 bg-white text-slate-600">
        <Spinner className="h-4 w-4" />
        <span className="text-sm font-medium">Signing in...</span>
      </div>
    );
  }

  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        mutateAsync({ token: credentialResponse.credential || '' });
      }}
      onError={() => {
        console.error('Google sign-in error');
      }}
    />
  );
}
