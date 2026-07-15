'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useAuth } from '../hooks';
import { registerSchema } from '../api';
import type { RegisterFormData, RegisterFormProps } from '../api';

export function RegisterForm({ redirectTo = '/dashboard' }: RegisterFormProps) {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError('');
    setIsSubmitting(true);

    const result = await registerUser(data.email, data.password, data.name);

    if (result.success) {
      router.push(redirectTo);
    } else {
      setError(result.error || 'Registration failed');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-xl border border-gray-200 shadow-lg">
      <div className="text-center mb-8">
        <Link href="/" className="text-2xl font-bold text-sky-500">
          Quizlet
        </Link>
        <h1 className="text-2xl font-bold mt-6">Create your account</h1>
        <p className="text-gray-500 mt-2">
          Start learning today
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Your name"
            {...registerField('name')}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...registerField('email')}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...registerField('password')}
              disabled={isSubmitting}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create account'
          )}
        </Button>
      </form>

      <p className="mt-4 text-xs text-gray-500 text-center">
        By creating an account, you agree to our Terms of Service and Privacy Policy.
      </p>

      <div className="mt-6 text-center text-sm">
        <span className="text-gray-500">
          Already have an account?{' '}
        </span>
        <Link href="/login" className="text-sky-500 hover:underline font-medium">
          Sign in
        </Link>
      </div>
    </div>
  );
}
