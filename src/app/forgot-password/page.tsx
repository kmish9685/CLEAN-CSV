
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/landing/logo';
import ForgotPasswordForm from './forgot-password-form';

export default function ForgotPasswordPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-secondary p-4">
            <div className="absolute top-8 left-8">
                <Logo />
            </div>
            <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
                <ForgotPasswordForm />
            </Suspense>
        </div>
    );
}
