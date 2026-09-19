import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, MailCheck, RefreshCw, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/Logo';
import { useToast } from '@/hooks/use-toast';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { getFirebaseErrorMessage } from '@/lib/firebaseErrors';

const COOLDOWN_SECONDS = 60;

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading, needsEmailVerification, sendVerificationEmail, reloadUser, signOut } = useFirebaseAuth();

  const [cooldown, setCooldown] = useState(COOLDOWN_SECONDS);
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) navigate('/auth', { replace: true });
    else if (!needsEmailVerification) navigate('/', { replace: true });
  }, [user, loading, needsEmailVerification, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => window.clearInterval(id);
  }, [cooldown]);

  const handleResend = async () => {
    setResending(true);
    const { error } = await sendVerificationEmail();
    setResending(false);
    if (error) {
      toast({ title: 'Could not send email', description: getFirebaseErrorMessage(error), variant: 'destructive' });
      return;
    }
    setCooldown(COOLDOWN_SECONDS);
    toast({ title: 'Verification email sent', description: 'Check your inbox (and spam folder).' });
  };

  const handleCheck = async () => {
    setChecking(true);
    try {
      const verified = await reloadUser();
      if (verified) {
        toast({ title: 'Email verified', description: 'Welcome to PrepTrack OS!' });
        navigate('/', { replace: true });
      } else {
        toast({
          title: 'Not verified yet',
          description: 'Your email is not verified yet. Please check your inbox.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({ title: 'Check failed', description: getFirebaseErrorMessage(error), variant: 'destructive' });
    } finally {
      setChecking(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>

        <Card className="border-border/70">
          <CardHeader className="items-center space-y-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <MailCheck className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-xl sm:text-2xl">Verify your email</CardTitle>
            <CardDescription className="text-sm">
              We've sent a verification link to your email address.
              <span className="mt-1 block break-all font-medium text-foreground">{user.email}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            <Button className="w-full" onClick={handleCheck} disabled={checking}>
              {checking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              I've verified my email
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleResend}
              disabled={resending || cooldown > 0}
            >
              {resending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              {cooldown > 0 ? `Resend verification email (${cooldown}s)` : 'Resend verification email'}
            </Button>

            <p className="text-center text-xs leading-relaxed text-muted-foreground">
              Didn't get it? Check your spam folder. Verification links expire after a while — just resend a new one.
            </p>

            <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => void signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
