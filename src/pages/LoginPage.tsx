import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaGoogle, FaLock, FaUserShield } from 'react-icons/fa';
import { Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearAuthError, loginUser, loginWithGoogleUser, signupUser } from '../features/auth/authSlice';

type AuthFormValues = {
  email: string;
  password: string;
};

const getFriendlyAuthMessage = (message: string) => {
  if (message.includes('auth/invalid-credential')) {
    return 'Invalid email or password. Please try again.';
  }

  if (message.includes('auth/email-already-in-use')) {
    return 'This email is already registered. Please sign in instead.';
  }

  if (message.includes('auth/weak-password')) {
    return 'Password is too weak. Use at least 6 characters.';
  }

  if (message.includes('auth/popup-closed-by-user')) {
    return 'Google sign-in popup was closed before completion.';
  }

  return message;
};

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<AuthFormValues>({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleAuthSubmit = async (values: AuthFormValues) => {
    dispatch(clearAuthError());

    try {
      if (isSignupMode) {
        await dispatch(signupUser(values)).unwrap();
        toast.success('Account created successfully.');
        return;
      }

      await dispatch(loginUser(values)).unwrap();
      toast.success('Login successful.');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(getFriendlyAuthMessage(message));
    }
  };

  const handleGoogleSignin = async () => {
    dispatch(clearAuthError());
    try {
      await dispatch(loginWithGoogleUser()).unwrap();
      toast.success('Signed in with Google successfully.');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(getFriendlyAuthMessage(message));
    }
  };

  const handleToggleAuthMode = () => {
    dispatch(clearAuthError());
    reset();
    setIsSignupMode((previousMode) => !previousMode);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((previousState) => !previousState);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-100 via-sky-50 to-indigo-100 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/95 p-7 shadow-xl backdrop-blur-sm">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
          <FaUserShield className="text-[11px]" />
          MedCore Secure Access
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {isSignupMode ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {isSignupMode
            ? 'Sign up with your clinic email to access the dashboard.'
            : 'Sign in to continue to MedCore SaaS dashboard.'}
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(handleAuthSubmit)}>
          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required.',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address.'
                }
              })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-500 transition focus:ring"
              placeholder="doctor@clinic.com"
              aria-label="Email address"
            />
            {errors.email && <p className="text-xs text-rose-600">{errors.email.message}</p>}
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Password is required.',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters long.'
                  }
                })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-22 text-sm outline-none ring-sky-500 transition focus:ring"
                placeholder="••••••••"
                aria-label="Password"
              />
              <div className="absolute inset-y-0 right-3 flex items-center gap-2">
                <FaLock className="text-slate-400" />
                <button
                  type="button"
                  onClick={handleTogglePasswordVisibility}
                  className="text-slate-500 transition hover:text-sky-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>
            {errors.password && <p className="text-xs text-rose-600">{errors.password.message}</p>}
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Please wait...' : isSignupMode ? 'Sign Up' : 'Sign In'}
          </button>

          <button
            type="button"
            onClick={handleGoogleSignin}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
            aria-label="Continue with Google"
          >
            <FaGoogle />
            Continue with Google
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          {isSignupMode ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={handleToggleAuthMode}
            className="font-semibold text-sky-700 hover:text-sky-600"
            aria-label={isSignupMode ? 'Switch to sign in' : 'Switch to sign up'}
          >
            {isSignupMode ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
