'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { forgotPasswordSchema } from '../schemas/auth.schema';
import type { ForgotPasswordFormData } from '../types';

export function ForgotPasswordForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    // TODO: Call API to send reset email
    console.log('Forgot password:', data);
    // For now, just redirect to login
    router.push('/login');
  };

  if (isSubmitSuccessful) {
    return (
      <div className="w-full max-w-md p-8 bg-white rounded-xl border border-gray-200 shadow-lg">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-sky-500">
            Quizlet
          </Link>
          <h1 className="text-2xl font-bold mt-6">Check your email</h1>
          <p className="text-gray-500 mt-2">
            We sent a password reset link to your email.
          </p>
        </div>

        <div className="text-center">
          <Link href="/login" className="text-sky-500 hover:underline font-medium">
            Back to sign in
          </Link>
        </div>
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
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register('email')}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            'Send reset link'
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <Link href="/login" className="text-gray-500 hover:underline">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
