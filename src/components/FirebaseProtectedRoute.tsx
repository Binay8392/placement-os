import { Navigate } from 'react-router-dom';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { Loader2 } from 'lucide-react';

interface FirebaseProtectedRouteProps {
  children: React.ReactNode;
}

export function FirebaseProtectedRoute({ children }: FirebaseProtectedRouteProps) {
  const { user, loading } = useFirebaseAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
