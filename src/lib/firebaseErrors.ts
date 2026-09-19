export function getFirebaseErrorMessage(error: unknown): string {
  const err = error as { code?: string; message?: string };
  const code = err?.code ?? '';

  const map: Record<string, string> = {
    'auth/email-already-in-use': 'An account with this email already exists. Try signing in instead.',
    'auth/invalid-email': 'That email address looks invalid. Please check and try again.',
    'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
    'auth/missing-password': 'Please enter a password.',
    'auth/wrong-password': 'Incorrect email or password.',
    'auth/user-not-found': 'Incorrect email or password.',
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/too-many-requests': 'Too many attempts. Please wait a few minutes before trying again.',
    'auth/network-request-failed': 'Network error. Check your internet connection and try again.',
    'auth/expired-action-code': 'That verification link has expired. Please resend a new one.',
    'auth/invalid-action-code': 'That verification link is invalid or already used. Please resend a new one.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed before completing.',
    'auth/requires-recent-login': 'Please sign in again to continue.',
  };

  if (code && map[code]) return map[code];
  const message = err?.message ?? '';
  if (message) return message.replace('Firebase: ', '').replace(/\(auth\/[^)]+\)\.?/, '').trim() || 'Something went wrong.';
  return 'Something went wrong. Please try again.';
}
