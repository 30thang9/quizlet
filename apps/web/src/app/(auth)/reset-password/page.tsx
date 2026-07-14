'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ResetPasswordForm,
  InvalidTokenView,
  ResetPasswordLoading,
} from '@/features/auth/components';

// Routing logic: handles URL params
function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const [isInvalidToken, setIsInvalidToken] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const resetToken = searchParams.get('token');
    if (!resetToken) {
      setIsInvalidToken(true);
    } else {
      setToken(resetToken);
    }
  }, [searchParams]);

  if (isInvalidToken) {
    return <InvalidTokenView />;
  }

  if (!token) {
    return <ResetPasswordLoading />;
  }

  return <ResetPasswordForm token={token} />;
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Suspense fallback={<ResetPasswordLoading />}>
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}
