
import { Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/landing/logo';
import LoginPageContent from './login-page-content';


export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary p-4">
        <div className="absolute top-8 left-8">
            <Logo />
        </div>
        <Suspense fallback={
          <div className="w-full max-w-sm mx-4">
            <Card className="h-[480px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </Card>
          </div>
        }>
            <LoginPageContent />
        </Suspense>
    </div>
  );
}
