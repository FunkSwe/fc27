import { Suspense } from 'react';
import VerifyEmailContent from './VerifyEmail';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Verifying your email...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}