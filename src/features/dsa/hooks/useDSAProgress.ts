import { useContext } from 'react';
import { DSAProgressContext } from '../context/DSAProgressContext';

export function useDSAProgress(uid?: string) {
  const context = useContext(DSAProgressContext);
  if (!context) {
    throw new Error('useDSAProgress must be used within a DSAProgressProvider');
  }
  return context;
}
