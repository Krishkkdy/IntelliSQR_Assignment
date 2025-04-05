import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { loginSchema, type LoginFormData } from '../schemas/login.schema';
import { loginUser } from '../services/auth.service';

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onError: (error: Error) => {
      console.error('Login failed:', error);
      // Handle error (e.g., show toast notification)
    },
    onSuccess: (data) => {
      // Store token in localStorage or secure storage
      localStorage.setItem('token', data.token);
      // Handle successful login (e.g., redirect)
      console.log('Login successful', data);
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-xs space-y-6">
        <h2 className="text-2xl font-semibold text-center">Welcome back!</h2>

        {loginMutation.error && (
          <div className="p-2 text-sm text-red-600 bg-red-50 rounded-md">
            {loginMutation.error.message || 'An error occurred during login'}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register('email')}
            type="text"
            placeholder="UID"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}

          <input
            {...register('password')}
            type="password"
            placeholder="Password"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || loginMutation.isPending}
            className="w-full py-2 rounded-md text-white bg-[#2c3e73] hover:bg-[#1f2c56] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loginMutation.isPending ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
