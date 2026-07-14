// app/(auth)/register/page.tsx - Routing only
import { RegisterForm } from '@/features/auth/components';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <RegisterForm />
    </div>
  );
}
