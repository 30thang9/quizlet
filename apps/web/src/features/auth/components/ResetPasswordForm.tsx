'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { resetPasswordSchema } from '../schemas/auth.schema';
import type { ResetPasswordFormData, ResetPasswordFormProps } from '../types';

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError('');

    // TODO: Call API to reset password
    console.log('Reset password with token:', token, 'password:', data.password);
    
    // For now, simulate success
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md p-8 bg-white rounded-xl border border-gray-200 shadow-lg text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Password reset!</h1>
        <p className="text-gray-500 mb-6">
          Your password has been successfully reset. You can now sign in with your new password.
        </p>
        <Link
          href="/login"
          className="inline-block px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 font-semibold"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-xl border border-gray-200 shadow-lg">
      <div className="text-center mb-8">
        <Link href="/" className="text-2xl font-bold text-sky-500">
          Quizlet
        </Link>
        <h1 className="text-2xl font-bold mt-6">Reset your password</h1>
        <p className="text-gray-500 mt-2">
          Create a new password for your account.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password')}
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

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('confirmPassword')}
              disabled={isSubmitting}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
          <p className="font-medium mb-1">Password requirements:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>At least 8 characters</li>
            <li>At least one uppercase letter</li>
            <li>At least one lowercase letter</li>
            <li>At least one number</li>
          </ul>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Resetting password...
            </>
          ) : (
            'Reset password'
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="text-gray-500 hover:text-gray-700"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}

export function InvalidTokenView() {
  return (
    <div className="w-full max-w-md p-8 bg-white rounded-xl border border-gray-200 shadow-lg text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <XCircle className="w-8 h-8 text-red-500" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Invalid reset link</h1>
      <p className="text-gray-500 mb-6">
        This password reset link is invalid or has expired.
      </p>
      <Link
        href="/forgot-password"
        className="inline-block px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 font-semibold"
      >
        Request new reset email
      </Link>
    </div>
  );
}

export function ResetPasswordLoading() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
      <p className="text-gray-500">Loading...</p>
    </div>
  );
}
