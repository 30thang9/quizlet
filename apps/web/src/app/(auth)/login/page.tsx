// app/(auth)/login/page.tsx - Routing only
import { LoginForm } from '@/features/auth/components';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <LoginForm />
    </div>
  );
}
