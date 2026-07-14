// app/(auth)/forgot-password/page.tsx - Routing only
import { ForgotPasswordForm } from '@/features/auth/components';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ForgotPasswordForm />
    </div>
  );
}
